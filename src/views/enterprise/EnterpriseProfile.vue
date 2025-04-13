<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <template v-if="loading">
        <!-- Skeleton loading -->
        <!-- Header card skeleton -->
        <div class="bg-white shadow-sm rounded-xl overflow-hidden mb-8 transition-all">
          <!-- Banner skeleton -->
          <div class="relative h-56 bg-gray-200 animate-pulse"></div>
          
          <div class="relative px-6 md:px-8 pb-6">
            <div class="flex flex-col md:flex-row">
              <!-- Logo skeleton -->
              <div class="flex-shrink-0 -mt-16 md:-mt-20">
                <div class="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-white bg-gray-200 animate-pulse shadow-sm"></div>
              </div>
              <div class="mt-4 md:mt-4 md:ml-8 flex-grow">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <!-- Company name skeleton -->
                    <div class="h-8 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
                    <!-- City skeleton -->
                    <div class="h-4 bg-gray-200 rounded-lg w-40 animate-pulse mt-2"></div>
                  </div>
                  <div class="mt-4 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <!-- Status skeleton -->
                    <div class="h-8 bg-gray-200 rounded-full w-32 animate-pulse"></div>
                    <!-- Button skeleton -->
                    <div class="h-10 bg-gray-200 rounded-lg w-full sm:w-40 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid layout skeleton -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <!-- Cột trái: Thông tin cơ bản skeleton -->
          <div class="space-y-6 md:space-y-8">
            <!-- Giới thiệu công ty skeleton -->
            <div class="bg-white shadow-sm rounded-xl p-6 transition-all hover:shadow-md">
              <div class="h-6 bg-gray-200 rounded-lg w-48 animate-pulse mb-4"></div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                <div class="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                <div class="h-4 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
              </div>
            </div>

            <!-- Thông tin liên hệ skeleton -->
            <div class="bg-white shadow-sm rounded-xl p-6 transition-all hover:shadow-md">
              <div class="h-6 bg-gray-200 rounded-lg w-48 animate-pulse mb-4"></div>
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse mr-3 flex-shrink-0"></div>
                  <div class="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                </div>
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse mr-3 flex-shrink-0"></div>
                  <div class="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                </div>
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse mr-3 flex-shrink-0"></div>
                  <div class="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                </div>
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse mr-3 flex-shrink-0"></div>
                  <div class="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cột phải: Thông tin doanh nghiệp skeleton -->
          <div class="space-y-6 md:space-y-8">
            <!-- Thông tin doanh nghiệp skeleton -->
            <div class="bg-white shadow-sm rounded-xl p-6 transition-all hover:shadow-md">
              <div class="h-6 bg-gray-200 rounded-lg w-56 animate-pulse mb-4"></div>
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse mr-3 flex-shrink-0"></div>
                  <div class="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                </div>
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse mr-3 flex-shrink-0"></div>
                  <div class="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                </div>
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse mr-3 flex-shrink-0"></div>
                  <div class="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                </div>
              </div>
            </div>

            <!-- Giấy phép kinh doanh skeleton -->
            <div class="bg-white shadow-sm rounded-xl p-6 transition-all hover:shadow-md">
              <div class="h-6 bg-gray-200 rounded-lg w-56 animate-pulse mb-4"></div>
              <div class="h-48 bg-gray-200 rounded-lg w-full animate-pulse"></div>
            </div>

            <!-- Thông tin thời gian skeleton -->
            <div class="bg-white shadow-sm rounded-xl p-6 transition-all hover:shadow-md">
              <div class="h-6 bg-gray-200 rounded-lg w-56 animate-pulse mb-4"></div>
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse mr-3 flex-shrink-0"></div>
                  <div class="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                </div>
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse mr-3 flex-shrink-0"></div>
                  <div class="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="enterprise">
        <!-- Header card với banner và logo -->
        <div class="bg-white shadow-sm rounded-xl overflow-hidden mb-8 transition-all hover:shadow-md">
          <div class="relative h-48 sm:h-56 md:h-64 bg-gradient-to-r from-blue-500 to-indigo-600" v-memo="enterprise.background_image_url">
            <img 
              v-if="enterprise.background_image_url"
              :src="enterprise.background_image_url"
              class="w-full h-full object-cover"
              alt="Background"
            />
            <div v-else class="absolute inset-0 bg-pattern opacity-10"></div>
            
            <!-- Overlay gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
          
          <div class="relative px-6 md:px-8 pb-6">
            <div class="flex flex-col md:flex-row">
              <div class="flex-shrink-0 -mt-16 md:-mt-20">
                <div class="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-white bg-white shadow-md overflow-hidden" v-memo="enterprise.logo_url">
                  <img 
                    v-if="enterprise.logo_url"
                    :src="enterprise.logo_url"
                    class="w-full h-full object-contain"
                    alt="Company logo"
                  />
                  <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                    <i class="fas fa-building text-gray-400 text-4xl"></i>
                  </div>
                </div>
              </div>
              <div class="mt-4 md:mt-4 md:ml-8 flex-grow">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div v-memo="[enterprise.company_name, enterprise.city]">
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900">{{ enterprise.company_name }}</h1>
                    <p class="text-gray-600 mt-2 flex items-center">
                      <i class="fas fa-map-marker-alt text-red-500 mr-2"></i>
                      {{ enterprise.city || 'Chưa cập nhật địa điểm' }}
                    </p>
                  </div>
                  <div class="mt-4 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <span 
                      :class="[
                        'inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium',
                        enterprise.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      ]"
                    >
                      <i :class="['fas mr-1.5', enterprise.is_active ? 'fa-check-circle' : 'fa-clock']"></i>
                      {{ enterprise.is_active ? 'Đã xác thực' : 'Chờ xác thực' }}
                    </span>
                    <button 
                      @click="navigateToEdit"
                      class="inline-flex items-center justify-center w-full sm:w-auto px-5 py-2.5 border border-transparent rounded-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <i class="fas fa-edit mr-2"></i>
                      Chỉnh sửa thông tin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid layout cho thông tin chi tiết -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <!-- Cột trái: Thông tin cơ bản -->
          <div class="space-y-6 md:space-y-8">
            <!-- Giới thiệu công ty -->
            <div class="bg-white shadow-sm rounded-xl p-6 transition-all hover:shadow-md" v-memo="enterprise.description">
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <i class="fas fa-info-circle text-blue-500 mr-2"></i>
                Giới thiệu công ty
              </h2>
              <p v-if="enterprise.description" class="text-gray-700 leading-relaxed">
                {{ enterprise.description }}
              </p>
              <p v-else class="text-gray-500 italic">
                Chưa có thông tin giới thiệu về công ty
              </p>
            </div>

            <!-- Thông tin liên hệ -->
            <div class="bg-white shadow-sm rounded-xl p-6 transition-all hover:shadow-md" v-memo="[enterprise.email_company, enterprise.phone_number, enterprise.address, enterprise.link_web_site]">
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <i class="fas fa-address-card text-blue-500 mr-2"></i>
                Thông tin liên hệ
              </h2>
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-envelope text-blue-500"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm text-gray-500">Email</p>
                    <p class="text-gray-700">{{ enterprise.email_company || 'Chưa cập nhật' }}</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-phone text-green-500"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm text-gray-500">Số điện thoại</p>
                    <p class="text-gray-700">{{ enterprise.phone_number || 'Chưa cập nhật' }}</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-map-marker-alt text-red-500"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm text-gray-500">Địa chỉ</p>
                    <p class="text-gray-700">{{ enterprise.address || 'Chưa cập nhật' }}</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-globe text-purple-500"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm text-gray-500">Website</p>
                    <a 
                      v-if="enterprise.link_web_site" 
                      :href="enterprise.link_web_site" 
                      target="_blank" 
                      class="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      {{ enterprise.link_web_site }}
                    </a>
                    <p v-else class="text-gray-700">Chưa cập nhật</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cột phải: Thông tin doanh nghiệp -->
          <div class="space-y-6 md:space-y-8" v-memo="[enterprise.tax, enterprise.scale, enterprise.field_of_activity]">
            <!-- Thông tin doanh nghiệp -->
            <div class="bg-white shadow-sm rounded-xl p-6 transition-all hover:shadow-md">
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <i class="fas fa-building text-blue-500 mr-2"></i>
                Thông tin doanh nghiệp
              </h2>
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-id-card text-yellow-500"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm text-gray-500">Mã số thuế</p>
                    <p class="text-gray-700">{{ enterprise.tax || 'Chưa cập nhật' }}</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-users text-indigo-500"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm text-gray-500">Quy mô công ty</p>
                    <p class="text-gray-700">{{ enterprise.scale || 'Chưa cập nhật' }}</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-industry text-teal-500"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm text-gray-500">Lĩnh vực hoạt động</p>
                    <p class="text-gray-700">{{ getFieldName(enterprise.field_of_activity) || 'Chưa cập nhật' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Giấy phép kinh doanh -->
            <div class="bg-white shadow-sm rounded-xl p-6 transition-all hover:shadow-md" v-memo="enterprise.business_certificate_url">
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <i class="fas fa-certificate text-blue-500 mr-2"></i>
                Giấy phép kinh doanh
              </h2>
              <div v-if="enterprise.business_certificate_url" class="mt-4">
                <img 
                  :src="enterprise.business_certificate_url" 
                  alt="Giấy phép kinh doanh"
                  class="w-full rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md"
                />
              </div>
              <div v-else class="bg-gray-50 rounded-lg p-8 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                  <i class="fas fa-file-alt text-gray-400 text-2xl"></i>
                </div>
                <p class="mt-4 text-gray-500">Chưa có giấy phép kinh doanh</p>
              </div>
            </div>

            <!-- Thông tin thời gian -->
            <div class="bg-white shadow-sm rounded-xl p-6 transition-all hover:shadow-md" v-memo="[enterprise.created_at, enterprise.modified_at || enterprise.updated_at]">
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <i class="fas fa-clock text-blue-500 mr-2"></i>
                Thông tin thời gian
              </h2>
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-calendar-plus text-blue-500"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm text-gray-500">Ngày tham gia</p>
                    <p class="text-gray-700">{{ formatDate(enterprise.created_at) }}</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-calendar-check text-green-500"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm text-gray-500">Cập nhật gần nhất</p>
                    <p class="text-gray-700">{{ formatDate(enterprise.modified_at || enterprise.updated_at) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-else-if="error" class="bg-white shadow-sm rounded-xl p-8 transition-all hover:shadow-md">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <i class="fas fa-exclamation-circle text-3xl text-red-500"></i>
          </div>
          <h3 class="mt-4 text-xl font-medium text-gray-900">Lỗi</h3>
          <p class="mt-2 text-gray-600">{{ error }}</p>
          <button 
            @click="retryFetchData" 
            class="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all inline-flex items-center"
          >
            <i class="fas fa-redo-alt mr-2"></i>
            Thử lại
          </button>
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
  if (!dateString) return 'Chưa xác định'
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

const fetchEnterpriseData = async () => {
  loading.value = true
  error.value = null
  
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
}

const retryFetchData = () => {
  fetchEnterpriseData()
}

onMounted(() => {
  fetchEnterpriseData()
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

.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style> 