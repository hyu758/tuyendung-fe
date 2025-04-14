<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-6 border-b">
          <h1 class="text-2xl font-bold text-gray-800">Tin nhắn của tôi</h1>
          <p class="text-gray-600 mt-1">
            Trò chuyện với nhà tuyển dụng của bạn
          </p>
        </div>
        
        <div class="h-[calc(100vh-200px)]">
          <chat-container />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, provide, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ChatContainer from '../chat/ChatContainer.vue';
import { useChatStore } from '../../stores/chat';

const chatStore = useChatStore();
const route = useRoute();
const router = useRouter();

// Cung cấp tham số lấy từ URL cho các component con
provide('chatUserId', route.query.user ? parseInt(route.query.user, 10) : null);

onMounted(() => {
  console.log('MessageCenter đã được mount');
  console.log('Tham số URL hiện tại:', route.query);
  
  // Reset store để tránh xung đột dữ liệu từ các màn hình khác
  chatStore.resetStore();
  
  // Tải số lượng tin nhắn chưa đọc ngay khi component mount
  chatStore.fetchUnreadMessages();
  
  // Thiết lập cập nhật định kỳ
  const intervalId = setInterval(async () => {
    await chatStore.fetchUnreadMessages();
  }, 30000); // Cập nhật mỗi 30 giây
  
  // Xóa interval khi component unmounted
  onUnmounted(() => {
    clearInterval(intervalId);
  });
  
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
</script> 