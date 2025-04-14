<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30">
      <div class="flex items-center justify-center h-16 border-b border-gray-200">
        <router-link to="/" class="text-xl font-bold text-blue-600 hover:text-blue-700">
          JobHub
        </router-link>
      </div>
      
      <nav class="mt-6 px-4">
        <div class="space-y-4">
          <!-- User Profile Section -->
          <div class="pb-4 border-b border-gray-200">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <i class="fas fa-user text-gray-500" />
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">{{ userFullName }}</p>
                <p class="text-xs text-gray-500">Nhà tuyển dụng</p>
              </div>
            </div>
          </div>

          <!-- Navigation Links -->
          <router-link 
            to="/employer/profile"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            :class="{ 'bg-blue-50 text-blue-600': isCurrentRoute('/employer/profile') }"
          >
            <font-awesome-icon icon="user-circle" class="w-5 h-5 mr-3" />
            <span>Thông tin cá nhân</span>
          </router-link>

          <router-link 
            to="/employer/company"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            :class="{ 'bg-blue-50 text-blue-600': isCurrentRoute('/employer/company') }"
          >
            <font-awesome-icon icon="building" class="w-5 h-5 mr-3" />
            <span>Thông tin công ty</span>
          </router-link>

          <router-link 
            to="/employer/posts"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            :class="{ 'bg-blue-50 text-blue-600': isCurrentRoute('/employer/jobs') }"
          >
            <font-awesome-icon icon="briefcase" class="w-5 h-5 mr-3" />
            <span>Tin tuyển dụng</span>
          </router-link>

          <router-link 
            to="/employer/notifications"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            :class="{ 'bg-blue-50 text-blue-600': isCurrentRoute('/employer/notifications') }"
          >
            <i class="fas fa-bell w-5 h-5 mr-3"></i>
            <span>Thông báo</span>
          </router-link>

          <!-- Tin nhắn trong sidebar -->
          <router-link 
            to="/employer/messages"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition duration-200 relative"
            :class="{ 
              'bg-blue-50 text-blue-600 font-medium': isCurrentRoute('/employer/messages'), 
              'bg-red-50': unreadMessageCount > 0 && !isCurrentRoute('/employer/messages') 
            }"
          >
            <i class="fas fa-comment-dots w-5 h-5 mr-3" 
              :class="{ 'text-red-500': unreadMessageCount > 0 && !isCurrentRoute('/employer/messages') }"
            ></i>
            <span>Tin nhắn</span>
            <span 
              v-if="unreadMessageCount > 0" 
              class="ml-auto bg-red-500 text-white text-xs font-medium rounded-full px-2 py-1 min-w-[24px] text-center shadow-sm"
            >
              {{ unreadMessageCount > 99 ? '99+' : unreadMessageCount }}
            </span>
          </router-link>

          <router-link 
            to="/employer/settings"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            :class="{ 'bg-blue-50 text-blue-600': isCurrentRoute('/employer/settings') }"
          >
            <font-awesome-icon icon="cog" class="w-5 h-5 mr-3" />
            <span>Cài đặt</span>
          </router-link>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Simplified Header -->
      <header class="bg-white h-16 border-b border-gray-200">
        <div class="flex justify-end items-center h-full px-6">
          <!-- Notifications -->
          <NotificationDropdown />

          <!-- Tin nhắn -->
          <div class="ml-4 relative">
            <router-link 
              to="/employer/messages" 
              class="flex items-center text-gray-600 hover:text-blue-600 transition duration-150 relative group"
              :title="unreadMessageCount > 0 ? `Bạn có ${unreadMessageCount} tin nhắn chưa đọc` : 'Tin nhắn'"
            >
              <div class="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-50 flex items-center justify-center border border-gray-200 group-hover:border-blue-200 transition duration-200 shadow-sm relative">
                <i class="fas fa-comment-dots text-xl text-gray-600 group-hover:text-blue-600 transition-colors duration-150"></i>
                <transition name="pulse">
                  <span 
                    v-if="unreadMessageCount > 0" 
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-white animate-pulse"
                  >
                    {{ unreadMessageCount > 9 ? '9+' : unreadMessageCount }}
                  </span>
                </transition>
              </div>
            </router-link>
          </div>

          <!-- User Menu -->
          <div class="relative ml-4" ref="profileDropdown">
            <button 
              @click="toggleDropdown"
              class="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              aria-label="Menu người dùng"
              title="Menu người dùng"
              aria-expanded="false"
              :aria-expanded="showDropdown"
            >
              <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <font-awesome-icon icon="user" class="text-gray-500" />
              </div>
              <font-awesome-icon icon="chevron-down" class="text-sm text-gray-400" />
            </button>

            <!-- Dropdown Menu -->
            <div v-if="showDropdown" 
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-40"
              role="menu"
              aria-orientation="vertical"
            >
              <a href="#" 
                @click.prevent="logout"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                role="menuitem"
              >
                <font-awesome-icon icon="sign-out-alt" class="mr-2" /> Đăng xuất
              </a>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.notification-badge {
  transition: all 0.3s ease;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.pulse-enter-active, .pulse-leave-active {
  transition: all 0.5s;
}

.pulse-enter-from, .pulse-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'
import { useChatStore } from '../stores/chat'
import NotificationDropdown from '../components/employer/NotificationDropdown.vue'
import ChatNotificationButton from '../components/chat/ChatNotificationButton.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const chatStore = useChatStore()

const showDropdown = ref(false)
const profileDropdown = ref(null)

const userFullName = computed(() => authStore.userFullName || 'Người dùng')
const unreadMessageCount = computed(() => chatStore.unreadCount || 0)

// Cập nhật đồng bộ số tin nhắn chưa đọc mỗi 30 giây
let messageCheckInterval = null

const isCurrentRoute = (path) => {
  return route.path.startsWith(path)
}

// Thiết lập cập nhật tin nhắn định kỳ
const setupMessageCheck = () => {
  messageCheckInterval = setInterval(async () => {
    if (authStore.isAuthenticated) {
      try {
        await chatStore.fetchUnreadMessages()
        console.log('Cập nhật số lượng tin nhắn chưa đọc:', chatStore.unreadCount)
      } catch (error) {
        console.error('Lỗi khi cập nhật số lượng tin nhắn chưa đọc:', error)
      }
    }
  }, 30000) // Cập nhật mỗi 30 giây
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  if (!authStore.user) {
    authStore.updateUserFromToken()
  }
  
  // Tải số lượng tin nhắn chưa đọc khi component được mounted
  if (authStore.isAuthenticated) {
    try {
      await chatStore.fetchUnreadMessages()
      console.log('Số lượng tin nhắn chưa đọc:', chatStore.unreadCount)
      
      // Thiết lập cập nhật tin nhắn định kỳ
      setupMessageCheck()
    } catch (error) {
      console.error('Lỗi khi tải số lượng tin nhắn chưa đọc:', error)
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  
  // Xóa interval khi component bị hủy
  if (messageCheckInterval) {
    clearInterval(messageCheckInterval)
  }
})

// Theo dõi thay đổi trạng thái đăng nhập
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    chatStore.fetchUnreadMessages()
    setupMessageCheck()
  } else if (messageCheckInterval) {
    clearInterval(messageCheckInterval)
  }
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleClickOutside = (event) => {
  if (profileDropdown.value && !profileDropdown.value.contains(event.target)) {
    showDropdown.value = false
  }
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script> 