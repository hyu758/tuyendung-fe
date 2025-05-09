<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Chọn vai trò của bạn
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Vui lòng cho chúng tôi biết bạn muốn sử dụng JobHub với vai trò nào.
        </p>
      </div>

      <BaseAlert
        v-if="error"
        variant="error"
        :message="error"
        :show="!!error"
        class="mt-4"
      />

      <div class="mt-8 space-y-6">
        <BaseButton
          @click="selectRole('employer')"
          :loading="loading === 'employer'"
          :disabled="!!loading"
          variant="primary"
          size="lg"
          class="w-full relative flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
        >
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg class="h-6 w-6 text-indigo-300 group-hover:text-indigo-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          Tôi là Nhà tuyển dụng
        </BaseButton>

        <BaseButton
          @click="selectRole('candidate')"
          :loading="loading === 'candidate'"
          :disabled="!!loading"
          variant="secondary"
          size="lg"
           class="w-full relative flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
        >
           <span class="absolute left-0 inset-y-0 flex items-center pl-3">
             <svg class="h-6 w-6 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
          </span>
          Tôi là Người tìm việc
        </BaseButton>
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
    await axios.post('/api/set-role/', { role });

    authStore.userRole = role;
    
    await authStore.updateUserFromToken();

    router.push('/');

  } catch (err) {
    console.error("Error setting role:", err);
    error.value = err.response?.data?.detail || 'Có lỗi xảy ra khi chọn vai trò. Vui lòng thử lại.';
  } finally {
    loading.value = null;
  }
}
</script> 