<template>
  <div class="h-full flex bg-white shadow-md rounded-lg overflow-hidden">
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

// Inject userId từ component cha nếu có
const injectedUserId = inject('chatUserId', null);

// ID của người dùng hiện tại
const currentUserId = computed(() => authStore.userInfo?.user_id);

// Theo dõi thay đổi của tham số user trong URL
watch(() => route.query.user, (newUserId) => {
  if (newUserId) {
    const userId = parseInt(newUserId, 10);
    if (!isNaN(userId)) {
      selectConversation(userId);
    }
  }
}, { immediate: false });

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
    if (lastMessage) {
      const sender = typeof lastMessage.sender === 'string' ? parseInt(lastMessage.sender, 10) : lastMessage.sender;
      const recipient = typeof lastMessage.recipient === 'string' ? parseInt(lastMessage.recipient, 10) : lastMessage.recipient;
      const belongsToConversation = 
        (sender === currentUserId.value && recipient === otherUserIdNum) ||
        (sender === otherUserIdNum && recipient === currentUserId.value);
      if (!belongsToConversation) {
        lastMessage = null;
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
        unreadCount: 0 // Để đơn giản, chỉ hiển thị số chưa đọc nếu cần
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
  chatStore.activeConversation = userId;
  activeConversationId.value = userId;
  if (chatStore.activeConversation === userId && chatStore.sortedMessages.length > 0) {
    return;
  }
  chatStore.page = 1;
  chatStore.hasMoreMessages = true;
  try {
    let shouldFetchUserInfo = !chatStore.userInfoCache[userId];
    let userInfoPromise = null;
    if (shouldFetchUserInfo) {
      userInfoPromise = chatStore.fetchUserInfo(userId);
    }
    const messages = await chatStore.fetchMessages(userId, true);
    if (!messages || messages.length < 20) {
      chatStore.hasMoreMessages = false;
    } else {
      chatStore.hasMoreMessages = true;
    }
    await Promise.all([
      userInfoPromise
    ].filter(Boolean));
    await markMessagesAsRead();
    await nextTick();
  setTimeout(() => {
    scrollToBottom();
  }, 100);
  } catch (error) {
    console.error('Lỗi khi tải tin nhắn:', error);
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

    const currentConversation = processedConversations.value.find(
      conv => conv.userId === chatStore.activeConversation
    );
    
    if (currentConversation) {
      currentConversation.lastMessage = content;
      currentConversation.lastMessageTime = new Date().toISOString();
    }
    
    // Thử tải tin nhắn mới nhất sau khi gửi tin nhắn để cập nhật danh sách
    setTimeout(async () => {
      try {
        await chatStore.fetchLatestMessages();
      } catch (error) {
        console.error('Lỗi khi tải tin nhắn mới nhất sau khi gửi:', error);
      }
    }, 500);
    
    setTimeout(() => {
      const latestMessage = chatStore.sortedMessages[chatStore.sortedMessages.length - 1];
      
      if (latestMessage && latestMessage.content === content) {
      } else {
        if (newMessage) {
          chatStore.addMessage({
            ...newMessage,
            is_read: true
          });
          
          chatStore.sortConversationToTop(newMessage);
        }
      }
    }, 500);
    
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn:', error);
  }
};

// Cuộn xuống tin nhắn cuối cùng
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    
    // Thử cuộn xuống lần nữa sau một khoảng thời gian ngắn
    setTimeout(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    }, 100);
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
    
    // Đánh dấu đang tải
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

// Theo dõi nội dung tin nhắn để phát hiện thay đổi
watch(() => JSON.stringify(chatStore.sortedMessages), () => {
  
  // Đánh dấu tin nhắn mới là đã đọc
  markMessagesAsRead();
  
  // Cuộn xuống khi người dùng đang ở gần cuối hoặc có tin nhắn mới 
  if (messagesContainer.value) {
    const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
    // Tăng khoảng cách từ cuối lên 300px để dễ dàng cuộn xuống
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 300;
    
    // Nếu người dùng đang gần cuối hoặc nếu tin nhắn mới là từ người dùng hiện tại, cuộn xuống
    const latestMessage = chatStore.sortedMessages[chatStore.sortedMessages.length - 1];
    const isFromCurrentUser = latestMessage && latestMessage.sender === currentUserId.value;
    
    if (isNearBottom || isFromCurrentUser) {
      // Cuộn xuống ngay lập tức và thêm một lần nữa sau khi DOM cập nhật
      scrollToBottom();
      nextTick(() => {
        scrollToBottom();
      });
    }
  }
});

