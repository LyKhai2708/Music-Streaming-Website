<script setup>
import { ref } from 'vue';

const props = defineProps({
  songs: { type: Array, default: () => [] },
  selectedIndex: { type: Number, default: -1 },
});

const $emit = defineEmits(['update:selectedIndex', 'play:song']);

let avatarFile = ref(null);
let audioFile = ref(null);

function selectSong(index, song) {
  $emit('update:selectedIndex', index);
  avatarFile.value = song.avatar; 
  audioFile.value = song.sound; 
  $emit('play:song', song.sound); 
}
</script>

<template>
  <div class="container my-5">
    <!-- Dòng hiển thị các thẻ bài hát -->
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 g-4">
      <!-- Vòng lặp để hiển thị thông tin từng bài hát -->
      <div
        class="col"
        v-for="(song, index) in songs"
        :key="song.id"
        @click="selectSong(index, song)"
        role="button"
        tabindex="0"
      >
        <div class="card h-100 shadow-lg rounded-4 overflow-hidden border-0 bg-dark text-white">
          <!-- Hình ảnh đại diện -->
          <img
            :src="song.avatar"
            class="card-img-top img-fluid square-img"
            :alt="song.song_name"
          />
          <div class="card-body text-center">
            <h5 class="card-title mb-2 text-truncate">{{ song.song_name }}</h5>
            <p class="card-text mb-0 text-truncate" :title="song.genre_name">
              {{ song.genre_name }}
            </p>
          </div>
          <div class="card-footer text-center bg-success text-white">
            <small class="text-muted">Xem chi tiết</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Xem trước âm thanh và avatar khi bài hát được chọn -->
    <div v-if="selectedIndex !== -1" class="preview-section mt-4 text-center">
      <h5 class="text-light">Bài hát đang chọn</h5>
      <img :src="avatarFile" alt="Avatar" class="avatar-preview" />
      <audio :src="audioFile" controls class="audio-preview mt-3"></audio>
    </div>
  </div>
</template>

<style scoped>

.card {
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease, background-color 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  background-color: #343a40;
}

.card-body {
  padding: 1.25rem;
}

.card-title {
  font-size: 1.3rem;
  color: #28a745;
}

.card-text {
  font-size: 1rem;
  color: #adb5bd;
}

.card-footer {
  padding: 0.75rem;
  background-color: #28a745;
  border-top: 1px solid #ddd;
}

.card-img-top {
  border-bottom: 1px solid #ddd;
}

.card-text.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.square-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.audio-preview {
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

/* Điều chỉnh cho màn hình nhỏ */
@media (max-width: 767px) {
  .card {
    width: 100%;
  }
}
</style>
