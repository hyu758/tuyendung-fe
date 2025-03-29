<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Quản lý chiến dịch tuyển dụng</h1>
      <button @click="openCreateModal" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
        <span class="mr-1"><i class="fas fa-plus-circle"></i></span> Tạo chiến dịch mới
      </button>
    </div>

    <div class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div class="md:col-span-6">
          <div class="relative">
            <input 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Tìm kiếm theo tên chiến dịch..." 
              v-model="searchTerm"
              @input="debouncedSearch"
            >
            <button class="absolute right-0 top-0 h-full px-3 text-gray-500" type="button">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        
        <div class="md:col-span-3">
          <select class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="filterStatus" @change="loadCampaigns">
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Đã tạm dừng</option>
          </select>
        </div>
        
        <div class="md:col-span-3">
          <select class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="sortOption" @change="loadCampaigns">
            <option value="created_at,desc">Mới nhất</option>
            <option value="created_at,asc">Cũ nhất</option>
            <option value="name,asc">Tên (A-Z)</option>
            <option value="name,desc">Tên (Z-A)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading spinner -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!campaignStore.hasCampaigns" class="bg-gray-50 rounded-lg py-12 px-6 text-center">
      <div class="mb-4">
        <i class="fas fa-clipboard-list text-5xl text-gray-400"></i>
      </div>
      <h4 class="text-xl font-semibold mb-2">Chưa có chiến dịch tuyển dụng nào</h4>
      <p class="text-gray-600 mb-6">Bạn chưa tạo chiến dịch tuyển dụng nào. Hãy tạo chiến dịch đầu tiên để bắt đầu quá trình tuyển dụng.</p>
      <button @click="openCreateModal" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center mx-auto">
        <span class="mr-1"><i class="fas fa-plus-circle"></i></span> Tạo chiến dịch mới
      </button>
    </div>

    <!-- Campaign list -->
    <div v-else class="space-y-4">
      <div class="campaign-card bg-white border border-gray-200 rounded-lg shadow-sm" v-for="campaign in campaignStore.campaigns" :key="campaign.id">
        <div class="p-5">
          <div class="flex justify-between items-start">
            <div>
              <h5 class="text-lg font-semibold mb-1">{{ campaign.name }}</h5>
              <p class="text-sm text-gray-500 mb-2">
                <i class="far fa-calendar-alt mr-1"></i> Tạo ngày: {{ formatDate(campaign.created_at) }}
              </p>
              <p class="text-gray-700 mb-2 line-clamp-2 max-w-2xl">
                {{ campaign.description || 'Không có mô tả' }}
              </p>
              <span 
                class="inline-block px-2 py-1 text-xs font-medium rounded-full" 
                :class="campaign.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ campaign.is_active ? 'Đang hoạt động' : 'Tạm dừng' }}
              </span>
            </div>
            
            <div class="flex space-x-2">
              <button @click="viewCampaignDetail(campaign.id)" class="p-2 text-blue-600 rounded-full action-btn" title="Xem chi tiết">
                <i class="fas fa-eye"></i>
              </button>
              <button @click="editCampaign(campaign)" class="p-2 text-green-600 rounded-full action-btn" title="Chỉnh sửa">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="confirmDelete(campaign)" class="p-2 text-red-600 rounded-full action-btn" title="Xóa">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-6">
        <nav v-if="totalPages > 1">
          <ul class="flex space-x-1">
            <li>
              <button 
                @click.prevent="changePage(currentPage - 1)" 
                :disabled="currentPage === 1"
                class="px-3 py-1 rounded-md border" 
                :class="currentPage === 1 ? 'cursor-not-allowed text-gray-400 border-gray-200' : 'text-blue-600 border-blue-300 hover:bg-blue-50'"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
            </li>
            
            <li v-for="page in displayedPages" :key="page">
              <button 
                @click.prevent="changePage(page)" 
                class="px-3 py-1 rounded-md border" 
                :class="currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 border-gray-300 hover:bg-gray-50'"
              >
                {{ page }}
              </button>
            </li>
            
            <li>
              <button 
                @click.prevent="changePage(currentPage + 1)" 
                :disabled="currentPage === totalPages"
                class="px-3 py-1 rounded-md border" 
                :class="currentPage === totalPages ? 'cursor-not-allowed text-gray-400 border-gray-200' : 'text-blue-600 border-blue-300 hover:bg-blue-50'"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Modal tạo/chỉnh sửa chiến dịch -->
    <BaseModal
      v-model:show="showCreateModal"
      title="Tạo chiến dịch mới"
      @submit="saveCampaign"
    >
      <template #body>
        <form @submit.prevent="saveCampaign">
          <div class="mb-3">
            <label for="campaignName" class="form-label">Tên chiến dịch <span class="text-danger">*</span></label>
            <input 
              type="text" 
              class="form-control" 
              id="campaignName" 
              v-model="campaignForm.name"
              required
              placeholder="Nhập tên chiến dịch"
            >
          </div>
          
          <div class="mb-3">
            <label for="campaignDescription" class="form-label">Mô tả</label>
            <textarea 
              class="form-control" 
              id="campaignDescription" 
              rows="3" 
              v-model="campaignForm.description"
              placeholder="Nhập mô tả về chiến dịch tuyển dụng"
            ></textarea>
          </div>
          
          <div class="form-check form-switch mb-3">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="campaignStatus" 
              v-model="campaignForm.is_active"
            >
            <label class="form-check-label" for="campaignStatus">
              {{ campaignForm.is_active ? 'Hoạt động' : 'Tạm dừng' }}
            </label>
          </div>
        </form>
      </template>
    </BaseModal>

    <!-- Modal xác nhận xóa -->
    <BaseModal
      v-model:show="showDeleteModal"
      title="Xác nhận xóa"
      @submit="deleteCampaign"
    >
      <template #body>
        <p>Bạn có chắc chắn muốn xóa chiến dịch "<strong>{{ campaignToDelete?.name }}</strong>"?</p>
        <p class="text-danger">Hành động này không thể hoàn tác!</p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCampaignStore } from '@/stores/campaign'
