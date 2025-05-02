<template>
  <div class="my-criteria-page">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Tiêu chí tìm việc của tôi</h1>
          <p class="text-gray-600 mt-1">Thiết lập các tiêu chí để nhận được gợi ý việc làm phù hợp hơn</p>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-exclamation-circle text-red-500"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ errorMessage }}</p>
            <button 
              @click="fetchCriteria" 
              class="mt-2 text-sm font-medium text-red-700 hover:text-red-600 underline"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>

      <!-- Content based on state -->
      <div v-else>
        <!-- Đã có tiêu chí -->
        <div v-if="hasCriteria && !isEditing" class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6">
            <div class="flex justify-between items-start">
              <h2 class="text-xl font-semibold text-gray-900">Thông tin tiêu chí</h2>
              <div class="flex space-x-2">
                <button 
                  @click="startEditing" 
                  class="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center"
                >
                  <i class="fas fa-edit mr-1.5"></i>
                  Chỉnh sửa
                </button>
                <button 
                  @click="confirmDelete" 
                  class="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 flex items-center"
                >
                  <i class="fas fa-trash-alt mr-1.5"></i>
                  Xóa
                </button>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <!-- Thành phố -->
              <div class="criteria-item">
                <h3 class="text-sm font-medium text-gray-500">Thành phố</h3>
                <p class="mt-1 text-base text-gray-900">{{ criteria.city || 'Chưa thiết lập' }}</p>
              </div>

              <!-- Kinh nghiệm -->
              <div class="criteria-item">
                <h3 class="text-sm font-medium text-gray-500">Kinh nghiệm</h3>
                <p class="mt-1 text-base text-gray-900">{{ criteria.experience || 'Chưa thiết lập' }}</p>
              </div>

              <!-- Lĩnh vực -->
              <div class="criteria-item">
                <h3 class="text-sm font-medium text-gray-500">Lĩnh vực</h3>
                <p class="mt-1 text-base text-gray-900">{{ criteria.field?.name || 'Chưa thiết lập' }}</p>
              </div>

              <!-- Vị trí -->
              <div class="criteria-item">
                <h3 class="text-sm font-medium text-gray-500">Vị trí</h3>
                <p class="mt-1 text-base text-gray-900">{{ criteria.position?.name || 'Chưa thiết lập' }}</p>
              </div>

              <!-- Quy mô công ty -->
              <div class="criteria-item">
                <h3 class="text-sm font-medium text-gray-500">Quy mô công ty</h3>
                <p class="mt-1 text-base text-gray-900">{{ criteria.scales || 'Chưa thiết lập' }}</p>
              </div>

              <!-- Hình thức làm việc -->
              <div class="criteria-item">
                <h3 class="text-sm font-medium text-gray-500">Hình thức làm việc</h3>
                <p class="mt-1 text-base text-gray-900">{{ criteria.type_working || 'Chưa thiết lập' }}</p>
              </div>

              <!-- Mức lương tối thiểu -->
              <div class="criteria-item col-span-full">
                <h3 class="text-sm font-medium text-gray-500">Mức lương tối thiểu</h3>
                <p class="mt-1 text-base text-gray-900">{{ formatSalary(criteria.salary_min) }}</p>
              </div>
            </div>

            <!-- Suggested jobs based on criteria -->
            <div class="mt-8 border-t border-gray-200 pt-6">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900">Việc làm phù hợp</h3>
                <router-link 
                  to="/job-recommendations" 
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Xem tất cả
                  <i class="fas fa-arrow-right ml-1"></i>
                </router-link>
              </div>
              <p class="text-sm text-gray-600 mt-1">Dựa trên tiêu chí tìm việc của bạn</p>
              
              <button 
                @click="navigateToRecommendations"
                class="mt-4 w-full py-2 px-4 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i class="fas fa-list-ul mr-2"></i>
                Xem việc làm gợi ý
              </button>
            </div>
          </div>
        </div>

        <!-- Chưa có tiêu chí -->
        <div v-if="!hasCriteria && !isEditing" class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6">
            <div class="text-center">
              <div class="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-4">
                <i class="fas fa-search text-3xl"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-900">Chưa có tiêu chí tìm việc</h3>
              <p class="mt-1 text-gray-500">
                Thiết lập tiêu chí để nhận được gợi ý việc làm phù hợp hơn với mong muốn của bạn
              </p>
              <button 
                @click="startEditing" 
                class="mt-6 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i class="fas fa-plus-circle mr-2"></i>
                Tạo tiêu chí mới
              </button>
            </div>
          </div>
        </div>

        <!-- Form chỉnh sửa hoặc tạo mới -->
        <div v-if="isEditing" class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6">
            <div class="mb-6">
              <h2 class="text-xl font-semibold text-gray-900">
                {{ hasCriteria ? 'Cập nhật tiêu chí' : 'Tạo tiêu chí mới' }}
              </h2>
              <p class="text-gray-600 text-sm mt-1">
                {{ hasCriteria ? 'Chỉnh sửa thông tin tiêu chí tìm việc của bạn' : 'Thiết lập tiêu chí tìm việc để nhận gợi ý phù hợp hơn' }}
              </p>
            </div>
            
            <CriteriaForm 
              :existing-criteria="criteria" 
              @created="handleCriteriaCreated" 
              @updated="handleCriteriaUpdated" 
              @reset="cancelEditing"
            />
          </div>
        </div>
      </div>

      <!-- Confirm Delete Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Xác nhận xóa</h3>
          <p class="text-gray-600">Bạn có chắc chắn muốn xóa tiêu chí tìm việc này không? Hành động này không thể hoàn tác.</p>
          <div class="mt-4 flex justify-end space-x-3">
            <button 
              @click="showDeleteModal = false" 
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button 
              @click="deleteCriteria" 
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              :disabled="isDeleting"
            >
              <span v-if="isDeleting" class="flex items-center">
                <span class="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                Đang xóa...
              </span>
              <span v-else>Xóa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import CriteriaForm from '../../components/candidate/CriteriaForm.vue'
