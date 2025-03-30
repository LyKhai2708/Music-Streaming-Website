<script setup>
    defineProps({
        artist: { type: Object, required: true },
    });
</script>

<template>
  <div class="sticky-card shadow rounded-3 border-0 mx-auto" style="width: 600px;">
    <div class="avatar-container mx-auto">
      <img class="avatar img-fluid" :src="artist.avatar" alt="User avatar" />
    </div>

    <div class="card-body text-center bg-dark-transparent text-white">
      <h4 class="card-title mb-3">{{ artist.artist_name }}</h4>
      <div class="card-text mb-2"><strong>Country:</strong> {{ artist.country }}</div>
      <div class="card-text mb-2"><strong>Bio:</strong> {{ artist.bio }}</div>
    </div>
    <div class="card-footer text-center bg-dark-transparent text-highlight">
      <small>Profile Details</small>
    </div>
  </div>
</template>

<style scoped>

.sticky-card {
  position: -webkit-sticky;
  position: sticky;
  top: 20px;
  z-index: 1000; 
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
  background-color: rgba(52, 58, 64, 0.85);
  backdrop-filter: blur(10px); 
  border-radius: 15px;
  padding-top: 60px; 
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}


.sticky-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}


.avatar-container {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  background-color: white;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.card-body {
  padding: 1.5rem;
  color: #dcdcdc;
}

.card-title {
  font-size: 1.6rem;
  color: #28a745;
}

.card-footer {
  padding: 1rem;
  background-color: transparent;
}


.text-highlight {
  color: #28a745;
  font-weight: bold;
}


.bg-dark-transparent {
  background-color: rgba(52, 58, 64, 0.7) !important;
}


@media (max-width: 767px) {
  .sticky-card {
    width: 100%;
  }
}
</style>
