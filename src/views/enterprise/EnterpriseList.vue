<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Danh sách công ty</h1>
        <p class="text-sm md:text-base text-gray-600">Khám phá và tìm hiểu về các công ty đang hoạt động trên hệ thống</p>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8 hover:shadow-md transition-shadow">
        <!-- Mobile view: Toggle filters -->
        <div class="lg:hidden mb-4">
          <button 
            @click="isFilterVisible = !isFilterVisible" 
            class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span class="flex items-center font-medium text-gray-800">
              <i class="fas fa-filter text-blue-500 mr-2"></i>
              Bộ lọc tìm kiếm
            </span>
            <i class="fas" :class="isFilterVisible ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </button>
        </div>

        <div :class="{'hidden': !isFilterVisible && isMobileView}" class="lg:block">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <!-- Search input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Từ khóa tìm kiếm</label>
              <div class="relative">
                <input
                  v-model="searchParams.q"
                  type="text"
                  class="block w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Tên công ty..."
                >
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-search text-gray-400"></i>
                </div>
              </div>
            </div>

            <!-- City filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Thành phố</label>
              <div class="relative">
                <select
                  v-model="searchParams.city"
                  class="block w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Tất cả thành phố</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
                <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <i class="fas fa-map-marker-alt text-gray-400"></i>
                </div>
                <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <i class="fas fa-chevron-down text-gray-400 text-xs"></i>
                </div>
              </div>
            </div>

            <!-- Field filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Lĩnh vực hoạt động</label>
              <div class="relative">
                <select
                  v-model="searchParams.field"
                  class="block w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Tất cả lĩnh vực</option>
                  <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                  <option value="Tài chính - Ngân hàng">Tài chính - Ngân hàng</option>
                  <option value="Giáo dục">Giáo dục</option>
                  <option value="Y tế">Y tế</option>
                </select>
                <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <i class="fas fa-industry text-gray-400"></i>
                </div>
                <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <i class="fas fa-chevron-down text-gray-400 text-xs"></i>
                </div>
              </div>
            </div>

            <!-- Scale filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Quy mô</label>
              <div class="relative">
                <select
                  v-model="searchParams.scale"
                  class="block w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Tất cả quy mô</option>
                  <option value="1-50">1-50 nhân viên</option>
                  <option value="51-150">51-150 nhân viên</option>
                  <option value="151-300">151-300 nhân viên</option>
                  <option value="301-500">301-500 nhân viên</option>
                  <option value="501-1000">501-1000 nhân viên</option>
                  <option value="1000+">Trên 1000 nhân viên</option>
                </select>
                <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <i class="fas fa-users text-gray-400"></i>
                </div>
                <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <i class="fas fa-chevron-down text-gray-400 text-xs"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Search buttons -->
          <div class="mt-6 flex flex-col-reverse sm:flex-row gap-3 justify-end">
            <button
              @click="resetFilters"
              class="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center justify-center"
            >
              <i class="fas fa-redo-alt mr-2"></i>
              Đặt lại
            </button>
            <button
              @click="handleSearch"
              class="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center justify-center"
            >
              <i class="fas fa-search mr-2"></i>
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <!-- Results count and sorting -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div class="text-gray-600 mb-3 sm:mb-0">
          <span v-if="loading">Đang tải...</span>
          <span v-else-if="enterprises.length === 0">Không tìm thấy kết quả</span>
          <span v-else class="font-medium">{{ pagination.totalItems }} công ty</span>
        </div>
        
        <div class="flex items-center">
          <label for="sort" class="mr-2 text-sm text-gray-600">Sắp xếp:</label>
          <div class="relative">
            <select
              id="sort"
              v-model="searchParams.sortBy"
              class="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer bg-white transition-all"
              @change="handleSearch"
            >
              <option value="created_at">Mới nhất</option>
              <option value="name">Tên công ty</option>
              <option value="size">Quy mô</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <i class="fas fa-chevron-down text-xs"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 9" :key="`skeleton-${i}`" class="bg-white rounded-xl shadow-sm p-6 transition-all">
          <div class="flex items-center mb-4">
            <div class="h-16 w-16 rounded-lg bg-gray-200 animate-pulse"></div>
            <div class="ml-4 flex-1">
              <div class="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
            </div>
          </div>
          
          <div class="space-y-2 mb-6">
            <div class="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <div class="flex items-center">
              <div class="w-6 h-6 rounded-full bg-gray-200 mr-2 animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
            </div>
            <div class="flex items-center">
              <div class="w-6 h-6 rounded-full bg-gray-200 mr-2 animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="enterprises.length === 0" class="bg-white rounded-xl shadow-sm p-10 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
          <i class="fas fa-building text-3xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Không tìm thấy công ty nào</h3>
        <p class="mt-1 text-sm text-gray-500 max-w-md mx-auto">Không có kết quả phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với các bộ lọc khác.</p>
        <button
          @click="resetFilters"
          class="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all inline-flex items-center"
        >
          <i class="fas fa-redo-alt mr-2"></i>
          Đặt lại bộ lọc
        </button>
      </div>

      <!-- Enterprises grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="enterprise in enterprises" 
          :key="enterprise.id"
          :to="{ name: 'EnterpriseDetail', params: { id: enterprise.id }}"
          class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100 flex flex-col h-full"
        >
          <div class="p-6 flex flex-col flex-grow">
            <div class="flex items-center mb-4">
              <div class="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <img v-if="enterprise.logo_url" :src="enterprise.logo_url" :alt="enterprise.company_name"
                  class="h-full w-full object-contain">
                <div v-else class="h-full w-full flex items-center justify-center text-gray-400">
                  <i class="fas fa-building text-2xl"></i>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600">
                  {{ enterprise.company_name }}
                </h3>
                <div class="flex items-center mt-1">
                  <i class="fas fa-map-marker-alt text-red-500 mr-1 text-sm"></i>
                  <p class="text-sm text-gray-600">{{ enterprise.city || 'Chưa cập nhật' }}</p>
                </div>
              </div>
            </div>
            
            <div class="mb-4 flex-grow">
              <p class="text-sm text-gray-600 line-clamp-3">
                {{ enterprise.description || 'Chưa có mô tả về công ty' }}
              </p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-users text-blue-500"></i>
                </div>
                <span class="ml-2 text-sm text-gray-600 truncate">{{ enterprise.scale || 'Chưa cập nhật' }}</span>
              </div>

              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-industry text-purple-500"></i>
                </div>
                <span class="ml-2 text-sm text-gray-600 truncate">{{ enterprise.field_of_activity || 'Chưa cập nhật' }}</span>
              </div>
            </div>
          </div>
          
          <div class="px-6 py-3 bg-gray-50 flex justify-between items-center">
            <span class="text-sm text-blue-600 font-medium">Xem thông tin</span>
            <i class="fas fa-arrow-right text-blue-600"></i>
          </div>
        </router-link>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="mt-10 flex justify-center">
        <nav class="flex items-center space-x-2" aria-label="Pagination">
          <button
            @click="changePage(pagination.currentPage - 1)"
            :disabled="pagination.currentPage === 1"
            class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Previous</span>
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <div class="flex items-center space-x-2">
            <button
              v-for="page in displayedPages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'flex items-center justify-center w-10 h-10 rounded-lg transition-colors',
                page === pagination.currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="changePage(pagination.currentPage + 1)"
            :disabled="pagination.currentPage === pagination.totalPages"
            class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
