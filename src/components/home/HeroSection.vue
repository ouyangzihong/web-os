<template>
  <section class="hero-section">
    <main class="hero-content">
      <img
        ref="logo"
        class="hero-logo"
        src="@/assets/images/logo.webp"
        alt="logo"
      />
    </main>
  </section>
</template>

<script>
import gsap from 'gsap';

export default {
  name: 'HeroSection',
  mounted() {
    this.initAnimation();
  },
  methods: {
    initAnimation() {
      gsap.fromTo(
        this.$refs.logo,
        { opacity: 0, scale: 0.6, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 1.6, ease: 'power4.out', delay: 0.4 }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.hero-section {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-image: url('~@/assets/images/home/Home001.webp');
  background-size: cover;
  background-position: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.25);
    z-index: 1;
  }
}

.hero-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  position: relative;
}

.hero-logo {
  width: 380px;
  max-width: 70vw;
  opacity: 0;
  will-change: transform, opacity;
  filter: drop-shadow(0 8px 40px rgba(0, 0, 0, 0.5));
}

@media screen and (max-width: 768px) {
  .hero-logo {
    width: 260px;
    max-width: 80vw;
  }
}
</style>