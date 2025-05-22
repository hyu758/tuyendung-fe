<template>
  <footer class="bg-white py-8 border-t border-gray-200">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Thông tin công ty -->
        <div>
          <h3 class="text-xl font-bold text-blue-600 mb-4">JobHub</h3>
          <p class="text-gray-600 mb-4">Nền tảng kết nối ứng viên và nhà tuyển dụng hàng đầu tại Việt Nam</p>
          <div class="flex space-x-3">
            <a href="#" class="bg-gray-900 hover:bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center transition duration-300">
              <font-awesome-icon :icon="['fab', 'facebook']" class="text-white" />
            </a>
            <a href="#" class="bg-gray-900 hover:bg-blue-400 w-10 h-10 rounded-full flex items-center justify-center transition duration-300">
              <font-awesome-icon :icon="['fab', 'twitter']" class="text-white" />
            </a>
            <a href="#" class="bg-gray-900 hover:bg-purple-600 w-10 h-10 rounded-full flex items-center justify-center transition duration-300">
              <font-awesome-icon :icon="['fab', 'github']" class="text-white" />
            </a>
            <a href="#" class="bg-gray-900 hover:bg-blue-700 w-10 h-10 rounded-full flex items-center justify-center transition duration-300">
              <font-awesome-icon :icon="['fab', 'linkedin']" class="text-white" />
            </a>
          </div>
        </div>

        <!-- Liên kết -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-blue-500 pb-2 inline-block">
            <font-awesome-icon icon="arrow-right" class="text-blue-500 mr-1" />
            Liên kết
          </h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                <font-awesome-icon icon="arrow-right" class="text-xs mr-2 text-blue-500" />
                <span>Trang chủ</span>
              </router-link>
            </li>
            <li>
              <router-link to="/job-search" class="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                <font-awesome-icon icon="arrow-right" class="text-xs mr-2 text-blue-500" />
                <span>Tìm việc</span>
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                <font-awesome-icon icon="arrow-right" class="text-xs mr-2 text-blue-500" />
                <span>Giới thiệu</span>
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                <font-awesome-icon icon="arrow-right" class="text-xs mr-2 text-blue-500" />
                <span>Liên hệ</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Pháp lý -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-blue-500 pb-2 inline-block">
            <font-awesome-icon icon="arrow-right" class="text-blue-500 mr-1" />
            Điều khoản
          </h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/terms" class="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                <font-awesome-icon icon="arrow-right" class="text-xs mr-2 text-blue-500" />
                <span>Điều khoản sử dụng</span>
              </router-link>
            </li>
            <li>
              <router-link to="/privacy" class="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                <font-awesome-icon icon="arrow-right" class="text-xs mr-2 text-blue-500" />
                <span>Chính sách bảo mật</span>
              </router-link>
            </li>
            <li>
              <router-link to="/refund-policy" class="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                <font-awesome-icon icon="arrow-right" class="text-xs mr-2 text-blue-500" />
                <span>Chính sách hoàn tiền</span>
              </router-link>
            </li>
            <li>
              <router-link to="/faq" class="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                <font-awesome-icon icon="arrow-right" class="text-xs mr-2 text-blue-500" />
                <span>Câu hỏi thường gặp</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Liên hệ -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-blue-500 pb-2 inline-block">
            <font-awesome-icon icon="arrow-right" class="text-blue-500 mr-1" />
            Liên hệ
          </h3>
          <div class="space-y-3">
            <div class="flex items-center">
              <div class="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <font-awesome-icon icon="map-marker-alt" class="text-white" />
              </div>
              <p class="text-gray-600">Nghiêm Xuân Yên, Hoàng Mai, Hà Nội</p>
            </div>
            <div class="flex items-center">
              <div class="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <font-awesome-icon icon="envelope" class="text-white" />
              </div>
              <p class="text-gray-600">contact@jobhub.vn</p>
            </div>
            <div class="flex items-center">
              <div class="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <font-awesome-icon icon="phone" class="text-white" />
              </div>
              <p class="text-gray-600">0123 456 789</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Đăng ký nhận tin -->
      <div class="mt-10 border-t border-gray-200 pt-8">
        <div class="max-w-2xl mx-auto">
          <p class="text-gray-600 mb-4 text-center">Nhận thông báo về các cơ hội việc làm mới nhất và tin tức thị trường lao động</p>
          <form class="flex flex-col sm:flex-row gap-3">
            <input type="email" placeholder="Nhập email của bạn" class="px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow" />
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 transition duration-300 text-white px-6 py-2 rounded-md font-medium">
              Đăng ký
            </button>
          </form>
        </div>
      </div>

      <!-- Bản quyền -->
      <div class="mt-8 pt-4 border-t border-gray-200 text-center">
        <p class="text-gray-500 text-sm">
          &copy; {{ new Date().getFullYear() }} JobHub. Tất cả các quyền được bảo lưu.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Không cần logic JavaScript phức tạp cho Footer
</script>

<style scoped>
/* Animation cho hover effects */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style> 