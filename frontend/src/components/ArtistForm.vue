<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  artist: { type: Object, required: false }, 
});

const avatarFileInput = ref(null);
const avatarFile = ref(props.artist?.avatar || '/public/images/OIP.jpg'); 
console.log(props.artist.avatar);
const formValues = ref({
  artist_name: props.artist?.artist_name || '', 
  bio: props.artist?.bio || '',
  country: props.artist?.country || '',
});
const formErrors = ref({});
const countries = ref([]);
const $emit = defineEmits(['submit:artist', 'delete:artist']);


watch(() => props.artist, (newArtist) => {
  if (newArtist) {
    formValues.value.artist_name = newArtist.artist_name || '';
    formValues.value.bio = newArtist.bio || '';
    formValues.value.country = newArtist.country || '';
  }
}, { immediate: true });

// Fetch countries data from the API on component mount
onMounted(async () => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    countries.value = response.data.map(country => country.name.common).sort();
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
});

function validateForm() {
  formErrors.value = {};
  const { artist_name, country, bio } = formValues.value;

  if (artist_name.length < 2 || artist_name.length > 50) formErrors.value.artist_name = 'Tên artist phải từ 2 đến 50 ký tự.';
  if (!country) formErrors.value.country = 'Vui lòng chọn quốc tịch.';

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

function submitArtist() {
  if (!validateForm()) return;
  const formData = new FormData();
  Object.entries(formValues.value).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });
  if (props.artist.artist_id) {
      formData.append('artist_id', props.artist.artist_id);
  }
  if (avatarFileInput.value?.files[0]) formData.append('avatarFile', avatarFileInput.value.files[0]);
  $emit('submit:artist', formData);
}

function deleteArtist() {

  $emit('delete:artist', props.artist?.artist_id); // For delete action
}
</script>

<template>
  <form @submit.prevent="submitArtist">
    <div class="mb-3 ">
      <label for="artist_name" class="form-label text-light">Tên Artist</label>
      <input 
        v-model="formValues.artist_name" 
        type="text" 
        class="form-control bg-transparent text-secondary border-light" 
        :class="{ 'is-invalid': formErrors.artist_name }" 
        placeholder="Nhập tên artist" 
      />
      <div v-if="formErrors.artist_name" class="invalid-feedback">{{ formErrors.artist_name }}</div>
    </div>

    <div class="mb-3">
      <label for="country" class="form-label text-light">Quốc tịch</label>
      <select 
        v-model="formValues.country" 
        class="form-select bg-transparent text-secondary border-light" 
        :class="{ 'is-invalid': formErrors.country }"
      >
        <option value="" disabled>Chọn quốc gia</option>
        <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
      </select>
      <div v-if="formErrors.country" class="invalid-feedback">{{ formErrors.country }}</div>
    </div>

    <div class="mb-3">
      <label for="bio" class="form-label text-light">Bio</label>
      <textarea 
        v-model="formValues.bio" 
        class="form-control bg-transparent text-secondary border-light" 
        :class="{ 'is-invalid': formErrors.bio }" 
        placeholder="Nhập bio"
      ></textarea>
      <div v-if="formErrors.bio" class="invalid-feedback">{{ formErrors.bio }}</div>
    </div>

    <div class="mb-3">
      <label for="avatarFile" class="form-label text-light">Ảnh đại diện</label>
      <div class="d-flex flex-column align-items-center" style="cursor: pointer;">
        <img 
          :src="avatarFile" 
          @click="avatarFileInput.click()" 
          class="avatar-preview img-fluid rounded-circle" 
          alt="Avatar Preview" 
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
      <button type="submit" class="btn btn-success w-100 me-2">{{ props.artist ? 'Cập nhật' : 'Thêm mới' }}</button>
      <!-- Nút xóa -->
      <button 
        v-if="props.artist.artist_id" 
        type="button" 
        @click="deleteArtist" 
        class="btn btn-danger w-100"
      >
        Xóa
      </button>
    </div>
  </form>
</template>

<style scoped>

.avatar-preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.avatar-preview:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
}

.text-light {
  color: #f8f9fa !important;
}
</style>
