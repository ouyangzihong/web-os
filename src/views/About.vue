<template>
  <div class="about-page">
    <TheNavbar :is-visible="true" class="force-light-nav" />

    <div class="about-container">
      <!-- Hero Section -->
      <!-- <section class="section-hero fade-in">
        <div class="hero-image-wrapper">
          <img src="@/assets/images/AboutUs/1-01.webp" alt="About Hero" />
        </div>
      </section> -->

      <!-- Brand Intro Section -->
      <section class="section-brand-intro fade-in">
        <h2 class="brand-title">KAIROS</h2>
        <div class="brand-text-block">
          <p>At KAIROS, we believe that meaningful spaces are created when the right elements come together at the right moment. Guided by the idea of Kairos, we shape interiors through a thoughtful balance of design, material, and timing.</p>
          <p>We provide integrated soft furnishing and FF&amp;E solutions for residential, hospitality, and commercial spaces. From design coordination and specification to product development and realization, we bring together furniture, lighting, textiles, and accessories into cohesive interior compositions.</p>
          <p>Rooted in China's advanced manufacturing ecosystem, KAIROS combines design sensitivity with production precision — enabling high-quality customization, material consistency, and efficient project execution.</p>
          <p>Each project is approached as a unique composition. We collaborate closely with designers, developers, and brands to translate concepts into refined spatial experiences, where aesthetics, function, and individuality are seamlessly aligned.</p>
        </div>
        <div class="brand-hero-image">
          <img src="@/assets/images/AboutUs/1-01.webp" alt="KAIROS Interior" />
          <!-- <div class="brand-hero-overlay">
            <span class="brand-hero-sub">Beauty of Integrated Living</span>
            <span class="brand-hero-name">KAIROS</span>
          </div> -->
        </div>
      </section>

      <!-- INTEGRAL PARTS OF KAIROS Section -->
      <section class="section-team fade-in">
        <h2 class="team-title">INTEGRAL PARTS<br />OF KAIROS</h2>
        <div class="team-grid">
          <div
            v-for="(member, index) in teamMembers"
            :key="index"
            class="team-member"
          >
            <div class="member-photo">
              <img :src="member.photo" :alt="member.name" />
            </div>
            <p class="member-name">{{ member.name }}</p>
          </div>
        </div>
      </section>


      <!-- WHAT WE DO Section -->
      <section class="section-what-we-do fade-in">
        <h2 class="what-title">WHAT WE DO</h2>

        <div class="what-grid">
          <div class="what-cell">
            <div class="what-cell-inner">
              <div class="what-icon">
                <img src="@/assets/images/AboutUs/03-1.webp" alt="Design Coordination" />
              </div>
              <div class="what-text">
                <h3>Design Coordination</h3>
                <p>Every project begins with understanding. We work closely with clients and design teams to interpret spatial concepts, define aesthetic direction, and develop a cohesive soft furnishing strategy.</p>
              </div>
            </div>
          </div>
          <div class="what-cell">
            <div class="what-cell-inner">
              <div class="what-icon">
                <img src="@/assets/images/AboutUs/03-2.webp" alt="FF&E Curation" />
              </div>
              <div class="what-text">
                <h3>FF&amp;E Curation</h3>
                <p>We curate furniture, lighting, textiles, and accessories inspired by leading international brands — translating their design language into complete and harmonious interior compositions.</p>
              </div>
            </div>
          </div>
          <div class="what-cell">
            <div class="what-cell-inner">
              <div class="what-icon">
                <img src="@/assets/images/AboutUs/03-3.webp" alt="Material & Craft Development" />
              </div>
              <div class="what-text">
                <h3>Material &amp; Craft Development</h3>
                <p>Working with advanced manufacturing partners in China, we develop custom pieces that reflect the same level of craftsmanship, detailing, and material quality found in world-class furniture brands.</p>
              </div>
            </div>
          </div>
          <div class="what-cell">
            <div class="what-cell-inner">
              <div class="what-icon">
                <img src="@/assets/images/AboutUs/03-4.webp" alt="Custom Production" />
              </div>
              <div class="what-text">
                <h3>Custom Production</h3>
                <p>From bespoke furniture to tailored soft furnishings, each piece is carefully produced to ensure consistency in proportion, texture, and finish — aligning perfectly with the overall design vision.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="what-photos">
          <div class="what-photo">
            <img src="@/assets/images/AboutUs/03-5.webp" alt="Interior Project" />
          </div>
          <div class="what-photo">
            <img src="@/assets/images/AboutUs/03-6.webp" alt="Craft Detail" />
          </div>
        </div>
      </section>

      <!-- OUR APPROACH Section -->
      <section class="section-approach fade-in">
        <h2 class="approach-title">OUR APPROACH</h2>
        <div class="approach-list">
          <div
            v-for="(item, index) in approachItems"
            :key="index"
            class="approach-item"
          >
            <div class="approach-content">
              <h3 class="approach-item-title">{{ item.title }}</h3>
              <p class="approach-item-desc">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </section>


    </div>

    <!-- Projects Carousel -->
    <!-- <div class="other-projects-section">
      <h3 class="section-title">{{ $t('about.viewMore') }}</h3>

      <div class="carousel-container">
        <button class="nav-btn prev" @click="prevSlide" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div class="carousel-window" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">
          <div class="carousel-track" :style="trackStyle">
            <div
              v-for="(p, index) in carouselList"
              :key="`slide-${index}`"
              class="project-slide-card"
              @click="goToDetail(p.id)"
            >
              <div class="slide-img-wrapper">
                <img :src="p.coverImage" />
                <div class="hover-overlay">
                  <span>VIEW</span>
                </div>
                <div class="slide-info">
                  <span class="slide-title">{{ getProjectTitle(p) }}</span>
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
    </div> -->

    <TheFooter />
  </div>
