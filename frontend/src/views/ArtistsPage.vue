<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import InputSearch from '@/components/InputSearch.vue';
import artistsService from '@/services/artists.service';
import Pagination from '@/components/Pagination.vue';
import ArtistList from '@/components/ArtistList.vue';
import ArtistCard from '@/components/ArtistCard.vue';

const router = useRouter();
const route = useRoute();
const totalPages = ref(1);
const artists = ref([]);
const selectedIndex = ref(-1);
const searchText = ref('');

const currentPage = computed(() => {
  const page = Number(route.query?.page);
  return Number.isNaN(page) || page < 1 ? 1 : page;
});

const searchableArtists = computed(() =>
    artists.value.map((artist) => {
    const { artist_name, country } = artist;
    return [artist_name, country].join('');
  })
);

const filteredArtists  = computed(() => {
  if (!searchText.value) return artists.value;
  return artists.value.filter((artist, index) =>
    searchableArtists.value[index].includes(searchText.value)
  );
});

const selectedArtist = computed(() => {
  if (selectedIndex.value < 0) return null;
  
  return filteredArtists.value[selectedIndex.value];
});

async function retrieveArtists(page) {
  try {
    const chunk = await artistsService.fetchArtists(page, 12);
    totalPages.value = chunk.metadata.lastPage ?? 1;
    artists.value = chunk.artists.sort(
      (current, next) => current.artist_name.localeCompare(next.artist_name)
    );
    selectedIndex.value = -1;
  } catch (error) {
    console.log(error);
  }
}

// Refetch function to reload the current page
function refetch() {
  retrieveArtists(currentPage.value);
}

function goToAddArtist() {
  router.push({ name: 'Artist.add' });
}

function changeCurrentPage(page) {
  router.push({ name: 'ArtistsPage', query: { page } });
}

async function onDeleteUsers() {
  if (confirm('Xóa tất cả Artist trong hệ thống ?')) {
    try {
      await artistsService.deleteAllArtists();
      totalPages.value = 1;
      artists.value = [];
      selectedIndex.value = -1;
      changeCurrentPage(1);
    } catch (error) {
      console.log(error);
    }
  }
}

watch(searchText, () => (selectedIndex.value = -1));
watch(currentPage, () => retrieveArtists(currentPage.value), { immediate: true });
</script>


<template>
  <div class="page row mb-5">
    <div class="col-md-6 mt-5">
      <h4 class="d-flex align-items-center text-white">
        Artist List <i class="fas fa-users ms-2"></i>
      </h4>
      <div class="my-3">
        <InputSearch v-model="searchText" />
      </div>
      <ArtistList
        v-if="filteredArtists.length > 0"
        :artists="filteredArtists"
        v-model:selected-index="selectedIndex"
      />
      <p v-else>No users found.</p>
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
          <button class="btn btn-lg btn-success me-2" @click="goToAddArtist">
            <i class="fas fa-plus"></i>
          </button>
          <button class="btn btn-lg btn-danger" @click="onDeleteUsers">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-6 mt-5">
      <div v-if="selectedArtist">
        <h4 class="d-flex align-items-center text-white">
          Artist Details <i class="fas fa-user ms-2"></i>
        </h4>
        <router-link class="text-decoration-none" v-if="selectedArtist && selectedArtist.artist_id" :to="{ name: 'Artist.edit', params: { id: selectedArtist.artist_id } }">
          <ArtistCard :artist="selectedArtist" />
        </router-link>
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
