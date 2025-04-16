<template>
  <div 
    class="fixed bottom-0 right-16 flex flex-col bg-white rounded-t-lg shadow-xl border border-gray-200 z-50 transition-all duration-300 ease-in-out"
    :class="isMinimized ? 'w-72 h-12' : 'w-96 h-[500px]'"
    :style="{ transform: isHidden ? 'translateY(100%)' : 'translateY(0)' }"
  >
    <!-- Header -->
    <div 
      class="flex items-center justify-between px-4 py-2 bg-blue-500 text-white rounded-t-lg cursor-pointer"
      @click="toggleMinimize"
    >
      <div class="flex items-center">
        <div class="flex-shrink-0 mr-2 relative">
          <div v-if="conversation.avatar" class="w-8 h-8 rounded-full overflow-hidden border border-white">
            <img :src="conversation.avatar" alt="Avatar" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {{ getInitials(conversation.displayName) }}
          </div>
          <div v-if="conversation.isOnline" class="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
        </div>
        <div class="text-sm font-medium truncate">{{ conversation.displayName }}</div>
      </div>
      <div class="flex items-center space-x-1">
        <button v-if="!isMinimized" @click.stop="toggleMinimize" class="p-1 hover:bg-blue-600 rounded">
          <i class="fas fa-minus text-xs"></i>
        </button>
        <button @click.stop="close" class="p-1 hover:bg-blue-600 rounded">
          <i class="fas fa-times text-xs"></i>
        </button>
      </div>
    </div>

    <!-- Body -->
    <div v-if="!isMinimized" class="flex-1 flex flex-col overflow-hidden">
      <!-- Messages -->
      <div 
        ref="messagesContainer" 
        class="flex-1 p-3 overflow-y-auto" 
        @scroll="handleScroll"
        v-scroll-bottom="messages"
      >
        <div v-if="loading" class="flex justify-center items-center h-full">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
        <div v-else-if="messages.length === 0" class="flex justify-center items-center h-full text-gray-500">
          Không có tin nhắn. Hãy bắt đầu cuộc trò chuyện.
        </div>
        <template v-else>
          <div v-for="(message, index) in sortedMessages" :key="message.id" class="mb-2">
            <div 
              :class="[
                'max-w-[75%] rounded-lg p-2 break-words',
                message.sender === currentUserId 
                  ? 'bg-blue-500 text-white ml-auto rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              ]"
            >
              {{ message.content }}
            </div>
            <div 
              :class="[
                'text-xs mt-1',
                message.sender === currentUserId ? 'text-right' : 'text-left'
              ]"
            >
              <span class="text-gray-500">{{ formatTime(message.created_at) }}</span>
              <span v-if="message.sender === currentUserId" class="ml-1">
                <i 
                  :class="[
                    'fas', 
                    message.is_read ? 'fa-check-double text-blue-500' : 'fa-check text-gray-400'
                  ]"
                ></i>
              </span>
            </div>
          </div>
        </template>
      </div>

      <!-- Input Area -->
      <div class="p-2 border-t border-gray-200">
        <div class="flex items-center bg-gray-100 rounded-full px-3 py-1">
          <div class="flex items-center space-x-1">
            <button class="text-gray-500 hover:text-blue-500">
              <i class="fas fa-smile"></i>
            </button>
            <button class="text-gray-500 hover:text-blue-500">
              <i class="fas fa-paperclip"></i>
            </button>
          </div>
          <input 
            v-model="newMessage" 
            type="text" 
            placeholder="Nhập tin nhắn..." 
            class="flex-1 border-none bg-transparent p-2 focus:outline-none text-sm"
            @keyup.enter="sendMessage"
          />
          <button 
            @click="sendMessage" 
            class="ml-2 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
            :disabled="!newMessage.trim()"
          >
            <i class="fas fa-paper-plane text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue';
import { useChatStore } from '../../stores/chat';
import { useAuthStore } from '../../stores/auth';
import socketService from '../../services/socketService';

const props = defineProps({
  conversation: {
    type: Object,
    required: true,
    default: () => ({
      userId: null,
      displayName: 'Người dùng',
      avatar: null,
      isOnline: false
    })
  }
});

