<template>
  <!-- Mobile view -->
  <div class="h-full md:hidden">
    <!-- Mobile: Chỉ danh sách cuộc trò chuyện -->
    <div v-if="!showMobileChat" class="h-full flex flex-col bg-white">
      <div class="py-4 px-4 border-b border-gray-100 bg-white">
        <h2 class="text-xl font-semibold text-gray-800 mb-3">Tin nhắn</h2>
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            class="w-full border-gray-200 border rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50"
          />
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <i class="fas fa-search"></i>
          </div>
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <div v-if="chatStore.loading && !chatStore.activeConversation" class="p-6 text-center">
          <i class="fas fa-circle-notch fa-spin text-blue-500 text-2xl"></i>
          <p class="mt-3 text-gray-500">Đang tải danh sách...</p>
        </div>
        
        <div v-else-if="filteredConversations.length === 0" class="p-6 text-center">
          <i class="fas fa-comments text-gray-300 text-5xl"></i>
          <p class="mt-3 text-gray-500">Không có cuộc trò chuyện nào</p>
        </div>
        
        <template v-else>
          <div 
            v-for="conversation in filteredConversations"
            :key="conversation.id"
            class="flex items-center px-4 py-4 cursor-pointer transition-colors border-b border-gray-50 hover:bg-gray-50"
            :class="{ 
              'bg-blue-50 border-l-4 border-l-blue-500': chatStore.activeConversation === conversation.userId,
              'border-l-4 border-l-red-400 bg-red-25': conversation.unreadCount > 0
            }"
            @click="openMobileChat(conversation.userId)"
          >
            <div class="flex-shrink-0 mr-3 relative">
              <div v-if="conversation.avatar && isValidImageUrl(conversation.avatar)" class="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                <img :src="conversation.avatar" alt="Avatar" class="w-full h-full object-cover" @error="handleImageError" />
              </div>
              <div v-else class="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                {{ getInitials(getDisplayName(conversation)) }}
              </div>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center mb-1">
                <h3 
                  class="text-base font-medium truncate"
                  :class="[
                    conversation.unreadCount > 0 ? 'text-gray-900 font-semibold' : 'text-gray-700'
                  ]"
                >
                  {{ getDisplayName(conversation) }}
                </h3>
                <span 
                  class="text-sm"
                  :class="[
                    conversation.unreadCount > 0 ? 'text-red-600 font-medium' : 'text-gray-500'
                  ]"
                >
                  {{ formatTime(conversation.lastMessageTime) }}
                </span>
              </div>
              <p 
                class="text-sm truncate" 
                :class="{ 
                  'text-gray-900 font-medium': conversation.unreadCount > 0,
                  'text-gray-500': conversation.unreadCount === 0
                }"
              >
                {{ conversation.lastMessage || 'Chưa có tin nhắn' }}
              </p>
            </div>
            
            <div class="ml-2">
              <i class="fas fa-chevron-right text-gray-400"></i>
            </div>
          </div>
        </template>
      </div>
    </div>
    
    <!-- Mobile: Chat view fullscreen -->
    <div v-else class="h-full flex flex-col bg-white">
      <!-- Header với nút back -->
      <div class="py-3 px-4 border-b border-gray-100 flex items-center bg-white shadow-sm">
        <button @click="closeMobileChat" class="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors">
          <i class="fas fa-arrow-left text-gray-600"></i>
        </button>
        <div class="flex items-center flex-1">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden mr-3">
            <template v-if="activeConversation?.avatar && isValidImageUrl(activeConversation?.avatar)">
              <img :src="activeConversation.avatar" alt="Avatar" class="w-full h-full object-cover" @error="handleAvatarError" />
            </template>
            <template v-else>
              <div class="w-full h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {{ getActiveUserInitials() }}
              </div>
            </template>
          </div>
          <div>
            <h3 class="font-medium text-gray-800">{{ getActiveUserName() }}</h3>
            <p v-if="activeConversation?.isOnline" class="text-xs text-green-500">
              <i class="fas fa-circle mr-1 text-[8px]"></i> Đang hoạt động
            </p>
          </div>
        </div>
      </div>
      
      <!-- Messages container -->
      <div 
        class="flex-1 p-4 overflow-y-auto flex flex-col relative bg-gray-50" 
        ref="messagesContainer"
        @scroll="handleScroll"
      >
        <div v-if="loadingOlderMessages" class="py-2 text-center mb-2">
          <i class="fas fa-circle-notch fa-spin text-blue-500"></i>
          <p class="text-xs text-gray-500">Đang tải thêm tin nhắn cũ hơn...</p>
        </div>
        
        <div v-if="chatStore.loading && !chatStore.sortedMessages.length" class="my-auto text-center">
          <i class="fas fa-circle-notch fa-spin text-blue-500 text-xl"></i>
          <p class="mt-2 text-gray-500">Đang tải tin nhắn...</p>
        </div>
        
        <div v-else-if="!chatStore.sortedMessages.length" class="my-auto text-center py-12">
          <i class="fas fa-comment-dots text-gray-300 text-5xl mb-3"></i>
          <p class="mt-2 text-gray-500">Chưa có tin nhắn. Hãy gửi tin nhắn đầu tiên!</p>
        </div>
        
        <template v-else>
          <div class="flex flex-col space-y-3">
            <chat-message
              v-for="message in chatStore.sortedMessages"
              :key="message.id"
              :content="message.content"
              :is-current-user="message.sender === currentUserId"
              :is-read="message.is_read"
              :created-at="message.created_at"
            />
          </div>
        </template>
      </div>
      
      <!-- Chat input -->
      <chat-input 
        :loading="chatStore.loading" 
        @send-message="sendMessage" 
      />
    </div>
  </div>
  
  <!-- Desktop view -->
  <div class="h-full hidden md:flex bg-white shadow-md rounded-lg overflow-hidden">
    <!-- Sidebar với danh sách cuộc trò chuyện -->
    <div class="w-1/3 border-r border-gray-100 flex flex-col">
      <div class="py-3 px-4 border-b border-gray-100 bg-white">
        <h2 class="text-lg font-semibold text-gray-800">Tin nhắn</h2>
        <div class="relative mt-2">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            class="w-full border-gray-200 border rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50"
          />
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <i class="fas fa-search"></i>
          </div>
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <div v-if="chatStore.loading && !chatStore.activeConversation" class="p-4 text-center">
          <i class="fas fa-circle-notch fa-spin text-blue-500 text-xl"></i>
          <p class="mt-2 text-gray-500">Đang tải danh sách...</p>
        </div>
        
        <div v-else-if="filteredConversations.length === 0" class="p-4 text-center">
          <i class="fas fa-comments text-gray-300 text-4xl"></i>
          <p class="mt-2 text-gray-500">Không có cuộc trò chuyện nào</p>
        </div>
        
        <template v-else>
          <chat-conversation
            v-for="conversation in filteredConversations"
            :key="conversation.id"
            :display-name="getDisplayName(conversation)"
            :avatar="conversation.avatar"
            :last-message="conversation.lastMessage"
            :last-message-time="conversation.lastMessageTime"
            :unread-count="conversation.unreadCount"
            :is-online="conversation.isOnline"
            :is-active="chatStore.activeConversation === conversation.userId"
            :is-read="conversation.isRead"
            :userId="conversation.userId"
            @select="selectConversation(conversation.userId)"
          />
        </template>
      </div>
    </div>
    
    <!-- Phần hiển thị tin nhắn -->
    <div class="w-2/3 flex flex-col">
              <template v-if="chatStore.activeConversation">
        <!-- Header cuộc trò chuyện -->
        <div class="py-3 px-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center overflow-hidden mr-3">
              <template v-if="activeConversation?.avatar && isValidImageUrl(activeConversation?.avatar)">
                <img :src="activeConversation.avatar" alt="Avatar" class="w-full h-full object-cover" @error="handleAvatarError" />
              </template>
              <template v-else>
                <div class="w-full h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-md flex items-center justify-center text-white font-bold">
                  {{ getActiveUserInitials() }}
                </div>
              </template>
            </div>
            <div>
              <h3 class="font-medium text-gray-800">{{ getActiveUserName() }}</h3>
              <p v-if="activeConversation?.isOnline" class="text-xs text-green-500">
                <i class="fas fa-circle mr-1 text-[8px]"></i> Đang hoạt động
              </p>
            </div>
          </div>
        </div>
        
        <!-- Khu vực tin nhắn -->
        <div 
          class="flex-1 p-4 overflow-y-auto flex flex-col relative bg-gray-50" 
          ref="messagesContainer"
          @scroll="handleScroll"
        >
          <!-- Nút cuộn xuống -->
          <button 
            v-if="!isAtBottom && chatStore.sortedMessages.length > 5"
            @click="scrollToBottom" 
            class="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-md z-10 transition-colors"
            title="Cuộn xuống tin nhắn mới nhất"
          >
            <i class="fas fa-arrow-down"></i>
          </button>
          
          <div v-if="loadingOlderMessages" class="py-2 text-center mb-2">
            <i class="fas fa-circle-notch fa-spin text-blue-500"></i>
            <p class="text-xs text-gray-500">Đang tải thêm tin nhắn cũ hơn...</p>
          </div>
          
          <div v-if="chatStore.loading && !chatStore.sortedMessages.length" class="my-auto text-center">
            <i class="fas fa-circle-notch fa-spin text-blue-500 text-xl"></i>
            <p class="mt-2 text-gray-500">Đang tải tin nhắn...</p>
            <p class="text-xs text-gray-400 mt-1">Đang tải nhiều trang để hiển thị đầy đủ cuộc trò chuyện</p>
          </div>
          
          <div v-else-if="!chatStore.sortedMessages.length" class="my-auto text-center py-12">
            <i class="fas fa-comment-dots text-gray-300 text-5xl mb-3"></i>
            <p class="mt-2 text-gray-500">Chưa có tin nhắn. Hãy gửi tin nhắn đầu tiên!</p>
          </div>
          
          <template v-else>
            <div class="flex flex-col space-y-2">
              <chat-message
                v-for="message in chatStore.sortedMessages"
                :key="message.id"
                :content="message.content"
                :is-current-user="message.sender === currentUserId"
                :is-read="message.is_read"
                :created-at="message.created_at"
              />
            </div>
            
            <div v-if="chatStore.loading && chatStore.sortedMessages.length" class="py-2 text-center">
              <i class="fas fa-circle-notch fa-spin text-blue-500"></i>
              <p class="text-xs text-gray-500">Đang tải tin nhắn...</p>
            </div>
          </template>
        </div>
        
        <!-- Khu vực nhập tin nhắn -->
        <chat-input 
          :loading="chatStore.loading" 
          @send-message="sendMessage" 
        />
      </template>
      
      <div v-else class="flex-1 flex items-center justify-center flex-col p-4">
        <i class="fas fa-comments text-gray-300 text-6xl mb-4"></i>
        <h3 class="text-xl font-medium text-gray-700 mb-2">Trò chuyện của bạn</h3>
        <p class="text-gray-500 text-center max-w-md">
          Chọn một cuộc trò chuyện từ danh sách bên trái hoặc bắt đầu một cuộc trò chuyện mới.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, inject, onUnmounted } from 'vue';
