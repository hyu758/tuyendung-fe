<template>
  <div class="bg-white rounded-xl shadow-sm p-5 transition-all hover:shadow-md relative">
    <div class="flex justify-between items-center mb-5">
      <h3 class="text-lg font-semibold text-gray-800 flex items-center">
        <i class="fas fa-filter text-blue-500 mr-2"></i>
        Lọc kết quả
      </h3>
      
      <!-- Nút đóng bộ lọc - Chỉ hiển thị trên mobile -->
      <button 
        @click="$emit('close')" 
        class="lg:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
      >
        <i class="fas fa-times text-gray-500"></i>
      </button>
    </div>
    
    <form @submit.prevent="applyFilters" class="space-y-5">
      <!-- Tìm kiếm theo từ khóa -->
      <div>
        <label for="keyword" class="block text-sm font-medium text-gray-700 mb-1.5">Từ khóa</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <i class="fas fa-search text-gray-400"></i>
          </div>
          <input
            id="keyword"
            v-model="filters.q"
            type="text"
            placeholder="Tiêu đề, kỹ năng, công ty..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>
      
      <!-- Lọc theo địa điểm -->
      <div>
        <label for="location" class="block text-sm font-medium text-gray-700 mb-1.5">Địa điểm</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <i class="fas fa-map-marker-alt text-gray-400"></i>
          </div>
          <select
            id="location"
            v-model="filters.city"
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white transition-all"
          >
            <option value="">Tất cả địa điểm</option>
            <option v-for="location in locations" :key="location" :value="location">
              {{ location }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <i class="fas fa-chevron-down text-gray-400 text-xs"></i>
          </div>
        </div>
      </div>
      
      <!-- Lọc theo ngành nghề -->
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700 mb-1.5">Ngành nghề</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <i class="fas fa-briefcase text-gray-400"></i>
          </div>
          <select
            id="category"
            v-model="filters.position"
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white transition-all"
          >
            <option value="">Tất cả ngành nghề</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <i class="fas fa-chevron-down text-gray-400 text-xs"></i>
          </div>
        </div>
      </div>
      
      <!-- Lọc theo loại công việc -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Loại công việc</label>
        <div class="space-y-2 max-h-52 overflow-y-auto bg-gray-50 rounded-lg p-2.5 border border-gray-100">
          <div v-for="jobType in jobTypes" :key="jobType" class="flex items-center p-1 hover:bg-white rounded-md transition-colors">
            <input
              :id="jobType"
              v-model="filters.type_working"
              :value="jobType"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
            />
            <label :for="jobType" class="ml-2 block text-sm text-gray-700 cursor-pointer w-full">
              {{ jobType }}
            </label>
          </div>
        </div>
      </div>
      
      <!-- Lọc theo mức lương -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Mức lương</label>
        <div class="space-y-2 max-h-72 overflow-y-auto bg-gray-50 rounded-lg p-2.5 border border-gray-100">
          <div class="flex items-center p-1 hover:bg-white rounded-md transition-colors">
            <input
              id="salary-all"
              v-model="filters.salary_type"
              value=""
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 transition-colors"
            />
            <label for="salary-all" class="ml-2 block text-sm text-gray-700 cursor-pointer w-full">
              Tất cả
            </label>
          </div>
          <div class="flex items-center p-1 hover:bg-white rounded-md transition-colors">
            <input
              id="salary-under-10"
              v-model="filters.salary_type" 
              value="0-10"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 transition-colors"
            />
            <label for="salary-under-10" class="ml-2 block text-sm text-gray-700 cursor-pointer w-full">
              Dưới 10 triệu
            </label>
          </div>
          <div class="flex items-center p-1 hover:bg-white rounded-md transition-colors">
            <input
              id="salary-10-15"
              v-model="filters.salary_type"
              value="10-15"
              type="radio" 
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 transition-colors"
            />
            <label for="salary-10-15" class="ml-2 block text-sm text-gray-700 cursor-pointer w-full">
              10 - 15 triệu
            </label>
          </div>
          <div class="flex items-center p-1 hover:bg-white rounded-md transition-colors">
            <input
              id="salary-15-20"
              v-model="filters.salary_type"
              value="15-20"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 transition-colors"
            />
            <label for="salary-15-20" class="ml-2 block text-sm text-gray-700 cursor-pointer w-full">
              15 - 20 triệu
            </label>
          </div>
          <div class="flex items-center p-1 hover:bg-white rounded-md transition-colors">
            <input
              id="salary-20-25"
              v-model="filters.salary_type"
              value="20-25"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 transition-colors"
            />
            <label for="salary-20-25" class="ml-2 block text-sm text-gray-700 cursor-pointer w-full">
              20 - 25 triệu
            </label>
          </div>
          <div class="flex items-center p-1 hover:bg-white rounded-md transition-colors">
            <input
              id="salary-25-30"
              v-model="filters.salary_type"
              value="25-30"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 transition-colors"
            />
            <label for="salary-25-30" class="ml-2 block text-sm text-gray-700 cursor-pointer w-full">
              25 - 30 triệu
            </label>
          </div>
          <div class="flex items-center p-1 hover:bg-white rounded-md transition-colors">
            <input
              id="salary-30-50"
              v-model="filters.salary_type"
              value="30-50"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 transition-colors"
            />
            <label for="salary-30-50" class="ml-2 block text-sm text-gray-700 cursor-pointer w-full">
              30 - 50 triệu
            </label>
          </div>
          <div class="flex items-center p-1 hover:bg-white rounded-md transition-colors">
            <input
              id="salary-above-50"
              v-model="filters.salary_type"
              value="50-999"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 transition-colors"
            />
            <label for="salary-above-50" class="ml-2 block text-sm text-gray-700 cursor-pointer w-full">
              Trên 50 triệu
            </label>
          </div>
          <div class="flex items-center p-1 hover:bg-white rounded-md transition-colors">
            <input
              id="salary-negotiable"
              v-model="filters.salary_type"
              value="negotiable"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 transition-colors"
            />
            <label for="salary-negotiable" class="ml-2 block text-sm text-gray-700 cursor-pointer w-full">
              Thỏa thuận
            </label>
          </div>
        </div>
      </div>
      
      <!-- Lọc theo kinh nghiệm -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Kinh nghiệm</label>
        <div class="space-y-2 bg-gray-50 rounded-lg p-2.5 border border-gray-100">
          <div v-for="exp in experiences" :key="exp" class="flex items-center p-1 hover:bg-white rounded-md transition-colors">
            <input
              :id="exp"
              v-model="filters.experience"
              :value="exp"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 transition-colors"
            />
            <label :for="exp" class="ml-2 block text-sm text-gray-700 cursor-pointer w-full">
              {{ exp }}
            </label>
          </div>
        </div>
      </div>
      
      <!-- Nút lọc và xóa bộ lọc -->
      <div class="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          @click="resetFilters"
          class="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center"
        >
          <i class="fas fa-redo-alt mr-2"></i>
          Xóa bộ lọc
        </button>
        <button
          type="submit"
          class="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center"
        >
          <i class="fas fa-search mr-2"></i>
          Áp dụng
        </button>
      </div>
      
      <!-- Nút đóng bộ lọc trên mobile - Nổi ở dưới cùng -->
      <div class="lg:hidden mt-4 sticky bottom-0 bg-white pt-2 pb-1 border-t border-gray-100">
        <button
          type="button"
          @click="applyAndClose"
          class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center"
        >
          <i class="fas fa-check mr-2"></i>
          Áp dụng và đóng
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, onMounted } from 'vue'
import { useAddressStore } from '@/stores/address'
import { useFieldStore } from '@/stores/field'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const emit = defineEmits(['filter', 'close'])

