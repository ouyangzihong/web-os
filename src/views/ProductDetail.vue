<template>
  <div class="product-detail-page">
    <TheNavbar :is-visible="true" class="force-light-nav" />
    <div v-if="loading" class="loading-state">Loading...</div>
    <div v-else-if="error" class="error-state">{{ error }}</div>
    <template v-else-if="product">

    <div class="hero-section">
      <div class="hero-slider">
        <div class="slider-window">
          <div class="slider-track" :style="heroTrackStyle">
             <div class="slide-item"><img :src="heroLoopList[0]" /></div>
             <div class="slide-item" v-for="(img, i) in gallery" :key="`real-${i}`">
               <img :src="img" />
             </div>
             <div class="slide-item"><img :src="heroLoopList[heroLoopList.length-1]" /></div>
          </div>
          
          <button class="arrow prev" @click="moveHero(-1)">←</button>
          <button class="arrow next" @click="moveHero(1)">→</button>
        </div>
      </div>

      <div class="hero-info">
        <div class="info-content">
          <h2 class="collection-name">{{ currentSeriesName }}</h2>
          <h1 class="product-title">{{ productTitle }}</h1>
          <!-- <p class="price-placeholder">XXX XXX</p>  -->
          <div class="desc-text">{{ productDesc }}</div>
        </div>
      </div>
    </div>

    <div v-if="isVariantTemplate" class="section-container variant-section">
      <h3 class="section-title">All available colours</h3>
      
      <div class="variant-preview">
        <img :src="selectedVariantImage" alt="Selected Variant" />
        <div class="preview-overlay">
          <span>{{ selectedVariantName }}</span>
        </div>
      </div>

      <div class="variant-thumbs">
        <div 
          v-for="(v, idx) in variantItems" 
          :key="idx"
          class="thumb-item"
          :class="{ active: currentVariantIndex === idx }"
          @click="currentVariantIndex = idx"
        >
          <img :src="v.image" />
          <span class="thumb-label">{{ v.name }}</span>
        </div>
      </div>
    </div>

    <div v-else class="section-container app-section">
      <h3 class="section-title">Product Application</h3>
      
      <div class="app-slider">
        <div class="slider-window">
          <div class="slider-track" :style="appTrackStyle">
            <div class="slide-item app-slide"><img :src="appLoopList[0]" /></div>
            <div class="slide-item app-slide" v-for="(img, i) in appImages" :key="`app-${i}`">
              <img :src="img" />
              <!-- <div class="app-caption">Product images can be illustration references</div> -->
            </div>
            <div class="slide-item app-slide"><img :src="appLoopList[appLoopList.length-1]" /></div>
          </div>
          
          <button class="arrow prev big-arrow" @click="moveApp(-1)">
             <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="1" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button class="arrow next big-arrow" @click="moveApp(1)">
             <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="1" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- <div class="section-container specs-section">
      <h3 class="section-title">Specifications</h3>
      <div class="specs-table">
        <div class="spec-row">
          <span class="label">Product Category</span>
          <span class="value">{{ getSpec('category') }}</span>
        </div>
        <div class="spec-row">
          <span class="label">Composition</span>
          <span class="value">{{ getSpec('composition') }}</span>
        </div>
        <div class="spec-row">
          <span class="label">Description</span>
          <span class="value">{{ getSpec('description') }}</span>
        </div>
        <div class="spec-row">
          <span class="label">Dimensions</span>
          <span class="value">{{ getSpec('dimensions') }}</span>
        </div>
        <div class="spec-row">
          <span class="label">Pattern repeat</span>
          <span class="value">{{ getSpec('patternRepeat') }}</span>
        </div>
      </div>
    </div> -->

    <div class="section-container other-patterns">
      <h3 class="section-title">Other patterns in this collection</h3>
      
      <div class="carousel-container">
        <button class="nav-btn prev" @click="moveBottom(-1)">←</button>
        
        <div class="carousel-window" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">
          <div class="carousel-track" :style="bottomTrackStyle">
             <div 
                v-for="(item, idx) in bottomDisplayList" 
                :key="`b-${idx}`"
                class="bottom-card"
                :style="{ flex: `0 0 ${100/itemsPerSlide}%` }"
                @click="goToDetail(item.id)"
             >
                <div class="img-wrap">
                  <img :src="item.image" />
                  <div class="hover-info">
                    <span>{{ getLocaleText(item, 'title') }}</span>
                  </div>
                </div>
             </div>
          </div>
        </div>

        <button class="nav-btn next" @click="moveBottom(1)">→</button>
      </div>
    </div>

    </template>
    <TheFooter />
  </div>
