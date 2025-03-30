<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import artistsService from "@/services/artists.service";

import 'bootstrap-icons/font/bootstrap-icons.css';
import ArtistList from "@/views/user/ArtistList.vue"; 

const artists = ref([]); //to hold the artists' data



async function loadAllArtists() {
  try {
    const data = await artistsService.fetchArtists(1, 202); 
    artists.value = data.artists;
  } catch (error) {
    console.error("Error fetching artists:", error.message);
  }
}



onMounted(() => {
  loadAllArtists();
}); 

</script>

<template>
  <div class="artist-page">
    <ArtistList :artists="artists"/>
  </div>
</template>

