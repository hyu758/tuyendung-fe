<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Header with back button and actions -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center">
        <button @click="goBack" class="mr-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-bold text-gray-800">{{ campaign?.name || 'Chi tiết chiến dịch' }}</h1>
      </div>
      
      <div class="flex space-x-2">
        <button 
          @click="editCampaign" 
          class="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
        >
          <i class="fas fa-edit mr-1"></i> Chỉnh sửa
        </button>
        <button 
          @click="confirmDelete" 
          class="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
        >
          <i class="fas fa-trash-alt mr-1"></i> Xóa
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>

    <!-- Campaign details -->
    <div v-else-if="campaign" class="mb-10">
      <div class="bg-gray-50 p-6 rounded-lg mb-6">
        <div class="flex justify-between mb-4">
          <div>
            <span 
              class="inline-block px-3 py-1 text-sm font-medium rounded-full mb-2" 
              :class="campaign.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
            >
              {{ campaign.is_active ? 'Đang hoạt động' : 'Tạm dừng' }}
            </span>
            
            <div class="flex space-x-4 text-sm text-gray-600">
              <div>
                <i class="far fa-calendar-alt mr-1"></i> Tạo ngày: {{ formatDate(campaign.created_at) }}
              </div>
              <div>
                <i class="far fa-clock mr-1"></i> Cập nhật: {{ formatDate(campaign.updated_at) }}
              </div>
            </div>
          </div>
          
          <div class="flex items-center">
            <label class="inline-flex items-center cursor-pointer mr-2">
              <span class="mr-2 text-sm font-medium text-gray-700">{{ campaign.is_active ? 'Hoạt động' : 'Tạm dừng' }}</span>
              <div class="relative">
                <input type="checkbox" v-model="campaign.is_active" class="sr-only" @change="toggleStatus">
                <div class="w-11 h-6 bg-gray-200 rounded-full"></div>
                <div 
                  class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all transform"
                  :class="campaign.is_active ? 'translate-x-5 bg-blue-600' : ''"
                ></div>
              </div>
            </label>
          </div>
        </div>
        
        <div class="mt-4">
          <h2 class="text-lg font-semibold mb-2">Mô tả</h2>
          <p class="text-gray-700">{{ campaign.description || 'Không có mô tả cho chiến dịch này.' }}</p>
        </div>
      </div>
      
      <!-- Job listings section -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Danh sách tin tuyển dụng</h2>
          <button 
            @click="createJobListing" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <i class="fas fa-plus-circle mr-1"></i> Tạo tin tuyển dụng
          </button>
        </div>
        
        <!-- Empty state for job listings -->
        <div v-if="jobListings.length === 0" class="bg-gray-50 rounded-lg p-8 text-center">
          <div class="mb-4">
            <i class="fas fa-clipboard-list text-4xl text-gray-400"></i>
          </div>
          <h4 class="text-lg font-medium mb-2">Chưa có tin tuyển dụng</h4>
          <p class="text-gray-600 mb-4">Thêm tin tuyển dụng vào chiến dịch này để bắt đầu tiếp nhận ứng viên.</p>
          <button 
            @click="createJobListing" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <i class="fas fa-plus-circle mr-1"></i> Tạo tin tuyển dụng
          </button>
        </div>
        
        <!-- List of job listings -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="job in jobListings" 
            :key="job.id" 
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between">
              <h3 class="font-medium">{{ job.title }}</h3>
              <span 
                class="inline-block px-2 py-0.5 text-xs font-medium rounded-full" 
                :class="job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ job.status === 'active' ? 'Đang đăng' : 'Bản nháp' }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ job.location || 'Không có địa điểm' }}</p>
            <div class="flex justify-between items-center mt-3">
              <span class="text-sm text-gray-500">
                <i class="far fa-clock mr-1"></i> Hạn nộp: {{ formatDate(job.deadline) }}
              </span>
              <div class="flex space-x-1">
                <button class="p-1 text-blue-600 hover:text-blue-800" title="Xem chi tiết">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="p-1 text-green-600 hover:text-green-800" title="Chỉnh sửa">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="p-1 text-red-600 hover:text-red-800" title="Xóa">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg text-red-700 text-center">
      <p>{{ error }}</p>
      <button @click="loadCampaign" class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
        Thử lại
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCampaignStore } from '@/stores/campaign'

const route = useRoute()
const router = useRouter()
const campaignStore = useCampaignStore()

// State
const loading = ref(false)
const campaign = ref(null)
const error = ref(null)
const jobListings = ref([]) // Dummy data for job listings

// Load campaign data on component mount
onMounted(async () => {
  await loadCampaign()
})

const loadCampaign = async () => {
  const campaignId = route.params.id
  if (!campaignId) {
    router.push('/campaigns')
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    // Gọi API để lấy chi tiết chiến dịch
    const result = await campaignStore.fetchCampaignById(campaignId)
    if (result.success) {
      campaign.value = result.data
      
      // Dữ liệu mẫu cho tin tuyển dụng, sẽ được thay thế bằng API call sau
      jobListings.value = [
        {
          id: 1,
          title: 'Frontend Developer',
          location: 'Hà Nội',
          status: 'active',
          deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        },
        {
          id: 2,
          title: 'Backend Developer',
          location: 'Hồ Chí Minh',
          status: 'draft',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      ]
    } else {
      error.value = 'Không thể tải thông tin chiến dịch'
    }
  } catch (err) {
    console.error('Lỗi khi tải thông tin chiến dịch:', err)
    error.value = 'Có lỗi xảy ra khi tải thông tin chiến dịch'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const goBack = () => {
  router.push('/campaigns')
}

const editCampaign = () => {
  // Implement edit campaign logic
  console.log('Edit campaign:', campaign.value.id)
}

const confirmDelete = () => {
  // Implement delete confirmation
  console.log('Delete campaign:', campaign.value.id)
}

const toggleStatus = async () => {
  try {
    loading.value = true
    // Gọi API để cập nhật trạng thái chiến dịch
    const result = await campaignStore.updateCampaign(campaign.value.id, {
      is_active: campaign.value.is_active
    })
    
    if (!result.success) {
      // Nếu cập nhật thất bại, khôi phục trạng thái
      campaign.value.is_active = !campaign.value.is_active
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error)
    // Khôi phục trạng thái nếu có lỗi
    campaign.value.is_active = !campaign.value.is_active
  } finally {
    loading.value = false
  }
}

const createJobListing = () => {
  // Implement create job listing logic
  console.log('Create job listing for campaign:', campaign.value.id)
}
</script> 