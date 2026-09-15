#!/usr/bin/env python3
"""w2-protocol 敏感信息审计：扫描「会入库」的文件（git tracked + untracked 非忽略）。

用法:
  python3 audit.py [--root ROOT] [--extra FILE.json] [--keep FILE.json] [--quiet]

缺省自动加载技能自带的本地词表（同目录 ../references/）：
  w2-extra.local.json  项目特有词表（真实城名/城 ID 段/人物名/坐标形态/活动专名/错误文案）
  w2-keep.local.json   已拍板保留项过滤（命中不计残留、单独复核）

两个词表均为 *.local.json（gitignore），换机器/新 clone 后需重建——重建方法见 SKILL.md。
显式传 --extra / --keep 可覆盖缺省路径。

退出码: 0 = 无疑似残留（保留项除外）；1 = 有残留需处置。
"""
import argparse
import json
import os
import re
import subprocess
import sys

CATS = {
    '实测日期': r'20\d{2}[-/.年]\d{1,2}[-/.月]\d{1,2}|\d{1,2}月\d{1,2}日|跨天|实测于',
    '产品名(URL编码)': r'(?:%[0-9A-Fa-f]{2}){4,}',
    '厂商域名': r'https?://[\w.-]+|[\w-]+\.(?:com|cn|net|org)(?![\w])',
    'UA指纹': r'CFNetwork|Darwin/\d',
    '凭据形态': r'ST-[0-9a-fA-F]{16,}|-----BEGIN [A-Z ]*PRIVATE KEY|[0-9a-fA-F]{48,}',
    '可滥用措辞': r'踢下线|挤掉|顶号|脱离客户端|不防重放|长期有效|凭空',
    '邮箱': r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
    '内网IP': r'\b(?:192\.168|10\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}\b',
    '手机号': r'(?<!\d)1[3-9]\d{9}(?!\d)',
    '个人路径': r'/home/[a-z]+|/Users/[a-zA-Z]+',
}

EMAIL_OK = re.compile(r'example|eslint|inkjs|npmjs|github|noreply|@types|apache|opensource')
VENDOR_OK = re.compile(r'(?:example\.com|localhost|github\.com|nodejs\.org|npmjs\.com|opensource\.org)')

VALUE_FILES = ['.identity.local.json', '.env']
VALUE_KEYS = ['userId', 'username', 'wst', 'installID', 'appKey', 'WTGT', 'gameHost',
              'serverName', 'serverId', 'password', 'email']
CACHE_GLOBS = ['.transport_route.local.json', '.train_state.local.json']

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_EXTRA = os.path.join(HERE, '..', 'references', 'w2-extra.local.json')
DEFAULT_KEEP = os.path.join(HERE, '..', 'references', 'w2-keep.local.json')
# 本脚本自身的正则定义必然命中自身的扫描规则（自引用误报）——跳过自身文件
SELF_PATH = os.path.abspath(__file__)


def run(args, cwd):
    return subprocess.run(args, capture_output=True, text=True, cwd=cwd).stdout


def git_files(root):
    tracked = set(run(['git', 'ls-files'], root).split())
    untracked = set(run(['git', 'ls-files', '--others', '--exclude-standard'], root).split())
    return sorted(tracked | untracked), tracked, untracked


def known_values(root):
    """从本地真值档提取具体值（值对照，比正则可靠）。"""
    vals = set()
    for name in VALUE_FILES:
        p = os.path.join(root, name)
        if not os.path.isfile(p):
            continue
        try:
            if name.endswith('.json'):
                data = json.load(open(p, encoding='utf-8'))
                for k in VALUE_KEYS:
                    v = data.get(k)
                    if v:
                        vals.add(str(v))
            else:
                for line in open(p, encoding='utf-8', errors='ignore'):
                    m = re.match(r'^\s*([A-Za-z0-9_]+)\s*=\s*(.+)$', line)
                    if m and m.group(2).strip():
                        vals.add(m.group(2).strip())
        except Exception:
            pass
    for name in CACHE_GLOBS:
        p = os.path.join(root, name)
        if not os.path.isfile(p):
            continue
        try:
            data = json.load(open(p, encoding='utf-8'))
        except Exception:
            continue
        fp = data.get('fingerprint')
        if isinstance(fp, dict):
            vals.update(str(k) for k in fp)
        for cl in data.get('clusters', []) or []:
            if isinstance(cl, (list, tuple)):
                vals.update(str(c) for c in cl)
        for v in (data.get('superHubs') or {}).values():
            vals.add(str(v))
    return sorted(v for v in vals if len(v) >= 5)


