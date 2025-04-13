<template>
  <div 
    :class="[
      'rounded-lg p-3 mb-2 max-w-[80%]', 
      isCurrentUser ? 'bg-blue-500 text-white self-end' : 'bg-gray-100 text-gray-800 self-start'
    ]"
  >
    <p class="text-sm mb-1">{{ content }}</p>
    <div class="flex justify-between items-center">
      <span class="text-xs" :class="isCurrentUser ? 'text-blue-100' : 'text-gray-500'">
        {{ formatTime(createdAt) }}
      </span>
      <span v-if="isCurrentUser" class="text-xs text-blue-100 ml-2 flex items-center">
        <i class="fas" :class="isRead ? 'fa-check-double' : 'fa-check'"></i>
        <span class="ml-1" v-if="isRead">Đã đọc</span>
      </span>
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
    type: String,
    required: true
  }
});

// Format thời gian tin nhắn
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  // Nếu là ngày hôm nay, chỉ hiển thị giờ và phút
  if (isToday) {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Ngày khác, hiển thị ngày tháng và giờ
  return date.toLocaleString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit',
    hour: '2-digit', 
    minute: '2-digit'
  });
};
</script> 