<template>
  <div class="h-full flex bg-white shadow-lg rounded-lg overflow-hidden">
    <!-- Sidebar với danh sách cuộc trò chuyện -->
    <div class="w-1/3 border-r flex flex-col">
      <div class="py-3 px-4 border-b">
        <h2 class="text-lg font-semibold text-gray-800">Tin nhắn</h2>
        <div class="relative mt-2">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            class="w-full border rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <i class="fas fa-search"></i>
          </div>
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <div v-if="chatStore.loading && !activeConversationId" class="p-4 text-center">
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
            :is-active="activeConversationId === conversation.userId"
            @select="selectConversation(conversation.userId)"
          />
        </template>
      </div>
    </div>
    
    <!-- Phần hiển thị tin nhắn -->
    <div class="w-2/3 flex flex-col">
      <template v-if="activeConversationId">
        <!-- Header cuộc trò chuyện -->
        <div class="py-3 px-4 border-b flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden mr-3">
              <template v-if="activeConversation?.avatar">
                <img :src="activeConversation.avatar" alt="Avatar" class="w-full h-full object-cover" />
              </template>
              <template v-else>
                <i class="fas fa-user text-gray-500"></i>
              </template>
            </div>
            <div>
              <h3 class="font-medium text-gray-800">{{ activeConversation?.displayName }}</h3>
              <p v-if="activeConversation?.isOnline" class="text-xs text-green-500">
                <i class="fas fa-circle mr-1 text-[8px]"></i> Đang hoạt động
              </p>
            </div>
          </div>
        </div>
        
        <!-- Khu vực tin nhắn -->
        <div 
          class="flex-1 p-4 overflow-y-auto flex flex-col relative" 
          ref="messagesContainer"
          @scroll="handleScroll"
        >
          <!-- Nút cuộn xuống -->
          <button 
            v-if="!isAtBottom && chatStore.messages.length > 5"
            @click="scrollToBottom" 
            class="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg z-10"
            title="Cuộn xuống tin nhắn mới nhất"
          >
            <i class="fas fa-arrow-down"></i>
          </button>
          
          <div v-if="loadingOlderMessages" class="py-2 text-center mb-2">
            <i class="fas fa-circle-notch fa-spin text-blue-500"></i>
            <p class="text-xs text-gray-500">Đang tải thêm tin nhắn cũ hơn...</p>
          </div>
          
          <div v-if="chatStore.loading && !chatStore.messages.length" class="my-auto text-center">
            <i class="fas fa-circle-notch fa-spin text-blue-500 text-xl"></i>
            <p class="mt-2 text-gray-500">Đang tải tin nhắn...</p>
            <p class="text-xs text-gray-400 mt-1">Đang tải nhiều trang để hiển thị đầy đủ cuộc trò chuyện</p>
          </div>
          
          <div v-else-if="!chatStore.messages.length" class="my-auto text-center">
            <i class="fas fa-comment-dots text-gray-300 text-4xl"></i>
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
            
            <div v-if="chatStore.loading && chatStore.messages.length" class="py-2 text-center">
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
import { useRoute } from 'vue-router';
import ChatMessage from '../../components/common/ChatMessage.vue';
import ChatConversation from '../../components/common/ChatConversation.vue';
import ChatInput from '../../components/common/ChatInput.vue';
import socketService from '../../services/socketService';

const chatStore = useChatStore();
const authStore = useAuthStore();
const route = useRoute();
const searchQuery = ref('');
const activeConversationId = ref(null);
const messagesContainer = ref(null);
const loadingOlderMessages = ref(false);
const isAtBottom = ref(true);

// Inject userId từ component cha nếu có
const injectedUserId = inject('chatUserId', null);
console.log('Giá trị userId được inject từ component cha:', injectedUserId);

// ID của người dùng hiện tại
const currentUserId = computed(() => authStore.userInfo?.user_id);

// Theo dõi thay đổi của tham số user trong URL
watch(() => route.query.user, (newUserId) => {
  if (newUserId) {
    console.log('Tham số user đã thay đổi:', newUserId);
    const userId = parseInt(newUserId, 10);
    if (!isNaN(userId)) {
      console.log('Chọn cuộc trò chuyện mới từ URL thay đổi:', userId);
      selectConversation(userId);
    }
  }
}, { immediate: false });

