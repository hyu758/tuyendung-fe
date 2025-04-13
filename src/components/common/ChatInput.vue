<template>
  <div class="border-t py-3 px-4">
    <form @submit.prevent="sendMessage" class="flex items-end gap-2">
      <div class="relative flex-1">
        <textarea
          v-model="messageContent"
          placeholder="Nhập tin nhắn..."
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          :class="{ 'h-10': lineCount === 1, 'h-20': lineCount > 1 }"
          @keydown.enter.prevent="onEnterPress"
          @input="updateLineCount"
          ref="textarea"
        ></textarea>
      </div>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center"
        :disabled="!canSend"
      >
        <i class="fas fa-paper-plane"></i>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

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

// Tự động resize textarea khi nội dung thay đổi
watch(messageContent, () => {
  updateLineCount();
});
</script>