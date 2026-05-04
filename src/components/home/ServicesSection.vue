<template>
  <section class="services-section">
    <div class="services-inner">
      <div
        v-for="(item, index) in servicesList"
        :key="index"
        class="service-item"
        ref="items"
      >
        <div class="image-wrapper">
          <img :src="item.image" :alt="item.alt" class="service-img" />
          <div class="img-overlay">
            <h3 class="img-title" v-html="item.title"></h3>
          </div>
        </div>
        <p class="service-desc">{{ item.desc }}</p>
      </div>
    </div>

    <div class="timeline-row" ref="timelineRow">
      <div class="timeline-line"></div>
      <div
        class="timeline-item"
        v-for="(item, index) in $t('process.timeline')"
        :key="'time-' + index"
        :class="{ up: index % 2 === 0, down: index % 2 !== 0 }"
      >
        <div class="dot"></div>
        <div class="text-group">
          <div class="main-text">{{ item.step }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import gsap from 'gsap';
import img01 from '@/assets/images/home/Home002-01.webp';
import img02 from '@/assets/images/home/Home002-02.webp';
import img03 from '@/assets/images/home/Home002-03.webp';
import img04 from '@/assets/images/home/Home002-04.webp';

export default {
  name: 'ServicesSection',
  props: { isActive: { type: Boolean, default: false } },
  data() {
    return {
      servicesList: [
        {
          image: img01,
          alt: 'FF&E Strategy',
          title: 'FF&amp;E<br>STRATEGY',
          desc: 'Building complete FF&E systems for cohesive and balanced interiors.'
        },
        {
          image: img02,
          alt: 'Brand-Level Curation',
          title: 'BRAND-LEVEL<br>CURATION',
          desc: 'Curating refined interiors inspired by leading global furniture brands.'
        },
        {
          image: img03,
          alt: 'Material & Craft Development',
          title: 'MATERIAL&amp;<br>CRAFT DEVELOPMENT',
          desc: 'Developing materials and craftsmanship with international quality standards.'
        },
        {
          image: img04,
          alt: 'Project Realization',
          title: 'PROJECT<br>REALIZATION',
          desc: 'Ensuring every detail meets design intent and quality expectations.'
        }
      ],
      hasAnimated: false
    };
  },
  watch: {
    isActive(val) {
      if (val && !this.hasAnimated) {
        this.playEnterAnimation();
        this.hasAnimated = true;
      }
    }
  },
  mounted() {
    gsap.set(this.$refs.items, { y: 60, opacity: 0 });
    gsap.set(this.$refs.timelineRow, { opacity: 0 });
    gsap.set('.services-section .dot', { scale: 0 });
    gsap.set('.services-section .text-group', { y: 20, opacity: 0 });
  },
  methods: {
    playEnterAnimation() {
      const tl = gsap.timeline();
      tl.to(this.$refs.items, {
        y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2
      });
      tl.to(this.$refs.timelineRow, { opacity: 1, duration: 0.8 }, '-=0.3');
      tl.to('.services-section .dot', {
        scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.7)'
      }, '-=0.6');
      tl.to('.services-section .text-group', {
        y: 0, opacity: 1, duration: 0.4, stagger: 0.1
      }, '-=0.5');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.services-section {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 5%;
  box-sizing: border-box;
}

.services-inner {
  width: 100%;
  max-width: 1400px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.service-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  opacity: 0;
}

.image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;

  .service-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
  }

  &:hover .service-img {
    transform: scale(1.04);
  }

  .img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 55%);
    display: flex;
    align-items: flex-end;
    padding: 24px 20px;
  }

  .img-title {
    color: #fff;
    font-size: 18px;
    font-weight: 500;
    line-height: 1.35;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin: 0;
  }
}

.service-desc {
  margin: 14px 0 0;
  font-size: 12px;
  color: #555;
  line-height: 1.65;
  text-align: center;
  font-weight: 300;
  letter-spacing: 0.3px;
}

.timeline-row {
  position: relative;
  width: 100%;
  max-width: 1400px;
  height: 160px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 60px;
  opacity: 0;

  .timeline-line {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: #222;
    z-index: 0;
  }
}

.timeline-item {
  position: relative;
  z-index: 1;
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .dot {
    width: 14px;
    height: 14px;
    background: #222;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
  }

  .text-group {
    position: absolute;
    width: 100%;
    padding: 0 8px;
    opacity: 0;
    transform: translateY(20px);
  }

  .main-text {
    font-size: 13px;
    font-weight: 500;
    color: #222;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  &.up .text-group { bottom: 50%; margin-bottom: 22px; }
  &.down .text-group { top: 50%; margin-top: 22px; }
}

/* --- 移动端适配 --- */
@media screen and (max-width: 768px) {
  .services-section {
    padding: 60px 5%;
  }

  .services-inner {
    flex-wrap: wrap;
    gap: 24px;
  }

  .service-item {
    flex: 0 0 calc(50% - 12px);
  }

  .image-wrapper .img-title {
    font-size: 13px;
  }

  .service-desc {
    font-size: 11px;
  }

  .timeline-row {
    flex-direction: column;
    height: auto;
    align-items: flex-start;
    padding-left: 20px;
    margin-top: 40px;

    .timeline-line {
      width: 1px;
      height: 100%;
      top: 0;
      left: 27px;
    }
  }

  .timeline-item {
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 28px;
    text-align: left;
    position: static;

    .dot {
      position: static;
      transform: scale(0);
      width: 12px;
      height: 12px;
      margin-right: 18px;
      margin-top: 3px;
      flex-shrink: 0;
    }

    .text-group {
      position: static;
      margin: 0 !important;
      text-align: left;
    }
  }
}
</style>