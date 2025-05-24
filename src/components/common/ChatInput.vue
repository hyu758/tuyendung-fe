<template>
  <div class="border-t border-gray-100 py-3 px-4 bg-white shadow-lg">
    <form @submit.prevent="sendMessage" class="flex items-end gap-2 max-w-4xl mx-auto">
      <!-- Container cho textarea với design hiện đại -->
      <div class="relative flex-1">
        <!-- Textarea với design đẹp hơn -->
        <textarea
          v-model="messageContent"
          placeholder="Nhập tin nhắn của bạn..."
          class="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-0 focus:border-blue-400 resize-none bg-white transition-all duration-200 ease-in-out shadow-sm hover:shadow-md text-gray-700 placeholder-gray-400"
          :class="{ 
            'h-11': lineCount === 1, 
            'h-20': lineCount === 2,
            'h-28': lineCount === 3,
            'h-36': lineCount >= 4
          }"
          @keydown.enter.prevent="onEnterPress"
          @input="updateLineCount"
          @focus="onFocus"
          @blur="onBlur"
          ref="textarea"
          :disabled="props.loading"
          rows="1"
        ></textarea>
        
        <!-- Indicator cho Shift+Enter - chỉ hiện trên desktop -->
        <div 
          v-if="isFocused && messageContent.length > 0"
          class="absolute bottom-2 right-2 text-xs text-gray-400 hidden lg:block"
        >
          <span class="bg-gray-100 px-2 py-1 rounded-full">
            <i class="fas fa-level-down-alt mr-1"></i>
            Shift + Enter để xuống dòng
          </span>
        </div>
        
        <!-- Character counter -->
        <div 
          v-if="messageContent.length > 500"
          class="absolute top-2 right-2 text-xs"
          :class="messageContent.length > 1000 ? 'text-red-500' : 'text-orange-500'"
        >
          {{ messageContent.length }}/1000
        </div>
      </div>
      
      <!-- Nút gửi với alignment chuẩn -->
      <div class="relative flex-shrink-0">
      <button
        type="submit"
          class="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg transition-all duration-200 ease-in-out transform"
          :class="{
            'opacity-50 cursor-not-allowed': !canSend,
            'hover:scale-105 hover:shadow-xl active:scale-95': canSend,
            'animate-pulse': props.loading
          }"
        :disabled="!canSend"
          :title="canSend ? 'Gửi tin nhắn' : 'Nhập tin nhắn để gửi'"
        >
          <!-- Loading spinner -->
          <div v-if="props.loading" class="animate-spin">
            <i class="fas fa-circle-notch text-base"></i>
          </div>
          
          <!-- Send icon với animation -->
          <div v-else class="relative">
            <i 
              class="fas fa-paper-plane text-base transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              :class="{ 'text-blue-200': !canSend }"
            ></i>
          </div>
          
          <!-- Ripple effect on click -->
          <div class="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
      </button>
        
        <!-- Connection status indicator -->
        <div 
          v-if="!socketConnected"
          class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white flex items-center justify-center"
          title="Mất kết nối mạng"
        >
          <i class="fas fa-exclamation text-xs text-white"></i>
        </div>
      </div>
      
      <!-- Typing indicator (có thể thêm sau) -->
      <!-- <div v-if="isTyping" class="absolute bottom-16 left-4 bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600">
        <i class="fas fa-circle text-xs mr-1 animate-pulse"></i>
        Đang nhập...
      </div> -->
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import socketService from '../../services/socketService';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['send-message']);

const messageContent = ref('');
const textarea = ref(null);
const lineCount = ref(1);
const socketConnected = ref(true);
const isFocused = ref(false);

const canSend = computed(() => {
  return messageContent.value.trim().length > 0 && !props.loading && messageContent.value.length <= 1000;
});

const sendMessage = () => {
  if (!canSend.value) return;
  
  emit('send-message', messageContent.value.trim());
  messageContent.value = '';
  lineCount.value = 1;
  
  // Focus lại vào textarea sau khi gửi
  setTimeout(() => {
    if (textarea.value) {
    textarea.value.focus();
    }
  }, 10);
};

const onEnterPress = (event) => {
  // Kiểm tra nếu người dùng nhấn Shift + Enter thì cho phép xuống dòng
  if (!event.shiftKey) {
    sendMessage();
  }
};

const onFocus = () => {
  isFocused.value = true;
};

const onBlur = () => {
  isFocused.value = false;
};

const updateLineCount = () => {
  // Đếm số dòng trong textarea
  const lines = messageContent.value.split('\n');
  lineCount.value = Math.min(lines.length, 6); // Giới hạn tối đa 6 dòng
};

// Kiểm tra kết nối WebSocket
const checkSocketConnection = () => {
  const status = socketService.connected;
  socketConnected.value = status;
  
  console.log(`Trạng thái kết nối WebSocket: ${status ? 'Đã kết nối' : 'Đã ngắt kết nối'}`);
  
  if (!status) {
    // Thử kết nối lại
    console.log('Đang thử kết nối lại WebSocket...');
    socketService.init();
    
    // Gửi tin nhắn kiểm tra
    setTimeout(() => {
      if (socketService.connected) {
        console.log('Kết nối WebSocket thành công, đang gửi tin nhắn ping...');
        socketService.sendMessage({
          type: 'ping',
          data: {
            timestamp: new Date().toISOString()
          }
        });
      } else {
        console.log('Không thể kết nối WebSocket');
      }
    }, 1000);
  } else {
    // Gửi tin nhắn kiểm tra
    socketService.sendMessage({
      type: 'ping',
      data: {
        timestamp: new Date().toISOString()
      }
    });
  }
};

// Tự động resize textarea khi nội dung thay đổi
watch(messageContent, () => {
  updateLineCount();
});

// Kiểm tra kết nối định kỳ
setInterval(checkSocketConnection, 30000); // 30 giây một lần
</script>

<style scoped>
/* Custom scrollbar cho textarea */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animation cho button */
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.6;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.ripple-effect {
  animation: ripple 0.6s linear;
}

/* Focus animation */
textarea:focus {
  transform: translateY(-1px);
}

/* Mobile optimizations */
@media (max-width: 640px) {
  textarea {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}
</style>