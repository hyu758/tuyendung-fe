<template>
  <!-- Skeleton Loading -->
  <div v-if="loading" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="p-5">
      <div class="flex justify-between items-start">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gray-300 rounded-md animate-pulse"></div>
          <div class="ml-4">
            <div class="h-5 bg-gray-300 rounded w-48 animate-pulse"></div>
            <div class="h-4 bg-gray-300 rounded w-32 mt-2 animate-pulse"></div>
          </div>
        </div>
        <div class="w-16 h-6 bg-gray-300 rounded-full animate-pulse"></div>
      </div>

      <div class="mt-4 space-y-2">
        <div class="flex items-center">
          <div class="w-4 h-4 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
          <div class="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
        </div>
        
        <div class="flex items-center">
          <div class="w-4 h-4 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
          <div class="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
        </div>
        
        <div class="flex items-center">
          <div class="w-4 h-4 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
          <div class="h-4 bg-gray-300 rounded w-36 animate-pulse"></div>
        </div>
      </div>
      
      <div class="mt-4 flex justify-between items-center">
        <div class="flex flex-wrap gap-2">
          <div class="w-16 h-6 bg-gray-300 rounded-full animate-pulse"></div>
          <div class="w-20 h-6 bg-gray-300 rounded-full animate-pulse"></div>
          <div class="w-14 h-6 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        
        <div class="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
      </div>
      
      <div class="mt-5 flex space-x-2">
        <div class="flex-1 h-10 bg-gray-300 rounded-md animate-pulse"></div>
        <div class="w-10 h-10 bg-gray-300 rounded-md animate-pulse"></div>
      </div>
    </div>
  </div>

  <!-- Actual content -->
  <div v-else class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-100 group">
    <!-- Premium badge if applicable -->
    <div v-if="job.is_enterprise_premium" class="absolute top-0 right-0 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-bl-lg font-medium z-10">
      <span class="flex items-center">
        <i class="fas fa-crown mr-1"></i> Premium
      </span>
    </div>
    
    <div class="p-6 relative">
      <div class="flex justify-between items-start">
        <div class="flex items-center">
          <div class="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mr-4 shadow-sm border border-gray-200">
            <img v-if="job.enterprise_logo" :src="job.enterprise_logo" :alt="job.enterprise_name" class="w-full h-full object-contain p-1" @error="handleImageError" />
            <span v-else class="text-gray-500 text-xl font-bold">{{ job.enterprise_name?.charAt(0) || 'J' }}</span>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
              <router-link :to="{ name: 'JobDetail', params: { id: job.id } }">
                {{ job.title }}
              </router-link>
            </h3>
            <p class="text-gray-600 text-sm line-clamp-1">{{ job.enterprise_name }}</p>
          </div>
        </div>
        <button 
          v-if="showSaveButton"
          @click="toggleSave" 
          class="save-button-wrapper"
          :class="{ 'is-saved': job.is_saved }"
          :title="job.is_saved ? 'Bỏ lưu' : 'Lưu việc làm'"
        >
          <i class="far fa-heart text-lg not-saved-icon"></i>
          <i class="fas fa-heart text-lg saved-icon"></i>
        </button>
      </div>

      <div class="mt-5 space-y-2.5">
        <div class="flex items-center text-gray-600 text-sm">
          <i class="fas fa-map-marker-alt text-blue-500 w-5 text-center mr-2"></i>
          <span>{{ formatLocation(job) }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm">
          <i class="fas fa-clock text-blue-500 w-5 text-center mr-2"></i>
          <span>{{ formatTypeWorking(job.type_working) }}</span>
        </div>
        
        <div class="flex items-center text-sm">
          <i class="fas fa-money-bill-wave text-blue-500 w-5 text-center mr-2"></i>
          <span class="font-medium text-blue-600">{{ getSalaryDisplay(job) }}</span>
        </div>

        <div v-if="job.experience" class="flex items-center text-gray-600 text-sm">
          <i class="fas fa-briefcase text-blue-500 w-5 text-center mr-2"></i>
          <span>{{ formatExperience(job.experience) }}</span>
        </div>
      </div>
      
      <div class="mt-6 flex justify-between items-center">
        <div class="flex flex-wrap gap-2">
          <span v-for="(tag, index) in getJobTags(job)" :key="index" class="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
            {{ tag }}
          </span>
        </div>
        
        <span class="text-xs text-gray-500">{{ formatDate(job.created_at) }}</span>
      </div>
      
      <div class="mt-6">
        <router-link 
          :to="{ name: 'JobDetail', params: { id: job.id } }" 
          class="w-full inline-block px-4 py-2.5 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Xem chi tiết
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  job: {
    type: Object,
    required: true
  },
  showSaveButton: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['saveJob'])

