<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import songsService from "@/services/songs.service";
import AudioPlayer from "@/components/AudioPlayer.vue";
import SongList from "@/views/user/SongList.vue"; 

const router = useRouter();
const songs = ref([]);
const selectedSong = ref(null);
const audio = ref(null);
const audioPlaying = ref(false);
const selectedIndex = ref(-1);

async function loadAllSongs() {
  try {
    const data = await songsService.fetchSongs(1, 202);
    songs.value = data.songs.sort((a, b) => b.song_id - a.song_id);
  } catch (error) {
    console.error("Error fetching all songs:", error.message);
  }
}

function selectSong(index, song) {
  selectedIndex.value = index;
  selectedSong.value = song;

  if (audio.value) {
    audio.value.pause();
  }
  audio.value = new Audio(song.sound);
  audio.value.play().catch((err) => {
    console.error("Error playing song:", err.message);
  });

  audioPlaying.value = true;
}

function updateSelectedIndex(index) {
  selectedIndex.value = index;
  selectedSong.value = songs.value[index];
}

function playSong(song) {
  selectSong(selectedIndex.value, song);
}

onMounted(() => {
  loadAllSongs();
});
</script>

<template>
  <div class="song-page">
    <SongList :songs="songs" @selectSong="selectSong" />

    <AudioPlayer 
      :songs="songs" 
      :selectedSong="selectedSong"
      v-model:audioPlaying="audioPlaying"
      :audio="audio"
      @update:selectedIndex="updateSelectedIndex"
      @play:song="playSong"
    />
  </div>
</template>