</template>

<script>
import TheNavbar from '@/components/common/TheNavbar.vue';
import TheFooter from '@/components/common/TheFooter.vue';
import { fetchProductById, fetchProductSeriesById, fetchProductsBySeriesId } from '@/api/products';

export default {
  name: 'ProductDetail',
  components: { TheNavbar, TheFooter },
  props: ['seriesId', 'itemId'],
  data() {
    return {
      product: null,
      seriesData: null,
      loading: false,
      error: null,

      // Hero Slider State
      heroIndex: 1,
      isHeroAnimating: false,
      isHeroResetting: false,

      // Variant State
      currentVariantIndex: 0,

      // Application Slider State
      appIndex: 1,
      isAppAnimating: false,
      isAppResetting: false,

      // Bottom Slider State
      bottomItemsRaw: [],
      bottomIndex: 3,
      itemsPerSlide: 3,
      isBottomAnimating: false,
      isBottomResetting: false,
      autoplayTimer: null
    };
  },
  computed: {
    locale() { return this.$i18n.locale; },

    // 地毯/墙布类型展示色彩变体，其余展示应用场景图
    isVariantTemplate() {
      const type = this.seriesData && this.seriesData.templateType;
      return type === 'rug' || type === 'wallcovering';
    },

    // 主图列表（来自 mainImages）
    gallery() {
      return this.product ? this.product.mainImages.map(img => img.src) : [];
    },
    // 副图列表（来自 assistantImages）
    appImages() {
      return this.product ? this.product.assistantImages.map(img => img.src) : [];
    },
    variantItems() {
      return this.product
        ? this.product.assistantImages.map(img => ({ image: img.src, name: img.name }))
        : [];
    },

    // 基础信息
    currentSeriesName() {
      return this.seriesData ? (this.seriesData[this.locale].name || '') : '';
    },
    productTitle() {
      return this.product ? (this.product[this.locale].name || '') : '';
    },
    productDesc() {
      return this.product ? (this.product[this.locale].desc || '') : '';
    },

    // Variant 逻辑
    selectedVariantImage() {
      if (!this.variantItems.length) return '';
      return this.variantItems[this.currentVariantIndex].image;
    },
    selectedVariantName() {
      if (!this.variantItems.length) return '';
      return this.variantItems[this.currentVariantIndex].name;
    },

    // Hero 轮播: [Last, ...All, First]
    heroLoopList() {
      if (!this.gallery.length) return [];
      return [this.gallery[this.gallery.length - 1], ...this.gallery, this.gallery[0]];
    },
    heroTrackStyle() {
      return {
        transform: `translateX(-${this.heroIndex * 100}%)`,
        transition: this.isHeroResetting ? 'none' : 'transform 0.5s ease'
      };
    },

    // App 轮播
    appLoopList() {
      if (!this.appImages.length) return [];
      return [this.appImages[this.appImages.length - 1], ...this.appImages, this.appImages[0]];
    },
    appTrackStyle() {
      return {
        transform: `translateX(-${this.appIndex * 100}%)`,
        transition: this.isAppResetting ? 'none' : 'transform 0.6s ease'
      };
    },

    // 底部推荐轮播
    bottomDisplayList() {
      if (!this.bottomItemsRaw.length) return [];
      const list = this.bottomItemsRaw;
      const cloneEnd = list.slice(0, this.itemsPerSlide);
      const cloneStart = list.slice(-this.itemsPerSlide);
      return [...cloneStart, ...list, ...cloneEnd];
    },
    bottomTrackStyle() {
      const pct = 100 / this.itemsPerSlide;
      return {
        transform: `translateX(-${this.bottomIndex * pct}%)`,
        transition: this.isBottomResetting ? 'none' : 'transform 0.6s ease'
      };
    }
  },
  watch: {
    '$route.params': {
      immediate: true,
      handler() {
        this.loadData();
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.startAutoPlay();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    this.pauseAutoPlay();
  },
  methods: {
    async loadData() {
      const { seriesId, itemId } = this.$route.params;
      if (!itemId || !seriesId) return;

      this.loading = true;
      this.error = null;
      this.product = null;
      this.seriesData = null;
      this.bottomItemsRaw = [];

      try {
        const [product, series] = await Promise.all([
          fetchProductById(itemId),
          fetchProductSeriesById(seriesId),
        ]);
        this.product = product;
        this.seriesData = series;

        const allProducts = await fetchProductsBySeriesId(seriesId);
        const others = allProducts.filter(p => String(p.id) !== String(itemId));
        this.bottomItemsRaw = others
          .sort(() => 0.5 - Math.random())
          .slice(0, 5)
          .map(p => ({
            id: p.id,
            image: p.coverImage,
            zh: { title: p.zh.name },
            en: { title: p.en.name },
          }));
      } catch (err) {
        this.error = err.message;
        console.error('[ProductDetail] 获取数据失败:', err);
      } finally {
        this.loading = false;
      }

      this.heroIndex = 1;
      this.appIndex = 1;
      this.currentVariantIndex = 0;
      this.bottomIndex = this.itemsPerSlide;
      window.scrollTo(0, 0);
    },

    getSpec(key) {
      if (!this.product) return '-';
      const lang = this.product[this.locale] || {};
      const map = {
        category: lang.type,
        composition: lang.composition,
        description: lang.desc,
        dimensions: lang.dimensions,
        patternRepeat: lang.patternRepeat,
      };
      return map[key] || '-';
    },
    getLocaleText(item, key) {
      return item[this.locale][key];
    },

    moveSlide(type, direction, maxRealCount) {
      const isAnimatingKey = `is${type}Animating`;
      const isResettingKey = `is${type}Resetting`;
      const indexKey = `${type.toLowerCase()}Index`;
      
      if (this[isAnimatingKey]) return;
      this[isAnimatingKey] = true;
      this[indexKey] += direction;

      setTimeout(() => {
        const currentIdx = this[indexKey];
        if (currentIdx === 0) {
          this[isResettingKey] = true;
          this[indexKey] = maxRealCount;
          setTimeout(() => this[isResettingKey] = false, 50);
        } else if (currentIdx === maxRealCount + 1) {
          this[isResettingKey] = true;
          this[indexKey] = 1;
          setTimeout(() => this[isResettingKey] = false, 50);
        }
        this[isAnimatingKey] = false;
      }, type === 'App' ? 600 : 500);
    },

    moveHero(dir) {
      this.moveSlide('Hero', dir, this.gallery.length);
    },
    moveApp(dir) {
      this.moveSlide('App', dir, this.appImages.length);
    },

    moveBottom(dir) {
      if (this.isBottomAnimating) return;
      this.isBottomAnimating = true;
      this.bottomIndex += dir;

      const realCount = this.bottomItemsRaw.length;
      setTimeout(() => {
        if (this.bottomIndex < this.itemsPerSlide) {
          this.isBottomResetting = true;
          this.bottomIndex += realCount;
          setTimeout(() => this.isBottomResetting = false, 50);
        } else if (this.bottomIndex >= this.itemsPerSlide + realCount) {
          this.isBottomResetting = true;
          this.bottomIndex -= realCount;
          setTimeout(() => this.isBottomResetting = false, 50);
        }
        this.isBottomAnimating = false;
      }, 600);
    },
    
    startAutoPlay() {
      if (this.autoplayTimer) clearInterval(this.autoplayTimer);
      this.autoplayTimer = setInterval(() => this.moveBottom(1), 3000);
    },
    pauseAutoPlay() {
      clearInterval(this.autoplayTimer);
    },
    handleResize() {
      this.itemsPerSlide = window.innerWidth < 768 ? 1 : 3;
    },
    goToDetail(itemId) {
      this.$router.push({
        name: 'ProductDetail',
        params: { seriesId: String(this.seriesData.id), itemId: String(itemId) }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
// 全局样式重置
* { box-sizing: border-box; }
.product-detail-page {
  padding-top: 100px;
  background: #fff;
  color: #333;
}

.loading-state,
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px);
  font-size: 14px;
  color: #999;
  letter-spacing: 1px;
}

// 导航栏复用样式
::v-deep .force-light-nav {
  background-color: #ffffff !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  padding: 20px 60px !important;
  color: #333 !important;
  .logo-img { filter: invert(1) brightness(0.2); }
  .underline { background-color: #333 !important; }
  .lang-switch { border-color: #ccc !important; color: #333 !important; }
  @media(max-width:768px){ padding: 15px 20px !important; }
}

.section-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 60px;
  text-align: center;
}
.section-title {
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 60px;
  font-weight: 500;
}

// === 1. Hero Section ===
.hero-section {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 60px 80px;
  gap: 80px;
  align-items: center;

  .hero-slider {
    flex: 1.2;
    position: relative;
    
    .slider-window {
      width: 100%;
      aspect-ratio: 4/3;
      overflow: hidden;
      position: relative;
      background: #f4f4f4;
    }
    .slider-track {
      display: flex;
      height: 100%;
      width: 100%;
    }
    .slide-item {
      flex: 0 0 100%;
      img { width: 100%; height: 100%; object-fit: cover; }
    }
  }

  .hero-info {
    flex: 0.8;
    text-align: left;
    
    .collection-name { font-size: 14px; color: #999; margin-bottom: 10px; text-transform: uppercase; }
    .product-title { font-size: 32px; font-weight: 400; margin-bottom: 20px; }
    .price-placeholder { font-size: 16px; margin-bottom: 40px; font-family: monospace; }
    .desc-text { font-size: 14px; line-height: 1.8; color: #666; }
  }
}

// 通用箭头样式
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  z-index: 2;
  padding: 10px;
  text-shadow: 0 0 5px rgba(0,0,0,0.5);
  &.prev { left: 10px; }
  &.next { right: 10px; }
  &:hover { opacity: 0.7; }
}

// === 2A. Variant Section ===
.variant-section {
  background: #f9f9f9; // 稍微区分背景
  
  .variant-preview {
    width: 100%;
    max-width: 800px; // 限制最大宽度
    margin: 0 auto 40px;
    aspect-ratio: 16/9;
    background: #eee;
    position: relative;
    
    img { width: 100%; height: 100%; object-fit: cover; }
    
    .preview-overlay {
      position: absolute;
      top: 50%; left: 50%; transform: translate(-50%, -50%);
      color: #fff;
      font-size: 20px;
      letter-spacing: 2px;
      text-transform: uppercase;
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
  }

  .variant-thumbs {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;

    .thumb-item {
      width: 80px;
      cursor: pointer;
      opacity: 0.6;
      transition: all 0.3s;
      
      img { width: 100%; aspect-ratio: 1; object-fit: cover; margin-bottom: 8px; }
      .thumb-label { font-size: 12px; color: #666; }

      &.active, &:hover { opacity: 1; transform: translateY(-5px); }
    }
  }
}

// === 2B. Application Section ===
.app-section {
  padding: 40px 0; // [修改] 缩小区域上下内边距 (原 80px)

  // [新增] 单独针对此模块缩小标题下边距
  .section-title {
    margin-bottom: 30px; // (原 60px)
  }

  .app-slider {
    width: 100%;
    position: relative;
    padding: 0 200px; // [新增] 左右留出间距 (数值可按需调整，如 24px 或 60px)

    .slider-window {
      width: 100%;
      height: auto;      // [修改] 移除固定高度 60vh
      aspect-ratio: 2/1; // [新增] 锁定长宽比为 2:1
      overflow: hidden;
      position: relative;
      background-color: #f4f4f4;
    }
    .slider-track { display: flex; height: 100%; }
    
    .app-slide {
      flex: 0 0 100%; 
      width: 100%;
      position: relative;
      img { width: 100%; height: 100%; object-fit: cover; }
      
      .app-caption {
        position: absolute;
        bottom: 40px; width: 100%; text-align: center;
        color: rgba(255,255,255,0.8);
        font-size: 12px; letter-spacing: 1px;
        text-transform: uppercase;
        text-shadow: 0 1px 3px rgba(0,0,0,0.5);
      }
    }
    
    .big-arrow {
      font-size: 40px;
      color: rgba(255,255,255,0.6);
      padding: 20px;
      &:hover { color: #fff; background: rgba(0,0,0,0.1); }
    }
  }
}
/* 核心场景图区域 */
.scene-wrapper {
  /* 1. 左右留出间距：这里设为 24px，您可以根据需要调整 */
  padding: 0 24px; 
  
  /* 这里的 margin-bottom 可以控制场景图和下方内容的距离 */
  margin-bottom: 20px; 
}

.scene-image {
  width: 100%;
  
  /* 2. 锁定长宽比为 3:2 */
  aspect-ratio: 3 / 2;
  
  /* 确保图片填满容器且不被拉伸变形 (关键) */
  object-fit: cover; 
  
  /* 可选：加上圆角让视觉更柔和 */
  border-radius: 8px; 
  display: block;
}

/* Product Application 区域 */
.product-application {
  /* 3. 缩小上下间距 */
  /* 假设之前是 margin: 40px 0; 现在改小一点 */
  margin-top: 20px; 
  margin-bottom: 20px;
}
// === 3. Specifications ===
.specs-table {
  max-width: 800px;
  margin: 0 auto;
  border-top: 1px solid #eee;

  .spec-row {
    display: flex;
    padding: 20px 0;
    border-bottom: 1px solid #eee;
    text-align: left;
    
    .label { width: 30%; font-weight: 600; font-size: 14px; }
    .value { width: 70%; font-size: 14px; color: #666; }
  }
}

// === 4. Bottom Carousel ===
.other-patterns {
  .carousel-container {
    display: flex;
    align-items: center;
    gap: 20px;
    
    .nav-btn {
      background: none; border: 1px solid #ddd;
      width: 40px; height: 40px; border-radius: 50%;
      cursor: pointer; flex-shrink: 0;
      &:hover { background: #333; color: #fff; border-color: #333; }
    }

    .carousel-window {
      overflow: hidden;
      width: 100%;
    }
    .carousel-track { display: flex; }
    
    .bottom-card {
      padding: 0 10px;
      cursor: pointer;
      
      .img-wrap {
        position: relative;
        aspect-ratio: 3/4;
        background: #f4f4f4;
        overflow: hidden;
        
        img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        
        .hover-info {
          position: absolute; top:0; left:0; width:100%; height:100%;
          background: rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
          color: #fff; opacity: 0; transition: 0.3s;
          font-size: 14px; letter-spacing: 1px;
        }
      }
      
      &:hover {
        .img-wrap img { transform: scale(1.05); }
        .hover-info { opacity: 1; }
      }
    }
  }
}

// === Mobile Responsive ===
@media screen and (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    padding: 20px;
    gap: 30px;
    
    .hero-slider .slider-window { aspect-ratio: 1; }
  }
  
  .section-container { padding: 40px 20px; }
  
  .specs-table .spec-row {
    flex-direction: column;
    gap: 5px;
    .label { width: 100%; }
    .value { width: 100%; }
  }
  
 .app-section .app-slider {
    padding: 0 20px; // 移动端左右间距可以稍微小一点
    
    .slider-window { 
      height: auto; 
      aspect-ratio: 3/2; 
    }
  }
}
</style>