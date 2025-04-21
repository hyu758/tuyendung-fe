<template>
    <div class="premium-container">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Nâng cấp tài khoản Premium</h1>
        <p class="text-gray-600 mt-1">Mở khóa tính năng cao cấp cho việc tuyển dụng của bạn</p>
      </div>
      
      <!-- Premium Status -->
      <div v-if="premiumStore.isPremium" class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6 transition-all">
        <div class="flex items-center">
          <div class="flex-shrink-0 mr-4">
            <i class="fas fa-crown text-yellow-500 text-4xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-green-800 mb-1">Tài khoản Premium đang hoạt động!</h2>
            <p class="text-green-700 mb-1">Bạn đang sử dụng đầy đủ các tính năng cao cấp.</p>
            <p class="text-green-700">
              <span class="font-semibold">Ngày hết hạn:</span> 
              {{ formatDate(premiumStore.premiumExpiry) }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="premiumStore.loading" class="flex justify-center items-center py-8">
        <div class="spinner inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        <p class="text-gray-600">Đang tải thông tin...</p>
      </div>
      
      <!-- Error State -->
      <div v-if="premiumStore.error && !premiumStore.loading" class="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
        <p>{{ premiumStore.error }}</p>
      </div>
      
      <!-- Premium Packages -->
      <div v-if="!premiumStore.loading" class="grid md:grid-cols-2 gap-6">
        <div v-for="pkg in premiumStore.packages" :key="pkg.id" 
             class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 py-5 px-6">
            <h3 class="text-xl font-bold text-white">{{ pkg.name }}</h3>
            <p class="text-white text-opacity-90 mt-1 text-sm">{{ pkg.description }}</p>
          </div>
          
          <div class="p-5">
            <div class="flex items-baseline mb-4">
              <span class="text-2xl font-bold text-gray-900">{{ formatPrice(pkg.price) }}</span>
              <span class="text-gray-500 ml-1">VND</span>
            </div>
            
            <ul class="mb-5 space-y-3">
              <li v-for="(feature, index) in pkg.features" :key="index" class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i>
                <span class="text-sm">{{ feature }}</span>
              </li>
            </ul>
            
            <button 
              @click="handlePurchase(pkg.id)"
              :disabled="premiumStore.isPremium || isBuying"
              class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div v-if="!premiumStore.loading && premiumStore.packages.length === 0" class="text-center py-6">
        <i class="fas fa-box-open text-gray-300 text-3xl mb-2"></i>
        <p class="text-gray-600">Không tìm thấy thông tin gói Premium. Vui lòng thử lại sau.</p>
      </div>
      
      <!-- Premium History Table -->
      <div v-if="!premiumStore.loading && premiumStore.sortedPremiumHistory.length > 0" class="mt-8">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Lịch sử đăng ký Premium</h2>
        
        <div class="bg-white shadow-md rounded-md overflow-hidden border border-gray-200">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gói</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bắt đầu</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kết thúc</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="history in premiumStore.sortedPremiumHistory" :key="history.id" :class="{'bg-yellow-50': history.is_active}">
                  <td class="px-4 py-3 text-sm text-gray-900">{{ history.package_name }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ formatPrice(history.package_price) }} VNĐ</td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ history.start_date }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ history.end_date }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span v-if="history.is_active" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <i class="fas fa-circle text-green-400 mr-1 text-xs"></i>
                      Đang hoạt động
                    </span>
                    <span v-else-if="history.is_cancelled" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <i class="fas fa-circle text-red-400 mr-1 text-xs"></i>
                      Đã hủy
                    </span>
                    <span v-else class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <i class="fas fa-circle text-gray-400 mr-1 text-xs"></i>
                      Hết hạn
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
      
    <!-- Payment Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div class="text-center">
          <div class="flex items-center justify-center mb-4">
            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <i class="fas fa-check text-green-500 text-xl"></i>
            </div>
          </div>
          <h2 class="text-xl font-bold mb-3 text-gray-900">Thanh toán thành công!</h2>
          <p class="text-gray-600 mb-5">Tài khoản của bạn đã được nâng cấp lên Premium thành công.</p>
          <button @click="showSuccessModal = false" class="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">Đóng</button>
        </div>
      </div>
    </div>
    
    <!-- Payment Failed Modal -->
    <div v-if="showFailedModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div class="text-center">
          <div class="flex items-center justify-center mb-4">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <i class="fas fa-times text-red-500 text-xl"></i>
            </div>
          </div>
          <h2 class="text-xl font-bold mb-3 text-gray-900">Thanh toán thất bại!</h2>
          <p class="text-gray-600 mb-5">Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.</p>
          <button @click="showFailedModal = false" class="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">Đóng</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { usePremiumStore } from '../../stores/premium'
  import { useAuthStore } from '../../stores/auth'
  import { useRoute } from 'vue-router'
  
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
      console.log('Premium page - Premium đã hết hạn, đang hủy Premium...')
      await premiumStore.cancelPremium()
    }
  
    // Lấy danh sách gói Premium
    await premiumStore.fetchPremiumPackages()
    
    // Kiểm tra trạng thái thanh toán từ URL
    checkPaymentStatus()
  })
  
  onBeforeUnmount(() => {
    // Reset store khi rời khỏi trang
    // premiumStore.reset()
  })
  </script>
  
  <style scoped>
  .premium-container {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  </style>