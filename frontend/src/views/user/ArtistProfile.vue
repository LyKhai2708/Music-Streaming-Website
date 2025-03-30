<template>
  <!-- Container cho hồ sơ nghệ sĩ -->
  <div class="profile-container text-center d-flex flex-column justify-content-center align-items-center text-white" :style="backgroundStyle">
    <!-- Thông tin nghệ sĩ -->
    <div class="artist-info">
      <p class="verified-label d-flex align-items-center justify-content-center mb-2">
        <i class="bi bi-patch-check-fill verified-icon me-2 text-success"></i> Nghệ sĩ được xác minh
      </p>
      <h1 class="artist-name display-4 fw-bold">{{ artist?.artist_name }}</h1>
      <p class="monthly-listeners">{{ formatNumber(totalListeners) }} lượt nghe</p>
    </div>
  </div>

  <!-- Nút phát tất cả -->
  <div class="play-all-container my-3 d-flex justify-content-center">
    <button class="btn btn-success rounded-pill px-4 py-2 d-flex align-items-center" @click="playAllSongs">
      <i :class="audioPlaying ? 'bi bi-pause-fill me-2' : 'bi bi-play-fill me-2'"></i> Phát tất cả
    </button>
  </div>

  <!-- Danh sách bài hát -->
  <div class="container ">
    <div v-for="(song, index) in songs" :key="song.song_id" class="song-item row align-items-center mb-3 p-2" @click="selectSong(index, song)">
      <div class="col-auto song-number fw-bold text-secondary">{{ index + 1 }}</div>
      <div class="col-auto ">
        <img :src="song.avatar" alt="Artist Avatar" class="artist-avatar  rounded-circle" />
      </div>
      <div class="col song-details text-secondary">
        <p class="song-title fw-bold mb-1">{{ song.song_name }}</p>
        <div class="song-info d-flex justify-content-between">
          <p class="song-listens">{{ formatNumber(song.streaming_count) }} lượt nghe</p>
          <p class="song-duration">{{ IntoMinute(song.duration) }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Audio Player -->
  <AudioPlayer
    :songs="songs"
    :selectedSong="selectedSong"
    v-model:audioPlaying="audioPlaying"
    :audio="audio"
    @update:selectedIndex="updateSelectedIndex"
    @play:song="playSong"
  />

  <!-- Phần "About" -->
   <h2 class="text-white">About</h2>
<div 
  class="about-section bg-dark bg-opacity-75 text-white text-start mt-4  rounded" 
  :style="{ backgroundImage: 'url(' + backgroundImage + ')', backgroundSize: 'cover', backgroundPosition: 'center' }">
  <div class="about-overlay container p-4">
    <div class="row align-items-end h-100">
      <div class="col mt-5 ">
        <p class="monthly-listeners fw-bold fs-8">{{ formatNumber(totalListeners) }} lượt nghe</p>
        <p class="artist-bio fs-8">{{ artist?.bio || "Thông tin nghệ sĩ chưa được cập nhật." }}</p>
      </div>
    </div>
  </div>
</div>

</template>

<script setup>
import { defineProps, ref, onMounted, computed } from "vue";
import song_artistsService from "@/services/song_artists.service";
import artistsService from "@/services/artists.service";
import AudioPlayer from "@/components/AudioPlayer.vue";
const props = defineProps({
  artistId: { type: String, required: true },
});

const selectedSong = ref(null);
const backgroundStyle = ref("");
const songs = ref([]);
const artist = ref([]);
const audio = ref(null);
const audioPlaying = ref(false);
const backgroundImage = ref([]);

async function loadArtistSongs() {
  try {
    const data = await song_artistsService.getSongsByArtistId(props.artistId);
    songs.value = data.songs;

    if (songs.value.length > 0) {
      const randomSong = songs.value[Math.floor(Math.random() * songs.value.length)];
      backgroundImage.value = randomSong.avatar
    }
  } catch (error) {
    console.error("Error fetching artist songs:", error.message);
  }
}

async function getArtistInfo() {
  try {
    const ArtistData = await artistsService.fetchArtist(props.artistId);
    artist.value = ArtistData;
  } catch (error) {
    console.error("Error fetching artist:", error.message);
  }
}

const totalListeners = computed(() => songs.value.reduce((total, song) => total + song.streaming_count, 0));

function selectSong(song) {
  if (audio.value && !audio.value.paused) {
    audio.value.pause();
    audioPlaying.value = false;
  }
  selectedSong.value = song;
  playSong(song);
}

function formatNumber(number) {
  return new Intl.NumberFormat("vi-VN").format(number);
}

function updateSelectedIndex(index) {
  selectedSong.value = songs.value[index];
  playSong(selectedSong.value);
}

function playSong(song) {
  selectedSong.value = song;
  if (audio.value) {
    audio.value.pause();
  }
  audio.value = new Audio(song.sound);
  audio.value.play().catch((err) => console.error("Error playing song:", err.message));
  audioPlaying.value = true;
}

function playAllSongs() {
  if (songs.value.length > 0) {
    if (!audio.value) {
      playSong(songs.value[0]);
    } else if (!audio.value.paused) {
      audio.value.pause();
      audioPlaying.value = false;
    } else {
      playSong(songs.value[0]);
    }
  }
}

function IntoMinute(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
}

function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function generateRandomBackground() {
  return `linear-gradient(135deg, ${getRandomColor()}, ${getRandomColor()})`;
}

onMounted(() => {
  backgroundStyle.value = { background: generateRandomBackground() };
  loadArtistSongs();
  getArtistInfo();
});
</script>

<style scoped>
.container{
  cursor: pointer;
}
.profile-container {
  height: 300px;
  overflow: hidden;
}

.artist-avatar {
  width: 50px;
  height: 50px;
}

.about-section {
  position: relative;
  background-size: cover;
  background-position: center;
  width: 50%;
  height: 400px;
}

.about-overlay {
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
}
</style>
