<template>
  <div 
    class="flex items-center p-3 border-b hover:bg-gray-50 cursor-pointer"
    :class="{ 'bg-blue-50': isActive }"
    @click="$emit('select')"
  >
    <div class="relative">
      <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
        <template v-if="avatar">
          <img :src="avatar" alt="Avatar" class="w-full h-full object-cover" />
        </template>
        <template v-else>
          <i class="fas fa-user text-gray-500 text-xl"></i>
        </template>
      </div>
      <div v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </div>
      <div v-if="isOnline" class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
    </div>
    
    <div class="ml-3 flex-1 overflow-hidden">
      <div class="flex justify-between items-center">
        <h3 class="font-medium text-gray-800 truncate">{{ displayName }}</h3>
        <span v-if="lastMessageTime" class="text-xs text-gray-500">{{ formatTime(lastMessageTime) }}</span>
      </div>
      <p class="text-sm text-gray-500 truncate" :class="{ 'font-semibold': hasUnread }">
        {{ lastMessage || 'Không có tin nhắn' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  displayName: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
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
  }
});

const hasUnread = computed(() => props.unreadCount > 0);

defineEmits(['select']);

// Format thời gian tin nhắn cuối cùng
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  // Nếu là ngày hôm nay, chỉ hiển thị giờ và phút
  if (isToday) {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Nếu là tuần này, hiển thị tên ngày
  const dayDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (dayDiff < 7) {
    return date.toLocaleDateString('vi-VN', { weekday: 'short' });
  }
  
  // Ngày xa hơn, hiển thị ngày tháng
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};
</script> 