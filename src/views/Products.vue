<template>
  <div class="products-page">
    <TheNavbar :is-visible="true" class="force-light-nav" />

    <div class="main-container">
      <div v-if="loading" class="loading-state">Loading...</div>
      <div v-else-if="error" class="error-state">{{ error }}</div>
      <div v-else class="products-grid">
        <div 
          v-for="(item, index) in products" 
          :key="item.id" 
          class="product-card"
          ref="productCards"
          @click="handleCardClick(item.id)"
        >
          <div class="image-box">
            <img :src="item.coverImage" :alt="item.title" class="cover-img" />
            
            <div class="overlay">
              <span class="view-more">View Collection</span>
            </div>
          </div>

          <div class="text-box">
            <h2 class="card-title">{{ item.title }}</h2>
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script>
import TheNavbar from '@/components/common/TheNavbar.vue';
import TheFooter from '@/components/common/TheFooter.vue';
import { fetchProductSeries } from '@/api/products';
import gsap from 'gsap';

export default {
  name: 'ProductsView',
  components: { TheNavbar, TheFooter },
  data() {
    return {
      seriesList: [],
      loading: false,
      error: null,
    };
  },
  computed: {
    products() {
      const locale = this.$i18n.locale;
      return this.seriesList.map(item => ({
        id: item.id,
        coverImage: item.coverImage,
        title: item[locale].name,
      }));
    }
  },
  watch: {
    products(val) {
      if (val.length > 0) {
        this.$nextTick(() => {
          gsap.from('.product-card', {
            y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out'
          });
        });
      }
    }
  },
  methods: {
    handleCardClick(id) {
      this.$router.push({ name: 'SeriesDetail', params: { id: String(id) } });
    }
  },
  async created() {
    this.loading = true;
    this.error = null;
    try {
      this.seriesList = await fetchProductSeries();
    } catch (err) {
      this.error = err.message;
      console.error('[Products] 获取产品系列失败:', err);
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.products-page {
  background-color: #ffffff;
  min-height: 100vh;
  padding-top: 100px;
}

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

.main-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 60px 120px;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
  h1 {
    font-size: 32px;
    font-weight: 400;
    letter-spacing: 1px;
    color: #333;
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 60px 0px;
  justify-items: center; 
}

.product-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  width: 80%; // 保持缩小的宽度
  min-width: 360px; 

  .image-box {
    position: relative;
    width: 100%; 
    padding-bottom: 66.66%; 
    background-color: #f0f0f0;
    overflow: hidden;
    margin-bottom: 30px;

    .cover-img {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform 0.8s cubic-bezier(0.2, 1, 0.3, 1);
    }

    // 遮罩层
    .overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: rgba(0,0,0,0); // 默认全透明
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      transition: background-color 0.4s ease;

      .view-more {
        font-size: 13px; // 稍微调大一点点，更清晰
        letter-spacing: 1.5px;
        text-transform: uppercase;
        border: 1px solid rgba(255,255,255,0.8); // 加个细边框增加精致感（可选）
        padding: 8px 16px;
        
        // 初始隐藏状态
        opacity: 0;
        transform: translateY(15px);
        transition: all 0.4s ease;
      }
    }
  }

  // 悬停交互
  &:hover {
    .cover-img {
      transform: scale(1.05);
    }
    .overlay {
      background-color: rgba(0,0,0,0.3); // 悬停时遮罩颜色
      
      .view-more {
        opacity: 1;
        transform: translateY(0); // 上浮出现
      }
    }
  }

  .text-box {
    text-align: center;
    padding: 0 10px;

    .card-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 0 0 12px;
    }

    .card-desc {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
      max-width: 95%;
      margin: 0 auto 16px;
      min-height: 44px;
    }

    .card-meta {
      font-size: 12px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      
      .divider { margin: 0 8px; }
    }
  }
}

// 移动端适配
@media screen and (max-width: 768px) {
  .products-page {
    padding-top: 80px;
  }

  .main-container {
    padding: 20px 20px 80px;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 50px;
    justify-items: stretch;
  }

  .product-card {
    width: 100%;
    min-width: auto;
  }
  
}
</style>