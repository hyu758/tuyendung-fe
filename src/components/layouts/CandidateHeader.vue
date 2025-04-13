<template>
  <header class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="text-2xl font-bold text-blue-600">
            <div class = "flex items-center py-0.5">
              <img src="../../assets/logo.png" alt="JobHub" class="w-11 h-11 mr-1">
              <p>JobHub</p>
            </div>
          </router-link>
          
          <!-- Menu chính -->
          <nav class="hidden md:flex ml-10 space-x-6">
            <router-link to="/job-search" class="text-gray-700 hover:text-blue-600 font-medium">
              Tìm việc
            </router-link>
            <router-link to="/enterprises" class="text-gray-700 hover:text-blue-600 font-medium">
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
            <div class="hidden md:flex items-center space-x-3">
              <!-- Tin nhắn -->
              <router-link 
                to="/candidate/messages" 
                class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                title="Tin nhắn"
              >
                <i class="fas fa-comment-dots text-xl"></i>
              </router-link>
              
              <!-- Notifications -->
              <NotificationDropdown />

              <!-- Chat Messages -->
              <chat-dropdown />
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
import NotificationDropdown from '../common/NotificationDropdown.vue'
import ChatDropdown from '../common/ChatDropdown.vue'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const showDropdown = ref(false)
const profileDropdown = ref(null)

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
}

const handleClickOutside = (event) => {
  if (profileDropdown.value && !profileDropdown.value.contains(event.target)) {
    showDropdown.value = false
  }
}

const logout = () => {
  authStore.logout()
  notificationStore.resetStore()
  showDropdown.value = false
}
</script> 