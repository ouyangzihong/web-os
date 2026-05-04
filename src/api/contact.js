/**
 * Contact Messages API
 *
 * ─── Directus 数据模型速览 ────────────────────────────────────────────────
 *
 *  contact_messages
 *    id              integer (PK, 自动递增)
 *    status          string   draft（默认）| published | archived
 *    date_created    timestamp (系统自动写入)
 *    name            string   必填，联系人姓名
 *    email           string   必填，联系方式
 *    subject         string   主题（可选）
 *    message         text     留言内容（可选）
 *    notes           text     备注，供后台人员使用，前端提交时不填写
 *
 * 权限说明：
 *  需在 Directus 后台 → Settings → Roles → Public → contact_messages
 *  开启 Create 权限，前端才能以匿名身份写入数据。
 */

import { directusPost } from './directus'

/**
 * 提交联系我们表单。
 *
 * @param {Object} formData
 * @param {string} formData.name     联系人姓名（必填）
 * @param {string} formData.email    邮箱 / 联系方式（必填）
 * @param {string} [formData.subject]  主题
 * @param {string} [formData.message]  留言内容
 * @returns {Promise<Object>} 创建成功后 Directus 返回的新记录
 * @throws {Error} 提交失败时抛出，上层组件负责捕获并展示错误信息
 *
 * @example
 * import { submitContactMessage } from '@/api/contact'
 *
 * try {
 *   await submitContactMessage({ name: '张三', email: 'z@x.com', message: '你好' })
 * } catch (err) {
 *   console.error(err.message)
 * }
 */
export async function submitContactMessage({ name, email, subject = '', message = '' }) {
  return directusPost('/items/contact_messages', {
    name,
    email,
    subject: subject || null,
    message: message || null,
  })
}
