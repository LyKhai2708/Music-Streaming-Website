<template>
  <div class="admin-page container d-flex justify-content-center align-items-center vh-100 py-5">
    <div class="text-center">
      <h2 class="display-4 text-white mb-4">Admin Page</h2>
      <p class="lead text-gray">Quản lý hệ thống và người dùng.</p>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 800px;
  margin: auto;
}

h2 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff;
}

.lead {
  font-size: 1.2rem;
  color: #b3b3b3; 
}

button {
  transition: all 0.3s ease;
  margin-top: 2rem;
}

button:hover {
  background-color: #218838; 
  transform: scale(1.1); 
}
</style>
