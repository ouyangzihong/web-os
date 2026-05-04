/**
 * Directus API 核心客户端
 *
 * 负责：
 *  - 统一管理 Base URL
 *  - 封装 fetch 请求（超时、错误处理、统一响应结构）
 *  - 提供生成 Directus Assets 图片 URL 的工具函数
 *
 * 鉴权说明：
 *  当前使用 Directus Public Role 公开只读访问，无需 Token。
 *  请在 Directus 后台 → Settings → Roles → Public 中，为以下集合开启对应权限：
 *    只读（Read）：projects / Project_Images / projects_translations_info /
 *                  product_series / product_series_translations /
 *                  product / product_images / product_translations
 *    创建（Create）：contact_messages（允许公开提交表单）
 */

// ─── 配置 ──────────────────────────────────────────────────────────────────

/**
 * Directus 服务根地址，从环境变量读取。
 * 本地开发时在 .env.local 中配置，生产构建时在服务器环境变量中注入。
 */
const BASE_URL = (process.env.VUE_APP_DIRECTUS_URL || '').replace(/\/$/, '')

/** 默认请求超时（毫秒） */
const DEFAULT_TIMEOUT_MS = 15000

// ─── 工具函数 ──────────────────────────────────────────────────────────────

/**
 * 根据 Directus 文件 UUID 生成完整的 Assets URL。
 *
 * @param {string|null} fileId - directus_files.id（UUID 字符串）
 * @param {Object} [transforms] - 可选的图片转换参数（Directus Image Transforms）
 * @param {number} [transforms.width]
 * @param {number} [transforms.height]
 * @param {number} [transforms.quality=85]
 * @param {'cover'|'contain'|'inside'|'outside'} [transforms.fit]
 * @returns {string} 完整图片 URL，fileId 为空时返回空字符串
 *
 * @example
 * getAssetUrl('abc-123', { width: 1200, quality: 80 })
 * // → "https://api.kairoscn.com/assets/abc-123?width=1200&quality=80"
 */
export function getAssetUrl(fileId, transforms = {}) {
  if (!fileId || !BASE_URL) return ''

  const url = new URL(`${BASE_URL}/assets/${fileId}`)

  const { width, height, quality = 85, fit } = transforms
  if (width) url.searchParams.set('width', width)
  if (height) url.searchParams.set('height', height)
  if (quality !== 85) url.searchParams.set('quality', quality)
  if (fit) url.searchParams.set('fit', fit)

  return url.toString()
}

// ─── 请求核心 ──────────────────────────────────────────────────────────────

/**
 * 构造请求头。
 *
 * @returns {HeadersInit}
 */
function buildHeaders() {
  return { 'Content-Type': 'application/json' }
}

/**
 * 带超时控制的 fetch 封装。
 *
 * @param {string} url
 * @param {RequestInit} [options]
 * @param {number} [timeoutMs]
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    return response
  } finally {
    clearTimeout(timer)
  }
}

/**
 * 安全解析响应体：先读文本，再 JSON.parse，空响应体返回 null。
 * 避免 "Unexpected end of JSON input" 错误。
 *
 * @param {Response} response
 * @returns {Promise<any>}
 */
async function parseResponseBody(response) {
  const text = await response.text()
  if (!text || !text.trim()) return null
  const json = JSON.parse(text)
  // GET 响应：{ data: [...] }；POST 响应：{ data: {...} } 或空
  return json.data !== undefined ? json.data : json
}

/**
 * Directus Items API 通用 GET 请求函数。
 *
 * @param {string} path - 相对路径，如 '/items/projects'
 * @param {Record<string, string>} [queryParams] - URL 查询参数键值对
 * @returns {Promise<any>} Directus 标准响应体中的 data 字段
 * @throws {Error} 网络错误、超时、非 2xx 响应时抛出
 */
export async function directusGet(path, queryParams = {}) {
  if (!BASE_URL) {
    throw new Error(
      '[Directus] VUE_APP_DIRECTUS_URL 未配置，请在 .env.local 中设置该变量。'
    )
  }

  const url = new URL(`${BASE_URL}${path}`)
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value)
    }
  })

  let response
  try {
    response = await fetchWithTimeout(url.toString(), {
      method: 'GET',
      headers: buildHeaders(),
    })
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`[Directus] 请求超时（>${DEFAULT_TIMEOUT_MS}ms）: ${path}`)
    }
    throw new Error(`[Directus] 网络请求失败: ${err.message}`)
  }

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`
    try {
      const text = await response.text()
      if (text) {
        const errorBody = JSON.parse(text)
        errorMessage = errorBody?.errors?.[0]?.message || errorMessage
      }
    } catch { /* 忽略解析失败 */ }
    throw new Error(`[Directus] API 错误 (${path}): ${errorMessage}`)
  }

  return parseResponseBody(response)
}

/**
 * Directus Items API 通用 POST 请求（用于写入数据，如提交表单）。
 *
 * @param {string} path - 相对路径，如 '/items/contact_messages'
 * @param {Object} body - 要写入的数据对象
 * @returns {Promise<any>} 创建成功后 Directus 返回的新记录，无 Read 权限时返回 null
 * @throws {Error} 网络错误、超时、非 2xx 响应时抛出
 */
export async function directusPost(path, body) {
  if (!BASE_URL) {
    throw new Error(
      '[Directus] VUE_APP_DIRECTUS_URL 未配置，请在 .env.local 中设置该变量。'
    )
  }

  let response
  try {
    response = await fetchWithTimeout(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    })
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`[Directus] 请求超时（>${DEFAULT_TIMEOUT_MS}ms）: ${path}`)
    }
    throw new Error(`[Directus] 网络请求失败: ${err.message}`)
  }

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`
    try {
      const text = await response.text()
      if (text) {
        const errorBody = JSON.parse(text)
        errorMessage = errorBody?.errors?.[0]?.message || errorMessage
      }
    } catch { /* 忽略解析失败 */ }
    throw new Error(`[Directus] API 错误 (${path}): ${errorMessage}`)
  }

  // Directus 在 contact_messages 无 Read 权限时创建成功后返回空响应体
  return parseResponseBody(response)
}
