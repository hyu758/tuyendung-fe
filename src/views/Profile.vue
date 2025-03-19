<template>
  <div class="profile container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Hồ sơ cá nhân</h1>
    <div class="bg-white rounded shadow p-6">
      <p class="text-lg mb-4">Thông tin cá nhân của bạn</p>
      <p>Trang này đang được phát triển.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const user = ref(null)

onMounted(() => {
  // Lấy thông tin người dùng hiện tại
  if (authStore.user) {
    user.value = authStore.user
  } else {
    authStore.fetchCurrentUser()
  }
})
</script> 