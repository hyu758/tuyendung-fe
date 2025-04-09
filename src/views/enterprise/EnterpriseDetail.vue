<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Banner section -->
    <div class="h-80 relative bg-cover bg-center" :style="{ backgroundImage: `url(${enterprise?.background_image_url || '/default-banner.jpg'})` }">
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="container mx-auto h-full relative">
        <div class="absolute -bottom-16 flex items-end">
          <div class="flex items-start space-x-8">
            <div class="w-40 h-40 bg-white rounded-lg shadow-lg p-2">
              <img 
                v-if="enterprise?.logo_url" 
                :src="enterprise.logo_url" 
                :alt="enterprise?.company_name"
                class="w-full h-full object-contain"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
                <i class="fas fa-building text-gray-400 text-4xl"></i>
              </div>
            </div>
            <div class="mb-4">
              <h1 class="text-3xl font-bold text-white mb-2">{{ enterprise?.company_name || 'TLU' }}</h1>
              <div class="flex items-center text-white/90">
                <i class="fas fa-users mr-2"></i>
                <span>{{ enterprise?.scale || '11-50' }} nhân viên</span>
              </div>
            </div>
          </div>
        </div>
        <div class="absolute right-0 bottom-4">
          <button class="mr-2 px-4 py-2 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium flex items-center">
            <i class="fas fa-plus mr-2"></i>
            Theo dõi công ty
          </button>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="container mx-auto pt-24">
      <div class="grid grid-cols-12 gap-8">
        <!-- Left column -->
        <div class="col-span-8">
          <!-- Giới thiệu section -->
          <div class="bg-white rounded-lg p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4">Giới thiệu công ty</h2>
            <div class="text-gray-600">
              {{ enterprise?.description || 'TLU' }}
            </div>
          </div>

          <!-- Tin tuyển dụng section -->
          <div class="bg-white rounded-lg p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold">Tin tuyển dụng</h2>
              <div class="text-gray-500">Tìm thấy {{ jobs.length || 0 }} việc làm</div>
            </div>

            <!-- Loading skeleton -->
            <div v-if="loading" class="space-y-4">
              <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 bg-gray-200 rounded"></div>
                    <div class="flex-1 space-y-3">
                      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div class="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div class="flex space-x-4">
                        <div class="h-3 bg-gray-200 rounded w-1/4"></div>
                        <div class="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div class="w-24 h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Job list -->
            <div v-else class="space-y-4">
              <div v-if="jobs?.length === 0" class="text-center py-8">
                <div class="text-gray-500">Chưa có tin tuyển dụng nào</div>
              </div>
              
              <div v-else v-for="job in jobs" :key="job.id" 
                class="group border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <router-link :to="{ name: 'JobDetail', params: { id: job.id }}" 
                  class="flex items-center p-4">
                  <img 
                    :src="job.enterprise_logo" 
                    :alt="job.enterprise_name"
                    class="w-16 h-16 rounded object-contain bg-white p-1"
                    @error="handleImageError"
                  />
                  <div class="ml-4 flex-1">
                    <h3 class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{{ job.title }}</h3>
                    <div class="mt-1 text-sm text-gray-500">{{ job.enterprise_name }}</div>
                    <div class="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                      <div class="flex items-center">
                        <i class="fas fa-map-marker-alt mr-1"></i>
                        {{ job.city }}
                      </div>
                      <div class="flex items-center">
                        <i class="fas fa-clock mr-1"></i>
                        Hạn nộp: {{ new Date(job.deadline).toLocaleDateString('vi-VN') }}
                      </div>
                    </div>
                  </div>
                  <div class="text-emerald-600 font-medium">
                    Xem chi tiết
                    <i class="fas fa-chevron-right ml-1 text-sm transition-transform group-hover:translate-x-1"></i>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column -->
        <div class="col-span-4">
          <div class="bg-white rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-4">Thông tin liên hệ</h3>
            <div class="space-y-4">
              <div class="flex items-start">
                <i class="fas fa-map-marker-alt text-gray-400 mt-1 w-5"></i>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">Địa chỉ</div>
                  <div class="text-sm text-gray-600">{{ enterprise?.address }}</div>
                </div>
              </div>

              <div class="flex items-start">
                <i class="fas fa-globe text-gray-400 mt-1 w-5"></i>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">Website</div>
                  <a :href="enterprise?.link_web_site" target="_blank" 
                    class="text-sm text-blue-600 hover:underline">
                    {{ enterprise?.link_web_site }}
                  </a>
                </div>
              </div>

              <div class="flex items-start">
                <i class="fas fa-phone text-gray-400 mt-1 w-5"></i>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">Điện thoại</div>
                  <div class="text-sm text-gray-600">{{ enterprise?.phone_number }}</div>
                </div>
              </div>

              <div class="flex items-start">
                <i class="fas fa-envelope text-gray-400 mt-1 w-5"></i>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">Email</div>
                  <div class="text-sm text-gray-600">{{ enterprise?.email_company }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEnterpriseStore } from '../../stores/enterprise'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const enterpriseStore = useEnterpriseStore()
const loading = ref(true)
const error = ref(null)
const enterprise = ref(null)
const jobs = ref({
  results: [],
  total: 0,
  total_pages: 0,
  page: 1,
  page_size: 10
})
const currentPage = ref(1)

const loadEnterprise = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Fetch enterprise info
    const result = await enterpriseStore.fetchEnterpriseById(route.params.id)
    if (result.success) {
      enterprise.value = result.data.data
      await loadJobs()
    } else {
      error.value = result.error
    }
  } catch (err) {
    console.error('Error loading enterprise:', err)
    error.value = 'Có lỗi xảy ra khi tải thông tin công ty'
  } finally {
    loading.value = false
  }
}

const loadJobs = async () => {
  try {
    const response = await axios.get(`/api/posts/enterprise/${route.params.id}/`, {
      params: {
        page: currentPage.value,
        page_size: jobs.value.page_size
      }
    })
    jobs.value = response.data
  } catch (error) {
    console.error('Error loading jobs:', error)
  }
}

const changePage = async (page) => {
  currentPage.value = page
  await loadJobs()
}

const handleImageError = (e) => {
  e.target.src = '/default-company-logo.png' // Thay thế bằng ảnh mặc định khi load ảnh lỗi
}

onMounted(() => {
  loadEnterprise()
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
</style>