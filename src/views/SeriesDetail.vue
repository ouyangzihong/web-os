<template>
  <div class="series-detail-page">
    <TheNavbar :is-visible="true" class="force-light-nav" />

    <div v-if="loading" class="loading-state">Loading...</div>
    <div v-else-if="error" class="error-state">{{ error }}</div>
    <div v-else-if="currentSeries" class="main-content">
      <div class="items-grid">
        <div 
          v-for="item in seriesItems" 
          :key="item.id" 
          class="item-card"
          @click="openItemDetail(item)"
        >
          <div class="image-wrapper">
            <img :src="item.image" :alt="item.title" loading="lazy" />
            <div class="hover-overlay">
              <span class="explore-text">Explore</span>
            </div>
          </div>

          <div class="info-wrapper">
            <h3 class="item-title">{{ item.title }}</h3>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="not-found">
      <p>Series not found.</p>
    </div>

    <TheFooter />
  </div>
</template>

<script>
import TheNavbar from '@/components/common/TheNavbar.vue';
import TheFooter from '@/components/common/TheFooter.vue';
import { fetchProductSeriesById, fetchProductsBySeriesId } from '@/api/products';
import gsap from 'gsap';

export default {
  name: 'SeriesDetail',
  components: { TheNavbar, TheFooter },
  props: ['id'],
  data() {
    return {
      seriesInfo: null,
      productList: [],
      loading: false,
      error: null,
    };
  },
  computed: {
    currentSeries() {
      return this.seriesInfo;
    },
    seriesItems() {
      if (!this.productList.length) return [];
      const locale = this.$i18n.locale;
      return this.productList.map(item => ({
        id: item.id,
        image: item.coverImage,
        title: item[locale].name,
        location: item[locale].location,
        type: item[locale].type,
      }));
    }
  },
  watch: {
    // 路由参数变化时重新加载（同组件复用场景）
    '$route.params.id': {
      handler(newId) {
        if (newId) this.loadData(newId);
      }
    },
    seriesItems(val) {
      if (val.length > 0) {
        this.$nextTick(() => {
          gsap.from('.item-card', {
            y: 40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.2,
          });
        });
      }
    }
  },
  methods: {
    openItemDetail(item) {
      this.$router.push({
        name: 'ProductDetail',
        params: {
          seriesId: String(this.id),
          itemId: String(item.id),
        }
      });
    },
    async loadData(id) {
      this.loading = true;
      this.error = null;
      this.seriesInfo = null;
      this.productList = [];
      try {
        const [series, products] = await Promise.all([
          fetchProductSeriesById(id),
          fetchProductsBySeriesId(id),
        ]);
        this.seriesInfo = series;
        this.productList = products;
      } catch (err) {
        this.error = err.message;
        console.error('[SeriesDetail] 获取数据失败:', err);
      } finally {
        this.loading = false;
      }
      window.scrollTo(0, 0);
    }
  },
  created() {
    this.loadData(this.id);
  }
};
</script>

<style lang="scss" scoped>
.series-detail-page {
  background-color: #ffffff;
  min-height: 100vh;
  padding-top: 100px; // 留出导航栏高度
}

// 复用 Products.vue 的导航样式
::v-deep .force-light-nav {
  background-color: #ffffff !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  padding: 20px 60px !important;
  color: #333333 !important;
  .logo-img { filter: invert(1) brightness(0.2); }
  .underline { background-color: #333333 !important; }
  .lang-switch { border-color: #ccc !important; color: #333 !important; }
  
  @media screen and (max-width: 768px) {
    padding: 15px 20px !important;
  }
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

.main-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 100px 120px;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
  
  h1 {
    font-size: 28px;
    font-weight: 500;
    letter-spacing: 1px;
    margin-bottom: 10px;
    text-transform: uppercase;
  }
  .subtitle {
    color: #666;
    font-size: 16px;
  }
}

// 网格布局核心
.items-grid {
  display: grid;
  // 桌面端 4 列布局，符合设计图视觉
  grid-template-columns: repeat(4, 1fr); 
  gap: 60px 30px; // 行间距 60px，列间距 40px
}

.item-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;

  .image-wrapper {
    position: relative;
    width: 90%;
    aspect-ratio: 3 / 4; // 竖向长方形比例，符合设计图
    background-color: #f4f4f4;
    overflow: hidden;
    margin-bottom: 24px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .hover-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.2);
      opacity: 0;
      transition: opacity 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      .explore-text {
        color: #fff;
        border: 1px solid #fff;
        padding: 6px 14px;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    }
  }

  .info-wrapper {
    text-align: center;

    .item-title {
      font-size: 16px;
      font-weight: 500; // 这里的 bold 不宜太重，Contemporary 风格通常是 Medium
      color: #333;
      margin: 0 0 8px;
    }

    .item-meta {
      font-size: 12px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      
      .divider { margin: 0 6px; color: #ccc; }
    }
  }

  // Hover 效果
  &:hover {
    .image-wrapper img {
      transform: scale(1.05);
    }
    .image-wrapper .hover-overlay {
      opacity: 1;
    }
  }
}

.not-found {
  text-align: center;
  padding: 100px;
  font-size: 20px;
  color: #999;
}

// 移动端适配
@media screen and (max-width: 1024px) {
  .items-grid {
    grid-template-columns: repeat(2, 1fr); // 平板 2 列
    gap: 40px 20px;
  }
}

@media screen and (max-width: 768px) {
  .series-detail-page {
    padding-top: 80px;
  }
  
  .main-content {
    padding: 30px 20px 80px;
  }

  .page-header {
    margin-bottom: 40px;
    h1 { font-size: 24px; }
  }

  .items-grid {
    grid-template-columns: 1fr; // 手机 1 列
    gap: 50px;
  }

  .item-card {
    .image-wrapper {
      margin-bottom: 16px;
    }
  }
}
</style>