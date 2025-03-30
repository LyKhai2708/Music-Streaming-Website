<script setup>
import { ref, onMounted } from 'vue';
import userServices from '@/services/users.service';
import { useRouter } from 'vue-router'
const email = ref('');
const password = ref('');
const formErrors = ref({});
const isSubmitting = ref(false);
const message = ref('');
const alertType = ref('');
const router = useRouter();
const rememberMe = ref(false);

function showAlert(type, text) {
  alertType.value = type;
  message.value = text;

  // Tự động ẩn sau 3 giây
  setTimeout(() => {
    message.value = '';
    alertType.value = '';
  }, 3000);
}
async function handleLogin() {
  formErrors.value = {};

  if (!email.value) {
    formErrors.value.email = 'Vui lòng nhập email.';
  }
  if (!password.value) {
    formErrors.value.password = 'Vui lòng nhập mật khẩu.';
  }

  if (Object.keys(formErrors.value).length > 0) return;

  isSubmitting.value = true;
  try {
    const { user, token } = await userServices.login({ email: email.value, password: password.value });
    localStorage.setItem('token', token);
    localStorage.setItem('role', user.role);
    localStorage.setItem('userid', user.user_id);
    if (rememberMe.value) {
      localStorage.setItem('email', email.value);
      localStorage.setItem('password', password.value);
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
    // Chuyển hướng đến trang chính dựa trên role
    if (user.role === 0) {
      router.push({ name: 'UserHome' });
    } else if (user.role === 1) {
      router.push({ name: 'Home' }); 
    }
  } catch (error) {
    formErrors.value.general = error.message || 'Đăng nhập không thành công. Vui lòng thử lại.';
    showAlert('error', formErrors.value.general);
  } finally {
    isSubmitting.value = false;
  }
}
onMounted(() => {
  // kiểm tra xem email và password đã được lưu trong localStorage chưa ro
  const savedEmail = localStorage.getItem('email');
  const savedPassword = localStorage.getItem('password');
  if (savedEmail && savedPassword) {
    email.value = savedEmail;
    password.value = savedPassword;
    rememberMe.value = true;
  }
});
</script>

<template>
  <section class="vh-100 text-light">
    <div class="container-fluid h-custom">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-md-9 col-lg-6 col-xl-5">
          <img src="https://images2.thanhnien.vn/528068263637045248/2023/10/12/bia-dia-co-su-gop-mat-cua-em-trai-obito-the-hien-cau-chuyen-ve-su-truong-thanh-anh-obito-16970846048781054579233.jpg"
               class="img-fluid" alt="">
        </div>
        <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
          <div v-if="message" class="snackbar" :class="alertType">
            {{ message }}
          </div>
          <form @submit.prevent="handleLogin">
            <div class="form-outline mb-4">
              <input v-model="email" type="email" id="form3Example3" class="form-control form-control-lg"
                     placeholder="Enter a valid email address" :class="{ 'is-invalid': formErrors.email }" />
              <label class="form-label" for="form3Example3">Email address</label>
              <div v-if="formErrors.email" class="invalid-feedback">{{ formErrors.email }}</div>
            </div>

            <div class="form-outline mb-3">
              <input v-model="password" type="password" id="form3Example4" class="form-control form-control-lg"
                     placeholder="Enter password" :class="{ 'is-invalid': formErrors.password }" />
              <label class="form-label" for="form3Example4">Password</label>
              <div v-if="formErrors.password" class="invalid-feedback">{{ formErrors.password }}</div>
            </div>

            <div class="d-flex justify-content-between align-items-center">
              <div class="form-check mb-0">
                <input v-model="rememberMe" class="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                <label class="form-check-label" for="form2Example3">
                  Remember me
                </label>
              </div>
            </div>
            <div class="text-center text-lg-start mt-4 pt-2">
              <button type="submit" class="btn btn-primary btn-lg" :disabled="isSubmitting"
                      style="padding-left: 2.5rem; padding-right: 2.5rem;">
                Login
              </button>
              <p class="small fw-bold mt-2 pt-1 mb-0">Don't have an account? 
                <a href="/register" class="link-danger">Register</a>
              </p>
            </div>

            <!-- <div v-if="formErrors.general" class="alert alert-danger mt-3">
              {{ formErrors.general }}
            </div> -->
          </form>
        </div>
      </div>
    </div>
    <!-- <div class="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
      <div class="text-white mb-3 mb-md-0">
        Copyright © 2020. All rights reserved.
      </div>
    </div> -->
  </section>
</template>

<style scoped>
.divider:after,
.divider:before {
  content: "";
  flex: 1;
  height: 1px;
  background: #eee;
}
.h-custom {
  height: calc(100% - 73px);
}
@media (max-width: 450px) {
  .h-custom {
    height: 100%;
  }
}
.invalid-feedback {
  color: red;
}
.snackbar {
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  z-index: 1000;
  animation: fadeInOut 3s;
}

.snackbar.success {
  background-color: #28a745;
}

.snackbar.error {
  background-color: #dc3545;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  10% {
    opacity: 1;
    transform: translateY(0);
  }
  90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>
