<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-blue-600 hover:text-blue-700">
            JobHub
          </router-link>
        </div>

        <!-- Right Menu -->
        <div class="flex items-center space-x-6">
          <!-- Notifications -->
          <button class="text-gray-500 hover:text-gray-600 relative">
            <i class="fas fa-bell text-xl"></i>
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </button>

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

const router = useRouter()
const authStore = useAuthStore()
const showDropdown = ref(false)
const profileDropdown = ref(null)

// Sử dụng thông tin từ authStore
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isActive = computed(() => authStore.isActivated)
const userFullName = computed(() => authStore.userFullName)
const username = ref(localStorage.getItem('username') || 'Người dùng')

onMounted(() => {
  if (isAuthenticated.value && !authStore.user) {
    authStore.updateUserFromToken()
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
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
  showDropdown.value = false
}
</script> 