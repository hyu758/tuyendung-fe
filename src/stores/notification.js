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
    hasMore: true
  }),

  getters: {
    hasNotifications: (state) => state.notifications.length > 0,
    hasUnread: (state) => state.unreadCount > 0
  },

  actions: {
    // Lấy danh sách thông báo
    async fetchNotifications(reset = false) {
      try {
        this.loading = true
        this.error = null
        
        // Reset danh sách nếu cần
        if (reset) {
          this.notifications = []
          this.page = 1
          this.hasMore = true
        }

        // Chỉ thực hiện khi còn dữ liệu để tải
        if (!this.hasMore) return { success: true, data: this.notifications }

        const response = await axios.get('/notifications', {
          params: {
            page: this.page,
            page_size: this.pageSize
          }
        })

        const { data } = response.data

        // Cập nhật danh sách thông báo
        if (reset) {
          this.notifications = data
        } else {
          this.notifications = [...this.notifications, ...data]
        }

        // Kiểm tra xem còn dữ liệu để tải không
        this.hasMore = data.length === this.pageSize
        
        // Tăng số trang nếu còn dữ liệu
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

    // Lấy số lượng thông báo chưa đọc
    async fetchUnreadCount() {
      try {
        this.loading = true
        this.error = null

        const response = await axios.get('/notifications/unread-count')
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

    // Đánh dấu thông báo đã đọc
    async markAsRead(notificationId) {
      try {
        this.loading = true
        this.error = null

        const response = await axios.post(`/notifications/${notificationId}/read/`)
        
        // Cập nhật trạng thái của thông báo trong danh sách
        const index = this.notifications.findIndex(n => n.id === notificationId)
        if (index !== -1) {
          this.notifications[index].read = true
          
          // Giảm số lượng thông báo chưa đọc nếu thông báo trước đó chưa đọc
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

    // Reset store
    resetStore() {
      this.notifications = []
      this.unreadCount = 0
      this.loading = false
      this.error = null
      this.page = 1
      this.hasMore = true
    }
  }
}) 