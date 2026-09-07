#!/bin/sh

# ============================================================
#  capture.sh - 移动端设备业务流量抓取 (OpenWrt / Debian 通用, POSIX sh)
#  用法: ./capture.sh <设备内网IP> [接口] [时长秒]
#  例  : ./capture.sh <设备IP>            # 自动探测接口, 抓 90s
#        ./capture.sh <设备IP> br0 120    # 指定接口 + 120s
#
#  心跳: 每 BEAT 秒打印 +Ns, 执行目标操作时记下当时的秒数
#        之后把 MARK=23 ./capture.sh ... 也一样, 只是记进 summary
# ============================================================

set -u

PHONE="${1:-}"
IFACE_ARG="${2:-}"
DUR="${3:-90}"
MARK="${MARK:-}"
BEAT="${BEAT:-5}"
OUT="${OUT:-/root/capture}"

die() { echo "!! $*" >&2; exit 1; }
[ -n "$PHONE" ] || { echo "用法: $0 <设备IP> [IFACE] [DURATION]"; exit 1; }
command -v tcpdump >/dev/null 2>&1 || die "缺 tcpdump: opkg install tcpdump (或 tcpdump-mini) / apt install tcpdump"

TS=$(date +%Y%m%d_%H%M%S)
mkdir -p "$OUT"
PCAP="$OUT/game_$TS.pcap"
CONN="$OUT/conntrack_$TS.txt"
SUM="$OUT/summary_$TS.txt"
: > "$CONN"

# ---------- 探测内网接口 ----------
detect_iface() {
    local i
    # 1) 路由反查目标 IP 的出接口
    i=$(ip route get "$PHONE" 2>/dev/null | sed -n 's/.*dev[ ]\{1,\}\([^ ]*\).*/\1/p' | head -1)
    [ -n "$i" ] && [ -d "/sys/class/net/$i" ] && { echo "$i"; return; }
    # 2) 常见 LAN 口
    for i in br-lan br0 lan br-lan.1 eth0.1 eth1; do
        [ -d "/sys/class/net/$i" ] && { echo "$i"; return; }
    done
    # 3) 第一个落在私网段的接口
    i=$(ip -o -4 addr show scope global 2>/dev/null | awk '{for(k=1;k<=NF;k++) if($k ~ /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/) {split($2,a,":"); print a[1]; exit}}')
    [ -n "$i" ] && { echo "$i"; return; }
    echo "any"
}

if [ -n "$IFACE_ARG" ]; then IFACE="$IFACE_ARG"; else IFACE=$(detect_iface); fi

CT="/proc/net/nf_conntrack"
[ -r "$CT" ] || CT="/proc/net/ip_conntrack"

echo "=============================================="
echo " 设备 IP  : $PHONE"
echo " 接口     : $IFACE"
echo " 时长     : ${DUR}s   (心跳每 ${BEAT}s)"
echo " 开始     : $(date +%H:%M:%S)"
echo " pcap     : $PCAP"
echo "=============================================="
echo " 时序: 静置 10s -> 执行目标操作记下 +Ns -> 成功提示后 +5s"
echo "=============================================="

echo "----- 预检: 设备 当前活动连接 -----"
if [ -r "$CT" ]; then
    N=$(grep "$PHONE" "$CT" 2>/dev/null | grep -c ESTABLISHED)
    grep "$PHONE" "$CT" 2>/dev/null | grep ESTABLISHED \
      | awk '{p="?";dp="?";for(k=1;k<=NF;k++){if($k=="tcp"||$k=="udp")p=$k; if(index($k,"dport=")==1){split($k,a,"=");dp=a[2]}}; print "  " p"/"dp}' \
      | sort | uniq -c | sort -nr
    echo "  ESTABLISHED 连接数: ${N:-0}"
    if [ "${N:-0}" -lt 1 ]; then
        echo "  !! 没有任何活动连接 —— 游戏大概率没在前台或已锁屏"
        echo "  !! 请确认: 游戏停在主界面 / 设备自动锁定设为「永不」"
    else
        grep "$PHONE" "$CT" 2>/dev/null | grep -q "dport=8083" \
          && echo "  OK: 8083 主逻辑连接存在, 可以开抓" \
          || echo "  !! 没有 8083 连接, 游戏可能还没进入主界面"
    fi
