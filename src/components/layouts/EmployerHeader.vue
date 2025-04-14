<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-blue-600 hover:text-blue-700">
            <div class = "flex items-center">
              <img src="../../assets/logo.png" alt="JobHub" class="w-10 h-10 mr-2">
              <p>JobHub</p>
            </div>
          </router-link>
        </div>

        <!-- Right Menu -->
        <div class="flex items-center space-x-6">
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

          <!-- Tin nhắn -->
          <router-link 
            to="/employer/messages" 
            class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full relative"
            title="Tin nhắn"
          >
            <i class="fas fa-comment-dots text-xl"></i>
            <span 
              v-if="chatStore?.unreadCount > 0" 
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
            >
              {{ chatStore.unreadCount > 9 ? '9+' : chatStore.unreadCount }}
            </span>
          </router-link>

          <!-- User Menu -->
          <div class="relative" ref="profileDropdown">
            <button 
              @click="toggleDropdown"
              class="flex items-center space-x-3 text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <i class="fas fa-user text-gray-500"></i>
              </div>
              <i class="fas fa-chevron-down text-sm text-gray-400"></i>
            </button>

            <!-- Dropdown -->
            <div 
              v-if="showDropdown"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
            >
              <div class="px-4 py-2 border-b border-gray-100">
                <p class="text-sm font-medium text-gray-900">{{ userFullName || username }}</p>
                <p class="text-xs text-gray-500">Nhà tuyển dụng</p>
              </div>

              <router-link 
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <i class="fas fa-user-circle mr-2"></i> Tài khoản
              </router-link>

              <router-link 
                to="/settings"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <i class="fas fa-cog mr-2"></i> Cài đặt
              </router-link>

              <div class="border-t border-gray-100"></div>

              <a 
                href="#"
                @click.prevent="logout"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <i class="fas fa-sign-out-alt mr-2"></i> Đăng xuất
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Thông báo tài khoản chưa kích hoạt -->
  <div v-if="isAuthenticated && !isActive" class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
    <div class="container mx-auto px-4 flex items-center justify-between">
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle text-yellow-400 mr-3"></i>
        <p class="text-sm text-yellow-700">
          Tài khoản của bạn chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt.
        </p>
      </div>
      <router-link 
        to="/activate"
        class="text-sm font-medium text-yellow-700 underline hover:text-yellow-600"
      >
        Gửi lại mã
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useNotificationStore } from '../../stores/notification'
import { useChatStore } from '../../stores/chat'
import ChatDropdown from '../common/ChatDropdown.vue'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const chatStore = useChatStore()
const showDropdown = ref(false)
const showNotifications = ref(false)
const profileDropdown = ref(null)
const notificationDropdown = ref(null)

// Sử dụng thông tin từ authStore
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isActive = computed(() => authStore.isActivated)
const userFullName = computed(() => authStore.userFullName)
const username = ref(localStorage.getItem('username') || 'Người dùng')

onMounted(async () => {
  if (isAuthenticated.value && !authStore.user) {
    authStore.updateUserFromToken()
  }
  
  // Lấy số lượng thông báo chưa đọc khi component được mounted
  if (isAuthenticated.value) {
    await notificationStore.fetchUnreadCount()
  }
  
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
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