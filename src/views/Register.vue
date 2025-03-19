<template>
  <div class="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-lg mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Đăng ký tài khoản</h1>
        <p class="text-gray-600">Tạo tài khoản mới để sử dụng đầy đủ tính năng của JobHub</p>
      </div>
      
      <div class="bg-white py-8 px-6 shadow rounded-lg">
        <BaseAlert
          v-if="authStore.error"
          variant="error"
          :message="authStore.error"
          :show="!!authStore.error"
          class="mb-6"
        />
        
        <!-- Lựa chọn loại tài khoản -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Bạn là?</label>
          <div class="flex space-x-4">
            <div
              :class="[
                'flex-1 rounded-md border p-4 cursor-pointer',
                {
                  'border-blue-500 bg-blue-50': accountType === 'candidate',
                  'border-gray-300 hover:border-blue-300': accountType !== 'candidate'
                }
              ]"
              @click="accountType = 'candidate'"
            >
              <div class="flex items-center mb-2">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <font-awesome-icon icon="user" class="text-blue-600" />
                </div>
                <h3 class="font-medium">Ứng viên</h3>
              </div>
              <p class="text-sm text-gray-500">Tìm kiếm công việc phù hợp từ nhà tuyển dụng uy tín</p>
            </div>
            
            <div
              :class="[
                'flex-1 rounded-md border p-4 cursor-pointer',
                {
                  'border-blue-500 bg-blue-50': accountType === 'employer',
                  'border-gray-300 hover:border-blue-300': accountType !== 'employer'
                }
              ]"
              @click="accountType = 'employer'"
            >
              <div class="flex items-center mb-2">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <font-awesome-icon icon="building" class="text-blue-600" />
                </div>
                <h3 class="font-medium">Nhà tuyển dụng</h3>
              </div>
              <p class="text-sm text-gray-500">Đăng tin tuyển dụng và tìm kiếm ứng viên phù hợp</p>
            </div>
          </div>
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <!-- Form cho cả hai loại tài khoản -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                v-model="form.firstName"
                label="Họ"
                placeholder="Họ của bạn"
                required
                :error="errors.firstName"
              />
              
              <BaseInput
                v-model="form.lastName"
                label="Tên"
                placeholder="Tên của bạn"
                required
                :error="errors.lastName"
              />
            </div>
            
            <BaseInput
              v-model="form.email"
              type="email"
              label="Email"
              placeholder="Email của bạn"
              autocomplete="email"
              required
              prefixIcon="envelope"
              :error="errors.email"
            />
            
            <!-- Form cho nhà tuyển dụng -->
            <div v-if="accountType === 'employer'">
              <BaseInput
                v-model="form.companyName"
                label="Tên công ty"
                placeholder="Tên công ty của bạn"
                required
                prefixIcon="building"
                :error="errors.companyName"
              />
              
              <BaseInput
                v-model="form.companySize"
                label="Quy mô công ty"
                placeholder="Số lượng nhân viên"
                class="mt-6"
                :error="errors.companySize"
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                v-model="form.password"
                type="password"
                label="Mật khẩu"
                placeholder="Tạo mật khẩu"
                autocomplete="new-password"
                required
                prefixIcon="lock"
                :error="errors.password"
              />
              
              <BaseInput
                v-model="form.confirmPassword"
                type="password"
                label="Xác nhận mật khẩu"
                placeholder="Xác nhận mật khẩu"
                autocomplete="new-password"
                required
                prefixIcon="lock"
                :error="errors.confirmPassword"
              />
            </div>
            
            <div class="flex items-center">
              <input
                id="terms"
                type="checkbox"
                v-model="form.terms"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                :class="{'border-red-500': errors.terms}"
                required
              />
              <label for="terms" class="ml-2 block text-sm text-gray-700">
                Tôi đồng ý với <a href="#" class="text-blue-600 hover:text-blue-800">Điều khoản sử dụng</a> và <a href="#" class="text-blue-600 hover:text-blue-800">Chính sách bảo mật</a>
              </label>
            </div>
            <div v-if="errors.terms" class="text-sm text-red-600 mt-1">
              {{ errors.terms }}
            </div>
            
            <div>
              <BaseButton
                type="submit"
                variant="primary"
                size="lg"
                label="Đăng ký tài khoản"
                :loading="authStore.loading"
                :disabled="authStore.loading"
                class="w-full"
              />
            </div>
          </div>
        </form>
      </div>
      
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Đã có tài khoản?
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
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

const authStore = useAuthStore()

// Loại tài khoản (ứng viên hoặc nhà tuyển dụng)
const accountType = ref('candidate')

// Form fields
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  companyName: '',
  companySize: '',
  password: '',
  confirmPassword: '',
  terms: false
})

const errors = ref({})

// Form submission
const handleSubmit = async () => {
  // Validate form
  errors.value = {}
  let isValid = true
  
  if (!form.firstName.trim()) {
    errors.value.firstName = 'Họ không được để trống'
    isValid = false
  }
  
  if (!form.lastName.trim()) {
    errors.value.lastName = 'Tên không được để trống'
    isValid = false
  }
  
  if (!form.email) {
    errors.value.email = 'Email không được để trống'
    isValid = false
  } else if (!isValidEmail(form.email)) {
    errors.value.email = 'Email không hợp lệ'
    isValid = false
  }
  
  if (accountType.value === 'employer' && !form.companyName.trim()) {
    errors.value.companyName = 'Tên công ty không được để trống'
    isValid = false
  }
  
  if (!form.password) {
    errors.value.password = 'Mật khẩu không được để trống'
    isValid = false
  } else if (form.password.length < 8) {
    errors.value.password = 'Mật khẩu phải có ít nhất 8 ký tự'
    isValid = false
  }
  
  if (!form.confirmPassword) {
    errors.value.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.value.confirmPassword = 'Mật khẩu xác nhận không khớp'
    isValid = false
  }
  
  if (!form.terms) {
    errors.value.terms = 'Bạn phải đồng ý với điều khoản sử dụng'
    isValid = false
  }
  
  if (!isValid) return
  
  // Prepare user data
  const userData = {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    password: form.password,
    role: accountType.value
  }
  
  // Add employer specific fields
  if (accountType.value === 'employer') {
    userData.companyName = form.companyName
    userData.companySize = form.companySize
  }
  
  // Submit form
  const result = await authStore.register(userData)
  
  if (!result.success) {
    // Display error message from the store
    console.error('Đăng ký thất bại')
  }
}

// Email validation
const isValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
</script> 