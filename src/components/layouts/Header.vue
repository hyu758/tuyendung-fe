<template>
  <header class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="text-2xl font-bold text-blue-600">
            JobHub
          </router-link>
        </div>

        <!-- Thanh tìm kiếm -->
        <div class="hidden md:block flex-grow mx-10">
          <div class="relative">
            <input
              type="text"
              placeholder="Tìm kiếm công việc..."
              class="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="navigateToSearch"
              v-model="searchTerm"
            />
            <button
              class="absolute right-0 top-0 mt-2 mr-4 text-blue-500"
              @click="navigateToSearch"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex items-center space-x-4">
          <router-link to="/job-search" class="text-gray-700 hover:text-blue-600">
            Tìm việc
          </router-link>
          
          <!-- Menu cho người dùng chưa đăng nhập -->
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="text-gray-700 hover:text-blue-600">
              Đăng nhập
            </router-link>
            <router-link 
              to="/register" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Đăng ký
            </router-link>
          </template>
          
          <!-- Menu cho người dùng đã đăng nhập -->
          <div v-else class="relative" ref="profileDropdown">
            <button 
              @click="toggleDropdown" 
              class="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <span class="mr-1">{{ username }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <div 
              v-if="showDropdown" 
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
            >
              <router-link 
                to="/profile" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Hồ sơ cá nhân
              </router-link>
              
              <!-- Menu cho nhà tuyển dụng -->
              <template v-if="userRole === 'employer'">
                <router-link 
                  to="/employer/dashboard" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Bảng điều khiển
                </router-link>
                <router-link 
                  to="/employer/jobs" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Tin tuyển dụng
                </router-link>
              </template>
              
              <!-- Menu cho admin -->
              <template v-if="userRole === 'admin'">
                <router-link 
                  to="/admin/dashboard" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Quản trị
                </router-link>
              </template>
              
              <a 
                href="#" 
                @click.prevent="logout" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Đăng xuất
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchTerm = ref('')
const showDropdown = ref(false)
const profileDropdown = ref(null)

// Giả sử các thông tin người dùng được lưu trong localStorage
const isLoggedIn = ref(false)
const username = ref('')
const userRole = ref('')

onMounted(() => {
  // Kiểm tra trạng thái đăng nhập
  const token = localStorage.getItem('token')
  if (token) {
    isLoggedIn.value = true
    username.value = localStorage.getItem('username') || 'Người dùng'
    userRole.value = localStorage.getItem('userRole') || ''
  }
  
  // Thêm sự kiện click bên ngoài để đóng dropdown
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const navigateToSearch = () => {
  if (searchTerm.value.trim()) {
    router.push({
      path: '/job-search',
      query: { q: searchTerm.value }
    })
  }
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleClickOutside = (event) => {
  if (profileDropdown.value && !profileDropdown.value.contains(event.target)) {
    showDropdown.value = false
  }
}

const logout = () => {
  // Xóa thông tin đăng nhập
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('userRole')
  
  // Cập nhật trạng thái
  isLoggedIn.value = false
  showDropdown.value = false
  
  // Chuyển hướng về trang chủ
  router.push('/')
}
</script> 