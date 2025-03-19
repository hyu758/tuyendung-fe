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
                label="Gửi yêu cầu đặt lại mật khẩu"
                :loading="authStore.loading"
                :disabled="authStore.loading"
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

const authStore = useAuthStore()

// Form fields
const email = ref('')
const errors = ref({})
const successMessage = ref('')

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
  const result = await authStore.forgotPassword(email.value)
  
  if (result.success) {
    successMessage.value = 'Email hướng dẫn đặt lại mật khẩu đã được gửi.'
  }
}

// Email validation
const isValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
</script> 