import { useChatStore } from '../../stores/chat';
import { useAuthStore } from '../../stores/auth';
import { useNotificationStore } from '../../stores/notification';
import { useRoute } from 'vue-router';
import ChatMessage from '../../components/common/ChatMessage.vue';
import ChatConversation from '../../components/common/ChatConversation.vue';
import ChatInput from '../../components/common/ChatInput.vue';
import socketService from '../../services/socketService';

const chatStore = useChatStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const route = useRoute();
const searchQuery = ref('');
const activeConversationId = ref(null);
const messagesContainer = ref(null);
const loadingOlderMessages = ref(false);
const isAtBottom = ref(true);
const showMobileChat = ref(false);

// Inject userId từ component cha nếu có
const injectedUserId = inject('chatUserId', null);

// ID của người dùng hiện tại
const currentUserId = computed(() => authStore.userInfo?.user_id);

// Theo dõi thay đổi của tham số user trong URL
watch(() => route.query.user, (newUserId) => {
  if (newUserId) {
    const userId = parseInt(newUserId, 10);
    if (!isNaN(userId)) {
      // Trên mobile, tự động mở chat view
      if (window.innerWidth < 768) {
        openMobileChat(userId);
      } else {
      selectConversation(userId);
      }
    }
  }
}, { immediate: false });

