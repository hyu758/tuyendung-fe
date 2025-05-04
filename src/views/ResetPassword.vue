<template>
  <div class="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Đặt lại mật khẩu</h1>
        <p class="text-gray-600">Nhập mật khẩu mới cho tài khoản của bạn</p>
      </div>
      
      <div class="bg-white py-8 px-6 shadow rounded-lg">
        <BaseAlert
          v-if="successMessage"
          variant="success"
          :message="successMessage"
          :show="!!successMessage"
          class="mb-6"
        />
        
        <BaseAlert
          v-if="error"
          variant="error"
          :message="error"
          :show="!!error"
          class="mb-6"
        />
        
        <form v-if="!successMessage" @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <BaseInput
              v-model="password"
              type="password"
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              autocomplete="new-password"
              required
              prefixIcon="lock"
              :error="errors.password"
            />
            
            <BaseInput
              v-model="confirmPassword"
              type="password"
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu mới"
              autocomplete="new-password"
              required
              prefixIcon="lock"
              :error="errors.confirmPassword"
            />
            
            <div>
              <BaseButton
                type="submit"
                variant="primary"
                size="lg"
                :label="loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'"
                :loading="loading"
                :disabled="loading"
                class="w-full"
              />
            </div>
          </div>
        </form>
        
        <div v-else class="text-center">
          <i class="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
          <p class="text-gray-700 mb-6">Mật khẩu của bạn đã được đặt lại thành công.</p>
          <BaseButton
            variant="primary"
            label="Đăng nhập"
            @click="$router.push('/login')"
            class="w-full"
          />
        </div>
      </div>
      
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            <i class="fas fa-arrow-left mr-1"></i>
            Quay lại đăng nhập
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import BaseInput from '../components/common/BaseInput.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseAlert from '../components/common/BaseAlert.vue'
import { showSuccess, showError, showWarning } from '../utils/notifications'

const route = useRoute()
const router = useRouter()

// Form fields
const password = ref('')
const confirmPassword = ref('')
const errors = ref({})
const successMessage = ref('')
const loading = ref(false)
const error = ref('')
const token = ref('')

onMounted(() => {
  token.value = route.params.token
  
  if (!token.value) {
    error.value = 'Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.'
    showError('Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.')
    setTimeout(() => {
      router.push('/forgot-password')
    }, 3000)
  }
})

// Form submission
const handleSubmit = async () => {
  // Validate form
  errors.value = {}
  let isValid = true
  
  if (!password.value) {
    errors.value.password = 'Mật khẩu không được để trống'
    isValid = false
  } else if (password.value.length < 8) {
    errors.value.password = 'Mật khẩu phải có ít nhất 8 ký tự'
    isValid = false
  }
  
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    isValid = false
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Mật khẩu xác nhận không khớp'
    isValid = false
  }
  
  if (!isValid) return
  
  // Submit form
  loading.value = true
  error.value = ''
  
  try {
    const response = await axios.post(`/api/reset-password/${token.value}`, {
      password: password.value
    })
    const data = response.data;
    if (data.status === 200) {
      successMessage.value = 'Mật khẩu đã được đặt lại thành công.'
      showSuccess('Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập ngay bây giờ.')
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
    else{
        error.value = data.error || 'Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại.'
        showError(error.value)
    }
  } catch (err) {
    console.error('Lỗi đặt lại mật khẩu:', err)
    
    if (err.response) {
      error.value = err.response.data.error || 'Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại.'
      showError('Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại.')
    } else {
      error.value = 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.'
      showError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.')
    }
  } finally {
    loading.value = false
  }
}
</script> 