// Định dạng mức lương
const formatSalary = (salary) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(salary)
}

const getSalaryDisplay = (job) => {
  if (!job) return 'Thỏa thuận'
  
  if (job.is_salary_negotiable) {
    return 'Thỏa thuận'
  }

  if (job.salary_min === 0 && job.salary_max > 0) {
    return `Đến ${formatSalary(job.salary_max)}`
  }

  if (job.salary_max === 0 && job.salary_min > 0) {
    return `Từ ${formatSalary(job.salary_min)}`
  }

  if (job.salary_min > 0 && job.salary_max > 0) {
    return `${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)}`
  }

  return 'Thỏa thuận'
}

// Format location
const formatLocation = (job) => {
  if (!job) return ''
  
  if (job.district && job.city) {
    return `${job.district}, ${job.city}`
  }
  
  return job.city || job.district || 'Toàn quốc'
}

// Format type working
const formatTypeWorking = (typeWorking) => {
  if (!typeWorking) return 'Toàn thời gian'
  
  const typeMap = {
    'fulltime': 'Toàn thời gian',
    'parttime': 'Bán thời gian',
    'remote': 'Từ xa',
    'internship': 'Thực tập',
    'contract': 'Hợp đồng'
  }
  
  return typeMap[typeWorking.toLowerCase()] || typeWorking
}

// Format experience
const formatExperience = (experience) => {
  if (!experience) return 'Không yêu cầu kinh nghiệm'
  
  const expMap = {
    '0': 'Không yêu cầu kinh nghiệm',
    '1': 'Dưới 1 năm',
    '2': '1-2 năm',
    '3': '2-5 năm',
    '4': 'Trên 5 năm'
  }
  
  return expMap[experience] || experience
}

// Get job tags
const getJobTags = (job) => {
  const tags = []
  
  if (job.type_working) {
    tags.push(formatTypeWorking(job.type_working))
  }
  
  if (job.experience && !(job.experience === "0" || job.experience === 0)) {
    tags.push(formatExperience(job.experience))
  }
  
  return tags.slice(0, 2) // Only show 2 tags
}

// Định dạng ngày
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Hôm nay'
    if (diffDays === 1) return 'Hôm qua'
    if (diffDays < 7) return `${diffDays} ngày trước`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`
    
    return date.toLocaleDateString('vi-VN')
  } catch (e) {
    return ''
  }
}

// Handle image error
const handleImageError = (e) => {
  e.target.src = '/default-company-logo.png'
}

// Lưu công việc
const toggleSave = () => {
  emit('saveJob', props.job.id)
}

// Log job info on mount
onMounted(() => {
  console.log('Job card mounted:', props.job)
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

.save-button-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: #f3f4f6;
  color: #9ca3af;
  transition: all 0.2s ease;
}

.save-button-wrapper:hover {
  background-color: #fee2e2;
  color: #ef4444;
}

.save-button-wrapper.is-saved {
  background-color: #fee2e2;
  color: #ef4444;
}

.saved-icon {
  display: none;
}

.is-saved .saved-icon {
  display: block;
}

.is-saved .not-saved-icon {
  display: none;
}
</style> 