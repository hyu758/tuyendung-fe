<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>

      <template v-else-if="enterprise">
        <!-- Header card với banner và logo -->
        <div class="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div class="relative h-56 bg-black">
            <img 
              v-if="enterprise.background_image"
              :src="enterprise.background_image"
              class="w-full h-full object-cover"
              alt="Background"
            />
          </div>
          
          <div class="relative px-8 pb-6">
            <div class="flex flex-col md:flex-row">
              <div class="flex-shrink-0 -mt-20">
                <img 
                  :src="enterprise.logo || '/placeholder-logo.png'"
                  class="w-32 h-32 rounded-lg border-4 border-white bg-white object-cover shadow-md"
                  alt="Company logo"
                />
              </div>
              <div class="mt-4 md:mt-4 md:ml-8 flex-grow">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 class="text-3xl font-bold text-gray-900">{{ enterprise.company_name }}</h1>
                    <p class="text-gray-600 mt-2 text-base">
                      {{ enterprise.city }}
                    </p>
                  </div>
                  <div class="mt-4 md:mt-0 flex items-center space-x-4">
                    <span class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      Chờ xác thực
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Thông tin liên hệ -->
          <div>
            <div class="bg-white shadow-md rounded-lg p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                Thông tin liên hệ
              </h2>
              <div class="space-y-4">
                <div>
                  <p class="text-gray-600 text-base">{{ enterprise.email_company }}</p>
                </div>
                <div>
                  <p class="text-gray-600 text-base">{{ enterprise.phone_number }}</p>
                </div>
                <div>
                  <p class="text-gray-600 text-base">{{ enterprise.address }}</p>
                </div>
                <div v-if="enterprise.link_web_site">
                  <a :href="enterprise.link_web_site" target="_blank" class="text-blue-600 hover:underline text-base">
                    {{ enterprise.link_web_site }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Thông tin doanh nghiệp -->
          <div>
            <div class="bg-white shadow-md rounded-lg p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                Thông tin doanh nghiệp
              </h2>
              <div class="space-y-4">
                <div>
                  <p class="text-gray-600 text-base">Mã số thuế: {{ enterprise.tax }}</p>
                </div>
                <div>
                  <p class="text-gray-600 text-base">GPKD: {{ enterprise.business_certificate }}</p>
                </div>
                <div>
                  <p class="text-gray-600 text-base">Quy mô: {{ enterprise.scale }}</p>
                </div>
                <div>
                  <p class="text-gray-600 text-base">Lĩnh vực: {{ getFieldName(enterprise.field_of_activity) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Giới thiệu và thông tin thời gian -->
          <div class="space-y-8">
            <div class="bg-white shadow-md rounded-lg p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                Giới thiệu công ty
              </h2>
              <p class="text-gray-600 text-base">{{ enterprise.description }}</p>
            </div>

            <div class="bg-white shadow-md rounded-lg p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                Thông tin thời gian
              </h2>
              <div class="space-y-4">
                <div>
                  <p class="text-gray-600 text-base">Tham gia: {{ formatDate(enterprise.created_at) }}</p>
                </div>
                <div>
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