// Cập nhật watcher cho tin nhắn - đảm bảo theo dõi tin nhắn cuối cùng
watch(() => chatStore.sortedMessages.length, (newLength, oldLength) => {
  if (newLength > oldLength) {
    
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
      
      if (isNearBottom || isFromCurrentUser) {
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
  if (data && data.type === 'chat_message') {
    const message = data.message;
    
    // Thêm tin nhắn mới vào store
    chatStore.addMessage(message);
    
    // Nếu tin nhắn đến từ người khác và cuộc trò chuyện không phải đang mở, tạo thông báo
    const currentUserId = authStore.userInfo?.user_id;
    if (message.sender !== currentUserId && chatStore.activeConversation !== message.sender) {
      // Lấy thông tin người gửi để hiển thị tên
      const senderInfo = chatStore.userInfoCache[message.sender];
      const senderName = senderInfo?.fullname || `Người dùng #${message.sender}`;
      
      // Tạo thông báo mới
      notificationStore.createMessageNotification(message.sender, message.content, senderName);
    }
    
    // Tiếp tục xử lý tin nhắn
    if (chatStore.activeConversation === message.sender) {
      chatStore.markMessageAsRead(message.id);
      
      // Cập nhật tin nhắn mới nhất cho cuộc trò chuyện đang mở
      const currentConversation = processedConversations.value.find(
        conv => conv.userId === message.sender
      );
      
      if (currentConversation) {
        currentConversation.lastMessage = message.content;
        currentConversation.lastMessageTime = message.created_at;
      }
      
      // Cuộn xuống để xem tin nhắn mới
      nextTick(() => {
        scrollToBottom();
      });
    }
    
    // Tải lại tin nhắn mới nhất cho tất cả cuộc trò chuyện để cập nhật UI
    setTimeout(async () => {
      try {
        await chatStore.fetchLatestMessages();
      } catch (error) {
        console.error('Lỗi khi tải tin nhắn mới nhất sau khi nhận tin nhắn socket:', error);
      }
    }, 500);
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

const isValidImageUrl = (url) => {
  if (!url) return false;
  
  // Kiểm tra URL có hợp lệ không
  try {
    // Kiểm tra nếu url là đường dẫn tương đối và không tồn tại
    if (url.startsWith('src/assets/') || url.startsWith('/src/assets/')) {
      console.error('Đường dẫn avatar assets không tồn tại:', url);
      return false;
    }
    
    // Kiểm tra xem URL có hợp lệ không
    new URL(url);
    
    // Kiểm tra định dạng url có phải là một URL của hình ảnh
    if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i) || 
        url.includes('cloudinary.com') || 
        url.includes('res.cloudinary.com')) {
      return true;
    }
    
    // Kiểm tra các trường hợp URL image API phổ biến
    return true;
  } catch (error) {
    console.error('URL avatar không hợp lệ:', url);
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

onMounted(async () => {
  initSocketConnection();
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
    startSocketConnectionChecker();
  } catch (error) {
    console.error('Lỗi khi khởi tạo ChatContainer:', error);
  }
  socketService.onMessage(handleSocketMessage);
});

// Khởi tạo kết nối WebSocket
const initSocketConnection = () => {

  socketService.init();
  
  // Kiểm tra trạng thái kết nối sau 2 giây
  setTimeout(() => {
    if (!socketService.connected) {
      socketService.disconnect(); 
      socketService.init(); 
    }
  }, 2000);
};

// Kiểm tra kết nối socket định kỳ
let socketCheckInterval = null;
const startSocketConnectionChecker = () => {
  // Xóa interval cũ nếu có
  if (socketCheckInterval) {
    clearInterval(socketCheckInterval);
  }
  
  // Thiết lập interval mới kiểm tra mỗi 30 giây
  socketCheckInterval = setInterval(() => {
    if (!socketService.connected) {
      socketService.init();
    }
  }, 30000); // 30 giây
};

onUnmounted(() => {
  

  // Xóa interval kiểm tra socket
  if (socketCheckInterval) {
    clearInterval(socketCheckInterval);
    socketCheckInterval = null;
  }
  
  // Ngắt kết nối socket để tránh nhận tin nhắn trùng lặp ở các màn hình khác
  socketService.disconnect();
  
  // Xóa listener
  socketService.offMessage(handleSocketMessage);
});
</script> 