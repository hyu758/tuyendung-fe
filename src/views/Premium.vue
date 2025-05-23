<!-- Premium.vue -->
<template>
  <div class="premium-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8">Nâng cấp tài khoản Premium</h1>
      <!-- Test Account Info -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-center">
        <h2 class="text-xl font-semibold text-yellow-800 mb-2">Chức năng này đang trong giai đoạn thử nghiệm</h2>
        <p class="text-yellow-700 mb-2">Dưới đây là thông tin tài khoản test để trải nghiệm thanh toán:</p>
        <div class="text-left max-w-md mx-auto">
          <p class="text-yellow-700"><span class="font-semibold">Ngân hàng:</span> NCB</p>
          <p class="text-yellow-700"><span class="font-semibold">Số thẻ:</span> 9704198526191432198</p>
          <p class="text-yellow-700"><span class="font-semibold">Tên chủ thẻ:</span> NGUYEN VAN A</p>
          <p class="text-yellow-700"><span class="font-semibold">Ngày phát hành:</span> 07/15</p>
          <p class="text-yellow-700"><span class="font-semibold">Mật khẩu OTP:</span> 123456</p>
        </div>
      </div>
      <!-- Premium Status -->
      <div v-if="premiumStore.isPremium" class="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
        <div class="flex items-center justify-center mb-4">
          <i class="fas fa-crown text-yellow-500 text-5xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-green-800 mb-2">Tài khoản Premium đang hoạt động!</h2>
        <p class="text-green-700 mb-2">Bạn đang sử dụng tài khoản Premium với đầy đủ tính năng.</p>
        <p class="text-green-700">
          <span class="font-semibold">Ngày hết hạn:</span> 
          {{ formatDate(premiumStore.premiumExpiry) }}
        </p>
      </div>
      
      <!-- Loading State -->
      <div v-if="premiumStore.loading" class="text-center py-8">
        <div class="spinner inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600">Đang tải thông tin...</p>
      </div>
      
      <!-- Error State -->
      <div v-if="premiumStore.error && !premiumStore.loading" class="bg-red-50 text-red-700 p-4 rounded-lg mb-8">
        <p>{{ premiumStore.error }}</p>
      </div>
      
      <!-- Premium Packages -->
      <div v-if="!premiumStore.loading" class="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div v-for="pkg in premiumStore.packages" :key="pkg.id" 
             class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow flex flex-col">
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 py-6 px-6">
            <h3 class="text-2xl font-bold text-white">{{ pkg.name }}</h3>
            <p class="text-white text-opacity-90 mt-1">{{ pkg.description }}</p>
          </div>
          
          <div class="p-6 flex flex-col flex-grow">
            <div class="flex items-baseline mb-6">
              <span class="text-3xl font-bold text-gray-900">{{ formatPrice(pkg.price) }}</span>
              <span class="text-gray-500 ml-1">VND</span>
            </div>
            
            <ul class="mb-8 space-y-4 flex-grow">
              <li v-for="(feature, index) in pkg.features" :key="index" class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{{ feature }}</span>
              </li>
            </ul>
            
            <button 
              @click="handlePurchase(pkg.id)"
              :disabled="premiumStore.isPremium || isBuying"
              class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed h-12"
            >
              <span v-if="isBuying && selectedPackageId === pkg.id">
                <span class="spinner inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Đang xử lý...
              </span>
              <span v-else-if="premiumStore.isPremium">Đã kích hoạt</span>
              <span v-else>Mua ngay</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- No Packages Found -->
      <div v-if="!premiumStore.loading && premiumStore.packages.length === 0" class="text-center py-8">
        <p class="text-gray-600">Không tìm thấy thông tin gói Premium. Vui lòng thử lại sau.</p>
      </div>
      
      <!-- Premium Benefits -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold text-center mb-8">Đặc quyền của tài khoản Premium</h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Tìm kiếm nâng cao</h3>
            <p class="text-gray-600">Dễ dàng lọc và tìm kiếm công việc phù hợp với nhiều tiêu chí khác nhau.</p>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Ưu tiên hiển thị</h3>
            <p class="text-gray-600">Hồ sơ của bạn sẽ được ưu tiên hiển thị cho nhà tuyển dụng.</p>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Hỗ trợ 24/7</h3>
            <p class="text-gray-600">Được hỗ trợ nhanh chóng mọi lúc, mọi nơi.</p>
          </div>
        </div>
      </div>
      
      <!-- Premium History Section -->
      <div v-if="!premiumStore.loading && premiumStore.sortedPremiumHistory.length > 0" class="mt-16">
        <h2 class="text-2xl font-bold text-center mb-8">Lịch sử đăng ký Premium</h2>
        
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200 divide-y divide-gray-200 rounded-lg overflow-hidden">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gói</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày bắt đầu</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày kết thúc</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="history in premiumStore.sortedPremiumHistory" :key="history.id" :class="{'bg-yellow-50': history.is_active}">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ history.package_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatPrice(history.package_price) }} VNĐ
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ history.start_date }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ history.end_date }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span v-if="history.is_active" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg class="w-2 h-2 mr-1 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Đang hoạt động
                  </span>
                  <span v-else-if="history.is_cancelled" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <svg class="w-2 h-2 mr-1 text-red-400" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Đã hủy ({{ history.cancelled_date }})
                  </span>
                  <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <svg class="w-2 h-2 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Hết hạn
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Payment Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <div class="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <h2 class="text-2xl font-bold mb-4">Thanh toán thành công!</h2>
          <p class="text-gray-600 mb-6">Tài khoản của bạn đã được nâng cấp lên Premium thành công.</p>
          <button @click="showSuccessModal = false" class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">Đóng</button>
        </div>
      </div>
    </div>
    
    <!-- Payment Failed Modal -->
    <div v-if="showFailedModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <div class="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <h2 class="text-2xl font-bold mb-4">Thanh toán thất bại!</h2>
          <p class="text-gray-600 mb-6">Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.</p>
          <button @click="showFailedModal = false" class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { usePremiumStore } from '../stores/premium'
