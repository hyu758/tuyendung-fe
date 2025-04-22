<template>
  <div class="min-h-screen bg-gray-50 py-4 sm:py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header with back button -->
      <div class="flex items-center mb-4 sm:mb-6">
        <button 
          @click="router.back()" 
          class="mr-3 sm:mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          title="Quay lại"
        >
          <i class="fas fa-arrow-left text-gray-600"></i>
        </button>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 truncate">Thông tin bài đăng</h1>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="space-y-4 sm:space-y-6">
        <!-- Post information skeleton -->
        <div class="bg-white shadow rounded-lg overflow-hidden mb-4 sm:mb-6">
          <div class="p-4 sm:p-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between">
              <div class="flex-1">
                <div class="h-7 bg-gray-200 rounded w-3/5 animate-pulse"></div>
                <div class="flex mt-2 items-center">
                  <div class="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div class="mx-2 h-5 bg-gray-200 rounded w-1 animate-pulse"></div>
                  <div class="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              </div>
              <div class="mt-4 md:mt-0">
                <div class="h-6 bg-gray-200 rounded-full w-24 animate-pulse"></div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div class="flex flex-col">
                <div class="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div class="h-6 bg-gray-200 rounded w-40 mt-1 animate-pulse"></div>
              </div>
              <div class="flex flex-col">
                <div class="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div class="h-6 bg-gray-200 rounded w-40 mt-1 animate-pulse"></div>
              </div>
              <div class="flex flex-col">
                <div class="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div class="h-6 bg-gray-200 rounded w-16 mt-1 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- CV List Title skeleton -->
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <div class="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div class="h-6 bg-gray-200 rounded-full w-24 animate-pulse"></div>
        </div>

        <!-- CV List skeleton for mobile -->
        <div class="block sm:hidden space-y-3">
          <div v-for="i in 3" :key="`mobile-${i}`" class="bg-white shadow rounded-lg p-4 animate-pulse">
            <div class="flex items-center mb-3">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200"></div>
              <div class="ml-3 flex-1">
                <div class="h-5 bg-gray-200 rounded w-40 mb-1"></div>
                <div class="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div class="flex flex-col space-y-2">
              <div class="flex items-center">
                <div class="w-5 h-5 bg-gray-200 rounded-full mr-3"></div>
                <div class="h-5 bg-gray-200 rounded w-32"></div>
              </div>
              <div class="flex items-center">
                <div class="w-5 h-5 bg-gray-200 rounded-full mr-3"></div>
                <div class="h-5 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div class="mt-3 flex justify-between items-center">
              <div class="h-6 bg-gray-200 rounded-full w-24"></div>
              <div class="flex space-x-3">
                <div class="w-5 h-5 bg-gray-200 rounded-full"></div>
                <div class="w-5 h-5 bg-gray-200 rounded-full"></div>
                <div class="w-5 h-5 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- CV List skeleton for desktop -->
        <div class="hidden sm:block bg-white shadow rounded-lg overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ứng viên</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thông tin liên hệ</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="i in 3" :key="i" class="animate-pulse">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200"></div>
                    <div class="ml-4">
                      <div class="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                      <div class="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center mb-2">
                    <div class="w-5 h-5 bg-gray-200 rounded-full mr-3"></div>
                    <div class="h-5 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div class="flex items-center">
                    <div class="w-5 h-5 bg-gray-200 rounded-full mr-3"></div>
                    <div class="h-5 bg-gray-200 rounded w-24"></div>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="h-6 bg-gray-200 rounded-full w-24 mx-auto"></div>
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="flex justify-center space-x-3">
                    <div class="w-5 h-5 bg-gray-200 rounded-full"></div>
                    <div class="w-5 h-5 bg-gray-200 rounded-full"></div>
                    <div class="w-5 h-5 bg-gray-200 rounded-full"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Actual content -->
      <div v-else>
        <!-- Post information -->
        <div class="bg-white shadow rounded-lg overflow-hidden mb-4 sm:mb-6">
          <div class="p-4 sm:p-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 class="text-lg sm:text-xl font-bold text-gray-900">{{ post.title }}</h2>
                <div class="text-xs sm:text-sm text-gray-500 mt-1">
                  <span>{{ formatDate(post.created_at) }}</span>
                  <span class="mx-1">•</span>
                  <span>{{ post.city }}</span>
                </div>
              </div>
              <div class="mt-3 md:mt-0">
                <span
                  :class="[
                    'px-3 py-1 text-xs font-medium rounded-full',
                    post.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ post.is_active ? 'Đang hiển thị' : 'Đã ẩn' }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 sm:mt-6">
              <div class="flex flex-col">
                <span class="text-xs sm:text-sm font-medium text-gray-500">Tiêu đề tin đăng</span>
                <span class="text-sm sm:text-base text-gray-900">{{ post.title }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs sm:text-sm font-medium text-gray-500">Vị trí</span>
                <span class="text-sm sm:text-base text-gray-900">{{ post.position_name }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs sm:text-sm font-medium text-gray-500">Số lượng</span>
                <span class="text-sm sm:text-base text-gray-900">{{ post.quantity }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Title for CV list -->
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900">Danh sách ứng viên</h2>
          <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
            {{ canViewSubmittedCVs ? `${filteredCVs.length} ứng viên` : 'Nâng cấp để xem' }}
          </span>
        </div>
        
        <!-- Premium warning if not allowed to view CVs -->
        <div v-if="!canViewSubmittedCVs" class="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <i class="fas fa-crown text-yellow-500 mt-0.5"></i>
          <div>
            <h3 class="font-medium text-gray-900">Tính năng giới hạn</h3>
            <p class="text-sm text-gray-600 mt-1">
              Bạn cần nâng cấp lên gói Premium để xem số lượng CV đã nộp cho bài đăng này.
              <router-link to="/premium" class="text-blue-600 hover:underline font-medium">Nâng cấp ngay</router-link>
            </p>
          </div>
        </div>

        <!-- Filter options -->
        <div class="bg-white shadow rounded-lg p-3 sm:p-4 mb-4">
          <div class="mb-3 sm:mb-4 border-b border-gray-200 overflow-x-auto">
            <nav class="-mb-px flex space-x-4 whitespace-nowrap">
              <button
                @click="activeTab = 'all'"
                :class="[
                  'py-2 px-1 border-b-2 font-medium text-xs sm:text-sm',
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Tất cả ứng viên
              </button>
              <button
                @click="activeTab = 'filter'; loadFilteredCVs()"
                :class="[
                  'py-2 px-1 border-b-2 font-medium text-xs sm:text-sm',
                  activeTab === 'filter'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Lọc ứng viên
              </button>
            </nav>
          </div>

          <div v-if="activeTab === 'filter'" class="flex flex-wrap items-center gap-2">
            <div class="w-full sm:w-auto mb-2 sm:mb-0 sm:mr-4">
              <label for="statusFilter" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select 
                id="statusFilter" 
                v-model="statusFilter" 
                class="block w-full pl-3 pr-10 py-1.5 sm:py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chưa xử lý</option>
                <option value="approved">Đã tiếp nhận</option>
                <option value="rejected">Đã từ chối</option>
              </select>
            </div>
            
            <div class="w-full sm:w-auto mb-2 sm:mb-0 sm:mr-4">
              <label for="viewFilter" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Đã xem</label>
              <select 
                id="viewFilter" 
                v-model="viewedFilter" 
                class="block w-full pl-3 pr-10 py-1.5 sm:py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                <option value="all">Tất cả</option>
                <option value="viewed">Đã xem</option>
                <option value="not_viewed">Chưa xem</option>
              </select>
            </div>
            
            <div class="flex space-x-2 mt-2 sm:mt-auto">
              <button 
                @click="applyFilters"
                class="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i class="fas fa-search mr-1 sm:mr-2"></i>
                Lọc
              </button>
              
              <button 
                @click="resetFilters" 
                class="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i class="fas fa-redo-alt mr-1 sm:mr-2"></i>
                Đặt lại
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile CV List as Cards -->
        <div class="block sm:hidden space-y-3">
          <div v-for="(cv, index) in filteredCVs" :key="`mobile-${cv.id}`" 
            class="bg-white shadow rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
            <!-- Applicant Info -->
            <div class="flex items-center mb-3">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <i class="fas fa-user text-gray-500"></i>
              </div>
              <div class="ml-3 flex-1">
                <div class="text-sm font-medium text-gray-900">{{ cv.name }}</div>
                <div class="text-xs text-gray-500 mt-0.5">{{ cv.description }}</div>
              </div>
            </div>
            
            <!-- Contact Info -->
            <div class="text-xs text-gray-900 space-y-1.5">
              <div class="flex items-center">
                <i class="fas fa-envelope text-gray-400 w-4 mr-2"></i>
                <span class="truncate">{{ cv.email }}</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-phone text-gray-400 w-4 mr-2"></i>
                <span>{{ cv.phone_number }}</span>
              </div>
            </div>
            
            <!-- Status and Actions -->
            <div class="mt-3 flex justify-between items-center">
              <span
                :class="[
                  'px-2.5 py-1 text-xs font-medium rounded-full',
                  getStatusClass(cv)
                ]"
              >
                {{ getStatusText(cv) }}
              </span>
              
              <div class="flex space-x-4">
                <router-link
                  :to="{ name: 'CVDetail', params: { id: cv.id }}"
                  class="text-gray-500 hover:text-blue-600 transition-colors"
                  title="Xem chi tiết CV"
                >
                  <i class="fas fa-eye"></i>
                </router-link>
                <a
                  :href="cv.cv_file_url"
                  download
                  class="text-gray-500 hover:text-blue-600 transition-colors"
                  title="Tải xuống CV"
                >
                  <i class="fas fa-download"></i>
                </a>
                
                <div class="relative">
                  <button
                    @click="toggleDropdown(index)"
                    class="text-gray-500 hover:text-blue-600 transition-colors"
                    title="Thay đổi trạng thái"
                  >
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                  
                  <!-- Dropdown menu -->
                  <div
                    v-if="activeDropdownIndex === index"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
                  >
                    <div class="py-1">
                      <button
                        @click="updateCVStatus(cv.id, 'pending')"
                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Chưa xử lý
                      </button>
                      <button
                        @click="updateCVStatus(cv.id, 'approved')"
                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Tiếp nhận
                      </button>
                      <button
                        @click="updateCVStatus(cv.id, 'rejected')"
                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty state for mobile -->
          <div v-if="filteredCVs.length === 0" class="bg-white shadow rounded-lg p-6 text-center">
            <div class="flex flex-col items-center">
              <i class="fas fa-file-alt text-3xl text-gray-300 mb-2"></i>
              <h3 class="text-base font-medium text-gray-900">Chưa có ứng viên nào</h3>
              <p class="mt-1 text-xs text-gray-500">Bài đăng chưa nhận được CV ứng tuyển</p>
            </div>
          </div>
        </div>

        <!-- Desktop CV List as Table -->
        <div class="hidden sm:block bg-white shadow rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ứng viên</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thông tin liên hệ</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(cv, index) in filteredCVs" :key="index" class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <i class="fas fa-user text-gray-500"></i>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ cv.name }}</div>
                        <div class="text-sm text-gray-500 mt-1">{{ cv.description }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">
                      <div class="flex items-center">
                        <i class="fas fa-envelope text-gray-400 w-5"></i>
                        <span>{{ cv.email }}</span>
                      </div>
                    </div>
                    <div class="text-sm text-gray-900 mt-1">
                      <div class="flex items-center">
                        <i class="fas fa-phone text-gray-400 w-5"></i>
                        <span>{{ cv.phone_number }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span
                      :class="[
                        'px-3 py-1 text-xs font-medium rounded-full',
                        getStatusClass(cv)
                      ]"
                    >
                      {{ getStatusText(cv) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <div class="flex justify-center space-x-3">
                      <router-link
                        :to="{ name: 'CVDetail', params: { id: cv.id }}"
                        class="text-gray-400 hover:text-blue-500 transition-colors duration-200 cursor-pointer"
                        title="Xem chi tiết CV"
                      >
                        <i class="fas fa-eye"></i>
                      </router-link>
                      <a
                        :href="cv.cv_file_url"
                        download
                        class="text-gray-400 hover:text-blue-500 transition-colors duration-200 cursor-pointer"
                        title="Tải xuống CV"
                      >
                        <i class="fas fa-download"></i>
                      </a>
                      
                      <div class="relative inline-block">
                        <button
                          @click="toggleDropdown(index)"
                          class="text-gray-400 hover:text-blue-500 transition-colors duration-200 cursor-pointer"
                          title="Thay đổi trạng thái"
                        >
                          <i class="fas fa-ellipsis-v"></i>
                        </button>
                        
                        <!-- Dropdown menu -->
                        <div
                          v-if="activeDropdownIndex === index"
                          class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
                        >
                          <div class="py-1">
                            <button
                              @click="updateCVStatus(cv.id, 'pending')"
                              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Chưa xử lý
                            </button>
                            <button
                              @click="updateCVStatus(cv.id, 'approved')"
                              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Tiếp nhận
                            </button>
                            <button
                              @click="updateCVStatus(cv.id, 'rejected')"
                              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Từ chối
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                
                <!-- Empty state -->
                <tr v-if="filteredCVs.length === 0">
                  <td colspan="4" class="px-6 py-10 text-center">
                    <div class="flex flex-col items-center">
                      <i class="fas fa-file-alt text-4xl text-gray-300 mb-3"></i>
                      <h3 class="text-lg font-medium text-gray-900">Chưa có ứng viên nào</h3>
                      <p class="mt-1 text-sm text-gray-500">Bài đăng chưa nhận được CV ứng tuyển</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '../../stores/post'
import { useCVStore } from '../../stores/cv'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const cvStore = useCVStore()
const loading = ref(true)
const post = ref({})
const cvList = computed(() => cvStore.cvs)
const activeDropdownIndex = ref(null)
const statusFilter = ref('all')
const viewedFilter = ref('all')
const activeTab = ref('all')
const canViewSubmittedCVs = ref(true)

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (activeDropdownIndex.value !== null) {
    activeDropdownIndex.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleDropdown = (index) => {
  // Stop event propagation to prevent immediate closing
  event.stopPropagation()
  
  if (activeDropdownIndex.value === index) {
    activeDropdownIndex.value = null
  } else {
    activeDropdownIndex.value = index
  }
}

// Format date
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

const getStatusClass = (cv) => {
  if (cv.status === 'approved') {
    return 'bg-green-100 text-green-800'
  } else if (cv.status === 'rejected') {
    return 'bg-red-100 text-red-800'
  } 
  else if (cv.is_viewed) {
    return 'bg-blue-100 text-blue-800'
  } else {
    return 'bg-yellow-100 text-yellow-800'
  }
}

const getStatusText = (cv) => {
  if (cv.status === 'approved') {
    return 'Đã tiếp nhận'
  } else if (cv.status === 'rejected') {
    return 'Đã từ chối'
  } 
  else if (cv.is_viewed) {
    return 'Đã xem'
  } else {
    return 'Chưa xem'
  }
}

// Load post details and CV list
const loadData = async () => {
  try {
    loading.value = true
    
    // Load post details
    const postId = route.params.id
    const postResult = await postStore.fetchPostById(postId)
    if (postResult && postResult.data && postResult.data.data) {
      post.value = postResult.data.data
      // Kiểm tra quyền xem CV đã nộp
      canViewSubmittedCVs.value = post.value.can_view_submitted_cvs === true
    }
    
    // Tải CV chỉ khi có quyền xem
    if (canViewSubmittedCVs.value) {
      await cvStore.fetchCVsByPostId(postId)
    }
    
  } catch (err) {
    console.error('Error loading data:', err)
  } finally {
    loading.value = false
  }
}

// Đánh dấu CV đã xem
const markAsViewed = async (cvId) => {
  try {
    await cvStore.markCVAsViewed(cvId)
  } catch (err) {
    console.error('Error marking CV as viewed:', err)
  }
}

// Cập nhật trạng thái CV
const updateCVStatus = async (cvId, status) => {
  try {
    activeDropdownIndex.value = null
    await cvStore.updateCVStatus(cvId, status)
  } catch (err) {
    console.error('Error updating CV status:', err)
  }
}

// Filter CVs based on activeTab
const filteredCVs = computed(() => {
  // If tab is 'all', show all CVs
  if (activeTab.value === 'all') {
    return cvList.value;
  }
  
  // If tab is 'filter', apply local filtering
  let filtered = cvList.value
  
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(cv => cv.status === statusFilter.value)
  }
  
  if (viewedFilter.value !== 'all') {
    filtered = filtered.filter(cv => cv.is_viewed === (viewedFilter.value === 'viewed'))
  }
  
  return filtered
})

// Apply filters by fetching from API
const applyFilters = async () => {
  try {
    loading.value = true
    
    if (activeTab.value === 'filter') {
      const status = statusFilter.value !== 'all' ? statusFilter.value : null
      const isViewed = viewedFilter.value !== 'all' ? (viewedFilter.value === 'viewed') : null
      
      // Điều kiện tổng hợp với postId
      const postId = route.params.id
      await cvStore.fetchCVsByPostId(postId)
      
      // Apply local filtering after fetching data
      // (Backend doesn't have combined filtering for both status and post_id)
    }
    
  } catch (err) {
    console.error('Error applying filters:', err)
  } finally {
    loading.value = false
  }
}

// Load CVs with filters
const loadFilteredCVs = async () => {
  await applyFilters()
}

// Reset filters
const resetFilters = () => {
  statusFilter.value = 'all'
  viewedFilter.value = 'all'
  applyFilters()
}

// Load data when component is mounted
onMounted(loadData)
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