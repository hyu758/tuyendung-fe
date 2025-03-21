<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Kích hoạt tài khoản
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Vui lòng kiểm tra email của bạn để kích hoạt tài khoản
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Alert hiển thị lỗi -->
        <BaseAlert 
          v-if="error" 
          variant="error" 
          :message="error" 
          dismissible 
          @dismiss="error = ''" 
          class="mb-4"
        />
        
        <!-- Alert hiển thị thông báo thành công -->
        <BaseAlert 
          v-if="successMessage" 
          variant="success" 
          :message="successMessage" 
          dismissible 
          @dismiss="successMessage = ''" 
          class="mb-4"
        />

        <div v-if="!activationSuccess">
          <div class="text-center py-4">
            <font-awesome-icon :icon="['fas', 'envelope']" class="text-blue-500 text-5xl mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Kiểm tra hộp thư của bạn</h3>
            <p class="text-gray-600 mb-4">
              Chúng tôi đã gửi một email chứa liên kết kích hoạt đến <span class="font-medium">{{ email }}</span>.
              <br>Vui lòng kiểm tra hộp thư và nhấp vào liên kết để kích hoạt tài khoản.
            </p>
            
            <div class="mt-6 border-t border-gray-200 pt-6">
              <p class="text-sm text-gray-600 mb-4">Không nhận được email kích hoạt?</p>
              <BaseButton
                @click="resendActivationLink"
                variant="secondary"
                :loading="resendLoading"
                :disabled="resendLoading || resendCountdown > 0"
                :label="resendCountdown > 0 ? `Gửi lại sau ${resendCountdown}s` : 'Gửi lại email kích hoạt'"
                class="mx-auto"
              />
            </div>
          </div>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">
                  Hoặc
                </span>
              </div>
            </div>

            <div class="mt-6 text-center">
              <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Quay lại đăng nhập
              </router-link>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-4">
          <font-awesome-icon :icon="['fas', 'check-circle']" class="text-green-500 text-5xl mb-4" />
          <h3 class="text-lg font-medium text-gray-900">Tài khoản đã được kích hoạt thành công!</h3>
          <p class="mt-2 text-sm text-gray-600 mb-6">
            Bạn đã có thể đăng nhập và sử dụng đầy đủ các tính năng của ứng dụng.
          </p>
          <BaseButton
            @click="$router.push('/login')"
            variant="primary"
            label="Đăng nhập ngay"
            class="mx-auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BaseButton from '../components/common/BaseButton.vue'
import BaseAlert from '../components/common/BaseAlert.vue'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

// Lấy email từ route params hoặc query
const email = ref(route.params.email || route.query.email || '')

// Lấy token từ route params (nếu người dùng đến từ link email)
const token = route.params.token || route.query.token || ''

// Các trạng thái
const loading = ref(false)
const resendLoading = ref(false)
const error = ref('')
const successMessage = ref('')
const activationSuccess = ref(false)

// Đếm ngược để gửi lại email
const resendCountdown = ref(0)
let countdownTimer = null

// Gửi lại link kích hoạt
const resendActivationLink = async () => {
  if (resendCountdown.value > 0) return
  
  if (!email.value) {
    error.value = 'Email không được để trống. Vui lòng nhập email của bạn.'
    return
  }
  
  resendLoading.value = true
  
  try {
    const result = await authStore.resendActivationCode({ email: email.value })
    
    if (result.success) {
      successMessage.value = result.message || 'Email kích hoạt mới đã được gửi. Vui lòng kiểm tra hộp thư của bạn.'
      
      // Bắt đầu đếm ngược
      resendCountdown.value = 60
      countdownTimer = setInterval(() => {
        resendCountdown.value--
        if (resendCountdown.value <= 0) {
          clearInterval(countdownTimer)
        }
      }, 1000)
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Đã xảy ra lỗi khi gửi lại email kích hoạt. Vui lòng thử lại sau.'
    console.error('Lỗi gửi lại email kích hoạt:', err)
  } finally {
    resendLoading.value = false
  }
}

// Kích hoạt tài khoản từ token
const activateAccount = async (token) => {
  if (!token) return
  
  loading.value = true
  error.value = ''
  
  try {
    const result = await authStore.activateAccount({ token })
    
    if (result.success) {
      successMessage.value = result.message || 'Tài khoản đã được kích hoạt thành công!'
      activationSuccess.value = true
    } else {
      error.value = result.error || 'Không thể kích hoạt tài khoản. Token không hợp lệ hoặc đã hết hạn.'
    }
  } catch (err) {
    error.value = 'Đã xảy ra lỗi khi kích hoạt tài khoản. Vui lòng thử lại.'
    console.error('Lỗi kích hoạt:', err)
  } finally {
    loading.value = false
  }
}

// Kiểm tra token khi trang được tải
onMounted(() => {
  // Nếu có token trong URL, thực hiện kích hoạt
  if (token) {
    activateAccount(token)
  }
  
  // Xóa timer khi component unmounted
  return () => {
    if (countdownTimer) {
      clearInterval(countdownTimer)
    }
  }
})
</script>

<style>
/* Các animation được giữ nguyên từ Register.vue */
</style> 