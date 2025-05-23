<template>
  <div class="fixed bottom-0 right-4 z-50 flex flex-row-reverse space-x-4 space-x-reverse">
    <ChatPopup 
      v-for="chat in activeChats" 
      :key="chat.userId" 
      :conversation="chat"
      :style="{ right: getPopupPosition(chat.index) + 'px' }"
      @close="closeChat(chat.userId)"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import ChatPopup from './ChatPopup.vue';
import { useChatStore } from '../../stores/chat';
import { useAuthStore } from '../../stores/auth';

const activeChats = ref([]);
const maxVisibleChats = 3; // Số lượng cửa sổ chat hiển thị tối đa cùng lúc

const chatStore = useChatStore();
const authStore = useAuthStore();



// Tính toán vị trí của popup dựa vào index
const getPopupPosition = (index) => {
  // Mỗi cửa sổ chat rộng 320px + 16px margin
  return index * 336;
};

// Thêm cửa sổ chat mới
const openChat = async (userId) => {
  
  // Kiểm tra nếu chat đã mở
  if (activeChats.value.find(chat => chat.userId === userId)) {
    // Đưa chat lên trước nếu đã mở
    const chatIndex = activeChats.value.findIndex(chat => chat.userId === userId);
    if (chatIndex !== -1) {
      const chat = activeChats.value.splice(chatIndex, 1)[0];
      activeChats.value.unshift(chat);
      
      // Cập nhật lại các index
      activeChats.value.forEach((chat, idx) => {
        chat.index = idx;
      });
    }
    return;
  }
  
  // Nếu số lượng chat đã đạt tối đa, đóng chat cũ nhất
  if (activeChats.value.length >= maxVisibleChats) {
    activeChats.value.pop();
  }
  
  // Lấy thông tin người dùng từ cache hoặc từ API
  let userInfo = chatStore.userInfoCache[userId];
  if (!userInfo) {
    userInfo = await chatStore.fetchUserInfo(userId);
  }
  
  activeChats.value.unshift({
    userId: userId,
    displayName: userInfo?.fullname || `Người dùng #${userId}`,
    avatar: userInfo?.avatar || null,
    isOnline: false,
    index: 0
  });
  
  
  // Cập nhật lại các index cho toàn bộ cửa sổ chat
  activeChats.value.forEach((chat, idx) => {
    chat.index = idx;
  });
};

// Đóng cửa sổ chat
const closeChat = (userId) => {
  
  // Tìm chat trong danh sách
  const chatIndex = activeChats.value.findIndex(chat => chat.userId === userId);
  if (chatIndex !== -1) {
    // Lấy thông tin chat trước khi xóa
    const chatToRemove = activeChats.value[chatIndex];
    
    // Xóa khỏi danh sách active chats
    activeChats.value.splice(chatIndex, 1);
    
    // Reset active conversation trong store nếu đang là conversation hiện tại
    if (chatStore.activeConversation === userId) {
      chatStore.resetActiveConversation();
    }
    
    // Cập nhật lại các index cho các chat còn lại
    activeChats.value.forEach((chat, idx) => {
      chat.index = idx;
    });
    
  } else {
    console.warn('Không tìm thấy chat với userId:', userId);
  }
};



// Export các phương thức để sử dụng từ bên ngoài
defineExpose({
  openChat,
  closeChat
});
</script> 