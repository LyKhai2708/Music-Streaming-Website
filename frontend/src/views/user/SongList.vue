<template>
  <div class="poster-container container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="text-white">Songs</h3>
      <router-link v-if="$route.name !== 'Song.All'" :to="{ name: 'Song.All' }" class="text-white text-decoration-none">
        Show all
      </router-link>
    </div>

    <!-- Danh sách bài hát -->
    <div class="row">
      <div
        v-for="(song, index) in songs"
        :key="song.song_id"
        class="col-lg-3 col-md-4 col-sm-6 mb-4"
      >
        <div class="card song-card bg-dark text-white h-100">
          <div class="position-relative">
            <img :src="song.avatar" class="card-img-top" :alt="song.song_name" />
            <!-- Play Button -->
            <button
              class="btn btn-success play-btn position-absolute bottom-0 end-0 m-2"
              @click.stop="selectSong(index, song)"
            >
              <i class="bi bi-play-fill"></i>
            </button>
          </div>
          <div class="card-body">
            <h5 class="card-title text-success">{{ song.song_name }}</h5>
            <p class="card-text">{{ song.artist_name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  songs: { type: Array, required: true },
});

const $emit = defineEmits(['selectSong']);

const selectSong = (index, song) => {
  $emit('selectSong', index, song);
};
</script>


<style scoped>
.poster-container {
  padding: 20px;
}

.song-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.song-card:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.play-btn {
  border-radius: 50%;
  font-size: 1.5rem;
  color: black;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0; 
}

.position-relative:hover .play-btn {
  opacity: 1;
  transform: translateY(0);
}

.song-card .play-btn {
  opacity: 0;
  transform: translateY(10px);
}

.song-card:hover .play-btn {
  opacity: 1;
  transform: translateY(0);
}
</style>
