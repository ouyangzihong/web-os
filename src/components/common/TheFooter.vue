<template>
  <footer class="footer-container">
    <div class="footer-top">
      <img
        :src="brandLogo"
        alt="LIGNE ATELIER"
        class="brand-logo"
      />
      <p class="slogan">{{ $t('footer.slogan') }}</p>
    </div>

    <div class="divider"></div>

    <div class="footer-main">
      <div class="col brand-intro">
        <p class="desc">
          {{ $t('footer.desc') }}
        </p>
        <button class="action-btn" @click="navigateToContact">
          {{ $t('footer.getInTouch') }}
        </button>
      </div>

      <div class="col office-info">
        <h3 class="col-title">{{ $t('footer.office') }}</h3>
        <div class="info-list">
          <p>{{ $t('footer.location') }}</p>
          <p class="placeholder">xxxxxx@xxx.com</p>
          <p class="placeholder">+86 000 0000 0000</p>
        </div>
      </div>

      <div class="col nav-links">
        <h3 class="col-title">{{ $t('footer.links') }}</h3>
        <ul>
          <li><router-link to="/">{{ $t('navbar.home') }}</router-link></li>
          <li><router-link to="/about">{{ $t('navbar.about') }}</router-link></li>
          <li><router-link to="/products">{{ $t('navbar.products') }}</router-link></li>
          <li><router-link to="/projects">{{ $t('navbar.projects') }}</router-link></li>
          <li><router-link to="/industries">{{ $t('navbar.industries') }}</router-link></li>
          <li><router-link to="/contact">{{ $t('navbar.contact') }}</router-link></li>
        </ul>
      </div>

      <div class="col social-media">
        <h3 class="col-title">{{ $t('footer.socialTitle') }}</h3>
        <div class="social-icons">
          <button
            type="button"
            class="social-icon-btn"
            aria-label="Facebook"
            @click="handleSocialClick('Facebook')"
          >
            <img :src="iconFacebook" alt="" />
          </button>
          <button
            type="button"
            class="social-icon-btn"
            aria-label="Instagram"
            @click="handleSocialClick('Instagram')"
          >
            <img :src="iconInstagram" alt="" />
          </button>
          <button
            type="button"
            class="social-icon-btn"
            aria-label="RedBook"
            @click="handleSocialClick('RedBook')"
          >
            <img :src="iconRedBook" alt="" />
          </button>
          <button
            type="button"
            class="social-icon-btn"
            aria-label="WeChat"
            @click="handleSocialClick('WeChat')"
          >
            <img :src="iconWeChat" alt="" />
          </button>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }}. {{ $t('footer.rights') }}</p>
    </div>
  </footer>
</template>

<script>
import brandLogo from '@/assets/images/TheFooter/logo.webp';
import iconFacebook from '@/assets/images/TheFooter/FaceBook.webp';
import iconInstagram from '@/assets/images/TheFooter/Instagram.webp';
import iconRedBook from '@/assets/images/TheFooter/RedBook.webp';
import iconWeChat from '@/assets/images/TheFooter/WeChat.webp';

export default {
  name: "TheFooter",
  data() {
    return {
      brandLogo,
      iconFacebook,
      iconInstagram,
      iconRedBook,
      iconWeChat
    };
  },
  methods: {
    navigateToContact() {
      // 编程式导航跳转到 Contact 页面
      this.$router.push({ name: 'Contact' }).catch(err => {});
    },
    handleSocialClick(platform) {
      // 暂时只打印日志或做简单提示
      console.log(`Clicked on ${platform}`);
    }
  }
};
</script>

<style lang="scss" scoped>
// 引入全局变量
@import "@/assets/styles/_variables.scss";

.footer-container {
  width: 100%;
  background-color: #3f3f3f; // 深灰色背景
  color: #ffffff;
  padding: 60px 80px 30px;
  box-sizing: border-box;
  font-family: $font-main;

  .divider {
    width: 100%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.2);
    margin: 40px 0;
  }

  // 1. 顶部
  .footer-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .brand-logo {
      height: 32px;
      width: auto;
      max-width: min(280px, 55vw);
      object-fit: contain;
      object-position: left center;
      display: block;
      /* 黑字 logo 在深色底上显示为白色 */
      filter: brightness(0) invert(1);
    }
    .slogan {
      font-size: 23px;
      font-weight: 300;
      opacity: 0.9;
    }
  }

  // 2. 中间主要内容
  .footer-main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 40px;

    .col {
      flex: 1;
      .col-title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 25px;
        opacity: 0.9;
      }
    }

    // 第一列：品牌简介
    .brand-intro {
      flex: 1.5;
      padding-right: 40px;
      
      .desc {
        font-size: 13px;
        line-height: 1.8;
        color: #cccccc;
        margin-bottom: 30px;
        max-width: 90%;
      }

      .action-btn {
        background-color: #ffffff;
        color: #333333;
        border: none;
        padding: 12px 30px;
        border-radius: 30px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: transform 0.2s, background-color 0.2s;

        &:hover {
          transform: translateY(-2px);
          background-color: #f0f0f0;
        }
      }
    }

    // 第二列：办公信息
    .office-info {
      .info-list p {
        font-size: 13px;
        line-height: 2.2;
        color: #cccccc;
        margin: 0;
        
        &.placeholder {
          opacity: 0.7;
        }
      }
    }

    // 第三列：导航链接
    .nav-links {
      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: 12px;
          
          a {
            color: #cccccc;
            text-decoration: none;
            font-size: 13px;
            transition: color 0.3s;
            display: inline-block;

            &:hover {
              color: #ffffff;
            }

            &.disabled-link {
              cursor: default;
              &:hover { color: #cccccc; }
            }
          }
        }
      }
    }

    // 第四列：社交图标
    .social-media {
      .social-icons {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        align-items: center;

        .social-icon-btn {
          margin: 0;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          line-height: 0;
          border-radius: 50%;
          transition: transform 0.25s ease, opacity 0.25s ease;

          img {
            width: 36px;
            height: 36px;
            object-fit: contain;
            display: block;
          }

          &:hover {
            transform: scale(1.08);
            opacity: 0.92;
          }

          &:active {
            transform: scale(0.96);
          }

          &:focus-visible {
            outline: 2px solid rgba(255, 255, 255, 0.65);
            outline-offset: 3px;
          }
        }
      }
    }
  }

  // 3. 底部版权
  .footer-bottom {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
  }

  // --- 移动端适配 ---
  @media screen and (max-width: 768px) {
    padding: 40px 20px;

    .footer-top {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
      
      .slogan {
        font-size: 14px;
      }

      .brand-logo {
        height: 26px;
        max-width: 85vw;
      }
    }

    .footer-main {
      flex-direction: column;
      gap: 50px;

      .col {
        width: 100%;
        padding-right: 0;
      }

      .brand-intro .desc {
        max-width: 100%;
      }
    }
  }
}
</style>