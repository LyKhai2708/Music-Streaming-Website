<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <form class="bg-dark text-light p-5 rounded-lg shadow-lg" style="max-width: 700px; width: 100%;" @submit.prevent="submitUser">
        <h2 class="text-center mb-5">Cập nhật hồ sơ</h2>
  
        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="formValues.email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': formErrors.email }"
            placeholder="Nhập email"
          />
          <div v-if="formErrors.email" class="invalid-feedback">{{ formErrors.email }}</div>
        </div>
  
        <!-- Tên người dùng -->
        <div class="mb-4">
          <label for="username" class="form-label">Tên người dùng</label>
          <input
            id="username"
            v-model="formValues.username"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': formErrors.username }"
            placeholder="Nhập tên người dùng"
          />
          <div v-if="formErrors.username" class="invalid-feedback">{{ formErrors.username }}</div>
        </div>
  
        <!-- Tên đầy đủ -->
        <div class="mb-4">
          <label for="full_name" class="form-label">Tên đầy đủ</label>
          <input
            id="full_name"
            v-model="formValues.full_name"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': formErrors.full_name }"
            placeholder="Nhập tên đầy đủ"
          />
          <div v-if="formErrors.full_name" class="invalid-feedback">{{ formErrors.full_name }}</div>
        </div>
  
        <!-- Ảnh đại diện -->
        <div class="mb-4">
          <label for="avatar" class="form-label">Ảnh đại diện</label>
          <div class="d-flex flex-column align-items-center">
            <img
              :src="avatarPreview"
              alt="Avatar"
              class="rounded-circle mb-3"
              style="width: 120px; height: 120px; object-fit: cover; border: 3px solid #fff; cursor: pointer; transition: transform 0.3s ease;"
              @click="avatarFileInput.click()"
            />
            <input
              id="avatar"
              ref="avatarFileInput"
              type="file"
              class="form-control d-none"
              @change="previewAvatar"
              accept="image/*"
            />
          </div>
        </div>
  
        <!-- Hành động -->
        <div class="d-flex justify-content-between">
          <button type="button" class="btn btn-secondary" @click="$emit('cancel')">Hủy</button>
          <button type="submit" class="btn btn-success">Lưu hồ sơ</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const props = defineProps({
    user: { type: Object, required: true },
  });
  
  const avatarPreview = ref(props.user.avatar || "");
  const formValues = ref({
    username: props.user.username || "",
    email: props.user.email || "",
    full_name: props.user.full_name || "",
  });
  let formErrors = ref({});
  
  const avatarFileInput = ref(null); // Tham chiếu đến input file avatar
  
  function validateForm() {
    formErrors.value = {};
    const { username, email, full_name } = formValues.value;
  
    if (!username.trim()) {
      formErrors.value.username = 'Tên người dùng không được để trống.';
    } else if (username.length < 2 || username.length > 50) {
      formErrors.value.username = 'Tên người dùng phải từ 2 đến 50 ký tự.';
    }
  
    if (!email.trim()) {
      formErrors.value.email = 'E-mail không được để trống.';
    } else if (!/\S+@\S+\.\S+/.test(email) || email.length > 50) {
      formErrors.value.email = 'E-mail không đúng hoặc quá 50 ký tự.';
    }
  
    if (!full_name.trim()) {
      formErrors.value.full_name = 'Tên đầy đủ không được để trống.';
    } else if (full_name.length > 100) {
      formErrors.value.full_name = 'Tên đầy đủ tối đa 100 ký tự.';
    }
  
    return Object.keys(formErrors.value).length === 0;
  }
  
  function previewAvatar(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  const $emit = defineEmits(['submit:user']);
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
  </script>
  
  <style scoped>
  body {
    font-family: 'Circular Std', 'Roboto', sans-serif;
    background-color: #121212;
  }
  
  form {
    background-color: #1d1d1d;
  }
  
  input.form-control {
    background-color: #121212;
    color: #fff;
    border: 1px solid #333;
  }
  
  input.form-control:focus {
    border-color: #1DB954;
    background-color: #1d1d1d;
  }
  
  button {
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 5px;
  }
  
  button.btn-success {
    background-color: #1DB954;
    border-color: #1DB954;
  }
  
  button.btn-secondary {
    background-color: #5f6368;
    border-color: #5f6368;
  }
  
  button:hover {
    opacity: 0.9;
  }
  
  .invalid-feedback {
    font-size: 0.875rem;
    color: #e74c3c;
  }
  
  img:hover {
    transform: scale(1.05);
  }
  </style>
  