// Watch mobile chat state để handle browser back button
watch(() => showMobileChat.value, (isOpen) => {
  if (typeof window !== 'undefined') {
    if (isOpen) {
      // Prevent browser back when in mobile chat
      history.pushState({ mobileChat: true }, '', window.location.href);
      
      // Tự động cuộn xuống khi vào mobile chat
      nextTick(() => {
        setTimeout(() => {
          scrollToBottom();
        }, 150);
      });
    }
  }
});

// Handle browser back button on mobile
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', (event) => {
    if (window.innerWidth < 768 && showMobileChat.value) {
      event.preventDefault();
      closeMobileChat();
    }
  });
}

// Danh sách cuộc trò chuyện đã được xử lý
const processedConversations = computed(() => {
  if (!chatStore.conversations.length) return [];
  const userMap = new Map();
  chatStore.conversations.forEach(conv => {
    const isUserSender = conv.sender === currentUserId.value;
    const otherUserId = isUserSender ? conv.recipient : conv.sender;
    const otherUserIdNum = typeof otherUserId === 'string' ? parseInt(otherUserId, 10) : otherUserId;
    const userInfo = chatStore.userInfoCache[otherUserIdNum];
    
    // Tìm tin nhắn cuối cùng của cuộc trò chuyện này
    let lastMessage = chatStore.lastMessages[otherUserIdNum];
    let unreadCount = 0;
    let isLastMessageRead = true;
    
    if (lastMessage) {
      const sender = typeof lastMessage.sender === 'string' ? parseInt(lastMessage.sender, 10) : lastMessage.sender;
      const recipient = typeof lastMessage.recipient === 'string' ? parseInt(lastMessage.recipient, 10) : lastMessage.recipient;
      const belongsToConversation = 
        (sender === currentUserId.value && recipient === otherUserIdNum) ||
        (sender === otherUserIdNum && recipient === currentUserId.value);
      
      if (!belongsToConversation) {
        lastMessage = null;
      } else {
        // Kiểm tra tin nhắn cuối có đọc chưa
        isLastMessageRead = lastMessage.is_read;
        
        // CHỈ tính tin nhắn chưa đọc nếu:
        // 1. Tin nhắn chưa được đọc (is_read = false)
        // 2. Người nhận là user hiện tại (recipient = currentUserId)  
        // 3. Người gửi KHÔNG phải user hiện tại (sender ≠ currentUserId)
        if (!lastMessage.is_read && 
            lastMessage.recipient === currentUserId.value && 
            lastMessage.sender !== currentUserId.value) {
          unreadCount = 1;
        }
      }
    }
    
    // Lấy tên hiển thị từ nhiều nguồn
    let displayName = '';
    if (userInfo && userInfo.fullname) {
      displayName = userInfo.fullname;
    } else if (lastMessage && lastMessage.recipient_fullname && otherUserIdNum !== currentUserId.value) {
      displayName = lastMessage.recipient_fullname;
    } else if (lastMessage && lastMessage.sender_fullname) {
      displayName = lastMessage.sender_fullname;
    } else {
      displayName = `Người dùng #${otherUserIdNum}`;
    }
    
    if (!userMap.has(otherUserIdNum)) {
      userMap.set(otherUserIdNum, {
        userId: otherUserIdNum,
        displayName: displayName,
        avatar: userInfo?.avatar || null,
        isOnline: false,
        lastMessage: lastMessage?.content || '', 
        lastMessageTime: lastMessage?.created_at || '',
        unreadCount: unreadCount, // Chỉ tính tin nhắn từ người khác chưa đọc
        isRead: isLastMessageRead // Trạng thái đã đọc của tin nhắn cuối
      });
    }
  });
  const conversations = Array.from(userMap.values());
  return conversations.sort((a, b) => {
    if (!a.lastMessageTime) return 1;
    if (!b.lastMessageTime) return -1;
    return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
  });
});

