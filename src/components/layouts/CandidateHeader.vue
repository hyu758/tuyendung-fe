<template>
  <header class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="text-2xl font-bold text-blue-600">
            JobHub
          </router-link>
          
          <!-- Menu chính -->
          <nav class="hidden md:flex ml-10 space-x-6">
            <router-link to="/job-search" class="text-gray-700 hover:text-blue-600 font-medium">
              Tìm việc
            </router-link>
            <router-link to="/companies" class="text-gray-700 hover:text-blue-600 font-medium">
              Công ty
            </router-link>
            <router-link to="/blog" class="text-gray-700 hover:text-blue-600 font-medium">
              Blog
            </router-link>
          </nav>
        </div>

        <!-- Navigation Menu (right side) -->
        <nav class="flex items-center space-x-4">
          <!-- Menu cho người dùng chưa đăng nhập -->
          <template v-if="!isAuthenticated">
            <router-link to="/login" class="text-gray-700 hover:text-blue-600 font-medium">
              Đăng nhập
            </router-link>
            <router-link 
              to="/register" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
            >
              Đăng ký
            </router-link>
          </template>
          
          <!-- Menu cho người dùng đã đăng nhập -->
          <template v-else>
            <!-- Notifications -->
            <div class="relative" ref="notificationDropdown">
              <button 
                @click="toggleNotifications"
                class="text-gray-500 hover:text-gray-600 relative"
              >
                <i class="fas fa-bell text-xl"></i>
                <span 
                  v-if="notificationStore.hasUnread" 
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
                >
                  {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
                </span>
              </button>

              <!-- Notifications Dropdown -->
              <div 
                v-if="showNotifications"
                class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200 max-h-[400px] overflow-y-auto"
              >
                <div class="px-4 py-2 border-b border-gray-100 sticky top-0 bg-white z-10">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-medium text-gray-900">Thông báo</h3>
                    <span v-if="notificationStore.hasUnread" class="text-xs font-medium text-blue-600">
                      {{ notificationStore.unreadCount }} chưa đọc
                    </span>
                  </div>
                </div>

                <div v-if="notificationStore.loading" class="py-4 text-center">
                  <i class="fas fa-circle-notch fa-spin text-blue-500"></i>
                </div>

                <div v-else-if="notificationStore.hasNotifications">
                  <div 
                    v-for="notification in notificationStore.notifications" 
                    :key="notification.id"
                    :class="['px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors', 
                      !notification.read ? 'bg-blue-50' : '']"
                    @click="readNotification(notification.id)"
                  >
                    <div class="flex items-start">
                      <div class="flex-shrink-0 mt-0.5">
                        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <i class="fas fa-bell text-blue-500 text-sm"></i>
                        </div>
                      </div>
                      <div class="ml-3 flex-1">
                        <p class="text-sm text-gray-800" v-html="notification.message"></p>
                        <p class="text-xs text-gray-500 mt-1">{{ formatDate(notification.created_at) }}</p>
                      </div>
                      <div v-if="!notification.read" class="ml-2 flex-shrink-0">
                        <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                    </div>
                  </div>

                  <div v-if="notificationStore.hasMore" class="px-4 py-2 text-center">
                    <button 
                      @click="loadMoreNotifications"
                      class="text-xs text-blue-600 hover:text-blue-800"
                      :disabled="notificationStore.loading"
                    >
                      <span v-if="notificationStore.loading">Đang tải...</span>
                      <span v-else>Xem thêm</span>
                    </button>
                  </div>
                </div>

                <div v-else class="py-6 text-center">
                  <i class="fas fa-bell-slash text-gray-300 text-2xl mb-2"></i>
                  <p class="text-sm text-gray-500">Bạn chưa có thông báo nào</p>
                </div>
              </div>
            </div>

            <!-- User profile dropdown -->
            <div class="relative" ref="profileDropdown">
              <button 
                @click="toggleDropdown" 
                class="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <span class="mr-1 font-medium">{{ userFullName || username }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <!-- Dropdown Menu -->
              <div 
                v-if="showDropdown" 
                class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
              >
                <!-- Menu cá nhân -->
                <div>
                  <router-link 
                    to="/profile" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <i class="fas fa-user mr-2"></i> Hồ sơ cá nhân
                  </router-link>
                  
                  <router-link 
                    to="/my-applications" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <i class="fas fa-file-alt mr-2"></i> Đơn ứng tuyển
                  </router-link>
                  
                  <router-link 
                    to="/saved-jobs" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <i class="fas fa-bookmark mr-2"></i> Việc đã lưu
                  </router-link>
                </div>
                
                <div class="border-t border-gray-100 my-1"></div>
                
                <a 
                  href="#" 
                  @click.prevent="logout" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-sign-out-alt mr-2"></i> Đăng xuất
                </a>
              </div>
            </div>
          </template>
        </nav>
      </div>
    </div>
  </header>

  <!-- Thông báo tài khoản chưa kích hoạt -->
  <div v-if="isAuthenticated && !isActive" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
    <div class="container mx-auto px-4 flex items-center justify-between">
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle mr-2"></i>
        <p>Tài khoản của bạn chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản.</p>
      </div>
      <router-link to="/activate" class="text-blue-600 hover:text-blue-800 underline font-medium">
        Gửi lại mã kích hoạt
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useNotificationStore } from '../../stores/notification'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const showDropdown = ref(false)
const showNotifications = ref(false)
const profileDropdown = ref(null)
const notificationDropdown = ref(null)

