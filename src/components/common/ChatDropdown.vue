<template>
  <div class="relative" ref="dropdown">
    <button 
      @click="toggleDropdown" 
      class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none"
    >
      <i class="fas fa-comment-dots text-xl"></i>
      <span 
        v-if="unreadCount > 0" 
        class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>
    
    <div 
      v-show="isOpen" 
      class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border overflow-hidden"
    >
      <div class="p-3 border-b flex justify-between items-center">
        <h3 class="font-medium text-gray-800">Tin nhắn</h3>
        <router-link 
          :to="{ name: userRole === 'employer' ? 'employer-messages' : 'candidate-messages' }" 
          class="text-blue-500 hover:text-blue-700 text-sm"
        >
          Xem tất cả
        </router-link>
      </div>
      
      <div class="max-h-96 overflow-y-auto">
        <div v-if="loading" class="p-4 text-center">
          <i class="fas fa-circle-notch fa-spin text-blue-500"></i>
          <p class="text-sm text-gray-500 mt-2">Đang tải tin nhắn...</p>
        </div>
        
        <div v-else-if="recentMessages.length === 0" class="p-4 text-center">
          <i class="fas fa-comment-slash text-gray-300 text-2xl"></i>
          <p class="text-sm text-gray-500 mt-2">Bạn chưa có tin nhắn nào</p>
        </div>
        
        <template v-else>
          <router-link 
            v-for="message in recentMessages" 
            :key="message.id"
            :to="{ 
              name: userRole === 'employer' ? 'employer-messages' : 'candidate-messages',
              query: { user: message.senderId }
            }"
            @click="logClick(message.senderId)"
            class="block border-b hover:bg-gray-50 transition-colors"
          >
            <div class="flex p-3">
              <div class="flex-shrink-0 mr-3">
                <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <i class="fas fa-user text-gray-500"></i>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between">
                  <h4 class="text-sm font-medium text-gray-900 truncate">
                    {{ message.senderName || `Người dùng #${message.senderId}` }}
                  </h4>
                  <span class="text-xs text-gray-500">
                    {{ formatTime(message.created_at) }}
                  </span>
                </div>
                <p 
                  class="text-sm text-gray-500 truncate" 
                  :class="{ 'font-semibold': !message.is_read }"
                >
                  {{ message.content }}
                </p>
              </div>
            </div>
          </router-link>
        </template>
      </div>
      
      <router-link 
        :to="{ name: userRole === 'employer' ? 'employer-messages' : 'candidate-messages' }"
        class="block p-3 text-center text-blue-500 hover:bg-blue-50 border-t"
      >
        Xem tất cả tin nhắn
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useChatStore } from '../../stores/chat';

const dropdown = ref(null);
const isOpen = ref(false);
const loading = ref(false);
const recentMessages = ref([]);

const authStore = useAuthStore();
const chatStore = useChatStore();

const userRole = computed(() => authStore.userRole);
const unreadCount = computed(() => chatStore.unreadCount);

// Toggle dropdown visibility
const toggleDropdown = async () => {
  isOpen.value = !isOpen.value;
  
  if (isOpen.value) {
    loading.value = true;
    try {
      // Lấy tin nhắn chưa đọc
      const messages = await chatStore.fetchUnreadMessages();
      recentMessages.value = messages.slice(0, 5).map(msg => {
        const isCurrentUser = msg.sender === authStore.userInfo?.user_id;
        return {
          ...msg,
          senderId: isCurrentUser ? msg.recipient : msg.sender,
          senderName: '' // TODO: Lấy tên người gửi từ API nếu cần
        };
      });
      console.log('Danh sách tin nhắn gần đây:', recentMessages.value);
    } catch (error) {
      console.error('Lỗi khi lấy tin nhắn chưa đọc:', error);
    } finally {
      loading.value = false;
    }
  }
};

// Log khi click vào tin nhắn
const logClick = (senderId) => {
  console.log('Chuyển hướng đến trang chat với người dùng:', senderId);
  isOpen.value = false;
};

// Handle click outside to close dropdown
const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false;
  }
};

// Format thời gian tin nhắn
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  // Nếu là ngày hôm nay, chỉ hiển thị giờ và phút
  if (isToday) {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Ngày khác, hiển thị ngày tháng
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
  // Lấy số lượng tin nhắn chưa đọc khi component được mounted
  chatStore.fetchUnreadMessages();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script> 