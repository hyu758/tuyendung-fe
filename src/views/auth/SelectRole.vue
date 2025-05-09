<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-xl w-full space-y-8 bg-white rounded-2xl shadow-xl p-8 sm:p-10 transition-all duration-300">
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <img src="../../assets/logo.png" alt="JobHub Logo" class="h-20 mx-auto" />
        </div>
        
        <h2 class="text-3xl font-extrabold text-indigo-900 tracking-tight">
          Chọn vai trò của bạn
        </h2>
        <p class="mt-3 text-base text-gray-600">
          Vui lòng cho chúng tôi biết bạn muốn sử dụng <span class="text-indigo-600 font-medium">JobHub</span> với vai trò nào.
        </p>
      </div>

      <BaseAlert
        v-if="error"
        variant="error"
        :message="error"
        :show="!!error"
        class="mt-4"
      />

      <div class="mt-8 grid grid-cols-1 gap-6">
        <div 
          class="group relative rounded-xl shadow-md bg-white overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
          :class="{'opacity-70 pointer-events-none': loading && loading !== 'employer'}"
          @click="selectRole('employer')"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div class="relative p-6 flex items-center">
            <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4 group-hover:bg-white transition-colors duration-300">
              <svg class="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300">Nhà tuyển dụng</h3>
              <p class="text-gray-600 group-hover:text-blue-100 transition-colors duration-300">Đăng tin tuyển dụng và tìm kiếm ứng viên phù hợp</p>
            </div>
            <div class="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            
            <div v-if="loading === 'employer'" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
              <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>

        <div 
          class="group relative rounded-xl shadow-md bg-white overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
          :class="{'opacity-70 pointer-events-none': loading && loading !== 'candidate'}"
          @click="selectRole('candidate')"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div class="relative p-6 flex items-center">
            <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mr-4 group-hover:bg-white transition-colors duration-300">
              <svg class="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300">Người tìm việc</h3>
              <p class="text-gray-600 group-hover:text-green-100 transition-colors duration-300">Tìm kiếm công việc và cơ hội nghề nghiệp phù hợp</p>
            </div>
            <div class="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            
            <div v-if="loading === 'candidate'" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
              <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-4 text-center text-sm text-gray-500">
        <p>Bạn có thể thay đổi vai trò của mình sau bằng cách liên hệ với quản trị viên hệ thống</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import BaseButton from '../../components/common/BaseButton.vue';
import BaseAlert from '../../components/common/BaseAlert.vue';
import axios from 'axios';

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(null);
const error = ref(null);

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
  } else if (authStore.userRole && authStore.userRole !== 'none') {
    router.push('/');
  }
});

async function selectRole(role) {
  loading.value = role;
  error.value = null;
  try {
    console.log('[SelectRole] Đang đặt role thành:', role);
    const response = await axios.post('/api/set-role/', { role });

    if (response.data.status === 200) {
      
      localStorage.setItem('notification', JSON.stringify({
        type: 'success',
        message: 'Cập nhật vai trò thành công',
        show: true
      }));
      
      try {
        await authStore.refreshToken();
        
        if (authStore.token) {
          await authStore.updateUserFromToken();
          
          setTimeout(() => {
            router.push('/');
          }, 500);
        } else {
          throw new Error('Refresh token không trả về access token mới');
        }
      } catch (tokenError) {
        console.error('[SelectRole] Lỗi khi refresh token:', tokenError);
        
        authStore.setUserRole(role);
        
        localStorage.setItem('notification', JSON.stringify({
          type: 'warning',
          message: 'Đã cập nhật vai trò, nhưng có lỗi khi làm mới phiên đăng nhập. Bạn có thể cần đăng nhập lại.',
          show: true
        }));
        
        setTimeout(() => {
          router.push('/');
        }, 500);
      }
    } else {
      throw new Error('Không thể cập nhật vai trò');
    }
  } catch (err) {
    console.error("Error setting role:", err);
    error.value = err.response?.data?.detail || 'Có lỗi xảy ra khi chọn vai trò. Vui lòng thử lại.';
  } finally {
    loading.value = null;
  }
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style> 