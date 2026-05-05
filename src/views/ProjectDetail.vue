<template>
  <div>
  <div v-if="loading" class="page-loading">Loading...</div>
  <div v-else-if="error" class="page-error">{{ error }}</div>
  <div class="project-detail-page" v-else-if="currentProject">
    <TheNavbar :is-visible="true" class="fixed-top-nav" />

    <header class="hero-section" :style="heroStyle">
      <div class="hero-content-wrapper">
        <h1 class="hero-title">{{ currentProject.title }}</h1>
        <div class="hero-intro-box">
          <p class="intro-text">{{ currentProject.intro }}</p>
        </div>
        <div class="hero-meta">
          <div class="meta-group">
            <span class="label">Location</span>
            <span class="value">{{ currentProject.location }}</span>
          </div>
          <div class="meta-group">
            <span class="label">Date</span>
            <span class="value">{{ currentProject.date }}</span>
          </div>
          <div class="meta-group">
            <span class="label">Type</span>
            <span class="value">{{ currentProject.type }}</span>
          </div>
        </div>
      </div>
      <div class="scroll-arrow">↓</div>
    </header>

    <div class="content-container">
      <div class="gallery-grid">
        <aside class="grid-col col-left">
          <div v-for="(item, i) in currentProject.leftContent" :key="i" class="left-item">
            <p v-if="item.type === 'text'" class="text-para" v-html="item.content"></p>
            <div v-else class="img-box detail-card">
              <img :src="item.src" alt="Detail" loading="lazy" decoding="async" referrerpolicy="no-referrer" />
              <div class="detail-info">
                <span class="img-name">{{ item.name }}</span>
                <span class="img-meta">{{ item.meta }}</span>
              </div>
            </div>
          </div>
        </aside>

        <main class="grid-col col-center">
          <div 
            v-for="(img, idx) in currentProject.mainImages" 
            :key="`m-${idx}`" 
            class="img-box portrait-large"
          >
            <img :src="img.src" alt="Main View" loading="lazy" decoding="async" referrerpolicy="no-referrer" />
          </div>
        </main>

        <aside class="grid-col col-right sticky-col"
        ref="rightCol" 
        :style="{ top: rightStickyTop }"
        >
          <div class="content-wrapper">
            <div v-for="(img, idx) in currentProject.rightImages" :key="`r-${idx}`">
              <div v-if="img.spacer" :style="{ height: img.height }"></div>
              <div v-else class="img-box detail-card">
                <img :src="img.src" alt="Detail" loading="lazy" decoding="async" />
                <div class="detail-info">
                  <span class="img-name">{{ img.name }}</span>
                  <span class="img-meta">{{ img.meta }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <div class="other-projects-section">
      <h3 class="section-title">Other Selected Projects</h3>
      
      <div class="carousel-container">
        
        <button class="nav-btn prev" @click="prevSlide" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div 
          class="carousel-window" 
          @mouseenter="pauseAutoPlay" 
          @mouseleave="startAutoPlay"
        >
          <div class="carousel-track" :style="trackStyle">
            <div 
                v-for="(p, index) in carouselList" 
                :key="`slide-${index}`" 
                class="project-slide-card"
                @click="goToDetail(p.id)"
            >
                <div class="slide-img-wrapper">
                <img :src="p.coverImage" loading="lazy" decoding="async" referrerpolicy="no-referrer" />
                <div class="hover-overlay">
                    <span>VIEW</span>
                </div>
                </div>
            </div>
          </div>
        </div>

        <button class="nav-btn next" @click="nextSlide" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        
      </div>
    </div>

    <TheFooter />
  </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/common/TheNavbar.vue';
import TheFooter from '@/components/common/TheFooter.vue';
import { fetchProjects } from '@/api/projects.js';
import gsap from 'gsap';

export default {
  name: 'ProjectDetail',
  components: { TheNavbar, TheFooter },
  data() {
    return {
      allProjects: [],
      rawProject: null,
      loading: false,
      error: null,
      slideIndex: 0,
      itemsPerSlide: 3,
      autoplayTimer: null,
      isResetting: false,
      isAnimating: false,
      rightStickyTop: '0px',
      resizeObserver: null
    };
  },
  computed: {
    currentProject() {
      if (!this.rawProject) return null;
      const locale = this.$i18n.locale;
      const content = this.rawProject[locale];
      return {
        id: this.rawProject.id,
        coverImage: this.rawProject.coverImage,
        ...content
      };
    },
    heroStyle() {
      if (!this.currentProject || !this.currentProject.coverImage) return {};
      
      const imgUrl = this.currentProject.coverImage;
      
      return {
        // 自上而下渐暗：底部内容为 flex-end，加重下半区遮罩以突出标题与介绍
        backgroundImage: `linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.26) 0%,
          rgba(0, 0, 0, 0.36) 40%,
          rgba(0, 0, 0, 0.5) 72%,
          rgba(0, 0, 0, 0.5) 100%
        ), url(${imgUrl})`
      };
    },
    // 【新增】获取“其他项目”列表（过滤掉当前项目）
    otherProjects() {
      if (!this.rawProject) return [];
      return this.allProjects.filter(p => p.id !== this.rawProject.id && p.isSelected);
    },
    // 【修改】动态控制过渡效果
    trackStyle() {
      const percent = -(100 / this.itemsPerSlide) * this.slideIndex;
      return { 
        transform: `translateX(${percent}%)`,
        // 当正在重置(isResetting)时，取消过渡动画，实现瞬间跳变
        transition: this.isResetting ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
      };
    },
    // 【核心修改】构造双向循环列表
    carouselList() {
      if (this.otherProjects.length === 0) return [];
      
      // 1. 克隆最后几张放在开头 (用于处理 "第一张 -> 上一张")
      const clonesStart = this.otherProjects.slice(-this.itemsPerSlide);
      
      // 2. 克隆最前几张放在末尾 (用于处理 "最后一张 -> 下一张")
      const clonesEnd = this.otherProjects.slice(0, this.itemsPerSlide);
      
      // 结构: [克隆尾巴, ...真身..., 克隆头部]
      return [...clonesStart, ...this.otherProjects, ...clonesEnd];
    },
  },
  watch: {
    // 【新增】监听路由变化：从 项目A 跳到 项目B 时需要重新加载数据
    '$route.params.id': {
      immediate: true,
      async handler(newId) {
        await this.ensureProjectsLoaded();
        this.loadProject(newId);
      }
    }
  },
  methods: {
    async ensureProjectsLoaded() {
      if (this.allProjects.length > 0) return;
      this.loading = true;
      try {
        this.allProjects = await fetchProjects();
      } catch (e) {
        this.error = e.message;
        console.error('[ProjectDetail] Failed to fetch projects:', e);
      } finally {
        this.loading = false;
      }
    },
    loadProject(id) {
      this.rawProject = this.allProjects.find(p => p.id === id) || this.allProjects[0] || null;
      // 【修改】重置时，也要重置到 itemsPerSlide，而不是 0
      this.$nextTick(() => {
         this.resetCarouselPos();
      });
      
      this.$nextTick(() => {
        gsap.from('.hero-content-wrapper', {
          y: 50, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.2
        });
      });
    },
    // 获取列表里的标题（根据当前语言）
    getProjectTitle(p) {
      const locale = this.$i18n.locale;
      return p[locale] ? p[locale].title : '';
    },
    getProjectCategory(p) {
      const locale = this.$i18n.locale;
      return p[locale] ? p[locale].type : '';
    },
    // 【新增】复用重置位置逻辑
    resetCarouselPos() {
       this.isResetting = true; //以此禁止动画
       this.slideIndex = this.itemsPerSlide; // 瞬间定位到“真·第一张”
       setTimeout(() => {
         this.isResetting = false; // 恢复动画
       }, 50);
    },
    nextSlide() {
      if (this.isAnimating) return;
      
      const realCount = this.otherProjects.length;
      
      this.slideIndex++;
      this.isAnimating = true;

      // 检查边界：到了末尾的克隆区（视觉上的第一张）
      // 现在的结构是 [CloneEnd(3), Real(N), CloneStart(3)]
      // RealFirst 的索引是 3 (itemsPerSlide)
      // RealLast  的索引是 3 + N - 1
      // CloneStart 的第一张索引是 3 + N
      if (this.slideIndex === this.itemsPerSlide + realCount) {
        setTimeout(() => {
          this.isResetting = true;
          // 瞬间跳回“真·第一张”
          this.slideIndex = this.itemsPerSlide;
          setTimeout(() => {
            this.isResetting = false;
            this.isAnimating = false;
          }, 50);
        }, 600);
      } else {
        setTimeout(() => {
          this.isAnimating = false;
        }, 600);
      }
    },

    // 【核心修改】上一张逻辑
    prevSlide() {
      if (this.isAnimating) return;
      
      const realCount = this.otherProjects.length;
      
      this.slideIndex--;
      this.isAnimating = true;

      // 检查边界：到了开头的克隆区（视觉上的最后一张）
      // 索引 0 是 CloneEnd 的第一张，视觉上它等于 RealLast
      if (this.slideIndex === 0) {
        setTimeout(() => {
          this.isResetting = true;
          // 瞬间跳回“真·最后一张”
          // 索引 = itemsPerSlide + realCount - itemsPerSlide (抵消了) = realCount ? 
          // 不对，RealLast 的索引是 itemsPerSlide + realCount - 1
          // 让我们算一下：
          // 0 位置的内容 = RealLast 的内容。
          // RealLast 的位置 = itemsPerSlide + realCount - 1? 
          // 比如: [C, A, B, C, A]. items=1, count=3. 
          // Real: A(1), B(2), C(3). 
          // Prev -> 0 (C). Jump to 3 (C). Correct.
          
          this.slideIndex = realCount; 
          
          setTimeout(() => {
            this.isResetting = false;
            this.isAnimating = false;
          }, 50);
        }, 600);
      } else {
        setTimeout(() => {
          this.isAnimating = false;
        }, 600);
      }
    },

    // 新增：开始自动播放
    startAutoPlay() {
      // 防止重复开启
      if (this.autoplayTimer) clearInterval(this.autoplayTimer);
      // 每 3 秒切换一次
      this.autoplayTimer = setInterval(() => {
        this.nextSlide();
      }, 3000);
    },

    // 新增：暂停自动播放
    pauseAutoPlay() {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    },
    goToDetail(id) {
      this.$router.push({ name: 'ProjectDetail', params: { id: id } });
    },
    // 【修改】响应式检查
    checkResponsive() {
      // 记录之前的 itemsPerSlide 以便判断是否变化
      const oldItems = this.itemsPerSlide;
      
      if (window.innerWidth < 768) {
        this.itemsPerSlide = 1;
      } else {
        this.itemsPerSlide = 3;
      }
      
      // 如果屏幕变化，重置位置
      if (oldItems !== this.itemsPerSlide) {
        this.resetCarouselPos();
      }
    },
// 【新增】初始化尺寸监听
    initStickyObserver() {
      // 创建一个观察者，当元素高度变化时（比如图片加载完成），重新计算 top
      this.resizeObserver = new ResizeObserver(() => {
        this.calculateStickyPos();
      });

      // 只观察右侧边栏（左侧文字已独立 sticky，无需动态计算）
      if (this.$refs.rightCol) this.resizeObserver.observe(this.$refs.rightCol);
      
      // 立即计算一次
      this.calculateStickyPos();
    },

    calculateStickyPos() {
      const windowHeight = window.innerHeight;
      const bottomMargin = 50;

      if (this.$refs.rightCol) {
        const height = this.$refs.rightCol.offsetHeight;
        const top = windowHeight - height - bottomMargin;
        this.rightStickyTop = `${top}px`;
      }
    },
  },
  mounted() {
    // 监听窗口大小以调整轮播显示数量
    this.checkResponsive();
    window.addEventListener('resize', this.checkResponsive);

    // 启动自动播放
    this.startAutoPlay();
    // 确保初始位置正确
    this.resetCarouselPos();
// 【新增】启动侧边栏高度监听
    this.initStickyObserver();
    
    // 额外监听窗口大小改变，重新计算
    window.addEventListener('resize', this.calculateStickyPos);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkResponsive);
    // 销毁组件时清除定时器，防止内存泄漏
    this.pauseAutoPlay();
    window.removeEventListener('resize', this.calculateStickyPos);
    
    // 【新增】销毁观察者
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
};
</script>

<style lang="scss" scoped>
.page-loading,
.page-error {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #999;
  letter-spacing: 1px;
}

.project-detail-page {
  background-color: #ffffff;
  color: #1a1a1a;
  min-height: 100vh;
}

// 导航栏固定定位
// 修改点 2: 删除了之前强制修改颜色的样式，只保留定位
.fixed-top-nav {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
  // 此时没有背景色，背景透明，文字默认白色，正好显示在 #3f3f3f 上
}

// === Hero Section ===
.hero-section {
  height: 100vh;
  width: 100%;
  padding: 120px 60px 80px; 
  box-sizing: border-box;
  
  // 修改点 3: 背景色改为深灰，文字改为白色
  background-color: #3f3f3f; 
  color: #ffffff;

  display: flex;
  flex-direction: column;
  justify-content: flex-end; // 垂直到底
  align-items: flex-start;   // 水平到左
  text-align: left;
  position: relative;

  background-size: cover;
  background-position: center;
}

.hero-content-wrapper {
  max-width: 600px;
}

.hero-title {
  font-size: 40px;
  font-weight: 300;
  margin-bottom: 30px;
  line-height: 1.1;
  letter-spacing: -1px;
}

.hero-intro-box {
  margin-bottom: 50px;
  .intro-text {
    font-size: 18px;
    line-height: 1.6;
    // 修改点 4: 辅助文字颜色变浅，确保对比度
    color: #e0e0e0; 
    font-weight: 400;
  }
}

.hero-meta {
  display: flex;
  justify-content: flex-start;
  gap: 60px;
  // 修改点 5: 边框线改为半透明白，适配深底
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 20px;
  width: 100%;

  .meta-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
    
    .label {
      font-size: 10px;
      text-transform: uppercase;
      // 修改点 6: 标签颜色变浅灰
      color: #aaaaaa;
      letter-spacing: 1px;
    }
    .value {
      font-size: 13px;
      font-weight: 500;
    }
  }
}

