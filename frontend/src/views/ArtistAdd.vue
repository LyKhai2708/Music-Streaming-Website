<script setup>
import { ref } from 'vue';
import ArtistForm from '@/components/ArtistForm.vue';
import artistsService from '@/services/artists.service';

const artist = ref({
  artist_name: '',
  bio: '',
  country: '',
  avatar: '../public/images/OIP.jpg'
});
const message = ref('');

async function onAddArtist(formData) {
  try {
    console.log(formData.get('artist_name'))
    await artistsService.createArtist(formData);
    message.value = 'Artist đã được thêm thành công.';
    artist.value = { artist_name: '', bio: '', country: '', avatar: 'null' };
  } catch (error) {
    console.log(error);
    message.value = 'Có lỗi xảy ra khi thêm Artist.';
  }
}
</script>

<template>
  <div class="artist-add container py-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-center text-white mb-4">Thêm Artist mới</h2>
        <ArtistForm :artist="artist" @submit:artist="onAddArtist" />
        <p v-if="message" :class="['message', { 'text-success': message.includes('thành công'), 'text-danger': message.includes('lỗi') }]">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.artist-add {
  max-width: 600px;
  margin: auto;
}
.card-body { background-color: #121212; }
.message { margin-top: 1rem; font-weight: bold; }
.text-success { color: #1ed760; }
.text-danger { color: #dc3545; }
</style>
