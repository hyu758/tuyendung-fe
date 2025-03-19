<template>
  <div class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="text-center max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-6xl text-blue-600 mb-4">
        <font-awesome-icon icon="exclamation-circle" />
      </div>
      <h1 class="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p class="text-xl text-gray-600 mb-8">Không tìm thấy trang</p>
      <p class="text-gray-500 mb-8">Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.</p>
      
      <BaseButton
        variant="primary"
        label="Quay lại trang chủ"
        :icon="['fas', 'arrow-left']"
        @click="$router.push('/')"
      />
    </div>
  </div>
</template>

<script setup>
import BaseButton from '../components/common/BaseButton.vue'
</script> 