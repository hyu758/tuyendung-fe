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
          <div v-if="conversation.avatar" class="w-8 h-8 rounded-md overflow-hidden border border-white">
            <img :src="conversation.avatar" alt="Avatar" class="w-full h-full object-cover" @error="handleAvatarError" />
          </div>
          <div v-else class="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
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
        <div class="flex items-center rounded-lg bg-gray-100 overflow-hidden">
          <div class="flex-shrink-0 flex items-center px-2">
            <button class="text-gray-500 hover:text-blue-500 p-1 transition-colors">
              <i class="fas fa-smile"></i>
            </button>
            <button class="text-gray-500 hover:text-blue-500 p-1 ml-1 transition-colors">
              <i class="fas fa-paperclip"></i>
            </button>
          </div>
          
          <div class="flex-grow flex items-end relative">
            <textarea
            v-model="newMessage" 
              ref="messageInput" 
              rows="1"
            placeholder="Nhập tin nhắn..." 
              class="w-full bg-transparent py-2 px-2 focus:outline-none text-sm resize-none overflow-hidden min-h-[36px] max-h-24"
              @keydown.enter.exact.prevent="sendMessage"
              @keydown.shift.enter="() => {}"
              @input="resizeTextarea"
              @focus="resizeTextarea"
              @paste="resizeTextarea"
            ></textarea>
          </div>
          
          <div class="flex-shrink-0 px-2">
          <button 
            @click="sendMessage" 
              class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
            :disabled="!newMessage.trim()"
              :class="{ 'opacity-50 cursor-not-allowed': !newMessage.trim() }"
          >
            <i class="fas fa-paper-plane text-sm"></i>
          </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue';
import { useChatStore } from '../../stores/chat';
import { useAuthStore } from '../../stores/auth';
import { useNotificationStore } from '../../stores/notification';
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




const emit = defineEmits(['close']);

const chatStore = useChatStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const currentUserId = computed(() => authStore.userInfo?.user_id);

const isMinimized = ref(false);
const isHidden = ref(false);
const loading = ref(true);
const messages = ref([]);
const newMessage = ref('');
const messagesContainer = ref(null);
const messageInput = ref(null);
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
  isMinimized.value = !isMinimized.value;
  
  // Nếu mở rộng, cuộn xuống tin nhắn mới nhất và focus vào input
  if (!isMinimized.value) {
    setTimeout(() => {
      scrollToBottom();
      // Focus vào input
      nextTick(() => {
        if (messageInput.value) {
          messageInput.value.focus();
        }
      });
    }, 300); // Đợi animation hoàn thành
  }
};

// Đóng popup chat
const close = () => {
  isHidden.value = true;
  
  // Reset conversation trong store
  if (chatStore.activeConversation === props.conversation.userId) {
    chatStore.resetActiveConversation();
  }
  
  // Đợi animation hoàn thành rồi emit sự kiện đóng
  setTimeout(() => {
    emit('close');
  }, 300);
};

// Lấy chữ cái đầu của tên để hiển thị avatar
const getInitials = (name) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

// Thêm hàm xử lý lỗi khi tải avatar
const handleAvatarError = (e) => {
  
  // Xóa nguồn ảnh để tránh liên tục tải lỗi
  e.target.src = '';
  
  // Lấy chữ cái đầu
  const initials = getInitials(props.conversation.displayName);
  
  // Tìm phần tử cha gần nhất
  const parent = e.target.closest('.rounded-md');
  if (parent) {
    // Ẩn thẻ img
    e.target.style.display = 'none';
    
    // Tạo phần tử mới để hiển thị initials
    const initialsDiv = document.createElement('div');
    initialsDiv.className = 'w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold';
    initialsDiv.textContent = initials;
    
    // Thêm vào parent
    parent.appendChild(initialsDiv);
    
  }
  
  // Đánh dấu avatar không hợp lệ
  props.conversation.avatar = null;
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
  } else {
    // Nếu tin nhắn cũ hơn 24 giờ, hiển thị ngày tháng và giờ
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDay = new Date(date);
    messageDay.setHours(0, 0, 0, 0);
    
    // Thời gian (giờ:phút)
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    
    if (messageDay.getTime() === today.getTime()) {
      // Nếu là hôm nay
      return `Hôm nay ${timeStr}`;
    } else if (messageDay.getTime() === yesterday.getTime()) {
      // Nếu là hôm qua
      return `Hôm qua ${timeStr}`;
    } else if (now.getFullYear() === date.getFullYear()) {
      // Nếu cùng năm, hiển thị ngày và tháng
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${day}/${month} ${timeStr}`;
    } else {
      // Nếu khác năm, hiển thị cả năm
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year} ${timeStr}`;
    }
  }
};

