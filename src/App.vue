<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/layouts/Header.vue'
import Footer from './components/layouts/Footer.vue'
import BaseAlert from './components/common/BaseAlert.vue'

// Lấy route hiện tại
const route = useRoute()

// Khởi tạo trạng thái thông báo
const notification = ref({
  show: false,
  type: 'info',
  message: '',
  autoClose: 5000  // Tự động đóng sau 5 giây
})

// Bắt sự kiện thay đổi route để kiểm tra thông báo mới
watch(() => route.path, () => {
  checkNotification()
})

// Kiểm tra thông báo trong localStorage khi component được mount
onMounted(() => {
  checkNotification()
  
  // Bắt đầu kiểm tra thông báo mỗi khi chuyển trang
  window.addEventListener('popstate', checkNotification)
})

// Xóa sự kiện khi component bị hủy
onUnmounted(() => {
  window.removeEventListener('popstate', checkNotification)
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
</script>

<template>
  <div class="min-h-screen flex flex-col">
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
    
    <Header />
    
    <main class="flex-grow">
      <router-view />
    </main>
    
    <Footer />
  </div>
</template>

<style>
/* Có thể thêm các style global ở đây nếu cần */
</style>
