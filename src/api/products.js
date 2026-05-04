/**
 * Product Series & Product API
 *
 * ─── Directus 数据模型速览 ────────────────────────────────────────────────
 *
 *  product_series（产品系列主表）
 *    id                    integer (PK)
 *    status                string   published | draft | archived
 *    sort                  integer
 *    cover_image           uuid → directus_files  系列封面图
 *    template_type         string   "0"=家具 | "1"=地毯 | "2"=墙布 | "3"=灯具
 *    product_series_info   alias (translations) → product_series_translations
 *
 *  product_series_translations（系列多语言翻译表）
 *    languages_code        string (zh-CN | en-US …)
 *    series_name           string  系列名称
 *    series_title          string  系列标题
 *    series_desc           text    系列描述
 *    series_location       string  地址
 *    series_type           string  类型
 *
 *  product（产品主表）
 *    id                    integer (PK)
 *    status                string
 *    sort                  integer
 *    product_series        integer → product_series.id (M2O)
 *    cover_image           uuid → directus_files  产品封面图
 *    product_main_images   alias (o2m) → product_images.product_id
 *    product_assistant_image alias (o2m) → product_images.product_assistant_id
 *    product_info          alias (translations) → product_translations
 *
 *  product_translations（产品多语言翻译表）
 *    languages_code        string
 *    product_name          string  产品名称
 *    product_location      string  地址
 *    product_type          string  类型
 *    product_composition   string  成分
 *    product_desc          text    产品描述
 *    product_dimensions    string  规格尺寸
 *    product_pattern_repeat string 图案
 *
 *  product_images（产品图片表）
 *    product_image         uuid → directus_files  实际图片文件
 *    product_id            integer → product.id   (产品主图关联)
 *    product_assistant_id  integer → product.id   (产品副图关联)
 *    image_name            string  图片名称
 *    image_intro           string  图片简介
 */

import { directusGet, getAssetUrl } from './directus'

// ─── 字段白名单 ────────────────────────────────────────────────────────────

const SERIES_FIELDS = [
  'id',
  'sort',
  'cover_image',
  'template_type',
  // 多语言系列信息
  'product_series_info.languages_code',
  'product_series_info.series_name',
  'product_series_info.series_title',
  'product_series_info.series_desc',
  'product_series_info.series_location',
  'product_series_info.series_type',
].join(',')

const PRODUCT_FIELDS = [
  'id',
  'sort',
  'cover_image',
  // M2O：只取系列 id，避免循环拉取大量数据
  'product_series',
  // 多语言产品信息
  'product_info.languages_code',
  'product_info.product_name',
  'product_info.product_location',
  'product_info.product_type',
  'product_info.product_composition',
  'product_info.product_desc',
  'product_info.product_dimensions',
  'product_info.product_pattern_repeat',
  // 产品主图
  'product_main_images.product_image',
  'product_main_images.image_name',
  'product_main_images.image_intro',
  // 产品副图
  'product_assistant_image.product_image',
  'product_assistant_image.image_name',
  'product_assistant_image.image_intro',
].join(',')

// ─── 转换工具 ──────────────────────────────────────────────────────────────

const TEMPLATE_TYPE_MAP = { '0': 'furniture', '1': 'rug', '2': 'wallcovering', '3': 'lighting' }

function buildTranslationMap(translations) {
  const map = new Map()
  if (!Array.isArray(translations)) return map
  translations.forEach((t) => {
    if (t.languages_code) map.set(t.languages_code, t)
  })
  return map
}

function getTranslation(map, langCode) {
  return map.get(langCode) || map.get(langCode.split('-')[0]) || {}
}

function transformImageList(images, imgTransforms = {}) {
  if (!Array.isArray(images) || images.length === 0) return []
  return images.map((img) => ({
    src: getAssetUrl(img.product_image, imgTransforms),
    name: img.image_name || '',
    intro: img.image_intro || '',
  }))
}

// ─── product_series 转换器 ────────────────────────────────────────────────