// Gửi tin nhắn mới
const sendMessage = async (e) => {
  // Nếu không có nội dung thì không thực hiện gì cả
  if (!newMessage.value.trim()) return;
  
  try {
    // Lưu nội dung và reset input
    const content = newMessage.value.trim();
    newMessage.value = ''; // Reset input
    
    // Reset chiều cao của textarea về mặc định
    if (messageInput.value) {
      messageInput.value.style.height = '36px';
      messageInput.value.style.overflowY = 'hidden';
    }
    
    // Focus lại vào input sau khi gửi
    nextTick(() => {
      messageInput.value?.focus();
    });
    
    // Gửi tin nhắn qua store
    const message = await chatStore.sendMessage(props.conversation.userId, content);
    
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
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    
    // Thêm thời gian chờ để đảm bảo DOM đã cập nhật hoàn toàn
    setTimeout(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
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
      
      
      // Lưu số lượng tin nhắn hiện tại
      const currentMessagesCount = chatStore.messagesByUser[props.conversation.userId]?.length || 0;
      
      // Sử dụng fetchMessages để tải thêm tin nhắn cũ và cập nhật store
      await chatStore.fetchMessages(props.conversation.userId);
      
      // Cập nhật tin nhắn từ store sau khi tải
      messages.value = [...(chatStore.messagesByUser[props.conversation.userId] || [])];
      
      // Kiểm tra xem có tin nhắn mới được thêm vào không
      const newMessagesCount = chatStore.messagesByUser[props.conversation.userId]?.length || 0;
      if (newMessagesCount > currentMessagesCount) {
        
        // Giữ nguyên vị trí scroll sau khi thêm tin nhắn
        await nextTick();
        const newScrollHeight = messagesContainer.value.scrollHeight;
        messagesContainer.value.scrollTop = newScrollHeight - oldScrollHeight;
      } else {
        hasMoreMessages.value = false;
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
    return;
  }
  
  if (!message || !message.id) {
    return;
  }
  
  
  // Kiểm tra xem tin nhắn có thuộc cuộc trò chuyện này không
  const userIdNow = props.conversation.userId;
  const myUserId = authStore.userInfo?.user_id; 
  
  // Tin nhắn thuộc cuộc trò chuyện hiện tại nếu:
  // 1. Người gửi là người dùng khác VÀ người nhận là tôi
  // 2. Người gửi là tôi VÀ người nhận là người dùng khác
  const isRelevant = 
    (message.sender === userIdNow && message.recipient === myUserId) || 
    (message.sender === myUserId && message.recipient === userIdNow);
  
  
  // Chỉ xử lý tin nhắn liên quan đến cuộc trò chuyện này
  if (isRelevant) {
    // Đánh dấu là đã đọc nếu tin nhắn từ người khác và chưa được đọc
    if (message.sender === userIdNow && !message.is_read) {
      chatStore.markMessageAsRead(message.id);
    }
  } else if (message.sender !== myUserId && message.recipient === myUserId && !isMinimized.value) {
    // Nếu là tin nhắn mới của người khác gửi cho tôi và không phải từ cuộc trò chuyện hiện tại
    // Tạo thông báo mới cho tin nhắn
    const senderInfo = chatStore.userInfoCache[message.sender];
    const senderName = senderInfo?.fullname || `Người dùng #${message.sender}`;
    
    notificationStore.createMessageNotification(message.sender, message.content, senderName);
  }
};

// Tải tin nhắn ban đầu
const loadInitialMessages = async () => {
  loading.value = true;
  try {
    
    // Sử dụng fetchMessages thay vì getMessages để cập nhật tin nhắn vào store
    await chatStore.fetchMessages(props.conversation.userId, true);
    
    // Lấy tin nhắn từ store
    messages.value = [...(chatStore.messagesByUser[props.conversation.userId] || [])];
    
    
    // Cuộn xuống tin nhắn cuối cùng
    await nextTick();
    scrollToBottom();
    
    // Đánh dấu tất cả tin nhắn là đã đọc
    const unreadMessages = messages.value.filter(
      msg => !msg.is_read && msg.sender === props.conversation.userId
    );
    
    
    for (const message of unreadMessages) {
      await chatStore.markMessageAsRead(message.id);
    }
    
  } catch (error) {
    console.error('Lỗi khi tải tin nhắn ban đầu:', error);
  } finally {
    loading.value = false;
  }
};

// Theo dõi sự thay đổi của tin nhắn trong cuộc trò chuyện hiện tại
watch(() => chatStore.messagesByUser[props.conversation.userId], (newMessages) => {
  if (!newMessages) return;
  
  
  // Lọc ra chỉ những tin nhắn thuộc cuộc trò chuyện hiện tại
  const userIdNow = props.conversation.userId;
  const myUserId = authStore.userInfo?.user_id;
  
  const relevantMessages = newMessages.filter(msg => 
    (msg.sender === userIdNow && msg.recipient === myUserId) || 
    (msg.sender === myUserId && msg.recipient === userIdNow)
  );
  
  
  // Cập nhật danh sách tin nhắn
  messages.value = [...relevantMessages];
}, { deep: true });

// Theo dõi thay đổi của messages để cuộn xuống tự động
watch(() => messages.value.length, () => {
  nextTick(() => {
    scrollToBottom();
  });
});

// Thiết lập người dùng đang chat là active conversation trong store
onMounted(async () => {
    
  // Thiết lập active conversation trong store là người dùng hiện tại đang chat
  chatStore.activeConversation = props.conversation.userId;
  
  await loadInitialMessages();
  
  // Đăng ký lắng nghe tin nhắn mới
  socketService.onMessage(handleNewMessage);
  
  // Khởi tạo chiều cao cho textarea
  nextTick(() => {
    if (messageInput.value) {
      resizeTextarea();
    }
  });
});

// Xóa event listener khi component bị hủy
onUnmounted(() => {
  
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
});

// Điều chỉnh chiều cao của textarea theo nội dung
const resizeTextarea = () => {
  if (!messageInput.value) return;
  
  // Reset chiều cao để tính toán chính xác
  messageInput.value.style.height = 'auto';
  
  // Thiết lập chiều cao tối thiểu
  const minHeight = 36; // px
  
  // Thiết lập chiều cao tối đa
  const maxHeight = 120; // px
  
  // Tính toán chiều cao dựa trên nội dung, giới hạn từ min đến max
  const scrollHeight = messageInput.value.scrollHeight;
  const newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight));
  
  // Áp dụng chiều cao mới
  messageInput.value.style.height = `${newHeight}px`;
  
  // Nếu đạt chiều cao tối đa, cho phép scrolling
  messageInput.value.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
  
  // Cuộn xuống nếu đang ở cuối danh sách tin nhắn
  if (isAtBottom()) {
    nextTick(() => {
      scrollToBottom();
    });
  }
};

// Kiểm tra nếu đang ở cuối danh sách tin nhắn
const isAtBottom = () => {
  if (!messagesContainer.value) return true;
  
  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
  // Coi như đang ở cuối nếu khoảng cách đến cuối ít hơn 100px
  return scrollHeight - scrollTop - clientHeight < 100;
};
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

/* CSS cho textarea */
textarea {
  line-height: 1.5;
  transition: height 0.1s ease-in-out;
  word-break: break-word;
  box-sizing: border-box;
}

textarea:focus {
  box-shadow: none;
  border: none;
  outline: none;
}
</style> 