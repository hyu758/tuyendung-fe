<template>
  <header class="bg-white shadow-md relative z-30">
    <div class="container mx-auto px-4 py-2 md:py-3">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="text-xl md:text-2xl font-bold text-blue-600">
            <div class="flex items-center py-0.5">
              <img src="../../assets/logo.png" alt="JobHub" class="w-8 h-8 md:w-11 md:h-11 mr-1">
              <p>JobHub</p>
            </div>
          </router-link>
          
          <!-- Menu chính - hiện trên desktop -->
          <nav class="hidden md:flex ml-10 space-x-6">
            <router-link to="/job-search" class="text-gray-700 hover:text-blue-600 font-medium">
              Tìm việc
            </router-link>
            <router-link to="/enterprises" class="text-gray-700 hover:text-blue-600 font-medium">
              Công ty
            </router-link>
            <router-link to="/gemini-chat" class="text-gray-700 hover:text-blue-600 font-medium flex items-center">
              <i class="fas fa-robot text-indigo-600 mr-1"></i> JobHub AI
            </router-link>
            <router-link to="/premium" class="text-gray-700 hover:text-blue-600 font-medium flex items-center">
              <i class="fas fa-crown text-yellow-500 mr-1"></i> Premium
            </router-link>
          </nav>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center space-x-4">
          <!-- Nút thông báo - chỉ hiển thị khi đã đăng nhập -->
          <div v-if="isAuthenticated" class="relative" ref="mobileNotificationRef">
            <button 
              @click="toggleMobileNotification"
              class="text-gray-700 focus:outline-none"
              aria-label="Thông báo"
            >
              <i class="fas fa-bell text-xl"></i>
              <span 
                v-if="notificationStore.hasUnread" 
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
              >
                {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
              </span>
            </button>
            
            <!-- Dropdown thông báo cho mobile -->
            <div 
              v-if="showMobileNotification" 
              class="absolute right-0 mt-2 w-[300px] max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl py-1 z-30 border border-gray-200 max-h-[70vh] overflow-y-auto"
              style="top: calc(100% + 0.5rem); right: -0.5rem;"
            >
              <div class="px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10 flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-900">Thông báo</h3>
                <div class="flex items-center">
                  <span v-if="notificationStore.hasUnread" class="text-xs font-medium text-green-600 mr-2">
                    {{ notificationStore.unreadCount }} mới
                  </span>
                  <button 
                    v-if="notificationStore.hasUnread" 
                    @click="markAllAsRead"
                    class="text-xs text-blue-600 hover:text-blue-800 font-medium mr-2"
                    :disabled="markingAll"
                  >
                    <i class="fas fa-check-double mr-1"></i>
                    <span v-if="markingAll">...</span>
                    <span v-else>Đã đọc</span>
                  </button>
                  <button @click="showMobileNotification = false" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <div v-if="notificationStore.loading" class="py-4 text-center">
                <i class="fas fa-circle-notch fa-spin text-blue-500"></i>
                <p class="text-sm text-gray-500 mt-1">Đang tải thông báo...</p>
              </div>

              <div v-else-if="notificationStore.hasNotifications">
                <div 
                  v-for="notification in notificationStore.notifications" 
                  :key="notification.id" 
                  class="px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  :class="{'bg-green-50': !notification.is_read}"
                >
                  <div class="flex">
                    <div class="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center mr-3">
                      <i class="fas" :class="notification.icon || 'fa-bell'" :style="{color: notification.is_read ? '#9ca3af' : '#10b981'}"></i>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-900" :class="{'font-medium': !notification.is_read}">
                        {{ notification.message }}
                      </p>
                      <div class="flex items-center justify-between mt-1">
                        <p class="text-xs text-gray-500">{{ notification.created_at }}</p>
                        <span v-if="!notification.is_read" class="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-if="notificationStore.hasMore" class="px-4 py-3 text-center border-t border-gray-100">
                  <button 
                    @click="loadMoreMobileNotifications"
                    class="text-sm text-blue-600 hover:text-blue-700 font-medium"
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
          
          <!-- Nút menu hamburger -->
          <button 
            @click="toggleMobileMenu" 
            class="text-gray-700 focus:outline-none"
            aria-label="Menu"
          >
            <svg 
              v-if="!showMobileMenu" 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg 
              v-else 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Navigation Menu (right side) - hiện trên desktop -->
        <nav class="hidden md:flex items-center space-x-4">
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
            <div class="flex items-center space-x-3">
              <!-- Notifications -->
              <NotificationDropdown />

              <!-- Chat Messages -->
              <chat-dropdown />
              
              <!-- Premium Button -->
              <router-link 
                to="/premium" 
                class="flex items-center px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-md hover:from-yellow-600 hover:to-amber-700 transition-colors shadow-sm"
              >
                <i class="fas fa-crown mr-1.5"></i>
                <span class="font-medium text-sm">Premium</span>
              </router-link>
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
                class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200"
              >
                <!-- Menu cá nhân -->
                <div class="py-1" role="none">
                  <router-link 
                    to="/profile" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    role="menuitem"
                  >
                    <i class="fas fa-user-circle mr-2"></i>
                    Hồ sơ cá nhân
                  </router-link>
                  <router-link 
                    to="/my-applications" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    role="menuitem"
                  >
                    <i class="fas fa-clipboard-list mr-2"></i>
                    Việc đã ứng tuyển
                  </router-link>
                  <router-link 
                    to="/saved-jobs" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    role="menuitem"
                  >
                    <i class="fas fa-heart mr-2"></i>
                    Việc đã lưu
                  </router-link>
                  <router-link 
                    to="/my-criteria" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    role="menuitem"
                  >
                    <i class="fas fa-sliders-h mr-2"></i>
                    Tiêu chí tìm việc
                  </router-link>
                  <router-link 
                    to="/job-recommendations" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    role="menuitem"
                  >
                    <i class="fas fa-thumbs-up mr-2"></i>
                    Việc làm gợi ý
                  </router-link>
                  <router-link 
                    to="/gemini-chat" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    role="menuitem"
                  >
                    <i class="fas fa-robot mr-2"></i>
                    JobHub AI
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
      
      <!-- Mobile Menu Slide-in Panel -->
      <div 
        v-if="showMobileMenu" 
        class="md:hidden fixed inset-0 z-40"
      >
        <!-- Overlay -->
        <div 
          class="absolute inset-0 bg-black/50 transition-opacity duration-300"
          :class="{'opacity-100': showMobileMenu, 'opacity-0': !showMobileMenu}"
          @click="closeMobileMenu"
        ></div>
        
        <!-- Sidebar menu -->
        <div 
          class="absolute top-0 right-0 h-full w-[280px] bg-white shadow-lg py-4 transform transition-transform duration-300"
          :class="showMobileMenu ? 'translate-x-0' : 'translate-x-full'"
        >
          <div class="px-4 mb-6">
            <!-- Thông tin người dùng đã đăng nhập -->
            <div v-if="isAuthenticated" class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <i class="fas fa-user"></i>
              </div>
              <div>
                <p class="font-medium text-gray-800">{{ userFullName || username }}</p>
                <p v-if="!isActive" class="text-xs text-yellow-600">
                  <i class="fas fa-exclamation-circle mr-1"></i>
                  Chưa kích hoạt
                </p>
              </div>
            </div>
            
            <!-- Thanh tìm kiếm -->
            <div class="relative mb-6">
              <input 
                type="text" 
                placeholder="Tìm kiếm việc làm..." 
                class="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
              <div class="absolute left-3 top-2.5 text-gray-400">
                <i class="fas fa-search"></i>
              </div>
            </div>
            
            <!-- Menu chính luôn hiển thị cho mọi người dùng -->
            <div class="space-y-4">
              <router-link to="/job-search" class="block text-gray-700 hover:text-blue-600 font-medium" @click="closeMobileMenu">
                <i class="fas fa-search mr-2"></i> Tìm việc
              </router-link>
              <router-link to="/enterprises" class="block text-gray-700 hover:text-blue-600 font-medium" @click="closeMobileMenu">
                <i class="fas fa-building mr-2"></i> Công ty
              </router-link>
              <router-link to="/gemini-chat" class="block text-gray-700 hover:text-blue-600 font-medium" @click="closeMobileMenu">
                <i class="fas fa-robot mr-2"></i> JobHub AI
              </router-link>
              <router-link to="/premium" class="block text-gray-700 hover:text-blue-600 font-medium" @click="closeMobileMenu">
                <i class="fas fa-crown mr-2"></i> Premium
              </router-link>
            </div>
            
            <div class="border-t border-gray-200 my-6"></div>
            
            <!-- Mobile Actions - Chỉ hiển thị khi đã đăng nhập -->
            <div v-if="isAuthenticated" class="space-y-4">
              <router-link to="/profile" class="block text-gray-700 hover:text-blue-600" @click="closeMobileMenu">
                <i class="fas fa-user mr-2"></i> Hồ sơ cá nhân
              </router-link>
              
              <router-link to="/my-applications" class="block text-gray-700 hover:text-blue-600" @click="closeMobileMenu">
                <i class="fas fa-file-alt mr-2"></i> Đơn ứng tuyển
              </router-link>
              
              <router-link to="/saved-jobs" class="block text-gray-700 hover:text-blue-600" @click="closeMobileMenu">
                <i class="fas fa-bookmark mr-2"></i> Việc đã lưu
              </router-link>
              
              <button 
                class="block text-gray-700 hover:text-blue-600 w-full text-left" 
                @click="closeMobileMenu(); toggleMobileNotification()"
              >
                <i class="fas fa-bell mr-2"></i> Thông báo
                <span v-if="notificationStore.unreadCount > 0" class="ml-2 bg-red-500 text-white py-0.5 px-2 rounded-full text-xs">
                  {{ notificationStore.unreadCount }}
                </span>
              </button>
              
              <router-link to="/candidate/messages" class="block text-gray-700 hover:text-blue-600" @click="closeMobileMenu">
                <i class="fas fa-comment mr-2"></i> Tin nhắn
              </router-link>
              
              <button @click="logoutMobile" class="block text-gray-700 hover:text-blue-600 w-full text-left">
                <i class="fas fa-sign-out-alt mr-2"></i> Đăng xuất
              </button>
            </div>
            
            <!-- Menu cho người chưa đăng nhập - Hiển thị khi CHƯA đăng nhập -->
            <div v-else class="space-y-4 pt-2">
              <router-link 
                to="/login" 
                class="block text-center py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 font-medium transition-colors" 
                @click="closeMobileMenu"
              >
                Đăng nhập
              </router-link>
              
              <router-link 
                to="/register" 
                class="block text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors" 
                @click="closeMobileMenu"
              >
                Đăng ký
              </router-link>
            </div>

            <!-- Sub-menu thông báo -->
            <div v-if="showMobileNotification && isAuthenticated" class="ml-6 bg-gray-50 rounded-lg p-3 border-l-2 border-blue-400">
              <div v-if="notificationStore.loading" class="py-3 text-center">
                <i class="fas fa-circle-notch fa-spin text-blue-500"></i>
                <p class="text-sm text-gray-500 mt-1">Đang tải thông báo...</p>
              </div>
              
              <div v-else-if="notificationStore.hasNotifications" class="max-h-60 overflow-y-auto">
                <div v-for="notification in notificationStore.notifications" :key="notification.id" 
                    class="p-2 border-b border-gray-100 last:border-0 hover:bg-gray-100 rounded"
                    :class="{'bg-blue-50': !notification.is_read}"
                >
                  <div class="flex items-start">
                    <div :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2', 
                      notification.is_read ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600']">
                      <i class="fas" :class="notification.icon || 'fa-bell'"></i>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm" :class="{'font-medium': !notification.is_read}">
                        {{ notification.message }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">{{ notification.created_at }}</p>
                    </div>
                  </div>
                </div>
                
                <div v-if="notificationStore.hasMore" class="pt-2 text-center">
                  <button 
                    @click="loadMoreMobileNotifications"
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
        </div>
      </div>
    </div>
  </header>

  <!-- Thông báo tài khoản chưa kích hoạt -->
  <div v-if="isAuthenticated && !isActive" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
    <div class="container mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div class="flex items-start sm:items-center">
        <i class="fas fa-exclamation-circle mr-2 mt-1 sm:mt-0 flex-shrink-0"></i>
        <p class="text-sm sm:text-base">Tài khoản của bạn chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản.</p>
      </div>
      <router-link to="/activate" class="text-blue-600 hover:text-blue-800 underline font-medium text-sm sm:text-base whitespace-nowrap">
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
import { usePremiumStore } from '../../stores/premium'
import { useToast } from '../../composables/useToast'
import NotificationDropdown from '../common/NotificationDropdown.vue'
import ChatDropdown from '../common/ChatDropdown.vue'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const premiumStore = usePremiumStore()
const { addToast } = useToast()
const showDropdown = ref(false)
const showMobileMenu = ref(false)
const profileDropdown = ref(null)
const showMobileNotification = ref(false)
const mobileNotificationRef = ref(null)
const markingAll = ref(false)

// Sử dụng thông tin từ authStore
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isActive = computed(() => authStore.isActivated)
const userFullName = computed(() => authStore.userFullName)

// Giữ lại biến username từ localStorage cho trường hợp chưa lấy được thông tin người dùng
const username = ref('')

watch(() => authStore.user, (newUser) => {
  if (newUser) {
    // Kiểm tra premium khi thông tin người dùng thay đổi
    checkPremiumExpiry()
  }
}, { deep: true, immediate: true })

onMounted(async () => {
  // Kiểm tra thông tin từ token
  if (isAuthenticated.value) {
    if (!authStore.user) {
      await authStore.updateUserFromToken()
    }
    
    // Lấy số lượng thông báo chưa đọc khi component được mounted
    await notificationStore.fetchUnreadCount()
    
    // Kiểm tra trạng thái Premium
    checkPremiumExpiry()
  }
  
  // Thêm xử lý sự kiện click ngoài dropdown để đóng nó
  document.addEventListener('click', handleClickOutside)
  
  // Lắng nghe sự kiện resize để đóng mobile menu khi chuyển sang desktop
  window.addEventListener('resize', handleResize)
  
  // Thêm event listener cho mobile notification dropdown
  document.addEventListener('click', handleMobileNotificationClickOutside)
})

onUnmounted(() => {
  // Loại bỏ event listener khi component bị hủy
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleMobileNotificationClickOutside)
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  
  // Khi mở mobile menu, thêm class để ngăn cuộn trang
  if (showMobileMenu.value) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
}

// Hàm đóng menu mobile và đảm bảo gỡ bỏ class overflow-hidden
const closeMobileMenu = () => {
  showMobileMenu.value = false
  document.body.classList.remove('overflow-hidden')
}

const handleClickOutside = (event) => {
  if (profileDropdown.value && !profileDropdown.value.contains(event.target)) {
    showDropdown.value = false
  }
}

const handleResize = () => {
  // Đóng mobile menu khi màn hình lớn hơn breakpoint md (768px)
  if (window.innerWidth >= 768 && showMobileMenu.value) {
    showMobileMenu.value = false
    document.body.classList.remove('overflow-hidden')
  }
}

const logout = () => {
  authStore.logout()
  notificationStore.resetStore()
  showDropdown.value = false
  router.push('/login')
}

const logoutMobile = () => {
  authStore.logout()
  notificationStore.resetStore()
  closeMobileMenu()
  router.push('/login')
}

// Tải thêm thông báo trên mobile
const loadMoreMobileNotifications = async () => {
  if (!isAuthenticated.value) {
    return;
  }
  await notificationStore.fetchNotifications();
};

// Toggle mobile notification dropdown
const toggleMobileNotification = async () => {
  // Chỉ xử lý khi đã đăng nhập
  if (!isAuthenticated.value) {
    console.log('Không thể xem thông báo khi chưa đăng nhập');
    return;
  }

  showMobileNotification.value = !showMobileNotification.value;
  
  // Nếu mở dropdown và chưa có thông báo, tải thông báo
  if (showMobileNotification.value && !notificationStore.hasNotifications) {
    await notificationStore.fetchNotifications(true);
  }
};

// Bắt sự kiện click bên ngoài dropdown thông báo
const handleMobileNotificationClickOutside = (event) => {
  if (mobileNotificationRef.value && !mobileNotificationRef.value.contains(event.target)) {
    showMobileNotification.value = false;
  }
};

// Kiểm tra hạn Premium
async function checkPremiumExpiry() {
  // Nếu người dùng có Premium, kiểm tra xem có hết hạn chưa
  if (premiumStore.isPremium) {
    if (premiumStore.isPremiumExpired) {
      await premiumStore.cancelPremium()
    }
  }
}

// Đánh dấu tất cả thông báo đã đọc
const markAllAsRead = async () => {
  try {
    markingAll.value = true;
    const result = await notificationStore.markAllAsRead();
    
    if (result.success) {
      addToast({
        type: 'success',
        message: 'Đã đánh dấu tất cả thông báo là đã đọc'
      });
    } else {
      addToast({
        type: 'error',
        message: result.error || 'Không thể đánh dấu thông báo đã đọc'
      });
    }
  } catch (error) {
    addToast({
      type: 'error',
      message: 'Đã xảy ra lỗi khi đánh dấu thông báo đã đọc'
    });
  } finally {
    markingAll.value = false;
  }
};
</script>

<style scoped>
/* Đảm bảo transition mượt mà cho mobile menu */
.transform {
  will-change: transform;
}

/* Hiệu ứng overlay */
.absolute.inset-0.bg-black\/50 {
  backdrop-filter: blur(2px);
  transition: opacity 0.3s ease;
}

/* Hiệu ứng đơn giản cho menu trượt */
.absolute.top-0.right-0.h-full {
  transition: transform 0.3s ease-out;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
}
</style> 