.scroll-arrow {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  // 修改点 7: 箭头颜色变浅
  color: rgba(255, 255, 255, 0.4);
  animation: bounce 2s infinite;
}

// === 核心内容区 (保持原样) ===
.content-container {
  max-width: 1600px;
  margin: 0 auto;
  // 稍微减小左右边距，把空间留给中间的内容
  padding: 0 40px 60px;
  margin-top: 50px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: 260px 1fr 260px; 
  gap: 60px;
  align-items: start;
}

// CSS Grid sticky 侧栏的标准写法：
// 父级 align-items: start，子级 position: sticky + top 值
.col-left {
  position: sticky;
  top: 90px;
  height: fit-content;
}

.sticky-col {
  position: sticky;
  height: fit-content;
}

.grid-col {
  display: flex;
  flex-direction: column;
}

.img-box {
  width: 100%;
  margin-bottom: 40px;
  img { width: 100%; height: auto; display: block; }
}

.text-para {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 10px;
}

.detail-card .detail-info {
  margin-top: 12px;
  text-align: left;
  .img-name { display: block; font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .img-meta { font-size: 12px; color: #888; }
}

.footer-nav {
  margin-top: 120px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
  padding-top: 60px;
  .back-link {
    font-size: 14px;
    color: #000;
    text-decoration: none;
    border-bottom: 1px solid #000;
    padding-bottom: 4px;
    &:hover { opacity: 0.6; }
  }
}
// 底部轮播图样式
.other-projects-section {
  max-width: 1600px;
  margin: 0 auto;
  padding: 100px 60px 150px;
  border-top: 1px solid #f0f0f0;

  // 1. 标题居中
  .section-title {
    font-size: 24px;
    font-weight: 300;
    letter-spacing: -0.5px;
    color: #000;
    text-align: center; // 居中
    margin-bottom: 60px;
  }

  // 3. 左右按钮在两侧的容器布局
  .carousel-container {
    display: flex;
    align-items: center; // 垂直居中
    gap: 30px; // 按钮和图片之间的间距
    position: relative;
  }

  // 按钮样式
  .nav-btn {
    width: 50px; height: 50px;
    border: 1px solid #eee;
    background: #fff;
    border-radius: 50%; // 圆形
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    color: #333;
    flex-shrink: 0; // 防止按钮被压缩
    z-index: 2;

    &:hover {
      border-color: #000;
      background: #000;
      color: #fff;
    }
    
    svg { display: block; }
  }

  // 视窗样式
  .carousel-window {
    width: 100%;
    overflow: hidden;
    // 增加 padding 防止 hover 时阴影被切掉（可选）
    padding: 10px 0; 
  }

  .carousel-track {
    display: flex;
    width: 100%;
  }

  .project-slide-card {
    flex: 0 0 33.33%; // 电脑端显示3个
    padding: 0 15px; // 图片之间的间距 (左右各15=30px gap)
    box-sizing: border-box;
    cursor: pointer;

    .slide-img-wrapper {
      width: 100%;
      height: 400px; // 稍微调高一点，因为没有文字了
      background-color: #f5f5f5;
      overflow: hidden;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;
      }

      .hover-overlay {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
        
        span {
          color: #fff;
          font-size: 12px;
          letter-spacing: 2px;
          border: 1px solid #fff;
          padding: 10px 25px;
        }
      }
    }

    &:hover {
      .slide-img-wrapper img { transform: scale(1.05); }
      .hover-overlay { opacity: 1; }
    }
  }
}
@keyframes bounce {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, 10px); }
}

