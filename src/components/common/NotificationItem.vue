<template>
  <div 
    :class="['px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors', 
      !notification.is_read ? 'bg-blue-50' : '']"
    @click="handleClick"
  >
    <div class="flex items-start">
      <div class="flex-shrink-0 mt-0.5">
        <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="iconBackgroundClass">
          <i :class="[iconClass, 'text-sm']"></i>
        </div>
      </div>
      <div class="ml-3 flex-1">
        <p class="text-sm font-medium text-gray-800">{{ notification.title }}</p>
        <p class="text-sm text-gray-700">{{ notification.message }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ formattedDate }}</p>
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
import { useAuthStore } from '../../stores/auth';

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
    case 'cv_status_changed':
      return 'fas fa-file-alt text-blue-500';
    case 'job_applied':
      return 'fas fa-briefcase text-green-500';
    case 'interview_scheduled':
      return 'fas fa-calendar-alt text-purple-500';
    case 'message_received':
      return 'fas fa-envelope text-yellow-500';
    case 'cv_viewed':
      return 'fas fa-eye text-indigo-500';
    case 'system':
      return 'fas fa-bullhorn text-red-500';
    default:
      return 'fas fa-bell text-blue-500';
  }
});

const iconBackgroundClass = computed(() => {
  switch (props.notification.notification_type) {
    case 'cv_status_changed':
      return 'bg-blue-100';
    case 'job_applied':
      return 'bg-green-100';
    case 'interview_scheduled':
      return 'bg-purple-100';
    case 'message_received':
      return 'bg-yellow-100';
    case 'cv_viewed':
      return 'bg-indigo-100';
    case 'system':
      return 'bg-red-100';
    default:
      return 'bg-blue-100';
  }
});

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
  
  // Xử lý chuyển hướng dựa vào loại thông báo
  switch (props.notification.notification_type) {
    case 'cv_status_changed':
      router.push(`/my-applications?cv_id=${props.notification.object_id}`);
      break;
    case 'job_applied':
      router.push(`/my-applications`);
      break;
    case 'interview_scheduled':
      router.push(`/my-applications?cv_id=${props.notification.object_id}`);
      break;
    case 'message_received':
      // Sửa đường dẫn để đảm bảo chuyển hướng đúng
      if (useAuthStore().isCandidate) {
        router.push(`/candidate/messages?user=${props.notification.object_id}`);
      } else {
        router.push(`/employer/messages?user=${props.notification.object_id}`);
      }
      break;
    case 'cv_viewed':
      router.push(`/my-applications?cv_id=${props.notification.object_id}`);
      break;
    case 'system':
      // Thông báo hệ thống có thể không có link
      if (props.notification.object_id) {
        router.push(`/notifications/${props.notification.object_id}`);
      }
      break;
    default:
      // Mặc định không làm gì
      break;
  }
};
</script> 