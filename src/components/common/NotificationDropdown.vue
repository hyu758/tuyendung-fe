<template>
  <div class="relative" ref="dropdown">
    <button 
      @click="toggleDropdown"
      class="text-gray-500 hover:text-gray-600 relative notification-dropdown-trigger"
    >
      <i class="fas fa-bell text-xl"></i>
      <span 
        v-if="notificationStore.hasUnread" 
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
      >
        {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
      </span>
    </button>

    <!-- Notifications Dropdown -->
    <div 
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200 max-h-[400px] overflow-y-auto"
    >
      <div class="px-4 py-2 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-900">Thông báo</h3>
          <div class="flex items-center">
            <span v-if="notificationStore.hasUnread" class="text-xs font-medium text-blue-600 mr-2">
              {{ notificationStore.unreadCount }} chưa đọc
            </span>
            <button 
              v-if="notificationStore.hasUnread" 
              @click="markAllAsRead"
              class="text-xs text-blue-600 hover:text-blue-800 font-medium"
              :disabled="markingAll"
            >
              <i class="fas fa-check-double mr-1"></i>
              <span v-if="markingAll">Đang xử lý...</span>
              <span v-else>Đánh dấu đã đọc</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="notificationStore.loading" class="py-4 text-center">
        <i class="fas fa-circle-notch fa-spin text-blue-500"></i>
      </div>

      <div v-else-if="notificationStore.hasNotifications">
        <NotificationItem 
          v-for="notification in notificationStore.notifications" 
          :key="notification.id"
          :notification="notification"
        />

        <div v-if="notificationStore.hasMore" class="px-4 py-2 text-center">
          <button 
            @click="loadMoreNotifications"
            class="text-xs text-blue-600 hover:text-blue-800"
            :disabled="notificationStore.loading"
          >
            <span v-if="notificationStore.loading">Đang tải...</span>
            <span v-else>Xem thêm</span>
          </button>
        </div>
      </div>

      <div v-else class="py-6 text-center">
        <i class="fas fa-bell-slash text-gray-300 text-2xl mb-2"></i>
        <p class="text-sm text-gray-500">Bạn chưa có thông báo nào</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useNotificationStore } from '../../stores/notification';
import NotificationItem from './NotificationItem.vue';
import socketService from '../../services/socketService';
import { useToast } from '../../composables/useToast';

const dropdown = ref(null);
const isOpen = ref(false);
const notificationStore = useNotificationStore();
const { addToast } = useToast();
const markingAll = ref(false);

// Toggle dropdown visibility
const toggleDropdown = async () => {
  isOpen.value = !isOpen.value;
  
  // Cập nhật trạng thái dropdown trong store
  notificationStore.setDropdownState(isOpen.value);
  
  // Fetch notifications when opening dropdown if not already loaded
  if (isOpen.value && !notificationStore.hasNotifications) {
    await notificationStore.fetchNotifications(true);
  }
};

// Load more notifications
const loadMoreNotifications = async () => {
  await notificationStore.fetchNotifications();
};

// Đánh dấu tất cả thông báo đã đọc
const markAllAsRead = async () => {
  try {
    markingAll.value = true;
    const result = await notificationStore.markAllAsRead();
    
    if (result.success) {
      addToast({
        type: 'success',
        message: 'Đã đánh dấu tất cả thông báo là đã đọc'
      });
    } else {
      addToast({
        type: 'error',
        message: result.error || 'Không thể đánh dấu thông báo đã đọc'
      });
    }
  } catch (error) {
    console.error('Error marking all as read:', error);
    addToast({
      type: 'error',
      message: 'Đã xảy ra lỗi khi đánh dấu thông báo đã đọc'
    });
  } finally {
    markingAll.value = false;
  }
};

// Handle click outside to close dropdown
const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false;
    notificationStore.setDropdownState(false);
  }
};

// Watch for changes to isOpen
watch(isOpen, (newValue) => {
  notificationStore.setDropdownState(newValue);
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
  // Khởi tạo kết nối WebSocket
  socketService.init();
  
  // Lấy số lượng thông báo chưa đọc khi component được mounted
  notificationStore.fetchUnreadCount();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script> 