def load_json(path, label):
    if path and os.path.isfile(path):
        try:
            data = json.load(open(path, encoding='utf-8'))
            print(f'词表: {label} ← {path}')
            return data
        except Exception as e:
            print(f'词表: {label} 载入失败（{e}）——{path}')
    else:
        print(f'词表: {label} 缺失（{path}）——项目特有残留会漏检，报告时注明')
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', default='.')
    ap.add_argument('--extra', help='项目特定词表 JSON（缺省: references/w2-extra.local.json）')
    ap.add_argument('--keep', help='已拍板保留项 JSON（缺省: references/w2-keep.local.json）')
    ap.add_argument('--quiet', action='store_true')
    a = ap.parse_args()
    root = os.path.abspath(a.root)

    files, tracked, untracked = git_files(root)
    print(f'审计范围: {len(files)} 文件（tracked {len(tracked)} + 待提交 {len(untracked)}）')

    extra = load_json(a.extra or os.path.normpath(DEFAULT_EXTRA), 'extra 项目词表')
    keep = load_json(a.keep or os.path.normpath(DEFAULT_KEEP), 'keep 保留项')

    cats = dict(CATS)
    if extra:
        cats.update(extra)

    keep_entries = []
    if keep:
        for name, pat in keep.items():
            keep_entries.append((name, re.compile(pat)))

    def kept_by(line):
        for name, rx in keep_entries:
            if rx.search(line):
                return name
        return None

    keep_hits = {name: [] for name, _ in keep_entries}

    # 1. 值对照（最可靠）：本地真值档的值做字面搜索
    vals = known_values(root)
    vhits = []
    for v in vals:
        for rel in files:
            path = os.path.join(root, rel)
            if not os.path.isfile(path) or os.path.abspath(path) == SELF_PATH:
                continue
            try:
                content = open(path, encoding='utf-8', errors='ignore').read()
            except Exception:
                continue
            if v in content:
                for i, line in enumerate(content.split('\n'), 1):
                    if v in line:
                        k = kept_by(line)
                        rec = (rel, i, line.strip()[:140].replace(v, '***REDACTED***'))
                        (keep_hits[k] if k else vhits).append(rec)

    # 2. 分类扫描
    hits = {k: [] for k in cats}
    compiled = {k: re.compile(p) for k, p in cats.items()}
    for rel in files:
        path = os.path.join(root, rel)
        if not os.path.isfile(path) or os.path.abspath(path) == SELF_PATH:
            continue
        try:
            content = open(path, encoding='utf-8', errors='ignore').read()
        except Exception:
            continue
        for lineno, line in enumerate(content.split('\n'), 1):
            matched = [c for c, rx in compiled.items() if rx.search(line)]
            if not matched:
                continue
            if any(c == '邮箱' and EMAIL_OK.search(line) for c in matched):
                matched = [c for c in matched if c != '邮箱']
            if any(c == '厂商域名' and VENDOR_OK.search(line) for c in matched):
                matched = [c for c in matched if c != '厂商域名']
            if not matched:
                continue
            k = kept_by(line)
            rec = (rel, lineno, line.strip()[:140])
            if k:
                keep_hits[k].append(rec)
            else:
                for c in matched:
                    hits[c].append(rec)

    total = len(vhits) + sum(len(h) for h in hits.values())
    print('\n=== 疑似残留（须处置）===')
    order = list(cats) + ['已知真实值(本地档对照)']
    for cat in order:
        h = vhits if cat.startswith('已知真实值') else hits.get(cat, [])
        mark = 'OK ' if not h else '!! '
        print(f'\n[{mark}{cat}] {len(h)} 处')
        if h and not a.quiet:
            for rel, lineno, ctx in h[:30]:
                print(f'   {rel}:{lineno}: {ctx}')
            if len(h) > 30:
                print(f'   ... 共 {len(h)} 处')

    if keep_entries:
        print('\n=== 已拍板保留（复核，不计残留）===')
        for name, _ in keep_entries:
            h = keep_hits[name]
            print(f'   [{name}] {len(h)} 处')
            if h and not a.quiet:
                for rel, lineno, ctx in h[:8]:
                    print(f'      {rel}:{lineno}: {ctx[:120]}')

    print(f'\n疑似残留合计: {total}')
    return 1 if total else 0


if __name__ == '__main__':
    sys.exit(main())