// Danh sách cuộc trò chuyện đã được xử lý
const processedConversations = computed(() => {
  if (!chatStore.conversations.length) return [];
  
  // Tạo map để lưu trữ người dùng duy nhất
  const userMap = new Map();
  
  // Lấy tin nhắn cuối cùng cho mỗi cuộc trò chuyện
  const lastMessagesMap = new Map();
  const unreadCountMap = new Map();
  
  // Tạo map cho tin nhắn cuối cùng và số tin nhắn chưa đọc của mỗi người dùng
  chatStore.messages.forEach(msg => {
    const senderId = msg.sender;
    const recipientId = msg.recipient;
    const otherUserId = senderId === currentUserId.value ? recipientId : senderId;
    
    // Cập nhật tin nhắn cuối cùng
    if (!lastMessagesMap.has(otherUserId) || 
        new Date(msg.created_at) > new Date(lastMessagesMap.get(otherUserId).created_at)) {
      lastMessagesMap.set(otherUserId, msg);
    }
    
    // Đếm số tin nhắn chưa đọc
    if (!msg.is_read && msg.recipient === currentUserId.value) {
      const count = unreadCountMap.get(senderId) || 0;
      unreadCountMap.set(senderId, count + 1);
    }
  });
  
  chatStore.conversations.forEach(conv => {
    // Xác định người dùng khác là ai
    const isUserSender = conv.sender === currentUserId.value;
    const otherUserId = isUserSender ? conv.recipient : conv.sender;
    
    // Lấy tin nhắn cuối cùng
    const lastMessage = lastMessagesMap.get(otherUserId);
    
    // Bỏ qua nếu đã có người dùng này trong map
    if (!userMap.has(otherUserId)) {
      userMap.set(otherUserId, {
        userId: otherUserId,
        displayName: `Người dùng #${otherUserId}`,
        avatar: null, // TODO: Lấy avatar từ API
        isOnline: false, // TODO: Kiểm tra trạng thái online
        lastMessage: lastMessage?.content || '', 
        lastMessageTime: lastMessage?.created_at || '',
        unreadCount: unreadCountMap.get(otherUserId) || 0
      });
    }
  });
  
  // Chuyển đổi Map thành mảng
  return Array.from(userMap.values());
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
  if (!activeConversationId.value) return null;
  
  return processedConversations.value.find(
    conv => conv.userId === activeConversationId.value
  );
});

// Lấy tên hiển thị của người dùng
const getDisplayName = (conversation) => {
  return conversation.displayName || `Người dùng #${conversation.userId}`;
};

// Chọn một cuộc trò chuyện
const selectConversation = async (userId) => {
  console.log('Đang chọn cuộc trò chuyện với userId:', userId);
  activeConversationId.value = userId;
  
  // Lấy tin nhắn của cuộc trò chuyện này
  await chatStore.fetchMessages(userId, true);
  
  // Đánh dấu các tin nhắn chưa đọc trong cuộc trò chuyện này là đã đọc
  markMessagesAsRead();
  
  // Đảm bảo luôn cuộn xuống tin nhắn cuối cùng sau khi tải xong và DOM cập nhật
  setTimeout(() => {
    scrollToBottom();
    console.log('Đã cuộn xuống tin nhắn mới nhất sau khi chọn cuộc trò chuyện');
  }, 100);
  
  // Đợi DOM cập nhật và cuộn xuống một lần nữa để đảm bảo
  await nextTick();
  scrollToBottom();
};