// Lọc cuộc trò chuyện theo từ khóa tìm kiếm
const filteredConversations = computed(() => {
  if (!searchQuery.value) return processedConversations.value;
  
  const query = searchQuery.value.toLowerCase();
  return processedConversations.value.filter(conv => 
    conv.displayName.toLowerCase().includes(query)
  );
});

// Lấy thông tin cuộc trò chuyện đang được chọn
const activeConversation = computed(() => {
  if (!chatStore.activeConversation) return null;
  
  return processedConversations.value.find(
    conv => conv.userId === chatStore.activeConversation
  );
});

// Lấy tên hiển thị của người dùng
const getDisplayName = (conversation) => {
  
  // Kiểm tra cache một lần nữa để đảm bảo có tên mới nhất
  const userId = conversation.userId;
  const userInfo = chatStore.userInfoCache[userId];
  
  if (userInfo && userInfo.fullname) {
    // Cập nhật avatar nếu có
    if (userInfo.avatar && conversation.avatar === null) {
      conversation.avatar = userInfo.avatar;
    }
    return userInfo.fullname;
  }
  
  return conversation.displayName || `Người dùng #${conversation.userId}`;
};

// Chọn một cuộc trò chuyện
const selectConversation = async (userId) => {
  console.log(`🚀 [selectConversation] Selecting conversation with user ${userId}`);
  chatStore.activeConversation = userId;
  activeConversationId.value = userId;
  
  // BỎ LOGIC KIỂM TRA KHÔNG HỢP LÝ - luôn fetch tin nhắn khi chọn cuộc trò chuyện
  // if (chatStore.activeConversation === userId && chatStore.sortedMessages.length > 0) {
  //   return;
  // }
  
  // Reset trạng thái phân trang
  chatStore.page = 1;
  chatStore.hasMoreMessages = true;
  
  try {
    // Luôn refresh để load đầy đủ cuộc trò chuyện
    console.log(`📥 [selectConversation] Fetching messages for user ${userId}...`);
    const messages = await chatStore.fetchMessages(userId, true);
    console.log(`✅ [selectConversation] Loaded ${messages?.length || 0} messages`);
    
    if (!messages || messages.length < 20) {
      chatStore.hasMoreMessages = false;
    } else {
      chatStore.hasMoreMessages = true;
    }
    
    await markMessagesAsRead();
    await nextTick();
    
    // Cuộn xuống với delay khác nhau cho mobile và desktop
    if (showMobileChat.value) {
      // Mobile - delay lâu hơn
  setTimeout(() => {
        console.log(`📱 [selectConversation Mobile] Scrolling to bottom...`);
        scrollToBottom();
      }, 200);
      
      setTimeout(() => {
        console.log(`📱 [selectConversation Mobile] Final scroll...`);
        scrollToBottom();
      }, 500);
    } else {
      // Desktop
      setTimeout(() => {
        console.log(`💻 [selectConversation Desktop] Scrolling to bottom...`);
    scrollToBottom();
  }, 100);
    }
  } catch (error) {
    console.error('❌ [selectConversation] Lỗi khi tải tin nhắn:', error);
  } finally {
    chatStore.loading = false;
  }
};

