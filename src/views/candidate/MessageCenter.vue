<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4 md:py-8">
    <div class="container mx-auto">
      <!-- Luôn hiển thị giao diện trò chuyện -->
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
            <p class="text-gray-600 mb-6">Để có thể nhắn tin với nhà tuyển dụng, bạn cần nâng cấp tài khoản lên gói Premium.</p>
            <router-link to="/premium" class="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto w-max hover:shadow-lg transition duration-300">
              <i class="fas fa-crown"></i>
              Nâng cấp Premium ngay
            </router-link>
          </div>
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
        
        <div v-else class="h-[calc(100vh-220px)] md:h-[calc(100vh-200px)] transition-all duration-300 relative">
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
import { useAuthStore } from '../../stores/auth';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import socketService from '../../services/socketService';

const chatStore = useChatStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const isLoading = ref(true);

// Kiểm tra người dùng có phải Premium không
const checkPremiumStatus = () => {
  if (!authStore.isLoggedIn) {
    console.log('Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập');
    router.replace({ 
      name: 'Login',
      query: { redirect: route.fullPath }
    });
    return false;
  }
  
  if (!authStore.isCandidate) {
    console.log('Người dùng không phải ứng viên, chuyển hướng đến trang chủ');
    router.replace({ name: 'Home' });
    return false;
  }
  
  // Không chuyển hướng khi không phải premium, chỉ ghi log
  if (!authStore.userInfo?.is_premium) {
    console.log('Người dùng không phải Premium, nhưng vẫn hiển thị giao diện với thông báo nâng cấp');
  }
  
  return true;
};

// Cung cấp tham số lấy từ URL cho các component con
provide('chatUserId', route.query.user ? parseInt(route.query.user, 10) : null);
// Cung cấp thông tin premium cho các component con
provide('isPremiumUser', computed(() => authStore.userInfo?.is_premium || false));

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
  
  // Tải thông tin profile trước khi kiểm tra
  authStore.fetchUserProfile().then(() => {
    console.log('[DEBUG] Thông tin người dùng sau khi tải profile:', authStore.userInfo);
    console.log('[DEBUG] Trạng thái premium sau khi tải profile:', authStore.userInfo?.is_premium);
    
    // Kiểm tra trạng thái người dùng
    if (!checkPremiumStatus()) {
      return; // Không tiếp tục nếu không đăng nhập hoặc không phải ứng viên
    }
    
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