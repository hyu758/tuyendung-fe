<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile sidebar toggle button -->
    <button 
      v-if="!showSidebar"
      @click="toggleSidebar" 
      class="md:hidden fixed top-4 left-4 z-40 bg-white rounded-md shadow-md p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
      aria-label="Mở menu"
    >
      <i class="fas fa-bars text-xl"></i>
    </button>

    <!-- Sidebar Overlay -->
    <div 
      v-if="showSidebar" 
      class="md:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <aside 
      class="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30 transition-transform duration-300 transform"
      :class="{'translate-x-0': showSidebar, '-translate-x-full md:translate-x-0': !showSidebar}"
    >
      <div class="flex items-center justify-between h-16 border-b border-gray-200 px-4">
        <router-link to="/" class="text-xl font-bold text-blue-600 hover:text-blue-700">
          JobHub
        </router-link>
        <button 
          @click="closeSidebar" 
          class="md:hidden text-gray-500 hover:text-gray-700"
          aria-label="Đóng menu"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
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
            to="/employer"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            :class="{ 'bg-blue-50 text-blue-600': isCurrentRoute('/employer') }"
            @click="mobileLinkClick"
          >
            <i class="fas fa-chart-bar w-5 h-5 mr-3"></i>
            <span>Tổng quan</span>
          </router-link>

          <router-link 
            to="/employer/profile"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            :class="{ 'bg-blue-50 text-blue-600': isCurrentRoute('/employer/profile') }"
            @click="mobileLinkClick"
          >
            <i class="fas fa-user-circle w-5 h-5 mr-3"></i>
            <span>Thông tin cá nhân</span>
          </router-link>

          <router-link 
            to="/employer/company"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            :class="{ 'bg-blue-50 text-blue-600': isCurrentRoute('/employer/company') }"
            @click="mobileLinkClick"
          >
            <i class="fas fa-building w-5 h-5 mr-3"></i>
            <span>Thông tin công ty</span>
          </router-link>

          <router-link 
            to="/employer/posts"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            :class="{ 'bg-blue-50 text-blue-600': isCurrentRoute('/employer/jobs') }"
            @click="mobileLinkClick"
          >
            <i class="fas fa-briefcase w-5 h-5 mr-3"></i>
            <span>Tin tuyển dụng</span>
          </router-link>

          <router-link 
            to="/employer/notifications"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            :class="{ 'bg-blue-50 text-blue-600': isCurrentRoute('/employer/notifications') }"
            @click="mobileLinkClick"
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
            @click="mobileLinkClick"
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
            @click="mobileLinkClick"
          >
            <i class="fas fa-cog w-5 h-5 mr-3"></i>
            <span>Cài đặt</span>
          </router-link>
          
          <!-- Mua Premium -->
          <router-link 
            to="premium"
            class="flex items-center px-4 py-2 mt-2 bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 hover:from-yellow-100 hover:to-yellow-200 rounded-md border border-yellow-200 group"
            :class="{ 'bg-yellow-100 text-yellow-800': isCurrentRoute('/employer/premium') }"
            @click="mobileLinkClick"
          >
            <i class="fas fa-crown w-5 h-5 mr-3 text-yellow-500 group-hover:text-yellow-600"></i>
            <span class="font-medium">Premium</span>
            <i class="fas fa-chevron-right ml-auto text-yellow-400 group-hover:translate-x-1 transition-transform"></i>
          </router-link>
          
          <!-- Nút đăng xuất cho mobile -->
          <button
            @click="logout"
            class="md:hidden flex items-center w-full px-4 py-2 mt-4 text-gray-700 hover:bg-gray-50 rounded-md text-left"
          >
            <i class="fas fa-sign-out-alt w-5 h-5 mr-3"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="transition-all duration-300 md:ml-64">
      <!-- Simplified Header -->
      <header class="bg-white h-16 border-b border-gray-200 sticky top-0 z-20">
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
                <i class="fas fa-user text-gray-500"></i>
              </div>
              <i class="fas fa-chevron-down text-sm text-gray-400"></i>
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
                <i class="fas fa-sign-out-alt mr-2"></i> Đăng xuất
              </a>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-4 md:p-6">
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
const showSidebar = ref(window.innerWidth >= 768) // Mặc định hiển thị sidebar trên màn hình lớn

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

// Mở/đóng sidebar
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
  if (showSidebar.value && window.innerWidth < 768) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
}

// Đóng sidebar (chỉ dùng trên mobile)
const closeSidebar = () => {
  if (window.innerWidth < 768) {
    showSidebar.value = false
    document.body.classList.remove('overflow-hidden')
  }
}

// Khi click vào link trên mobile
const mobileLinkClick = () => {
  if (window.innerWidth < 768) {
    closeSidebar()
  }
}

// Xử lý sự kiện resize cửa sổ
const handleResize = () => {
  if (window.innerWidth >= 768) {
    showSidebar.value = true
    document.body.classList.remove('overflow-hidden')
  } else if (!showSidebar.value) {
    // Đảm bảo sidebar đóng trên mobile khi resize từ desktop xuống
    document.body.classList.remove('overflow-hidden')
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
  
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
  window.removeEventListener('resize', handleResize)
  
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