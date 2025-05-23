<template>
  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-lg mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-3 animate__animated animate__fadeIn">Đăng ký tài khoản</h1>
        <p class="text-lg text-gray-600">Tạo tài khoản mới để sử dụng đầy đủ tính năng của JobHub</p>
      </div>
      
      <div class="bg-white py-8 px-6 shadow-xl rounded-xl transition-all duration-300 transform hover:shadow-2xl">
        <BaseAlert
          v-if="authStore.error"
          variant="error"
          :message="authStore.error"
          :show="!!authStore.error"
          class="mb-6"
        />
        
        <BaseAlert
          v-if="successMessage"
          variant="success"
          :message="successMessage"
          :show="!!successMessage"
          class="mb-6"
        />
        
        <!-- Lựa chọn loại tài khoản -->
        <div class="mb-8">
          <label class="block text-sm font-semibold text-gray-700 mb-3">Bạn là?</label>
          <div class="flex space-x-4">
            <div
              :class="[
                'flex-1 rounded-lg border-2 p-5 cursor-pointer transition-all duration-200 transform hover:scale-105',
                {
                  'border-blue-500 bg-blue-50 shadow-md': registerType === 'applicant',
                  'border-gray-200 hover:border-blue-300': registerType !== 'applicant'
                }
              ]"
              @click="registerType = 'applicant'"
            >
              <div class="flex items-center mb-3">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <font-awesome-icon icon="user" class="text-blue-600 text-lg" />
                </div>
                <h3 class="font-bold text-lg">Ứng viên</h3>
              </div>
              <p class="text-sm text-gray-600">Tìm kiếm công việc phù hợp từ nhà tuyển dụng uy tín</p>
            </div>
            
            <div
              :class="[
                'flex-1 rounded-lg border-2 p-5 cursor-pointer transition-all duration-200 transform hover:scale-105',
                {
                  'border-blue-500 bg-blue-50 shadow-md': registerType === 'recruiter',
                  'border-gray-200 hover:border-blue-300': registerType !== 'recruiter'
                }
              ]"
              @click="registerType = 'recruiter'"
            >
              <div class="flex items-center mb-3">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <font-awesome-icon icon="building" class="text-blue-600 text-lg" />
                </div>
                <h3 class="font-bold text-lg">Nhà tuyển dụng</h3>
              </div>
              <p class="text-sm text-gray-600">Đăng tin tuyển dụng và tìm kiếm ứng viên phù hợp</p>
            </div>
          </div>
        </div>
        
        <form @submit.prevent="handleSubmit" class="transform transition-all duration-300">
          <div class="space-y-8">
            <!-- Form cho cả hai loại tài khoản -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-7">
              <BaseInput
                v-model="username"
                label="Tên đăng nhập"
                placeholder="Tên đăng nhập"
                required
                prefixIcon="user"
                :error="errors.username"
                class="transform transition-all duration-200 focus-within:scale-105"
              />
              
              <BaseInput
                v-model="email"
                type="email"
                label="Email"
                placeholder="Email của bạn"
                autocomplete="email"
                required
                prefixIcon="envelope"
                :error="errors.email"
                class="transform transition-all duration-200 focus-within:scale-105"
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-7">
              <BaseInput
                v-model="fullname"
                label="Họ và tên"
                placeholder="Họ và tên đầy đủ"
                required
                prefixIcon="user"
                :error="errors.fullname"
                class="transform transition-all duration-200 focus-within:scale-105"
              />
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                <div class="relative">
                  <select
                    v-model="gender"
                    class="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    :class="{'border-red-500': errors.gender}"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <font-awesome-icon icon="venus-mars" class="text-gray-400" />
                  </div>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <font-awesome-icon icon="chevron-down" class="text-gray-400" />
                  </div>
                </div>
                <div v-if="errors.gender" class="mt-1 text-sm text-red-600">
                  {{ errors.gender }}
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-7">
              <BaseInput
                v-model="password"
                type="password"
                label="Mật khẩu"
                placeholder="Tạo mật khẩu"
                autocomplete="new-password"
                required
                prefixIcon="lock"
                :error="errors.password"
                class="transform transition-all duration-200"
              />
              
              <BaseInput
                v-model="confirmPassword"
                type="password"
                label="Xác nhận mật khẩu"
                placeholder="Xác nhận mật khẩu"
                autocomplete="new-password"
                required
                prefixIcon="lock"
                :error="errors.confirmPassword"
                class="transform transition-all duration-200"
              />
            </div>
            
            <div class="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center">
              <input
                id="terms"
                type="checkbox"
                v-model="acceptTerms"
                class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all"
                :class="{'border-red-500': errors.acceptTerms}"
                required
              />
              <label for="terms" class="ml-3 block text-sm text-gray-700">
                Tôi đồng ý với <a href="#" class="text-blue-600 hover:text-blue-800 font-medium">Điều khoản sử dụng</a> và <a href="#" class="text-blue-600 hover:text-blue-800 font-medium">Chính sách bảo mật</a>
              </label>
            </div>
            <div v-if="errors.acceptTerms" class="text-sm text-red-600 mt-1 italic">
              {{ errors.acceptTerms }}
            </div>
            
            <div class="pt-2">
              <BaseButton
                type="submit"
                variant="primary"
                size="lg"
                label="Đăng ký tài khoản"
                :loading="authStore.loading"
                :disabled="authStore.loading"
                class="w-full transform transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-lg py-4 text-lg font-bold"
              />
            </div>
          </div>
        </form>
      </div>
      
      <div class="mt-8 text-center">
        <p class="text-gray-600">
          Đã có tài khoản?
          <router-link to="/login" class="font-bold text-blue-600 hover:text-blue-800 transition-colors duration-300 ml-1">
            Đăng nhập ngay
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import BaseInput from '../components/common/BaseInput.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseAlert from '../components/common/BaseAlert.vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const registerType = ref('applicant')
const username = ref('')
const email = ref('')
const fullname = ref('')
const gender = ref('male')
const password = ref('')
const confirmPassword = ref('')
const errors = ref({})
const acceptTerms = ref(false)
const successMessage = ref('')

