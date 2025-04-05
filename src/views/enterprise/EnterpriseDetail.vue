<template>
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
  
        <!-- Error -->
        <div v-else-if="error" class="text-center py-12">
          <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
          <h3 class="text-lg font-medium text-gray-900">Không thể tải thông tin công ty</h3>
          <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
          <button @click="router.back()" class="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <i class="fas fa-arrow-left mr-2"></i>
            Quay lại
          </button>
        </div>
  
        <!-- Enterprise detail -->
        <div v-else class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Header with background image -->
          <div class="relative h-48 bg-gray-200">
            <img v-if="enterprise.background_image_url" :src="enterprise.background_image_url" 
              :alt="enterprise.company_name" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <div class="flex items-end">
                <div class="flex-shrink-0">
                  <img v-if="enterprise.logo_url" :src="enterprise.logo_url" :alt="enterprise.company_name"
                    class="h-20 w-20 rounded-lg object-cover border-4 border-white">
                  <div v-else class="h-20 w-20 rounded-lg bg-gray-200 flex items-center justify-center border-4 border-white">
                    <i class="fas fa-building text-gray-400 text-2xl"></i>
                  </div>
                </div>
                <div class="ml-4">
                  <h1 class="text-2xl font-bold text-white">{{ enterprise.company_name }}</h1>
                  <p class="text-white/80">{{ enterprise.city }}</p>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Content -->
          <div class="p-6">
            <!-- Basic info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Thông tin cơ bản</h3>
                <div class="space-y-4">
                  <div class="flex items-start">
                    <i class="fas fa-map-marker-alt text-gray-400 mt-1 mr-3"></i>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Địa chỉ</p>
                      <p class="text-sm text-gray-500">{{ enterprise.address }}</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <i class="fas fa-phone text-gray-400 mt-1 mr-3"></i>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Điện thoại</p>
                      <p class="text-sm text-gray-500">{{ enterprise.phone_number }}</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <i class="fas fa-envelope text-gray-400 mt-1 mr-3"></i>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Email</p>
                      <p class="text-sm text-gray-500">{{ enterprise.email_company }}</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <i class="fas fa-globe text-gray-400 mt-1 mr-3"></i>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Website</p>
                      <a :href="enterprise.link_web_site" target="_blank" class="text-sm text-blue-600 hover:text-blue-700">
                        {{ enterprise.link_web_site }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
  
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Thông tin bổ sung</h3>
                <div class="space-y-4">
                  <div class="flex items-start">
                    <i class="fas fa-industry text-gray-400 mt-1 mr-3"></i>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Lĩnh vực hoạt động</p>
                      <p class="text-sm text-gray-500">{{ enterprise.field_of_activity }}</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <i class="fas fa-users text-gray-400 mt-1 mr-3"></i>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Quy mô</p>
                      <p class="text-sm text-gray-500">{{ enterprise.scale }}</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <i class="fas fa-file-alt text-gray-400 mt-1 mr-3"></i>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Mã số thuế</p>
                      <p class="text-sm text-gray-500">{{ enterprise.tax }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Description -->
            <div class="mb-8">
              <h3 class="text-lg font-medium text-gray-900 mb-2">Giới thiệu</h3>
              <p class="text-gray-600 whitespace-pre-line">{{ enterprise.description }}</p>
            </div>
  
            <!-- Back button -->
            <div class="flex justify-end">
              <button @click="router.back()" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <i class="fas fa-arrow-left mr-2"></i>
                Quay lại
              </button>
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
  import { useJobStore } from '../../stores/job'
  
  const router = useRouter()
  const route = useRoute()
  const enterpriseStore = useEnterpriseStore()
  const jobStore = useJobStore()
  const loading = ref(true)
  const error = ref(null)
  const enterprise = ref(null)
  const jobs = ref([])
  
  const loadEnterprise = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Fetch enterprise info
      const result = await enterpriseStore.fetchEnterpriseById(route.params.id)
      if (result.success) {
        enterprise.value = result.data.data
        
        // Fetch jobs for this enterprise
        const jobsResult = await jobStore.fetchJobsByEnterprise(route.params.id)
        console.log(jobsResult);
        if (jobsResult.success) {
          jobs.value = jobsResult.data.results
        }
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
  
  onMounted(() => {
    loadEnterprise()
  })
  </script>