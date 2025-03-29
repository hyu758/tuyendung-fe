<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import CandidateHeader from './components/layouts/CandidateHeader.vue'
import BaseAlert from './components/common/BaseAlert.vue'

// Lấy route hiện tại
const route = useRoute()
const authStore = useAuthStore()

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

// Khởi tạo dữ liệu người dùng và kiểm tra thông báo khi component được mount
onMounted(() => {
  // Khởi tạo thông tin người dùng từ token nếu có
  if (localStorage.getItem('token') && !authStore.user) {
    console.log('App mounted - Initializing user data from token')
    authStore.updateUserFromToken()
  }
  
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

// Kiểm tra xem có phải là trang employer không
const isEmployerPage = computed(() => {
  return route.path.startsWith('/employer')
})
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