// Debug: Log props khi component được tạo
console.log('ChatPopup được khởi tạo với props:', props.conversation);

// Debug: Theo dõi thay đổi của props
watch(() => props.conversation, (newConversation) => {
  console.log('Props conversation đã thay đổi:', newConversation);
}, { deep: true });

// Theo dõi thay đổi của props.conversation.userId
watch(() => props.conversation.userId, (newUserId, oldUserId) => {
  console.log(`Props userId đã thay đổi từ ${oldUserId} thành ${newUserId}`);
  
  if (newUserId !== oldUserId) {
    // Cập nhật activeConversation trong store
    chatStore.activeConversation = newUserId;
    
    // Tải lại tin nhắn với userId mới
    loadInitialMessages();
  }
});

const emit = defineEmits(['close']);

const chatStore = useChatStore();
const authStore = useAuthStore();
const currentUserId = computed(() => authStore.userInfo?.user_id);

const isMinimized = ref(false);
const isHidden = ref(false);
const loading = ref(true);
const messages = ref([]);
const newMessage = ref('');
const messagesContainer = ref(null);
const hasMoreMessages = ref(true);
const page = ref(1);

// Sắp xếp tin nhắn theo thời gian
const sortedMessages = computed(() => {
  return [...messages.value].sort((a, b) => 
    new Date(a.created_at) - new Date(b.created_at)
  );
});

// Toggle trạng thái thu nhỏ/mở rộng
const toggleMinimize = () => {
  console.log('Toggle minimize:', !isMinimized.value);
  isMinimized.value = !isMinimized.value;
  
  // Nếu mở rộng, cuộn xuống tin nhắn mới nhất
  if (!isMinimized.value) {
    setTimeout(() => {
      scrollToBottom();
    }, 300); // Đợi animation hoàn thành
  }
};

// Đóng popup chat
const close = () => {
  console.log('Đóng popup chat, userId:', props.conversation.userId);
  isHidden.value = true;
  
  // Reset conversation trong store
  if (chatStore.activeConversation === props.conversation.userId) {
    chatStore.resetActiveConversation();
  }
  
  // Đợi animation hoàn thành rồi emit sự kiện đóng
  setTimeout(() => {
    emit('close');
    console.log('Đã emit sự kiện đóng cho userId:', props.conversation.userId);
  }, 300);
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
    return `${Math.floor(diffInMinutes / (24 * 60))}ngày`;
  } else {
    return date.toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }
};

// Gửi tin nhắn mới
const sendMessage = async () => {
  if (!newMessage.value.trim()) return;
  
  try {
    const content = newMessage.value.trim();
    newMessage.value = ''; // Reset input
    
    console.log('Gửi tin nhắn mới:', content, 'tới người dùng:', props.conversation.userId);
    
    // Gửi tin nhắn qua store
    const message = await chatStore.sendMessage(props.conversation.userId, content);
    
    console.log('Tin nhắn đã được gửi:', message);
    
    // Tin nhắn đã được thêm vào store tự động bởi sendMessage
    // và watcher sẽ cập nhật messages.value
    
    // Cuộn xuống sau khi tin nhắn được gửi
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn:', error);
  }
};

// Cuộn xuống tin nhắn cuối cùng
const scrollToBottom = () => {
  if (messagesContainer.value) {
    console.log('Thực hiện cuộn xuống tin nhắn cuối cùng');
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    
    // Thêm thời gian chờ để đảm bảo DOM đã cập nhật hoàn toàn
    setTimeout(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        console.log('Thực hiện cuộn lần thứ hai để đảm bảo');
      }
    }, 100);
  }
};