// Sử dụng thông tin từ authStore
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isActive = computed(() => authStore.isActivated)
const userRole = computed(() => authStore.userRole)
const userFullName = computed(() => authStore.userFullName)

// Giữ lại biến username từ localStorage cho trường hợp chưa lấy được thông tin người dùng
const username = ref('')

watch(() => authStore.user, (newUser) => {
  if (newUser) {
    console.log('New user is_active:', newUser.is_active)
  }
}, { deep: true, immediate: true })

onMounted(async () => {
  // Lấy username từ localStorage để hiển thị ban đầu
  username.value = localStorage.getItem('username') || 'Người dùng'
  
  // Kiểm tra thông tin từ token
  if (isAuthenticated.value) {
    if (!authStore.user) {
      authStore.updateUserFromToken()
    }
    
    // Lấy số lượng thông báo chưa đọc khi component được mounted
    await notificationStore.fetchUnreadCount()
  }
  
  // Thêm xử lý sự kiện click ngoài dropdown để đóng nó
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // Loại bỏ event listener khi component bị hủy
  document.removeEventListener('click', handleClickOutside)
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  if (showNotifications.value) {
    showNotifications.value = false
  }
}

const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value
  if (showDropdown.value) {
    showDropdown.value = false
  }
  
  // Tải thông báo khi mở dropdown
  if (showNotifications.value && !notificationStore.hasNotifications) {
    await notificationStore.fetchNotifications(true)
  }
}

const handleClickOutside = (event) => {
  if (profileDropdown.value && !profileDropdown.value.contains(event.target)) {
    showDropdown.value = false
  }
  
  if (notificationDropdown.value && !notificationDropdown.value.contains(event.target)) {
    showNotifications.value = false
  }
}

const loadMoreNotifications = async () => {
  await notificationStore.fetchNotifications()
}

const readNotification = async (id) => {
  await notificationStore.markAsRead(id)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now - date
  
  // Thời gian đã trôi qua (tính bằng phút)
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  
  if (diffInMinutes < 1) {
    return 'Vừa xong'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`
  } else if (diffInMinutes < 24 * 60) {
    return `${Math.floor(diffInMinutes / 60)} giờ trước`
  } else if (diffInMinutes < 7 * 24 * 60) {
    return `${Math.floor(diffInMinutes / (24 * 60))} ngày trước`
  } else {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

const logout = () => {
  authStore.logout()
  notificationStore.resetStore()
  showDropdown.value = false
}
</script> 