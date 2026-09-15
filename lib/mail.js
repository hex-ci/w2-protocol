/**
 * mail.js —— 邮件附件可领性判定
 *
 * 客户端 Prot9002 里 attachmentFlag 是**三态**，不是布尔：
 *   -1 无附件 / 0 有可领附件 / 1 附件已领取（9008 成功后客户端把 0 改写为 1）。
 * 实测列表与详情同源同值。
 *
 * 判定刻意做成「启发式 + 内容兜底」，不写死任一取值：
 * 服务端换标志语义、加新邮件分类、上新奖励类型时都应自动吃到，
 * 因此枚举值只用于**排除已领**，最终以「详情附件条目非空」为地面真值。
 */
import { MAIL_FLAG } from './proto.js';

/** 列表标志 → 是否「已领取」；仅用于跳过已领邮件，未知值一律不跳过 */
function listIsClaimed(flag) {
  return flag === MAIL_FLAG.CLAIMED;
}

/** 列表标志 → 是否「明确无附件」（可安全跳过，不查详情） */
function listHasNoAttachment(flag) {
  return flag === MAIL_FLAG.NONE;
}

/**
 * 详情判定 → { claimable, reason }
 * 条目不空的邮件即便标志取值未知也判为可领（失败方向安全：多领的代价为一次被拒）。
 * @param {{attachment_flag:number, attachments:Array}} detail
 */
function judgeDetail(detail) {
  const items = detail?.attachments || [];
  if (items.length > 0) {
    return { claimable: true, reason: 'attachments' };
  }
  // 无条目：可能是已领（附件已入包）或纯通知类邮件，两种都不必领取
  return { claimable: false, reason: detail?.attachment_flag === MAIL_FLAG.PENDING ? 'flag-pending-no-items' : 'no-items' };
}

/**
 * 9008 成功后回读详情，确认标志已迁移为「已领取」。
 * 服务端正常会同步返回成功；回读仅用于把结果说准，不改变已发生的领取事实。
 * @returns {'claimed'|'unchanged'|'unknown'}
 */
function verifyClaimed(beforeFlag, afterFlag) {
  if (afterFlag === MAIL_FLAG.CLAIMED) return 'claimed';
  if (beforeFlag === afterFlag) return 'unchanged';
  return 'unknown';
}

export { listIsClaimed, listHasNoAttachment, judgeDetail, verifyClaimed };
