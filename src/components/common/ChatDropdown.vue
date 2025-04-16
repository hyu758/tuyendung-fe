<template>
  <div class="relative" ref="dropdown">
    <button 
      @click="toggleDropdown" 
      class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none"
    >
      <i class="fas fa-comment-dots text-xl"></i>
      <span 
        v-if="unreadCount > 0" 
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>
    
    <div 
      v-show="isOpen" 
      class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border overflow-hidden"
      style="max-height: 70vh;"
    >
      <div class="p-3 border-b flex justify-between items-center sticky top-0 bg-white z-10">
        <h3 class="font-medium text-gray-800 text-lg">Tin nhắn</h3>
        <div class="flex items-center space-x-2">
          <button 
            title="Tin nhắn mới" 
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            @click="openNewMessageModal"
          >
            <i class="fas fa-edit text-gray-500"></i>
          </button>
          <router-link 
            :to="{ name: userRole === 'employer' ? 'employer-messages' : 'candidate-messages' }" 
            class="text-blue-500 hover:text-blue-700 text-sm underline"
          >
            Xem tất cả
          </router-link>
        </div>
      </div>
      
      <div class="relative">
        <div class="px-3 py-2 border-b">
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Tìm kiếm cuộc trò chuyện..." 
              class="w-full pl-8 pr-4 py-2 rounded-full bg-gray-100 border-none text-sm focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>
        </div>
      </div>

      <div class="overflow-y-auto" style="max-height: calc(70vh - 110px);">
        <div v-if="loading" class="p-4 text-center">
          <i class="fas fa-circle-notch fa-spin text-blue-500"></i>
          <p class="text-sm text-gray-500 mt-2">Đang tải tin nhắn...</p>
        </div>
        
        <div v-else-if="filteredMessages.length === 0" class="p-4 text-center">
          <i class="fas fa-comment-slash text-gray-300 text-2xl"></i>
          <p class="text-sm text-gray-500 mt-2">Bạn chưa có tin nhắn nào</p>
        </div>
        
        <template v-else>
          <a 
            v-for="message in filteredMessages" 
            :key="message.id"
            href="#"
            @click.prevent="openChatPopup(message.senderId)"
            class="block border-b hover:bg-gray-50 transition-colors"
          >
            <div class="flex p-3">
              <div class="flex-shrink-0 mr-3 relative">
                <div v-if="message.avatar" class="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                  <img :src="message.avatar" alt="Avatar" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                  {{ getInitials(message.senderName || `U${message.senderId}`) }}
                </div>
                <div v-if="message.isOnline" class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div class="flex-1 min-w-0 flex flex-col justify-center">
                <div class="flex justify-between items-center">
                  <h4 class="text-sm font-medium text-gray-900 truncate">
                    {{ message.senderName || `Người dùng #${message.senderId}` }}
                  </h4>
                  <span class="text-xs text-gray-500 whitespace-nowrap ml-1">
                    {{ formatTime(message.created_at) }}
                  </span>
                </div>
                <div class="flex items-center">
                  <p 
                    class="text-sm text-gray-500 truncate flex-1" 
                    :class="{ 'font-semibold text-gray-800': !message.is_read }"
                  >
                    <template v-if="message.sender === currentUserId">Bạn: </template>
                    {{ message.content }}
                  </p>
                  <div v-if="!message.is_read" class="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                </div>
              </div>
            </div>
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, inject, watch } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useChatStore } from '../../stores/chat';

const dropdown = ref(null);
const isOpen = ref(false);
const loading = ref(false);
const recentMessages = ref([]);
const searchQuery = ref('');

const authStore = useAuthStore();
const chatStore = useChatStore();

// Inject chatManager nếu có
const chatManager = inject('chatManager', null);
const openChatFunction = inject('openChat', null);

// Debug: Log các tham số đã inject
console.log('ChatDropdown - chatManager đã inject:', !!chatManager);
console.log('ChatDropdown - openChat đã inject:', !!openChatFunction);

// Theo dõi thay đổi của chatManager
watch(() => chatManager, (newVal, oldVal) => {
  console.log('ChatDropdown - chatManager đã thay đổi:', newVal);
}, { deep: true });

const userRole = computed(() => authStore.userRole);
const unreadCount = computed(() => chatStore.unreadCount);
const currentUserId = computed(() => authStore.userInfo?.user_id);

// Lọc tin nhắn theo tìm kiếm
const filteredMessages = computed(() => {
  if (!searchQuery.value) return recentMessages.value;
  const query = searchQuery.value.toLowerCase();
  return recentMessages.value.filter(msg => 
    (msg.senderName && msg.senderName.toLowerCase().includes(query)) || 
    msg.content.toLowerCase().includes(query)
  );
});

// Toggle dropdown visibility
const toggleDropdown = async () => {
  isOpen.value = !isOpen.value;
  
  if (isOpen.value) {
    loading.value = true;
    try {
      // Tải tin nhắn chưa đọc và recent conversations
      await Promise.all([
        loadUnreadMessages(),
        loadRecentConversations()
      ]);
    } catch (error) {
      console.error('Lỗi khi tải tin nhắn:', error);
    } finally {
      loading.value = false;
    }
  }
};

