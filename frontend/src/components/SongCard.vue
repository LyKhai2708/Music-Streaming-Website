<script setup>
import { ref, onMounted, watch } from 'vue';
import Vibrant from 'node-vibrant';
import { useRouter } from 'vue-router'; 

const props = defineProps({
  song: { type: Object, required: true },
});

const backgroundColor = ref('linear-gradient(135deg, #6b2e00, #b94700)');
const audioElement = ref(null); 
const isModalVisible = ref(false);
const router = useRouter();

const setBackgroundColor = async (imageSrc) => {
  try {
    const palette = await Vibrant.from(imageSrc).getPalette();
    const color1 = palette.Vibrant.hex;
    const color2 = palette.DarkVibrant ? palette.DarkVibrant.hex : palette.Muted.hex;
    backgroundColor.value = `linear-gradient(135deg, ${color1}, ${color2})`;
  } catch (error) {
    console.error('Error extracting colors:', error);
  }
};

const updateStreamingCount = () => {
  if (audioElement.value) {
    const percentagePlayed = (audioElement.value.currentTime / audioElement.value.duration) * 100;

    if (percentagePlayed >= 50 && !props.song.isPlayed) {
      props.song.streaming_count += 1;
      props.song.isPlayed = true; 
    }
  }
};

const openModal = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

onMounted(() => {
  setBackgroundColor(props.song.avatar);
  if (audioElement.value) {
    audioElement.value.addEventListener('timeupdate', updateStreamingCount);
  }
});

watch(() => props.song.avatar, (newAvatar) => {
  setBackgroundColor(newAvatar);
});
</script>

<template>
  <div class="spotify-ui card" :style="{ background: backgroundColor }" @click="openModal">
    <!-- Song Title -->
    <h4 class="song-title">{{ song.song_name }}</h4>

    <!-- Artist Name -->
    <div class="artist-name">{{ song.artist_name }}</div>

    <!-- Album Cover (centered) -->
    <div class="album-cover-container">
      <img class="album-cover img-fluid" :src="song.avatar" alt="Album cover" />
    </div>

    <!-- Song Details -->
    <div class="song-details">
      <p><strong>Genre:</strong> {{ song.genre_name }}</p>
      <p><strong>Streaming Count:</strong> {{ song.streaming_count }}</p>
    </div>

    <!-- Audio Player -->
    <div class="audio-player">
      <audio ref="audioElement" :src="song.sound" controls></audio>
    </div>
    <router-link :to="{ name: 'Song.update', params: { id: song.song_id }}">
              <button class="btn btn-outline-success w-100">Chỉnh sửa bài nhạc</button>
    </router-link>
  </div>

  <!-- Modal (Hiển thị khi modalVisible == true) -->
  <div v-if="isModalVisible" class="modal fade show" tabindex="-1" aria-hidden="true" @click.self="closeModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content" :style="{ background: backgroundColor }">
        <div class="modal-header">
          <h5 class="modal-title">{{ song.song_name }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="spotify-ui">
            <div class="album-cover-container mb-3">
              <img class="album-cover img-fluid" :src="song.avatar" alt="Album cover" />
            </div>
            <div class="song-details mb-3">
              <p><strong>Genre:</strong> {{ song.genre_name }}</p>
              <p><strong>Streaming Count:</strong> {{ song.streaming_count }}</p>
            </div>

            <div class="audio-player mt-3">
              <audio ref="audioElement" :src="song.sound" controls></audio>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.spotify-ui {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  border-radius: 15px;
  transition: background 0.5s ease;
}

.song-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

.artist-name {
  font-size: 1rem;
  color: #cfcfcf;
  margin-bottom: 1rem;
  text-align: center;
}

.album-cover-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 300px;
  height: 300px;
}

.album-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.song-details {
  font-size: 0.9rem;
  color: #cfcfcf;
  text-align: center;
  margin-bottom: 1rem;
}

.audio-player {
  width: 100%;
  max-width: 300px;
  margin-top: 1rem;
}

.audio-player audio {
  width: 100%;
  border-radius: 8px;
}

.modal-content {
  border-radius: 15px;
}

.modal-header {
  background-color: rgba(52, 58, 64, 0.7);
  color: white;
}

.modal-body {
  background-color: rgba(52, 58, 64, 0.85);
}

.modal-footer {
  background-color: transparent;
}

.modal .btn-close {
  color: white;
}
</style>
