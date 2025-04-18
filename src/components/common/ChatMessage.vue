<template>
  <div :class="['flex', isCurrentUser ? 'justify-end' : 'justify-start', 'mb-3']">
    <div
      :class="[
        'max-w-[70%] rounded-2xl px-4 py-2.5 break-words shadow-sm',
        isCurrentUser 
          ? 'bg-blue-500 text-white rounded-br-none' 
          : 'bg-gray-100 text-gray-800 rounded-bl-none'
      ]"
    >
      <p class="whitespace-pre-wrap text-[15px]">{{ content }}</p>
      <div :class="['text-xs mt-1 flex justify-end items-center', isCurrentUser ? 'text-blue-100' : 'text-gray-500']">
        {{ formattedTime }}
        <span v-if="isCurrentUser" class="ml-1">
          <i v-if="isRead" class="fas fa-check-double"></i>
          <i v-else class="fas fa-check"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  isCurrentUser: {
    type: Boolean,
    default: false
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: [String, Date],
    required: true
  }
});

// Định dạng thời gian
const formattedTime = computed(() => {
  const date = new Date(props.createdAt);
  
  // Kiểm tra nếu thời gian hợp lệ
  if (isNaN(date.getTime())) {
    return '';
  }
  
  // Format thời gian theo giờ:phút
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
});
</script> 