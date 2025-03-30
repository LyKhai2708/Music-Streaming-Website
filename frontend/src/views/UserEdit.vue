<script setup>
import { onMounted, ref } from 'vue';
import UserForm from '@/components/UserForm.vue';
import UsersService from '@/services/users.service';
import router from '@/router';

const props = defineProps({
        id: { type: String, required: true },
});
const user = ref({
  username: '',
  email: '',
  password: '',
  confirmpass:'',
  full_name: '',
  avatar: '',
});
const message = ref('');

async function onUpdateUser(formData) {
  try {
    await UsersService.updateUser(formData.get('user_id'), formData);
    message.value = 'Người dùng đã được cập nhật thành công.';
  } catch (error) {
    console.log(error);
    message.value = 'Có lỗi xảy ra khi cập nhật người dùng.';
  }
}

async function onDeleteUser(id) {
    console.log(id)
    if (confirm('Bạn muốn xóa người dùng này?')) {
    try{
      
        await UsersService.deleteUser(id);
        router.push({name: 'UserPage'})
    }catch (error){
        console.log(error);
    }
  }
}
async function getUser(id){
    try{
        user.value = await UsersService.fetchUser(id);
    }catch (error){
        console.log(error);
    }
}
getUser(props.id);
</script>

<template>
  <div class="user-add container py-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-center text-white mb-4">Chỉnh sửa thông tin người dùng</h2>
        <UserForm
        v-if="user.username"
        :user="user" 
        @submit:user="onUpdateUser"
        @submit:delete="onDeleteUser" />
        
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
