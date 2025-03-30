<script setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import MainLayout from '@/layouts/MainLayout.vue';
  import AuthLayout from '@/layouts/AuthLayout.vue';

  const route = useRoute();

  const layout = computed(() => {
    return route.meta.layout === 'AuthLayout' ? AuthLayout : MainLayout;
  });
  
</script>
<template>
  <div class="container" >
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>
<style>
  .container{
    background-color: #121212;

  }
  .page {
    max-width: 400px;
    margin: auto;

  }

</style>