// === 移动端适配 ===
@media screen and (max-width: 1200px) {
  .gallery-grid {
    grid-template-columns: 220px 1fr 220px;
    gap: 40px;
  }
}

@media screen and (max-width: 1024px) {
  // 手机/窄屏恢复单列
  .gallery-grid { 
    grid-template-columns: 1fr; 
    gap: 40px;
  }
  .sticky-col, .col-left { 
    position: static; 
  }
  .col-right { display: flex; order: 3; }
  .col-center { order: 2; }
  .col-left { order: 1; }
}

@media screen and (max-width: 768px) {
  .hero-section {
    padding: 100px 20px 40px;
    align-items: flex-start;
    justify-content: center;
  }
  
  .hero-content-wrapper { max-width: 100%; }
  .hero-title { font-size: 36px; }
  
  .content-container { padding: 0 20px 80px;margin-top: 30px; }
  
  .gallery-grid {
    display: flex;
    flex-direction: column;
  }
  
  .sticky-col { position: static; }
  
  .col-left { order: 1; }
  .col-center { order: 2; }
  .col-right { order: 3; display: flex; }
.other-projects-section {
    padding: 60px 20px 100px;
    
    .carousel-container {
      gap: 10px; // 手机上间距小一点
    }

    .nav-btn {
      width: 36px; height: 36px; // 手机上按钮小一点
      padding: 0;
      
      svg { width: 18px; height: 18px; }
    }

    .project-slide-card {
      flex: 0 0 100%; // 手机端显示1个
      padding: 0;
      
      .slide-img-wrapper {
        height: 250px; // 手机上高度减小
      }
    }
  }
}
</style>
