<template>
  <div class="home-container">
    <TheNavbar :is-visible="true" />
    
    <div class="sections-wrapper">
      <div class="section-panel" ref="section0">
        <HeroSection />
      </div>

      <div class="section-panel" ref="section1">
        <ServicesSection :is-active="currentIndex === 1" />
      </div>

      <div class="section-panel" ref="section2">
        <ProcessSection :is-active="currentIndex === 2" />
      </div>

      <div class="section-panel" ref="section3">
        <ShowcaseSection01 :is-active="currentIndex === 3" />
      </div>
      
      <div class="section-panel" ref="section4">
        <ShowcaseSection02 :is-active="currentIndex === 4" />
      </div>

      <div class="section-panel" ref="section5">
        <ShowcaseSection03 :is-active="currentIndex === 5" />
      </div>

      <div class="section-panel" ref="section6">
        <ContactSection :is-active="currentIndex === 6" />
      </div>
    </div>
    
    <TheFooter />
  </div>
</template>

<script>
import { fetchProjects } from '@/api/projects';
import { fetchProductSeries, fetchProducts } from '@/api/products';
import TheNavbar from '@/components/common/TheNavbar.vue';
import TheFooter from '@/components/common/TheFooter.vue';
import HeroSection from '@/components/home/HeroSection.vue';
import ServicesSection from '@/components/home/ServicesSection.vue';
import ProcessSection from '@/components/home/ProcessSection.vue';
import ShowcaseSection01 from '@/components/home/ShowcaseSection01.vue';
import ShowcaseSection02 from '@/components/home/ShowcaseSection02.vue';
import ShowcaseSection03 from '@/components/home/ShowcaseSection03.vue';
import ContactSection from '@/components/home/ContactSection.vue';

export default {
  name: 'HomeView',
  components: { 
    TheNavbar, 
    TheFooter,
    HeroSection, 
    ServicesSection, 
    ProcessSection, 
    ShowcaseSection01,
    ShowcaseSection02,
    ShowcaseSection03,
    ContactSection
  },
  data() {
    return {
      currentIndex: 0,
      observer: null
    };
  },
  mounted() {
    this.initIntersectionObserver();
    this.__testDirectusProjects();
    this.__testDirectusProductSeries();
    this.__testDirectusProducts();
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    // ── 临时测试方法：验证 Directus 各接口是否可用 ────────────────────────
    // 测试完成后可删除这三个方法及 mounted 中的对应调用
    async __testDirectusProjects() {
      console.group('[Directus Test] projects');
      try {
        const projects = await fetchProjects();
        console.log(`✅ 成功！共 ${projects.length} 个项目`);
        console.log('第一个项目（转换后）:', projects[0]);
      } catch (err) {
        console.error('❌ 失败:', err.message);
      }
      console.groupEnd();
    },
    async __testDirectusProductSeries() {
      console.group('[Directus Test] product_series');
      try {
        const series = await fetchProductSeries();
        console.log(`✅ 成功！共 ${series.length} 个产品系列`);
        console.log('第一个系列（转换后）:', series[0]);
        console.log('完整数据:', series);
      } catch (err) {
        console.error('❌ 失败:', err.message);
      }
      console.groupEnd();
    },
    async __testDirectusProducts() {
      console.group('[Directus Test] products');
      try {
        const products = await fetchProducts();
        console.log(`✅ 成功！共 ${products.length} 个产品`);
        console.log('第一个产品（转换后）:', products[0]);
        console.log('完整数据:', products);
      } catch (err) {
        console.error('❌ 失败:', err.message);
      }
      console.groupEnd();
    },
    // ─────────────────────────────────────────────────────────────────────

    initIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4 
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target === this.$refs.section0) this.currentIndex = 0;
            else if (entry.target === this.$refs.section1) this.currentIndex = 1;
            else if (entry.target === this.$refs.section2) this.currentIndex = 2;
            else if (entry.target === this.$refs.section3) this.currentIndex = 3;
            else if (entry.target === this.$refs.section4) this.currentIndex = 4;
            else if (entry.target === this.$refs.section5) this.currentIndex = 5;
            else if (entry.target === this.$refs.section6) this.currentIndex = 6;
          }
        });
      }, options);

      const sections = [
        this.$refs.section0, 
        this.$refs.section1, 
        this.$refs.section2, 
        this.$refs.section3, 
        this.$refs.section4,
        this.$refs.section5,
        this.$refs.section6
      ];
      
      sections.forEach(section => {
        if (section) this.observer.observe(section);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.home-container {
  position: relative; 
  width: 100%;
  min-height: 100vh;
  background-color: #000;
}

.sections-wrapper {
  position: relative;
  width: 100%;
}

.section-panel {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
