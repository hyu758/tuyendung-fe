<template>
  <div class="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Quên mật khẩu</h1>
        <p class="text-gray-600">Nhập email của bạn để đặt lại mật khẩu</p>
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
          v-if="authStore.error"
          variant="error"
          :message="authStore.error"
          :show="!!authStore.error"
          class="mb-6"
        />
        
        <form v-if="!successMessage" @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <BaseInput
              v-model="email"
              type="email"
              label="Email"
              placeholder="Email đã đăng ký"
              autocomplete="email"
              required
              prefixIcon="envelope"
              :error="errors.email"
            />
            
            <div>
              <BaseButton
                type="submit"
                variant="primary"
                size="lg"
                :label="isSubmitting ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu đặt lại mật khẩu'"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                class="w-full"
              />
            </div>
          </div>
        </form>
        
        <div v-else class="text-center">
          <font-awesome-icon icon="check-circle" class="text-green-500 text-5xl mb-4" />
          <p class="text-gray-700 mb-6">Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.</p>
          <BaseButton
            variant="primary"
            label="Quay lại đăng nhập"
            @click="$router.push('/login')"
            class="w-full"
          />
        </div>
      </div>
      
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            <font-awesome-icon icon="arrow-left" class="mr-1" />
            Quay lại đăng nhập
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import BaseInput from '../components/common/BaseInput.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseAlert from '../components/common/BaseAlert.vue'
import axios from 'axios'
import { showSuccess, showError } from '../utils/notifications'

const authStore = useAuthStore()

// Form fields
const email = ref('')
const errors = ref({})
const successMessage = ref('')
const isSubmitting = ref(false)

// Hàm hiển thị thông báo toàn cục
const showGlobalNotification = (message, type = 'success') => {
  // Tạo thông báo để hiển thị qua localStorage
  localStorage.setItem('notification', JSON.stringify({
    message,
    type,
    id: Date.now()
  }))
}

// Form submission
const handleSubmit = async () => {
  // Validate form
  errors.value = {}
  let isValid = true
  
  if (!email.value) {
    errors.value.email = 'Email không được để trống'
    isValid = false
  } else if (!isValidEmail(email.value)) {
    errors.value.email = 'Email không hợp lệ'
    isValid = false
  }
  
  if (!isValid) return
  
  // Submit form
  isSubmitting.value = true
  authStore.error = null
  
  try {
    const response = await fetch('http://127.0.0.1:8000/api/forgot-password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email.value })
    })
    const data = await response.json()
    console.log(data)
    if (response.status === 200) {
      successMessage.value = 'Email hướng dẫn đặt lại mật khẩu đã được gửi.'
      showSuccess('Email hướng dẫn đặt lại mật khẩu đã được gửi thành công.')
    } else {
      // Hiển thị lỗi từ API
      authStore.error = data.error || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.'
      showError(authStore.error)
    }
  } catch (err) {
    console.error('Lỗi quên mật khẩu:', err)
    
    if (err.response) {
      authStore.error = err.response.data.error || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.'
      showError('Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.')
    } else {
      authStore.error = 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.'
      showError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.')
    }
  } finally {
    isSubmitting.value = false
  }
}

// Email validation
const isValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
</script> 