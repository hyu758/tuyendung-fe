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
  
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  // Format giờ:phút
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;
  
  // Nếu là trong ngày hiện tại, chỉ hiển thị giờ
  if (diffInHours < 24 && date.getDate() === now.getDate()) {
    return timeStr;
  }
  
  // Nếu là trong tuần (7 ngày trở lại), hiển thị thứ + giờ
  if (diffInDays < 7) {
    const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const dayOfWeek = weekdays[date.getDay()];
    return `${dayOfWeek} ${timeStr}`;
  }
  
  // Nếu cùng năm, hiển thị ngày/tháng + giờ
  if (date.getFullYear() === now.getFullYear()) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month} ${timeStr}`;
  }
  
  // Nếu khác năm, hiển thị đầy đủ ngày/tháng/năm + giờ
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year} ${timeStr}`;
});
</script> 