<!-- SavedJobs.vue -->
<template>
  <div class="bg-gray-50 py-8 min-h-screen">
    <div class="container mx-auto px-4">
      <!-- Hero section -->
      <div class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Việc làm đã lưu</h1>
        <p class="text-gray-600">Xem lại danh sách những việc làm mà bạn đã lưu trước đó</p>
      </div>

      <!-- Search section -->
      <div class="bg-white rounded-xl shadow-sm p-5 mb-8 transition-all hover:shadow-md">
        <div class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Tìm kiếm trong danh sách việc làm đã lưu..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="postStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="bg-white rounded-xl shadow-sm p-5 animate-pulse">
          <div class="flex flex-col">
            <div class="w-16 h-16 bg-gray-200 rounded-lg mb-4"></div>
            <div class="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="mt-4">
              <div class="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- No saved jobs -->
      <div v-else-if="!filteredJobs.length" class="bg-white rounded-xl shadow-sm p-8 text-center">
        <div class="text-5xl text-blue-500 opacity-80 mb-4">
          <i class="fas fa-bookmark"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Chưa có việc làm nào được lưu</h3>
        <p class="text-gray-600 mb-6">Hãy lưu những việc làm bạn quan tâm để xem lại sau</p>
        <router-link 
          to="/job-search"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          <i class="fas fa-search mr-2"></i>
          Tìm việc ngay
        </router-link>
      </div>

      <!-- Job list -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="job in filteredJobs" :key="job.id" 
          class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all transform hover:-translate-y-1 border border-gray-100"
        >
          <div class="p-5">
            <!-- Company Logo -->
            <div class="mb-4">
              <div v-if="job.post_detail.enterprise_logo" class="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-100 flex items-center justify-center">
                <img :src="job.post_detail.enterprise_logo" :alt="job.post_detail.enterprise_name" class="object-contain w-full h-full">
              </div>
              <div v-else class="w-16 h-16 rounded-lg flex items-center justify-center bg-blue-100 text-blue-700 font-bold text-xl">
                {{ getCompanyInitials(job.post_detail.enterprise_name) }}
              </div>
            </div>

            <!-- Job Info -->
            <div class="mb-4">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600">
                  <router-link :to="{ name: 'JobDetail', params: { id: job.post_detail.id }}">
                    {{ job.post_detail.title }}
                  </router-link>
                </h3>
                <div v-if="job.post_detail.is_enterprise_premium" class="ml-2 flex-shrink-0">
                  <span class="inline-flex items-center px-2 py-1 bg-amber-400 text-white rounded-full text-xs font-semibold">
                    Pro
                  </span>
                </div>
              </div>
              
              <p class="text-gray-600 text-sm mb-2">{{ job.post_detail.enterprise_name }}</p>
              
              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mt-3">
                <div v-if="job.post_detail.city" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                  <i class="fas fa-map-marker-alt text-gray-500 mr-1"></i>
                  {{ `${job.post_detail.city}${job.post_detail.district ? `, ${job.post_detail.district}` : ''}` }}
                </div>
                <div v-if="job.post_detail.salary_min || job.post_detail.salary_max" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                  <i class="fas fa-money-bill-wave text-green-500 mr-1"></i>
                  {{ formatSalary(job.post_detail.salary_min, job.post_detail.salary_max) }}
                </div>
                <div v-if="job.post_detail.type_working" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                  {{ job.post_detail.type_working }}
                </div>
                <div v-if="job.post_detail.experience" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                  <i class="fas fa-briefcase text-purple-500 mr-1"></i>
                  {{ job.post_detail.experience }}
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <router-link 
                :to="{ name: 'JobDetail', params: { id: job.post_detail.id }}"
                class="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <i class="fas fa-eye mr-2"></i>
                Chi tiết
              </router-link>
              <button 
                @click="handleUnsave(job.id, job.post_detail.id)"
                class="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <i class="fas fa-heart mr-2"></i>
                Bỏ lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePostStore } from '@/stores/post'
import { useToast } from 'vue-toastification'

const postStore = usePostStore()
const toast = useToast()
const savedJobs = ref([])
const searchQuery = ref('')

// Format salary
const formatSalary = (min, max) => {
  if (!min && !max) return 'Thỏa thuận'
  
  const formatNumber = (num) => {
    if (!num) return ''
    return (num / 1000000).toLocaleString('vi-VN')
  }

  if (min && max) {
    return `${formatNumber(min)} - ${formatNumber(max)} triệu`
  } else if (min) {
    return `Từ ${formatNumber(min)} triệu`
  } else if (max) {
    return `Đến ${formatNumber(max)} triệu`
  }

  return 'Thỏa thuận'
}

// Lọc việc làm theo từ khóa tìm kiếm
const filteredJobs = computed(() => {
  if (!searchQuery.value) return savedJobs.value
  const query = searchQuery.value.toLowerCase()
  return savedJobs.value.filter(job => 
    job.post_detail.title.toLowerCase().includes(query) ||
    job.post_detail.enterprise_name?.toLowerCase().includes(query) ||
    job.post_detail.city?.toLowerCase().includes(query) ||
    job.post_detail.field_name?.toLowerCase().includes(query)
  )
})

// Lấy chữ cái đầu của tên công ty
const getCompanyInitials = (name) => {
  if (!name) return 'JH'
  return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()
}

// Lấy danh sách việc làm đã lưu
const fetchSavedJobs = async () => {
  const result = await postStore.fetchSavedPosts()
  if (result.success) {
    savedJobs.value = result.data.data.results
  } else {
    toast.error(result.error)
  }
}

// Xử lý bỏ lưu việc làm
const handleUnsave = async (savedId, postId) => {
  try {
    const result = await postStore.deleteSavedPost(savedId)
    if (result.success) {
      savedJobs.value = savedJobs.value.filter(job => job.id !== savedId)
      toast.success('Đã bỏ lưu việc làm thành công')
    } else {
      toast.error(result.error)
    }
  } catch (error) {
    toast.error('Có lỗi xảy ra khi bỏ lưu việc làm')
  }
}

onMounted(() => {
  fetchSavedJobs()
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 