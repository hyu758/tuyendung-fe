<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Hồ sơ người dùng</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Sidebar -->
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="flex items-center justify-center mb-4">
          <div class="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-blue-500">
            <font-awesome-icon :icon="['fas', 'user']" class="text-blue-500 text-4xl" />
          </div>
        </div>
        
        <ul class="space-y-2">
          <li>
            <button 
              @click="activeTab = 'profile'"
              :class="[
                'w-full text-left px-4 py-2 rounded-md transition-colors flex items-center',
                activeTab === 'profile' 
                  ? 'bg-blue-100 text-blue-600 font-medium' 
                  : 'hover:bg-gray-100'
              ]"
            >
              <font-awesome-icon :icon="['fas', 'user']" class="mr-3" />
              Thông tin cá nhân
            </button>
          </li>
          <li>
            <button 
              @click="activeTab = 'password'"
              :class="[
                'w-full text-left px-4 py-2 rounded-md transition-colors flex items-center',
                activeTab === 'password' 
                  ? 'bg-blue-100 text-blue-600 font-medium' 
                  : 'hover:bg-gray-100'
              ]"
            >
              <font-awesome-icon :icon="['fas', 'lock']" class="mr-3" />
              Đổi mật khẩu
            </button>
          </li>
        </ul>
      </div>
      
      <!-- Main Content -->
      <div class="bg-white rounded-lg shadow-md p-6 md:col-span-3">
        <!-- Loading Overlay -->
        <div v-if="profileStore.loading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
        
        <!-- Profile Information Form -->
        <div v-if="activeTab === 'profile'">
          <h2 class="text-xl font-semibold mb-6">Cập nhật thông tin cá nhân</h2>
          
          <div class="grid grid-cols-1 gap-6">
            <!-- Email (Readonly) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="text" 
                :value="profileStore.email" 
                class="w-full py-2 px-3 rounded-md border-gray-300 bg-gray-100 text-gray-600" 
                readonly
              />
            </div>
            
            <!-- Fullname -->
            <div>
              <label for="fullname" class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input 
                id="fullname"
                type="text" 
                v-model="profileForm.fullname" 
                class="w-full py-2 px-3 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            
            <!-- Phone -->
            <!-- <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input 
                id="phone"
                type="text" 
                v-model="profileForm.phone" 
                class="w-full py-2 px-3 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div> -->
            
            <!-- Gender -->
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
              <select 
                id="gender"
                v-model="profileForm.gender" 
                class="w-full py-2 px-3 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            
            <!-- Submit Button -->
            <div class="flex justify-end">
              <button 
                @click="updateProfile"
                :disabled="profileStore.loading"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <span v-if="profileStore.loading">Đang cập nhật...</span>
                <span v-else>Cập nhật</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Change Password Form -->
        <div v-if="activeTab === 'password'">
          <h2 class="text-xl font-semibold mb-6">Đổi mật khẩu</h2>
          
          <div class="grid grid-cols-1 gap-6">
            <!-- Current Password -->
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
              <div class="relative">
                <input 
                  id="currentPassword"
                  :type="showPassword.current ? 'text' : 'password'" 
                  v-model="passwordForm.currentPassword" 
                  class="w-full py-2 px-3 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 pr-10" 
                />
                <button 
                  type="button"
                  @click="showPassword.current = !showPassword.current"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                >
                  <font-awesome-icon :icon="showPassword.current ? 'eye-slash' : 'eye'" class="text-lg" />
                </button>
              </div>
            </div>
            
            <!-- New Password -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
              <div class="relative">
                <input 
                  id="newPassword"
                  :type="showPassword.new ? 'text' : 'password'" 
                  v-model="passwordForm.newPassword" 
                  class="w-full py-2 px-3 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 pr-10" 
                />
                <button 
                  type="button"
                  @click="showPassword.new = !showPassword.new"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                >
                  <font-awesome-icon :icon="showPassword.new ? 'eye-slash' : 'eye'" class="text-lg" />
                </button>
              </div>
            </div>
            
            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
              <div class="relative">
                <input 
                  id="confirmPassword"
                  :type="showPassword.confirm ? 'text' : 'password'" 
                  v-model="passwordForm.confirmPassword" 
                  class="w-full py-2 px-3 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 pr-10" 
                />
                <button 
                  type="button"
                  @click="showPassword.confirm = !showPassword.confirm"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                >
                  <font-awesome-icon :icon="showPassword.confirm ? 'eye-slash' : 'eye'" class="text-lg" />
                </button>
              </div>
            </div>
            
            <!-- Error Message -->
            <div v-if="passwordError" class="text-red-600 text-sm">
              {{ passwordError }}
            </div>
            
            <!-- Submit Button -->
            <div class="flex justify-end">
              <button 
                @click="changePassword"
                :disabled="profileStore.loading"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <span v-if="profileStore.loading">Đang cập nhật...</span>
                <span v-else>Đổi mật khẩu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useProfileStore } from '../stores/profile'

const profileStore = useProfileStore()
const activeTab = ref('profile')
const passwordError = ref('')

// Form data
const profileForm = reactive({
  fullname: '',
  gender: 'male',
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showPassword = reactive({
  current: false,
  new: false,
  confirm: false
})

// Lấy thông tin hồ sơ khi component được tạo
onMounted(async () => {
  const result = await profileStore.fetchProfile()
  
  if (result.success) {
    // Điền thông tin vào form
    profileForm.fullname = profileStore.profile.fullname || ''
    profileForm.gender = profileStore.profile.gender || 'male'
  }
})

// Cập nhật thông tin hồ sơ
async function updateProfile() {
  await profileStore.updateProfile(profileForm)
}

// Đổi mật khẩu
async function changePassword() {
  passwordError.value = ''
  
  // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp nhau không
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Mật khẩu mới và xác nhận mật khẩu không khớp nhau'
    return
  }
  
  // Kiểm tra độ dài mật khẩu
  if (passwordForm.newPassword.length < 6) {
    passwordError.value = 'Mật khẩu mới phải có ít nhất 6 ký tự'
    return
  }
  
  const result = await profileStore.changePassword(passwordForm)
  
  if (result.success) {
    // Xóa form nếu thành công
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  }
}
</script> 