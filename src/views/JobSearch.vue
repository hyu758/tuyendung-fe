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
            <input v-model="searchQuery.q" type="text" placeholder="Tiêu đề công việc, vị trí, kỹ năng..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              @keyup.enter="searchJobs" />
          </div>
          <div>
            <button @click="searchJobs"
              class="w-full px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
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
                {{ !loading && jobs.length === 0 ? 'Không có kết quả' : `${jobs.length} việc làm` }}
              </span>
            </template>
          </div>

          <div class="flex items-center space-x-3">
            <!-- Dropdown sắp xếp -->
            <div class="relative">
              <select v-model="sortQuery.sort_by"
                class="pl-2 pr-6 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer bg-white transition-all">
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
          <button @click="toggleFilterVisible"
            class="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
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
                    {{ !loading && jobs.length === 0 ? 'Không có kết quả' : `Tìm thấy ${jobs.length} việc làm` }}
                  </span>
                </template>
              </h2>
              <div class="flex items-center space-x-2">
                <label for="sort" class="text-sm text-gray-600">Sắp xếp:</label>
                <div class="relative">
                  <select id="sort" v-model="sortQuery.sort_by"
                    class="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer bg-white transition-all">
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

          <!-- Hiển thị khi không có kết quả và đã tải xong -->
          <div v-else-if="!loading && jobs.length === 0" class="bg-white rounded-xl shadow-sm p-8 text-center">
            <div class="text-5xl text-blue-500 opacity-80 mb-4">
              <i class="fas fa-search"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy việc làm phù hợp</h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">Vui lòng thử lại với từ khóa khác hoặc bỏ bớt bộ lọc</p>
            <button @click="resetFilters"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center mx-auto">
              <i class="fas fa-redo-alt mr-2"></i>
              Xóa bộ lọc
            </button>
          </div>

          <!-- Danh sách công việc -->
          <div v-else>
            <div class="space-y-4">
              <div v-for="job in jobs" :key="job.id"
                class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all transform hover:-translate-y-1 border border-gray-100"
                :class="{'border-l-4 border-l-green-500': job.matchesCriteria}"
              >
                <div class="relative">
                  <!-- Nút save ở góc phải -->
                  <button 
                    @click="handleSaveJob(job)"
                    class="absolute top-4 right-4 z-10 text-gray-400 hover:text-red-500 transition-colors focus:outline-none bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm"
                    :class="{ 'text-red-500': job.isSaved }"
                  >
                    <i :class="job.isSaved ? 'fas fa-heart' : 'far fa-heart'"></i>
                  </button>

                  <!-- Nội dung card -->
                  <router-link :to="`/job/${job.id}`" class="block p-5">
                    <div class="flex flex-col md:flex-row md:items-center">
                      <!-- Logo công ty -->
                      <div class="mr-5 mb-4 md:mb-0">
                        <div v-if="job.enterprise_logo"
                          class="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-100 flex items-center justify-center">
                          <img :src="job.enterprise_logo" :alt="job.enterprise_name"
                            class="object-contain w-full h-full">
                        </div>
                        <div v-else
                          class="w-16 h-16 rounded-lg flex items-center justify-center bg-blue-100 text-blue-700 font-bold text-xl">
                          {{ getEnterpriseLogo(job.enterprise_name) }}
                        </div>
                      </div>

                      <!-- Thông tin chính -->
                      <div class="flex-grow">
                        <h3 class="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 hover:text-blue-600 transition-colors">
                          {{ job.title }}
                        </h3>
                        <p class="text-gray-600 text-sm mb-1">{{ job.enterprise_name || 'Công ty ẩn danh' }}</p>
                        <div class="flex gap-2 items-center">
                          <div v-if="job?.is_enterprise_premium">
                            <span class="inline-flex items-center px-2 py-1 bg-amber-400 text-white rounded-full text-xs font-semibold shadow">
                              Pro Company
                            </span>
                          </div>
                          <div v-if="job.matchesCriteria">
                            <span class="inline-flex items-center px-2 py-1 bg-green-500 text-white rounded-full text-xs font-semibold shadow">
                              <i class="fas fa-check-circle mr-1"></i>
                              Phù hợp
                            </span>
                          </div>
                        </div>
                        <!-- Tags -->
                        <div class="flex flex-wrap gap-2 mt-3">
                          <div v-if="job.location"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                            <i class="fas fa-map-marker-alt text-gray-500 mr-1"></i>
                            {{ job.location }}
                          </div>
                          <div v-if="job.experience"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                            <i class="fas fa-briefcase text-gray-500 mr-1"></i>
                            {{ job.experience }}
                          </div>
                          <div v-if="job.type_working"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
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
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Phân trang -->
            <div v-if="totalPages > 1" class="flex justify-center mt-10">
              <nav class="flex items-center space-x-2">
                <!-- Nút Previous -->
                <button
                  class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  :disabled="currentPage === 1"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                  @click="changePage(currentPage - 1)"
                >
                  <i class="fas fa-chevron-left text-gray-500"></i>
                </button>

                <!-- Nút trang đầu nếu không hiển thị -->
                <button
                  v-if="!displayedPages.includes(1)"
                  @click="changePage(1)"
                  class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                  1
                </button>

                <!-- Dấu ... bên trái -->
                <span v-if="displayedPages[0] > 2" class="px-2">...</span>

                <!-- Các nút số trang -->
                <button
                  v-for="page in displayedPages"
                  :key="page"
                  @click="changePage(page)"
                  class="flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
                  :class="currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50 text-gray-700'"
                >
                  {{ page }}
                </button>

                <!-- Dấu ... bên phải -->
                <span v-if="displayedPages[displayedPages.length - 1] < totalPages - 1" class="px-2">...</span>

                <!-- Nút trang cuối nếu không hiển thị -->
                <button
                  v-if="!displayedPages.includes(totalPages)"
                  @click="changePage(totalPages)"
                  class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                  {{ totalPages }}
                </button>

                <!-- Nút Next -->
                <button
                  class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  :disabled="currentPage === totalPages"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                  @click="changePage(currentPage + 1)"
                >
                  <i class="fas fa-chevron-right text-gray-500"></i>
                </button>
              </nav>

              <!-- Hiển thị thông tin phân trang -->
              <div class="text-sm text-gray-500 ml-4 flex items-center">
                Trang {{ currentPage }}/{{ totalPages }} ({{ total }} kết quả)
              </div>
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
import JobFilter from '../components/common/JobFilter.vue'
import { usePostStore } from '../stores/post'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const toast = useToast()
const authStore = useAuthStore()