// Đánh dấu tin nhắn đã đọc
const markMessagesAsRead = async () => {
  // Lọc các tin nhắn chưa đọc từ người khác
  const unreadMessages = chatStore.sortedMessages.filter(
    msg => !msg.is_read && msg.sender !== currentUserId.value
  );
  
  if (unreadMessages.length > 0) {
    
    // Đánh dấu từng tin nhắn là đã đọc
    for (const message of unreadMessages) {
      try {
        await chatStore.markMessageAsRead(message.id);
      } catch (error) {
        console.error(`Lỗi khi đánh dấu tin nhắn ${message.id} là đã đọc:`, error);
      }
    }
  }
};

// Gửi tin nhắn mới
const sendMessage = async (content) => {
  if (!chatStore.activeConversation) return;
  
  try {
    // Gửi tin nhắn và lấy kết quả trả về
    const newMessage = await chatStore.sendMessage(chatStore.activeConversation, content);

    // Cập nhật tin nhắn cuối cùng cho cuộc trò chuyện hiện tại
    const currentConversation = processedConversations.value.find(
      conv => conv.userId === chatStore.activeConversation
    );
    
    if (currentConversation) {
      currentConversation.lastMessage = content;
      currentConversation.lastMessageTime = new Date().toISOString();
    }
    
    // Cuộn xuống để hiển thị tin nhắn mới
    await nextTick();
    scrollToBottom();
    
    // Tải tin nhắn mới nhất sau khi gửi tin nhắn để cập nhật danh sách (không blocking)
    setTimeout(async () => {
      try {
        await chatStore.fetchLatestMessages();
      } catch (error) {
        console.error('Lỗi khi tải tin nhắn mới nhất sau khi gửi:', error);
      }
    }, 500);
    
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn:', error);
  }
};

// Cuộn xuống tin nhắn cuối cùng
const scrollToBottom = () => {
  if (messagesContainer.value) {
    console.log('🔄 [scrollToBottom] Bắt đầu cuộn xuống...');
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    
    // Thử cuộn xuống lần nữa sau một khoảng thời gian ngắn
    setTimeout(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        console.log(`📍 [scrollToBottom] Đã cuộn xuống - scrollTop: ${messagesContainer.value.scrollTop}, scrollHeight: ${messagesContainer.value.scrollHeight}`);
      }
    }, 100);
    
    // Thêm một lần cuộn nữa cho mobile để đảm bảo
    if (showMobileChat.value) {
      setTimeout(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
          console.log(`📱 [scrollToBottom Mobile] Final scroll - scrollTop: ${messagesContainer.value.scrollTop}`);
        }
      }, 300);
    }
  } else {
    console.warn('⚠️ [scrollToBottom] messagesContainer.value is null');
  }
};

