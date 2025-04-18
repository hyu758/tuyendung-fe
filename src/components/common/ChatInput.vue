<template>
  <div class="border-t border-gray-100 py-3 px-4 bg-white">
    <form @submit.prevent="sendMessage" class="flex items-end gap-2">
      <div class="relative flex-1">
        <textarea
          v-model="messageContent"
          placeholder="Nhập tin nhắn..."
          class="w-full border-gray-200 border rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none bg-gray-50"
          :class="{ 'h-10': lineCount === 1, 'h-20': lineCount > 1 }"
          @keydown.enter.prevent="onEnterPress"
          @input="updateLineCount"
          ref="textarea"
        ></textarea>
      </div>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-11 h-11 flex items-center justify-center shadow-sm transition-colors"
        :class="{'opacity-50 cursor-not-allowed': !canSend, 'hover:shadow-md': canSend}"
        :disabled="!canSend"
      >
        <i class="fab fa-telegram-plane"></i>
      </button>
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
const socketConnected = ref(false);

const canSend = computed(() => {
  return messageContent.value.trim().length > 0 && !props.loading;
});

const sendMessage = () => {
  if (!canSend.value) return;
  
  emit('send-message', messageContent.value.trim());
  messageContent.value = '';
  lineCount.value = 1;
  
  // Focus lại vào textarea sau khi gửi
  setTimeout(() => {
    textarea.value.focus();
  }, 10);
};

const onEnterPress = (event) => {
  // Kiểm tra nếu người dùng nhấn Shift + Enter thì cho phép xuống dòng
  if (!event.shiftKey) {
    sendMessage();
  }
};

const updateLineCount = () => {
  // Đếm số dòng trong textarea
  const lines = messageContent.value.split('\n');
  lineCount.value = Math.min(lines.length, 5); // Giới hạn tối đa 5 dòng
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
</script>