// Xử lý sự kiện cuộn để tải thêm tin nhắn cũ
const handleScroll = async () => {
  if (!messagesContainer.value || !hasMoreMessages.value || loading.value) return;
  
  const { scrollTop } = messagesContainer.value;
  
  // Khi người dùng cuộn lên gần đầu (20px từ đỉnh), tải thêm tin nhắn cũ hơn
  if (scrollTop <= 20) {
    loading.value = true;
    
    try {
      // Lưu lại vị trí scroll hiện tại
      const oldScrollHeight = messagesContainer.value.scrollHeight;
      
      console.log('Tải thêm tin nhắn cũ, trang:', chatStore.page);
      
      // Lưu số lượng tin nhắn hiện tại
      const currentMessagesCount = chatStore.messages.length;
      
      // Sử dụng fetchMessages để tải thêm tin nhắn cũ và cập nhật store
      await chatStore.fetchMessages(props.conversation.userId);
      
      // Cập nhật tin nhắn từ store sau khi tải
      messages.value = [...chatStore.messages];
      
      // Kiểm tra xem có tin nhắn mới được thêm vào không
      if (chatStore.messages.length > currentMessagesCount) {
        console.log('Đã nhận được tin nhắn cũ:', chatStore.messages.length - currentMessagesCount);
        
        // Giữ nguyên vị trí scroll sau khi thêm tin nhắn
        await nextTick();
        const newScrollHeight = messagesContainer.value.scrollHeight;
        messagesContainer.value.scrollTop = newScrollHeight - oldScrollHeight;
      } else {
        hasMoreMessages.value = false;
        console.log('Không còn tin nhắn cũ nào');
      }
    } catch (error) {
      console.error('Lỗi khi tải thêm tin nhắn cũ:', error);
    } finally {
      loading.value = false;
    }
  }
};

// Xử lý tin nhắn mới từ socket
const handleNewMessage = (data) => {
  console.log('[ChatPopup] Nhận tin nhắn mới từ socket:', data);
  
  // Chuyển đổi dữ liệu tin nhắn
  let message;
  
  // Tin nhắn có thể có nhiều cấu trúc khác nhau tùy thuộc vào nguồn
  if (data.type === 'new_message' || (data.data && data.data.type === 'new_message')) {
    // Lấy dữ liệu tin nhắn đúng cách (có thể nằm trong data.data hoặc trực tiếp trong data)
    const messageData = data.data?.type === 'new_message' ? data.data : data;
    
    message = {
      id: parseInt(messageData.message_id, 10),
      sender: parseInt(messageData.sender_id, 10),
      recipient: parseInt(messageData.recipient_id, 10),
      content: messageData.content,
      is_read: messageData.is_read || false,
      created_at: messageData.created_at || new Date().toISOString()
    };
  } else if (data.type === 'chat_message') {
    message = data.message;
  } else {
    console.log('[ChatPopup] Không phải tin nhắn chat, bỏ qua');
    return;
  }
  
  if (!message || !message.id) {
    console.log('[ChatPopup] Dữ liệu tin nhắn không hợp lệ, bỏ qua');
    return;
  }
  
  console.log('[ChatPopup] Tin nhắn được xử lý:', message);
  
  // Kiểm tra xem tin nhắn có thuộc cuộc trò chuyện này không
  const userIdNow = props.conversation.userId;
  const myUserId = authStore.userInfo?.user_id; 
  
  // Tin nhắn thuộc cuộc trò chuyện hiện tại nếu:
  // 1. Người gửi là người dùng khác VÀ người nhận là tôi
  // 2. Người gửi là tôi VÀ người nhận là người dùng khác
  const isRelevant = 
    (message.sender === userIdNow && message.recipient === myUserId) || 
    (message.sender === myUserId && message.recipient === userIdNow);
  
  console.log(`[ChatPopup] Tin nhắn có liên quan đến cuộc trò chuyện này (${userIdNow})? ${isRelevant}`, 
      { sender: message.sender, recipient: message.recipient, myId: myUserId });
  
  // Chỉ xử lý tin nhắn liên quan đến cuộc trò chuyện này
  if (isRelevant) {
    // Đánh dấu là đã đọc nếu tin nhắn từ người khác và chưa được đọc
    if (message.sender === userIdNow && !message.is_read) {
      console.log('[ChatPopup] Đánh dấu tin nhắn là đã đọc:', message.id);
      chatStore.markMessageAsRead(message.id);
    }
  }
};

