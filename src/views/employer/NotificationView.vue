<template>
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Thông báo</h1>
          <p class="mt-2 text-sm text-gray-600">Xem các thông báo và cập nhật từ hệ thống</p>
        </div>
  
        <!-- Container cho NotificationList -->
        <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-0">
            <!-- Sidebar - Bộ lọc thông báo -->
            <div class="lg:col-span-1 border-r border-gray-200">
              <div class="p-4">
                <h3 class="text-lg font-medium text-gray-800 mb-4">Lọc thông báo</h3>
                
                <div class="space-y-2">
                  <button 
                    @click="filterNotifications('all')" 
                    class="w-full text-left px-3 py-2 rounded-md transition-colors"
                    :class="activeFilter === 'all' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'"
                  >
                    <i class="fas fa-bell mr-2"></i>
                    Tất cả thông báo
                    <span class="ml-2 bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {{ notificationStore.total }}
                    </span>
                  </button>
                  
                  <button 
                    @click="filterNotifications('unread')" 
                    class="w-full text-left px-3 py-2 rounded-md transition-colors"
                    :class="activeFilter === 'unread' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'"
                  >
                    <i class="fas fa-envelope mr-2"></i>
                    Chưa đọc
                    <span v-if="notificationStore.unreadCount > 0" class="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {{ notificationStore.unreadCount }}
                    </span>
                  </button>
                </div>
                
                <div class="mt-6">
                  <button 
                    @click="markAllAsRead"
                    class="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                    :disabled="!notificationStore.hasUnread || markingAll"
                  >
                    <i class="fas fa-check-double mr-2"></i>
                    <span v-if="markingAll">Đang xử lý...</span>
                    <span v-else>Đánh dấu tất cả đã đọc</span>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Danh sách thông báo -->
            <div class="lg:col-span-3">
              <NotificationList :filter="activeFilter" />
            </div>
          </div>
        </div>

        <!-- Hiển thị ở mobile -->
        <div class="lg:hidden flex overflow-x-auto pb-2 mb-4 -mt-2 space-x-2">
          <button 
            @click="filterNotifications('all')" 
            :class="[
              'whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              activeFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <i class="fas fa-bell mr-1"></i>
            Tất cả
          </button>
          
          <button 
            @click="filterNotifications('unread')" 
            :class="[
              'whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              activeFilter === 'unread' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <i class="fas fa-envelope mr-1"></i>
            Chưa đọc
            <span v-if="notificationStore.unreadCount > 0" class="ml-1 bg-blue-500 text-white text-xs w-4 h-4 inline-flex items-center justify-center rounded-full">
              {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
            </span>
          </button>
          
          <button 
            @click="filterNotifications('applications')" 
            :class="[
              'whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              activeFilter === 'applications' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <i class="fas fa-file-alt mr-1"></i>
            Hồ sơ
          </button>
          
          <button 
            @click="filterNotifications('system')" 
            :class="[
              'whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              activeFilter === 'system' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <i class="fas fa-cog mr-1"></i>
            Hệ thống
          </button>
          
          <button 
            @click="markAllAsRead"
            class="whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            :disabled="!notificationStore.hasUnread || markingAll"
          >
            <i class="fas fa-check-double mr-1"></i>
            <span v-if="markingAll">Đang xử lý...</span>
            <span v-else>Đánh dấu đã đọc</span>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useNotificationStore } from '../../stores/notification'
  import NotificationList from '../../components/employer/NotificationList.vue'
  import { useToast } from '../../composables/useToast'
  
  const notificationStore = useNotificationStore()
  const { addToast } = useToast()
  
  // State
  const activeFilter = ref('all')
  const markingAll = ref(false)
  
  // Methods
  const filterNotifications = (filter) => {
    activeFilter.value = filter
    notificationStore.setFilter(filter)
    notificationStore.fetchNotifications(true) // Tải lại thông báo với bộ lọc mới
  }
  
  const markAllAsRead = async () => {
    try {
      markingAll.value = true
      const result = await notificationStore.markAllAsRead()
      
      if (result.success) {
        addToast({
          type: 'success',
          message: 'Đã đánh dấu tất cả thông báo là đã đọc'
        })
      } else {
        addToast({
          type: 'error',
          message: result.error || 'Không thể đánh dấu thông báo đã đọc'
        })
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
      addToast({
        type: 'error',
        message: 'Đã xảy ra lỗi khi đánh dấu thông báo đã đọc'
      })
    } finally {
      markingAll.value = false
    }
  }
  
  // Khởi tạo
  onMounted(() => {
    // Tải thông báo khi component được mount
    notificationStore.fetchNotifications(true)
  })
  </script>