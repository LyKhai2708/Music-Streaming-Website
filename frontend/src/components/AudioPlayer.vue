<script setup>
import { ref, onMounted, watch } from "vue";
import songsService from "@/services/songs.service";
const currentTime = ref(0);
const duration = ref(0);
const hasUpdated = ref(false);
const volume = ref(1)
const props = defineProps({
  songs: { type: Array, default: () => [] },
  selectedSong: { type: Object, required: true },
  audioPlaying: {type: Object, required: true},
  audio: {type: Object, required: true},
});

const $emit = defineEmits(['update:audioPlaying', 'update:selectedIndex', 'play:song']);

function nextSong() {
  const currentIndex = props.songs.findIndex(song => song.song_id === props.selectedSong.song_id);
  const nextIndex = (currentIndex + 1) % props.songs.length;
  $emit("update:selectedIndex", nextIndex);
  $emit("play:song", props.songs[nextIndex]);
}
function prevSong() {
  const currentIndex = props.songs.findIndex(song => song.song_id === props.selectedSong.song_id);
  const prevIndex = (currentIndex - 1 + props.songs.length) % props.songs.length;

  $emit("update:selectedIndex", prevIndex);
  $emit("play:song", props.songs[prevIndex]);
}
function togglePlay() {
  if (props.audio) {
    if (props.audioPlaying) {
      props.audio.pause();
      $emit("update:audioPlaying", false);
    
    } else {
      props.audio.play();
      $emit("update:audioPlaying", true);
    }
  }

}
async function updateStreaming(){
  try {
    let streaming_count = props.selectedSong.streaming_count + 1
    const data = await songsService.updateStreamingCount(props.selectedSong.song_id, streaming_count)
    console.log(streaming_count)
  } catch (error) {
    console.error("Error update streaming count:", error.message)
  }
  
}
function setProgress(e) {
  const width = e.target.clientWidth;
  const offsetX = e.offsetX;
  const duration = props.audio.duration;
  props.audio.currentTime = (offsetX / width) * duration;
}
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
function updateVolume(event) {
  const validVolume = isNaN(event.target.value) ? 1 : Math.min(1, Math.max(0, event.target.value));
  volume.value = validVolume;
  if (props.audio) {
    props.audio.volume = validVolume;
  }
}

onMounted(() => {
  if (props.audio) {
    props.audio.addEventListener('loadedmetadata', () => {
      duration.value = props.audio.duration;
    });

    props.audio.addEventListener('timeupdate', () => {
      currentTime.value = props.audio.currentTime;
    });

    if (props.audioPlaying) {
      props.audio.play();
    } 
  }
});
setInterval(() => {
  duration.value = props.audio.duration;
  currentTime.value = props.audio.currentTime;
}, 100); 
watch(() => currentTime.value, (newValue) => {
  if (newValue >= duration.value / 2 && !hasUpdated.value) {
    updateStreaming();
    hasUpdated.value = true;
  }
  if (newValue <= 0) {
    hasUpdated.value = false;
  }
});

</script>
<template>
  <div v-if="selectedSong" class="audio-player bg-dark text-white py-2 px-3 fixed-bottom d-flex align-items-center justify-content-between">
    <!-- Song Thumbnail and Info -->
    <div class="d-flex align-items-center gap-2">
      <img :src="selectedSong.avatar" alt="Song thumbnail" class="rounded" style="width: 50px; height: 50px;" />
      <div>
        <h6 class="m-0">{{ selectedSong.song_name }}</h6>
        <p class="m-0 text-muted">{{ selectedSong.artist_name }}</p>
      </div>
    </div>

    <!-- Player Controls -->
    <div class="d-flex align-items-center gap-3">
      <button @click="prevSong" class="btn btn-link text-white">
        <i class="bi bi-skip-backward-fill fs-4"></i>
      </button>
      <button @click="togglePlay" class="btn btn-primary rounded-circle ">
        <i :class="props.audioPlaying ? 'bi bi-pause-fill fs-4' : 'bi bi-play-fill fs-4'"></i>
      </button>
      <button @click="nextSong" class="btn btn-link text-white">
        <i class="bi bi-skip-forward-fill fs-4"></i>
      </button>
    </div>

    <!-- Duration and Progress Bar -->
    <div class="w-50">
      <div class="d-flex justify-content-between text-white-50 mb-1">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(duration) }}</span>
      </div>
      <div class="progress" style="height: 5px;" @click="setProgress">
        <div class="progress-bar bg-success" role="progressbar" :style="{ width: (currentTime / duration) * 100 + '%' }"></div>
      </div>
    </div>

    <!-- Volume Control -->
    <div class="d-flex align-items-center">
      <i class="bi bi-volume-up-fill text-white me-2"></i>
      <input
        type="range"
        class="form-range"
        min="0"
        max="1"
        step="0.01"
        :value="volume"
        @input="updateVolume"
        style="width: 100px;"
      />
    </div>
  </div>
</template>


<style scoped>
.audio-player {
  border-top: 1px solid #282828;
}
.btn-primary {
  background-color: #28a745;
  border: none;
  color: black;
}
.progress-bar {
  transition: width 0.3s ease;
}
.form-range{
  color: #28a745;
}
</style>

