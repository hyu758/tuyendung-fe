<template>
  <div class="bg-gray-50 min-h-screen py-10">
    <div class="container mx-auto px-4">
      <!-- Loading overlay -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- Error message -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-20">
        <div class="text-red-500 text-xl font-semibold mb-4">
          <i class="fas fa-exclamation-circle mr-2"></i>{{ error }}
        </div>
        <button @click="fetchJobDetail" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
          Thử lại
        </button>
      </div>

      <!-- Job detail content -->
      <div v-else-if="job" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main content - 2/3 width on desktop -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Job header section -->
          <div class="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
            <div class="flex flex-col md:flex-row md:items-center gap-6">
              <!-- Company logo -->
              <div class="flex-shrink-0">
                <div class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border overflow-hidden">
                  <img 
                    v-if="job.logo_url" 
                    :src="job.logo_url" 
                    :alt="job.enterprise_name + ' logo'" 
                    class="w-full h-full object-contain p-2"
                  />
                  <i v-else class="fas fa-building text-3xl text-gray-400"></i>
                </div>
              </div>

              <!-- Job title and company info -->
              <div class="flex-grow space-y-2">
                <h1 class="text-2xl font-bold text-gray-800">{{ job.title }}</h1>
                <p class="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                  <i class="fas fa-building"></i>
                  <span>{{ job.enterprise_name }}</span>
                </p>
                
                <!-- Job meta info -->
                <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div class="flex items-center gap-1">
                    <i class="fas fa-map-marker-alt text-red-500"></i>
                    <span>{{ job.address }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <i class="fas fa-clock text-yellow-500"></i>
                    <span>Đăng {{ formatTimeAgo(job.created_at) }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <i class="fas fa-calendar-alt text-green-500"></i>
                    <span>Hạn nộp: {{ formatDate(job.deadline) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Apply button for desktop -->
            <div class="mt-6 flex justify-end">
              <button 
                @click="applyForJob" 
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-medium flex items-center gap-2"
              >
                <i class="fas fa-paper-plane"></i>
                Ứng tuyển ngay
              </button>
            </div>
          </div>

          <!-- Job overview section -->
          <div class="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
            <h2 class="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <i class="fas fa-info-circle text-blue-500"></i>
              Tổng quan
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
              <!-- Salary -->
              <div class="flex gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-dollar-sign text-blue-600"></i>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Mức lương</p>
                  <p class="font-medium text-gray-800">{{ formatSalary(job.salary_min, job.salary_max, job.is_salary_negotiable) }}</p>
                </div>
              </div>

              <!-- Job type -->
              <div class="flex gap-3">
                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-briefcase text-green-600"></i>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Loại công việc</p>
                  <p class="font-medium text-gray-800">{{ formatWorkType(job.type_working) }}</p>
                </div>
              </div>

              <!-- Experience -->
              <div class="flex gap-3">
                <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-user-tie text-purple-600"></i>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Kinh nghiệm</p>
                  <p class="font-medium text-gray-800">{{ job.experience || 'Không yêu cầu' }}</p>
                </div>
              </div>

              <!-- Position -->
              <div class="flex gap-3">
                <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-sitemap text-yellow-600"></i>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Vị trí</p>
                  <p class="font-medium text-gray-800">{{ job.position }}</p>
                </div>
              </div>

              <!-- Gender -->
              <div class="flex gap-3">
                <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-venus-mars text-red-600"></i>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Giới tính</p>
                  <p class="font-medium text-gray-800">{{ job.gender || 'Không yêu cầu' }}</p>
                </div>
              </div>

              <!-- Number of candidates -->
              <div class="flex gap-3">
                <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-users text-indigo-600"></i>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Số lượng tuyển</p>
                  <p class="font-medium text-gray-800">{{ job.num_of_recruit }} ứng viên</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Job description section -->
          <div class="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
            <h2 class="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <i class="fas fa-align-left text-blue-500"></i>
              Mô tả công việc
            </h2>
            <div v-html="job.description" class="prose max-w-none leading-relaxed text-gray-700"></div>
          </div>

          <!-- Requirements section -->
          <div class="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
            <h2 class="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <i class="fas fa-tasks text-blue-500"></i>
              Yêu cầu công việc
            </h2>
            <div v-html="job.requirement" class="prose max-w-none leading-relaxed text-gray-700"></div>
          </div>

          <!-- Benefits section -->
          <div class="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
            <h2 class="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <i class="fas fa-gift text-blue-500"></i>
              Quyền lợi
            </h2>
            <div v-html="job.welfare" class="prose max-w-none leading-relaxed text-gray-700"></div>
          </div>

          <!-- Apply button for mobile -->
          <div class="block md:hidden">
            <button 
              @click="applyForJob" 
              class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-medium flex items-center justify-center gap-2"
            >
              <i class="fas fa-paper-plane"></i>
              Ứng tuyển ngay
            </button>
          </div>
        </div>

        <!-- Sidebar - 1/3 width on desktop -->
        <div class="space-y-6">
          <!-- Company info section -->
          <div class="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
            <h2 class="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <i class="fas fa-building text-blue-500"></i>
              Thông tin doanh nghiệp
            </h2>
            
            <div class="flex items-center mb-4">
              <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border overflow-hidden">
                <img 
                  v-if="job.logo_url" 
                  :src="job.logo_url" 
                  :alt="job.enterprise_name + ' logo'" 
                  class="w-full h-full object-contain p-2"
                />
                <i v-else class="fas fa-building text-3xl text-gray-400"></i>
              </div>
              <div class="ml-4">
                <h3 class="font-semibold text-lg text-gray-800">{{ job.enterprise_name }}</h3>
                <a href="#" class="text-blue-600 hover:text-blue-700 text-sm">Xem trang doanh nghiệp</a>
              </div>
            </div>

            <div class="space-y-3 text-gray-700">
              <div class="flex items-start gap-3">
                <i class="fas fa-map-marker-alt mt-1 text-red-500 w-5"></i>
                <span>{{ job.enterprise_address || 'Chưa cung cấp địa chỉ' }}</span>
              </div>
              <div class="flex items-start gap-3">
                <i class="fas fa-globe mt-1 text-blue-500 w-5"></i>
                <span>{{ job.enterprise_website || 'Chưa cung cấp website' }}</span>
              </div>
              <div class="flex items-start gap-3">
                <i class="fas fa-user-friends mt-1 text-green-500 w-5"></i>
                <span>{{ job.enterprise_size || 'Chưa cung cấp quy mô' }}</span>
              </div>
            </div>
          </div>

          <!-- Similar jobs section -->
          <div class="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
            <h2 class="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <i class="fas fa-briefcase text-blue-500"></i>
              Việc làm tương tự
            </h2>
            
            <div v-if="similarJobs.length > 0" class="space-y-4">
              <div v-for="similarJob in similarJobs" :key="similarJob.id" class="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <router-link :to="`/job/${similarJob.id}`" class="block hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
                  <h3 class="font-medium text-blue-600">{{ similarJob.title }}</h3>
                  <p class="text-gray-600 text-sm mt-1">{{ similarJob.enterprise_name }}</p>
                  <div class="flex flex-wrap gap-4 mt-2 text-sm">
                    <span class="text-gray-500 flex items-center gap-1">
                      <i class="fas fa-map-marker-alt text-red-500"></i>
                      {{ similarJob.address }}
                    </span>
                    <span class="text-gray-500 flex items-center gap-1">
                      <i class="fas fa-dollar-sign text-green-500"></i>
                      {{ formatSalary(similarJob.salary_min, similarJob.salary_max, similarJob.is_salary_negotiable) }}
                    </span>
                  </div>
                </router-link>
              </div>
            </div>
            
            <div v-else class="text-gray-500 text-center py-4">
              Không có việc làm tương tự
            </div>
          </div>

          <!-- Share job section -->
          <div class="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
            <h2 class="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <i class="fas fa-share-alt text-blue-500"></i>
              Chia sẻ việc làm
            </h2>
            
            <div class="flex justify-center gap-4">
              <button class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                <i class="fab fa-facebook-f"></i>
              </button>
              <button class="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors">
                <i class="fab fa-twitter"></i>
              </button>
              <button class="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors">
                <i class="fab fa-linkedin-in"></i>
              </button>
              <button class="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors">
                <i class="fab fa-pinterest"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const { addToast } = useToast()

const job = ref(null)
const similarJobs = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(() => {
  fetchJobDetail()
})

const fetchJobDetail = async () => {
  loading.value = true
  error.value = null
  
  try {
    const jobId = route.params.id
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/job/${jobId}`)
    
    if (response.data) {
      job.value = response.data
      
      // Fetch similar jobs after getting job detail
      fetchSimilarJobs(job.value.position)
    } else {
      error.value = 'Không tìm thấy thông tin công việc'
    }
  } catch (err) {
    console.error('Error fetching job detail:', err)
    error.value = 'Có lỗi xảy ra khi tải thông tin công việc'
  } finally {
    loading.value = false
  }
}

const fetchSimilarJobs = async (position) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/job/search`, {
      params: {
        position: position,
        limit: 5
      }
    })
    
    if (response.data && response.data.data) {
      // Filter out current job from similar jobs
      similarJobs.value = response.data.data
        .filter(item => item.id !== job.value.id)
        .slice(0, 4)  // Take max 4 items
    }
  } catch (err) {
    console.error('Error fetching similar jobs:', err)
  }
}

const applyForJob = () => {
  if (!authStore.isLoggedIn) {
    addToast({
      title: 'Cần đăng nhập',
      message: 'Vui lòng đăng nhập để ứng tuyển công việc này',
      type: 'warning'
    })
    router.push({ 
      name: 'Login',
      query: { redirect: route.fullPath } 
    })
    return
  }
  
  if (!authStore.isCandidate) {
    addToast({
      title: 'Không thể ứng tuyển',
      message: 'Chỉ tài khoản ứng viên mới có thể ứng tuyển công việc',
      type: 'error'
    })
    return
  }
  
  // Redirect to application form or show apply modal
  router.push({ name: 'ApplyJob', params: { id: job.value.id } })
}

// Format utilities
const formatDate = (dateString) => {
  if (!dateString) return 'Không xác định'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

const formatTimeAgo = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hôm nay'
  if (diffDays === 1) return 'Hôm qua'
  if (diffDays < 7) return `${diffDays} ngày trước`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`
  return `${Math.floor(diffDays / 365)} năm trước`
}

const formatSalary = (min, max, isNegotiable) => {
  if (isNegotiable) return 'Thỏa thuận'
  
  const formatNumber = (num) => {
    if (!num) return '0'
    return new Intl.NumberFormat('vi-VN').format(num)
  }
  
  if (min && max) {
    return `${formatNumber(min)} - ${formatNumber(max)} VNĐ`
  } else if (min) {
    return `Từ ${formatNumber(min)} VNĐ`
  } else if (max) {
    return `Đến ${formatNumber(max)} VNĐ`
  }
  
  return 'Không xác định'
}

const formatWorkType = (types) => {
  if (!types) return 'Không xác định'
  if (Array.isArray(types)) return types.join(', ')
  return types
}
</script>

<style scoped>
:deep(.prose) {
  max-width: none;
}

:deep(.prose p) {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

:deep(.prose ul) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

:deep(.prose li) {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}

:deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
}

:deep(ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
}
</style> 