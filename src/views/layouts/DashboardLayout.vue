<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white h-full border-r border-gray-200">
      <!-- Logo -->
      <div class="p-4 border-b border-gray-200">
        <router-link to="/" class="flex items-center">
          <h1 class="text-xl font-bold text-blue-600">JobHub</h1>
        </router-link>
        <p class="text-sm text-gray-500">Quản lý tuyển dụng</p>
      </div>
      
      <!-- Menu -->
      <nav class="mt-2">
        <div class="px-4 mb-2">
          <p class="text-xs text-gray-500 uppercase font-medium mb-2">TỔNG QUAN</p>
          <router-link 
            to="/dashboard" 
            class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            :class="{ 'bg-blue-50 text-blue-600 font-medium': isActivePage('/dashboard') }"
          >
            <i class="fas fa-tachometer-alt mr-3 w-5 text-center"></i> Bảng điều khiển
          </router-link>
        </div>
        
        <div class="px-4 mb-2">
          <p class="text-xs text-gray-500 uppercase font-medium mb-2">TUYỂN DỤNG</p>
          <template v-if="authStore.isEmployer">
            <router-link 
              to="/enterprise/profile" 
              class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              :class="{ 'bg-blue-50 text-blue-600 font-medium': isActivePage('/enterprise/profile') }"
            >
              <i class="fas fa-building mr-3 w-5 text-center"></i> Thông tin doanh nghiệp
            </router-link>
            <router-link 
              to="/campaigns" 
              class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              :class="{ 'bg-blue-50 text-blue-600 font-medium': isActivePage('/campaigns') }"
            >
              <i class="fas fa-bullhorn mr-3 w-5 text-center"></i> Chiến dịch tuyển dụng
            </router-link>
            <router-link 
              to="/job-listings" 
              class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              :class="{ 'bg-blue-50 text-blue-600 font-medium': isActivePage('/job-listings') }"
            >
              <i class="fas fa-briefcase mr-3 w-5 text-center"></i> Tin tuyển dụng
            </router-link>
            <router-link 
              to="/employer/applications" 
              class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              :class="{ 'bg-blue-50 text-blue-600 font-medium': isActivePage('/employer/applications') }"
            >
              <i class="fas fa-users mr-3 w-5 text-center"></i> Quản lý ứng viên
            </router-link>
          </template>
          
          <template v-else-if="authStore.isCandidate">
            <router-link 
              to="/profile" 
              class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              :class="{ 'bg-blue-50 text-blue-600 font-medium': isActivePage('/profile') }"
            >
              <i class="fas fa-user mr-3 w-5 text-center"></i> Hồ sơ cá nhân
            </router-link>
            <router-link 
              to="/my-applications" 
              class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              :class="{ 'bg-blue-50 text-blue-600 font-medium': isActivePage('/my-applications') }"
            >
              <i class="fas fa-paper-plane mr-3 w-5 text-center"></i> Đơn ứng tuyển
            </router-link>
            <router-link 
              to="/saved-jobs" 
              class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              :class="{ 'bg-blue-50 text-blue-600 font-medium': isActivePage('/saved-jobs') }"
            >
              <i class="fas fa-bookmark mr-3 w-5 text-center"></i> Tin đã lưu
            </router-link>
          </template>
          
          <template v-else-if="authStore.isAdmin">
            <router-link 
              to="/admin/users" 
              class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              :class="{ 'bg-blue-50 text-blue-600 font-medium': isActivePage('/admin/users') }"
            >
              <i class="fas fa-users-cog mr-3 w-5 text-center"></i> Quản lý người dùng
            </router-link>
            <router-link 
              to="/admin/companies" 
              class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              :class="{ 'bg-blue-50 text-blue-600 font-medium': isActivePage('/admin/companies') }"
            >
              <i class="fas fa-building mr-3 w-5 text-center"></i> Quản lý doanh nghiệp
            </router-link>
            <router-link 
              to="/admin/jobs" 
              class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              :class="{ 'bg-blue-50 text-blue-600 font-medium': isActivePage('/admin/jobs') }"
            >
              <i class="fas fa-briefcase mr-3 w-5 text-center"></i> Quản lý tin tuyển dụng
            </router-link>
          </template>
        </div>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header navbar -->
      <header class="bg-white border-b border-gray-200">
        <div class="flex justify-between items-center px-4 py-2.5">
          <div class="flex items-center space-x-4">
            <h2 class="text-lg font-medium text-gray-800">{{ pageTitle }}</h2>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Tìm kiếm -->
            <div class="relative">
              <input 
                type="text"
                placeholder="Tìm kiếm công việc..."
                class="border border-gray-300 rounded-md py-1.5 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
              <button class="absolute right-0 top-0 h-full px-3 text-gray-500">
                <i class="fas fa-search"></i>
              </button>
            </div>
            
            <!-- Nút thông báo -->
            <div class="relative">
              <button class="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                <i class="fas fa-bell"></i>
                <span v-if="hasNotifications" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {{ notificationCount }}
                </span>
              </button>
            </div>
            
            <!-- User dropdown -->
            <div class="relative" ref="userMenuContainer">
              <button 
                @click="toggleUserMenu" 
                class="flex items-center space-x-1 focus:outline-none py-1 px-2 rounded-md hover:bg-gray-100"
              >
                <img 
                  src="https://via.placeholder.com/40" 
                  alt="Avatar" 
                  class="w-7 h-7 rounded-full object-cover"
                />
                <span class="text-sm text-gray-700">{{ authStore.fullName || 'Người dùng' }}</span>
                <i class="fas fa-chevron-down text-gray-500 text-xs"></i>
              </button>
              
              <!-- Dropdown menu -->
              <div 
                v-if="showUserMenu" 
                class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
              >
                <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <i class="fas fa-user mr-2"></i> Hồ sơ cá nhân
                </router-link>
                <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <i class="fas fa-cog mr-2"></i> Cài đặt
                </router-link>
                <div class="border-t border-gray-100 my-1"></div>
                <button @click="logout" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <i class="fas fa-sign-out-alt mr-2"></i> Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Content area -->
      <main class="flex-1 overflow-y-auto p-4 bg-gray-50">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