// Xử lý sự kiện cuộn để tải thêm tin nhắn cũ
const handleScroll = async () => {
  if (!messagesContainer.value || !chatStore.activeConversation) return;
  
  const { scrollTop, clientHeight, scrollHeight } = messagesContainer.value;
  
  // Kiểm tra xem người dùng có đang ở cuối không
  isAtBottom.value = scrollHeight - scrollTop - clientHeight < 100;
  
  // Khi người dùng cuộn lên gần đầu (20px từ đỉnh), tải thêm tin nhắn cũ hơn
  if (scrollTop <= 20 && !loadingOlderMessages.value && chatStore.hasMoreMessages) {
    
    // Lưu lại vị trí cuộn và chiều cao trước khi tải
    const previousScrollHeight = scrollHeight;
    
    // Đánh dấu đang tải tin nhắn cũ
    loadingOlderMessages.value = true;
    
    try {
      // Chỉ tải 1 trang khi cuộn lên vì đã tải nhiều trang lúc đầu
      await chatStore.fetchMessages(chatStore.activeConversation);
      
      // Đợi DOM cập nhật
      await nextTick();
      
      // Điều chỉnh vị trí cuộn để giữ nguyên vị trí người dùng đang xem
      if (messagesContainer.value) {
        const newScrollHeight = messagesContainer.value.scrollHeight;
        const heightDifference = newScrollHeight - previousScrollHeight;
        
        // Cộng thêm 20px để tránh kích hoạt ngay lập tức sự kiện tải thêm
        const newScrollTop = heightDifference + 20;
        
        // Điều chỉnh cuộn để giữ vị trí người dùng đang xem
        messagesContainer.value.scrollTop = newScrollTop;
      }
    } catch (error) {
      console.error('Lỗi khi tải thêm tin nhắn cũ hơn:', error);
    } finally {
      // Đợi một chút trước khi bỏ trạng thái loading để tránh tải liên tục
      setTimeout(() => {
        loadingOlderMessages.value = false;
      }, 500);
    }
  }
};

// Hàm kiểm tra tin nhắn có phải mới không (trong vòng 10 giây)
const isRecentMessage = (message) => {
  if (!message || !message.created_at) return false;
  
  const messageTime = new Date(message.created_at);
  const now = new Date();
  const timeDiff = now - messageTime;
  
  // Tin nhắn được coi là "mới" nếu được tạo trong vòng 10 giây
  return timeDiff < 10000;
};

// Theo dõi nội dung tin nhắn để phát hiện thay đổi
watch(() => JSON.stringify(chatStore.sortedMessages), () => {
  console.log(`📝 [Messages Watcher] Messages changed, length: ${chatStore.sortedMessages.length}`);
  
  // Đánh dấu tin nhắn mới là đã đọc
  markMessagesAsRead();
  
  // CHỈ cuộn xuống khi không đang tải tin nhắn cũ
  if (messagesContainer.value && !loadingOlderMessages.value) {
    const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
    // Tăng khoảng cách từ cuối lên 300px để dễ dàng cuộn xuống
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 300;
    
    // Kiểm tra tin nhắn cuối có phải mới không
    const latestMessage = chatStore.sortedMessages[chatStore.sortedMessages.length - 1];
    const isFromCurrentUser = latestMessage && latestMessage.sender === currentUserId.value;
    const isRecentMsg = latestMessage && isRecentMessage(latestMessage);
    
    console.log(`📊 [Messages Watcher] isNearBottom: ${isNearBottom}, isFromCurrentUser: ${isFromCurrentUser}, isRecent: ${isRecentMsg}, isMobile: ${showMobileChat.value}`);
    
    // Chỉ cuộn xuống khi:
    // 1. Người dùng đang gần cuối VÀ tin nhắn cuối là tin nhắn mới (recent)
    // 2. HOẶC tin nhắn mới là từ người dùng hiện tại  
    // 3. HOẶC đang ở mobile (cuộn xuống luôn để UX tốt hơn)
    if ((isNearBottom && isRecentMsg) || isFromCurrentUser || showMobileChat.value) {
      console.log(`✅ [Messages Watcher] Scrolling to bottom...`);
      scrollToBottom();
      nextTick(() => {
        scrollToBottom();
      });
    }
  }
});

