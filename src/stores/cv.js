import { defineStore } from 'pinia'
import axios from 'axios'

export const useCVStore = defineStore('cv', {
  state: () => ({
    cvs: [],
    loading: false,
    error: null
  }),
  
  actions: {
    // Lấy danh sách CV theo post ID
    async fetchCVsByPostId(postId) {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.get(`/api/cv/post/${postId}/`)
        
        if (response.data) {
          this.cvs = response.data.data.results
          return {
            success: true,
            data: response.data.data
          }
        }
        
        return {
          success: false,
          error: 'Không thể lấy danh sách CV'
        }
      } catch (error) {
        console.error('Error fetching CVs:', error)
        this.error = error.message || 'Đã xảy ra lỗi khi lấy danh sách CV'
        return {
          success: false,
          error: this.error
        }
      } finally {
        this.loading = false
      }
    },
    
    // Cập nhật trạng thái CV
    async updateCVStatus(cvId, status) {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.patch(`/api/cv/${cvId}/update-status/`, { status })
        
        if (response.data && response.data.success) {
          // Cập nhật CV trong danh sách
          const index = this.cvs.findIndex(cv => cv.id === cvId)
          if (index !== -1) {
            this.cvs[index].status = status
          }
          
          return {
            success: true,
            data: response.data
          }
        }
        
        return {
          success: false,
          error: 'Không thể cập nhật trạng thái CV'
        }
      } catch (error) {
        console.error('Error updating CV status:', error)
        this.error = error.message || 'Đã xảy ra lỗi khi cập nhật trạng thái CV'
        return {
          success: false,
          error: this.error
        }
      } finally {
        this.loading = false
      }
    },

    async markCVAsViewed(cvId) {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.patch(`/api/cv/mark-as-viewed/${cvId}/`)
        
        if (response.data && response.data.success) {
          // Cập nhật CV trong danh sách
          const index = this.cvs.findIndex(cv => cv.id === cvId)
          if (index !== -1) {
            this.cvs[index].is_viewed = true
          }
          
          return {
            success: true,
            data: response.data
          }
        }
        
        return {
          success: false,
          error: 'Không thể đánh dấu CV đã xem'
        }
      } catch (error) {
        console.error('Error marking CV as viewed:', error)
        this.error = error.message || 'Đã xảy ra lỗi khi đánh dấu CV đã xem'
        return {
          success: false,
          error: this.error
        }
      } finally {
        this.loading = false
      }
    }
  }
}) 