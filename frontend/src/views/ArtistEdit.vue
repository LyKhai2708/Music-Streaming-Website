<script setup>
    import { ref } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import ArtistForm from '@/components/ArtistForm.vue';
    import artistsService from '@/services/artists.service';
    const props = defineProps({
        id: { type: String, required: true },
    });
    const router = useRouter();
    const route = useRoute();
    const artist = ref(null);
    const message = ref('');

    async function getArtist(id) {
        try {
            artist.value = await artistsService.fetchArtist(id);
        } catch (error) {
            console.log(error);
        }
    }

    async function onUpdateArtist(artist) {
        console.log(artist);
        try {
            await artistsService.updateArtist(artist.get('artist_id'),artist);
            message.value = 'Thông tin nghệ sĩ được cập nhật thành công.';
        } catch (error) {
            console.log(error);
        }
    }
    async function onDeleteArtist(id) {
        console.log(id)
        if (confirm('Bạn muốn xóa nghệ sĩ này?')) {
            try {
                await artistsService.deleteArtist(id);
                router.push({ name: 'ArtistsPage' });
            } catch (error) {
                console.log(error);
            }
        }
    }
    getArtist(props.id);
    
</script>
<template>
    <div class="artist-add container py-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <h2 class="card-title text-center text-white mb-4">Sửa thông tin Artist</h2>
          <ArtistForm :artist="artist" 
          @submit:artist="onUpdateArtist"
          @delete:artist="onDeleteArtist" />
          <p v-if="message" :class="['message', { 'text-success': message.includes('thành công'), 'text-danger': message.includes('lỗi') }]">{{ message }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .artist-add {
    max-width: 600px;
    margin: auto;
  }
  .card-body { background-color: #121212; }
  .message { margin-top: 1rem; font-weight: bold; }
  .text-success { color: #1ed760; }
  .text-danger { color: #dc3545; }
  </style>