// Cập nhật watcher cho tin nhắn - đảm bảo theo dõi tin nhắn cuối cùng
watch(() => chatStore.sortedMessages.length, (newLength, oldLength) => {
  // CHỈ xử lý khi có tin nhắn mới được thêm vào VÀ không đang tải tin nhắn cũ
  if (newLength > oldLength && !loadingOlderMessages.value) {
    
    // Nếu có tin nhắn mới và người dùng đang ở gần cuối hoặc tin nhắn là từ người dùng hiện tại, cuộn xuống
    const latestMessage = chatStore.sortedMessages[chatStore.sortedMessages.length - 1];
    if (latestMessage && messagesContainer.value) {
      // Đảm bảo thông tin người dùng được cập nhật khi có tin nhắn mới
      if (latestMessage.sender !== currentUserId.value) {
        // Nếu tin nhắn từ người khác
        const userInfo = chatStore.userInfoCache[latestMessage.sender];
        if (userInfo && userInfo.avatar && !chatStore.activeConversation?.avatar) {
          // Cập nhật avatar nếu chưa có
          if (chatStore.activeConversation) {
            chatStore.activeConversation.avatar = userInfo.avatar;
          }
        }
      }
      
      const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 300;
      const isFromCurrentUser = latestMessage.sender === currentUserId.value;
      const isRecentMsg = isRecentMessage(latestMessage);
      
      // Chỉ cuộn xuống nếu:
      // 1. Tin nhắn từ user hiện tại
      // 2. HOẶC (user đang gần cuối VÀ tin nhắn là tin nhắn mới)
      if (isFromCurrentUser || (isNearBottom && isRecentMsg)) {
        scrollToBottom();
      }
    }
  }
});

// Theo dõi activeConversation
watch(() => chatStore.activeConversation, (newConversation, oldConversation) => {
  if (newConversation !== oldConversation) {
    
    // Cuộn xuống khi chuyển sang cuộc trò chuyện mới
    nextTick(() => {
      scrollToBottom();
      
      // Đặc biệt cho mobile - cuộn lại sau một chút để đảm bảo
      if (showMobileChat.value) {
        setTimeout(() => {
          scrollToBottom();
        }, 200);
      }
    });
  }
});

// Thêm theo dõi thay đổi tin nhắn để cập nhật danh sách cuộc trò chuyện
watch(() => chatStore.sortedMessages, (newMessages, oldMessages) => {
  
  // Kiểm tra nếu có tin nhắn mới được thêm vào
  if (newMessages.length > oldMessages.length) {
    const latestMessage = newMessages[newMessages.length - 1];
    
    // Kiểm tra nếu tin nhắn mới thuộc cuộc trò chuyện đang mở
    if (chatStore.activeConversation === latestMessage.sender) {
        
        // Đánh dấu tin nhắn đã đọc nếu người dùng hiện tại là người nhận
        if (latestMessage.recipient === currentUserId.value && !latestMessage.is_read) {
          chatStore.markMessageAsRead(latestMessage.id);
      }
    }
  }
}, { deep: true });

// Thêm vào ngay trước onMounted
// Xử lý cập nhật tin nhắn thông qua socket
const handleSocketMessage = (data) => {
  // Logic xử lý tin nhắn đã được chuyển vào socketService
  // Chỉ cần cuộn xuống nếu tin nhắn thuộc cuộc trò chuyện đang mở
  if (data && (data.type === 'new_message' || (data.data && data.data.type === 'new_message'))) {
    // Lấy dữ liệu tin nhắn đúng cách
    const messageData = data.data?.type === 'new_message' ? data.data : data;
    const currentUserId = authStore.userInfo?.user_id;
    
    if (currentUserId) {
      // Tạo đối tượng tin nhắn từ dữ liệu nhận được
      const newMessage = {
        sender: parseInt(messageData.sender_id, 10),
        recipient: parseInt(messageData.recipient_id, 10)
      };
      
      // Xác định ID của người đối thoại
      const otherPartyId = currentUserId === newMessage.sender 
                         ? newMessage.recipient 
                         : newMessage.sender;
      
      // Nếu tin nhắn thuộc cuộc trò chuyện đang mở, cuộn xuống
      if (chatStore.activeConversation === otherPartyId) {
      nextTick(() => {
        scrollToBottom();
      });
    }
    }
  }
};

const handleAvatarError = (e) => {
  console.warn('Lỗi khi tải avatar trong header:', e);
  // Xóa thuộc tính src để tránh tiếp tục gây lỗi
  e.target.src = '';
  
  // Lấy tên và chữ cái đầu của người dùng
  const name = getActiveUserName();
  const initials = getActiveUserInitials();
  
  // Tìm phần tử cha gần nhất
  const parent = e.target.closest('.overflow-hidden');
  if (parent) {
    // Tạo div hiển thị initials
    const initialsDiv = document.createElement('div');
    initialsDiv.className = 'w-full h-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white font-bold';
    initialsDiv.textContent = initials;
    
    // Thêm vào parent
    parent.appendChild(initialsDiv);
    
    // Ẩn thẻ img
    e.target.style.display = 'none';

  }
  
  // Đánh dấu avatar không hợp lệ
  if (activeConversation.value) {
    activeConversation.value.avatar = null;
  }
};

