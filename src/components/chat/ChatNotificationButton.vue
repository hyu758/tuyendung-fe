<template>
  <router-link 
    :to="to" 
    class="chat-button relative flex items-center group"
    :class="[
      buttonClass,
      unreadCount > 0 ? 'has-unread' : '',
      showLabel ? 'space-x-2' : ''
    ]"
    :title="unreadCount > 0 ? `Bạn có ${unreadCount} tin nhắn chưa đọc` : 'Tin nhắn'"
  >
    <div 
      class="icon-container flex items-center justify-center relative"
      :class="[
        unreadCount > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-100 border-gray-200',
        iconClass
      ]"
    >
      <i 
        :class="[
          `fas fa-${icon}`,
          unreadCount > 0 ? 'text-red-500' : 'text-gray-600',
          'group-hover:text-blue-600 transition-colors duration-150',
          size === 'lg' ? 'text-xl' : size === '1x' ? 'text-base' : 'text-base'
        ]"
      ></i>
      <transition name="pulse">
        <span 
          v-if="unreadCount > 0" 
          class="badge absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border border-white animate-pulse"
          :class="badgeClass"
        >
          {{ unreadCount > maxBadgeCount ? maxBadgeCount + '+' : unreadCount }}
        </span>
      </transition>
    </div>
    <span v-if="showLabel" class="label text-sm font-medium group-hover:text-blue-600 transition-colors duration-150">
      {{ label || 'Tin nhắn' }}
    </span>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  to: {
    type: [String, Object],
    required: true
  },
  icon: {
    type: String,
    default: 'comment-dots'
  },
  unreadCount: {
    type: Number,
    default: 0
  },
  label: {
    type: String,
    default: 'Tin nhắn'
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'lg'
  },
  maxBadgeCount: {
    type: Number,
    default: 9
  },
  buttonClass: {
    type: String,
    default: 'text-gray-600 hover:text-blue-600 transition duration-150'
  },
  iconClass: {
    type: String,
    default: 'w-10 h-10 rounded-full hover:bg-blue-50 border group-hover:border-blue-200 transition duration-150'
  },
  badgeClass: {
    type: String,
    default: 'h-5 w-5'
  }
});
</script>

<style scoped>
.badge {
  transition: all 0.3s ease;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.pulse-enter-active, .pulse-leave-active {
  transition: all 0.5s;
}

.pulse-enter-from, .pulse-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style> 