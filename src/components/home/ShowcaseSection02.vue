<template>
  <section class="showcase-section-02">
    <!-- 第一列：上下两张 -->
    <div class="col col-split" ref="col0">
      <div class="split-cell">
        <img :src="images[0]" alt="showcase-02-01" class="col-img" />
      </div>
      <div class="split-cell">
        <img :src="images[1]" alt="showcase-02-02" class="col-img" />
      </div>
    </div>

    <!-- 第二列：上下两张 -->
    <div class="col col-split" ref="col1">
      <div class="split-cell">
        <img :src="images[2]" alt="showcase-02-03" class="col-img" />
      </div>
      <div class="split-cell">
        <img :src="images[3]" alt="showcase-02-04" class="col-img" />
      </div>
    </div>

    <!-- 第三列：大图 + 文字 -->
    <div class="col col-main" ref="col2">
      <img :src="images[4]" alt="showcase-02-05" class="col-img" />
      <div class="col-overlay">
        <h3 class="overlay-title">SG·Southeast Asia</h3>
        <p class="overlay-desc">FF&amp;E and soft furnishing solutions for contemporary villas and residences, focusing on comfort, functionality, and clean modern aesthetics.</p>
      </div>
    </div>
  </section>
</template>

<script>
import gsap from 'gsap';
import img01 from '@/assets/images/home/Home005-01.webp';
import img02 from '@/assets/images/home/Home005-02.webp';
import img03 from '@/assets/images/home/Home005-03.webp';
import img04 from '@/assets/images/home/Home005-04.webp';
import img05 from '@/assets/images/home/Home005-05.webp';

export default {
  name: 'ShowcaseSection02',
  props: { isActive: { type: Boolean, default: false } },
  data() {
    return {
      images: [img01, img02, img03, img04, img05],
      hasAnimated: false
    };
  },
  mounted() {
    gsap.set([this.$refs.col0, this.$refs.col1, this.$refs.col2], { y: 60, opacity: 0 });
  },
  watch: {
    isActive(val) {
      if (val && !this.hasAnimated) {
        this.playEnterAnimation();
        this.hasAnimated = true;
      }
    }
  },
  methods: {
    playEnterAnimation() {
      gsap.to([this.$refs.col0, this.$refs.col1, this.$refs.col2], {
        y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.showcase-section-02 {
  width: 100%;
  height: calc(100vh - 110px);
  display: flex;
  gap: 36px;
  background-color: #fff;
  padding: 44px 80px;
  box-sizing: border-box;
  overflow: hidden;
}

.col {
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

  .col-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.7s ease;
  }

  &:hover .col-img { transform: scale(1.04); }
}

.col-split {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 28px;

  .split-cell {
    flex: 1;
    overflow: hidden;
    position: relative;

    .col-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.7s ease;
    }

    &:hover .col-img { transform: scale(1.04); }
  }
}

.col-main {
  flex: 0 0 45%;

  .col-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 40px 32px;
    box-sizing: border-box;
    background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%);
    z-index: 2;
    pointer-events: none;
  }

  .overlay-title {
    font-size: 28px;
    font-weight: 500;
    color: #fff;
    margin: 0 0 12px;
    letter-spacing: 0.5px;
  }

  .overlay-desc {
    font-size: 17px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.65;
    margin: 0 30px 30px 0;
    font-weight: 300;
  }
}

@media screen and (max-width: 768px) {
  .showcase-section-02 {
    flex-direction: column;
    height: auto;
    padding: 14px 16px;
    gap: 14px;
  }

  .col-split {
    flex-direction: row;
    height: 40vw;
    .split-cell { flex: 1; }
  }

  .col-main {
    flex: 0 0 50vw;
    height: 50vw;
    .overlay-title { font-size: 16px; }
    .overlay-desc { font-size: 11px; }
  }
}
</style>