</template>

<script>
import TheNavbar from '@/components/common/TheNavbar.vue';
import TheFooter from '@/components/common/TheFooter.vue';
import { projectsData } from '@/data/projects.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default {
  name: 'About',
  components: { TheNavbar, TheFooter },
  data() {
    return {
      approachItems: [
        {
          title: 'Design Coordination',
          desc: 'Every project begins with understanding. We work closely with clients and design teams to interpret spatial concepts, define aesthetic direction, and develop a cohesive soft furnishing strategy.'
        },
        {
          title: 'Craftsmanship & Detail Control',
          desc: 'Inspired by leading international furniture brands, we focus on precision in proportion, joinery, texture, and finishing. Each element is carefully developed and reviewed through sampling to ensure consistency and refinement.'
        },
        {
          title: 'Design-to-Manufacturing Translation',
          desc: 'Working with advanced manufacturing partners in China, we translate design intent into physical products with a high level of fidelity — matching the material quality and detailing of global design standards.'
        },
        {
          title: 'Trusted Production Network',
          desc: 'Backed by a strong network of premium factory resources, KAIROS integrates design expertise with reliable production capabilities. Each manufacturing partner is carefully selected based on craftsmanship, material quality, and production consistency — ensuring every product meets our standards and project requirements.'
        },
        {
          title: 'Integrated FF&E System',
          desc: 'We approach every project as a complete composition. Furniture, lighting, textiles, and accessories are curated and coordinated as a unified system — achieving balance, coherence, and spatial clarity.'
        },
        {
          title: 'Responsible & Sustainable Approach',
          desc: 'We believe sustainability begins with quality. By selecting certified materials, optimizing resources, and prioritizing durability, we reduce waste while supporting healthier interior environments.'
        }
      ],
      teamMembers: [
        { name: 'Scarlett Tam', photo: require('@/assets/images/AboutUs/02-1.webp') },
        { name: 'Cayou Chan',   photo: require('@/assets/images/AboutUs/02-2.webp') },
        { name: 'Connie Xu',    photo: require('@/assets/images/AboutUs/02-3.webp') },
        { name: 'June Chan',    photo: require('@/assets/images/AboutUs/02-4.webp') },
        { name: 'Daniel Wong',  photo: require('@/assets/images/AboutUs/02-5.webp') },
        { name: 'Emily Cheung', photo: require('@/assets/images/AboutUs/02-6.webp') },
        { name: 'Kevin Lau',    photo: require('@/assets/images/AboutUs/02-7.webp') },
        { name: 'Sophia Lee',   photo: require('@/assets/images/AboutUs/02-8.webp') }
      ],

      // Carousel
      slideIndex: 0,
      itemsPerSlide: 3,
      autoplayTimer: null,
      isResetting: false,
      isAnimating: false,
      selectedProjects: projectsData.slice(0, 5)
    };
  },
  computed: {
    carouselList() {
      if (this.selectedProjects.length === 0) return [];
      const clonesStart = this.selectedProjects.slice(-this.itemsPerSlide);
      const clonesEnd = this.selectedProjects.slice(0, this.itemsPerSlide);
      return [...clonesStart, ...this.selectedProjects, ...clonesEnd];
    },
    trackStyle() {
      const percent = -(100 / this.itemsPerSlide) * this.slideIndex;
      return {
        transform: `translateX(${percent}%)`,
        transition: this.isResetting ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
      };
    }
  },
  mounted() {
    window.scrollTo(0, 0);
    this.initAnimations();
    this.checkResponsive();
    window.addEventListener('resize', this.checkResponsive);
    this.resetCarouselPos();
    this.startAutoPlay();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkResponsive);
    this.pauseAutoPlay();
  },
  methods: {
    initAnimations() {
      const elements = document.querySelectorAll('.fade-in');
      elements.forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
      });
    },
    getProjectTitle(p) {
      const locale = this.$i18n.locale;
      return p[locale] ? p[locale].title : '';
    },
    goToDetail(id) {
      this.$router.push({ name: 'ProjectDetail', params: { id: id } });
    },
    checkResponsive() {
      const oldItems = this.itemsPerSlide;
      this.itemsPerSlide = window.innerWidth < 768 ? 1 : 3;
      if (oldItems !== this.itemsPerSlide) this.resetCarouselPos();
    },
    resetCarouselPos() {
      this.isResetting = true;
      this.slideIndex = this.itemsPerSlide;
      setTimeout(() => { this.isResetting = false; }, 50);
    },
    nextSlide() {
      if (this.isAnimating) return;
      this.slideIndex++;
      this.isAnimating = true;
      const realCount = this.selectedProjects.length;
      if (this.slideIndex === this.itemsPerSlide + realCount) {
        setTimeout(() => {
          this.isResetting = true;
          this.slideIndex = this.itemsPerSlide;
          setTimeout(() => { this.isResetting = false; this.isAnimating = false; }, 50);
        }, 600);
      } else {
        setTimeout(() => { this.isAnimating = false; }, 600);
      }
    },
    prevSlide() {
      if (this.isAnimating) return;
      this.slideIndex--;
      this.isAnimating = true;
      const realCount = this.selectedProjects.length;
      if (this.slideIndex === 0) {
        setTimeout(() => {
          this.isResetting = true;
          this.slideIndex = realCount;
          setTimeout(() => { this.isResetting = false; this.isAnimating = false; }, 50);
        }, 600);
      } else {
        setTimeout(() => { this.isAnimating = false; }, 600);
      }
    },
    startAutoPlay() {
      if (this.autoplayTimer) clearInterval(this.autoplayTimer);
      this.autoplayTimer = setInterval(() => { this.nextSlide(); }, 4000);
    },
    pauseAutoPlay() {
      if (this.autoplayTimer) { clearInterval(this.autoplayTimer); this.autoplayTimer = null; }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.about-page {
  background-color: #ffffff;
  min-height: 100vh;
  color: #1a1a1a;
  padding-top: 80px;
}

::v-deep .force-light-nav {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  background-color: #ffffff !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px 60px !important;
  color: #333333 !important;

  .logo-img { filter: invert(1) brightness(0.2); }
  .underline { background-color: #333333 !important; }
  .lang-switch { border-color: #ccc !important; color: #333 !important; }

  @media screen and (max-width: 768px) {
    padding: 15px 20px !important;
  }
}

.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 60px 120px;
}

// ── Hero ──────────────────────────────────────────────────────────────────────
.section-hero {
  margin-bottom: 100px;

  .hero-image-wrapper {
    width: 100%;
    height: 70vh;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
}

// ── Brand Intro ───────────────────────────────────────────────────────────────
.section-brand-intro {
  margin-bottom: 120px;
}

.brand-title {
  font-size: 26px;
  font-weight: 500;
  letter-spacing: 3px;
  text-align: center;
  color: #111;
  margin-bottom: 40px;
  margin-top: 40px;
}

.brand-text-block {
  margin: 0 30px 60px 30px;

  p {
    font-size: 14px;
    line-height: 1.9;
    color: #444;
    margin-bottom: 16px;

    &:last-child { margin-bottom: 0; }
  }
}

.brand-hero-image {
  position: relative;
  width: 100%;
  height: 75vh;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .brand-hero-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .brand-hero-sub {
    font-size: 13px;
    font-weight: 300;
    letter-spacing: 3px;
    color: #fff;
    font-style: italic;
  }

  .brand-hero-name {
    font-size: clamp(40px, 8vw, 80px);
    font-weight: 300;
    letter-spacing: 12px;
    color: #fff;
    font-family: 'Georgia', 'Times New Roman', serif;
    line-height: 1;
  }
}

// ── WHAT WE DO ────────────────────────────────────────────────────────────────
.section-what-we-do {
  margin-bottom: 120px;
}

.what-title {
  font-size: 28px;
  font-weight: 400;
  text-align: center;
  color: #111;
  margin-bottom: 40px;
}

.what-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 40px;
}

.what-cell {
  .what-cell-inner {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    padding: 44px 48px;
  }

  &:nth-child(1) {
    border-bottom: 1px solid #d8d8d8;
    border-right: 1px solid #d8d8d8;
  }
  &:nth-child(2) {
    border-bottom: 1px solid #d8d8d8;
    border-left: 1px solid #d8d8d8;
  }
  &:nth-child(3) {
    border-top: 1px solid #d8d8d8;
    border-right: 1px solid #d8d8d8;
  }
  &:nth-child(4) {
    border-top: 1px solid #d8d8d8;
    border-left: 1px solid #d8d8d8;
  }
}

.what-icon {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.what-text {
  h3 {
    font-size: 15px;
    font-weight: 600;
    color: #111;
    margin: 0 0 12px;
    line-height: 1.4;
  }

  p {
    font-size: 13px;
    line-height: 1.85;
    color: #555;
    margin: 0;
  }
}

.what-photos {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 16px;

  .what-photo {
    overflow: hidden;
    height: 460px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    &:hover img { transform: scale(1.04); }
  }
}

// ── OUR APPROACH ──────────────────────────────────────────────────────────────
.section-approach {
  margin-bottom: 120px;
}

.approach-title {
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 4px;
  text-align: center;
  margin-bottom: 60px;
  color: #111;
}

.approach-list {
  border-top: 1px solid #d8d8d8;
}

.approach-item {
  border-bottom: 1px solid #d8d8d8;
  padding: 36px 0;
}

.approach-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 60px;
  align-items: start;
}

.approach-item-title {
  font-size: 15px;
  font-weight: 600;
  color: #111;
  line-height: 1.5;
  margin: 0;
}

.approach-item-desc {
  font-size: 14px;
  line-height: 1.85;
  color: #555;
  margin: 0;
}

// ── INTEGRAL PARTS OF KAIROS ──────────────────────────────────────────────────
.section-team {
  margin-bottom: 80px;
}

.team-title {
  font-size: 26px;
  font-weight: 500;
  letter-spacing: 1px;
  text-align: center;
  line-height: 1.4;
  margin-bottom: 60px;
  color: #111;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px 24px;
}

.team-member {
  .member-photo {
    width: 100%;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    background-color: #f0f0f0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      transition: transform 0.5s ease;
    }
  }

  &:hover .member-photo img {
    transform: scale(1.04);
  }

  .member-name {
    margin-top: 12px;
    font-size: 15px;
    color: #333;
    letter-spacing: 0.5px;
  }
}

// ── Projects Carousel ─────────────────────────────────────────────────────────
.other-projects-section {
  border-top: 1px solid #f0f0f0;
  padding: 100px 60px 150px;

  .section-title {
    font-size: 24px;
    font-weight: 300;
    text-align: center;
    margin-bottom: 60px;
    color: #000;
  }

  .carousel-container {
    display: flex;
    align-items: center;
    gap: 30px;
    position: relative;
    max-width: 1400px;
    margin: 0 auto;
  }

  .nav-btn {
    width: 50px;
    height: 50px;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    color: #333;
    flex-shrink: 0;

    &:hover { background: #000; color: #fff; border-color: #000; }
  }

  .carousel-window {
    width: 100%;
    overflow: hidden;
  }

  .carousel-track {
    display: flex;
    width: 100%;
  }

  .project-slide-card {
    flex: 0 0 33.33%;
    padding: 0 15px;
    box-sizing: border-box;
    cursor: pointer;

    .slide-img-wrapper {
      width: 100%;
      height: 350px;
      background-color: #e0e0e0;
      position: relative;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;
      }

      .hover-overlay {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;

        span {
          color: #fff;
          border: 1px solid #fff;
          padding: 8px 20px;
          font-size: 12px;
          letter-spacing: 2px;
        }
      }

      .slide-info {
        position: absolute;
        bottom: 0; left: 0; width: 100%;
        padding: 15px;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
        opacity: 0;
        transition: opacity 0.3s;

        .slide-title { color: #fff; font-size: 14px; font-weight: 500; }
      }
    }

    &:hover {
      .slide-img-wrapper img { transform: scale(1.05); }
      .hover-overlay, .slide-info { opacity: 1; }
    }
  }
}

// ── Mobile ────────────────────────────────────────────────────────────────────
@media screen and (max-width: 768px) {
  .about-page { padding-top: 70px; }

  .about-container { padding: 0 20px 80px; }

  .section-hero .hero-image-wrapper { height: 45vw; min-height: 220px; }

  .brand-title { font-size: 20px; letter-spacing: 3px; }
  .brand-text-block { margin-bottom: 40px; p { font-size: 13px; } }
  .brand-hero-image { height: 55vw; min-height: 240px; }

  .what-title { font-size: 22px; letter-spacing: 2px; margin-bottom: 40px; }

  .what-grid { grid-template-columns: 1fr; }

  .what-cell .what-cell-inner { padding: 28px 20px; gap: 16px; }

  .what-icon { width: 56px; height: 56px; }

  .what-photos {
    grid-template-columns: 1fr;
    .what-photo { height: 260px; }
  }

  .approach-title { font-size: 22px; letter-spacing: 2px; margin-bottom: 40px; }

  .approach-content {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .approach-item { padding: 24px 0; }

  .team-title { font-size: 20px; letter-spacing: 2px; }

  .team-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px 14px;
  }

  .other-projects-section {
    padding: 60px 20px;

    .nav-btn { width: 36px; height: 36px; svg { width: 18px; height: 18px; } }

    .project-slide-card {
      flex: 0 0 100%;
      .slide-img-wrapper { height: 240px; }
    }
  }
}
</style>
