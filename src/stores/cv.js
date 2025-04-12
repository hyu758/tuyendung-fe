import { defineStore } from 'pinia'
import axios from 'axios'

export const useCVStore = defineStore('cv', {
  state: () => ({
    cvs: [],
    currentCV: null,
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
        
        if (response.data && response.status === 200) {
          this.currentCV = response.data.data
          return {
            success: true,
            data: response.data.data
          }
        }
        
        return {
          success: false,
          error: response.data?.message || 'Không thể lấy thông tin CV'
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
        
        const response = await axios.put(`/api/cv/${cvId}/status/`, { status })
        
        if (response.data && response.status === 200) {
          const index = this.cvs.findIndex(cv => cv.id === cvId)
          if (index !== -1) {
            this.cvs[index].status = status
          }
          if (this.currentCV && this.currentCV.id === cvId) {
            this.currentCV.status = status
          }
          
          return {
            success: true,
            data: response.data.data
          }
        }
        
        return {
          success: false,
          error: response.data?.message || 'Không thể cập nhật trạng thái CV'
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
    
    async markCV(cvId, markType) {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.post(`/api/cv/${cvId}/mark/`, { mark_type: markType })
        
        if (response.data && response.status === 200) {
          return {
            success: true,
            data: response.data.data
          }
        }
        
        return {
          success: false,
          error: response.data?.message || 'Không thể đánh dấu CV'
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
    
    async updateCVNote(cvId, note) {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.put(`/api/cv/${cvId}/note/`, { note })
        
        if (response.data && response.status === 200) {
          const index = this.cvs.findIndex(cv => cv.id === cvId)
          if (index !== -1) {
            this.cvs[index].note = note
          }
          
          if (this.currentCV && this.currentCV.id === cvId) {
            this.currentCV.note = note
          }
          
          return {
            success: true,
            data: response.data.data
          }
        }
        
        return {
          success: false,
          error: response.data?.message || 'Không thể cập nhật ghi chú CV'
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