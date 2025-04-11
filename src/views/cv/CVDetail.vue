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

      <!-- Loading skeleton -->
      <div v-if="loading" class="space-y-6">
        <!-- CV Skeleton -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left column - CV preview skeleton -->
          <div class="lg:col-span-2">
            <div class="bg-white shadow rounded-lg p-6">
              <div class="h-8 bg-gray-200 rounded w-1/3 animate-pulse mb-6"></div>
              <div class="h-96 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          
          <!-- Right column - Assessment skeleton -->
          <div class="lg:col-span-1">
            <div class="bg-white shadow rounded-lg p-6 mb-6">
              <div class="h-6 bg-gray-200 rounded w-1/2 animate-pulse mb-4"></div>
              <div class="space-y-3">
                <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            
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
          <!-- Left column - CV preview -->
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
              
              <!-- Embedded PDF viewer -->
              <div class="border border-gray-200 rounded-lg h-screen max-h-[800px] overflow-hidden">
                <iframe 
                  v-if="cv.cv_file_url"
                  :src="cv.cv_file_url" 
                  class="w-full h-full"
                  title="CV Preview"
                ></iframe>
                <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
                  <div class="text-center">
                    <i class="fas fa-file-pdf text-5xl text-gray-400 mb-3"></i>
                    <p class="text-gray-600">Không thể hiển thị CV</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right column - Assessment and notes -->
          <div class="lg:col-span-1">
            <!-- Mark Assessment -->
            <div class="bg-white shadow rounded-lg p-6 mb-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Đánh giá CV</h3>
              
              <div class="space-y-3">
                <button 
                  @click="handleMarkCV('interested')"
                  class="w-full flex items-center justify-center px-4 py-2 border rounded-md font-medium transition-colors"
                  :class="[
                    getLastMarkType() === 'interested' 
                      ? 'border-green-500 text-green-700 bg-green-50' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <i class="fas fa-thumbs-up mr-2"></i>
                  Quan tâm
                </button>
                
                <button
                  @click="handleMarkCV('shortlisted')"
                  class="w-full flex items-center justify-center px-4 py-2 border rounded-md font-medium transition-colors"
                  :class="[
                    getLastMarkType() === 'shortlisted'
                      ? 'border-blue-500 text-blue-700 bg-blue-50'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <i class="fas fa-clipboard-check mr-2"></i>
                  Vào danh sách ngắn
                </button>
                
                <button
                  @click="handleMarkCV('rejected')"
                  class="w-full flex items-center justify-center px-4 py-2 border rounded-md font-medium transition-colors"
                  :class="[
                    getLastMarkType() === 'rejected'
                      ? 'border-red-500 text-red-700 bg-red-50'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <i class="fas fa-times-circle mr-2"></i>
                  Từ chối
                </button>
              </div>
            </div>
            
            <!-- CV Status -->
            <div class="bg-white shadow rounded-lg p-6 mb-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Trạng thái CV</h3>
              
              <div class="mb-4">
                <select 
                  v-model="selectedStatus" 
                  class="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Chưa xử lý</option>
                  <option value="approved">Đã tiếp nhận</option>
                  <option value="rejected">Đã từ chối</option>
                </select>
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea 
                  v-model="noteText" 
                  rows="4" 
                  class="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ghi chú về ứng viên này..."
                ></textarea>
              </div>
              
              <button
                @click="saveChanges"
                class="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <i class="fas fa-save mr-2"></i>
                Lưu thay đổi
              </button>
            </div>
            
            <!-- Applicant Info -->
            <div class="bg-white shadow rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Thông tin ứng viên</h3>
              
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

// State
const loading = ref(true)
const selectedStatus = ref('pending')
const noteText = ref('')

// Computed
const cv = computed(() => cvStore.currentCV)
const cvMarks = computed(() => cvStore.cvMarks)

// Methods
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

// Lấy đánh giá mới nhất
const getLastMarkType = () => {
  if (cvMarks.value && cvMarks.value.length > 0) {
    return cvMarks.value[0].mark_type
  }
  return null
}

// Xử lý đánh dấu CV
const handleMarkCV = async (markType) => {
  try {
    if (!cv.value) return
    
    const result = await cvStore.markCV(cv.value.id, markType)
    
    if (result.success) {
      const markTexts = {
        'interested': 'quan tâm',
        'shortlisted': 'vào danh sách ngắn',
        'rejected': 'từ chối'
      }
      
      addToast({
        type: 'success',
        message: `Đã đánh dấu CV là "${markTexts[markType] || markType}"`
      })
    } else {
      addToast({
        type: 'error',
        message: result.error || 'Không thể đánh dấu CV'
      })
    }
  } catch (error) {
    console.error('Error marking CV:', error)
    addToast({
      type: 'error',
      message: 'Đã xảy ra lỗi khi đánh dấu CV'
    })
  }
}

// Lưu thay đổi
const saveChanges = async () => {
  try {
    if (!cv.value) return
    
    // Cập nhật trạng thái
    if (cv.value.status !== selectedStatus.value) {
      const statusResult = await cvStore.updateCVStatus(cv.value.id, selectedStatus.value)
      
      if (!statusResult.success) {
        addToast({
          type: 'error',
          message: statusResult.error || 'Không thể cập nhật trạng thái CV'
        })
        return
      }
    }
    
    // Cập nhật ghi chú
    if (cv.value.note !== noteText.value) {
      const noteResult = await cvStore.updateCVNote(cv.value.id, noteText.value)
      
      if (!noteResult.success) {
        addToast({
          type: 'error',
          message: noteResult.error || 'Không thể cập nhật ghi chú CV'
        })
        return
      }
    }
    
    addToast({
      type: 'success',
      message: 'Đã lưu thay đổi'
    })
  } catch (error) {
    console.error('Error saving changes:', error)
    addToast({
      type: 'error',
      message: 'Đã xảy ra lỗi khi lưu thay đổi'
    })
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
    
    // Lấy lịch sử đánh dấu CV
    await cvStore.fetchCVMarks(cvId)
    
    // Đánh dấu CV đã xem
    await cvStore.markCVAsViewed(cvId)
    
    // Cập nhật form
    selectedStatus.value = cv.value.status
    noteText.value = cv.value.note || ''
    
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