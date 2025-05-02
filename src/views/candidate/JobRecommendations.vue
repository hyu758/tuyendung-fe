<template>
  <div class="job-recommendations-page">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Việc làm phù hợp với bạn</h1>
          <p class="text-gray-600 mt-1">Gợi ý dựa trên tiêu chí tìm việc của bạn</p>
        </div>
        <router-link
          to="/my-criteria"
          class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <i class="fas fa-sliders-h mr-2"></i>
          Chỉnh sửa tiêu chí
        </router-link>
      </div>

      <!-- Main content -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- No criteria yet -->
        <div v-else-if="noCriteria" class="p-8 text-center">
          <div class="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-4">
            <i class="fas fa-filter text-3xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900">Chưa có tiêu chí tìm việc</h3>
          <p class="mt-2 text-gray-500 max-w-md mx-auto">
            Bạn cần thiết lập tiêu chí tìm việc để nhận được gợi ý việc làm phù hợp với mong muốn của mình.
          </p>
          <router-link
            to="/my-criteria"
            class="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <i class="fas fa-plus-circle mr-2"></i>
            Tạo tiêu chí tìm việc
          </router-link>
        </div>

        <!-- No jobs found -->
        <div v-else-if="recommendedJobs.length === 0" class="p-8 text-center">
          <div class="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 mb-4">
            <i class="fas fa-search text-3xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900">Không tìm thấy việc làm phù hợp</h3>
          <p class="mt-2 text-gray-500 max-w-md mx-auto">
            Không có việc làm nào phù hợp với tiêu chí của bạn. Hãy thử điều chỉnh tiêu chí hoặc quay lại sau.
          </p>
          <div class="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <router-link
              to="/my-criteria"
              class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <i class="fas fa-edit mr-2"></i>
              Điều chỉnh tiêu chí
            </router-link>
            <router-link
              to="/job-search"
              class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <i class="fas fa-search mr-2"></i>
              Tìm kiếm việc làm
            </router-link>
          </div>
        </div>

        <!-- Jobs list -->
        <div v-else>
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center">
              <span class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <i class="fas fa-thumbs-up text-blue-500"></i>
              </span>
              <h3 class="ml-3 text-lg font-medium text-gray-900">
                {{ recommendedJobs.length }} việc làm phù hợp với tiêu chí của bạn
              </h3>
            </div>
          </div>

          <div class="divide-y divide-gray-200">
            <!-- Job items -->
            <div v-for="job in recommendedJobs" :key="job.id" class="p-6 hover:bg-gray-50 transition-colors">
              <div class="flex flex-col md:flex-row">
                <!-- Logo or abbreviation -->
                <div class="flex-shrink-0 mb-4 md:mb-0">
                  <div v-if="job.enterprise?.logo" class="h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                    <img :src="job.enterprise.logo" :alt="job.enterprise.name" class="h-full w-full object-contain" />
                  </div>
                  <div v-else class="h-16 w-16 rounded-md bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold">
                    {{ getEnterpriseLogo(job.enterprise?.name) }}
                  </div>
                </div>

                <!-- Job details -->
                <div class="md:ml-6 flex-1">
                  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">
                        <router-link :to="`/jobs/${job.id}`" class="hover:text-blue-600">{{ job.title }}</router-link>
                      </h3>
                      <p class="mt-1 text-sm text-gray-500">{{ job.enterprise?.name }}</p>
                    </div>
                    <div class="mt-2 sm:mt-0 flex flex-wrap items-center gap-2">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <i class="fas fa-map-marker-alt mr-1"></i>
                        {{ job.city }}
                      </span>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <i class="fas fa-briefcase mr-1"></i>
                        {{ job.type_working }}
                      </span>
                    </div>
                  </div>

                  <div class="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div class="flex items-center text-sm text-gray-500">
                      <i class="fas fa-money-bill-wave mr-1 text-gray-400"></i>
                      <span>{{ formatSalary(job.salary_min, job.salary_max, job.is_salary_negotiable) }}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-500">
                      <i class="fas fa-user-graduate mr-1 text-gray-400"></i>
                      <span>{{ job.experience }}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-500">
                      <i class="fas fa-clock mr-1 text-gray-400"></i>
                      <span>Hạn: {{ formatDate(job.deadline) }}</span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="mt-4 flex items-center justify-between">
                    <div class="text-sm text-gray-500">
                      <i class="fas fa-calendar-alt mr-1"></i>
                      Đăng {{ formatDateAgo(job.created_at) }}
                    </div>
                    <div class="flex space-x-2">
                      <button 
                        @click="toggleSaveJob(job)"
                        class="inline-flex items-center px-3 py-1 border rounded-md text-sm font-medium"
                        :class="job.is_saved ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'"
                      >
                        <i class="mr-1.5" :class="job.is_saved ? 'fas fa-heart text-red-500' : 'far fa-heart'"></i>
                        {{ job.is_saved ? 'Đã lưu' : 'Lưu' }}
                      </button>
                      <router-link 
                        :to="`/jobs/${job.id}`"
                        class="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Xem chi tiết
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Trước
              </button>
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Hiển thị <span class="font-medium">{{ paginationFrom }}</span> đến <span class="font-medium">{{ paginationTo }}</span> của <span class="font-medium">{{ totalItems }}</span> kết quả
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <!-- Previous Page -->
                  <button
                    @click="prevPage"
                    :disabled="currentPage === 1"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="sr-only">Previous</span>
                    <i class="fas fa-chevron-left text-xs"></i>
                  </button>
                  
                  <!-- Page Numbers -->
                  <button
                    v-for="page in displayedPages"
                    :key="page"
                    @click="goToPage(page)"
                    :class="{ 'z-10 bg-blue-50 border-blue-500 text-blue-600': currentPage === page, 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': currentPage !== page }"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    {{ page }}
                  </button>
                  
                  <!-- Next Page -->
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="sr-only">Next</span>
                    <i class="fas fa-chevron-right text-xs"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No criteria advice -->
      <div v-if="!noCriteria && recommendedJobs.length > 0" class="bg-blue-50 border border-blue-100 rounded-lg p-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-lightbulb text-blue-400 text-xl"></i>
          </div>
          <div class="ml-4">
            <h4 class="text-base font-medium text-blue-800">Nhận thêm gợi ý phù hợp hơn</h4>
            <p class="mt-1 text-sm text-blue-700">
              Việc làm được gợi ý dựa trên tiêu chí tìm việc của bạn. 
              <router-link to="/my-criteria" class="font-medium underline hover:text-blue-900">Cập nhật tiêu chí</router-link> 
              để nhận gợi ý phù hợp hơn với mong muốn của bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const toast = useToast()

