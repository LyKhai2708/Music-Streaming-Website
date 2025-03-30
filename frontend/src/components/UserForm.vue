<script setup>
import { ref, computed } from 'vue';
import {useRoute} from 'vue-router'
const route = useRoute();
const props = defineProps({
  user: { type: Object, required: true },
});
const $emit = defineEmits(['submit:user', 'submit:delete']);



let avatarFileInput = ref(null);
let avatarFile = ref(props.user.avatar);
let formValues = ref({
  username: props.user?.username || '',
  email: props.user?.email || '',
  full_name: props.user?.full_name || '',
  password: '',
  confirmpass: ''
});
let formErrors = ref({});

//xác định chế độ "sửa" hay "thêm"
const isEditMode = computed(() => !!route.params.id);
function validateForm() {
  formErrors.value = {};
  const { username, email, full_name, password, confirmpass } = formValues.value;
  console.log(username, email, full_name, password, confirmpass);
  if (username.length < 2 || username.length > 50) {
    formErrors.value.username = 'Tên người dùng phải từ 2 đến 50 ký tự.';
  }
  if (!/\S+@\S+\.\S+/.test(email) || email.length > 50) {
    formErrors.value.email = 'E-mail không đúng hoặc quá 50 ký tự.';
  }
  if (full_name.length > 100) {
    formErrors.value.full_name = 'Tên đầy đủ tối đa 100 ký tự.';
  }

  if (!isEditMode.value) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      formErrors.value.password = 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt.';
    }
    if (password !== confirmpass) {
      formErrors.value.confirmpass = 'Xác thực mật khẩu không khớp.';
    }
  }

  return Object.keys(formErrors.value).length === 0;
}

function previewAvatarFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (evt) => {
    avatarFile.value = evt.target.result;
  };
  reader.readAsDataURL(file);
}

function submitUser() {
  if (!validateForm()) return;
  const formData = new FormData();
  Object.entries(formValues.value).forEach(([key, value]) => {
    if (value) formData.append(key, value);
    console.log([key, value]);
  });
  if (props.user.user_id) {
    formData.append('user_id', props.user.user_id);
  }
  if (avatarFileInput.value.files[0]) {
    formData.append('avatarFile', avatarFileInput.value.files[0]);
  }

  $emit('submit:user', formData);
}

function deleteUser() {
  $emit('submit:delete', props.user.user_id);
}
</script>


<template>
  <form @submit.prevent="submitUser" class="container mt-4">
    <div v-for="(key,label) in { 'Tên đăng nhập': 'username', 'E-mail': 'email', 'Tên đầy đủ': 'full_name' }" :key="key" class="mb-3">
      <label :for="key" class="form-label text-light">{{ label }}</label>
      <input
        v-model="formValues[key]"
        :type="key.includes('pass') ? 'password' : 'text'"
        class="form-control"
        :class="{ 'is-invalid': formErrors[key] }"
        :placeholder="`Nhập ${label.toLowerCase()}`"
      />
      <div v-if="formErrors[key]" class="invalid-feedback">{{ formErrors[key] }}</div>
    </div>

    <!-- Hiển thị các trường mật khẩu nếu không ở chế độ sửa -->
    <div v-if="!isEditMode">
      <div class="mb-3">
        <label for="password" class="form-label text-light">Mật khẩu</label>
        <input
          v-model="formValues.password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': formErrors.password }"
          placeholder="Nhập mật khẩu"
        />
        <div v-if="formErrors.password" class="invalid-feedback">{{ formErrors.password }}</div>
      </div>

      <div class="mb-3">
        <label for="confirmpass" class="form-label text-light">Xác thực mật khẩu</label>
        <input
          v-model="formValues.confirmpass"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': formErrors.confirmpass }"
          placeholder="Xác nhận mật khẩu"
        />
        <div v-if="formErrors.confirmpass" class="invalid-feedback">{{ formErrors.confirmpass }}</div>
      </div>
    </div>

    <div class="mb-3">
      <label for="avatarFile" class="form-label text-light">Ảnh đại diện</label>
      <div class="avatar-upload d-flex flex-column align-items-center">
        <img
          :src="avatarFile"
          alt="Avatar"
          @click="avatarFileInput.click()"
          class="avatar-preview mb-4"
        />
        <input
          type="file"
          ref="avatarFileInput"
          class="d-none"
          @change="previewAvatarFile"
        />
      </div>
    </div>

    <div class="d-flex">
      <button type="submit" class="btn btn-success w-100 me-2">{{ props.user.user_id ? 'Cập nhật' : 'Thêm mới' }}</button>
      <!-- Nút xóa -->
      <button 
        v-if="props.user.user_id" 
        type="button" 
        @click="deleteUser" 
        class="btn btn-danger w-100"
      >
        Xóa
      </button>
    </div>
  </form>
</template>


<style scoped>
/* Avatar upload section */
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-top: 1rem;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.avatar-preview:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
}

/* Error handling styles (kept from your custom styles) */
.is-invalid {
  border-color: red;
}
.form-control{
  background-color: #121212;
  color: #6c757d;
}
.form-control::placeholder{
  color: #6c757d;
}
.form-group{
  margin-top: 10px;
}
.invalid-feedback {
  display: block;
  color: red;
  font-size: 0.875rem;
}

.text-light {
  color: #f8f9fa !important;
}

</style>