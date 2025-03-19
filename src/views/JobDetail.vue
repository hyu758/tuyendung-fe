<template>
  <div class="job-detail container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Chi tiết công việc</h1>
    <div class="bg-white rounded shadow p-6">
      <p class="text-lg mb-4">Thông tin chi tiết về công việc</p>
      <p>Trang này đang được phát triển.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const jobId = ref(route.params.id)

onMounted(() => {
  console.log('Job ID:', jobId.value)
  // Gọi API để lấy thông tin chi tiết công việc
})
</script> 