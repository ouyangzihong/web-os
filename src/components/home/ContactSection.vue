<template>
  <div class="contact-section" :class="{ 'is-active': isActive }">
    <div class="contact-container">
      <div class="contact-content">
        
        <div class="form-section">
          <div class="form-card">
            <div class="form-header">
              <h3 class="form-title">{{ $t('contact.title') }}</h3>
            </div>
            
            <form @submit.prevent="submitForm" novalidate>
              <div class="form-group">
                <input 
                  v-model="form.name" 
                  type="text" 
                  :placeholder="$t('contact.form.name') + ' *'" 
                  required
                  :class="{ 'input-error': errors.name }"
                  @input="errors.name = false"
                >
              </div>
              
              <div class="form-group">
                <input 
                  v-model="form.email" 
                  type="email" 
                  :placeholder="$t('contact.form.email') + ' *'" 
                  required
                  :class="{ 'input-error': errors.email }"
                  @input="errors.email = false"
                >
                <transition name="fade">
                  <span v-if="errors.email" class="error-tip">
                    {{ $t('contact.form.emailError') }}
                  </span>
                </transition>
              </div>

              <div class="form-group">
                <input 
                  v-model="form.subject" 
                  type="text" 
                  :placeholder="$t('contact.form.subject')" 
                >
              </div>
              
              <div class="form-group">
                <textarea 
                  v-model="form.message" 
                  :placeholder="$t('contact.form.message')" 
                  rows="4"
                ></textarea>
              </div>
              
              <div class="form-privacy" :class="{ 'shake-animation': privacyShake }">
                <label class="checkbox-container">
                  <input type="checkbox" v-model="form.privacyAgreed" @change="privacyError = false">
                  <span class="checkmark"></span>
                  <span class="privacy-text" :class="{ 'text-danger': privacyError }">
                    {{ $t('contact.form.privacy') }}
                  </span>
                </label>
              </div>

              <button type="submit" class="submit-btn" :disabled="isSubmitting">
                {{ isSubmitting ? $t('contact.form.submitting') : $t('contact.form.submit') }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <transition name="slide-down">
      <div v-if="submitStatus" class="toast-popup" :class="submitStatus.type">
        <span class="toast-icon">
          {{ submitStatus.type === 'success' ? '✓' : '!' }}
        </span>
        {{ submitStatus.msg }}
      </div>
    </transition>
  </div>
</template>

<script>
import { submitContactMessage } from '@/api/contact'

export default {
  name: 'ContactSection',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: '',
        privacyAgreed: false
      },
      errors: {
        name: false,
        email: false
      },
      isSubmitting: false,
      privacyError: false,
      privacyShake: false,
      submitStatus: null // 控制弹窗显示
    }
  },
  methods: {
    validateForm() {
      let isValid = true;
      if (!this.form.name.trim()) {
        this.errors.name = true;
        isValid = false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.form.email.trim() || !emailRegex.test(this.form.email)) {
        this.errors.email = true;
        isValid = false;
      }
      if (!this.form.privacyAgreed) {
        this.privacyError = true;
        this.triggerShake();
        isValid = false;
      }
      return isValid;
    },
    triggerShake() {
      this.privacyShake = true;
      setTimeout(() => {
        this.privacyShake = false;
      }, 500);
    },
    async submitForm() {
      // 如果已有弹窗在显示，先强制关闭
      if (this.submitStatus) {
        this.submitStatus = null;
      }

      if (!this.validateForm()) return;

      this.isSubmitting = true;
      try {
        await submitContactMessage({
          name: this.form.name,
          email: this.form.email,
          subject: this.form.subject,
          message: this.form.message,
        });

        this.submitStatus = { type: 'success', msg: this.$t('contact.form.success') };
        this.form = { name: '', email: '', subject: '', message: '', privacyAgreed: false };

        setTimeout(() => { this.submitStatus = null; }, 3000);

      } catch (err) {
        console.error('[Contact] 提交失败:', err.message);
        this.submitStatus = { type: 'error', msg: this.$t('contact.form.error') };
        setTimeout(() => { this.submitStatus = null; }, 3000);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss'; 

.contact-section {
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background-color: #3f3f3f;
  background-image: url('~@/assets/images/home/Home007.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.contact-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto; 
  padding: 0 40px; 
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.contact-content {
  width: 100%;
  display: flex;
  justify-content: flex-end; /* 靠右对齐 */
  align-items: center; 
  padding-right: 10%; /* 右侧间距 */
}

.form-section {
  width: 100%;
  max-width: 415px; /* 修改：精确宽度 415px */
  
  .form-card {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.25);
    /* 移除之前的 message-area 占位，底部更紧凑 */
  }

  .form-header {
    margin-bottom: 20px;
    
    .form-title {
      font-size: 24px;
      color: #333;
      font-weight: 700;
      line-height: 1.3;
      white-space: pre-wrap;
    }
  }
  
  .form-group {
    margin-bottom: 12px;
    position: relative;
    
    input, textarea {
      width: 100%;
      padding: 10px 14px;
      background-color: #f5f5f5;
      border: 1px solid transparent;
      border-radius: 10px;
      font-size: 14px; 
      color: #333;
      transition: all 0.3s ease;
      font-family: inherit;
      box-sizing: border-box;

      &:focus {
        outline: none;
        background-color: #fff;
        border-color: #333;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      }

      &.input-error {
        border-color: #ff4d4f;
        background-color: #fff1f0;
      }
    }
    
    textarea {
      resize: none;
      min-height: 80px;
    }

    .error-tip {
      color: #ff4d4f;
      font-size: 12px;
      margin-top: 2px;
      display: block;
      padding-left: 4px;
    }
  }

  .form-privacy {
    margin-bottom: 20px; 
    
    .checkbox-container {
      display: flex;
      align-items: flex-start;
      cursor: pointer;
      font-size: 12px; 
      color: #666;
      line-height: 1.4;
      
      input {
        margin-right: 8px;
        margin-top: 2px;
        accent-color: #333;
      }
      
      .privacy-text.text-danger { color: #d32f2f; }
    }
  }

  .submit-btn {
    width: 100%;
    padding: 12px; 
    background-color: #222;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 14px; 
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #000;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }
    
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
      transform: none;
    }
  }
}

/* --- 新增：弹窗提示样式 --- */
.toast-popup {
  position: fixed;
  top: 100px; /* 距离顶部位置，避开导航栏 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  
  display: flex;
  align-items: center;
  gap: 10px;
  
  padding: 12px 24px;
  border-radius: 50px; /* 胶囊形状 */
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  font-size: 14px;
  font-weight: 500;
  
  &.success {
    background-color: #ffffff;
    color: #333;
    border: 1px solid #e0e0e0;
    
    .toast-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      background-color: #52c41a; /* 绿色 */
      color: #fff;
      border-radius: 50%;
      font-size: 12px;
    }
  }
  
  &.error {
    background-color: #fff2f0;
    color: #ff4d4f;
    border: 1px solid #ffccc7;
    
    .toast-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      background-color: #ff4d4f;
      color: #fff;
      border-radius: 50%;
    }
  }
}

/* 弹窗动画 */
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-enter {
  opacity: 0;
  transform: translate(-50%, -20px); /* 从上方滑入 */
}
.slide-down-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px); /* 向上方滑出 */
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}
.shake-animation { animation: shake 0.4s ease-in-out; }

@media (max-width: 1024px) {
  .contact-content {
    padding-right: 5%;
  }
}

@media (max-width: 768px) {
  .contact-section { 
    height: auto; 
    min-height: 100vh; 
    padding: 80px 0; 
    align-items: flex-start;
  }
  
  .contact-container {
    justify-content: flex-start;
  }

  .contact-content {
    padding-right: 0;
    justify-content: center;
  }
  
  .form-section { 
    max-width: 100%;
    padding: 0 20px;
  }
  
  .form-card { 
    padding: 25px 20px; 
  }
  
  /* 移动端弹窗位置调整 */
  .toast-popup {
    width: 80%;
    justify-content: center;
    top: 80px;
  }
}
</style>