// State
const showUserMenu = ref(false)
const userMenuContainer = ref(null)
const hasNotifications = ref(false)
const notificationCount = ref(0)

// Computed
const pageTitle = computed(() => {
  // Xác định tiêu đề trang dựa vào route hiện tại
  const path = route.path
  if (path === '/dashboard') return 'Bảng điều khiển'
  if (path === '/enterprise/profile') return 'Thông tin doanh nghiệp'
  if (path === '/campaigns') return 'Quản lý chiến dịch tuyển dụng'
  if (path.startsWith('/campaigns/')) return 'Chi tiết chiến dịch'
  if (path === '/job-listings') return 'Quản lý tin tuyển dụng'
  if (path === '/employer/applications') return 'Quản lý ứng viên'
  if (path === '/profile') return 'Hồ sơ cá nhân'
  if (path === '/admin/users') return 'Quản lý người dùng'
  if (path === '/admin/companies') return 'Quản lý doanh nghiệp'
  if (path === '/admin/jobs') return 'Quản lý tin tuyển dụng'
  // Các route khác...
  return 'Trang quản lý'
})

// Methods
const isActivePage = (path) => {
  return route.path.startsWith(path)
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const closeUserMenu = (event) => {
  if (userMenuContainer.value && !userMenuContainer.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error)
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', closeUserMenu)
  
  // Demo thông báo - có thể thay thế bằng API thực tế
  hasNotifications.value = true
  notificationCount.value = 3
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeUserMenu)
})
</script>

<style scoped>
/* Base styling mượt mà hơn */
aside {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

.router-link-active {
  font-weight: 500;
}
</style>
