<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-6 border-b">
          <h1 class="text-2xl font-bold text-gray-800">Trung tâm tin nhắn</h1>
          <p class="text-gray-600 mt-1">
            Quản lý và trả lời tin nhắn của ứng viên
          </p>
        </div>
        
        <div class="h-[calc(100vh-200px)]">
          <chat-container />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import ChatContainer from '../chat/ChatContainer.vue';
import { useChatStore } from '../../stores/chat';

const chatStore = useChatStore();

onMounted(() => {
  // Reset store để tránh xung đột dữ liệu từ các màn hình khác
  chatStore.resetStore();
});
</script> 