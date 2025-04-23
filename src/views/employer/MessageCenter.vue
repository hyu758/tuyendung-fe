<template>
  <div class="relative min-h-screen bg-white pb-8">
    <!-- Luôn hiển thị giao diện tin nhắn -->
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4 md:py-8">
      <div class="container mx-auto">
        <div class="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          <!-- Header -->
          <div class="p-5 md:p-6 border-b bg-gradient-to-r from-indigo-500 to-purple-600">
            <div>
              <h1 class="text-xl md:text-2xl font-bold text-white flex items-center">
                <span class="inline-block mr-3 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full">
                  <font-awesome-icon icon="comments" />
                </span>
                Trung tâm tin nhắn
              </h1>
              <p class="text-indigo-100 mt-1 pl-11">
                Quản lý và trả lời tin nhắn của ứng viên
              </p>
            </div>
            <div v-if="unreadCount > 0 && authStore.userInfo?.is_premium" class="mt-4 ml-11">
              <div class="inline-flex items-center bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                <font-awesome-icon icon="envelope" class="mr-2" />
                {{ unreadCount }} tin nhắn chưa đọc
              </div>
            </div>
            
            <!-- Thông báo cho người dùng không phải Premium -->
            <div v-if="!authStore.userInfo?.is_premium" class="mt-3 ml-11 flex items-center">
              <div class="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium inline-flex items-center">
                <i class="fas fa-crown text-yellow-600 mr-2"></i>
                Tính năng dành cho người dùng Premium
              </div>
            </div>
          </div>
          
          <!-- Nếu không phải Premium, hiển thị thông báo nâng cấp bao phủ phần nội dung -->
          <div v-if="!authStore.userInfo?.is_premium" class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10" style="top: 180px;">
            <div class="text-center px-4 py-6 max-w-md mx-auto">
              <div class="w-24 h-24 mb-4 flex items-center justify-center bg-yellow-50 rounded-full mx-auto">
                <i class="fas fa-crown text-yellow-500 text-4xl"></i>
              </div>
              <h2 class="text-xl font-bold text-gray-800 mb-2">Tính năng dành cho người dùng Premium</h2>
              <p class="text-gray-600 mb-6">Để có thể nhắn tin với ứng viên, bạn cần nâng cấp tài khoản lên gói Premium.</p>
              <router-link to="/pricing" class="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto w-max hover:shadow-lg transition duration-300">
                <i class="fas fa-crown"></i>
                Nâng cấp Premium ngay
              </router-link>
            </div>
          </div>
          
          <!-- Main chat container -->
          <div v-if="!isEmpty && authStore.userInfo?.is_premium" class="h-[calc(100vh-220px)]">
            <chat-container />
          </div>
          
          <!-- Empty state (sẽ hiển thị khi không có cuộc trò chuyện nào) -->
          <div v-if="(isEmpty && authStore.userInfo?.is_premium) || !authStore.userInfo?.is_premium" class="h-[calc(100vh-220px)] flex items-center justify-center">
            <div v-if="isEmpty && authStore.userInfo?.is_premium" class="text-center max-w-md mx-auto p-8 bg-white/60 backdrop-blur-sm rounded-xl shadow-md">
              <div class="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <font-awesome-icon icon="comments" class="text-indigo-500 text-3xl" />
              </div>
              <h3 class="text-xl font-medium text-gray-800 mb-3">Hộp tin nhắn trống</h3>
              <p class="text-gray-600 mb-6 leading-relaxed">
                Bạn chưa có cuộc trò chuyện nào với ứng viên. Khi ứng viên liên hệ, tin nhắn sẽ xuất hiện ở đây.
              </p>
              <router-link to="/employer/posts" class="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 duration-200">
                <font-awesome-icon icon="briefcase" class="mr-2" />
                Quản lý tin tuyển dụng
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import ChatContainer from '../chat/ChatContainer.vue';
import { useChatStore } from '../../stores/chat';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useAuthStore } from '@/stores/auth'

const chatStore = useChatStore();
const authStore = useAuthStore()
const unreadCount = computed(() => chatStore.unreadCount);
const isEmpty = ref(false);

// Theo dõi thay đổi trong danh sách cuộc trò chuyện
watch(() => chatStore.conversations, (conversations) => {
  isEmpty.value = !conversations || conversations.length === 0;
}, { immediate: true });

onMounted(async () => {
  // Reset store để tránh xung đột dữ liệu từ các màn hình khác
  chatStore.resetStore();
  
  // Tải dữ liệu ban đầu
  try {
    // Tải danh sách cuộc trò chuyện
    await chatStore.fetchConversations();
    // Cập nhật số lượng tin nhắn chưa đọc
    await chatStore.fetchUnreadMessages();
    
    // Kiểm tra nếu không có cuộc trò chuyện
    isEmpty.value = !chatStore.conversations || chatStore.conversations.length === 0;
    
    // Thiết lập kiểm tra cập nhật định kỳ
    const intervalId = setInterval(async () => {
      await chatStore.fetchUnreadMessages();
    }, 30000); // Cập nhật mỗi 30 giây
    
    // Xóa interval khi component unmounted
    onUnmounted(() => {
      clearInterval(intervalId);
    });
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu cho MessageCenter:', error);
  }
});
</script> 

<style scoped>
/* Định nghĩa các hiệu ứng transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Container styles */
.container {
  max-width: 1200px;
}

/* Thêm hiệu ứng phản hồi khi hover và focus */
.shadow-xl {
  transition: all 0.3s ease;
}

.shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}
</style> 