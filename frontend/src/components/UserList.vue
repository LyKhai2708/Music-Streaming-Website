<script setup>
defineProps({
  users: { type: Array, default: () => [] },
  selectedIndex: { type: Number, default: -1 },
});
const $emit = defineEmits(['update:selectedIndex']);
</script>

<template>
  <div class="container my-5">
    <!-- Row for the cards -->
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 g-4">
      <!-- Loop through users and display their info in cards -->
      <div
        class="col"
        v-for="(user, index) in users"
        :key="user.id"
        @click="$emit('update:selectedIndex', index)"
        role="button"
        tabindex="0"
      >
        <div class="card h-100 shadow-lg rounded-4 overflow-hidden border-0 bg-dark text-white">
          <!-- Image -->
          <img
            :src="user.avatar"
            class="card-img-top img-fluid square-img"
            :alt="user.username"
          />
          <div class="card-body text-center">
            <h5 class="card-title mb-2 text-truncate">{{ user.username }}</h5>
            <p class="card-text mb-0 text-truncate" :title="user.description">
              {{ user.description }}
            </p>
          </div>
          <div class="card-footer text-center bg-success text-white">
            <small class="text-muted">Xem chi tiết</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Style improvements */
.card {
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease, background-color 0.3s ease;
}

.card:hover {
  transform: translateY(-8px); 
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3); 
  background-color: #343a40; 
}

.card-body {
  padding: 1.25rem; 
}

.card-title {
  font-size: 1.3rem; 
  color: #28a745; 
}

.card-text {
  font-size: 1rem; 
  color: #adb5bd; 
}

.card-footer {
  padding: 0.75rem;
  background-color: #28a745; 
  border-top: 1px solid #ddd;
}

.card-img-top {
  border-bottom: 1px solid #ddd; 
}

.card-text.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; 
}


.square-img {
  width: 100%;
  height: 200px; 
  object-fit: cover;
}


.card-footer:hover {
  background-color: #218838; 
}
</style>