// Tải tin nhắn ban đầu
const loadInitialMessages = async () => {
  loading.value = true;
  try {
    console.log('Tải tin nhắn ban đầu cho cuộc trò chuyện với người dùng:', props.conversation.userId);
    
    // Sử dụng fetchMessages thay vì getMessages để cập nhật tin nhắn vào store
    await chatStore.fetchMessages(props.conversation.userId, true);
    
    // Lấy tin nhắn từ store
    messages.value = [...chatStore.messages];
    
    console.log('Đã tải được', messages.value.length, 'tin nhắn ban đầu');
    
    // Cuộn xuống tin nhắn cuối cùng
    await nextTick();
    scrollToBottom();
    
    // Đánh dấu tất cả tin nhắn là đã đọc
    const unreadMessages = messages.value.filter(
      msg => !msg.is_read && msg.sender === props.conversation.userId
    );
    
    if (unreadMessages.length > 0) {
      console.log('Đánh dấu', unreadMessages.length, 'tin nhắn là đã đọc');
    }
    
    for (const message of unreadMessages) {
      await chatStore.markMessageAsRead(message.id);
    }
    
  } catch (error) {
    console.error('Lỗi khi tải tin nhắn ban đầu:', error);
  } finally {
    loading.value = false;
  }
};

// Theo dõi sự thay đổi của chatStore.messages
watch(() => chatStore.messages, (newMessages) => {
  console.log('[ChatPopup] chatStore.messages đã thay đổi, số lượng tin nhắn:', newMessages.length);
  
  // Lọc ra chỉ những tin nhắn thuộc cuộc trò chuyện hiện tại
  const userIdNow = props.conversation.userId;
  const myUserId = authStore.userInfo?.user_id;
  
  const relevantMessages = newMessages.filter(msg => 
    (msg.sender === userIdNow && msg.recipient === myUserId) || 
    (msg.sender === myUserId && msg.recipient === userIdNow)
  );
  
  console.log(`[ChatPopup] Tìm thấy ${relevantMessages.length} tin nhắn thuộc cuộc trò chuyện ${userIdNow}`);
  
  // Cập nhật danh sách tin nhắn
  messages.value = [...relevantMessages];
}, { deep: true });

// Theo dõi thay đổi của messages để cuộn xuống tự động
watch(() => messages.value.length, () => {
  console.log('Số lượng tin nhắn đã thay đổi, tự động cuộn xuống');
  nextTick(() => {
    scrollToBottom();
  });
});

// Thiết lập người dùng đang chat là active conversation trong store
onMounted(async () => {
  console.log('ChatPopup đã được gắn vào DOM');
  
  // Thiết lập active conversation trong store là người dùng hiện tại đang chat
  chatStore.activeConversation = props.conversation.userId;
  console.log('Đã thiết lập activeConversation:', chatStore.activeConversation);
  
  await loadInitialMessages();
  
  // Đăng ký lắng nghe tin nhắn mới
  socketService.onMessage(handleNewMessage);
  
  console.log('Đã thiết lập ChatPopup hoàn tất');
});

// Xóa event listener khi component bị hủy
onUnmounted(() => {
  console.log('ChatPopup đã bị hủy', props.conversation.userId);
  
  // Reset conversation trong store
  if (chatStore.activeConversation === props.conversation.userId) {
    chatStore.resetActiveConversation();
  }
  
  // Reset dữ liệu để tránh lưu trong bộ nhớ
  messages.value = [];
  isMinimized.value = false;
  isHidden.value = false;
  
  // Hủy lắng nghe socket
  socketService.offMessage(handleNewMessage);
  
  console.log('Đã dọn dẹp tài nguyên của ChatPopup');
});
</script>

<style scoped>
/* Hiệu ứng khi đóng/mở popup */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Thiết kế tin nhắn */
.message-bubble {
  max-width: 75%;
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 18px;
  word-break: break-word;
}
.message-bubble.own {
  background-color: #0084ff;
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}
.message-bubble.other {
  background-color: #f0f0f0;
  color: #333;
  margin-right: auto;
  border-bottom-left-radius: 4px;
}
</style> 