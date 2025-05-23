<script setup>
import { ref, onMounted, onUnmounted, watch, computed, provide, watchEffect, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { usePremiumStore } from './stores/premium'
import CandidateHeader from './components/layouts/CandidateHeader.vue'
import BaseAlert from './components/common/BaseAlert.vue'
import socketService from './services/socketService'
import ChatManager from './components/chat/ChatManager.vue'
import { useToast } from 'vue-toastification'
import Footer from './components/layouts/Footer.vue'


const route = useRoute()
const authStore = useAuthStore()
const premiumStore = usePremiumStore()
const chatManager = ref(null)
const toast = useToast()


const notification = ref({
  show: false,
  type: 'info',
  message: '',
  autoClose: 5000
})

watch(() => route.path, () => {
  checkNotification()
})

// Theo dõi trạng thái đăng nhập để kiểm tra Premium
watch(() => authStore.isAuthenticated, (newValue) => {
  if (newValue) {
    checkPremiumExpiry()
  }
})

// Kiểm tra token khi app khởi động
onMounted(async () => {
  // Nếu có token trong localStorage, kiểm tra tính hợp lệ
  if (authStore.token || localStorage.getItem('token')) {
    await authStore.checkTokenValidity()

  }
  
  // Thiết lập kiểm tra token định kỳ (5 phút kiểm tra một lần)
  startTokenCheckInterval()
  
  if (localStorage.getItem('token') && !authStore.user) {
    await authStore.updateUserFromToken()
    
    // Kiểm tra hạn Premium nếu người dùng đã đăng nhập
    if (authStore.isAuthenticated) {
      checkPremiumExpiry()
    }
  }
  
  checkNotification()
  
  // Bắt đầu kiểm tra thông báo mỗi khi chuyển trang
  window.addEventListener('popstate', checkNotification)
  
  // Theo dõi chatManager ref
  watchEffect(() => {
    // chatManager ref changed
  })
  
  // Hiển thị thông báo khi component được mounted
  showStoredNotification()
})

// Xóa sự kiện khi component bị hủy
onUnmounted(() => {
  window.removeEventListener('popstate', checkNotification)
  socketService.disconnect()
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval)
  }
})

// Hàm kiểm tra hạn Premium và xử lý khi hết hạn
async function checkPremiumExpiry() {
  if (premiumStore.isPremium) {
    if (premiumStore.isPremiumExpired) {
      const result = await premiumStore.cancelPremium()
      if (result.success) {
        showNotification('info', 'Gói Premium của bạn đã hết hạn và đã được hủy tự động.')
      }
    } else {
      // Premium còn hạn sử dụng
    }
  }
}

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

// Hiển thị thông báo
function showNotification(type, message) {
  notification.value = {
    show: true,
    type,
    message,
    autoClose: 5000
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
  if (chatManager.value) {
    chatManager.value.openChat(userId)
  } else {
    console.warn('chatManager không tồn tại, không thể mở chat')
  }
}

// Cung cấp phương thức mở chat cho toàn bộ ứng dụng
provide('openChat', openChat)

// Cung cấp chatManager ref trực tiếp cho các component con
provide('chatManager', chatManager)

// Biến để lưu interval ID
let tokenCheckInterval = null

// Hàm bắt đầu kiểm tra token định kỳ
const startTokenCheckInterval = () => {
  // Xóa interval cũ nếu có
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval)
  }
  
  // Thiết lập interval mới (5 phút = 300000ms)
  tokenCheckInterval = setInterval(async () => {
    if (authStore.isAuthenticated) {
      await authStore.checkTokenValidity()
    }
  }, 300000) // 5 phút
}

// Hiển thị thông báo nếu có lưu trong localStorage
const showStoredNotification = () => {
  const notificationJson = localStorage.getItem('notification')
  if (notificationJson) {
    try {
      const notification = JSON.parse(notificationJson)
      if (notification.show) {
        toast[notification.type](notification.message)
        
        // Xóa thông báo sau khi hiển thị
        notification.show = false
        localStorage.setItem('notification', JSON.stringify(notification))
      }
    } catch (e) {
      console.error('Error parsing notification:', e)
    }
  }
}
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
    <Footer v-if="!isEmployerPage" class="bg-white border-t border-gray-200 mt-auto">
    </Footer>

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