const handleImageError = (e) => {
  e.target.style.display = 'none';
};

const isValidImageUrl = (url) => {
  if (!url) return false;
  
  try {
    if (url.startsWith('src/assets/') || url.startsWith('/src/assets/')) {
      return false;
    }
    
    new URL(url);
    
    if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i) || 
        url.includes('cloudinary.com') || 
        url.includes('res.cloudinary.com')) {
      return true;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

// Lấy tên người dùng đang chat
const getActiveUserName = () => {
  if (!chatStore.activeConversation) return 'Chọn một cuộc trò chuyện';
  
  const userId = chatStore.activeConversation;
  // Tìm trong cache người dùng
  const userInfo = chatStore.userInfoCache[userId];
  if (userInfo && userInfo.fullname) {
    return userInfo.fullname;
  }
  
  // Tìm trong danh sách cuộc trò chuyện đã xử lý
  const conversation = processedConversations.value.find(conv => conv.userId === userId);
  if (conversation && conversation.displayName) {
    return conversation.displayName;
  }
  
  return `Người dùng #${userId}`;
};

// Lấy các chữ cái đầu của tên người dùng để hiển thị khi không có avatar
const getActiveUserInitials = () => {
  const name = getActiveUserName();
  if (!name || name.startsWith('Người dùng #')) return '?';
  
  // Chỉ lấy chữ cái đầu tiên của tên
  return name.trim().charAt(0).toUpperCase();
};

// Mobile chat functions
const openMobileChat = async (userId) => {
  console.log(`📱 [openMobileChat] Opening mobile chat for user ${userId}`);
  showMobileChat.value = true;
  
  await selectConversation(userId);
  
  // Đảm bảo cuộn xuống cuối cho mobile chat với nhiều lần thử
  await nextTick();
  
  setTimeout(() => {
    console.log(`📱 [openMobileChat] First scroll attempt...`);
    scrollToBottom();
  }, 100);
  
  setTimeout(() => {
    console.log(`📱 [openMobileChat] Second scroll attempt...`);
    scrollToBottom();
  }, 300);
  
  setTimeout(() => {
    console.log(`📱 [openMobileChat] Final scroll attempt...`);
    scrollToBottom();
  }, 600);
};

const closeMobileChat = () => {
  showMobileChat.value = false;
  chatStore.resetActiveConversation();
};

// Utility functions
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  
  const date = new Date(timeStr);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) {
    return 'Vừa xong';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút`;
  } else if (diffInHours < 24 && date.getDate() === now.getDate()) {
    // Nếu là trong ngày hiện tại, hiển thị giờ
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } else if (diffInDays < 7) {
    // Nếu trong vòng 7 ngày, hiển thị thứ
    const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const dayOfWeek = weekdays[date.getDay()];
    return dayOfWeek;
  } else if (date.getFullYear() === now.getFullYear()) {
    // Nếu cùng năm, hiển thị ngày/tháng
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  } else {
    // Nếu khác năm, hiển thị ngày/tháng/năm
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(2);
    return `${day}/${month}/${year}`;
  }
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.trim().charAt(0).toUpperCase();
};

onMounted(async () => {
  let targetUserId = null;
  if (route.query.user) {
    targetUserId = parseInt(route.query.user, 10);
  } else if (injectedUserId) {
    targetUserId = injectedUserId;
  }
  try {
    await Promise.all([
      chatStore.fetchConversations(),
      chatStore.fetchUnreadMessages()
    ]);
    await chatStore.fetchLatestMessages();
    if (targetUserId && !isNaN(targetUserId)) {
      await selectConversation(targetUserId);
    }
  } catch (error) {
    console.error('Lỗi khi khởi tạo ChatContainer:', error);
  }
  
  socketService.onMessage(handleSocketMessage);
});

onUnmounted(() => {
  socketService.offMessage(handleSocketMessage);
});
</script>

<style scoped>
.bg-red-25 {
  background-color: #fef7f7;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  /* Ensure mobile chat takes full height */
  .mobile-chat {
    height: 100vh;
    overflow: hidden;
  }
  
  /* Better touch targets on mobile */
  .mobile-conversation-item {
    min-height: 72px;
  }
  
  /* Optimize chat input for mobile */
  .mobile-chat-input textarea {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}

/* Custom scrollbar for mobile */
@media (max-width: 768px) {
  .mobile-messages::-webkit-scrollbar {
    width: 3px;
  }
  
  .mobile-messages::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .mobile-messages::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 3px;
  }
}
</style> 