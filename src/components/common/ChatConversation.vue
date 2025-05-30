<template>
  <div 
    class="flex items-center px-4 py-3 cursor-pointer transition-colors border-b border-gray-100"
    :class="{ 
      'bg-blue-50': isActive,
      'hover:bg-gray-50': !isActive && unreadCount === 0,
      'hover:bg-blue-25': !isActive && unreadCount > 0,
      'border-l-4 border-l-blue-500': isActive,
      'border-l-4 border-l-red-400': !isActive && unreadCount > 0,
      'bg-red-25': !isActive && unreadCount > 0
    }"
    @click="handleSelect"
  >
    <div class="flex-shrink-0 mr-3 relative">
      <div v-if="avatar && isValidImageUrl(avatar)" class="w-12 h-12 rounded-md overflow-hidden shadow-sm">
        <img :src="avatar" alt="Avatar" class="w-full h-full object-cover" @error="handleImageError" />
      </div>
      <div v-else class="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-md flex items-center justify-center text-white font-bold shadow-sm">
        {{ getInitials(displayName) }}
      </div>
      <div v-if="isOnline" class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      <div v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
    </div>
    
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-center">
        <h3 
          class="text-sm truncate"
          :class="[
            unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-700 font-medium'
          ]"
        >
          {{ displayName || `Người dùng #${userId}` }}
        </h3>
        <span 
          class="text-xs"
          :class="[
            unreadCount > 0 ? 'text-red-600 font-bold' : 'text-gray-500'
          ]"
        >
          {{ formattedTime }}
        </span>
      </div>
      <div class="flex items-center mt-1">
        <p 
          class="text-sm truncate flex-1" 
          :class="{ 
            'text-gray-900 font-semibold': unreadCount > 0,
            'text-gray-500': unreadCount === 0
          }"
        >
          {{ lastMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';

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
const avatarLoadError = ref(false);

// Tiêm phương thức mở chat từ ứng dụng (nếu có)
const openChat = inject('openChat', null);

// Kiểm tra URL hình ảnh có hợp lệ không
const isValidImageUrl = (url) => {
  if (!url) return false;
  
  // Kiểm tra xem url có đúng định dạng không
  try {
    // Bỏ qua các đường dẫn tương đối đến assets
    if (url.startsWith('src/assets/') || url.startsWith('/src/assets/')) {
      console.error('Đường dẫn avatar assets không tồn tại:', url);
      return false;
    }
    
    // Thử parse URL
    const parsedUrl = new URL(url);
    
    // Kiểm tra xem đuôi file có phải là ảnh không
    if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ||
        url.includes('cloudinary.com') ||
        url.includes('res.cloudinary.com')) {
      return true;
    }
    
    // Các domain image API phổ biến
    return true;
  } catch (e) {
    console.error('URL avatar không hợp lệ:', url, e);
    return false;
  }
};

// Xử lý lỗi khi tải hình ảnh
const handleImageError = (e) => {
  console.warn('Lỗi khi tải avatar:', props.avatar);
  avatarLoadError.value = true;
  
  // Gỡ bỏ thuộc tính src để tránh lỗi liên tục
  e.target.src = '';
  
  // Thay đổi DOM trực tiếp để ẩn ảnh lỗi và hiển thị chữ cái đầu
  try {
    // Tìm phần tử cha gần nhất với class 'rounded-md'
    const parent = e.target.closest('.rounded-md');
    if (parent) {
      // Ẩn thẻ img
      e.target.style.display = 'none';
      
      // Tạo div hiển thị initials
      const initialsDiv = document.createElement('div');
      initialsDiv.className = 'w-full h-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white font-bold';
      initialsDiv.textContent = getInitials(props.displayName);
      
      // Thêm vào parent
      parent.appendChild(initialsDiv);
      
      console.log(`Đã thay thế avatar lỗi cho ${props.displayName} với initials: ${getInitials(props.displayName)}`);
    }
  } catch (error) {
    console.error('Lỗi khi xử lý DOM sau lỗi avatar:', error);
  }
};

// Format thời gian
const formattedTime = computed(() => {
  if (!props.lastMessageTime) return '';
  
  const date = new Date(props.lastMessageTime);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) {
    return 'Vừa xong';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút`;
  } else if (diffInHours < 24 && date.getDate() === now.getDate()) {
    // Nếu là trong ngày hiện tại, hiển thị giờ
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } else if (diffInDays < 7) {
    // Nếu trong vòng 7 ngày, hiển thị thứ
    const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const dayOfWeek = weekdays[date.getDay()];
    return dayOfWeek;
  } else if (date.getFullYear() === now.getFullYear()) {
    // Nếu cùng năm, hiển thị ngày/tháng
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  } else {
    // Nếu khác năm, hiển thị ngày/tháng/năm
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(2); // Chỉ lấy 2 số cuối của năm
    return `${day}/${month}/${year}`;
  }
});

// Lấy chữ cái đầu của tên để hiển thị avatar
const getInitials = (name) => {
  if (!name) return '?';
  
  // Lấy chữ cái đầu tiên của tên
  return name.trim().charAt(0).toUpperCase();
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

<style scoped>
.bg-red-25 {
  background-color: #fef7f7;
}

.hover\:bg-blue-25:hover {
  background-color: #f0f9ff;
}
</style> 