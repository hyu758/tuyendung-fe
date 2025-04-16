<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 md:py-8">
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <div class="p-4 md:p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <h1 class="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
            <span class="inline-block mr-3 bg-blue-100 text-blue-600 p-2 rounded-full">
              <font-awesome-icon icon="comments" />
            </span>
            Tin nhắn của tôi
          </h1>
          <p class="text-gray-600 mt-1 pl-11">
            Trò chuyện với nhà tuyển dụng của bạn
          </p>
        </div>
        
        <div class="h-[calc(100vh-220px)] md:h-[calc(100vh-200px)] transition-all duration-300">
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

const chatStore = useChatStore();
const route = useRoute();
const router = useRouter();
const isLoading = ref(true);

// Cung cấp tham số lấy từ URL cho các component con
provide('chatUserId', route.query.user ? parseInt(route.query.user, 10) : null);

onMounted(() => {
  console.log('MessageCenter đã được mount');
  console.log('Tham số URL hiện tại:', route.query);
  
  // Reset store để tránh xung đột dữ liệu từ các màn hình khác
  chatStore.resetStore();
  
  // Tải số lượng tin nhắn chưa đọc ngay khi component mount
  chatStore.fetchUnreadMessages()
    .finally(() => {
      isLoading.value = false;
    });
  
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

<style scoped>
.container {
  max-width: 1200px;
}

@media (max-width: 640px) {
  .h-\[calc\(100vh-220px\)\] {
    height: calc(100vh - 180px);
  }
}
</style> 