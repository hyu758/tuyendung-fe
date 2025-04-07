<template>
  <div class="bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Header tìm kiếm -->
      <div class="bg-white rounded-lg shadow-md p-5 mb-6">
        <div class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <div class="flex-1">
            <input
              v-model="searchQuery.q"
              type="text"
              placeholder="Tiêu đề công việc, vị trí, kỹ năng..."
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="searchJobs"
            />
          </div>
          <div>
            <button
              @click="searchJobs"
              class="w-full px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
        <!-- Bộ lọc -->
        <div class="lg:w-1/4">
          <JobFilter @filter="applyFilters" />
        </div>
        
        <!-- Danh sách công việc -->
        <div class="lg:w-3/4">
          <!-- Kết quả tìm kiếm -->
          <div class="bg-white rounded-lg shadow-md p-5 mb-6">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-800">
                {{ jobs.length === 0 ? 'Không có kết quả' : `Tìm thấy ${jobs.length} việc làm` }}
              </h2>
              <div class="flex items-center space-x-2">
                <label for="sort" class="text-sm text-gray-600">Sắp xếp:</label>
                <select
                  id="sort"
                  v-model="sortQuery.sort_by"
                  class="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevant">Phù hợp nhất</option>
                  <option value="created_at">Mới nhất</option>
                  <option value="salary_max">Lương cao đến thấp</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Hiển thị trạng thái loading -->
          <div v-if="loading" class="flex justify-center py-10">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
          
          <!-- Hiển thị khi không có kết quả -->
          <div v-else-if="jobs.length === 0" class="bg-white rounded-lg shadow-md p-10 text-center">
            <div class="text-5xl text-gray-300 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy việc làm phù hợp</h3>
            <p class="text-gray-600 mb-6">Vui lòng thử lại với từ khóa khác hoặc bỏ bớt bộ lọc</p>
            <button 
              @click="resetFilters" 
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
          
          <!-- Danh sách công việc -->
          <div v-else class="space-y-6">
            <JobCard 
              v-for="job in jobs" 
              :key="job.id" 
              :job="job" 
              @saveJob="handleSaveJob"
            />
            
            <!-- Phân trang -->
            <div class="flex justify-center mt-8">
              <nav class="flex items-center space-x-2">
                <button 
                  class="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                  :disabled="currentPage === 1"
                  :class="{'opacity-50 cursor-not-allowed': currentPage === 1}"
                  @click="changePage(currentPage - 1)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="changePage(page)"
                  class="px-3 py-1 rounded-md transition-colors"
                  :class="currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'"
                >
                  {{ page }}
                </button>
                
                <button 
                  class="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                  :disabled="currentPage === totalPages"
                  :class="{'opacity-50 cursor-not-allowed': currentPage === totalPages}"
                  @click="changePage(currentPage + 1)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
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
  sort_by: route.query.sort_by || 'relevant',
  sort_order: 'desc'
})

const locations = ref([])


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
  sort_by: route.query.sort_by || 'relevant',
  sort_order: 'desc'
})

// Tính tổng số trang
const totalPages = computed(() => {
  return Math.ceil(jobs.value.length / itemsPerPage)
})

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
  searchQuery.sort_by = newQuery.sort_by || 'relevant'
  searchQuery.sort_order = newQuery.sort_order || 'desc'
  loadJobsFromQuery()
}, { deep: true })

// Watch chỉ cần theo dõi sort_by
watch(() => sortQuery.sort_by, () => {
  searchQuery.sort_by = sortQuery.sort_by
  searchQuery.page = 1 // Reset về trang 1 khi thay đổi sort
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
        jobType: job.type_working,
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
</script> 