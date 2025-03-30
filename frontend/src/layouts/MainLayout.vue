<script setup>
  import AppHeader from '@/components/AppHeader.vue';
  import AppFooter from '@/components/AppFooter.vue';
</script>
<template>
    <AppHeader />
      <main class="mt-3">
          <router-view />
      </main>
    <AppFooter/>
</template>