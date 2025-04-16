<script setup>
import { ref, onMounted, onUnmounted, watch, computed, provide, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import CandidateHeader from './components/layouts/CandidateHeader.vue'
import BaseAlert from './components/common/BaseAlert.vue'
import socketService from './services/socketService'
import ChatManager from './components/chat/ChatManager.vue'


const route = useRoute()
const authStore = useAuthStore()
const chatManager = ref(null)


const notification = ref({
  show: false,
  type: 'info',
  message: '',
  autoClose: 5000
})

watch(() => route.path, () => {
  checkNotification()
})

onMounted(() => {
  if (localStorage.getItem('token') && !authStore.user) {
    console.log('App mounted - Initializing user data from token')
    authStore.updateUserFromToken()
  }
  
  checkNotification()
  
  // Bắt đầu kiểm tra thông báo mỗi khi chuyển trang
  window.addEventListener('popstate', checkNotification)
  
  // Theo dõi chatManager ref
  watchEffect(() => {
    console.log('App.vue - chatManager ref:', chatManager.value)
  })
})

// Xóa sự kiện khi component bị hủy
onUnmounted(() => {
  window.removeEventListener('popstate', checkNotification)
  socketService.disconnect()
})

// Hàm kiểm tra thông báo trong localStorage
function checkNotification() {
  const savedNotification = localStorage.getItem('notification')
  if (savedNotification) {
    try {
      const parsedNotification = JSON.parse(savedNotification)
      if (parsedNotification.show) {
        notification.value = {
          ...parsedNotification,
          autoClose: 5000
        }
        
        // Xóa thông báo từ localStorage sau khi đã hiển thị
        localStorage.removeItem('notification')
      }
    } catch (e) {
      console.error('Lỗi khi parse thông báo:', e)
      localStorage.removeItem('notification')
    }
  }
}

// Đóng thông báo
function closeNotification() {
  notification.value.show = false
}

// Kiểm tra xem có phải là trang employer không
const isEmployerPage = computed(() => {
  return route.path.startsWith('/employer')
})

// Kiểm tra người dùng đã đăng nhập chưa
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Cung cấp phương thức mở chat cho toàn bộ ứng dụng
const openChat = (userId) => {
  console.log('openChat được gọi trong App.vue với userId:', userId)
  if (chatManager.value) {
    console.log('Gọi phương thức openChat của chatManager')
    chatManager.value.openChat(userId)
  } else {
    console.warn('chatManager không tồn tại, không thể mở chat')
  }
}

// Cung cấp phương thức mở chat cho toàn bộ ứng dụng
provide('openChat', openChat)

// Cung cấp chatManager ref trực tiếp cho các component con
provide('chatManager', chatManager)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header chỉ hiển thị khi không phải trang employer -->
    <CandidateHeader v-if="!isEmployerPage" />
    
    <!-- Thông báo toàn cục -->
    <div class="fixed top-4 right-4 z-50 max-w-md w-full">
      <BaseAlert
        v-if="notification.show"
        :variant="notification.type"
        :message="notification.message"
        :auto-close="notification.autoClose"
        :dismissible="true"
        @dismiss="closeNotification"
      />
    </div>
    
    <!-- Main Content -->
    <main :class="{'container mx-auto px-4 py-8': !isEmployerPage}">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer chỉ hiển thị khi không phải trang employer -->
    <footer v-if="!isEmployerPage" class="bg-white border-t border-gray-200 mt-auto">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Về JobHub</h3>
            <p class="text-gray-600">
              JobHub là nền tảng kết nối người tìm việc và nhà tuyển dụng, giúp tìm kiếm cơ hội việc làm phù hợp.
            </p>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Liên kết nhanh</h3>
            <ul class="space-y-2">
              <li>
                <router-link to="/about" class="text-gray-600 hover:text-blue-600">
                  Về chúng tôi
                </router-link>
              </li>
              <li>
                <router-link to="/contact" class="text-gray-600 hover:text-blue-600">
                  Liên hệ
                </router-link>
              </li>
              <li>
                <router-link to="/blog" class="text-gray-600 hover:text-blue-600">
                  Blog
                </router-link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Cho người tìm việc</h3>
            <ul class="space-y-2">
              <li>
                <router-link to="/job-search" class="text-gray-600 hover:text-blue-600">
                  Tìm việc
                </router-link>
              </li>
              <li>
                <router-link to="/companies" class="text-gray-600 hover:text-blue-600">
                  Công ty
                </router-link>
              </li>
              <li>
                <router-link to="/career-advice" class="text-gray-600 hover:text-blue-600">
                  Tư vấn nghề nghiệp
                </router-link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Cho nhà tuyển dụng</h3>
            <ul class="space-y-2">
              <li>
                <router-link to="/post-job" class="text-gray-600 hover:text-blue-600">
                  Đăng tin tuyển dụng
                </router-link>
              </li>
              <li>
                <router-link to="/pricing" class="text-gray-600 hover:text-blue-600">
                  Bảng giá
                </router-link>
              </li>
              <li>
                <router-link to="/recruitment-solutions" class="text-gray-600 hover:text-blue-600">
                  Giải pháp tuyển dụng
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {{ new Date().getFullYear() }} JobHub. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- Đảm bảo ChatManager được hiển thị khi người dùng đã đăng nhập -->
    <ChatManager ref="chatManager" v-if="isAuthenticated" />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
