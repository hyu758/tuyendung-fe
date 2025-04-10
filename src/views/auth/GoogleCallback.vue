<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="text-center">
      <p class="text-lg text-gray-700 mb-4">Đang xử lý đăng nhập...</p>
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p v-if="error" class="mt-4 text-red-600">Lỗi: {{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const error = ref(null);

onMounted(async () => {
  console.log('GoogleCallback: Component Mounted');
  const { query } = route;
  console.log('GoogleCallback: Query Params:', query);
  
  if (query.error) {
    error.value = 'Xác thực Google thất bại: ' + query.error;
    console.error('GoogleCallback: Google Auth Error:', query.error);
    setTimeout(() => router.push('/login'), 3000);
    return;
  }

  const accessToken = query.access_token;
  const refreshToken = query.refresh_token;
  const userRole = query.role;
  const isActive = query.is_active === 'true';
  const isBanned = query.is_banned === 'true';

  console.log('GoogleCallback: Extracted Tokens:', { accessToken, refreshToken, userRole, isActive, isBanned });

  if (accessToken && refreshToken) {
    try {
      console.log('GoogleCallback: Saving tokens to localStorage...');
      // Lưu token
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      console.log('GoogleCallback: Tokens saved.');

      console.log('GoogleCallback: Updating auth store...');
      // Cập nhật store cơ bản
      authStore.token = accessToken;
      authStore.isAuthenticated = true;
      authStore.userRole = userRole; // Vẫn lưu role (có thể là null)
      console.log('GoogleCallback: Auth store updated.', authStore.isAuthenticated, authStore.userRole);
      
      // Kiểm tra trạng thái 
      if (!isActive) {
        error.value = 'Tài khoản của bạn đã bị vô hiệu hóa.';
        console.error('GoogleCallback: Account inactive.');
        authStore.logout(); 
        setTimeout(() => router.push('/login'), 3000);
        return; 
      }
      if (isBanned) {
        error.value = 'Tài khoản của bạn đã bị khóa.';
        console.error('GoogleCallback: Account banned.');
        authStore.logout(); 
        setTimeout(() => router.push('/login'), 3000);
        return; 
      }

      // Luôn redirect đến trang chủ sau khi xử lý
      console.log('GoogleCallback: Processing complete. Redirecting to / ...');
      router.push('/'); 
      console.log('GoogleCallback: Redirect command issued.');

    } catch (e) {
        console.error('GoogleCallback: Error during token processing or redirect:', e);
        error.value = '';
        setTimeout(() => router.push('/login'), 3000);
    }
  } else {
    error.value = 'Không nhận được đủ thông tin xác thực từ Google.';
    console.error('GoogleCallback: Missing auth data from query.', query);
    setTimeout(() => router.push('/login'), 3000);
  }
});
</script> 