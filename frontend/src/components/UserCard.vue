<script setup>
  defineProps({
    user: { type: Object, required: true },
  });
</script>

<template>
  <div class="card sticky-card shadow rounded-3 border-0 mx-auto" style="width: 600px;">
    <!-- Avatar as a circular floating image -->
    <div class="position-relative mb-4">
      <img class="avatar img-fluid rounded-circle border border-4 border-light" :src="user.avatar" alt="User avatar" style="width: 120px; height: 120px; object-fit: cover; position: absolute; top: -100px; left: 50%; transform: translateX(-50%);" />
    </div>

    <!-- Card body with Bootstrap styling -->
    <div class="card-body text-center bg-dark-transparent text-white">
      <h4 class="card-title mb-3">{{ user.username }}</h4>
      <div class="card-text mb-2"><strong>Full Name:</strong> {{ user.full_name }}</div>
      <div class="card-text mb-2"><strong>Email:</strong> {{ user.email }}</div>
    </div>

    <!-- Card image -->

    <img class="card-img-bottom img-fluid" :src="user.avatar" alt="User avatar" 
         style="object-fit: scale-down; width: 100%; height: 420px;" />
     <router-link :to="{ name: 'User.edit', params: { id: user.user_id } }">
      <div class="card-footer text-center bg-dark-transparent text-highlight">
        <small>Profile Details</small>
      </div>
     </router-link>
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

.bg-dark-transparent {
  background-color: rgba(52, 58, 64, 0.7) !important;
}

.text-highlight {
  color: #28a745;
  font-weight: bold;
}

/* Responsive design */
@media (max-width: 767px) {
  .sticky-card {
    width: 100%;
  }
}
</style>
  