<template>
  <div class="payment-result-page">
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
        <!-- Payment Success -->
        <div v-if="isSuccess" class="text-center">
          <div class="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 class="text-3xl font-bold text-gray-800 mb-4">Thanh toán thành công!</h1>
          <p class="text-gray-600 mb-6">Tài khoản của bạn đã được nâng cấp lên Premium.</p>
          
          <div v-if="packageInfo" class="bg-gray-50 rounded-lg p-4 mb-8 text-left">
            <h2 class="font-semibold text-lg mb-2">Thông tin gói Premium:</h2>
            <p><span class="font-medium">Tên gói:</span> {{ packageInfo.name }}</p>
            <p><span class="font-medium">Thời hạn:</span> {{ packageInfo.duration }}</p>
          </div>
          
          <div class="flex flex-col space-y-3">
            <router-link to="/profile" class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">
              Xem tài khoản của bạn
            </router-link>
            <router-link to="/" class="text-blue-600 hover:text-blue-800">
              Về trang chủ
            </router-link>
          </div>
        </div>
        
        <!-- Payment Failed -->
        <div v-else class="text-center">
          <div class="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 class="text-3xl font-bold text-gray-800 mb-4">Thanh toán thất bại!</h1>
          <p class="text-gray-600 mb-8">
            Có lỗi xảy ra trong quá trình thanh toán. 
            Vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ.
          </p>
          
          <div class="flex flex-col space-y-3">
            <router-link to="/premium" class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">
              Thử lại
            </router-link>
            <router-link to="/" class="text-blue-600 hover:text-blue-800">
              Về trang chủ
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'PaymentResult',
  
  setup() {
    const route = useRoute()
    const authStore = useAuthStore()
    
    // Kiểm tra kết quả thanh toán dựa vào query parameter trong URL
    const isSuccess = computed(() => {
      return route.path.includes('payment-success')
    })
    
    // Lấy thông tin gói premium từ URL
    const packageInfo = computed(() => {
      if (!route.query.package || !route.query.name) return null
      
      const packageId = parseInt(route.query.package)
      
      return {
        id: packageId,
        name: route.query.name,
        duration: packageId === 2 ? '1 năm' : '1 tháng'
      }
    })
    
    onMounted(() => {
      // Cập nhật thông tin người dùng nếu thanh toán thành công
      if (isSuccess.value) {
        authStore.updateUserFromToken()
      }
    })
    
    return {
      isSuccess,
      packageInfo
    }
  }
}
</script>

<style scoped>
.payment-result-page {
  min-height: calc(100vh - 64px);
  background-color: #f9fafb;
}
</style> 