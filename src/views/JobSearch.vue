<template>
  <div class="bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Header tìm kiếm -->
      <div class="bg-white rounded-lg shadow-md p-5 mb-6">
        <div class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <div class="flex-1">
            <input
              v-model="searchQuery.keyword"
              type="text"
              placeholder="Tiêu đề công việc, vị trí, kỹ năng..."
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="searchJobs"
            />
          </div>
          <div class="md:w-1/3">
            <select
              v-model="searchQuery.location"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả địa điểm</option>
              <option v-for="location in locations" :key="location" :value="location">
                {{ location }}
              </option>
            </select>
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
                  v-model="sortOption"
                  class="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @change="sortJobs"
                >
                  <option value="recent">Mới nhất</option>
                  <option value="relevant">Phù hợp nhất</option>
                  <option value="salary_high">Lương cao nhất</option>
                  <option value="salary_low">Lương thấp nhất</option>
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
import { jobService } from '../services/api'

const route = useRoute()
const router = useRouter()

// State
const loading = ref(false)
const allJobs = ref([])
const jobs = ref([])
const currentPage = ref(1)
const itemsPerPage = 6
const sortOption = ref('recent')

// Dữ liệu mẫu (thường sẽ được lấy từ API)
const locations = [
  'Hà Nội', 
  'Hồ Chí Minh', 
  'Đà Nẵng', 
  'Hải Phòng', 
  'Cần Thơ', 
  'Khác'
]

// Truy vấn tìm kiếm
const searchQuery = reactive({
  keyword: route.query.q || '',
  location: route.query.location || '',
  category: route.query.category || ''
})

// Tính tổng số trang
const totalPages = computed(() => {
  return Math.ceil(jobs.value.length / itemsPerPage)
})

// Lifecycle hooks
onMounted(async () => {
  loadJobsFromQuery()
})

// Watch route changes
watch(() => route.query, (newQuery) => {
  searchQuery.keyword = newQuery.q || ''
  searchQuery.location = newQuery.location || ''
  searchQuery.category = newQuery.category || ''
  loadJobsFromQuery()
}, { deep: true })

// Methods
const loadJobsFromQuery = async () => {
  loading.value = true
  
  try {
    // Trong thực tế, sẽ gọi API để lấy danh sách việc làm
    // const response = await jobService.getAllJobs({
    //   keyword: searchQuery.keyword,
    //   location: searchQuery.location,
    //   category: searchQuery.category
    // })
    // allJobs.value = response.data
    
    // Dữ liệu mẫu
    allJobs.value = [
      {
        id: 1,
        title: 'Frontend Developer',
        companyName: 'Tech Solutions',
        companyLogo: '',
        location: 'Hồ Chí Minh',
        jobType: 'Toàn thời gian',
        salaryMin: 15000000,
        salaryMax: 25000000,
        publishDate: new Date(new Date().setDate(new Date().getDate() - 2)),
        tags: ['Vue.js', 'JavaScript', 'Tailwind CSS'],
        isFeatured: true,
        isSaved: false
      },
      {
        id: 2,
        title: 'UX/UI Designer',
        companyName: 'Creative Design',
        companyLogo: '',
        location: 'Hà Nội',
        jobType: 'Toàn thời gian',
        salaryMin: 18000000,
        salaryMax: 30000000,
        publishDate: new Date(new Date().setDate(new Date().getDate() - 1)),
        tags: ['Figma', 'Adobe XD', 'User Research'],
        isFeatured: true,
        isSaved: true
      },
      {
        id: 3,
        title: 'Backend Developer',
        companyName: 'SoftTech',
        companyLogo: '',
        location: 'Đà Nẵng',
        jobType: 'Toàn thời gian',
        salaryMin: 20000000,
        salaryMax: 35000000,
        publishDate: new Date(),
        tags: ['Node.js', 'Express', 'MongoDB'],
        isFeatured: true,
        isSaved: false
      },
      {
        id: 4,
        title: 'Mobile Developer',
        companyName: 'App Innovators',
        companyLogo: '',
        location: 'Hồ Chí Minh',
        jobType: 'Toàn thời gian',
        salaryMin: 22000000,
        salaryMax: 35000000,
        publishDate: new Date(new Date().setDate(new Date().getDate() - 3)),
        tags: ['React Native', 'Flutter', 'Mobile'],
        isFeatured: false,
        isSaved: false
      },
      {
        id: 5,
        title: 'DevOps Engineer',
        companyName: 'Cloud Systems',
        companyLogo: '',
        location: 'Hà Nội',
        jobType: 'Toàn thời gian',
        salaryMin: 25000000,
        salaryMax: 40000000,
        publishDate: new Date(new Date().setDate(new Date().getDate() - 4)),
        tags: ['AWS', 'Docker', 'Kubernetes'],
        isFeatured: false,
        isSaved: false
      },
      {
        id: 6,
        title: 'Product Manager',
        companyName: 'Digital Solutions',
        companyLogo: '',
        location: 'Hồ Chí Minh',
        jobType: 'Toàn thời gian',
        salaryMin: 30000000,
        salaryMax: 45000000,
        publishDate: new Date(new Date().setDate(new Date().getDate() - 5)),
        tags: ['Product Management', 'Agile', 'Scrum'],
        isFeatured: false,
        isSaved: false
      },
      {
        id: 7,
        title: 'Data Analyst',
        companyName: 'Data Insights',
        companyLogo: '',
        location: 'Hà Nội',
        jobType: 'Toàn thời gian',
        salaryMin: 18000000,
        salaryMax: 28000000,
        publishDate: new Date(new Date().setDate(new Date().getDate() - 6)),
        tags: ['SQL', 'Python', 'Data Visualization'],
        isFeatured: false,
        isSaved: false
      },
      {
        id: 8,
        title: 'Marketing Specialist',
        companyName: 'Brand Builders',
        companyLogo: '',
        location: 'Đà Nẵng',
        jobType: 'Toàn thời gian',
        salaryMin: 15000000,
        salaryMax: 22000000,
        publishDate: new Date(new Date().setDate(new Date().getDate() - 7)),
        tags: ['Digital Marketing', 'SEO', 'Content'],
        isFeatured: false,
        isSaved: false
      }
    ]
    
    // Lọc dữ liệu theo query
    filterJobs()
    
    // Sắp xếp và phân trang
    sortJobs()
    
    loading.value = false
  } catch (error) {
    console.error('Không thể lấy danh sách việc làm:', error)
    loading.value = false
  }
}

