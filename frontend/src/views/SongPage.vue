<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SongCard from '@/components/SongCard.vue';
import InputSearch from '@/components/InputSearch.vue';
import SongList from '@/components/SongList.vue';
import songServices from '@/services/songs.service';
import Pagination from '@/components/Pagination.vue';

const router = useRouter();
const route = useRoute();
const totalPages = ref(1);
const songs = ref([]);
const selectedIndex = ref(-1);
const searchText = ref('');

const currentPage = computed(() => {
  const page = Number(route.query?.page);
  return Number.isNaN(page) || page < 1 ? 1 : page;
});

const searchableSongs = computed(() =>
  songs.value.map((song) => {
    const { song_name, genre_name, streaming_count } = song;
    return [song_name, genre_name, streaming_count].join('');
  })
);

const filteredSongs = computed(() => {
  if (!searchText.value) return songs.value;
  return songs.value.filter((song, index) =>
    searchableSongs.value[index].includes(searchText.value)
  );
});

const selectedSong = computed(() => {
  if (selectedIndex.value < 0) return null;
  return filteredSongs.value[selectedIndex.value];
});

async function retrieveSongs(page) {
  try {
    const chunk = await songServices.fetchSongs(page,12);
    totalPages.value = chunk.metadata.lastPage ?? 1;
    songs.value = chunk.songs.sort(
      (current, next) => current.song_name.localeCompare(next.song_name)
    );
    selectedIndex.value = -1;
  } catch (error) {
    console.log(error);
  }
}

function refetch() {
  retrieveSongs(currentPage.value);
}

function goToAddSong() {
  router.push({ name: 'Song.add' });
}

function changeCurrentPage(page) {
  router.push({ name: 'SongPage', query: { page } });
}

async function onDeleteSongs() {
  if (confirm('Xóa tất cả bài hát trong hệ thống ?')) {
    try {
      await songServices.deleteAllSongs();
      totalPages.value = 1;
      songs.value = [];
      selectedIndex.value = -1;
      changeCurrentPage(1);
    } catch (error) {
      console.log(error);
    }
  }
}

watch(searchText, () => (selectedIndex.value = -1));
watch(currentPage, () => retrieveSongs(currentPage.value), { immediate: true });
</script>

<template>
  <div class="page row mb-5">
    <div class="col-md-6 mt-5">
      <h4 class="d-flex align-items-center text-white">
        Song List <i class="fas fa-music ms-2"></i>
      </h4>
      <div class="my-3">
        <InputSearch v-model="searchText" />
      </div>
      <SongList
        v-if="filteredSongs.length > 0"
        :songs="filteredSongs"
        v-model:selected-index="selectedIndex"
      />
      <p v-else>No songs found.</p>
      <div class="mt-4 d-flex justify-content-between">
        <Pagination
          :total-pages="totalPages"
          :current-page="currentPage"
          @update:current-page="changeCurrentPage"
        />
        <div>
          <button class="btn btn-lg btn-dark me-2" @click="refetch">
            <i class="fas fa-redo"></i>
          </button>
          <button class="btn btn-lg btn-success me-2" @click="goToAddSong">
            <i class="fas fa-plus"></i>
          </button>
          <button class="btn btn-lg btn-danger" @click="onDeleteSongs">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-6 mt-5">
      <div v-if="selectedSong">
        <h4 class="d-flex align-items-center text-white">
          Song Details <i class="fas fa-info-circle ms-2"></i>
        </h4>
        <SongCard :song="selectedSong" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  text-align: center;
  max-width: 1950px;
}

.btn {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.btn-dark {
  background-color: #343a40;
  color: #f8f9fa;
  border: 1px solid #343a40;
}

.btn-dark:hover {
  background-color: #28a745;
  color: white;
  transform: scale(1.05);
}

.btn-success {
  background-color: #28a745;
  color: white;
  border: 1px solid #28a745;
}

.btn-success:hover {
  background-color: #218838;
  transform: scale(1.05);
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: 1px solid #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  transform: scale(1.05);
}

.pagination {
  margin-top: 20px;
}

.pagination .page-link {
  background-color: #343a40;
  color: white;
  border: 1px solid #28a745;
  font-size: 1rem;
  padding: 10px 15px;
  border-radius: 5px;
}

.pagination .page-link:hover {
  background-color: #28a745;
  color: white;
}

.pagination .page-item.active .page-link {
  background-color: #28a745;
  color: white;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
}

.pagination .page-item {
  margin: 0 5px;
}
</style>
