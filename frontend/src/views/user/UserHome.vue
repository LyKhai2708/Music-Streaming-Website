<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import songsService from "@/services/songs.service";
import artistsService from "@/services/artists.service";
import AudioPlayer from "@/components/AudioPlayer.vue";
import SongList from "@/views/user/SongList.vue";  // Import SongList component
import 'bootstrap-icons/font/bootstrap-icons.css';
import ArtistList from "@/views/user/ArtistList.vue";  // Import ArtistList component

const router = useRouter();
const featuredSongs = ref([]);
const songs = ref([]);
const artists = ref([]);
const selectedSong = ref(null);
const selectedArtist = ref(null);
const audio = ref(null);
const selectedIndex = ref(-1);



const audioPlaying = ref(false); 

async function loadFeaturedSongs() {
  try {
    const data = await songsService.fetchSongs(1, 3);
    featuredSongs.value = data.songs;
  } catch (error) {
    console.error("Error fetching featured songs:", error.message);
  }
}

async function loadAllSongs() {
  try {
    const data = await songsService.fetchSongs(1, 4);
    songs.value = data.songs.sort((a, b) => b.song_id - a.song_id);
  } catch (error) {
    console.error("Error fetching all songs:", error.message);
  }
}

async function loadAllArtists() {
  try {
    const data = await artistsService.fetchArtists(1, 4);  // Lấy danh sách nghệ sĩ
    artists.value = data.artists;  // Giả sử dữ liệu trả về có trường `artists`
  } catch (error) {
    console.error("Error fetching artists:", error.message);
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


const updateSelectedIndex = (index) => {
  selectedIndex.value = index;
  selectedSong.value = songs.value[index];
};

const playSong = (song) => {
  selectSong(selectedIndex.value, song); 
};

onMounted(() => {
  loadFeaturedSongs();
  loadAllSongs();
  loadAllArtists();
});
</script>

<template>
  <div class="song-page container">
    <!-- Slider Section -->
    <div class="slider-container mb-5">
      <div id="featuredSongsCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div
            v-for="(song, index) in featuredSongs"
            :key="song.song_id"
            class="carousel-item"
            :class="{ active: index === 0 }"
          >
            <div class="card border-0">
              <img :src="song.avatar" class="d-block w-100" :alt="song.song_name" />
              <div class="carousel-caption bg-dark bg-opacity-75 rounded p-2">
                <h5>{{ song.song_name }}</h5>
                <p>{{ song.artist_name }}</p>
              </div>
            </div>
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#featuredSongsCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#featuredSongsCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>

    <!-- Artist List -->
    <ArtistList :artists="artists"/>

    <!-- Song List -->
    <SongList :songs="songs" @selectSong="selectSong" />

    <!-- Audio Player -->
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


<style scoped>
.slider-container img {
  height: 400px;
  object-fit: cover;
}

.carousel-caption {
  max-width: 80%;
  margin: 0 auto;
}

.carousel-caption h5 {
  font-size: 1.25rem;
}

.carousel-caption button {
  font-size: 1.5rem;
  padding: 10px;
}
.audio-player {
  background-color: #181818;
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
}
</style>