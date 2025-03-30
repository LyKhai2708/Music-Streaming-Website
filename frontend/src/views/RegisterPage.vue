<script setup>
import { ref } from 'vue';

import usersService from '@/services/users.service';
const formValues = ref({
  username: '',
  email: '',
  password: '',
  confirmpass: '',
  full_name: ''
});
const formErrors = ref({});
const isSubmitting = ref(false);
const message = ref(''); 
const alertType = ref(''); 

function showAlert(type, text) {
  alertType.value = type;
  message.value = text;

  
  setTimeout(() => {
    message.value = '';
    alertType.value = '';
  }, 3000);
}
function validateForm() {
  formErrors.value = {};
  const { username, email, full_name, password, confirmpass } = formValues.value;

  if (username.length < 2 || username.length > 50) {
    formErrors.value.username = 'Tên người dùng phải từ 2 đến 50 ký tự.';
  }
  if (!/\S+@\S+\.\S+/.test(email) || email.length > 50) {
    formErrors.value.email = 'E-mail không đúng hoặc quá 50 ký tự.';
  }
  if (full_name.length > 100) {
    formErrors.value.full_name = 'Tên đầy đủ tối đa 100 ký tự.';
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    formErrors.value.password = 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt.';
  }
  if (password !== confirmpass) {
    formErrors.value.confirmpass = 'Xác thực mật khẩu không khớp.';
  }
  return Object.keys(formErrors.value).length === 0;
}

async function submitUser() {
  if (!validateForm()) return;

  isSubmitting.value = true;
  try {
    const formData = new FormData();
    Object.keys(formValues.value).forEach((key) => {
      formData.append(key, formValues.value[key]);
    });

    await onAddUser(formData);

    // Reset form nếu thành công
    Object.keys(formValues.value).forEach((key) => {
      formValues.value[key] = '';
    });
    formErrors.value = {};

    showAlert('success', 'Đăng ký tài khoản thành công!');
  } catch (error) {
    formErrors.value.general = error.message || 'Đăng ký không thành công. Vui lòng thử lại.';
    showAlert('error', formErrors.value.general);
  } finally {
    isSubmitting.value = false;
  }
}

async function onAddUser(formData) {
  try {
    // Gọi API để tạo người dùng
    await usersService.createUser(formData);
  } catch (error) {
    // Ném lỗi ra ngoài để `submitUser` xử lý
    throw new Error(error.message || 'Lỗi khi đăng ký tài khoản.');
  }
}
</script>

<template>
  <section class="vh-100 text-light">
    <div class="container-fluid h-custom">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-md-9 col-lg-6 col-xl-5">
          <img src="https://images2.thanhnien.vn/528068263637045248/2023/10/12/bia-dia-co-su-gop-mat-cua-em-trai-obito-the-hien-cau-chuyen-ve-su-truong-thanh-anh-obito-16970846048781054579233.jpg" class="img-fluid rounded" alt=""/>
        </div>
        <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
          <div v-if="message" class="snackbar" :class="alertType">
            {{ message }}
          </div>
          <h2 class="text-center mb-4">Create a New Account</h2>
          <form @submit.prevent="submitUser">
            <div class="form-outline mb-4">
              <input v-model="formValues.username" type="text" id="form3Example1" class="form-control form-control-lg" placeholder="Enter a valid username" :class="{ 'is-invalid': formErrors.username }" />
              <label class="form-label" for="form3Example1">Username</label>
              <div v-if="formErrors.username" class="invalid-feedback">{{ formErrors.username }}</div>
            </div>

            <div class="form-outline mb-4">
              <input v-model="formValues.email" type="email" id="form3Example3" class="form-control form-control-lg" placeholder="Enter a valid email address" :class="{ 'is-invalid': formErrors.email }" />
              <label class="form-label" for="form3Example3">Email address</label>
              <div v-if="formErrors.email" class="invalid-feedback">{{ formErrors.email }}</div>
            </div>

            <div class="form-outline mb-4">
              <input v-model="formValues.password" type="password" id="form3Example4" class="form-control form-control-lg" placeholder="Enter password" :class="{ 'is-invalid': formErrors.password }" />
              <label class="form-label" for="form3Example4">Password</label>
              <div v-if="formErrors.password" class="invalid-feedback">{{ formErrors.password }}</div>
            </div>

            <div class="form-outline mb-3">
              <input v-model="formValues.confirmpass" type="password" id="form3Example5" class="form-control form-control-lg" placeholder="Confirm password" :class="{ 'is-invalid': formErrors.confirmpass }" />
              <label class="form-label" for="form3Example5">Confirm Password</label>
              <div v-if="formErrors.confirmpass" class="invalid-feedback">{{ formErrors.confirmpass }}</div>
            </div>

            <div class="form-outline mb-4">
              <input v-model="formValues.full_name" type="text" id="form3Example6" class="form-control form-control-lg" placeholder="Enter full name" :class="{ 'is-invalid': formErrors.full_name }" />
              <label class="form-label" for="form3Example6">Full Name</label>
              <div v-if="formErrors.full_name" class="invalid-feedback">{{ formErrors.full_name }}</div>
            </div>

            <div class="text-center text-lg-start mt-4 pt-2">
              <button type="submit" class="btn btn-primary btn-lg" :disabled="isSubmitting" style="padding-left: 2.5rem; padding-right: 2.5rem;">
                Register
              </button>
              <p class="small fw-bold mt-2 pt-1 mb-0">Already have an account? <a href="/login" class="link-danger">Login</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Custom Styles for the Form */
.form-outline { margin-bottom: 1.5rem; }
.invalid-feedback { color: red; font-size: 0.875rem; }

/* Input field with error handling */
.is-invalid {
  border-color: red;
}

.invalid-feedback {
  display: block;
}

/* Button and other elements */
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.form-control::placeholder {
  color: #b3b3b3;
}

.form-control {
  background-color: #121212;
  color: #b3b3b3;
}

.text-light {
  color: #f8f9fa !important;
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
