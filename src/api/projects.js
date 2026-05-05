/**
 * Projects 集合 API
 *
 * 负责：
 *  - 向 Directus /items/projects 发起请求
 *  - 将 Directus 原始数据转换为与 src/data/projects.js 完全兼容的前端格式
 *
 * ─── Directus 数据模型速览 ────────────────────────────────────────────────
 *
 *  projects（主表）
 *    id                  integer (PK)
 *    status              string   published | draft | archived
 *    sort                integer  排序权重
 *    isSelected          boolean  是否精选推荐
 *    show_little_image   boolean  是否显示左右产品图
 *    cover_image         uuid → directus_files  封面图
 *    project_info        alias (o2m translations) → projects_translations_info
 *    left_images         alias (o2m) → Project_Images.project_left_id
 *    middle_images       alias (o2m) → Project_Images.project_middle_id
 *    right_images        alias (o2m) → Project_Images.project_right_id
 *
 *  projects_translations_info（多语言翻译表）
 *    languages_code      string (zh-CN | en-US …)
 *    project_title       string  项目标题
 *    project_intro       string  项目简介（列表页）
 *    project_date        string  项目日期
 *    project_location    string  项目地址
 *    project_type        string  项目类型
 *    project_desc        text    详情页正文描述（对应 leftContent 中的 text 节点）
 *
 *  Project_Images（图片表）
 *    sort                integer
 *    project_image       uuid → directus_files
 *    image_name          string  图片名称（对应 name）
 *    image_intro         string  图片简介（对应 meta）
 *    image_desc          text    图片详细描述（可选扩展）
 */

import { directusGet, getAssetUrl } from './directus'

// ─── 请求字段白名单 ────────────────────────────────────────────────────────
// 明确列出所需字段，避免拉取不必要的数据（减少带宽，提升性能）

const PROJECT_FIELDS = [
  'id',
  'sort',
  'isSelected',
  'show_little_image',
  'cover_image',
  // 多语言翻译
  'project_info.languages_code',
  'project_info.project_title',
  'project_info.project_intro',
  'project_info.project_date',
  'project_info.project_location',
  'project_info.project_type',
  'project_info.project_desc',
  // 左侧产品图（文案+氛围图区域的图片部分）
  'left_images.sort',
  'left_images.project_image',
  'left_images.image_name',
  'left_images.image_intro',
  // 中间主图
  'middle_images.sort',
  'middle_images.project_image',
  'middle_images.image_name',
  // 右侧产品/细节图
  'right_images.sort',
  'right_images.project_image',
  'right_images.image_name',
  'right_images.image_intro',
].join(',')

// ─── 数据转换器（Directus → 前端格式） ──────────────────────────────────

/**
 * 将 Project_Images 数组转换为前端图片列表。
 *
 * @param {Array} images - Directus Project_Images 原始数组
 * @param {Object} [imgTransforms] - 传递给 getAssetUrl 的图片转换参数
 * @returns {Array<{ src: string, name: string, meta: string }>}
 */
function transformImageList(images, imgTransforms = {}) {
  if (!Array.isArray(images) || images.length === 0) return []

  return [...images]
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((img) => ({
      src: getAssetUrl(img.project_image, imgTransforms),
      name: img.image_name || '',
      meta: img.image_intro || '',
    }))
}

/**
 * 将多语言翻译数组转换为按语言 code 索引的 Map。
 *
 * @param {Array} translations - project_info 原始数组
 * @returns {Map<string, Object>}
 */
function buildTranslationMap(translations) {
  const map = new Map()
  if (!Array.isArray(translations)) return map
  translations.forEach((t) => {
    if (t.languages_code) map.set(t.languages_code, t)
  })
  return map
}

/**
 * 根据单个语言的翻译数据和公共图片资源，构建该语言的项目数据块。
 *
 * @param {Object} translation - 单条 projects_translations_info
 * @param {Array}  leftImages  - 左侧图片（与语言无关，共用）
 * @param {Array}  middleImages
 * @param {Array}  rightImages
 * @returns {Object} 与 projects.js 中 zh / en 结构完全一致的对象
 */
function buildLangBlock(translation, leftImages, middleImages, rightImages) {
  const t = translation || {}

  const leftContent = []

  // 详情页描述文字始终作为 leftContent 的第一个节点
  if (t.project_desc) {
    leftContent.push({ type: 'text', content: t.project_desc })
  }

  leftContent.push(...transformImageList(leftImages))

  return {
    title: t.project_title || '',
    intro: t.project_intro || '',
    date: t.project_date || '',
    location: t.project_location || '',
    type: t.project_type || '',
    leftContent,
    mainImages: transformImageList(middleImages),
    rightImages: [
      { spacer: true, height: '0px' },
      ...transformImageList(rightImages),
    ],
  }
}

/**
 * 将 Directus 单条 projects 原始记录转换为前端 projectsData 格式。
 *
 * @param {Object} raw - Directus API 返回的单条 projects 记录
 * @returns {Object} 与 src/data/projects.js 中单个项目对象完全兼容的结构
 */
function transformProject(raw) {
  const translationMap = buildTranslationMap(raw.project_info)

  const coverImage = getAssetUrl(raw.cover_image)

  return {
    id: String(raw.id),             // 转为字符串，与原路由 ID 模式兼容
    directusId: raw.id,             // 保留数字 ID，方便后续按 ID 查询单项
    coverImage,
    isSelected: raw.isSelected ?? false,
    show_little_image: raw.show_little_image ?? false,

    zh: buildLangBlock(
      translationMap.get('zh-CN'),
      raw.left_images,
      raw.middle_images,
      raw.right_images
    ),

    en: buildLangBlock(
      translationMap.get('en-US') || translationMap.get('en'),
      raw.left_images,
      raw.middle_images,
      raw.right_images
    ),
  }
}

// ─── 公开 API 方法 ─────────────────────────────────────────────────────────

/**
 * 获取所有 published 状态的项目列表。
 *
 * 返回格式与 src/data/projects.js 的 projectsData 数组完全一致，
 * 可作为直接替换使用。
 *
 * @returns {Promise<Array>} 转换后的项目数组，按 sort 字段升序排列
 *
 * @example
 * import { fetchProjects } from '@/api/projects'
 * const projects = await fetchProjects()
 */
export async function fetchProjects() {
  const rawList = await directusGet('/items/projects', {
    'filter[status][_eq]': 'published',
    'fields': PROJECT_FIELDS,
    'sort': 'sort',
    'limit': '-1', // 不限制条数，返回全部
  })

  return rawList.map(transformProject)
}

/**
 * 根据 Directus 数字 ID 获取单个项目详情。
 *
 * @param {number|string} id - projects.id
 * @returns {Promise<Object>} 转换后的单个项目对象
 *
 * @example
 * import { fetchProjectById } from '@/api/projects'
 * const project = await fetchProjectById(3)
 */
export async function fetchProjectById(id) {
  const raw = await directusGet(`/items/projects/${id}`, {
    'fields': PROJECT_FIELDS,
  })

  return transformProject(raw)
}

/**
 * 获取所有精选推荐项目（isSelected = true）。
 *
 * @returns {Promise<Array>}
 */
export async function fetchSelectedProjects() {
  const rawList = await directusGet('/items/projects', {
    'filter[status][_eq]': 'published',
    'filter[isSelected][_eq]': 'true',
    'fields': PROJECT_FIELDS,
    'sort': 'sort',
    'limit': '-1',
  })

  return rawList.map(transformProject)
}
