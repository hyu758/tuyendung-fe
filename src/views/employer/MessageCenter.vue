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
            <div v-if="unreadCount > 0" class="mt-4 ml-11">
              <div class="inline-flex items-center bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                <font-awesome-icon icon="envelope" class="mr-2" />
                {{ unreadCount }} tin nhắn chưa đọc
              </div>
            </div>
          </div>
          
          <!-- Main chat container -->
          <div v-if="!isEmpty" class="h-[calc(100vh-220px)]">
            <chat-container />
          </div>
          
          <!-- Empty state (sẽ hiển thị khi không có cuộc trò chuyện nào) -->
          <div v-if="isEmpty" class="h-[calc(100vh-220px)] flex items-center justify-center">
            <div class="text-center max-w-md mx-auto p-8 bg-white/60 backdrop-blur-sm rounded-xl shadow-md">
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
import socketService from '../../services/socketService';

const chatStore = useChatStore();
const authStore = useAuthStore()
const unreadCount = computed(() => chatStore.unreadCount);
const isEmpty = ref(false);

// Xử lý tin nhắn socket
const handleSocketMessage = (data) => {
  console.log('Nhận được tin nhắn socket trong MessageCenter:', data);
  
  // Xử lý tin nhắn mới
  if (data.type === 'new_message' || (data.data && data.data.type === 'new_message')) {
    const messageData = data.data ? data.data : data;
    
    // Cập nhật danh sách tin nhắn
    if (messageData.message) {
      chatStore.addMessage(messageData.message);
    }
    
    // Cập nhật số lượng tin nhắn chưa đọc
    chatStore.fetchUnreadMessages();
  }
};

// Theo dõi thay đổi trong danh sách cuộc trò chuyện
watch(() => chatStore.conversations, (conversations) => {
  isEmpty.value = !conversations || conversations.length === 0;
}, { immediate: true });

onMounted(async () => {
  // Khởi tạo kết nối socket
  if (!socketService.connected) {
    socketService.init();
  }
  
  // Đăng ký lắng nghe tin nhắn socket
  socketService.onMessage(handleSocketMessage);
  
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
      // Hủy đăng ký sự kiện socket
      socketService.offMessage(handleSocketMessage);
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