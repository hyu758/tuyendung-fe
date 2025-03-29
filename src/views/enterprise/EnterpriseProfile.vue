<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">{{ enterpriseExists ? 'Cập nhật thông tin doanh nghiệp' : 'Tạo doanh nghiệp mới' }}</h1>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="saveEnterprise" class="space-y-6">
      <!-- Logo upload section -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Logo doanh nghiệp</label>
        <div class="flex items-center">
          <div v-if="logoPreview || enterprise.logo" 
               class="w-32 h-32 mr-4 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <img :src="logoPreview || enterprise.logo" alt="Logo" class="max-w-full max-h-full object-contain" />
          </div>
          <div v-else class="w-32 h-32 mr-4 bg-gray-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-building text-4xl text-gray-400"></i>
          </div>
          
          <div class="flex flex-col space-y-2">
            <label 
              class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md cursor-pointer hover:bg-blue-700"
            >
              <span>Chọn hình ảnh</span>
              <input 
                type="file" 
                accept="image/*" 
                class="hidden" 
                @change="handleLogoUpload"
              />
            </label>
            <button 
              v-if="logoPreview || enterprise.logo" 
              type="button" 
              @click="removeLogo" 
              class="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              Xóa logo
            </button>
          </div>
        </div>
        <p class="mt-1 text-sm text-gray-500">Định dạng: PNG, JPG, JPEG. Kích thước tối đa: 2MB.</p>
      </div>

      <!-- Basic information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Company name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Tên doanh nghiệp <span class="text-red-600">*</span></label>
          <input 
            type="text" 
            id="name" 
            v-model="enterprise.name" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ví dụ: Công ty ABC"
          />
        </div>
        
        <!-- Business type -->
        <div>
          <label for="business_type" class="block text-sm font-medium text-gray-700 mb-1">Loại hình doanh nghiệp</label>
          <select 
            id="business_type" 
            v-model="enterprise.business_type"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn loại hình --</option>
            <option value="private">Công ty tư nhân</option>
            <option value="corporation">Công ty cổ phần</option>
            <option value="limited">Công ty TNHH</option>
            <option value="foreign">Công ty nước ngoài</option>
            <option value="state">Công ty nhà nước</option>
            <option value="startup">Startup</option>
          </select>
        </div>
        
        <!-- Industry -->
        <div>
          <label for="industry" class="block text-sm font-medium text-gray-700 mb-1">Lĩnh vực hoạt động <span class="text-red-600">*</span></label>
          <select 
            id="industry" 
            v-model="enterprise.industry" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn lĩnh vực --</option>
            <option value="it">Công nghệ thông tin</option>
            <option value="finance">Tài chính - Ngân hàng</option>
            <option value="education">Giáo dục - Đào tạo</option>
            <option value="manufacturing">Sản xuất - Chế tạo</option>
            <option value="retail">Bán lẻ - Thương mại</option>
            <option value="healthcare">Y tế - Chăm sóc sức khỏe</option>
            <option value="service">Dịch vụ</option>
            <option value="other">Khác</option>
          </select>
        </div>
        
        <!-- Company size -->
        <div>
          <label for="company_size" class="block text-sm font-medium text-gray-700 mb-1">Quy mô công ty</label>
          <select 
            id="company_size" 
            v-model="enterprise.company_size"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn quy mô --</option>
            <option value="1-10">1-10 nhân viên</option>
            <option value="11-50">11-50 nhân viên</option>
            <option value="51-200">51-200 nhân viên</option>
            <option value="201-500">201-500 nhân viên</option>
            <option value="501-1000">501-1000 nhân viên</option>
            <option value="1000+">Trên 1000 nhân viên</option>
          </select>
        </div>
      </div>

      <!-- Contact information -->
      <div>
        <h2 class="text-lg font-medium text-gray-800 mb-4">Thông tin liên hệ</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email liên hệ <span class="text-red-600">*</span></label>
            <input 
              type="email" 
              id="email" 
              v-model="enterprise.email" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@company.com"
            />
          </div>
          
          <!-- Phone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span class="text-red-600">*</span></label>
            <input 
              type="tel" 
              id="phone" 
              v-model="enterprise.phone" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0901234567"
            />
          </div>
          
          <!-- Website -->
          <div>
            <label for="website" class="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input 
              type="url" 
              id="website" 
              v-model="enterprise.website"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      <!-- Address -->
      <div>
        <h2 class="text-lg font-medium text-gray-800 mb-4">Địa chỉ công ty</h2>
        
        <!-- Address line -->
        <div class="mb-4">
          <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ <span class="text-red-600">*</span></label>
          <input 
            type="text" 
            id="address" 
            v-model="enterprise.address" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Số nhà, đường, phường/xã"
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- City -->
          <div>
            <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Thành phố <span class="text-red-600">*</span></label>
            <input 
              type="text" 
              id="city" 
              v-model="enterprise.city" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hà Nội"
            />
          </div>
          
          <!-- District -->
          <div>
            <label for="district" class="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện <span class="text-red-600">*</span></label>
            <input 
              type="text" 
              id="district" 
              v-model="enterprise.district" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cầu Giấy"
            />
          </div>
          
          <!-- Country (could be a select in a real app) -->
          <div>
            <label for="country" class="block text-sm font-medium text-gray-700 mb-1">Quốc gia <span class="text-red-600">*</span></label>
            <input 
              type="text" 
              id="country" 
              v-model="enterprise.country" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Việt Nam"
            />
          </div>
        </div>
      </div>

      <!-- Company description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Mô tả công ty</label>
        <textarea 
          id="description" 
          v-model="enterprise.description"
          rows="4"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Giới thiệu về công ty, lĩnh vực, văn hóa..."
        ></textarea>
      </div>

      <!-- Form actions -->
      <div class="flex justify-end pt-4">
        <button 
          type="button" 
          @click="resetForm" 
          class="px-6 py-2 mr-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Hủy thay đổi
        </button>
        <button 
          type="submit" 
          :disabled="loading"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang xử lý...
          </span>
          <span v-else>{{ enterpriseExists ? 'Cập nhật' : 'Tạo doanh nghiệp' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useEnterpriseStore } from '@/stores/enterprise'

const enterpriseStore = useEnterpriseStore()
const loading = ref(false)
const logoPreview = ref(null)
const logoFile = ref(null)

// Reactive enterprise data
const enterprise = reactive({
  name: '',
  logo: null,
  business_type: '',
  industry: '',
  company_size: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  city: '',
  district: '',
  country: 'Việt Nam',
  description: ''
})

// Check if enterprise exists
const enterpriseExists = computed(() => enterpriseStore.hasEnterprise)

// Load enterprise data on mount
onMounted(async () => {
  loading.value = true
  try {
    // Fetch enterprise data from the store
    await enterpriseStore.fetchEnterprise()
    
    // If enterprise exists, populate the form
    if (enterpriseStore.hasEnterprise) {
      Object.assign(enterprise, enterpriseStore.enterprise)
    }
  } catch (error) {
    console.error('Error loading enterprise data:', error)
    // Handle error notification
  } finally {
    loading.value = false
  }
})

// Handle logo upload
const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Check file size (2MB limit)
  if (file.size > 2 * 1024 * 1024) {
    alert('Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 2MB.')
    return
  }
  
  // Check file type
  if (!file.type.match('image.*')) {
    alert('Vui lòng chọn file hình ảnh.')
    return
  }
  
  // Store file for later upload
  logoFile.value = file
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    logoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// Remove logo
const removeLogo = () => {
  logoPreview.value = null
  logoFile.value = null
  enterprise.logo = null
}

// Reset form
const resetForm = () => {
  // If enterprise exists, reload its data
  if (enterpriseStore.hasEnterprise) {
    Object.assign(enterprise, enterpriseStore.enterprise)
    logoPreview.value = null
  } else {
    // Otherwise clear the form
    Object.keys(enterprise).forEach(key => {
      enterprise[key] = key === 'country' ? 'Việt Nam' : ''
    })
    logoPreview.value = null
    logoFile.value = null
  }
}

// Save enterprise
const saveEnterprise = async () => {
  loading.value = true
  
  try {
    // Prepare form data including logo if needed
    const formData = new FormData()
    
    // Add all enterprise fields to formData
    Object.keys(enterprise).forEach(key => {
      if (enterprise[key] !== null && enterprise[key] !== undefined) {
        formData.append(key, enterprise[key])
      }
    })
    
    // Add logo file if available
    if (logoFile.value) {
      formData.append('logo', logoFile.value)
    }
    
    let result
    if (enterpriseExists.value) {
      // Update existing enterprise
      result = await enterpriseStore.updateEnterprise(formData)
    } else {
      // Create new enterprise
      result = await enterpriseStore.createEnterprise(formData)
    }
    
    if (result.success) {
      // Reset form and logo preview
      logoPreview.value = null
      logoFile.value = null
      
      // Show success notification
      localStorage.setItem('notification', JSON.stringify({
        type: 'success',
        message: enterpriseExists.value ? 'Cập nhật thông tin doanh nghiệp thành công!' : 'Tạo doanh nghiệp mới thành công!',
        show: true
      }))
    }
  } catch (error) {
    console.error('Error saving enterprise:', error)
    // Show error notification
    localStorage.setItem('notification', JSON.stringify({
      type: 'error',
      message: 'Có lỗi xảy ra khi lưu thông tin doanh nghiệp',
      show: true
    }))
  } finally {
    loading.value = false
  }
}
</script> 