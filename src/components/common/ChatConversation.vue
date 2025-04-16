<template>
  <div 
    class="flex items-center p-3 border-b cursor-pointer transition-colors duration-150"
    :class="{ 
      'bg-blue-50': isActive,
      'hover:bg-gray-50': !isActive,
      'border-l-4 border-l-blue-500': isActive
    }"
    @click="handleSelect"
  >
    <div class="flex-shrink-0 mr-3 relative">
      <div v-if="avatar" class="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
        <img :src="avatar" alt="Avatar" class="w-full h-full object-cover" />
      </div>
      <div v-else class="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
        {{ getInitials(displayName) }}
      </div>
      <div v-if="isOnline" class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
    </div>
    
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-center">
        <h3 class="text-sm font-medium text-gray-900 truncate">{{ displayName }}</h3>
        <span class="text-xs text-gray-500">{{ formattedTime }}</span>
      </div>
      <div class="flex items-center mt-1">
        <p 
          class="text-sm truncate flex-1" 
          :class="{ 
            'text-gray-600 font-medium': !isRead && unreadCount > 0,
            'text-gray-500': isRead || unreadCount === 0
          }"
        >
          {{ lastMessage }}
        </p>
        <span 
          v-if="unreadCount > 0"
          class="ml-2 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center"
        >
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';

const props = defineProps({
  displayName: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageTime: {
    type: String,
    default: ''
  },
  unreadCount: {
    type: Number,
    default: 0
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isRead: {
    type: Boolean,
    default: true
  },
  userId: {
    type: [Number, String],
    required: true
  },
  openInPopup: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['select']);

// Tiêm phương thức mở chat từ ứng dụng (nếu có)
const openChat = inject('openChat', null);

// Format thời gian
const formattedTime = computed(() => {
  if (!props.lastMessageTime) return '';
  
  const date = new Date(props.lastMessageTime);
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
    return `${Math.floor(diffInMinutes / (24 * 60))} ngày`;
  } else {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }
});

// Lấy chữ cái đầu của tên để hiển thị avatar
const getInitials = (name) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

// Xử lý khi chọn cuộc trò chuyện
const handleSelect = () => {
  if (props.openInPopup && openChat) {
    // Mở cửa sổ chat popup nếu có
    openChat(props.userId);
  } else {
    // Emit sự kiện để component cha xử lý
    emit('select');
  }
};
</script> 