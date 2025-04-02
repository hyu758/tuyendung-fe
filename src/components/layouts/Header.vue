<template>
  <header class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="text-2xl font-bold text-blue-600">
            JobHubbbb
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
          <template v-if="!isAuthenticated">
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
              <span class="mr-1">{{ userFullName || username }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <div 
              v-if="showDropdown" 
              class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
            >
              <!-- Menu cá nhân -->
              <div>
                <router-link 
                  to="/profile" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-user mr-2"></i> Hồ sơ cá nhân
                </router-link>
              </div>
              
              <!-- Phân cách khi người dùng là nhà tuyển dụng -->
              <template v-if="isRecruiter">
                <div class="border-t border-gray-100 my-1"></div>
                
                <div class="px-4 py-1">
                  <span class="text-xs text-gray-500 font-medium">QUẢN LÝ TUYỂN DỤNG</span>
                </div>
                
                <router-link 
                  to="/dashboard" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-tachometer-alt mr-2"></i> Bảng điều khiển
                </router-link>
                
                <router-link 
                  to="/enterprise/profile" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-building mr-2"></i> Thông tin doanh nghiệp
                </router-link>
                
                <router-link 
                  to="/campaigns" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-bullhorn mr-2"></i> Chiến dịch tuyển dụng
                </router-link>
                
                <router-link 
                  to="/job-listings" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-briefcase mr-2"></i> Tin tuyển dụng
                </router-link>
                
                <router-link 
                  to="/applications" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-users mr-2"></i> Quản lý ứng viên
                </router-link>
              </template>
              
              <!-- Menu cho admin -->
              <template v-if="userRole === 'admin'">
                <div class="border-t border-gray-100 my-1"></div>
                
                <div class="px-4 py-1">
                  <span class="text-xs text-gray-500 font-medium">QUẢN TRỊ HỆ THỐNG</span>
                </div>
                
                <router-link 
                  to="/admin/dashboard" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-tachometer-alt mr-2"></i> Bảng điều khiển
                </router-link>
                
                <router-link 
                  to="/admin/users" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-users-cog mr-2"></i> Quản lý người dùng
                </router-link>
                
                <router-link 
                  to="/admin/companies" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-building mr-2"></i> Quản lý doanh nghiệp
                </router-link>
                
                <router-link 
                  to="/admin/jobs" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-briefcase mr-2"></i> Quản lý tin tuyển dụng
                </router-link>
              </template>
              
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
        </nav>
      </div>
    </div>
  </header>

  <!-- Thông báo tài khoản chưa kích hoạt -->
  <div v-if="isAuthenticated && !isActive" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
    <div class="container mx-auto px-4 flex items-center justify-between">
      <div class="flex items-center">
        <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="mr-2" />
        <p>Tài khoản của bạn chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản.</p>
      </div>
      <router-link to="/activate" class="text-blue-600 hover:text-blue-800 underline font-medium">
        Gửi lại mã kích hoạt
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const searchTerm = ref('')
const showDropdown = ref(false)
const profileDropdown = ref(null)

// Sử dụng thông tin từ authStore
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isActive = computed(() => {
  // Lấy trạng thái kích hoạt trực tiếp từ getter đã cập nhật
  const active = authStore.isActivated
  console.log('isActive computed from token:', active)
  return active
})
const userRole = computed(() => authStore.userRole)
const userFullName = computed(() => authStore.userFullName)

// Giữ lại biến username từ localStorage cho trường hợp chưa lấy được thông tin người dùng
const username = ref('')

// Kiểm tra người dùng có phải là nhà tuyển dụng không
const isRecruiter = computed(() => {
  console.log('isRecruiter computed - authStore.user:', authStore.user);
  console.log('isRecruiter computed - authStore.userRole:', authStore.userRole);
  console.log('isRecruiter computed - authStore.isEmployer:', authStore.isEmployer);
  
  // Sử dụng getter isEmployer từ authStore thay vì truy cập trực tiếp role
  return authStore.isEmployer;
});

watch(() => authStore.user, (newUser) => {
  console.log('User changed in Header watch:', newUser)
  if (newUser) {
    console.log('New user is_active:', newUser.is_active)
  }
}, { deep: true, immediate: true })

onMounted(() => {
  // Lấy username từ localStorage để hiển thị ban đầu
  username.value = localStorage.getItem('username') || 'Người dùng'
  
  // Kiểm tra thông tin từ token
  if (isAuthenticated.value) {
    console.log('Header mounted - Token tồn tại')
    
    // Thử cập nhật thông tin từ token
    if (!authStore.user) {
      console.log('Header mounted - User null, updating from token')
      authStore.updateUserFromToken()
    } else {
      console.log('Header mounted - User already exists:', authStore.user)
    }
    
    // Ghi log tất cả thông tin quan trọng
    console.log('Header mounted - isActive:', isActive.value)
    console.log('Header mounted - userRole:', userRole.value)
    console.log('Header mounted - isRecruiter:', isRecruiter.value)
  } else {
    console.log('Header mounted - Người dùng chưa đăng nhập')
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
  authStore.logout()
  showDropdown.value = false
}
</script> 