const searchJobs = () => {
  router.push({
    path: '/job-search',
    query: {
      q: searchQuery.keyword,
      location: searchQuery.location,
      category: searchQuery.category
    }
  })
}

const applyFilters = (filters) => {
  // Cập nhật query nếu cần
  searchQuery.keyword = filters.keyword || searchQuery.keyword
  searchQuery.location = filters.location || searchQuery.location
  searchQuery.category = filters.category
  
  filterJobs()
  currentPage.value = 1
}

const filterJobs = () => {
  // Lọc danh sách công việc dựa trên các bộ lọc
  jobs.value = allJobs.value.filter(job => {
    let matchKeyword = true
    let matchLocation = true
    let matchCategory = true
    
    if (searchQuery.keyword) {
      const keyword = searchQuery.keyword.toLowerCase()
      matchKeyword = job.title.toLowerCase().includes(keyword) ||
                    job.companyName.toLowerCase().includes(keyword) ||
                    job.tags.some(tag => tag.toLowerCase().includes(keyword))
    }
    
    if (searchQuery.location) {
      matchLocation = job.location === searchQuery.location
    }
    
    if (searchQuery.category) {
      matchCategory = job.tags.some(tag => tag.toLowerCase() === searchQuery.category.toLowerCase())
    }
    
    return matchKeyword && matchLocation && matchCategory
  })
  
  sortJobs()
}

const sortJobs = () => {
  // Sắp xếp danh sách công việc dựa trên lựa chọn
  const sortedJobs = [...jobs.value]
  
  switch (sortOption.value) {
    case 'recent':
      sortedJobs.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
      break
    case 'relevant':
      // Giả định: Các công việc nổi bật được đặt lên đầu
      sortedJobs.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
      break
    case 'salary_high':
      sortedJobs.sort((a, b) => b.salaryMax - a.salaryMax)
      break
    case 'salary_low':
      sortedJobs.sort((a, b) => a.salaryMin - b.salaryMin)
      break
  }
  
  jobs.value = sortedJobs
}

const resetFilters = () => {
  searchQuery.keyword = ''
  searchQuery.location = ''
  searchQuery.category = ''
  
  router.push({ path: '/job-search' })
}

const changePage = (page) => {
  currentPage.value = page
}

const handleSaveJob = (jobId) => {
  // Trong thực tế, sẽ gọi API để lưu/bỏ lưu công việc
  const jobIndex = jobs.value.findIndex(job => job.id === jobId)
  if (jobIndex !== -1) {
    jobs.value[jobIndex].isSaved = !jobs.value[jobIndex].isSaved
  }
}
</script> 