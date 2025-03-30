<script setup>
import { ref, onMounted } from 'vue';
import SongForm from '@/components/SongForm.vue';
import SongsService from '@/services/songs.service';
import GenreService from '@/services/genre.service';
import ArtistService from '@/services/artists.service';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const props = defineProps({
    id: { type: Object, required: true },
});

const song = ref({
  song_name: '',
  genre_id: '',
  streaming_count: '',
  sound: null,
  avatar: null,
  duration: '',
  release_date: '',
  artist_ids: [],
});
const genres = ref([]);
const artists = ref([]);
const message = ref('');

// Fetch genres, artists, and song details on mounted
onMounted(async () => {
  try {
    const data = await GenreService.fetchGenres();
    genres.value = data.genres;

    const artistData = await ArtistService.fetchArtists(1, 500);
    artists.value = artistData.artists;
    await getSongdata(props.id);
  } catch (error) {
    console.error('Error loading genres, artists, or song details:', error);
  }
});

async function getSongdata(id) {
  try {
    const data = await SongsService.fetchSong(id);
    song.value = data;
    console.log(data)
  } catch (error) {
    console.error('Error fetching song data:', error);
  }
}

async function onUpdateSong(song) {
  try {
    await SongsService.updateSong(song.get('song_id'), song);
    message.value = 'Bài hát đã được cập nhật thành công.';
    console.log(song.get("avatarFile"));
  } catch (error) { 
    console.log(error);
    message.value = 'Có lỗi xảy ra khi cập nhật bài hát.';
  }
}

// Handle delete song
async function onDeleteSong(id) {
  if (confirm('Bạn có chắc chắn muốn xoá bài hát này?')) {
    try {
      await SongsService.deleteSong(id);
      message.value = 'Bài hát đã được xoá thành công.';
      router.push({ name: 'SongPage' });
    } catch (error) {
      console.log(error);
      message.value = 'Có lỗi xảy ra khi xoá bài hát.';
    }
  }
}
</script>

<template>
  <div class="song-update container py-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-center text-white mb-4">Cập nhật bài hát</h2>
        <SongForm 
            v-if="song.song_name" 
            :song="song" 
            :genres="genres" 
            :artists="artists" 
            @submit:song="onUpdateSong" 
            @delete:song="onDeleteSong"
          />
        
        <p v-if="message" :class="['message', { 'text-success': message.includes('thành công'), 'text-danger': message.includes('lỗi') }]">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.song-update {
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

.btn-danger {
  background-color: #dc3545;
  border: none;
  color: white;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>
