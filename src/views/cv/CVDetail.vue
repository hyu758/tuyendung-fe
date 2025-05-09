<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header with back button -->
      <div class="flex items-center mb-6">
        <button 
          @click="router.back()" 
          class="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          title="Quay lại"
        >
          <i class="fas fa-arrow-left text-gray-600"></i>
        </button>
        <h1 class="text-2xl font-bold text-gray-900">Chi tiết CV ứng viên</h1>
      </div>

      <div v-if="loading" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <div class="bg-white shadow rounded-lg p-6">
              <div class="h-8 bg-gray-200 rounded w-1/3 animate-pulse mb-6"></div>
              <div class="h-96 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div class="lg:col-span-1">
            <div class="bg-white shadow rounded-lg p-6 mb-6">
              <div class="h-6 bg-gray-200 rounded w-1/2 animate-pulse mb-4"></div>
              <div class="h-10 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div class="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            <div class="bg-white shadow rounded-lg p-6">
              <div class="h-6 bg-gray-200 rounded w-1/2 animate-pulse mb-4"></div>
              <div class="space-y-2">
                <div class="flex items-center">
                  <div class="h-10 w-10 bg-gray-200 rounded-full animate-pulse mr-3"></div>
                  <div>
                    <div class="h-4 bg-gray-200 rounded w-24 animate-pulse mb-1"></div>
                    <div class="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CV Details -->
      <div v-else-if="cv">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <div class="bg-white shadow rounded-lg p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold text-gray-900">CV của {{ cv.name }}</h2>
                <a 
                  :href="cv.cv_file_url" 
                  download 
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <i class="fas fa-download mr-2"></i>
                  Tải xuống
                </a>
              </div>
              
              <!-- PDF viewer -->
              <div class="border border-gray-200 rounded-lg overflow-hidden">
                <div v-if="cv.cv_file_url">
                  
                  <object
                    :data="cv.cv_file_url"
                    type="application/pdf"
                    class="w-full h-screen max-h-[750px]"
                  >
                    <div class="p-8 bg-gray-100 flex flex-col items-center justify-center h-[750px]">
                      <i class="fas fa-file-pdf text-6xl text-red-500 mb-4"></i>
                      <p class="text-center text-gray-700 mb-4">
                        Trình duyệt của bạn không hỗ trợ xem PDF trực tiếp
                      </p>
                      <div class="flex space-x-4">
                        <a 
                          :href="cv.cv_file_url" 
                          target="_blank"
                          rel="noopener noreferrer" 
                          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                          <i class="fas fa-external-link-alt mr-2"></i>
                          Mở trong tab mới
                        </a>
                      </div>
                    </div>
                  </object>
                </div>
                <div v-else class="w-full h-96 flex items-center justify-center bg-gray-100">
                  <div class="text-center">
                    <i class="fas fa-file-pdf text-5xl text-gray-400 mb-3"></i>
                    <p class="text-gray-600">Không tìm thấy file CV</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="lg:col-span-1">
            <!-- CV Status -->
            <div class="bg-white shadow rounded-lg p-6 mb-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                <i class="fas fa-clipboard-check mr-2 text-blue-500"></i>
                Trạng thái CV
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Cập nhật trạng thái
                  </label>
                  <div class="relative">
                    <select 
                      v-model="selectedStatus" 
                      class="block w-full appearance-none border border-gray-300 rounded-md py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="pending">Chưa xử lý</option>
                      <option value="not_viewed">Chưa xem</option>
                      <option value="approved">Đã tiếp nhận</option>
                      <option value="rejected">Đã từ chối</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <i class="fas fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                </div>
              
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea 
                    v-model="noteText" 
                    rows="4" 
                    class="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ghi chú về ứng viên này..."
                  ></textarea>
                </div>
                
                <div class="pt-2">
                  <button
                    @click="saveChanges"
                    class="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    :disabled="isSaving"
                  >
                    <span v-if="isSaving" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang lưu...
                    </span>
                    <span v-else>
                      <i class="fas fa-save mr-2"></i>
                      Lưu thay đổi
                    </span>
                  </button>
                </div>
              </div>
              
              <!-- Trạng thái hiện tại -->
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="flex items-center mb-2">
                  <span class="text-sm font-medium text-gray-500">Trạng thái hiện tại:</span>
                  <span 
                    class="ml-2 px-2.5 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(cv.status)"
                  >
                    {{ getStatusText(cv.status) }}
                  </span>
                </div>
                <div v-if="cv.note" class="mt-2">
                  <span class="text-sm font-medium text-gray-500">Ghi chú:</span>
                  <p class="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded">{{ cv.note }}</p>
                </div>
              </div>
            </div>
            
            <!-- Applicant Info -->
            <div class="bg-white shadow rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                <i class="fas fa-user mr-2 text-blue-500"></i>
                Thông tin ứng viên
              </h3>
              
              <div class="space-y-4">
                <div class="flex items-start">
                  <i class="fas fa-user text-gray-400 mt-1 mr-3 w-5"></i>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ cv.name }}</div>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <i class="fas fa-envelope text-gray-400 mt-1 mr-3 w-5"></i>
                  <div>
                    <div class="text-sm text-gray-900">{{ cv.email }}</div>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <i class="fas fa-phone text-gray-400 mt-1 mr-3 w-5"></i>
                  <div>
                    <div class="text-sm text-gray-900">{{ cv.phone_number }}</div>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <i class="fas fa-calendar text-gray-400 mt-1 mr-3 w-5"></i>
                  <div>
                    <div class="text-sm text-gray-900">Ngày ứng tuyển: {{ formatDate(cv.created_at) }}</div>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <i class="fas fa-briefcase text-gray-400 mt-1 mr-3 w-5"></i>
                  <div>
                    <div class="text-sm text-gray-900">{{ cv.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else class="bg-white shadow rounded-lg p-8 text-center">
        <i class="fas fa-exclamation-triangle text-5xl text-yellow-500 mb-4"></i>
        <h2 class="text-2xl font-medium text-gray-900 mb-2">Không tìm thấy thông tin CV</h2>
        <p class="text-gray-600 mb-6">CV không tồn tại hoặc đã bị xóa</p>
        <button
          @click="router.back()"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Quay lại
        </button>
      </div>
    </div>
    
    <!-- Thông báo cập nhật thành công -->
    <div 
      v-if="showSuccessAlert"
      class="fixed bottom-4 right-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-lg max-w-md transition-all duration-300 ease-in-out transform translate-y-0 opacity-100"
      :class="{ 'translate-y-10 opacity-0': hideSuccessAlert }"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-check-circle text-green-500"></i>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-green-800">
            {{ successMessage }}
          </p>
        </div>
        <div class="ml-auto pl-3">
          <div class="-mx-1.5 -my-1.5">
            <button 
              @click="closeSuccessAlert" 
              class="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <span class="sr-only">Đóng</span>
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCVStore } from '../../stores/cv'
import { useToast } from '../../composables/useToast'

const route = useRoute()
const router = useRouter()
const cvStore = useCVStore()
const { addToast } = useToast()

const loading = ref(true)
const selectedStatus = ref('pending')
const noteText = ref('')
const isSaving = ref(false)
const showSuccessAlert = ref(false)
const hideSuccessAlert = ref(false)
const successMessage = ref('')

const cv = computed(() => cvStore.currentCV)

// Định dạng ngày
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

// Lấy class CSS cho trạng thái
const getStatusClass = (status) => {
  switch(status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'not_viewed': return 'bg-gray-100 text-gray-800';
    case 'approved': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

// Lấy text cho trạng thái
const getStatusText = (status) => {
  switch(status) {
    case 'pending': return 'Chưa xử lý';
    case 'not_viewed': return 'Chưa xem';
    case 'approved': return 'Đã tiếp nhận';
    case 'rejected': return 'Đã từ chối';
    default: return 'Không xác định';
  }
}

// Hiển thị thông báo thành công
const showSuccess = (message) => {
  successMessage.value = message
  showSuccessAlert.value = true
  hideSuccessAlert.value = false
  
  // Tự động ẩn sau 5 giây
  setTimeout(() => {
    hideSuccessAlert.value = true
    setTimeout(() => {
      showSuccessAlert.value = false
    }, 300) // Chờ animation hoàn tất
  }, 5000)
}

// Đóng thông báo thành công
const closeSuccessAlert = () => {
  hideSuccessAlert.value = true
  setTimeout(() => {
    showSuccessAlert.value = false
  }, 300)
}

// Lưu thay đổi
const saveChanges = async () => {
  try {
    if (!cv.value) return
    isSaving.value = true
    
    // Cập nhật trạng thái
    if (cv.value.status !== selectedStatus.value || cv.value.note !== noteText.value) {
      const statusResult = await cvStore.updateCVStatus(cv.value.id, selectedStatus.value, noteText.value)
      
      if (statusResult.success) {
        // Hiển thị thông báo thành công
        showSuccess('Cập nhật trạng thái CV thành công')
        
        // Cập nhật dữ liệu hiển thị
        if (cv.value) {
          cv.value.status = selectedStatus.value
          cv.value.note = noteText.value
        }
      } else {
        addToast({
          type: 'error',
          message: statusResult.error || 'Không thể cập nhật trạng thái CV'
        })
      }
    } else {
      addToast({
        type: 'info',
        message: 'Không có thay đổi để lưu'
      })
    }
  } catch (error) {
    console.error('Error saving changes:', error)
    addToast({
      type: 'error',
      message: 'Đã xảy ra lỗi khi lưu thay đổi'
    })
  } finally {
    isSaving.value = false
  }
}

// Load data
const loadData = async () => {
  try {
    loading.value = true
    
    const cvId = route.params.id
    if (!cvId) {
      router.push('/404')
      return
    }
    
    // Lấy thông tin CV
    const result = await cvStore.fetchCVById(cvId)
    
    if (!result.success) {
      addToast({
        type: 'error',
        message: result.error || 'Không thể lấy thông tin CV'
      })
      return
    }
    
    // Cập nhật form
    selectedStatus.value = cv.value?.status || 'pending'
    noteText.value = cv.value?.note || ''
    
  } catch (error) {
    console.error('Error loading CV details:', error)
    addToast({
      type: 'error',
      message: 'Đã xảy ra lỗi khi tải thông tin CV'
    })
  } finally {
    loading.value = false
  }
}

// Watch for changes in the route
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      loadData()
    }
  }
)

// Mounted
onMounted(() => {
  loadData()
  cvStore.markCVAsViewed(route.params.id)
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