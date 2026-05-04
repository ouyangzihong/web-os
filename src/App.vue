<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Lenis from 'lenis';
import gsap from 'gsap';

export default {
  name: 'App',
  data() {
    return {
      lenis: null
    };
  },
  mounted() {
    this.lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });

    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  },
  beforeDestroy() {
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
    gsap.ticker.remove();
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/_variables.scss';

body {
  margin: 0;
  padding: 0;
  font-family: $font-main;
  background-color: $bg-color;
  -webkit-font-smoothing: antialiased; // 字体抗锯齿，Mac上更清晰
  -moz-osx-font-smoothing: grayscale;
}

/* 去除默认的链接样式 */
a {
  text-decoration: none;
  color: inherit;
}
</style>