<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30">
      <div class="flex items-center justify-center h-16 border-b border-gray-200">
        <router-link to="/" class="text-xl font-bold text-blue-600 hover:text-blue-700">
          JobMaster
        </router-link>
      </div>
      
      <nav class="mt-6 px-4">
        <div class="space-y-4">
          <!-- User Profile Section -->
          <div class="pb-4 border-b border-gray-200">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <font-awesome-icon icon="user" class="text-gray-500" />
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
            to="/employer/campaigns"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            :class="{ 'bg-blue-50 text-blue-600': isCurrentRoute('/employer/campaigns') }"
          >
            <font-awesome-icon icon="bullhorn" class="w-5 h-5 mr-3" />
            <span>Chiến dịch tuyển dụng</span>
          </router-link>

          <router-link 
            to="/employer/jobs"
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
            <font-awesome-icon icon="bell" class="w-5 h-5 mr-3" />
            <span>Thông báo</span>
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
          <button 
            class="text-gray-500 hover:text-gray-600 relative mr-4"
            aria-label="Thông báo"
            title="Thông báo"
          >
            <font-awesome-icon icon="bell" class="text-xl" />
            <span v-if="unreadNotifications > 0" 
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
              aria-label="Số thông báo chưa đọc"
            >
              {{ unreadNotifications }}
            </span>
          </button>

          <!-- User Menu -->
          <div class="relative" ref="profileDropdown">
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

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showDropdown = ref(false)
const profileDropdown = ref(null)
const unreadNotifications = ref(2) // Temporary hardcoded value

const userFullName = computed(() => authStore.userFullName || 'Người dùng')

const isCurrentRoute = (path) => {
  return route.path.startsWith(path)
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (!authStore.user) {
    authStore.updateUserFromToken()
  }
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

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script> 