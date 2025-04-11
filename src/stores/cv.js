import { defineStore } from 'pinia'
import axios from 'axios'

export const useCVStore = defineStore('cv', {
  state: () => ({
    cvs: [],
    currentCV: null,
    cvMarks: [],
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
    
    // Lấy thông tin chi tiết CV theo ID
    async fetchCVById(cvId) {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.get(`/api/cv/${cvId}/`)
        
        if (response.data && response.data.success) {
          this.currentCV = response.data.data
          return {
            success: true,
            data: response.data.data
          }
        }
        
        return {
          success: false,
          error: 'Không thể lấy thông tin CV'
        }
      } catch (error) {
        console.error('Error fetching CV details:', error)
        this.error = error.message || 'Đã xảy ra lỗi khi lấy thông tin CV'
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
        
        const response = await axios.patch(`/api/cv/${cvId}/status/`, { status })
        
        if (response.data && response.data.success) {
          // Cập nhật CV trong danh sách
          const index = this.cvs.findIndex(cv => cv.id === cvId)
          if (index !== -1) {
            this.cvs[index].status = status
          }
          
          // Cập nhật currentCV nếu đang xem
          if (this.currentCV && this.currentCV.id === cvId) {
            this.currentCV.status = status
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
          
          // Cập nhật currentCV nếu đang xem
          if (this.currentCV && this.currentCV.id === cvId) {
            this.currentCV.is_viewed = true
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
    },
    
    // Đánh dấu CV (MARK_TYPES)
    async markCV(cvId, markType) {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.post(`/api/cv/${cvId}/mark/`, { mark_type: markType })
        
        if (response.data && response.data.success) {
          // Cập nhật danh sách đánh dấu
          if (response.data.data) {
            // Thêm đánh giá mới vào danh sách
            this.cvMarks = [response.data.data, ...this.cvMarks]
          }
          
          return {
            success: true,
            data: response.data.data
          }
        }
        
        return {
          success: false,
          error: 'Không thể đánh dấu CV'
        }
      } catch (error) {
        console.error('Error marking CV:', error)
        this.error = error.message || 'Đã xảy ra lỗi khi đánh dấu CV'
        return {
          success: false,
          error: this.error
        }
      } finally {
        this.loading = false
      }
    },
    
    // Lấy lịch sử đánh dấu của CV
    async fetchCVMarks(cvId) {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.get(`/api/cv/${cvId}/marks/`)
        
        if (response.data && response.data.success) {
          this.cvMarks = response.data.data.results || []
          return {
            success: true,
            data: response.data.data
          }
        }
        
        return {
          success: false,
          error: 'Không thể lấy lịch sử đánh dấu CV'
        }
      } catch (error) {
        console.error('Error fetching CV marks:', error)
        this.error = error.message || 'Đã xảy ra lỗi khi lấy lịch sử đánh dấu CV'
        return {
          success: false,
          error: this.error
        }
      } finally {
        this.loading = false
      }
    },
    
    // Cập nhật ghi chú cho CV
    async updateCVNote(cvId, note) {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.patch(`/api/cv/${cvId}/update-note/`, { note })
        
        if (response.data && response.data.success) {
          // Cập nhật CV trong danh sách
          const index = this.cvs.findIndex(cv => cv.id === cvId)
          if (index !== -1) {
            this.cvs[index].note = note
          }
          
          // Cập nhật currentCV nếu đang xem
          if (this.currentCV && this.currentCV.id === cvId) {
            this.currentCV.note = note
          }
          
          return {
            success: true,
            data: response.data
          }
        }
        
        return {
          success: false,
          error: 'Không thể cập nhật ghi chú CV'
        }
      } catch (error) {
        console.error('Error updating CV note:', error)
        this.error = error.message || 'Đã xảy ra lỗi khi cập nhật ghi chú CV'
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