else
    echo "  (无 conntrack, 跳过预检)"
fi
echo "=============================================="

echo "----- 检查流卸载 flow offloading (头号杀手) -----"
if [ -r "$CT" ]; then
    OFFN=$(grep -c OFFLOAD "$CT" 2>/dev/null)
    if [ "${OFFN:-0}" -gt 0 ]; then
        echo "  !! 发现 ${OFFN} 条 [OFFLOAD] 连接"
        echo "  !! 被流量卸载的连接不走 netfilter/tcpdump —— 长连接的业务数据一个包都抓不到"
        echo "  !! 这解释了为什么「握手能抓到、数据抓不到」"
        echo "  !! 关闭后再抓:"
        echo "       uci set firewall.@defaults[0].flow_offloading=0"
        echo "       uci set firewall.@defaults[0].flow_offloading_hw=0"
        echo "       uci commit firewall && service firewall restart"
        echo "       (硬件卸载/SFE/Shortcut-FE 需另关, 见 README)"
    else
        echo "  OK: 未发现 offload 连接"
    fi
fi
lsmod 2>/dev/null | grep -iE 'offload|shortcut|sfe|fastnat|hw_nat' | awk '{print "  模块: "$1}'
echo "=============================================="

tcpdump -i "$IFACE" -nn -s 0 -w "$PCAP" "host $PHONE" >/dev/null 2>&1 &
TPID=$!

( while :; do
    T=$(date +%H:%M:%S)
    grep "$PHONE" "$CT" 2>/dev/null | sed "s|^|$T |" >> "$CONN"
    sleep 2
  done ) &
CPID=$!

trap 'kill "$TPID" 2>/dev/null; kill "$CPID" 2>/dev/null; exit 130' INT TERM

sleep 1
[ -d "/proc/$TPID" ] || { kill "$CPID" 2>/dev/null; die "tcpdump 起不来, 显式给接口试试: $0 $PHONE br-lan"; }

MARKS="$OUT/marks_$TS.txt"
: > "$MARKS"
READT=0
if read -t 1 _x 2>/dev/null < /dev/null; then READT=1; fi

i=0
N=0
[ "$READT" = "1" ] && echo "  >>> 每做一个动作就【按一次回车】打点，编号会递增，事后按编号告诉我动作 <<<"
while [ "$i" -lt "$DUR" ]; do
    if [ "$READT" = "1" ]; then
        if read -t 1 _m 2>/dev/null; then
            N=$((N + 1))
            printf "  [打点#%d] +%ss  %s\n" "$N" "$i" "$(date +%H:%M:%S)"
            printf "#%-2d +%ss  %s\n" "$N" "$i" "$(date +%H:%M:%S)" >> "$MARKS"
            continue
        fi
    else
        sleep 1
    fi
    i=$((i + 1))
    if [ $((i % BEAT)) -eq 0 ]; then
        printf "  +%ss   %s\n" "$i" "$(date +%H:%M:%S)"
    fi
done

kill "$TPID" 2>/dev/null
kill "$CPID" 2>/dev/null
wait 2>/dev/null
sleep 3

