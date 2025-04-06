<template>
  <div class="bg-white rounded-lg shadow-md p-5">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Lọc kết quả</h3>
    
    <form @submit.prevent="applyFilters">
      <!-- Tìm kiếm theo từ khóa -->
      <div class="mb-4">
        <label for="keyword" class="block text-sm font-medium text-gray-700 mb-1">Từ khóa</label>
        <input
          id="keyword"
          v-model="filters.q"
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
          v-model="filters.city"
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
          v-model="filters.position"
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
              v-model="filters.type_working"
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
        <label class="block text-sm font-medium text-gray-700 mb-1">Mức lương</label>
        <div class="space-y-2">
          <div class="flex items-center">
            <input
              id="salary-all"
              v-model="filters.salary_type"
              value=""
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label for="salary-all" class="ml-2 block text-sm text-gray-700">
              Tất cả
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="salary-under-10"
              v-model="filters.salary_type" 
              value="0-10"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label for="salary-under-10" class="ml-2 block text-sm text-gray-700">
              Dưới 10 triệu
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="salary-10-15"
              v-model="filters.salary_type"
              value="10-15"
              type="radio" 
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label for="salary-10-15" class="ml-2 block text-sm text-gray-700">
              10 - 15 triệu
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="salary-15-20"
              v-model="filters.salary_type"
              value="15-20"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label for="salary-15-20" class="ml-2 block text-sm text-gray-700">
              15 - 20 triệu
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="salary-20-25"
              v-model="filters.salary_type"
              value="20-25"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label for="salary-20-25" class="ml-2 block text-sm text-gray-700">
              20 - 25 triệu
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="salary-25-30"
              v-model="filters.salary_type"
              value="25-30"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label for="salary-25-30" class="ml-2 block text-sm text-gray-700">
              25 - 30 triệu
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="salary-30-50"
              v-model="filters.salary_type"
              value="30-50"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label for="salary-30-50" class="ml-2 block text-sm text-gray-700">
              30 - 50 triệu
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="salary-above-50"
              v-model="filters.salary_type"
              value="50-999"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label for="salary-above-50" class="ml-2 block text-sm text-gray-700">
              Trên 50 triệu
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="salary-negotiable"
              v-model="filters.salary_type"
              value="negotiable"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label for="salary-negotiable" class="ml-2 block text-sm text-gray-700">
              Thỏa thuận
            </label>
          </div>
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
import { ref, reactive, defineEmits, onMounted } from 'vue'
import { useAddressStore } from '@/stores/address'
import { useFieldStore } from '@/stores/field'

const emit = defineEmits(['filter'])

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
  let salary_min = ''
  let salary_max = ''
  let is_salary_negotiable = false

  if (filters.salary_type) {
    if (filters.salary_type === 'negotiable') {
      is_salary_negotiable = true
    } else {
      const [min, max] = filters.salary_type.split('-').map(Number)
      salary_min = min * 1000000
      salary_max = max * 1000000
    }
  }

  const filterParams = {
    q: filters.q,
    city: filters.city,
    position: filters.position,
    type_working: filters.type_working.join(','),
    salary_min,
    salary_max,
    is_salary_negotiable,
    experience: filters.experience
  }
  emit('filter', filterParams)
}

// Đặt lại bộ lọc về mặc định
const resetFilters = () => {
  filters.q = ''
  filters.city = ''
  filters.position = ''
  filters.type_working = []
  filters.salary_type = ''
  filters.experience = ''
  
  emit('filter', {
    q: '',
    city: '',
    position: '',
    type_working: '',
    salary_min: '',
    salary_max: '',
    is_salary_negotiable: false,
    experience: ''
  })
}
</script> 