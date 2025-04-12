<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Thông báo</h1>
      <p class="text-gray-600 mt-1">Quản lý tất cả thông báo của bạn</p>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-800">Tất cả thông báo</h2>
        <div class="flex items-center">
          <button 
            v-if="notificationStore.hasUnread" 
            @click="markAllAsRead"
            class="text-sm text-blue-600 hover:text-blue-800 font-medium mr-4"
          >
            Đánh dấu tất cả đã đọc
          </button>
          <div class="relative">
            <select 
              v-model="filter" 
              class="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả thông báo</option>
              <option value="unread">Chưa đọc</option>
              <option value="new_application">Đơn ứng tuyển mới</option>
              <option value="cv_viewed">CV đã xem</option>
              <option value="position_expired">Vị trí hết hạn</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
              <i class="fas fa-chevron-down text-xs"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="divide-y divide-gray-100">
        <div v-if="notificationStore.loading && !notificationStore.hasNotifications" class="py-10 text-center">
          <i class="fas fa-circle-notch fa-spin fa-2x text-blue-500 mb-3"></i>
          <p class="text-gray-500">Đang tải thông báo...</p>
        </div>

        <div v-else-if="filteredNotifications.length === 0" class="py-10 text-center">
          <i class="fas fa-bell-slash text-gray-300 text-4xl mb-3"></i>
          <p class="text-gray-500">Không tìm thấy thông báo nào</p>
        </div>

        <template v-else>
          <NotificationItem 
            v-for="notification in filteredNotifications" 
            :key="notification.id"
            :notification="notification"
          />

          <div v-if="notificationStore.loading" class="py-6 text-center">
            <i class="fas fa-circle-notch fa-spin text-blue-500"></i>
            <p class="text-sm text-gray-500 mt-2">Đang tải thêm thông báo...</p>
          </div>

          <div v-if="notificationStore.hasMore && !notificationStore.loading" class="p-4 text-center">
            <button 
              @click="loadMoreNotifications"
              class="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-md text-sm transition-colors"
            >
              Tải thêm thông báo
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import NotificationItem from '../../components/employer/NotificationItem.vue';
import { useNotificationStore } from '../../stores/notification';

const notificationStore = useNotificationStore();
const filter = ref('all');

// Lọc thông báo theo điều kiện
const filteredNotifications = computed(() => {
  if (filter.value === 'all') {
    return notificationStore.notifications;
  } else if (filter.value === 'unread') {
    return notificationStore.notifications.filter(notification => !notification.is_read);
  } else {
    return notificationStore.notifications.filter(notification => 
      notification.notification_type === filter.value
    );
  }
});

// Tải thêm thông báo
const loadMoreNotifications = async () => {
  await notificationStore.fetchNotifications();
};

// Đánh dấu tất cả đã đọc
const markAllAsRead = async () => {
  await notificationStore.markAllAsRead();
};

onMounted(async () => {
  // Tải thông báo khi component được mount
  await notificationStore.fetchNotifications(true);
});
</script> 