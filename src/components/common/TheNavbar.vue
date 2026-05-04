<template>
  <nav 
    class="navbar" 
    ref="navbar" 
    :class="{ 
      'nav-scrolled': isScrolled,
      'navbar-hidden': !isVisible 
    }"
  >
    <div class="logo-container" @click="handleNavClick('/')" style="cursor: pointer;">
      <img src="@/assets/images/title-logo.png" alt="kairos Logo" class="logo-img" />
    </div>

    <div class="menu-items">
      <div 
        v-for="(item, index) in menuKeys" 
        :key="index" 
        class="menu-item"
        @mouseenter="hoverItem()"
        @mouseleave="resetItem()"
        @click="handleNavClick(item.path)" 
      >
        <span class="menu-text">{{ $t(`navbar.${item.key}`) }}</span>
        <div class="underline"></div>

        <div v-if="item.key === 'products'" class="dropdown-menu">
          <div class="dropdown-bridge"></div>
          <div class="dropdown-content">
            <div 
              v-for="series in productSeries" 
              :key="series.id" 
              class="dropdown-item"
              @click.stop="goToSeries(series.id)"
            >
              {{ getSeriesName(series) }}
            </div>
          </div>
        </div>
        </div>
    </div>

    <div class="lang-switch" @click="toggleLanguage">
      <span>{{ currentLangLabel }}</span>
    </div>
  </nav>
</template>

<script>
import gsap from 'gsap';
// [新增] 引入产品数据
import { productsData } from '@/data/products.js';

export default {
  name: 'TheNavbar',
  props: {
    isVisible: { type: Boolean, default: true }
  },
  data() {
    return {
      isScrolled: false,
      productSeries: productsData, // [新增] 绑定数据
      menuKeys: [
        { key: 'home', path: '/' },
        { key: 'about', path: '/about' },
        { key: 'products', path: '/products' },
        { key: 'projects', path: '/projects' },
        { key: 'industries', path: '/industries' },
        { key: 'contact', path: '/contact' }
      ]
    };
  },
  computed: {
    currentLangLabel() {
      return this.$i18n.locale === 'en' ? 'EN' : 'CN';
    },
    // [新增] 便捷获取当前语言
    locale() {
      return this.$i18n.locale;
    }
  },
  mounted() {
    gsap.from(this.$refs.navbar, {
      y: -100, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2,
      onComplete: () => { gsap.set(this.$refs.navbar, { clearProps: 'transform,opacity' }); }
    });
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    toggleLanguage() {
      const newLang = this.$i18n.locale === 'en' ? 'zh' : 'en';
      this.$i18n.locale = newLang;
      localStorage.setItem('app-language', newLang);
    },
    handleNavClick(path) {
      if (this.$route.path === path) return;
      this.$router.push(path).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          console.error(err);
        }
      });
    },
    // [新增] 跳转到系列详情页
    goToSeries(id) {
      this.$router.push({ name: 'SeriesDetail', params: { id } });
    },
    // [新增] 获取对应语言的系列名称
    getSeriesName(series) {
      return series[this.locale].seriesName;
    },
    hoverItem() {},
    resetItem() {}
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 60px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  box-sizing: border-box;
  
  background-color: transparent; 
  color: #ffffff; 
  transition: background-color 0.4s ease, padding 0.4s ease, box-shadow 0.4s ease, color 0.4s ease;

  &.navbar-hidden {
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
  }

  &.nav-scrolled {
    background-color: #ffffff;
    padding: 20px 60px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    color: #333333;

    .logo-container .logo-img { filter: invert(1) brightness(0.2); }
    .menu-items .menu-item .underline { background-color: #333333; }
    
    .lang-switch {
      border-color: #999;
      color: #333;
      &:hover { background: rgba(0,0,0,0.05); }
    }
  }

  .logo-container {
    .logo-img { 
      height: 30px; 
      width: auto; 
      transition: filter 0.4s ease; 
    }
  }

  .menu-items {
    display: flex;
    gap: 40px;
    
    .menu-item {
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      cursor: pointer; 
      position: relative; // 关键：为下拉菜单提供定位基准
      padding: 10px 0 2px 0;    // 增加一点点击热区
      
      .menu-text { 
        font-size: 14px; 
        font-weight: 500; 
        margin-bottom: 4px; 
        text-transform: uppercase; 
        transition: color 0.4s ease; 
      }
      
      .underline { 
        width: 0%; 
        height: 1px; 
        background-color: #ffffff; 
        position: absolute; 
        bottom: 5px; // 调整位置适应 padding
        transition: width 0.3s ease, background-color 0.4s ease; 
      }
      
      &:hover .underline { width: 100%; }

      // [新增] 下拉菜单样式
      .dropdown-menu {
        position: absolute;
        top: 100%; // 在菜单项正下方
        left: 50%;
        transform: translateX(-50%);
        padding-top: 10px; // 利用 padding 创建透明“桥梁”，防止鼠标移开时菜单消失
        
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 101;

        .dropdown-content {
          background-color: #ffffff;
          min-width: 160px;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          padding: 8px 0;
          overflow: hidden;
        }

        .dropdown-item {
          padding: 10px 20px;
          font-size: 13px;
          color: #333; // 始终保持深色文字，确保可读性
          text-align: center;
          white-space: nowrap;
          transition: background 0.2s;
          
          &:hover {
            background-color: #f5f5f5;
            color: #000;
          }
        }
      }

      // [新增] 悬浮触发显示
      &:hover .dropdown-menu {
        opacity: 1;
        visibility: visible;
        // 添加一个小位移动画
        transform: translateX(-50%) translateY(0);
      }
      // 默认让菜单稍微下移一点，配合 hover 产生上浮效果
      .dropdown-menu {
        transform: translateX(-50%) translateY(10px);
      }
    }
  }

  .lang-switch {
    font-size: 14px; 
    cursor: pointer; 
    font-weight: bold; 
    opacity: 0.8;
    border: 1px solid rgba(255,255,255,0.3); 
    padding: 4px 10px; 
    border-radius: 20px;
    transition: all 0.4s ease; 

    &:hover { 
      opacity: 1; 
      background: rgba(255,255,255,0.1); 
    }
  }

  /* --- 移动端适配 --- */
  @media screen and (max-width: 768px) {
    // ... (保持原有移动端样式不变)
    
    // 移动端通常不建议显示悬浮菜单，这里将其隐藏
    .menu-items .menu-item .dropdown-menu {
      display: none !important;
    }
  }
}
</style>