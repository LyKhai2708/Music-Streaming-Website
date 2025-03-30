<script setup>
import { ref } from 'vue';
import usersService from '@/services/users.service';
import { useRoute } from 'vue-router';
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const formErrors = ref({});
const route = useRoute();
const message = ref('');
const userId = route.params.id;
const alertType = ref('');
function validateForm() {
  formErrors.value = {};

  if (!currentPassword.value) {
    formErrors.value.currentPassword = 'Vui lòng nhập mật khẩu hiện tại.';
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!newPassword.value) {
    formErrors.value.newPassword = 'Vui lòng nhập mật khẩu mới.';
  } else if (!passwordRegex.test(newPassword.value)) {
    formErrors.value.newPassword =
      'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.';
  }
  if (newPassword.value !== confirmPassword.value) {
    formErrors.value.confirmPassword = 'Mật khẩu nhập lại không khớp.';
  }

  return Object.keys(formErrors.value).length === 0;
}
function showAlert(type, text) {
  alertType.value = type;
  message.value = text;

  // Tự động ẩn sau 3 giây
  setTimeout(() => {
    message.value = '';
    alertType.value = '';
  }, 3000);
}
async function submitPasswordChange() {
  if (!validateForm()) return;
    console.log(newPassword.value, currentPassword.value);
  try {
    await usersService.ChangePassword(userId, newPassword.value, currentPassword.value);
    showAlert('success', 'Mật khẩu đã được đổi thành công');
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error) {
    console.error('Error changing password:', error.message);
    showAlert('error', 'Mật khẩu đã được đổi thành công');
  }
}
</script>

<template>
  <div class="password-container">
    <div v-if="message" class="snackbar" :class="alertType">
            {{ message }}
          </div>
    <form @submit.prevent="submitPasswordChange" class="password-form bg-dark text-light p-4 rounded shadow">
      <!-- Tiêu đề -->
      <h1 class="form-title text-uppercase fw-bold mb-4">Đổi mật khẩu</h1>

      <!-- Mật khẩu hiện tại -->
      <div class="mb-3">
        <label for="current-password" class="form-label small">Mật khẩu hiện tại</label>
        <input
          v-model="currentPassword"
          type="password"
          id="current-password"
          class="form-control"
          :class="{ 'is-invalid': formErrors.currentPassword }"
          placeholder="Nhập mật khẩu hiện tại"
        />
        <div v-if="formErrors.currentPassword" class="invalid-feedback">{{ formErrors.currentPassword }}</div>
      </div>

      <!-- Mật khẩu mới -->
      <div class="mb-3">
        <label for="new-password" class="form-label small">Mật khẩu mới</label>
        <input
          v-model="newPassword"
          type="password"
          id="new-password"
          class="form-control"
          :class="{ 'is-invalid': formErrors.newPassword }"
          placeholder="Nhập mật khẩu mới"
        />
        <div v-if="formErrors.newPassword" class="invalid-feedback">{{ formErrors.newPassword }}</div>
      </div>

      <!-- Lặp lại mật khẩu -->
      <div class="mb-3">
        <label for="confirm-password" class="form-label small">Lặp lại mật khẩu mới</label>
        <input
          v-model="confirmPassword"
          type="password"
          id="confirm-password"
          class="form-control"
          :class="{ 'is-invalid': formErrors.confirmPassword }"
          placeholder="Nhập lại mật khẩu mới"
        />
        <div v-if="formErrors.confirmPassword" class="invalid-feedback">{{ formErrors.confirmPassword }}</div>
      </div>

      <!-- Nút đổi mật khẩu -->
      <button type="submit" class="btn btn-primary w-100">Đổi mật khẩu</button>
    </form>
  </div>
</template>

<style scoped>
.password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.password-form {
  max-width: 500px;
  width: 100%;
}

.form-title {
  font-size: 1.8rem;
}

label {
  margin-bottom: 5px;
}

input {
  height: 45px;
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
</style>
