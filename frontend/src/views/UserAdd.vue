<script setup>
import { ref } from 'vue';
import UserForm from '@/components/UserForm.vue';
import UsersService from '@/services/users.service';

const user = ref({
  username: '',
  email: '',
  password: '',
  confirmpass:'',
  full_name: '',
  avatar: '../public/images/OIP.jpg',
});
const message = ref('');

async function onAddUser(formData) {
  try {

    await UsersService.createUser(formData);
    message.value = 'Người dùng đã được thêm thành công.';
    user.value = { username: '', email: '', password: '', full_name: '', avatar: null, confirmpass:''};
  } catch (error) {
    console.log(error);
    message.value = 'Có lỗi xảy ra khi thêm người dùng.';
  }
}
</script>

<template>
  <div class="user-add container py-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-center text-white mb-4">Thêm người dùng mới</h2>
        <UserForm :user="user" 
        @submit:user="onAddUser" />
        <p v-if="message" :class="['message', { 'text-success': message.includes('thành công'), 'text-danger': message.includes('lỗi') }]">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-add {
  max-width: 600px;
  margin: auto;
}

.card {
  border: none;
}

.card-body {
  background-color: #121212;
}

.message {
  margin-top: 1rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.text-success {
  color: #1ed760;
}

.text-danger {
  color: #dc3545;
}

button {
  transition: all 0.3s ease;
}

button:hover {
  transform: scale(1.05);
  background-color: #3be477;
}
</style>