import { ref, reactive, onMounted, watch, computed, onUnmounted } from 'vue'
import { useEnterpriseStore } from '../../stores/enterprise'
import { debounce } from 'lodash'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '../../composables/useToast'

const enterpriseStore = useEnterpriseStore()
const loading = ref(true)
const enterprises = ref([])
const isFilterVisible = ref(true)
const isMobileView = ref(false)

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
  pageSize: 10,
  sortBy: 'created_at' // Thêm trường sắp xếp
})

// Hiển thị các trang phân trang
const displayedPages = computed(() => {
  const totalPages = pagination.value.totalPages
  const currentPage = pagination.value.currentPage
  
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  
  let startPage = Math.max(currentPage - 2, 1)
  let endPage = Math.min(startPage + 4, totalPages)
  
  if (endPage === totalPages) {
    startPage = Math.max(endPage - 4, 1)
  }
  
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
})

// Lấy thông tin các công ty
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

// Xử lý tìm kiếm
const handleSearch = debounce(() => {
  searchParams.page = 1 // Reset về trang 1 khi tìm kiếm
  loadEnterprises()
}, 300)

// Đặt lại tất cả bộ lọc
const resetFilters = () => {
  searchParams.q = ''
  searchParams.city = ''
  searchParams.field = ''
  searchParams.scale = ''
  searchParams.page = 1
  searchParams.sortBy = 'created_at'
  loadEnterprises()
}

// Chuyển trang
const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    searchParams.page = page
    loadEnterprises()
    
    // Cuộn lên đầu danh sách
    window.scrollTo({
      top: document.querySelector('.grid').offsetTop - 100,
      behavior: 'smooth'
    })
  }
}

// Kiểm tra kích thước màn hình và cập nhật isMobileView
const checkScreenSize = () => {
  isMobileView.value = window.innerWidth < 1024
}

onMounted(() => {
  // Kiểm tra kích thước màn hình khi component mounted
  checkScreenSize()
  
  // Thêm event listener cho resize
  window.addEventListener('resize', checkScreenSize)
  loadEnterprises()
})

onUnmounted(() => {
  // Loại bỏ event listener khi component unmounted
  window.removeEventListener('resize', checkScreenSize)
})

// Watch cho các tham số tìm kiếm
watch([
  () => searchParams.city,
  () => searchParams.field,
  () => searchParams.scale
], handleSearch)
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

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 