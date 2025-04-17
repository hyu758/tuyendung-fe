<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4 md:py-8">
    <div class="container mx-auto">
      <div class="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        <div class="p-5 md:p-6 border-b bg-gradient-to-r from-indigo-500 to-purple-600">
          <h1 class="text-xl md:text-2xl font-bold text-white flex items-center">
            <span class="inline-block mr-3 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full">
              <font-awesome-icon icon="comments" />
            </span>
            Tin nhắn của tôi
          </h1>
          <p class="text-indigo-100 mt-1 pl-11">
            Trò chuyện với nhà tuyển dụng của bạn
          </p>
        </div>
        
        <!-- Trạng thái loading -->
        <div v-if="isLoading" class="flex items-center justify-center h-[calc(100vh-220px)] md:h-[calc(100vh-200px)]">
          <div class="flex flex-col items-center space-y-4">
            <svg class="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-500">Đang tải tin nhắn...</span>
          </div>
        </div>
        
        <div v-else class="h-[calc(100vh-220px)] md:h-[calc(100vh-200px)] transition-all duration-300">
          <chat-container />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, provide, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ChatContainer from '../chat/ChatContainer.vue';
import { useChatStore } from '../../stores/chat';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import socketService from '../../services/socketService';

const chatStore = useChatStore();
const route = useRoute();
const router = useRouter();
const isLoading = ref(true);

// Cung cấp tham số lấy từ URL cho các component con
provide('chatUserId', route.query.user ? parseInt(route.query.user, 10) : null);

// Xử lý khi nhận được tin nhắn mới qua socket
const handleNewMessage = (data) => {
  console.log('MessageCenter nhận được tin nhắn mới qua socket:', data);
  
  // Tải lại số lượng tin nhắn chưa đọc
  chatStore.fetchUnreadMessages();
  
  // Nếu tin nhắn liên quan đến cuộc trò chuyện đang mở, tự động cập nhật
  const userId = route.query.user ? parseInt(route.query.user, 10) : null;
  if (userId) {
    const messageData = data.data?.type === 'new_message' ? data.data : data;
    const senderId = parseInt(messageData.sender_id, 10);
    const recipientId = parseInt(messageData.recipient_id, 10);
    
    if (senderId === userId || recipientId === userId) {
      console.log('Tin nhắn liên quan đến cuộc trò chuyện đang mở, cập nhật tin nhắn');
    }
  }
};

onMounted(() => {
  console.log('MessageCenter đã được mount');
  console.log('Tham số URL hiện tại:', route.query);
  
  // Reset store để tránh xung đột dữ liệu từ các màn hình khác
  chatStore.resetStore();
  
  // Tải số lượng tin nhắn chưa đọc ngay khi component mount
  chatStore.fetchUnreadMessages()
    .finally(() => {
      setTimeout(() => {
        isLoading.value = false;
      }, 500); // Thêm timeout nhỏ để có hiệu ứng loading
    });
  
  // Khởi tạo kết nối socket nếu chưa được kết nối
  if (!socketService.connected) {
    console.log('Khởi tạo kết nối socket trong MessageCenter');
    socketService.init();
  }
  
  // Đăng ký handler cho tin nhắn mới nhận được qua socket
  socketService.onMessage(handleNewMessage);
  
  // Log thông tin user_id từ URL nếu có
  if (route.query.user) {
    console.log('Đang truy cập trang tin nhắn với userId:', route.query.user);
    
    // Kiểm tra xem user_id có phải là số không
    const userId = parseInt(route.query.user, 10);
    if (isNaN(userId)) {
      console.error('user_id không hợp lệ:', route.query.user);
      // Quay về trang tin nhắn không có tham số
      router.replace({ name: 'candidate-messages' });
    }
  }
});

// Hủy kết nối và event handlers khi component unmounted
onUnmounted(() => {
  console.log('MessageCenter unmounted: Hủy đăng ký socket handlers');
  
  // Hủy đăng ký handler tin nhắn
  socketService.offMessage(handleNewMessage);
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}

@media (max-width: 640px) {
  .h-\[calc\(100vh-220px\)\] {
    height: calc(100vh - 180px);
  }
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