<template>
  <section class="process-section">
    <div class="left-image">
      <img src="@/assets/images/home/Home003.png" alt="world map" ref="mapImg" />
    </div>

    <div class="right-panel" ref="rightPanel">
      <h2 class="section-title" ref="title">
        Rooted in China's Manufacturing Excellence<br>
        Serving Global Interior Projects
      </h2>

      <div class="stats-grid">
        <div
          class="stat-card"
          v-for="(item, index) in $t('process.stats')"
          :key="index"
          ref="statCards"
        >
          <div class="stat-copy">
            <h4 class="stat-label">{{ item.title }}</h4>
            <p class="stat-desc">{{ item.desc }}</p>
          </div>
          <div class="stat-num">{{ item.num }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import gsap from 'gsap';

export default {
  name: 'ProcessSection',
  props: { isActive: { type: Boolean, default: false } },
  data() {
    return { hasAnimated: false };
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
    gsap.set(this.$refs.title, { y: 30, opacity: 0 });
    gsap.set(this.$refs.statCards, { y: 40, opacity: 0 });
  },
  methods: {
    playEnterAnimation() {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.to(this.$refs.title, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' });
      tl.to(this.$refs.statCards, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out'
      }, '-=0.4');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.process-section {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: #bbac9b;
  box-sizing: border-box;
}

.left-image {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
}

.right-panel {
  width: 45%;
  flex-shrink: 0;
  padding: 80px 6% 80px 4%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 48px;
}

.section-title {
  font-size: 24px;
  font-weight: 400;
  line-height: 1.55;
  color: #fff;
  letter-spacing: 0.3px;
  margin: 0;
  opacity: 0;
  text-align: right;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

.stat-card {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 32px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  text-align: center;
  opacity: 0;

  &:nth-child(-n + 2) {
    border-top: none;
  }

  &:nth-child(odd) {
    border-right: 1px solid rgba(255, 255, 255, 0.25);
  }

  .stat-copy {
    flex-shrink: 0;
  }

  .stat-label {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 1);
    margin: 0 0 10px;
  }

  .stat-desc {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.55);
    line-height: 1.6;
    margin: 0;
    font-weight: 300;
  }

  .stat-num {
    align-self: stretch;
    margin-top: auto;
    padding-top: 20px;
    font-size: 40px;
    font-weight: 300;
    color: #fff;
    letter-spacing: -1px;
    line-height: 1;
  }
}

/* --- 移动端适配 --- */
@media screen and (max-width: 768px) {
  .process-section {
    flex-direction: column;
  }

  .left-image {
    flex: none;
    width: 100%;
  }

  .right-panel {
    width: 100%;
    padding: 48px 6% 60px;
    gap: 32px;
  }

  .section-title {
    font-size: 18px;
  }

  .stat-card {
    padding: 20px 14px;

    .stat-num {
      font-size: 38px;
    }
  }
}
</style>