import axios from 'axios'

const router = useRouter()
const toast = useToast()

// State
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')
const criteria = ref(null)
const isEditing = ref(false)
const showDeleteModal = ref(false)
const isDeleting = ref(false)

// Computed
const hasCriteria = computed(() => !!criteria.value)

// Format salary
const formatSalary = (salary) => {
  if (!salary) return 'Chưa thiết lập';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(salary);
}

// Fetch criteria
const fetchCriteria = async () => {
  loading.value = true
  error.value = false
  
  try {
    const response = await axios.get('/api/criteria/')
    if (response.data.status === 200) {
      const criteriaData = response.data.data
      
      // Nếu có field ID, lấy thông tin tên field
      if (criteriaData.field && typeof criteriaData.field === 'number') {
        try {
          const fieldResponse = await axios.get(`/api/fields/${criteriaData.field}/`)
          criteriaData.field = {
            id: criteriaData.field,
            name: fieldResponse.data.name || 'Không xác định'
          }
        } catch (err) {
          console.error('Lỗi khi lấy thông tin lĩnh vực:', err)
          criteriaData.field = {
            id: criteriaData.field,
            name: 'Không thể tải thông tin'
          }
        }
      }
      
      // Nếu có position ID, lấy thông tin tên position
      if (criteriaData.position && typeof criteriaData.position === 'number') {
        try {
          const positionResponse = await axios.get(`/api/position/${criteriaData.position}/`)
          criteriaData.position = {
            id: criteriaData.position,
            name: positionResponse.data.name || 'Không xác định'
          }
        } catch (err) {
          console.error('Lỗi khi lấy thông tin vị trí:', err)
          criteriaData.position = {
            id: criteriaData.position,
            name: 'Không thể tải thông tin'
          }
        }
      }
      
      criteria.value = criteriaData
    }
  } catch (err) {
    console.error('Lỗi khi lấy thông tin tiêu chí:', err)
    
    // Check for 404 (no criteria yet) - this is not an error
    if (err.response?.status === 404) {
      criteria.value = null
    } else {
      error.value = true
      errorMessage.value = 'Không thể lấy thông tin tiêu chí. Vui lòng thử lại sau.'
    }
  } finally {
    loading.value = false
  }
}