// State
const loading = ref(true)
const noCriteria = ref(false)
const recommendedJobs = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const totalPages = ref(1)

// Computed values for pagination
const paginationFrom = computed(() => {
  if (totalItems.value === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const paginationTo = computed(() => {
  const to = currentPage.value * pageSize.value
  return to > totalItems.value ? totalItems.value : to
})

// Computed for displayed page numbers
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

// Format date
const formatDate = (dateString) => {
  try {
    if (!dateString) return '';
    
    // Xử lý timezone
    const date = new Date(dateString.replace('+07:00', 'Z'));
    
    if (isNaN(date.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

// Format date ago
const formatDateAgo = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'hôm nay';
  if (diffDays === 1) return 'hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  
  return formatDate(dateString);
}

// Format salary
const formatSalary = (min, max, isNegotiable) => {
  if (isNegotiable) return 'Thỏa thuận';

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

// Get enterprise logo abbreviation
const getEnterpriseLogo = (name) => {
  if (!name) return 'JH';
  return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
}

// Fetch recommended jobs
const fetchRecommendedJobs = async () => {
  loading.value = true;
  
  try {
    const response = await axios.get('/api/enterprises/posts/recommended/', {
      params: {
        page: currentPage.value,
        page_size: pageSize.value
      }
    });
    
    recommendedJobs.value = response.data.results;
    totalItems.value = response.data.count;
    totalPages.value = Math.ceil(totalItems.value / pageSize.value);
    
  } catch (error) {
    console.error('Error fetching recommended jobs:', error);
    
    // Check if error is due to no criteria
    if (error.response?.status === 404 && error.response?.data?.message?.includes('No criteria found')) {
      noCriteria.value = true;
    } else {
      toast.error('Không thể lấy việc làm gợi ý. Vui lòng thử lại sau.');
    }
  } finally {
    loading.value = false;
  }
}

// Save job toggle
const toggleSaveJob = async (job) => {
  try {
    if (job.is_saved) {
      // Unsave the job
      await axios.delete(`/api/enterprises/saved-posts/post/${job.id}/delete/`);
      toast.success('Đã bỏ lưu bài đăng');
    } else {
      // Save the job
      await axios.post('/api/enterprises/saved-posts/save/', { post_id: job.id });
      toast.success('Đã lưu bài đăng');
    }
    
    // Toggle the is_saved property
    job.is_saved = !job.is_saved;
  } catch (error) {
    console.error('Error toggling saved status:', error);
    toast.error('Không thể thực hiện thao tác. Vui lòng thử lại sau.');
  }
}

// Pagination methods
const goToPage = (page) => {
  if (page !== currentPage.value) {
    currentPage.value = page;
    fetchRecommendedJobs();
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchRecommendedJobs();
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchRecommendedJobs();
  }
}

// Lifecycle
onMounted(() => {
  fetchRecommendedJobs();
})
</script>

<style scoped>
.job-recommendations-page {
  min-height: calc(100vh - 160px);
  background-color: #f9fafb;
}
</style> 