import { useAuthStore } from '../stores/auth'
import { useRoute } from 'vue-router'

export default {
  name: 'PremiumPage',
  
  setup() {
    const premiumStore = usePremiumStore()
    const authStore = useAuthStore()
    const route = useRoute()
    
    const isBuying = ref(false)
    const selectedPackageId = ref(null)
    const showSuccessModal = ref(false)
    const showFailedModal = ref(false)
    
    // Kiểm tra trạng thái thanh toán từ URL
    const checkPaymentStatus = () => {
      if (route.query.status === 'success') {
        showSuccessModal.value = true
        // Cập nhật thông tin người dùng để lấy trạng thái Premium mới
        authStore.updateUserFromToken()
      } else if (route.query.status === 'failed') {
        showFailedModal.value = true
      }
    }
    
    // Xử lý khi người dùng nhấn nút mua gói Premium
    const handlePurchase = async (packageId) => {
      if (isBuying.value) return
      
      selectedPackageId.value = packageId
      isBuying.value = true
      
      try {
        const response = await premiumStore.purchasePremium(packageId)
        
        if (response.success && response.paymentUrl) {
          // Chuyển hướng đến trang thanh toán
          window.location.href = response.paymentUrl
        } else {
          console.error('Không thể tạo URL thanh toán')
        }
      } catch (error) {
        console.error('Lỗi khi mua gói Premium:', error)
      } finally {
        isBuying.value = false
      }
    }
    
    // Format số tiền thành dạng có dấu phân cách
    const formatPrice = (price) => {
      return new Intl.NumberFormat('vi-VN').format(price)
    }
    
    // Format ngày thành dạng dd/mm/yyyy
    const formatDate = (dateString) => {
      if (!dateString) return 'Không xác định'
      
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }
    
    onMounted(async () => {
      // Kiểm tra hạn Premium
      if (premiumStore.isPremium && premiumStore.isPremiumExpired) {
        await premiumStore.cancelPremium()
      }

      // Lấy danh sách gói Premium
      await premiumStore.fetchPremiumPackages()
      
      // Kiểm tra trạng thái thanh toán từ URL
      checkPaymentStatus()
    })
    
    onBeforeUnmount(() => {
      // Reset store khi rời khỏi trang
      premiumStore.reset()
    })
    
    return {
      premiumStore,
      isBuying,
      selectedPackageId,
      showSuccessModal,
      showFailedModal,
      handlePurchase,
      formatPrice,
      formatDate
    }
  }
}
</script>

<style scoped>
.premium-page {
  min-height: calc(100vh - 64px);
  background-color: #f9fafb;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
</style> 