import { useEnterpriseStore } from '@/stores/enterprise'
import BaseModal from '@/components/common/BaseModal.vue'

const router = useRouter()
const campaignStore = useCampaignStore()
const enterpriseStore = useEnterpriseStore()

// State variables
const loading = ref(false)
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const campaignToDelete = ref(null)

// Search and filter
const searchTerm = ref('')
const filterStatus = ref('all')
const sortOption = ref('created_at,desc')
const currentPage = ref(1)
const pageSize = ref(10)

// Form for create/edit
const campaignForm = reactive({
  name: '',
  description: '',
  is_active: true
})

// Computed properties
const totalPages = computed(() => campaignStore.pagination.totalPages)

// Generate array of pages to display in pagination
const displayedPages = computed(() => {
  const pages = []
  const maxPagesToShow = 5
  const totalPagesValue = totalPages.value
  const currentPageValue = currentPage.value
  
  // Case 1: Total pages <= max pages to show
  if (totalPagesValue <= maxPagesToShow) {
    for (let i = 1; i <= totalPagesValue; i++) {
      pages.push(i)
    }
  }
  // Case 2: Current page is close to the beginning
  else if (currentPageValue <= 3) {
    for (let i = 1; i <= maxPagesToShow; i++) {
      pages.push(i)
    }
  }
  // Case 3: Current page is close to the end
  else if (currentPageValue >= totalPagesValue - 2) {
    for (let i = totalPagesValue - maxPagesToShow + 1; i <= totalPagesValue; i++) {
      pages.push(i)
    }
  }
  // Case 4: Current page is in the middle
  else {
    for (let i = currentPageValue - 2; i <= currentPageValue + 2; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

// Methods
onMounted(async () => {
  // Kiểm tra xem đã có thông tin doanh nghiệp chưa
  await enterpriseStore.fetchEnterprise()
  
  // Nếu chưa có doanh nghiệp, chuyển hướng để tạo
  if (!enterpriseStore.hasEnterprise) {
    localStorage.setItem('notification', JSON.stringify({
      type: 'warning',
      message: 'Vui lòng tạo thông tin doanh nghiệp trước khi quản lý chiến dịch tuyển dụng',
      show: true
    }))
    router.push('/enterprise/profile')
    return
  }
  
  // Load campaigns
  loadCampaigns()
})

const debouncedSearch = (() => {
  let timeout = null
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      loadCampaigns()
    }, 500)
  }
})()

const loadCampaigns = async () => {
  loading.value = true
  
  try {
    const [sortBy, sortOrder] = sortOption.value.split(',')
    
    await campaignStore.fetchCampaigns(
      currentPage.value, 
      pageSize.value, 
      sortBy,
      sortOrder
    )
    
    // Filter by status if needed
    if (filterStatus.value !== 'all') {
      campaignStore.campaigns = campaignStore.campaigns.filter(campaign => {
        return filterStatus.value === 'active' ? campaign.is_active : !campaign.is_active
      })
    }
    
    // Filter by search term if provided
    if (searchTerm.value) {
      campaignStore.campaigns = campaignStore.campaigns.filter(campaign => {
        return campaign.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      })
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách chiến dịch:', error)
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  
  currentPage.value = page
  loadCampaigns()
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

const resetForm = () => {
  campaignForm.name = ''
  campaignForm.description = ''
  campaignForm.is_active = true
}

const openCreateModal = () => {
  isEditing.value = false
  resetForm()
  showCreateModal.value = true
}

const editCampaign = (campaign) => {
  isEditing.value = true
  campaignForm.name = campaign.name
  campaignForm.description = campaign.description || ''
  campaignForm.is_active = campaign.is_active
  campaignForm.id = campaign.id
  
  showCreateModal.value = true
}

const saveCampaign = async () => {
  loading.value = true
  
  try {
    let result
    
    if (isEditing.value) {
      // Cập nhật chiến dịch
      result = await campaignStore.updateCampaign(campaignForm.id, campaignForm)
    } else {
      // Tạo chiến dịch mới
      result = await campaignStore.createCampaign(campaignForm)
    }
    
    if (result.success) {
      // Đóng modal sau khi lưu thành công
      showCreateModal.value = false
      
      // Reset form
      resetForm()
      
      // Reload danh sách
      loadCampaigns()
    }
  } catch (error) {
    console.error('Lỗi khi lưu chiến dịch:', error)
  } finally {
    loading.value = false
  }
}

const confirmDelete = (campaign) => {
  campaignToDelete.value = campaign
  showDeleteModal.value = true
}

const deleteCampaign = async () => {
  if (!campaignToDelete.value) return
  
  loading.value = true
  
  try {
    const result = await campaignStore.deleteCampaign(campaignToDelete.value.id)
    
    if (result.success) {
      // Đóng modal sau khi xóa thành công
      showDeleteModal.value = false
      
      // Reset
      campaignToDelete.value = null
      
      // Reload danh sách nếu cần
      if (campaignStore.campaigns.length === 0 && currentPage.value > 1) {
        currentPage.value--
      }
      
      loadCampaigns()
    }
  } catch (error) {
    console.error('Lỗi khi xóa chiến dịch:', error)
  } finally {
    loading.value = false
  }
}

const viewCampaignDetail = (id) => {
  router.push(`/campaigns/${id}`)
}
</script>

<style scoped>
.campaign-card {
  transition: all 0.3s ease;
}
.campaign-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}
.action-btn:hover {
  background-color: rgba(59, 130, 246, 0.1);
}
</style> 