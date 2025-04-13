<template>
  <div 
    :class="['px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors', 
      !notification.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : '']"
    @click="handleClick"
  >
    <div class="flex items-start">
      <div class="flex-shrink-0 mt-0.5">
        <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="iconBackgroundClass">
          <i :class="[iconClass, 'text-lg']"></i>
        </div>
      </div>
      <div class="ml-3 flex-1">
        <div class="flex justify-between">
          <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
          <span class="text-xs text-gray-500">{{ formattedDate }}</span>
        </div>
        <p class="text-sm text-gray-700 mt-1">{{ notification.message }}</p>
        <div class="mt-2 flex items-center">
          <span class="text-xs px-2 py-1 rounded-full" :class="getStatusClass()">
            {{ getStatusText() }}
          </span>
          <span v-if="notification.link" class="ml-2 text-xs text-blue-600 hover:text-blue-800 flex items-center">
            <i class="fas fa-external-link-alt mr-1"></i>
            Xem chi tiết
          </span>
        </div>
      </div>
      <div v-if="!notification.is_read" class="ml-2 flex-shrink-0">
        <div class="w-2 h-2 rounded-full bg-blue-500"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useNotificationStore } from '../../stores/notification';
import { useRouter } from 'vue-router';

const props = defineProps({
  notification: {
    type: Object,
    required: true
  }
});

const notificationStore = useNotificationStore();
const router = useRouter();

// Xác định icon và màu nền dựa vào loại thông báo
const iconClass = computed(() => {
  switch (props.notification.notification_type) {
    case 'new_application':
      return 'fas fa-file-alt text-green-600';
    case 'cv_viewed':
      return 'fas fa-eye text-blue-600';
    case 'position_expired':
      return 'fas fa-calendar-times text-red-600';
    case 'application_withdrawn':
      return 'fas fa-user-times text-orange-600';
    case 'message_received':
      return 'fas fa-envelope text-purple-600';
    case 'system':
      return 'fas fa-bullhorn text-red-600';
    default:
      return 'fas fa-bell text-blue-600';
  }
});

const iconBackgroundClass = computed(() => {
  switch (props.notification.notification_type) {
    case 'new_application':
      return 'bg-green-100';
    case 'cv_viewed':
      return 'bg-blue-100';
    case 'position_expired':
      return 'bg-red-100';
    case 'application_withdrawn':
      return 'bg-orange-100';
    case 'message_received':
      return 'bg-purple-100';
    case 'system':
      return 'bg-red-100';
    default:
      return 'bg-blue-100';
  }
});

// Hàm lấy lớp CSS cho trạng thái thông báo
const getStatusClass = () => {
  switch (props.notification.notification_type) {
    case 'new_application':
      return 'bg-green-100 text-green-800';
    case 'cv_viewed':
      return 'bg-blue-100 text-blue-800';
    case 'position_expired':
      return 'bg-red-100 text-red-800';
    case 'application_withdrawn':
      return 'bg-orange-100 text-orange-800';
    case 'message_received':
      return 'bg-purple-100 text-purple-800';
    case 'system':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Hàm lấy text cho trạng thái thông báo
const getStatusText = () => {
  switch (props.notification.notification_type) {
    case 'new_application':
      return 'Hồ sơ mới';
    case 'cv_viewed':
      return 'Đã xem CV';
    case 'position_expired':
      return 'Tin hết hạn';
    case 'application_withdrawn':
      return 'Rút hồ sơ';
    case 'message_received':
      return 'Tin nhắn mới';
    case 'system':
      return 'Hệ thống';
    default:
      return 'Thông báo';
  }
};

// Format thời gian
const formattedDate = computed(() => {
  const date = new Date(props.notification.created_at);
  const now = new Date();
  const diffInMs = now - date;
  
  // Thời gian đã trôi qua (tính bằng phút)
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'Vừa xong';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInMinutes < 24 * 60) {
    return `${Math.floor(diffInMinutes / 60)} giờ trước`;
  } else if (diffInMinutes < 7 * 24 * 60) {
    return `${Math.floor(diffInMinutes / (24 * 60))} ngày trước`;
  } else {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
});

// Xử lý khi click vào thông báo
const handleClick = async () => {
  // Đánh dấu đã đọc nếu chưa đọc
  if (!props.notification.is_read) {
    await notificationStore.markAsRead(props.notification.id);
  }
  
  // Nếu có link trực tiếp, ưu tiên sử dụng
  if (props.notification.link) {
    router.push(props.notification.link);
    return;
  }
  
  // Xử lý chuyển hướng dựa vào loại thông báo nếu không có link
  switch (props.notification.notification_type) {
    case 'new_application':
      router.push(`/employer/applications?application_id=${props.notification.object_id}`);
      break;
    case 'cv_viewed':
      router.push(`/employer/applications?application_id=${props.notification.object_id}`);
      break;
    case 'position_expired':
      router.push(`/employer/posts?job_id=${props.notification.object_id}`);
      break;
    case 'application_withdrawn':
      router.push(`/employer/applications`);
      break;
    case 'message_received':
      router.push(`/employer/messages?conversation_id=${props.notification.object_id}`);
      break;
    case 'system':
      // Thông báo hệ thống có thể không có link
      if (props.notification.object_id) {
        router.push(`/employer/notifications/${props.notification.object_id}`);
      }
      break;
    default:
      // Mặc định không làm gì
      break;
  }
};
</script> 