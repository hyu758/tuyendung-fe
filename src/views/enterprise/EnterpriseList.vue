<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Danh sách công ty</h1>
        <p class="mt-2 text-sm text-gray-600">Khám phá các công ty đang hoạt động trên hệ thống</p>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Từ khóa tìm kiếm</label>
            <div class="relative">
              <input
                v-model="searchParams.q"
                type="text"
                class="block w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tên công ty..."
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
            </div>
          </div>

          <!-- City filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Thành phố</label>
            <select
              v-model="searchParams.city"
              class="block w-full border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả thành phố</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
            </select>
          </div>

          <!-- Field filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Lĩnh vực hoạt động</label>
            <select
              v-model="searchParams.field"
              class="block w-full border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả lĩnh vực</option>
              <option value="Công nghệ thông tin">Công nghệ thông tin</option>
              <option value="Tài chính - Ngân hàng">Tài chính - Ngân hàng</option>
              <option value="Giáo dục">Giáo dục</option>
              <option value="Y tế">Y tế</option>
            </select>
          </div>

          <!-- Scale filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quy mô</label>
            <select
              v-model="searchParams.scale"
              class="block w-full border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả quy mô</option>
              <option value="1-50">1-50 nhân viên</option>
              <option value="51-150">51-150 nhân viên</option>
              <option value="151-300">151-300 nhân viên</option>
              <option value="301-500">301-500 nhân viên</option>
              <option value="501-1000">501-1000 nhân viên</option>
              <option value="1000+">Trên 1000 nhân viên</option>
            </select>
          </div>
        </div>

        <!-- Search button -->
        <div class="mt-4 flex justify-end">
          <button
            @click="handleSearch"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <i class="fas fa-search mr-2"></i>
            Tìm kiếm
          </button>
        </div>
      </div>

      <!-- Skeleton loading -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 9" :key="`skeleton-${i}`" class="bg-white rounded-lg shadow-md overflow-hidden p-4">
          <div class="p-2">
            <div class="flex items-center mb-4">
              <div class="h-12 w-12 rounded-full bg-gray-300 animate-pulse"></div>
              <div class="ml-4">
                <div class="h-5 bg-gray-300 rounded w-32 animate-pulse"></div>
                <div class="h-4 bg-gray-300 rounded w-20 mt-2 animate-pulse"></div>
              </div>
            </div>
            
            <div class="space-y-2 mb-4">
              <div class="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
              <div class="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
            </div>
            
            <div class="flex items-center mb-4">
              <div class="w-5 h-5 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
              <div class="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
            </div>

            <div class="flex items-center mb-4">
              <div class="w-5 h-5 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
              <div class="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="enterprises.length === 0" class="text-center py-12">
        <i class="fas fa-building text-4xl text-gray-400 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900">Không tìm thấy công ty nào</h3>
        <p class="mt-1 text-sm text-gray-500">Thử thay đổi điều kiện tìm kiếm của bạn</p>
      </div>

      <!-- Enterprises grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="enterprise in enterprises" :key="enterprise.id" 
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-4">
          <router-link :to="{ name: 'EnterpriseDetail', params: { id: enterprise.id }}" class="p-2">
            <div class="flex items-center mb-4">
              <img v-if="enterprise.logo_url" :src="enterprise.logo_url" :alt="enterprise.company_name"
                class="h-12 w-12 rounded-full object-cover">
              <div v-else class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <i class="fas fa-building text-gray-400"></i>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">{{ enterprise.company_name }}</h3>
                <p class="text-sm text-gray-500">{{ enterprise.city }}</p>
              </div>
            </div>
            
            <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ enterprise.description }}</p>
            
            <div class="flex items-center text-sm text-gray-500 mb-4">
              <i class="fas fa-users mr-2"></i>
              <span>{{ enterprise.scale }}</span>
            </div>

            <div class="flex items-center text-sm text-gray-500 mb-4">
              <i class="fas fa-industry mr-2"></i>
              <span>{{ enterprise.field_of_activity }}</span>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="mt-8 flex justify-center">
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            @click="changePage(pagination.currentPage - 1)"
            :disabled="pagination.currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Previous</span>
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <button
            v-for="page in pagination.totalPages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
              page === pagination.currentPage
                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
          
          <button
            @click="changePage(pagination.currentPage + 1)"
            :disabled="pagination.currentPage === pagination.totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Next</span>
            <i class="fas fa-chevron-right"></i>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useEnterpriseStore } from '../../stores/enterprise'
import { debounce } from 'lodash'

const enterpriseStore = useEnterpriseStore()
const loading = ref(true)
const enterprises = ref([])
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  pageSize: 10
})

const searchParams = reactive({
  q: '',
  city: '',
  field: '',
  scale: '',
  page: 1,
  pageSize: 10
})

const loadEnterprises = async () => {
  try {
    loading.value = true
    const result = await enterpriseStore.searchEnterprises(searchParams)
    if (result.success) {
      enterprises.value = result.data.data.results
      pagination.value = {
        currentPage: result.data.data.page,
        totalPages: result.data.data.total_pages,
        totalItems: result.data.data.total,
        pageSize: result.data.data.page_size
      }
    }
  } catch (err) {
    console.error('Error loading enterprises:', err)
  } finally {
    loading.value = false
  }
}

const handleSearch = debounce(() => {
  searchParams.page = 1 // Reset về trang 1 khi tìm kiếm
  loadEnterprises()
}, 300)

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    searchParams.page = page
    loadEnterprises()
  }
}

// Watch for changes in search params
watch([
  () => searchParams.city,
  () => searchParams.field,
  () => searchParams.scale
], handleSearch)

onMounted(() => {
  loadEnterprises()
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 