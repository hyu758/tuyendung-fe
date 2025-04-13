<template>
  <div class="bg-gray-50 py-8 min-h-screen">
    <div class="container mx-auto px-4">
      <!-- Hero section tìm kiếm -->
      <div class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Tìm kiếm việc làm</h1>
        <p class="text-gray-600">Khám phá cơ hội nghề nghiệp phù hợp với bạn</p>
      </div>
      
      <!-- Header tìm kiếm -->
      <div class="bg-white rounded-xl shadow-sm p-5 mb-8 transition-all hover:shadow-md">
        <div class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              v-model="searchQuery.q"
              type="text"
              placeholder="Tiêu đề công việc, vị trí, kỹ năng..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              @keyup.enter="searchJobs"
            />
          </div>
          <div>
            <button
              @click="searchJobs"
              class="w-full px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div class="flex items-center justify-center">
                <i class="fas fa-search mr-2"></i>
                Tìm kiếm
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Chỉ hiển thị trên mobile: Thông tin tổng quan và sắp xếp -->
      <div class="lg:hidden sticky top-0 z-10 bg-gray-50 py-2">
        <div class="flex justify-between items-center bg-white rounded-xl shadow-sm p-4 mb-4">
          <div class="text-sm font-medium text-gray-800">
            <template v-if="loading">
              <div class="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
            </template>
            <template v-else>
              <span class="flex items-center">
                <i class="fas fa-clipboard-list text-blue-500 mr-2"></i>
                {{ jobs.length === 0 ? 'Không có kết quả' : `${jobs.length} việc làm` }}
              </span>
            </template>
          </div>
          
          <div class="flex items-center space-x-3">
            <!-- Dropdown sắp xếp -->
            <div class="relative">
              <select
                v-model="sortQuery.sort_by"
                class="pl-2 pr-6 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer bg-white transition-all"
              >
                <option value="created_at">Mới nhất</option>
                <option value="salary_max">Lương cao</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                <i class="fas fa-chevron-down text-xs"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
        <!-- Nút hiển thị bộ lọc trên mobile -->
        <div class="lg:hidden w-full">
          <button 
            @click="toggleFilterVisible" 
            class="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <span class="flex items-center font-medium text-gray-800">
              <i class="fas fa-filter text-blue-500 mr-2"></i>
              Bộ lọc tìm kiếm
            </span>
            <i class="fas" :class="isFilterVisible ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </button>
          
          <!-- Hiển thị bộ lọc khi người dùng click vào nút -->
          <div v-if="isFilterVisible" class="mt-4">
            <JobFilter @filter="applyFilters" @close="isFilterVisible = false" />
          </div>
        </div>
        
        <!-- Bộ lọc - Sticky trên desktop (luôn hiển thị) -->
        <div class="hidden lg:block lg:w-1/4 lg:sticky lg:top-4 lg:self-start">
          <JobFilter @filter="applyFilters" />
        </div>
        
        <!-- Danh sách công việc -->
        <div class="lg:w-3/4">
          <!-- Kết quả tìm kiếm và sắp xếp - Chỉ hiển thị trên desktop -->
          <div class="hidden lg:block bg-white rounded-xl shadow-sm p-5 mb-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
              <h2 class="text-lg font-semibold text-gray-800">
                <template v-if="loading">
                  <div class="h-7 bg-gray-200 rounded w-48 animate-pulse"></div>
                </template>
                <template v-else>
                  <span class="flex items-center">
                    <i class="fas fa-clipboard-list text-blue-500 mr-2"></i>
                    {{ jobs.length === 0 ? 'Không có kết quả' : `Tìm thấy ${jobs.length} việc làm` }}
                  </span>
                </template>
              </h2>
              <div class="flex items-center space-x-2">
                <label for="sort" class="text-sm text-gray-600">Sắp xếp:</label>
                <div class="relative">
                  <select
                    id="sort"
                    v-model="sortQuery.sort_by"
                    class="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer bg-white transition-all"
                  >
                    <option value="created_at">Mới nhất</option>
                    <option value="salary_max">Lương cao đến thấp</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <i class="fas fa-chevron-down text-xs"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Skeleton loading -->
          <div v-if="loading" class="space-y-6">
            <div v-for="i in 3" :key="`skeleton-${i}`" class="bg-white rounded-xl shadow-sm p-5 animate-pulse">
              <div class="flex flex-col md:flex-row md:items-center">
                <div class="md:w-16 md:h-16 w-12 h-12 bg-gray-200 rounded-lg mb-4 md:mb-0 md:mr-4"></div>
                <div class="flex-grow">
                  <div class="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div class="mt-4 md:mt-0 md:ml-4">
                  <div class="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Hiển thị khi không có kết quả -->
          <div v-else-if="jobs.length === 0" class="bg-white rounded-xl shadow-sm p-8 text-center">
            <div class="text-5xl text-blue-500 opacity-80 mb-4">
              <i class="fas fa-search"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy việc làm phù hợp</h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">Vui lòng thử lại với từ khóa khác hoặc bỏ bớt bộ lọc</p>
            <button 
              @click="resetFilters" 
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center mx-auto"
            >
              <i class="fas fa-redo-alt mr-2"></i>
              Xóa bộ lọc
            </button>
          </div>
          
          <!-- Danh sách công việc -->
          <div v-else>
            <div class="space-y-4">
              <div 
                v-for="job in jobs" 
                :key="job.id"
                class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all transform hover:-translate-y-1 border border-gray-100"
              >
                <router-link :to="`/job/${job.id}`" class="block">
                  <div class="p-5">
                    <div class="flex flex-col md:flex-row md:items-center">
                      <!-- Logo công ty -->
                      <div class="mr-5 mb-4 md:mb-0">
                        <div v-if="job.enterprise_logo" class="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-100 flex items-center justify-center">
                          <img :src="job.enterprise_logo" :alt="job.enterprise_name" class="object-contain w-full h-full">
                        </div>
                        <div v-else class="w-16 h-16 rounded-lg flex items-center justify-center bg-blue-100 text-blue-700 font-bold text-xl">
                          {{ getEnterpriseLogo(job.enterprise_name) }}
                        </div>
                      </div>
                      
                      <!-- Thông tin chính -->
                      <div class="flex-grow">
                        <h3 class="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 hover:text-blue-600 transition-colors">
                          {{ job.title }}
                        </h3>
                        <p class="text-gray-600 text-sm mb-1">{{ job.enterprise_name || 'Công ty ẩn danh' }}</p>
                        
                        <!-- Tags -->
                        <div class="flex flex-wrap gap-2 mt-3">
                          <div v-if="job.location" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                            <i class="fas fa-map-marker-alt text-gray-500 mr-1"></i>
                            {{ job.location }}
                          </div>
                          <div v-if="job.experience" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                            <i class="fas fa-briefcase text-gray-500 mr-1"></i>
                            {{ job.experience }}
                          </div>
                          <div v-if="job.type_working" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                            {{ job.type_working }}
                          </div>
                        </div>
                      </div>
                      
                      <!-- Mức lương -->
                      <div class="mt-4 md:mt-0 md:ml-4">
                        <div v-if="job.salary_min || job.salary_max" class="text-green-600 font-medium">
                          {{ formatSalary(job.salary_min, job.salary_max) }}
                        </div>
                        <div v-else class="text-green-600 font-medium">
                          Thỏa thuận
                        </div>
                        <div class="text-gray-500 text-xs mt-1">
                          {{ formatDate(job.publishDate) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Footer -->
                  <div class="px-5 py-3 bg-gray-50 flex justify-between items-center">
                    <div class="text-sm text-gray-500 line-clamp-1 mr-4">
                    </div>
                    <div class="flex-shrink-0">
                      <button 
                        @click.stop="handleSaveJob(job.id)" 
                        class="text-blue-600 hover:text-blue-800 transition-colors focus:outline-none"
                        :class="{'text-yellow-500 hover:text-yellow-600': job.isSaved}"
                      >
                        <i class="fas" :class="job.isSaved ? 'fa-bookmark' : 'fa-bookmark'"></i>
                      </button>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
            
            <!-- Phân trang -->
            <div v-if="totalPages > 1" class="flex justify-center mt-10">
              <nav class="flex items-center">
                <button 
                  class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors mr-2"
                  :disabled="currentPage === 1"
                  :class="{'opacity-50 cursor-not-allowed': currentPage === 1}"
                  @click="changePage(currentPage - 1)"
                >
                  <i class="fas fa-chevron-left text-gray-500"></i>
                </button>
                
                <div class="flex items-center space-x-2">
                  <button
                    v-for="page in displayedPages"
                    :key="page"
                    @click="changePage(page)"
                    class="flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
                    :class="currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50 text-gray-700'"
                  >
                    {{ page }}
                  </button>
                </div>
                
                <button 
                  class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors ml-2"
                  :disabled="currentPage === totalPages"
                  :class="{'opacity-50 cursor-not-allowed': currentPage === totalPages}"
                  @click="changePage(currentPage + 1)"
                >
                  <i class="fas fa-chevron-right text-gray-500"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import JobCard from '../components/common/JobCard.vue'
import JobFilter from '../components/common/JobFilter.vue'
import { useAddressStore } from '../stores/address'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

// State
const loading = ref(false)
const jobs = ref([])
const currentPage = ref(1)
const itemsPerPage = 6
const sortQuery = reactive({
  sort_by: route.query.sort_by || 'created_at',
  sort_order: 'desc'
})

const locations = ref([])
const isFilterVisible = ref(false)

// Truy vấn tìm kiếm
const searchQuery = reactive({
  q: route.query.q || '',
  city: route.query.city || '',
  position: route.query.position || '',
  experience: route.query.experience || '',
  type_working: route.query.type_working || '',
  salary_min: route.query.salary_min || '',
  salary_max: route.query.salary_max || '',
  page: route.query.page || 1,
  page_size: route.query.page_size || 10,
  sort_by: route.query.sort_by || 'created_at',
  sort_order: 'desc'
})

// Tính tổng số trang
const totalPages = computed(() => {
  return Math.ceil(jobs.value.length / itemsPerPage)
})

// Hiển thị số trang tối đa 5 trang
const displayedPages = computed(() => {
  if (totalPages.value <= 5) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1)
  }
  
  let start = Math.max(currentPage.value - 2, 1)
  let end = Math.min(start + 4, totalPages.value)
  
  if (end === totalPages.value) {
    start = Math.max(end - 4, 1)
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// Lấy viết tắt tên công ty khi không có logo
const getEnterpriseLogo = (name) => {
  if (!name) return 'JH';
  return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
}

// Format mức lương
const formatSalary = (min, max) => {
  if (!min && !max) return 'Thỏa thuận';
  
  const formatNumber = (num) => {
    if (!num) return '';
    return (num / 1000000).toLocaleString('vi-VN');
  }
  
  if (min && max) {
    return `${formatNumber(min)} - ${formatNumber(max)} triệu`;
  } else if (min) {
    return `Từ ${formatNumber(min)} triệu`;
  } else if (max) {
    return `Đến ${formatNumber(max)} triệu`;
  }
  
  return 'Thỏa thuận';
}

// Format ngày đăng
const formatDate = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const publishDate = new Date(date);
  const diffTime = Math.abs(now - publishDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Hôm nay';
  } else if (diffDays === 1) {
    return 'Hôm qua';
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} tuần trước`;
  } else {
    return publishDate.toLocaleDateString('vi-VN');
  }
}

onMounted(async () => {
  loadJobsFromQuery()
})

// Watch route changes
watch(() => route.query, (newQuery) => {
  searchQuery.q = newQuery.q || ''
  searchQuery.city = newQuery.city || ''
  searchQuery.position = newQuery.position || ''
  searchQuery.experience = newQuery.experience || ''
  searchQuery.type_working = newQuery.type_working || ''
  searchQuery.salary_min = newQuery.salary_min || ''
  searchQuery.salary_max = newQuery.salary_max || ''
  searchQuery.page = newQuery.page || 1
  searchQuery.page_size = newQuery.page_size || 10
  searchQuery.sort_by = newQuery.sort_by || 'created-at'
  searchQuery.sort_order = newQuery.sort_order || 'desc'
  loadJobsFromQuery()
}, { deep: true })

// Watch chỉ cần theo dõi sort_by
watch(() => sortQuery.sort_by, () => {
  searchQuery.sort_by = sortQuery.sort_by
  searchQuery.page = 1 
  router.push({
    path: '/job-search',
    query: { ...searchQuery }
  })
})

// Methods
const loadJobsFromQuery = async () => {
  loading.value = true
  
  try {
    const response = await axios.get('/api/posts/search/', { params: searchQuery })
    const data = response.data.data
    
    // Cập nhật danh sách công việc
    jobs.value = data.results.map(job => {

      return {
        id: job.id,
        title: job.title,
        location: `${job.city}${job.district ? `, ${job.district}` : ''}`,
        type_working: job.type_working,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        publishDate: new Date(job.created_at),
        experience: job.experience,
        description: job.description,
        required: job.required,
        interest: job.interest,
        isFeatured: false,
        isSaved: false,
        enterprise_name: job.enterprise_name || '',
        enterprise_logo: job.enterprise_logo || '',
      }
    })

    // Cập nhật tổng số trang
    totalPages.value = Math.ceil(data.total / searchQuery.page_size)
    currentPage.value = searchQuery.page
    
  } catch (error) {
    console.error('Không thể lấy danh sách việc làm:', error)
  } finally {
    loading.value = false
  }
}

const searchJobs = () => {
  router.push({
    path: '/job-search',
    query: {
      q: searchQuery.q,
      city: searchQuery.city,
      position: searchQuery.position,
      experience: searchQuery.experience,
      type_working: searchQuery.type_working,
      salary_min: searchQuery.salary_min,
      salary_max: searchQuery.salary_max,
      page: 1,
      page_size: searchQuery.page_size,
      sort_by: searchQuery.sort_by,
      sort_order: searchQuery.sort_order
    }
  })
}

const applyFilters = (filters) => {
  // Cập nhật query với các bộ lọc mới
  searchQuery.q = filters.q || searchQuery.q
  searchQuery.city = filters.city || searchQuery.city
  searchQuery.position = filters.position || searchQuery.position
  searchQuery.experience = filters.experience || searchQuery.experience
  searchQuery.type_working = filters.type_working || searchQuery.type_working
  searchQuery.salary_min = filters.salary_min || searchQuery.salary_min
  searchQuery.salary_max = filters.salary_max || searchQuery.salary_max
  searchQuery.negotiable = filters.is_salary_negotiable || searchQuery.negotiable
  searchQuery.page = 1 // Reset về trang 1 khi áp dụng bộ lọc mới
  
  // Gọi API tìm kiếm với bộ lọc mới
  loadJobsFromQuery()
}

const resetFilters = () => {
  searchQuery.q = ''
  searchQuery.city = ''
  searchQuery.position = ''
  searchQuery.experience = ''
  searchQuery.type_working = ''
  searchQuery.salary_min = ''
  searchQuery.salary_max = ''
  searchQuery.page = 1
  searchQuery.sort_by = 'created_at'
  
  sortQuery.sort_by = ''
  
  router.push({ path: '/job-search' })
}

const changePage = (page) => {
  searchQuery.page = page
  router.push({
    path: '/job-search',
    query: { ...searchQuery }
  })
}

const handleSaveJob = (jobId) => {
  // Trong thực tế, sẽ gọi API để lưu/bỏ lưu công việc
  const jobIndex = jobs.value.findIndex(job => job.id === jobId)
  if (jobIndex !== -1) {
    jobs.value[jobIndex].isSaved = !jobs.value[jobIndex].isSaved
  }
}

const toggleFilterVisible = () => {
  isFilterVisible.value = !isFilterVisible.value
}
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

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 