// Các dữ liệu cho bộ lọc
const locations = ref([])
const categories = ref([])

// Load dữ liệu từ API
async function loadData() {
  try {
    // Load locations
    const addressStore = useAddressStore()
    const provinces = await addressStore.fetchProvinces()
    if (provinces?.data) {
      locations.value = provinces.data.map(province => province.name)
    }

    // Load categories
    const fieldStore = useFieldStore()
    const fields = await fieldStore.fetchFields()
    console.log(fields)
    if (fields?.data) {
      categories.value = fields.data.map(field => field.name)
    }
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error)
  }
}

// Gọi hàm load dữ liệu khi component được mount
onMounted(() => {
  loadData()
})

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

// Filters state
const filters = reactive({
  q: '',
  city: '',
  position: '',
  type_working: [],
  salary_type: '',
  experience: '',
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
  // Tạo đối tượng chứa các tham số cố định
  const filterParams = {
    page: 1,
    page_size: 10,
    sort_by: 'created_at',
    sort_order: 'desc',
    all: true
  }
  
  // Chỉ thêm các tham số có giá trị
  if (filters.q && filters.q.trim()) filterParams.q = filters.q.trim()
  if (filters.city) filterParams.city = filters.city
  if (filters.position) filterParams.position = filters.position
  if (filters.type_working.length > 0) filterParams.type_working = filters.type_working.join(',')
  if (filters.experience) filterParams.experience = filters.experience
  
  // Xử lý lương
  if (filters.salary_type) {
    if (filters.salary_type === 'negotiable') {
      filterParams.negotiable = 'true'
    } else {
      const [min, max] = filters.salary_type.split('-').map(Number)
      if (min > 0) filterParams.salary_min = min
      if (max < 999) filterParams.salary_max = max
    }
  }
  
  emit('filter', filterParams)
}

// Áp dụng bộ lọc và đóng (cho mobile)
const applyAndClose = () => {
  applyFilters()
  emit('close')
}

// Đặt lại bộ lọc về mặc định
const resetFilters = () => {
  filters.q = ''
  filters.city = ''
  filters.position = ''
  filters.type_working = []
  filters.salary_type = ''
  filters.experience = ''
  
  // Khi reset, chỉ gửi tham số cố định
  emit('filter', {
    page: 1,
    page_size: 10,
    sort_by: 'created_at',
    sort_order: 'desc',
    all: true
  })
}
</script>

<style scoped>
.max-h-52 {
  max-height: 13rem;
}

.max-h-72 {
  max-height: 18rem;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

/* Màn hình di động */
@media (max-width: 1023px) {
  .sticky {
    position: sticky;
  }
}
</style> 