// Start editing
const startEditing = () => {
  isEditing.value = true
}

// Cancel editing
const cancelEditing = () => {
  isEditing.value = false
}

// Confirm delete
const confirmDelete = () => {
  showDeleteModal.value = true
}

// Delete criteria
const deleteCriteria = async () => {
  isDeleting.value = true
  
  try {
    const response = await axios.delete('/api/criteria/delete/')
    toast.success('Xóa tiêu chí tìm việc thành công')
    criteria.value = null
    showDeleteModal.value = false
  } catch (err) {
    console.error('Lỗi khi xóa tiêu chí:', err)
    toast.error('Không thể xóa tiêu chí. Vui lòng thử lại sau.')
  } finally {
    isDeleting.value = false
  }
}

// Handle criteria created
const handleCriteriaCreated = async (newCriteria) => {
  // Xử lý field và position tương tự như trong fetchCriteria
  if (newCriteria.field && typeof newCriteria.field === 'number') {
    try {
      const fieldResponse = await axios.get(`/api/fields/${newCriteria.field}/`)
      newCriteria.field = {
        id: newCriteria.field,
        name: fieldResponse.data.name || 'Không xác định'
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin lĩnh vực:', err)
      newCriteria.field = {
        id: newCriteria.field,
        name: 'Không thể tải thông tin'
      }
    }
  }
  
  if (newCriteria.position && typeof newCriteria.position === 'number') {
    try {
      const positionResponse = await axios.get(`/api/position/${newCriteria.position}/`)
      newCriteria.position = {
        id: newCriteria.position,
        name: positionResponse.data.name || 'Không xác định'
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin vị trí:', err)
      newCriteria.position = {
        id: newCriteria.position,
        name: 'Không thể tải thông tin'
      }
    }
  }
  
  criteria.value = newCriteria
  isEditing.value = false
  toast.success('Tạo tiêu chí tìm việc thành công')
}

// Handle criteria updated
const handleCriteriaUpdated = async (updatedCriteria) => {
  // Xử lý field và position tương tự như trong fetchCriteria
  if (updatedCriteria.field && typeof updatedCriteria.field === 'number') {
    try {
      const fieldResponse = await axios.get(`/api/fields/${updatedCriteria.field}/`)
      updatedCriteria.field = {
        id: updatedCriteria.field,
        name: fieldResponse.data.name || 'Không xác định'
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin lĩnh vực:', err)
      updatedCriteria.field = {
        id: updatedCriteria.field,
        name: 'Không thể tải thông tin'
      }
    }
  }
  
  if (updatedCriteria.position && typeof updatedCriteria.position === 'number') {
    try {
      const positionResponse = await axios.get(`/api/position/${updatedCriteria.position}/`)
      updatedCriteria.position = {
        id: updatedCriteria.position,
        name: positionResponse.data.name || 'Không xác định'
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin vị trí:', err)
      updatedCriteria.position = {
        id: updatedCriteria.position,
        name: 'Không thể tải thông tin'
      }
    }
  }
  
  criteria.value = updatedCriteria
  isEditing.value = false
  toast.success('Cập nhật tiêu chí tìm việc thành công')
}

// Navigate to recommendations
const navigateToRecommendations = () => {
  router.push('/job-recommendations')
}

// Lifecycle
onMounted(() => {
  fetchCriteria()
})
</script>

<style scoped>
.criteria-item {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}
</style> 