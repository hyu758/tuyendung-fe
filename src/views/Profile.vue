<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Hồ sơ người dùng</h1>
        <p class="mt-2 text-sm text-gray-600">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
      </div>
      
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="flex flex-col md:flex-row">
          <!-- Sidebar -->
          <div class="md:w-1/4 bg-gray-50 p-6 border-b md:border-b-0 md:border-r border-gray-200">
            <div class="flex flex-col items-center mb-8">
              <div class="relative group mb-4">
                <div class="w-28 h-28 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden border-4 border-white shadow-md transform transition hover:scale-105">
                  <font-awesome-icon :icon="['fas', 'user']" class="text-white text-4xl" />
                </div>
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span class="text-white text-xs font-medium">Thay đổi</span>
                </div>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">{{ profileStore.profile?.fullname || 'Người dùng' }}</h3>
              <div v-if="isPremium" class="text-xs font-bold bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-3 py-1 rounded-full mb-1 shadow-sm flex items-center justify-center">
                <font-awesome-icon :icon="['fas', 'crown']" class="mr-1 text-xs" />
                PREMIUM
              </div>
              <p class="text-gray-500 text-sm">{{ profileStore.email }}</p>
            </div>
            
            <nav class="space-y-3">
              <button 
                @click="activeTab = 'profile'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center',
                  activeTab === 'profile' 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium border-l-4 border-blue-500' 
                    : 'hover:bg-gray-100 text-gray-700'
                ]"
              >
                <font-awesome-icon :icon="['fas', 'user']" class="mr-3" />
                Thông tin cá nhân
              </button>
              <button 
                @click="activeTab = 'password'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center',
                  activeTab === 'password' 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium border-l-4 border-blue-500' 
                    : 'hover:bg-gray-100 text-gray-700'
                ]"
              >
                <font-awesome-icon :icon="['fas', 'lock']" class="mr-3" />
                Đổi mật khẩu
              </button>
            </nav>
          </div>
          
          <!-- Main Content -->
          <div class="md:w-3/4 p-6">
            <!-- Loading Overlay -->
            <div v-if="profileStore.loading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-xl">
              <div class="flex flex-col items-center">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <span class="mt-3 text-gray-600">Đang xử lý...</span>
              </div>
            </div>
            
            <!-- Profile Information Form -->
            <div v-if="activeTab === 'profile'" class="transition-all duration-300">
              <h2 class="text-xl font-semibold mb-6 flex items-center text-gray-800">
                <font-awesome-icon :icon="['fas', 'user-edit']" class="mr-3 text-blue-500" />
                Cập nhật thông tin cá nhân
              </h2>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Email (Readonly) -->
                <div class="lg:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <font-awesome-icon :icon="['fas', 'envelope']" class="text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      :value="profileStore.email" 
                      class="w-full py-3 pl-10 pr-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-600 focus:ring-0" 
                      readonly
                    />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Xác thực</span>
                    </div>
                  </div>
                </div>
                
                <!-- Fullname -->
                <div class="lg:col-span-2">
                  <label for="fullname" class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <font-awesome-icon :icon="['fas', 'user']" class="text-gray-400" />
                    </div>
                    <input 
                      id="fullname"
                      type="text" 
                      v-model="profileForm.fullname" 
                      class="w-full py-3 pl-10 pr-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                      placeholder="Nhập họ và tên của bạn"
                    />
                  </div>
                </div>
                
                <!-- Gender -->
                <div class="lg:col-span-2">
                  <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  <div class="grid grid-cols-3 gap-3">
                    <div 
                      class="relative"
                      v-for="option in genderOptions" 
                      :key="option.value"
                    >
                      <input 
                        type="radio" 
                        :id="'gender-' + option.value" 
                        :value="option.value" 
                        v-model="profileForm.gender" 
                        class="sr-only peer"
                      />
                      <label 
                        :for="'gender-' + option.value" 
                        class="flex items-center justify-center p-3 w-full bg-white border rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:bg-gray-50 transition-all"
                      >
                        <font-awesome-icon :icon="option.icon" class="mr-2" :class="profileForm.gender === option.value ? 'text-blue-600' : 'text-gray-400'" />
                        <span :class="profileForm.gender === option.value ? 'text-blue-700 font-medium' : 'text-gray-700'">{{ option.label }}</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <!-- Premium Expiry Date -->
                <div v-if="isPremium" class="lg:col-span-2 mt-2">
                  <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div class="flex items-center">
                      <font-awesome-icon :icon="['fas', 'crown']" class="text-yellow-500 mr-3" />
                      <div>
                        <p class="text-sm font-medium text-gray-800">Thời hạn Premium</p>
                        <p class="text-sm text-gray-600">{{ premiumExpiryDate }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Submit Button -->
                <div class="lg:col-span-2 flex justify-end">
                  <button 
                    @click="updateProfile"
                    :disabled="profileStore.loading"
                    class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <font-awesome-icon :icon="['fas', 'save']" class="mr-2" />
                    <span v-if="profileStore.loading">Đang cập nhật...</span>
                    <span v-else>Lưu thay đổi</span>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Change Password Form -->
            <div v-if="activeTab === 'password'" class="transition-all duration-300">
              <h2 class="text-xl font-semibold mb-6 flex items-center text-gray-800">
                <font-awesome-icon :icon="['fas', 'key']" class="mr-3 text-blue-500" />
                Thay đổi mật khẩu
              </h2>
              
              <div class="space-y-6">
                <!-- Current Password -->
                <div>
                  <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <font-awesome-icon :icon="['fas', 'lock']" class="text-gray-400" />
                    </div>
                    <input 
                      id="currentPassword"
                      :type="showPassword.current ? 'text' : 'password'" 
                      v-model="passwordForm.currentPassword" 
                      class="w-full py-3 pl-10 pr-12 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <button 
                      type="button"
                      @click="showPassword.current = !showPassword.current"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                    >
                      <font-awesome-icon :icon="showPassword.current ? ['fas', 'eye-slash'] : ['fas', 'eye']" class="text-lg" />
                    </button>
                  </div>
                </div>
                
                <!-- New Password -->
                <div>
                  <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <font-awesome-icon :icon="['fas', 'lock']" class="text-gray-400" />
                    </div>
                    <input 
                      id="newPassword"
                      :type="showPassword.new ? 'text' : 'password'" 
                      v-model="passwordForm.newPassword" 
                      class="w-full py-3 pl-10 pr-12 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                      placeholder="Nhập mật khẩu mới"
                      @input="checkPasswordStrength"
                    />
                    <button 
                      type="button"
                      @click="showPassword.new = !showPassword.new"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                    >
                      <font-awesome-icon :icon="showPassword.new ? ['fas', 'eye-slash'] : ['fas', 'eye']" class="text-lg" />
                    </button>
                  </div>
                  
                  <!-- Password Strength Indicator -->
                  <div class="mt-2" v-if="passwordForm.newPassword">
                    <div class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        class="h-full transition-all duration-300"
                        :class="passwordStrengthClass"
                        :style="{ width: `${passwordStrength}%` }"
                      ></div>
                    </div>
                    <div class="flex justify-between mt-1">
                      <span class="text-xs" :class="passwordStrengthTextClass">{{ passwordStrengthText }}</span>
                      <span class="text-xs text-gray-500">{{ passwordForm.newPassword.length }} ký tự</span>
                    </div>
                  </div>
                </div>
                
                <!-- Confirm Password -->
                <div>
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <font-awesome-icon :icon="['fas', 'shield-alt']" class="text-gray-400" />
                    </div>
                    <input 
                      id="confirmPassword"
                      :type="showPassword.confirm ? 'text' : 'password'" 
                      v-model="passwordForm.confirmPassword" 
                      class="w-full py-3 pl-10 pr-12 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    <button 
                      type="button"
                      @click="showPassword.confirm = !showPassword.confirm"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                    >
                      <font-awesome-icon :icon="showPassword.confirm ? ['fas', 'eye-slash'] : ['fas', 'eye']" class="text-lg" />
                    </button>
                  </div>
                  
                  <!-- Password Match Indicator -->
                  <div class="mt-2" v-if="passwordForm.confirmPassword">
                    <div class="flex items-center">
                      <font-awesome-icon 
                        :icon="passwordsMatch ? ['fas', 'check-circle'] : ['fas', 'times-circle']"
                        :class="passwordsMatch ? 'text-green-500' : 'text-red-500'"
                        class="mr-2"
                      />
                      <span 
                        class="text-xs"
                        :class="passwordsMatch ? 'text-green-600' : 'text-red-600'"
                      >
                        {{ passwordsMatch ? 'Mật khẩu khớp' : 'Mật khẩu không khớp' }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- Error Message -->
                <div v-if="passwordError" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
                  <div class="flex items-center">
                    <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="mr-2" />
                    <p>{{ passwordError }}</p>
                  </div>
                </div>
                
                <!-- Password Tips -->
                <div class="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
                  <div class="flex">
                    <font-awesome-icon :icon="['fas', 'info-circle']" class="mr-2 mt-0.5" />
                    <div>
                      <p class="font-medium mb-1">Lời khuyên bảo mật:</p>
                      <ul class="text-sm ml-6 list-disc">
                        <li>Sử dụng ít nhất 8 ký tự</li>
                        <li>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                        <li>Không sử dụng thông tin cá nhân như tên hoặc ngày sinh</li>
                        <li>Không sử dụng cùng một mật khẩu cho nhiều tài khoản</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <!-- Submit Button -->
                <div class="flex justify-end">
                  <button 
                    @click="changePassword"
                    :disabled="profileStore.loading || !canSubmitPassword"
                    class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <font-awesome-icon :icon="['fas', 'key']" class="mr-2" />
                    <span v-if="profileStore.loading">Đang cập nhật...</span>
                    <span v-else>Đổi mật khẩu</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useProfileStore } from '../stores/profile'
import { useAuthStore } from '../stores/auth'
import { usePremiumStore } from '../stores/premium'

const profileStore = useProfileStore()
const authStore = useAuthStore()
const premiumStore = usePremiumStore()
const activeTab = ref('profile')
const passwordError = ref('')
const passwordStrength = ref(0)

// Kiểm tra tài khoản Premium
const isPremium = computed(() => {
  console.log('Profile data:', profileStore.profile);
  console.log('User data:', authStore.user);
  // Ưu tiên lấy từ profile nếu có, nếu không thì lấy từ authStore
  return profileStore.profile?.is_premium === true || authStore.user?.is_premium === true || false;
})

// Định dạng ngày hết hạn Premium
const premiumExpiryDate = computed(() => {
  // Ưu tiên lấy từ profile nếu có
  const expiryDate = profileStore.profile?.premium_expiry || authStore.user?.premium_expiry;
  
  if (!expiryDate) return 'Không xác định';
  
  // Parse ISO date string và format thành dạng ngày/tháng/năm
  const expiry = new Date(expiryDate);
  
  return expiry.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
})

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

// Tùy chọn giới tính
const genderOptions = [
  { value: 'male', label: 'Nam', icon: ['fas', 'mars'] },
  { value: 'female', label: 'Nữ', icon: ['fas', 'venus'] },
  { value: 'other', label: 'Khác', icon: ['fas', 'venus-mars'] }
]

// Đánh giá mật khẩu
const checkPasswordStrength = () => {
  const password = passwordForm.newPassword;
  
  if (!password) {
    passwordStrength.value = 0;
    return;
  }
  
  let strength = 0;
  
  // Độ dài
  if (password.length >= 8) strength += 20;
  else if (password.length >= 6) strength += 10;
  
  // Chữ hoa
  if (/[A-Z]/.test(password)) strength += 20;
  
  // Chữ thường
  if (/[a-z]/.test(password)) strength += 20;
  
  // Số
  if (/[0-9]/.test(password)) strength += 20;
  
  // Ký tự đặc biệt
  if (/[^A-Za-z0-9]/.test(password)) strength += 20;
  
  passwordStrength.value = strength;
}

// Lấy màu đánh giá mật khẩu
const passwordStrengthClass = computed(() => {
  if (passwordStrength.value < 30) return 'bg-red-500';
  if (passwordStrength.value < 60) return 'bg-yellow-500';
  if (passwordStrength.value < 80) return 'bg-blue-500';
  return 'bg-green-500';
})

// Lấy text đánh giá mật khẩu
const passwordStrengthText = computed(() => {
  if (passwordStrength.value < 30) return 'Rất yếu';
  if (passwordStrength.value < 60) return 'Yếu';
  if (passwordStrength.value < 80) return 'Tốt';
  return 'Mạnh';
})

// Lấy màu cho text đánh giá
const passwordStrengthTextClass = computed(() => {
  if (passwordStrength.value < 30) return 'text-red-600';
  if (passwordStrength.value < 60) return 'text-yellow-600';
  if (passwordStrength.value < 80) return 'text-blue-600';
  return 'text-green-600';
})

// Kiểm tra mật khẩu khớp nhau
const passwordsMatch = computed(() => {
  if (!passwordForm.confirmPassword) return false;
  return passwordForm.newPassword === passwordForm.confirmPassword;
})

// Kiểm tra có thể submit form mật khẩu
const canSubmitPassword = computed(() => {
  return (
    passwordForm.currentPassword && 
    passwordForm.newPassword && 
    passwordForm.confirmPassword && 
    passwordsMatch.value && 
    passwordStrength.value >= 60
  );
})

// Reset lỗi khi thay đổi form
watch(passwordForm, () => {
  passwordError.value = '';
})

// Lấy thông tin hồ sơ khi component được tạo
onMounted(async () => {
  // Đảm bảo thông tin người dùng đã được cập nhật
  if (authStore.isAuthenticated && !authStore.user) {
    authStore.updateUserFromToken()
  }
  
  const result = await profileStore.fetchProfile()
  
  if (result.success) {
    // Điền thông tin vào form
    profileForm.fullname = profileStore.profile.fullname || ''
    profileForm.gender = profileStore.profile.gender || 'male'
  }
  
  // Kiểm tra trạng thái Premium
  checkPremiumExpiry()
})

// Kiểm tra hạn Premium
async function checkPremiumExpiry() {
  // Kiểm tra xem Premium đã hết hạn chưa
  if (premiumStore.isPremium && premiumStore.isPremiumExpired) {
    console.log('Profile page - Premium đã hết hạn, đang hủy Premium...')
    await premiumStore.cancelPremium()
  }
}

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
    passwordStrength.value = 0
  }
}
</script> 