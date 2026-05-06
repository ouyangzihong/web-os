<template>
  <div class="industries-page">
    <TheNavbar />

    <div 
      v-for="(item, index) in industryItems" 
      :key="index"
      class="industry-section"
      :class="[
        `align-${item.align}`, 
        { 'is-visible': visibleSections.includes(index) } 
      ]"
      :style="{ backgroundImage: `url(${item.image})` }"
      ref="sections"
    >
      <div class="overlay"></div>

      <div class="content-wrapper">
        <div class="content-inner">
          <div class="decoration-text fade-item">
            {{ $t('industries.realScene') }}
          </div>

          <h2 class="main-title fade-item">{{ $t(`industries.${item.key}.title`) }}</h2>

          <div class="tags fade-item">
            {{ $t(`industries.${item.key}.tags`) }}
          </div>

          <div class="cta-container fade-item">
            <a @click.prevent="handleCtaClick" class="cta-link">
              <span class="cta-text">{{ $t(`industries.${item.key}.cta`) }}</span>
              <span class="cta-arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script>
// [关键] 引入公共组件
import TheNavbar from '@/components/common/TheNavbar.vue';
import TheFooter from '@/components/common/TheFooter.vue';

// 引入图片资源
import imgVillas from '@/assets/images/industries/Industries001.webp'
import imgHotels from '@/assets/images/industries/Industries002.webp'
import imgShowroom from '@/assets/images/industries/Industries003.webp'
import imgOffice from '@/assets/images/industries/Industries004.webp'

export default {
  name: 'Industries',
  components: {
    TheNavbar, // [关键] 注册导航
    TheFooter  // [关键] 注册页脚
  },
  data() {
    return {
      visibleSections: [],
      industryItems: [
        { 
          key: 'villas', 
          image: imgVillas, 
          align: 'left',
          link: '/projects?filter=residential' 
        },
        { 
          key: 'hotels', 
          image: imgHotels, 
          align: 'right', 
          link: '/projects?filter=hospitality'
        },
        { 
          key: 'showroom', 
          image: imgShowroom, 
          align: 'left',
          link: '/projects?filter=commercial'
        },
        // { 
        //   key: 'office', 
        //   image: imgOffice, 
        //   align: 'right',
        //   link: '/projects?filter=office'
        // }
      ]
    }
  },
  mounted() {
    // 页面加载时滚动到顶部，防止停留在奇怪的位置
    window.scrollTo(0, 0);
    this.setupObserver();
  },
  beforeDestroy() {
    if (this.observer) this.observer.disconnect();
  },
  methods: {
    setupObserver() {
      const options = {
        threshold: 0.3 
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = this.$refs.sections.indexOf(entry.target);
            if (index !== -1 && !this.visibleSections.includes(index)) {
              this.visibleSections.push(index);
            }
          }
        });
      }, options);

      this.$refs.sections.forEach(section => {
        this.observer.observe(section);
      });
    },
    handleCtaClick() {
      this.$router.push({ name: 'Contact' });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.industries-page {
  width: 100%;
  background-color: $bg-color;
  // 不需要 padding-top，因为第一屏是全屏沉浸式的，导航栏悬浮在它上面
}

.industry-section {
  position: relative;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  display: flex;
  align-items: flex-end;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.15);
    z-index: 1;
  }

  .content-wrapper {
    position: relative;
    z-index: 2;
    width: 100%;
    padding: 0 80px 120px 80px; // 底部留出空间，避免过于贴底
    box-sizing: border-box;
    display: flex;
  }

  &.align-left .content-wrapper { justify-content: flex-start; }
  &.align-right .content-wrapper { 
    justify-content: flex-end; 
    text-align: right;
    .cta-container { justify-content: flex-end; }
  }

  .content-inner {
    max-width: 600px;
    color: #fff;
  }

  // --- Typography ---
  .decoration-text {
    font-size: 13px;
    letter-spacing: 3px;
    text-transform: uppercase;
    opacity: 0.8;
    margin-bottom: 24px;
    font-weight: 500;
  }

  .main-title {
    font-size: 56px; // 稍微调大一点，更有气势
    font-weight: 300; // 细体更高级
    margin-bottom: 20px;
    letter-spacing: 1px;
    line-height: 1.1;
  }

  .tags {
    font-size: 16px;
    font-weight: 400;
    opacity: 0.9;
    margin-bottom: 48px;
    letter-spacing: 1px;
    font-family: $font-main;
  }

  // --- CTA Button ---
  .cta-link {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    transition: all 0.3s ease;
    border-bottom: 1px solid rgba(255,255,255,0.3);
    padding-bottom: 8px;

    &:hover {
      opacity: 1;
      border-bottom-color: #fff;
      padding-right: 10px; // hover 时稍微向右拉伸一点
      
      .cta-arrow { transform: translateX(5px); }
    }

    .cta-arrow {
      margin-left: 12px;
      font-size: 18px;
      transition: transform 0.3s ease;
    }
  }

  // --- Animations ---
  .fade-item {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 1s ease, transform 1s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  &.is-visible {
    .fade-item:nth-child(1) { transition-delay: 0.1s; opacity: 1; transform: translateY(0); }
    .main-title { transition-delay: 0.2s; opacity: 1; transform: translateY(0); }
    .tags { transition-delay: 0.35s; opacity: 1; transform: translateY(0); }
    .cta-container { transition-delay: 0.5s; opacity: 1; transform: translateY(0); }
  }
}

// --- Mobile Responsive ---
@media screen and (max-width: 768px) {
  .industry-section {
    .content-wrapper {
      padding: 0 30px 80px 30px;
      justify-content: flex-start !important;
      text-align: left !important;
    }

    // 移动端强制左对齐
    &.align-right .content-wrapper .cta-container { justify-content: flex-start; }

    .main-title { font-size: 36px; }
    .tags { font-size: 14px; margin-bottom: 30px; }
    .decoration-text { margin-bottom: 16px; }
  }
}
</style>