/**
 * 将 Directus 原始 product_series 记录转换为前端友好格式。
 *
 * @param {Object} raw
 * @returns {Object}
 */
function transformSeries(raw) {
  const tMap = buildTranslationMap(raw.product_series_info)

  const buildLang = (code) => {
    const t = getTranslation(tMap, code)
    return {
      name: t.series_name || '',
      title: t.series_title || '',
      desc: t.series_desc || '',
      location: t.series_location || '',
      type: t.series_type || '',
    }
  }

  return {
    id: raw.id,
    sort: raw.sort,
    coverImage: getAssetUrl(raw.cover_image, { width: 1200, quality: 85 }),
    templateType: TEMPLATE_TYPE_MAP[raw.template_type] || raw.template_type,
    zh: buildLang('zh-CN'),
    en: buildLang('en-US'),
  }
}

// ─── product 转换器 ────────────────────────────────────────────────────────

/**
 * 将 Directus 原始 product 记录转换为前端友好格式。
 *
 * @param {Object} raw
 * @returns {Object}
 */
function transformProduct(raw) {
  const tMap = buildTranslationMap(raw.product_info)

  const buildLang = (code) => {
    const t = getTranslation(tMap, code)
    return {
      name: t.product_name || '',
      location: t.product_location || '',
      type: t.product_type || '',
      composition: t.product_composition || '',
      desc: t.product_desc || '',
      dimensions: t.product_dimensions || '',
      patternRepeat: t.product_pattern_repeat || '',
    }
  }

  return {
    id: raw.id,
    sort: raw.sort,
    seriesId: raw.product_series,
    coverImage: getAssetUrl(raw.cover_image, { width: 800, quality: 85 }),
    mainImages: transformImageList(raw.product_main_images, { width: 1600, quality: 85 }),
    assistantImages: transformImageList(raw.product_assistant_image, { width: 800, quality: 85 }),
    zh: buildLang('zh-CN'),
    en: buildLang('en-US'),
  }
}

// ─── 公开 API 方法 ─────────────────────────────────────────────────────────

/**
 * 获取所有已发布的产品系列，按 sort 升序排列。
 *
 * @returns {Promise<Array>}
 *
 * @example
 * import { fetchProductSeries } from '@/api/products'
 * const series = await fetchProductSeries()
 */
export async function fetchProductSeries() {
  const rawList = await directusGet('/items/product_series', {
    'filter[status][_eq]': 'published',
    'fields': SERIES_FIELDS,
    'sort': 'sort',
    'limit': '-1',
  })
  return rawList.map(transformSeries)
}

/**
 * 获取单个产品系列详情。
 *
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function fetchProductSeriesById(id) {
  const raw = await directusGet(`/items/product_series/${id}`, {
    'fields': SERIES_FIELDS,
  })
  return transformSeries(raw)
}

/**
 * 获取所有已发布的产品，按 sort 升序排列。
 *
 * @returns {Promise<Array>}
 *
 * @example
 * import { fetchProducts } from '@/api/products'
 * const products = await fetchProducts()
 */
export async function fetchProducts() {
  const rawList = await directusGet('/items/product', {
    'filter[status][_eq]': 'published',
    'fields': PRODUCT_FIELDS,
    'sort': 'sort',
    'limit': '-1',
  })
  return rawList.map(transformProduct)
}

/**
 * 获取某个系列下的所有已发布产品。
 *
 * @param {number|string} seriesId
 * @returns {Promise<Array>}
 */
export async function fetchProductsBySeriesId(seriesId) {
  const rawList = await directusGet('/items/product', {
    'filter[status][_eq]': 'published',
    'filter[product_series][_eq]': String(seriesId),
    'fields': PRODUCT_FIELDS,
    'sort': 'sort',
    'limit': '-1',
  })
  return rawList.map(transformProduct)
}

/**
 * 获取单个产品详情。
 *
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function fetchProductById(id) {
  const raw = await directusGet(`/items/product/${id}`, {
    'fields': PRODUCT_FIELDS,
  })
  return transformProduct(raw)
}