// State
const loading = ref(false)
const jobs = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const sortQuery = reactive({
  sort_by: route.query.sort_by || 'created_at',
  sort_order: 'desc'
})

const locations = ref([])
const isFilterVisible = ref(false)
const hasCriteria = ref(false)
const isCriteriaLoading = ref(false)

// Truy vấn tìm kiếm
const searchQuery = reactive({
  q: route.query.q || '',
  city: route.query.city || '',
  position: route.query.position || '',
  experience: route.query.experience || '',
  type_working: route.query.type_working || '',
  salary_min: route.query.salary_min || '',
  salary_max: route.query.salary_max || '',
  scales: route.query.scales || '',
  field: route.query.field || '',
  page: route.query.page || 1,
  page_size: route.query.page_size || 10,
  sort_by: route.query.sort_by || 'created_at',
  sort_order: 'desc',
  all: route.query.all !== 'false' // Mặc định là true nếu không được chỉ định hoặc không phải 'false'
})

// Tính tổng số trang
const totalPages = ref(1)

// Hiển thị số trang tối đa 5 trang
const displayedPages = computed(() => {
  const maxVisiblePages = 5
  const halfVisible = Math.floor(maxVisiblePages / 2)
  const totalPagesValue = totalPages.value

  let startPage = Math.max(currentPage.value - halfVisible, 1)
  let endPage = startPage + maxVisiblePages - 1

  if (endPage > totalPagesValue) {
    endPage = totalPagesValue
    startPage = Math.max(endPage - maxVisiblePages + 1, 1)
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
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

const fetchUserCriteria = async () => {
  if (!authStore.isAuthenticated) return;
  
  isCriteriaLoading.value = true;
  
  try {
    const response = await axios.get('/api/criteria/');
    
    if (response.data.status === 200) {
      hasCriteria.value = true;
      
      // Không còn tự động điền thông tin từ criteria vào searchQuery nữa
      // Chỉ đánh dấu là người dùng có criteria
    }
  } catch (err) {
    // Nếu không có tiêu chí, đó không phải là lỗi
    if (err.response?.status !== 404) {
      console.error('Lỗi khi lấy tiêu chí tìm việc:', err);
    }
  } finally {
    isCriteriaLoading.value = false;
  }
};

onMounted(async () => {
  // Trước tiên, thử lấy tiêu chí từ người dùng
  await fetchUserCriteria();
  
  // Sau đó tải việc làm dựa trên truy vấn (có thể đã được điền từ tiêu chí)
  loadJobsFromQuery();
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
  searchQuery.all = newQuery.all !== 'false' // Mặc định là true nếu không được chỉ định hoặc không phải 'false'
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
  // Đặt thời gian bắt đầu để đảm bảo thời gian tải tối thiểu
  const startTime = Date.now()

  try {
    const response = await axios.get('/api/posts/search/', { params: searchQuery })
    const data = response.data.data
    console.log(data)

    // Cập nhật danh sách công việc
    jobs.value = data.results.map(job => ({
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
      isSaved: job.is_saved || false,
      is_enterprise_premium: job.is_enterprise_premium,
      enterprise_name: job.enterprise_name || '',
      enterprise_logo: job.enterprise_logo || '',
      matchesCriteria: hasCriteria.value && !isCriteriaLoading.value && job.matches_criteria || false
    }))

    // Cập nhật thông tin phân trang
    totalPages.value = data.total_pages
    currentPage.value = data.page
    pageSize.value = data.page_size
    total.value = data.total
    
    // Đảm bảo hiển thị loading ít nhất 500ms để tránh nhấp nháy giao diện
    const loadingTime = Date.now() - startTime
    if (loadingTime < 500) {
      await new Promise(resolve => setTimeout(resolve, 500 - loadingTime))
    }

  } catch (error) {
    console.error('Không thể lấy danh sách việc làm:', error)
    toast.error('Có lỗi xảy ra khi tải danh sách việc làm')
  } finally {
    loading.value = false
  }
}

const searchJobs = () => {
  // Chỉ sử dụng q từ nhập liệu và các tham số cố định
  const newQuery = {
    page: 1,
    page_size: 10,
    sort_by: 'created_at',
    sort_order: 'desc',
    all: true  // Luôn đảm bảo là true
  }
  
  // Chỉ thêm q nếu người dùng đã nhập
  if (searchQuery.q && searchQuery.q.trim()) {
    newQuery.q = searchQuery.q.trim()
  }
  
  // Cập nhật searchQuery để sử dụng cho các thao tác API sau này
  Object.assign(searchQuery, newQuery)
  
  // Chuyển hướng với URL hoàn toàn mới
  router.push({
    path: '/job-search',
    query: newQuery
  })
}

const applyFilters = (filters) => {
  // Thay vì cập nhật searchQuery hiện có, tạo mới hoàn toàn URL params từ bộ lọc được gửi đến
  // Chỉ sử dụng các tham số cơ bản như page_size, sort_by, sort_order nếu không được cung cấp
  const newQuery = {
    page: 1, // Luôn reset về trang 1 khi áp dụng bộ lọc mới
    page_size: searchQuery.page_size,
    sort_by: filters.sort_by || searchQuery.sort_by || 'created_at',
    sort_order: filters.sort_order || searchQuery.sort_order || 'desc',
    all: filters.all !== undefined ? filters.all : true  // Mặc định là true
  }

  // Chỉ thêm các tham số có giá trị từ filters, không sử dụng giá trị cũ từ searchQuery
  if (filters.q) newQuery.q = filters.q
  if (filters.city) newQuery.city = filters.city
  if (filters.position) newQuery.position = filters.position
  if (filters.experience) newQuery.experience = filters.experience
  if (filters.type_working) newQuery.type_working = filters.type_working
  if (filters.salary_min) newQuery.salary_min = filters.salary_min
  if (filters.salary_max) newQuery.salary_max = filters.salary_max
  if (filters.negotiable) newQuery.negotiable = filters.negotiable
  if (filters.scales) newQuery.scales = filters.scales
  if (filters.field) newQuery.field = filters.field
  
  // Cập nhật searchQuery để sử dụng cho các thao tác API sau này
  Object.assign(searchQuery, newQuery)
  
  // Chuyển hướng với URL hoàn toàn mới, không giữ lại bất kỳ tham số nào từ URL cũ
  router.push({
    path: '/job-search',
    query: newQuery
  })
}

const resetFilters = () => {
  // Reset tất cả các giá trị tìm kiếm trong component
  searchQuery.q = ''
  searchQuery.city = ''
  searchQuery.position = ''
  searchQuery.experience = ''
  searchQuery.type_working = ''
  searchQuery.salary_min = ''
  searchQuery.salary_max = ''
  searchQuery.negotiable = false
  searchQuery.scales = ''
  searchQuery.field = ''
  
  // Chỉ giữ lại các tham số cơ bản
  const basicQuery = {
    page: 1,
    page_size: 10,
    sort_by: 'created_at',
    sort_order: 'desc',
    all: true  // Luôn đảm bảo all=true
  }
  
  // Cập nhật searchQuery
  Object.assign(searchQuery, basicQuery)
  
  // Reset dropdown sắp xếp
  sortQuery.sort_by = 'created_at'

  // Chuyển đến URL mới chỉ với tham số cơ bản
  router.push({
    path: '/job-search',
    query: basicQuery
  })
}

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  
  searchQuery.page = page
  router.push({
    path: '/job-search',
    query: { ...searchQuery }
  })
}

const handleSaveJob = async (job) => {
  try {
    const jobIndex = jobs.value.findIndex(j => j.id === job.id)
    if (jobIndex === -1) return

    if (!jobs.value[jobIndex].isSaved) {
      // Lưu job
      const result = await postStore.savePost(job.id)
      if (result.success) {
        jobs.value[jobIndex].isSaved = true
        toast.success('Đã lưu việc làm thành công')
      } else {
        toast.error(result.error)
      }
    } else {
      // Bỏ lưu job
      const result = await postStore.deleteSavedPostByPostId(job.id)
      if (result.success) {
        jobs.value[jobIndex].isSaved = false
        toast.success('Đã bỏ lưu việc làm thành công')
      } else {
        toast.error(result.error)
      }
    }
  } catch (error) {
    console.error('Error handling save job:', error)
    toast.error('Có lỗi xảy ra khi thực hiện thao tác')
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

  0%,
  100% {
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