const handleSubmit = async () => {
  // Reset lỗi
  errors.value = {}
  authStore.error = null
  
  // Trim values
  if (username.value) username.value = username.value.trim()
  if (email.value) email.value = email.value.trim()
  if (fullname.value) fullname.value = fullname.value.trim()
  if (password.value) password.value = password.value.trim()
  if (confirmPassword.value) confirmPassword.value = confirmPassword.value.trim()
  
  // Xác thực các trường
  validateFields()
  
  // Nếu có lỗi, dừng lại
  if (Object.keys(errors.value).length > 0) return
  
  // Submit form
  try {
    const registerData = {
      username: username.value,
      email: email.value,
      password: password.value,
      fullname: fullname.value,
      gender: gender.value,
      role: registerType.value === 'recruiter' ? 'employer' : 'candidate'
    }

    const result = await authStore.register(registerData)
    
    if (result.success) {
      successMessage.value = result.message || 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.'
      
      // Reset form sau khi đăng ký thành công
      username.value = ''
      email.value = ''
      password.value = ''
      confirmPassword.value = ''
      fullname.value = ''
      acceptTerms.value = false
      
      // Chuyển hướng đến trang kích hoạt sau 3 giây
      setTimeout(() => {
        router.push({
          name: 'Login'
        })
      }, 3000)
    } else {
      // Xử lý các lỗi chi tiết từ backend
      if (result.errors) {
        // Gán lỗi vào object errors để hiển thị theo từng field
        Object.keys(result.errors).forEach(field => {
          if (Array.isArray(result.errors[field])) {
            errors.value[field] = result.errors[field][0]
          } else {
            errors.value[field] = result.errors[field]
          }
        })
      }
      
      // Nếu không có lỗi cụ thể, hiển thị lỗi chung
      if (Object.keys(errors.value).length === 0 && result.error) {
        authStore.error = result.error
      }
    }
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error)
    authStore.error = 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.'
  }
}

// Validate email format
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validateFields = () => {
  // Validate các trường cơ bản
  if (!username.value) errors.value.username = 'Vui lòng nhập tên đăng nhập'
  else if (username.value.trim() === '') errors.value.username = 'Tên đăng nhập không thể chỉ có khoảng trắng'
  
  if (!email.value) errors.value.email = 'Vui lòng nhập email'
  else if (email.value.trim() === '') errors.value.email = 'Email không thể chỉ có khoảng trắng'
  else if (!isValidEmail(email.value)) errors.value.email = 'Email không hợp lệ'
  
  if (!fullname.value) errors.value.fullname = 'Vui lòng nhập họ và tên'
  else if (fullname.value.trim() === '') errors.value.fullname = 'Họ và tên không thể chỉ có khoảng trắng'
  
  if (!password.value) errors.value.password = 'Vui lòng nhập mật khẩu'
  else if (password.value.trim() === '') errors.value.password = 'Mật khẩu không thể chỉ có khoảng trắng'
  
  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Mật khẩu xác nhận không khớp'
  }
  
  if (!acceptTerms.value) {
    errors.value.acceptTerms = 'Vui lòng đồng ý với điều khoản sử dụng'
  }
}
</script>

<style>
/* Thêm các styles cho animation */
.animate__animated {
  animation-duration: 1s;
}

.animate__fadeIn {
  animation-name: fadeIn;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 