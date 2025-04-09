<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <template v-if="loading">
        <!-- Skeleton loading -->
        <!-- Header card skeleton -->
        <div class="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <!-- Banner skeleton -->
          <div class="relative h-56 bg-gray-300 animate-pulse"></div>
          
          <div class="relative px-8 pb-6">
            <div class="flex flex-col md:flex-row">
              <!-- Logo skeleton -->
              <div class="flex-shrink-0 -mt-20">
                <div class="w-32 h-32 rounded-lg border-4 border-white bg-gray-300 animate-pulse"></div>
              </div>
              <div class="mt-4 md:mt-4 md:ml-8 flex-grow">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <!-- Company name skeleton -->
                    <div class="h-8 bg-gray-300 rounded w-64 animate-pulse"></div>
                    <!-- City skeleton -->
                    <div class="h-4 bg-gray-300 rounded w-40 animate-pulse mt-2"></div>
                  </div>
                  <div class="mt-4 md:mt-0 flex items-center space-x-4">
                    <!-- Status skeleton -->
                    <div class="h-8 bg-gray-300 rounded-full w-32 animate-pulse"></div>
                    <!-- Button skeleton -->
                    <div class="h-10 bg-gray-300 rounded-md w-40 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid layout skeleton -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Cột trái: Thông tin cơ bản skeleton -->
          <div class="space-y-8">
            <!-- Giới thiệu công ty skeleton -->
            <div class="bg-white shadow-md rounded-lg p-6">
              <div class="h-6 bg-gray-300 rounded w-48 animate-pulse mb-4"></div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                <div class="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                <div class="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>

            <!-- Thông tin liên hệ skeleton -->
            <div class="bg-white shadow-md rounded-lg p-6">
              <div class="h-6 bg-gray-300 rounded w-48 animate-pulse mb-4"></div>
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="w-6 h-6 bg-gray-300 rounded-full animate-pulse mr-3"></div>
                  <div class="h-4 bg-gray-300 rounded w-64 animate-pulse"></div>
                </div>
                <div class="flex items-start">
                  <div class="w-6 h-6 bg-gray-300 rounded-full animate-pulse mr-3"></div>
                  <div class="h-4 bg-gray-300 rounded w-48 animate-pulse"></div>
                </div>
                <div class="flex items-start">
                  <div class="w-6 h-6 bg-gray-300 rounded-full animate-pulse mr-3"></div>
                  <div class="h-4 bg-gray-300 rounded w-72 animate-pulse"></div>
                </div>
                <div class="flex items-start">
                  <div class="w-6 h-6 bg-gray-300 rounded-full animate-pulse mr-3"></div>
                  <div class="h-4 bg-gray-300 rounded w-56 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cột phải: Thông tin doanh nghiệp skeleton -->
          <div class="space-y-8">
            <!-- Thông tin doanh nghiệp skeleton -->
            <div class="bg-white shadow-md rounded-lg p-6">
              <div class="h-6 bg-gray-300 rounded w-56 animate-pulse mb-4"></div>
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="w-6 h-6 bg-gray-300 rounded-full animate-pulse mr-3"></div>
                  <div class="h-4 bg-gray-300 rounded w-48 animate-pulse"></div>
                </div>
                <div class="flex items-start">
                  <div class="w-6 h-6 bg-gray-300 rounded-full animate-pulse mr-3"></div>
                  <div class="h-4 bg-gray-300 rounded w-40 animate-pulse"></div>
                </div>
                <div class="flex items-start">
                  <div class="w-6 h-6 bg-gray-300 rounded-full animate-pulse mr-3"></div>
                  <div class="h-4 bg-gray-300 rounded w-60 animate-pulse"></div>
                </div>
              </div>
            </div>

            <!-- Giấy phép kinh doanh skeleton -->
            <div class="bg-white shadow-md rounded-lg p-6">
              <div class="h-6 bg-gray-300 rounded w-56 animate-pulse mb-4"></div>
              <div class="h-48 bg-gray-300 rounded w-full animate-pulse"></div>
            </div>

            <!-- Thông tin thời gian skeleton -->
            <div class="bg-white shadow-md rounded-lg p-6">
              <div class="h-6 bg-gray-300 rounded w-56 animate-pulse mb-4"></div>
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="w-6 h-6 bg-gray-300 rounded-full animate-pulse mr-3"></div>
                  <div class="h-4 bg-gray-300 rounded w-48 animate-pulse"></div>
                </div>
                <div class="flex items-start">
                  <div class="w-6 h-6 bg-gray-300 rounded-full animate-pulse mr-3"></div>
                  <div class="h-4 bg-gray-300 rounded w-56 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="enterprise">
        <!-- Header card với banner và logo -->
        <div class="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div class="relative h-56 bg-black" v-memo="enterprise.background_image_url">
            <img 
              v-if="enterprise.background_image_url"
              :src="enterprise.background_image_url"
              class="w-full h-full object-cover"
              alt="Background"
            />
            <div v-else class="w-full h-full bg-gray-800"></div>
          </div>
          
          <div class="relative px-8 pb-6">
            <div class="flex flex-col md:flex-row">
              <div class="flex-shrink-0 -mt-20">
                <div class="w-32 h-32 rounded-lg border-4 border-white bg-white shadow-md overflow-hidden" v-memo="enterprise.logo_url">
                  <img 
                    v-if="enterprise.logo_url"
                    :src="enterprise.logo_url"
                    class="w-full h-full object-cover"
                    alt="Company logo"
                  />
                  <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                    <i class="fas fa-building text-gray-400 text-4xl"></i>
                  </div>
                </div>
              </div>
              <div class="mt-4 md:mt-4 md:ml-8 flex-grow">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div v-memo="[enterprise.company_name, enterprise.city]">
                    <h1 class="text-3xl font-bold text-gray-900">{{ enterprise.company_name }}</h1>
                    <p class="text-gray-600 mt-2 text-base">
                      {{ enterprise.city }}
                    </p>
                  </div>
                  <div class="mt-4 md:mt-0 flex items-center space-x-4">
                    <span 
                      :class="[
                        'inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium',
                        enterprise.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      ]"
                    >
                      {{ enterprise.is_active ? 'Đã xác thực' : 'Chờ xác thực' }}
                    </span>
                    <button 
                      @click="navigateToEdit"
                      class="inline-flex items-center px-5 py-2.5 border border-transparent rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Chỉnh sửa thông tin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid layout cho thông tin chi tiết -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Cột trái: Thông tin cơ bản -->
          <div class="space-y-8">
            <!-- Giới thiệu công ty -->
            <div class="bg-white shadow-md rounded-lg p-6" v-memo="enterprise.description">
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                Giới thiệu công ty
              </h2>
              <p class="text-gray-600 text-base">{{ enterprise.description }}</p>
            </div>

            <!-- Thông tin liên hệ -->
            <div class="bg-white shadow-md rounded-lg p-6" v-memo="[enterprise.email_company, enterprise.phone_number, enterprise.address, enterprise.link_web_site]">
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                Thông tin liên hệ
              </h2>
              <div class="space-y-4">
                <div class="flex items-start">
                  <i class="fas fa-envelope text-gray-400 mt-1 mr-3"></i>
                  <p class="text-gray-600 text-base">{{ enterprise.email_company }}</p>
                </div>
                <div class="flex items-start">
                  <i class="fas fa-phone text-gray-400 mt-1 mr-3"></i>
                  <p class="text-gray-600 text-base">{{ enterprise.phone_number }}</p>
                </div>
                <div class="flex items-start">
                  <i class="fas fa-map-marker-alt text-gray-400 mt-1 mr-3"></i>
                  <p class="text-gray-600 text-base">{{ enterprise.address }}</p>
                </div>
                <div v-if="enterprise.link_web_site" class="flex items-start">
                  <i class="fas fa-globe text-gray-400 mt-1 mr-3"></i>
                  <a :href="enterprise.link_web_site" target="_blank" class="text-blue-600 hover:underline text-base">
                    {{ enterprise.link_web_site }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Cột phải: Thông tin doanh nghiệp -->
          <div class="space-y-8" v-memo="[enterprise.tax, enterprise.scale, enterprise.field_of_activity]">
            <!-- Thông tin doanh nghiệp -->
            <div class="bg-white shadow-md rounded-lg p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                Thông tin doanh nghiệp
              </h2>
              <div class="space-y-4">
                <div class="flex items-start">
                  <i class="fas fa-id-card text-gray-400 mt-1 mr-3"></i>
                  <p class="text-gray-600 text-base">Mã số thuế: {{ enterprise.tax }}</p>
                </div>
                <div class="flex items-start">
                  <i class="fas fa-users text-gray-400 mt-1 mr-3"></i>
                  <p class="text-gray-600 text-base">Quy mô: {{ enterprise.scale }}</p>
                </div>
                <div class="flex items-start">
                  <i class="fas fa-industry text-gray-400 mt-1 mr-3"></i>
                  <p class="text-gray-600 text-base">Lĩnh vực: {{ getFieldName(enterprise.field_of_activity) }}</p>
                </div>
              </div>
            </div>

            <!-- Giấy phép kinh doanh -->
            <div class="bg-white shadow-md rounded-lg p-6" v-memo="enterprise.business_certificate_url">
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                Giấy phép kinh doanh
              </h2>
              <div v-if="enterprise.business_certificate_url" class="mt-4">
                <img 
                  :src="enterprise.business_certificate_url" 
                  alt="Giấy phép kinh doanh"
                  class="w-full rounded-lg shadow-sm border border-gray-200"
                />
              </div>
              <div v-else class="text-gray-500 text-center py-4">
                <i class="fas fa-file-alt text-4xl mb-2"></i>
                <p>Chưa có giấy phép kinh doanh</p>
              </div>
            </div>

            <!-- Thông tin thời gian -->
            <div class="bg-white shadow-md rounded-lg p-6" v-memo="[enterprise.created_at, enterprise.modified_at || enterprise.updated_at]">
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                Thông tin thời gian
              </h2>
              <div class="space-y-4">
                <div class="flex items-start">
                  <i class="fas fa-calendar-plus text-gray-400 mt-1 mr-3"></i>
                  <p class="text-gray-600 text-base">Tham gia: {{ formatDate(enterprise.created_at) }}</p>
                </div>
                <div class="flex items-start">
                  <i class="fas fa-calendar-check text-gray-400 mt-1 mr-3"></i>
                  <p class="text-gray-600 text-base">Cập nhật: {{ formatDate(enterprise.modified_at || enterprise.updated_at) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-else-if="error" class="bg-white shadow-md rounded-lg p-8">
        <div class="text-center">
          <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
          <p class="text-lg text-gray-800">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEnterpriseStore } from '../../stores/enterprise'

const router = useRouter()
const enterpriseStore = useEnterpriseStore()
const enterprise = ref(null)
const loading = ref(true)
const error = ref(null)

// Mapping cho field_of_activity
const fieldMapping = {
  'it': 'Công nghệ thông tin',
  'finance': 'Tài chính - Ngân hàng',
  'marketing': 'Marketing - Truyền thông',
  'education': 'Giáo dục',
  'healthcare': 'Y tế - Chăm sóc sức khỏe',
  'manufacturing': 'Sản xuất - Công nghiệp',
  'retail': 'Bán lẻ - Thương mại',
  'other': 'Khác'
}

const getFieldName = (field) => {
  return fieldMapping[field] || field
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const navigateToEdit = () => {
  router.push('/employer/company/edit')
}

onMounted(async () => {
  try {
    const result = await enterpriseStore.fetchUserEnterprise()
    if (result.success) {
      enterprise.value = result.data[0] // Lấy phần tử đầu tiên vì API trả về mảng
    } else if (result.notFound) {
      error.value = 'Không tìm thấy thông tin doanh nghiệp'
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Có lỗi xảy ra khi tải thông tin doanh nghiệp'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style> 