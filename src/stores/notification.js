import { defineStore } from 'pinia'
import axios from 'axios'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    page: 1,
    pageSize: 10,
    hasMore: true,
    totalPages: 0,
    total: 0,
    isDropdownOpen: false,
    currentFilter: 'all'
  }),

  getters: {
    hasNotifications: (state) => state.notifications.length > 0,
    hasUnread: (state) => state.unreadCount > 0,
    filteredNotifications: (state) => {
      if (state.currentFilter === 'all') {
        return state.notifications;
      } else if (state.currentFilter === 'unread') {
        return state.notifications.filter(notification => !notification.is_read);
      } else if (state.currentFilter === 'applications') {
        return state.notifications.filter(notification => 
          ['new_application', 'cv_viewed', 'application_withdrawn'].includes(notification.notification_type)
        );
      } else if (state.currentFilter === 'system') {
        return state.notifications.filter(notification => 
          notification.notification_type === 'system'
        );
      }
      return state.notifications;
    }
  },

  actions: {
    setFilter(filter) {
      this.currentFilter = filter;
      this.page = 1;
      this.hasMore = true;
    },

    async fetchNotifications(reset = false) {
      try {
        this.loading = true
        this.error = null
        
        if (reset) {
          this.notifications = []
          this.page = 1
          this.hasMore = true
        }

        if (!this.hasMore) return { success: true, data: this.notifications }

        let params = {
          page: this.page,
          page_size: this.pageSize
        };
        
        if (this.currentFilter !== 'all') {
          if (this.currentFilter === 'unread') {
            params.read = false;
          } else if (this.currentFilter === 'applications') {
            params.type = 'application';
          } else if (this.currentFilter === 'system') {
            params.type = 'system';
          }
        }

        const response = await axios.get('/api/notifications', {
          params: params
        })

        const { results, total, page, total_pages, page_size } = response.data.data

        if (reset) {
          this.notifications = results
        } else {
          this.notifications = [...this.notifications, ...results]
        }

        this.total = total
        this.totalPages = total_pages
        this.pageSize = page_size

        this.hasMore = page < total_pages
        
        if (this.hasMore) {
          this.page += 1
        }

        return { success: true, data: this.notifications }
      } catch (error) {
        console.error('Error fetching notifications:', error)
        this.error = error.response?.data?.message || 'Không thể tải thông báo'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async fetchUnreadCount() {
      try {
        this.loading = true
        this.error = null

        const response = await axios.get('/api/notifications/unread-count')
        this.unreadCount = response.data.unread_count

        return { success: true, count: this.unreadCount }
      } catch (error) {
        console.error('Error fetching unread count:', error)
        this.error = error.response?.data?.message || 'Không thể tải số lượng thông báo chưa đọc'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async markAsRead(notificationId) {
      try {
        this.loading = true
        this.error = null

        const response = await axios.post(`/api/notifications/${notificationId}/read/`)
        
        const index = this.notifications.findIndex(n => n.id === notificationId)
        if (index !== -1) {
          this.notifications[index].is_read = true
          
          if (this.unreadCount > 0) {
            this.unreadCount -= 1
          }
        }

        return { success: true, message: response.data.message }
      } catch (error) {
        console.error('Error marking notification as read:', error)
        this.error = error.response?.data?.message || 'Không thể đánh dấu thông báo đã đọc'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async markAllAsRead() {
      try {
        this.loading = true
        this.error = null

        const response = await axios.post('/api/notifications/mark-all-as-read/')
        
        this.notifications.forEach(notification => {
          notification.is_read = true
        })
        
        this.unreadCount = 0

        return { success: true, message: response.data.message }
      } catch (error) {
        console.error('Error marking all notifications as read:', error)
        this.error = error.response?.data?.message || 'Không thể đánh dấu tất cả thông báo đã đọc'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async createCVViewedNotification(cvId, candidateId, link = null) {
      try {
        this.loading = true
        this.error = null

        const response = await axios.post('/api/notifications/create/', {
          notification_type: 'cv_viewed',
          recipient_id: candidateId,
          object_id: cvId,
          title: 'CV của bạn đã được xem',
          message: 'Nhà tuyển dụng đã xem CV của bạn',
          link: link || `/my-applications?cv_id=${cvId}`
        })

        return { success: true, data: response.data }
      } catch (error) {
        console.error('Error creating CV viewed notification:', error)
        this.error = error.response?.data?.message || 'Không thể tạo thông báo đã xem CV'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async createSystemNotification(title, message, link = null, objectId = null) {
      try {
        this.loading = true
        this.error = null

        const response = await axios.post('/api/notifications/create-system/', {
          notification_type: 'system',
          title: title,
          message: message,
          link: link,
          object_id: objectId
        })

        return { success: true, data: response.data }
      } catch (error) {
        console.error('Error creating system notification:', error)
        this.error = error.response?.data?.message || 'Không thể tạo thông báo hệ thống'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    resetStore() {
      this.notifications = []
      this.unreadCount = 0
      this.loading = false
      this.error = null
      this.page = 1
      this.hasMore = true
      this.totalPages = 0
      this.total = 0
      this.currentFilter = 'all'
    },

    setDropdownState(isOpen) {
      this.isDropdownOpen = isOpen;
    },

    showNewMessageNotification(messageData) {
      // Tạo thông báo tin nhắn mới
      this.createNotification({
        title: 'Tin nhắn mới',
        message: messageData.content.length > 30 
          ? messageData.content.substring(0, 30) + '...' 
          : messageData.content,
        type: 'info',
        link: `/messages?user=${messageData.sender_id}`
      });
    }
  }
}) 