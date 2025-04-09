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
  <div v-else class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="p-5">
      <div class="flex justify-between items-start">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden mr-4">
            <img v-if="job.enterprise_logo" :src="job.enterprise_logo" :alt="job.enterprise_name" class="w-full h-full object-cover" />
            <span v-else class="text-gray-500 text-xl font-bold">{{ job.enterprise_name?.charAt(0) || 'J' }}</span>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800 hover:text-blue-600 truncate max-w-s">
              <router-link :to="{ name: 'JobDetail', params: { id: job.id } }">
                {{ job.title }}
              </router-link>
            </h3>
            <p class="text-gray-600 text-sm">{{ job.companyName }}</p>
          </div>
        </div>
        <span v-if="job.isFeatured" class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Nổi bật</span>
      </div>

      <div class="mt-4 space-y-2">
        <div class="flex items-center text-gray-600 text-sm">
          <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{{ job.location }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm">
          <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ job.type_working }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm">
          <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          <span class="font-medium text-blue-600">{{ getSalaryDisplay(job) }}</span>
        </div>
      </div>
      
      <div class="mt-4 flex justify-between items-center">
        <div class="flex flex-wrap gap-2">
          <span v-for="(tag, index) in job.tags?.slice(0, 3)" :key="index" class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
            {{ tag }}
          </span>
          <span v-if="job.tags?.length > 3" class="text-gray-500 text-xs">+{{ job.tags.length - 3 }}</span>
        </div>
        
        <span class="text-xs text-gray-500">{{ formatDate(job.publishDate) }}</span>
      </div>
      
      <div class="mt-5 flex space-x-2">
        <router-link 
          :to="{ name: 'JobDetail', params: { id: job.id } }" 
          class="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
        >
          Chi tiết
        </router-link>
        <button 
          v-if="showSaveButton"
          @click="toggleSave" 
          class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          :class="{ 'text-red-500 border-red-500': job.isSaved }"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path 
              v-if="job.isSaved" 
              fill-rule="evenodd" 
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
              clip-rule="evenodd" 
            />
            <path 
              v-else 
              fill-rule="evenodd" 
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
              clip-rule="evenodd" 
              stroke="currentColor"
              stroke-width="1"
              fill="none"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>

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
  console.log(job)
  if (job.is_salary_negotiable) {
    return 'Thoả thuận'
  }

  if (job.salary_min === 0 && job.salary_max > 0) {
    return `Tới ${formatSalary(job.salary_max)}`
  }

  if (job.salary_max === 0 && job.salary_min > 0) {
    return `Từ ${formatSalary(job.salary_min)}`
  }

  if (job.salary_min > 0 && job.salary_max > 0) {
    return `${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)}`
  }

  return 'Thoả thuận'
}

// Định dạng ngày
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hôm nay'
  if (diffDays === 1) return 'Hôm qua'
  if (diffDays < 7) return `${diffDays} ngày trước`
  
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

// Lưu công việc
const toggleSave = () => {
  emit('saveJob', props.job.id)
}
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
</style> 