# ---------- 生成 summary ----------
{
echo "===== ww2 capture summary ====="
echo "设备   : $PHONE"
echo "iface    : $IFACE"
echo "started  : $TS   duration: ${DUR}s"
echo "mark     : 点击发生在 +${MARK:-未记录}s"
echo "pcap     : $PCAP  ($(wc -c < "$PCAP" 2>/dev/null | tr -d ' ') bytes)"
echo

echo "----- 1. conntrack: 协议/目标端口分布 -----"
if [ -s "$CONN" ]; then
    awk '
    {
      proto="?"; dp="?"
      for(k=1;k<=NF;k++){
        if($k=="tcp"||$k=="udp"||$k=="icmp") proto=$k
        if(index($k,"dport=")==1){ n=split($k,a,"="); dp=a[2] }
      }
      c[proto"/"dp]++
    }
    END{ for(x in c) printf "  %-14s %s\n", x, c[x] }' "$CONN" | sort -k2 -nr
else
    echo "  (无 conntrack 数据, 可能内核未开模块)"
fi
echo

echo "----- 2. pcap: 会话分布 (top 25) -----"
if [ -s "$PCAP" ]; then
    tcpdump -nn -r "$PCAP" 2>/dev/null | awk '
    {
      proto=$2; s=$3; d=$5; sub(/:$/,"",d)
      n=split(s,A,"."); sp=A[n]; n2=split(d,B,"."); dp=B[n2]
      # 外部对端 = 不是 设备 的那一侧
      if (index(s,"'"$PHONE"'.")==1) { key=proto"  ->  "d; }
      else { key=proto"  <-  "s; }
      c[key]++
    }
    END{ for(x in c) printf "  %6s  %s\n", c[x], x }' | sort -k1 -nr | head -25
    echo
    echo "----- 3. 协议分布 -----"
    tcpdump -nn -r "$PCAP" 2>/dev/null | awk '{c[$2]++} END{for(x in c) printf "  %-10s %s\n", x, c[x]}' | sort -k2 -nr
    echo
    echo "----- 4. DNS 查询 (去重) -----"
    tcpdump -nn -r "$PCAP" 'udp port 53' 2>/dev/null \
      | grep -aoE '(A\?|AAAA\?|HTTPS\?) [^ ]+' | sort -u | head -40 || echo "  (无)"
    echo
    echo "----- 5. 疑似明文 HTTP -----"
    tcpdump -A -nn -r "$PCAP" 2>/dev/null \
      | grep -aoE '(GET|POST|PUT|HEAD|DELETE|OPTIONS) [^ ]+ HTTP/1\.[01]|HTTP/1\.[01] [0-9]{3}[^\r]*' \
      | sort -u | head -40
    echo "  (以上为空 = 无裸 HTTP, 业务大概率是 TLS 或自定义二进制)"
else
    echo "  (pcap 为空! 检查接口或 设备 IP)"
fi
echo
echo "----- 6. 协议解析 -----"
if command -v python3 >/dev/null 2>&1 && [ -f /root/w2parse.py ]; then
    python3 /root/w2parse.py "$PCAP" -o "$OUT/parse_$TS.txt" >/dev/null 2>&1
    echo "  解析报告: $OUT/parse_$TS.txt"
    echo "  看摘要:   sed -n '1,60p' $OUT/parse_$TS.txt"
    echo "  看新命令: sed -n '/6. 新发现/,\$p' $OUT/parse_$TS.txt"
else
    echo "  (路由器无 python3 或缺 /root/w2parse.py，把 pcap 传回 Windows 用 w2parse.py 解析)"
fi
echo "----- 7. 下一步 -----"
echo "  cat $SUM"
echo "  scp root@ROUTER:$PCAP ."
} > "$SUM"

echo
echo "===== 完成: $(date +%H:%M:%S) ====="
cat "$SUM"

SZ=$(wc -c < "$PCAP" 2>/dev/null | tr -d ' ')
if [ "${SZ:-0}" -lt 3000 ]; then
    echo
    echo "!! 告警: pcap 只有 ${SZ} 字节, 基本没抓到东西"
    echo "!! 自查: 1) 游戏是否停在主界面  2) 设备是否自动锁屏"
    echo "!!       3) 设备 IP 是否还是 $PHONE  4) 抓包时长是否够"
    echo "!! 重抓前先跑: grep $PHONE /proc/net/nf_conntrack | grep ESTABLISHED"
fi
