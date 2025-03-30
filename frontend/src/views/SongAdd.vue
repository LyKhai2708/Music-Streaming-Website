<script setup>
import { ref, onMounted } from 'vue';
import SongForm from '@/components/SongForm.vue';
import SongsService from '@/services/songs.service';
import GenreService from '@/services/genre.service';
import ArtistService from '@/services/artists.service';

const song = ref({
  song_name: '',
  genre_id: '',
  streaming_count: '',
  sound: null,
  avatar: null,
  duration: '',
  release_date: '',
  artist_id: [],
});
const genres = ref([]);
const artists = ref([]);
const message = ref('');

onMounted(async () => {
  try {
    const data = await GenreService.fetchGenres();
    genres.value = data.genres;

    const artistData = await ArtistService.fetchArtists(1, 500);
    artists.value = artistData.artists;
  } catch (error) {
    console.error('Error loading genres or artists:', error);
  }
});

async function onAddSong(formData) {
  try {
    console.log(formData)
    await SongsService.createSong(formData);
    message.value = 'Bài hát đã được thêm thành công.';
    song.value = { song_name: '', genre_id: '', streaming_count: '', sound: null, avatar: null, duration: '', release_date: '', artist_id: [] };
  } catch (error) {
    console.log(error);
    message.value = 'Có lỗi xảy ra khi thêm bài hát.';
  }
}
</script>

<template>
  <div class="song-add container py-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-center text-white mb-4">Thêm bài hát mới</h2>
        <SongForm :song="song" :genres="genres" :artists="artists" @submit:song="onAddSong" />
        
        <p v-if="message" :class="['message', { 'text-success': message.includes('thành công'), 'text-danger': message.includes('lỗi') }]">{{ message }}</p>
      </div>
    </div>
  </div>
</template>



<style scoped>
.song-add {
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

/* Button Styling */
button {
  transition: all 0.3s ease;
}

button:hover {
  transform: scale(1.05);
  background-color: #3be477;
}
</style>
