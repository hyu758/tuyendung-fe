<script setup>
import Header from './components/layouts/Header.vue'
import Footer from './components/layouts/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    
    <main class="flex-grow">
      <router-view />
    </main>
    
    <Footer />
  </div>
</template>

<style>
/* Có thể thêm các style global ở đây nếu cần */
</style>
