<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <div class="px-4 py-3 bg-blue-50 border-b border-blue-100">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-blue-800">Thông báo của bạn</h3>
        <span v-if="notificationStore.hasUnread" class="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
          {{ notificationStore.unreadCount }} chưa đọc
        </span>
      </div>
    </div>

    <div v-if="notificationStore.loading && !notificationStore.hasNotifications" class="py-8 text-center">
      <i class="fas fa-circle-notch fa-spin fa-2x text-blue-500 mb-3"></i>
      <p class="text-gray-500">Đang tải thông báo...</p>
    </div>

    <div v-else-if="notificationStore.hasNotifications" class="divide-y divide-gray-100">
      <NotificationItem 
        v-for="notification in notificationStore.notifications" 
        :key="notification.id"
        :notification="notification"
      />

      <div v-if="notificationStore.loading" class="py-4 text-center">
        <i class="fas fa-circle-notch fa-spin text-blue-500"></i>
      </div>

      <div v-if="notificationStore.hasMore" class="p-4 text-center">
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

    <div v-else class="py-10 text-center">
      <i class="fas fa-bell-slash text-gray-300 text-4xl mb-3"></i>
      <p class="text-gray-500">Bạn chưa có thông báo nào</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useNotificationStore } from '../../stores/notification';
import NotificationItem from '../common/NotificationItem.vue';

const notificationStore = useNotificationStore();

onMounted(async () => {
  if (!notificationStore.hasNotifications) {
    await notificationStore.fetchNotifications(true);
  }
});

const loadMoreNotifications = async () => {
  await notificationStore.fetchNotifications();
};
</script> 