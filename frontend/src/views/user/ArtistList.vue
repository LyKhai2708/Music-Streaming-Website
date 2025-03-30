<template>
  <div class="poster-container container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="text-white">Artists</h3>
      <router-link v-if="$route.name !== 'Artist.All'" :to="{ name: 'Artist.All' }" class="text-white text-decoration-none">
        Show all
      </router-link>
    </div>

    <div class="row">
      <div v-for="artist in artists" :key="artist.artist_id" class="col-lg-3 col-md-4 col-sm-6 mb-4 text-center">
        <router-link
          :to="{ name: 'Artist.Profile', params: { artistId: artist.artist_id } }"
          class="text-decoration-none"
        >
          <div class="rounded-circle overflow-hidden mx-auto border border-white shadow-sm" style="width: 150px; height: 150px;">
            <img :src="artist.avatar" :alt="artist.artist_name" class="img-fluid" style="object-fit: cover;" />
          </div>
          <h5 class="mt-3 text-truncate text-light">{{ artist.artist_name }}</h5>
          <p class="text-white-50 mb-0">Nghệ sĩ</p>
        </router-link>
      </div>
    </div>
  </div>
</template>


<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  artists: { type: Array, required: true },
});
</script>

<style scoped>
.poster-container {
  padding: 20px;
  
}

.router-link .rounded-circle:hover img {
  transform: scale(1.5);
  transition: transform 0.3s ease;
}

.text-truncate {
  max-width: 150px;
  margin: 0 auto;
}
</style>