// Đánh dấu tin nhắn đã đọc
const markMessagesAsRead = async () => {
  // Lọc các tin nhắn chưa đọc từ người khác
  const unreadMessages = chatStore.messages.filter(
    msg => !msg.is_read && msg.sender !== currentUserId.value
  );
  
  if (unreadMessages.length > 0) {
    console.log(`Đánh dấu ${unreadMessages.length} tin nhắn là đã đọc`);
    
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
  if (!activeConversationId.value) return;
  
  try {
    // Gửi tin nhắn và lấy kết quả trả về
    const newMessage = await chatStore.sendMessage(activeConversationId.value, content);
    console.log('📤 Đã gửi tin nhắn mới:', newMessage);
    
    // Cập nhật tin nhắn mới nhất và thời gian cho cuộc trò chuyện hiện tại
    // (Đảm bảo UI được cập nhật ngay lập tức)
    const currentConversation = processedConversations.value.find(
      conv => conv.userId === activeConversationId.value
    );
    
    if (currentConversation) {
      console.log('Cập nhật tin nhắn mới nhất cho cuộc trò chuyện hiện tại:', currentConversation.userId);
      currentConversation.lastMessage = content;
      currentConversation.lastMessageTime = new Date().toISOString();
    }
    
    // Mô phỏng cập nhật ngay cả khi WebSocket không hoạt động
    // Chờ 500ms để kiểm tra xem tin nhắn mới đã được thêm vào danh sách chưa
    setTimeout(() => {
      // Kiểm tra xem tin nhắn mới nhất có nội dung trùng với tin nhắn vừa gửi hay không
      const latestMessage = chatStore.sortedMessages[chatStore.sortedMessages.length - 1];
      
      if (latestMessage && latestMessage.content === content) {
        console.log('✅ Tin nhắn đã được thêm vào danh sách, không cần mô phỏng');
      } else {
        // Nếu chưa có trong danh sách, có thể do WebSocket không hoạt động, tạo tin nhắn mô phỏng
        console.log('⚠️ Không tìm thấy tin nhắn mới trong danh sách, mô phỏng tin nhắn');
        
        // Thử thêm tin nhắn vào store một lần nữa để đảm bảo hiển thị
        if (newMessage) {
          chatStore.addMessage({
            ...newMessage,
            is_read: true // Tự động đánh dấu là đã đọc vì người gửi đã đọc tin nhắn của mình
          });
          
          // Đưa cuộc trò chuyện này lên đầu danh sách
          chatStore.sortConversationToTop(newMessage);
        }
      }
    }, 500);
    
    // Cuộn xuống tin nhắn cuối cùng
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn:', error);
  }
};

// Cuộn xuống tin nhắn cuối cùng
const scrollToBottom = () => {
  if (messagesContainer.value) {
    console.log('Thực hiện cuộn xuống cuối cùng');
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    
    // Thử cuộn xuống lần nữa sau một khoảng thời gian ngắn
    setTimeout(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        console.log('Đã cuộn xuống lần thứ hai để đảm bảo hiển thị tin nhắn mới nhất');
      }
    }, 100);
  }
};

// Xử lý sự kiện cuộn để tải thêm tin nhắn cũ
const handleScroll = async () => {
  if (!messagesContainer.value || !activeConversationId.value) return;
  
  const { scrollTop, clientHeight, scrollHeight } = messagesContainer.value;
  
  // Kiểm tra xem người dùng có đang ở cuối không
  isAtBottom.value = scrollHeight - scrollTop - clientHeight < 100;
  
  // Khi người dùng cuộn lên gần đầu (20px từ đỉnh), tải thêm tin nhắn cũ hơn
  if (scrollTop <= 20 && !loadingOlderMessages.value && chatStore.hasMoreMessages) {
    console.log('Đang tải thêm tin nhắn cũ hơn...');
    
    // Lưu lại vị trí cuộn và chiều cao trước khi tải
    const previousScrollHeight = scrollHeight;
    
    // Đánh dấu đang tải
    loadingOlderMessages.value = true;
    
    try {
      // Chỉ tải 1 trang khi cuộn lên vì đã tải nhiều trang lúc đầu
      await chatStore.fetchMessages(activeConversationId.value);
      
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
        
        console.log(`Đã điều chỉnh scrollTop từ 0 đến ${newScrollTop}px`);
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
  console.log('Nội dung tin nhắn đã thay đổi (deep check)');
  
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
      console.log('Nội dung thay đổi và người dùng gần cuối hoặc gửi tin nhắn mới, đang cuộn xuống');
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
    console.log(`Số lượng tin nhắn đã tăng từ ${oldLength} lên ${newLength}`);
    
    // Nếu có tin nhắn mới và người dùng đang ở gần cuối hoặc tin nhắn là từ người dùng hiện tại, cuộn xuống
    const latestMessage = chatStore.sortedMessages[chatStore.sortedMessages.length - 1];
    if (latestMessage && messagesContainer.value) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 300;
      const isFromCurrentUser = latestMessage.sender === currentUserId.value;
      
      if (isNearBottom || isFromCurrentUser) {
        console.log('Có tin nhắn mới và người dùng gần cuối hoặc tin nhắn từ user hiện tại, cuộn xuống');
        scrollToBottom();
      }
    }
  }
});

// Theo dõi activeConversation
watch(() => chatStore.activeConversation, (newConversation, oldConversation) => {
  if (newConversation !== oldConversation) {
    console.log(`Active conversation changed from ${oldConversation} to ${newConversation}`);
    
    // Cuộn xuống khi chuyển sang cuộc trò chuyện mới
    nextTick(() => {
      scrollToBottom();
    });
  }
});

