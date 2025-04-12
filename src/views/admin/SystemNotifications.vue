<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-semibold text-gray-800">Quản lý thông báo hệ thống</h1>
    </div>

    <div class="mb-8">
      <form @submit.prevent="createNotification">
        <div class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Tiêu đề thông báo</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Nội dung thông báo</label>
            <textarea
              id="message"
              v-model="form.message"
              rows="4"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            ></textarea>
          </div>

          <div>
            <label for="link" class="block text-sm font-medium text-gray-700 mb-1">
              Link (tùy chọn)
              <span class="text-xs text-gray-500 ml-1">- Link sẽ được mở khi người dùng nhấp vào thông báo</span>
            </label>
            <input
              id="link"
              v-model="form.link"
              type="text"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="objectId" class="block text-sm font-medium text-gray-700 mb-1">
              ID đối tượng (tùy chọn)
              <span class="text-xs text-gray-500 ml-1">- ID của bài đăng, CV, v.v. liên quan đến thông báo</span>
            </label>
            <input
              id="objectId"
              v-model="form.objectId"
              type="text"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="resetForm"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Đặt lại
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Đang gửi...</span>
              <span v-else>Gửi thông báo</span>
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Kết quả gửi thông báo -->
    <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
      <div class="flex items-center">
        <i class="fas fa-check-circle mr-2 text-green-500"></i>
        <p>{{ successMessage }}</p>
      </div>
    </div>

    <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle mr-2 text-red-500"></i>
        <p>{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Danh sách thông báo đã gửi gần đây -->
    <div>
      <h2 class="text-lg font-medium text-gray-800 mb-4">Thông báo đã gửi gần đây</h2>
      
      <div v-if="loading && !recentNotifications.length" class="py-4 text-center">
        <i class="fas fa-circle-notch fa-spin text-blue-500"></i>
        <p class="mt-2 text-gray-500">Đang tải thông báo...</p>
      </div>

      <div v-else-if="!recentNotifications.length" class="py-4 text-center text-gray-500">
        Chưa có thông báo nào được gửi gần đây.
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="notification in recentNotifications" 
          :key="notification.id"
          class="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-medium text-gray-800">{{ notification.title }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
              <div class="flex items-center mt-2">
                <span v-if="notification.link" class="flex items-center text-xs text-blue-600 mr-3">
                  <i class="fas fa-link mr-1"></i> {{ notification.link }}
                </span>
                <span class="text-xs text-gray-500">
                  <i class="far fa-clock mr-1"></i> {{ formatDate(notification.created_at) }}
                </span>
              </div>
            </div>
            <div>
              <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Hệ thống
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNotificationStore } from '../../stores/notification';
import axios from 'axios';

const notificationStore = useNotificationStore();

// Form state
const form = ref({
  title: '',
  message: '',
  link: '',
  objectId: ''
});

// UI state
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const recentNotifications = ref([]);

// Tạo thông báo hệ thống
const createNotification = async () => {
  loading.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const result = await notificationStore.createSystemNotification(
      form.value.title,
      form.value.message,
      form.value.link || null,
      form.value.objectId || null
    );

    if (result.success) {
      successMessage.value = 'Thông báo đã được gửi thành công!';
      resetForm();
      // Cập nhật danh sách thông báo gần đây
      await fetchRecentNotifications();
    } else {
      errorMessage.value = result.error || 'Đã xảy ra lỗi khi gửi thông báo.';
    }
  } catch (error) {
    console.error('Error creating system notification:', error);
    errorMessage.value = 'Đã xảy ra lỗi khi gửi thông báo.';
  } finally {
    loading.value = false;
  }
};

// Reset form
const resetForm = () => {
  form.value = {
    title: '',
    message: '',
    link: '',
    objectId: ''
  };
};

// Lấy danh sách thông báo gần đây
const fetchRecentNotifications = async () => {
  loading.value = true;
  
  try {
    // Đây chỉ là giả định, bạn cần tạo một API endpoint thực tế để lấy thông báo hệ thống
    const response = await axios.get('/api/notifications/system/recent');
    recentNotifications.value = response.data.results || [];
  } catch (error) {
    console.error('Error fetching recent notifications:', error);
    // Dữ liệu mẫu cho phát triển
    recentNotifications.value = [
      {
        id: 1,
        title: 'Bảo trì hệ thống',
        message: 'Hệ thống sẽ bảo trì từ 22:00 ngày 15/07/2023 đến 02:00 ngày 16/07/2023',
        link: '/system-maintenance',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Tính năng mới: Matching CV',
        message: 'Chúng tôi đã cập nhật tính năng tự động gợi ý ứng viên phù hợp',
        link: '/features/cv-matching',
        created_at: new Date(Date.now() - 86400000).toISOString() // 1 ngày trước
      }
    ];
  } finally {
    loading.value = false;
  }
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  fetchRecentNotifications();
});
</script> 