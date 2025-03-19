<template>
  <div class="bg-white rounded-lg shadow-md p-5">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Lọc kết quả</h3>
    
    <form @submit.prevent="applyFilters">
      <!-- Tìm kiếm theo từ khóa -->
      <div class="mb-4">
        <label for="keyword" class="block text-sm font-medium text-gray-700 mb-1">Từ khóa</label>
        <input
          id="keyword"
          v-model="filters.keyword"
          type="text"
          placeholder="Tiêu đề, kỹ năng, công ty..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <!-- Lọc theo địa điểm -->
      <div class="mb-4">
        <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
        <select
          id="location"
          v-model="filters.location"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả địa điểm</option>
          <option v-for="location in locations" :key="location" :value="location">
            {{ location }}
          </option>
        </select>
      </div>
      
      <!-- Lọc theo ngành nghề -->
      <div class="mb-4">
        <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Ngành nghề</label>
        <select
          id="category"
          v-model="filters.category"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả ngành nghề</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      
      <!-- Lọc theo loại công việc -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Loại công việc</label>
        <div class="space-y-2">
          <div v-for="jobType in jobTypes" :key="jobType" class="flex items-center">
            <input
              :id="jobType"
              v-model="filters.jobTypes"
              :value="jobType"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label :for="jobType" class="ml-2 block text-sm text-gray-700">
              {{ jobType }}
            </label>
          </div>
        </div>
      </div>
      
      <!-- Lọc theo mức lương -->
      <div class="mb-4">
        <label for="salaryRange" class="block text-sm font-medium text-gray-700 mb-1">
          Mức lương ({{ formatCurrency(filters.salaryRange[0]) }} - {{ formatCurrency(filters.salaryRange[1]) }})
        </label>
        <div class="flex space-x-2">
          <input
            type="range"
            id="salaryMin"
            v-model.number="filters.salaryRange[0]"
            :min="salaryMin"
            :max="filters.salaryRange[1]"
            step="1000000"
            class="w-full"
          />
          <input
            type="range"
            id="salaryMax"
            v-model.number="filters.salaryRange[1]"
            :min="filters.salaryRange[0]"
            :max="salaryMax"
            step="1000000"
            class="w-full"
          />
        </div>
      </div>
      
      <!-- Lọc theo kinh nghiệm -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Kinh nghiệm</label>
        <div class="space-y-2">
          <div v-for="exp in experiences" :key="exp" class="flex items-center">
            <input
              :id="exp"
              v-model="filters.experience"
              :value="exp"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label :for="exp" class="ml-2 block text-sm text-gray-700">
              {{ exp }}
            </label>
          </div>
        </div>
      </div>
      
      <!-- Nút lọc và xóa bộ lọc -->
      <div class="flex space-x-2">
        <button
          type="submit"
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Áp dụng bộ lọc
        </button>
        <button
          type="button"
          @click="resetFilters"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Xóa bộ lọc
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits } from 'vue'

const emit = defineEmits(['filter'])

// Các dữ liệu cho bộ lọc (thường sẽ được lấy từ API)
const locations = [
  'Hà Nội', 
  'Hồ Chí Minh', 
  'Đà Nẵng', 
  'Hải Phòng', 
  'Cần Thơ', 
  'Khác'
]

const categories = [
  'Công nghệ thông tin', 
  'Kế toán', 
  'Marketing', 
  'Nhân sự', 
  'Kinh doanh', 
  'Kỹ thuật', 
  'Giáo dục', 
  'Y tế'
]

const jobTypes = [
  'Toàn thời gian', 
  'Bán thời gian', 
  'Thực tập', 
  'Freelance', 
  'Remote'
]

const experiences = [
  'Không yêu cầu kinh nghiệm',
  'Dưới 1 năm',
  '1-2 năm',
  '3-5 năm',
  'Trên 5 năm'
]

// Mức lương tối thiểu và tối đa
const salaryMin = 0
const salaryMax = 50000000

// Filters state
const filters = reactive({
  keyword: '',
  location: '',
  category: '',
  jobTypes: [],
  salaryRange: [salaryMin, salaryMax],
  experience: ''
})

// Định dạng tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value)
}

// Áp dụng bộ lọc
const applyFilters = () => {
  emit('filter', { ...filters })
}

// Đặt lại bộ lọc về mặc định
const resetFilters = () => {
  filters.keyword = ''
  filters.location = ''
  filters.category = ''
  filters.jobTypes = []
  filters.salaryRange = [salaryMin, salaryMax]
  filters.experience = ''
  
  emit('filter', { ...filters })
}
</script> 