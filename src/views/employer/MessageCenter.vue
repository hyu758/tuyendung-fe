<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Header -->
        <div class="p-6 border-b flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Trung tâm tin nhắn</h1>
            <p class="text-gray-600 mt-1">
              Quản lý và trả lời tin nhắn của ứng viên
            </p>
          </div>
          <div class="flex items-center">
            <div v-if="unreadCount > 0" class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <i class="fas fa-envelope mr-1"></i>
              {{ unreadCount }} tin nhắn chưa đọc
            </div>
          </div>
        </div>
        
        <!-- Main chat container -->
        <div class="h-[calc(100vh-200px)]">
          <chat-container />
        </div>
        
        <!-- Empty state (sẽ hiển thị khi không có cuộc trò chuyện nào) -->
        <div v-if="isEmpty" class="h-[calc(100vh-200px)] flex items-center justify-center">
          <div class="text-center max-w-md mx-auto p-8">
            <i class="fas fa-comments text-gray-300 text-6xl mb-4"></i>
            <h3 class="text-xl font-medium text-gray-700 mb-2">Hộp tin nhắn trống</h3>
            <p class="text-gray-500 mb-4">
              Bạn chưa có cuộc trò chuyện nào với ứng viên. Khi ứng viên liên hệ, tin nhắn sẽ xuất hiện ở đây.
            </p>
            <router-link to="/employer/posts" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <i class="fas fa-briefcase mr-2"></i>
              Quản lý tin tuyển dụng
            </router-link>
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

const chatStore = useChatStore();
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
</style> 