// Thêm theo dõi thay đổi tin nhắn để cập nhật danh sách cuộc trò chuyện
watch(() => chatStore.messages, (newMessages, oldMessages) => {
  console.log('Tin nhắn thay đổi, danh sách cuộc trò chuyện sẽ được cập nhật');
  
  // Kiểm tra nếu có tin nhắn mới được thêm vào
  if (newMessages.length > oldMessages.length) {
    const latestMessage = chatStore.sortedMessages[chatStore.sortedMessages.length - 1];
    
    // Kiểm tra nếu tin nhắn mới thuộc cuộc trò chuyện đang mở
    if (latestMessage) {
      const otherPartyId = latestMessage.sender === currentUserId.value 
                         ? latestMessage.recipient 
                         : latestMessage.sender;
                         
      // Nếu là tin nhắn mới trong cuộc trò chuyện đang mở
      if (activeConversationId.value === otherPartyId) {
        console.log('Tin nhắn mới thuộc cuộc trò chuyện đang mở');
        
        // Đánh dấu tin nhắn đã đọc nếu người dùng hiện tại là người nhận
        if (latestMessage.recipient === currentUserId.value && !latestMessage.is_read) {
          chatStore.markMessageAsRead(latestMessage.id);
        }
      }
    }
  }
}, { deep: true });

onMounted(async () => {
  console.log('ChatContainer đã được mount');
  
  // Kết nối WebSocket
  initSocketConnection();
  
  // Lấy userId từ route hoặc từ giá trị được inject
  let targetUserId = null;
  if (route.query.user) {
    targetUserId = parseInt(route.query.user, 10);
    console.log('Tìm thấy tham số user trong URL:', targetUserId);
  } else if (injectedUserId) {
    targetUserId = injectedUserId;
    console.log('Sử dụng userId được inject:', targetUserId);
  }
  
  // Tải danh sách cuộc trò chuyện
  try {
    await chatStore.fetchConversations();
    
    // Tải số lượng tin nhắn chưa đọc
    await chatStore.fetchUnreadMessages();

    // Nếu có userId từ URL hoặc inject, chọn cuộc trò chuyện
    if (targetUserId && !isNaN(targetUserId)) {
      console.log('Thực hiện chọn cuộc trò chuyện với userId:', targetUserId);
      selectConversation(targetUserId);
    }
    
    // Lấy tin nhắn gần đây nhất cho mỗi cuộc trò chuyện
    // Cần tải tin nhắn mới nhất cho mỗi cuộc trò chuyện
    for (const conv of processedConversations.value) {
      try {
        // Lấy thông tin người dùng để hiển thị tên
        const userInfo = await chatStore.fetchUserInfo(conv.userId);
        if (userInfo) {
          conv.displayName = userInfo.fullname || conv.displayName;
          conv.avatar = userInfo.avatar || null;
        }
        
        // Nếu chưa có tin nhắn mới nhất, tải một tin nhắn mới nhất
        if (!conv.lastMessage) {
          const messages = await chatStore.fetchLatestMessage(conv.userId);
          if (messages && messages.length > 0) {
            conv.lastMessage = messages[0].content;
            conv.lastMessageTime = messages[0].created_at;
          }
        }
      } catch (error) {
        console.error(`Không thể lấy thông tin cho người dùng ${conv.userId}:`, error);
      }
    }
    
    // Thiết lập kiểm tra kết nối WebSocket định kỳ
    startSocketConnectionChecker();
  } catch (error) {
    console.error('Lỗi khi khởi tạo ChatContainer:', error);
  }
});

// Khởi tạo kết nối WebSocket
const initSocketConnection = () => {
  console.log('Đang khởi tạo kết nối WebSocket...');
  
  // Thử kết nối trước
  socketService.init();
  
  // Kiểm tra trạng thái kết nối sau 2 giây
  setTimeout(() => {
    if (!socketService.connected) {
      console.log('⚠️ WebSocket chưa kết nối sau 2 giây, thử kết nối lại...');
      socketService.disconnect(); // Đảm bảo đóng kết nối cũ
      socketService.init(); // Thử kết nối lại
    } else {
      console.log('✅ WebSocket đã kết nối thành công!');
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
      console.log('⚠️ Phát hiện WebSocket đã ngắt kết nối, đang thử kết nối lại...');
      socketService.init();
    } else {
      console.log('✓ WebSocket vẫn đang kết nối');
    }
  }, 30000); // 30 giây
};

onUnmounted(() => {
  console.log('ChatContainer đã được unmount');
  
  // Xóa interval kiểm tra socket
  if (socketCheckInterval) {
    clearInterval(socketCheckInterval);
    socketCheckInterval = null;
  }
  
  // Ngắt kết nối socket để tránh nhận tin nhắn trùng lặp ở các màn hình khác
  socketService.disconnect();
});
</script> 