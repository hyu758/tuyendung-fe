<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <div class="px-4 py-3 bg-blue-50 border-b border-blue-100">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-blue-800">Thông báo của bạn</h3>
        <div class="flex items-center space-x-2">
          <span v-if="notificationStore.hasUnread" class="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
            {{ notificationStore.unreadCount }} chưa đọc
          </span>
          <button 
            v-if="notificationStore.hasUnread" 
            @click="markAllAsRead"
            class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
            :disabled="markingAll"
          >
            <i class="fas fa-check-double mr-1"></i>
            <span v-if="markingAll">Đang xử lý...</span>
            <span v-else>Đánh dấu đã đọc</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="notificationStore.loading && !notificationStore.hasNotifications" class="py-8 text-center">
      <i class="fas fa-circle-notch fa-spin fa-2x text-blue-500 mb-3"></i>
      <p class="text-gray-500">Đang tải thông báo...</p>
    </div>

    <div v-else-if="notificationStore.hasNotifications" class="divide-y divide-gray-100">
      <NotificationItem 
        v-for="notification in filteredNotifications" 
        :key="notification.id"
        :notification="notification"
      />

      <div v-if="notificationStore.loading" class="py-4 text-center">
        <i class="fas fa-circle-notch fa-spin text-blue-500"></i>
      </div>

      <div v-if="notificationStore.hasMore && !noMoreFiltered" class="p-4 text-center">
        <button 
          @click="loadMoreNotifications"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium"
          :disabled="notificationStore.loading"
        >
          <span v-if="notificationStore.loading">Đang tải...</span>
          <span v-else>Xem thêm</span>
        </button>
      </div>
    </div>

    <div v-else-if="currentFilter !== 'all' && !notificationStore.hasNotifications" class="py-10 text-center">
      <i class="fas fa-filter text-gray-300 text-4xl mb-3"></i>
      <p class="text-gray-500">Không có thông báo nào phù hợp với bộ lọc</p>
    </div>

    <div v-else class="py-10 text-center">
      <i class="fas fa-bell-slash text-gray-300 text-4xl mb-3"></i>
      <p class="text-gray-500">Bạn chưa có thông báo nào</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useNotificationStore } from '../../stores/notification';
import NotificationItem from './NotificationItem.vue';
import { useToast } from '../../composables/useToast';

const props = defineProps({
  filter: {
    type: String,
    default: 'all'
  }
});

const notificationStore = useNotificationStore();
const { addToast } = useToast();
const currentFilter = ref(props.filter);
const markingAll = ref(false);

// Lọc thông báo dựa trên bộ lọc hiện tại
const filteredNotifications = computed(() => {
  if (currentFilter.value === 'all') {
    return notificationStore.notifications;
  } else if (currentFilter.value === 'unread') {
    return notificationStore.notifications.filter(notification => !notification.is_read);
  } else if (currentFilter.value === 'applications') {
    return notificationStore.notifications.filter(notification => 
      ['new_application', 'cv_viewed', 'application_withdrawn'].includes(notification.notification_type)
    );
  } else if (currentFilter.value === 'system') {
    return notificationStore.notifications.filter(notification => 
      notification.notification_type === 'system'
    );
  }
  return notificationStore.notifications;
});

// Kiểm tra xem không còn thông báo nào phù hợp với bộ lọc
const noMoreFiltered = computed(() => {
  // Nếu đang hiển thị tất cả, sử dụng logic hasMore của store
  if (currentFilter.value === 'all') {
    return !notificationStore.hasMore;
  }
  
  // Nếu không còn thông báo nào trong store, không cần tải thêm
  if (!notificationStore.hasMore) return true;
  
  // Kiểm tra nếu đã lọc hết thông báo
  return filteredNotifications.value.length === 
    notificationStore.notifications.filter(n => {
      if (currentFilter.value === 'unread') return !n.is_read;
      if (currentFilter.value === 'applications') return ['new_application', 'cv_viewed', 'application_withdrawn'].includes(n.notification_type);
      if (currentFilter.value === 'system') return n.notification_type === 'system';
      return true;
    }).length;
});

// Theo dõi thay đổi trong props.filter
watch(() => props.filter, (newFilter) => {
  currentFilter.value = newFilter;
});

onMounted(async () => {
  if (!notificationStore.hasNotifications) {
    await notificationStore.fetchNotifications(true);
  }
});

const loadMoreNotifications = async () => {
  await notificationStore.fetchNotifications();
};

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
</script> 