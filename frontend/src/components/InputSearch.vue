<script setup>
const model = defineModel({
  type: String,
  default: '',
});
</script>

<template>
  <div class="d-flex justify-content-center align-items-center my-3">
    <div class="input-group" style="width: 100%; max-width: 800px;"> <!-- Increased max-width -->
      
      <span class="input-group-text icon-start">
        <i class="fas fa-search"></i>
      </span>

      <input
        type="text"
        class="form-control"
        placeholder="Nhập thông tin user"
        v-model="model"
        aria-label="Search for user"
        aria-describedby="basic-addon1"
      />

      <button
        v-if="model.length > 0"
        class="btn btn-clear"
        type="button"
        @click="model = ''"
        aria-label="Clear search"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.input-group {
  width: 100%;
  max-width: 800px; 
  background-color: #2a2a2a;
  border-radius: 0.375rem;
}

.form-control {
  background-color: transparent;
  color: white;
  border: none;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-control:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
  border-color: white;
}

.input-group-text.icon-start {
  background-color: #2a2a2a;
  color: white;
  border: none;
}

.btn-clear {
  color: white;
  background: transparent;
  border: none;
}

.btn-clear:hover {
  color: #ffffff;
}

button:disabled {
  opacity: 0.6;
}

button {
  border-radius: 0;
}


.input-group:hover .form-control {
  border: 1px solid white;
  transition: border 10s ease; 
}
</style>
