<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="hidden md:flex md:flex-shrink-0">
      <div class="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div class="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div class="flex items-center flex-shrink-0 px-4 mb-5">
            <router-link to="/" class="flex items-center">
              <span class="text-xl font-bold text-gray-900">CareerLink</span>
            </router-link>
          </div>
          <div class="mt-2 flex-grow flex flex-col">
            <nav class="flex-1 px-2 space-y-1 bg-white">
              <router-link to="/candidate" 
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                :class="[$route.name === 'CandidateDashboard' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
                <svg class="mr-3 flex-shrink-0 h-6 w-6" 
                  :class="[$route.name === 'CandidateDashboard' ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500']"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Trang chủ
              </router-link>

              <router-link to="/candidate/applications" 
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                :class="[$route.name === 'MyApplications' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
                <svg class="mr-3 flex-shrink-0 h-6 w-6" 
                  :class="[$route.name === 'MyApplications' ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500']"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Đơn ứng tuyển
              </router-link>

              <router-link to="/job-search" 
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <svg class="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Tìm việc làm
              </router-link>

              <router-link to="/profile" 
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <svg class="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Hồ sơ cá nhân
              </router-link>
            </nav>
          </div>
        </div>
        <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <span class="inline-flex h-10 w-10 rounded-full bg-gray-500 text-white items-center justify-center">
                <span class="text-xl">{{ userInitials }}</span>
              </span>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-700 group-hover:text-gray-900">{{ userName }}</p>
              <a @click.prevent="logout" href="#" class="text-xs font-medium text-gray-500 hover:text-gray-700 cursor-pointer">
                Đăng xuất
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div class="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div class="flex items-center justify-between h-16 px-4">
        <router-link to="/" class="flex items-center">
          <span class="text-xl font-bold text-gray-900">CareerLink</span>
        </router-link>
        <button @click="isMobileMenuOpen = !isMobileMenuOpen" type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
          <span class="sr-only">Open main menu</span>
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path v-if="isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div v-if="isMobileMenuOpen" class="px-2 pt-2 pb-3 space-y-1">
        <router-link to="/candidate" class="block px-3 py-2 rounded-md text-base font-medium"
          :class="[$route.name === 'CandidateDashboard' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
          Trang chủ
        </router-link>
        <router-link to="/candidate/applications" class="block px-3 py-2 rounded-md text-base font-medium"
          :class="[$route.name === 'MyApplications' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
          Đơn ứng tuyển
        </router-link>
        <router-link to="/job-search" class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
          Tìm việc làm
        </router-link>
        <router-link to="/profile" class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
          Hồ sơ cá nhân
        </router-link>
        <a @click.prevent="logout" href="#" class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
          Đăng xuất
        </a>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <div class="md:hidden h-16"></div>
      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <div class="py-6">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isMobileMenuOpen = ref(false);

// Tên người dùng và chữ cái đầu tiên
const userName = computed(() => {
  return authStore.user?.name || 'Người dùng';
});

const userInitials = computed(() => {
  const name = userName.value;
  if (!name) return 'U';
  
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
});

// Đăng xuất
const logout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script> 