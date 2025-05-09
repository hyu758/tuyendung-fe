<template>
  <div class="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
        <p class="text-gray-600">Đăng nhập để tiếp tục với JobHub</p>
      </div>

      <div class="bg-white py-8 px-6 shadow rounded-lg">
        <BaseAlert v-if="authStore.error" variant="error" :message="authStore.error" :show="!!authStore.error"
          dismissible @dismiss="authStore.error = null" class="mb-6" />

        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <BaseInput v-model="username" type="text" label="Tên đăng nhập" placeholder="Tên đăng nhập của bạn"
              autocomplete="username" required prefixIcon="user" :error="errors.username"
              class="transform transition-all duration-200 focus-within:scale-105" />

            <BaseInput v-model="password" type="password" label="Mật khẩu" placeholder="Mật khẩu của bạn"
              autocomplete="current-password" required prefixIcon="lock" :error="errors.password"
              class="transform transition-all duration-200 focus-within:scale-105" />

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember_me" type="checkbox" v-model="rememberMe"
                  class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all" />
                <label for="remember_me" class="ml-2 block text-sm text-gray-700">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div class="text-sm">
                <router-link to="/forgot-password"
                  class="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  Quên mật khẩu?
                </router-link>
              </div>
            </div>

            <div>
              <BaseButton type="submit" variant="primary" size="lg" label="Đăng nhập" :loading="authStore.loading"
                :disabled="authStore.loading"
                class="w-full transform transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-lg py-4 text-lg font-bold" />
            </div>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
            </div>
          </div>

          <div class="mt-6">
            <BaseButton variant="light" class="w-full" :icon="['fab', 'google']" label="Google"
              @click="loginWithGoogle" />
          </div>
        </div>
      </div>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Chưa có tài khoản?
          <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            Đăng ký ngay
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import BaseInput from '../components/common/BaseInput.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseAlert from '../components/common/BaseAlert.vue'

const router = useRouter()
const authStore = useAuthStore()

// Remove auth message listener when component unmounts
let removeAuthListener = null;
onUnmounted(() => {
  if (removeAuthListener) {
    removeAuthListener();
  }
});

// Form fields
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const errors = ref({})

// Check if user is already logged in
onMounted(() => {
  // Reset any previous errors
  authStore.error = null

  // Check if user is already authenticated
  if (authStore.isAuthenticated) {
    // Redirect based on role
    if (authStore.userRole === 'admin') {
      router.push('/admin/dashboard')
    } else if (authStore.userRole === 'employer') {
      router.push('/employer/dashboard')
    } else if (authStore.userRole === 'none') {
      router.push('/select-role')
    }
  }
})

// Form submission
const handleSubmit = async () => {
  // Reset previous errors
  errors.value = {}
  authStore.error = null
  let isValid = true

  if (!username.value) {
    errors.value.username = 'Tên đăng nhập không được để trống'
    isValid = false
  }

  if (!password.value) {
    errors.value.password = 'Mật khẩu không được để trống'
    isValid = false
  }

  if (!isValid) return

  try {
    const result = await authStore.login({
      email: username.value,
      password: password.value,
      remember: rememberMe.value
    })
    
    // Xử lý các lỗi cụ thể từ backend
    if (!result?.success && result?.errors) {
      console.log('Received errors from backend:', result.errors);
      
      // Gán lỗi từ backend vào biến errors
      Object.keys(result.errors).forEach(field => {
        // Trường hợp lỗi là mảng, lấy thông báo đầu tiên
        if (Array.isArray(result.errors[field])) {
          errors.value[field] = result.errors[field][0];
        } else {
          errors.value[field] = result.errors[field];
        }
      });
      
      // Hiển thị lỗi chung nếu có lỗi không thuộc về trường cụ thể
      if (result.errors.account) {
        authStore.error = Array.isArray(result.errors.account) 
          ? result.errors.account[0] 
          : result.errors.account;
      }
    }
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error)
    authStore.error = 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.'
  }
}


// Social login methods
const loginWithGoogle = () => {
  try {
    const isProd = import.meta.env.PROD
    const baseURL = isProd
      ? import.meta.env.VITE_API_URL || 'https://api.tuyendungtlu.site'
      : 'http://127.0.0.1:8000'
    window.location.href = baseURL + '/api/auth/login/google-oauth2/';
  } catch (error) {
    console.error('Lỗi khi bắt đầu đăng nhập với Google:', error);
    authStore.error = 'Có lỗi xảy ra khi bắt đầu đăng nhập Google';
  }
}
</script>