// Tải tin nhắn chưa đọc
const loadUnreadMessages = async () => {
  try {
    const messages = await chatStore.fetchUnreadMessages();
    // Chỉ lấy tin nhắn chưa đọc để bổ sung vào danh sách
    const unreadMessages = messages.map(msg => {
      return {
        ...msg,
        senderId: msg.sender,
        senderName: '', // Sẽ được cập nhật sau
        isOnline: false,
        avatar: null
      };
    });
    
    // Thêm vào danh sách tin nhắn gần đây nếu chưa có
    unreadMessages.forEach(msg => {
      if (!recentMessages.value.find(m => m.id === msg.id)) {
        recentMessages.value.push(msg);
      }
    });
  } catch (error) {
    console.error('Lỗi khi tải tin nhắn chưa đọc:', error);
  }
};

// Tải các cuộc trò chuyện gần đây
const loadRecentConversations = async () => {
  try {
    // Tải danh sách cuộc trò chuyện
    await chatStore.fetchConversations();
    
    // Tải tin nhắn mới nhất cho tất cả các cuộc trò chuyện
    const latestMessages = await chatStore.fetchLatestMessages();
    
    // Xử lý các cuộc trò chuyện để hiển thị
    const conversations = [];
    const userIdsToFetch = [];
    
    // Tạo danh sách người dùng cần lấy thông tin
    for (const message of latestMessages || []) {
      const isUserSender = message.sender === currentUserId.value;
      const otherUserId = isUserSender ? message.recipient : message.sender;
      
      // Kiểm tra xem đã có thông tin user này trong cache chưa
      if (!chatStore.userInfoCache[otherUserId]) {
        userIdsToFetch.push(otherUserId);
      }
    }
    
    // Tải thông tin người dùng một lần duy nhất cho tất cả IDs
    if (userIdsToFetch.length > 0) {
      console.log(`Tải thông tin cho ${userIdsToFetch.length} người dùng`);
      await Promise.all(userIdsToFetch.map(id => chatStore.fetchUserInfo(id)));
    }
    
    // Xử lý tin nhắn mới nhất để hiển thị
    for (const message of latestMessages || []) {
      const isUserSender = message.sender === currentUserId.value;
      const otherUserId = isUserSender ? message.recipient : message.sender;
      
      // Lấy thông tin người dùng từ cache
      const userInfo = chatStore.userInfoCache[otherUserId];
      
      conversations.push({
        id: message.id,
        senderId: otherUserId,
        sender: message.sender,
        recipient: message.recipient,
        content: message.content,
        created_at: message.created_at,
        is_read: message.is_read,
        senderName: userInfo?.fullname || `Người dùng #${otherUserId}`,
        avatar: userInfo?.avatar || null,
        isOnline: false // Có thể cập nhật từ websocket sau
      });
    }
    
    // Sắp xếp theo thời gian gần nhất
    conversations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Cập nhật danh sách tin nhắn
    recentMessages.value = conversations;
    
  } catch (error) {
    console.error('Lỗi khi tải cuộc trò chuyện gần đây:', error);
  }
};

// Mở modal để soạn tin nhắn mới
const openNewMessageModal = () => {
  console.log('Mở modal soạn tin nhắn mới');
  // Phần này sẽ xử lý sau khi có component cho modal soạn tin nhắn mới
};

// Mở box chat nhỏ khi click vào tin nhắn
const openChatPopup = (userId) => {
  console.log('Mở box chat nhỏ với người dùng:', userId);
  
  // Đóng dropdown
  isOpen.value = false;
  
  console.log('openChatFunction chi tiết:', openChatFunction);
  
  // Thử sử dụng hàm openChat được inject
  if (openChatFunction) {
    console.log('Sử dụng hàm openChat đã inject');
    try {
      openChatFunction(userId);
      console.log('Đã gọi openChatFunction thành công');
    } catch (error) {
      console.error('Lỗi khi gọi openChatFunction:', error);
    }
    return;
  }
  
  // Nếu không có openChat, sử dụng chatManager
  if (chatManager && chatManager.value) {
    console.log('Sử dụng chatManager.value.openChat');
    try {
      chatManager.value.openChat(userId);
      console.log('Đã gọi chatManager.value.openChat thành công');
    } catch (error) {
      console.error('Lỗi khi gọi chatManager.value.openChat:', error);
    }
  } else if (chatManager) {
    console.log('Sử dụng chatManager.openChat');
    try {
      chatManager.openChat(userId);
      console.log('Đã gọi chatManager.openChat thành công');
    } catch (error) {
      console.error('Lỗi khi gọi chatManager.openChat:', error);
    }
  } else {
    console.warn('Không tìm thấy chatManager hoặc openChat, không thể mở box chat.');
    console.log('chatManager:', chatManager);
    console.log('openChatFunction:', openChatFunction);
    console.log('Thông tin người dùng:', userId);
  }
};

// Handle click outside to close dropdown
const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false;
  }
};

// Lấy chữ cái đầu của tên để hiển thị avatar
const getInitials = (name) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

// Format thời gian tin nhắn
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'Vừa xong';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút`;
  } else if (diffInMinutes < 24 * 60) {
    return `${Math.floor(diffInMinutes / 60)}h`;
  } else if (diffInMinutes < 7 * 24 * 60) {
    return `${Math.floor(diffInMinutes / (24 * 60))}d`;
  } else {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
  // Lấy số lượng tin nhắn chưa đọc khi component được mounted
  chatStore.fetchUnreadMessages();
  
  console.log('ChatDropdown mounted - chatManager:', chatManager);
  console.log('ChatDropdown mounted - openChat function:', openChatFunction);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 