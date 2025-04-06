import { defineStore } from 'pinia'
import axios from 'axios'

export const useFieldStore = defineStore('field', {
  state: () => ({
    fields: [],
    positions: [],
    positionsCache: new Map(), // Cache positions theo field_id
    loading: false,
    loadingPositions: false,
    error: null
  }),

  actions: {
    async fetchFields(params = { page: 1, page_size: 100 }) {
      try {
        this.loading = true
        const response = await axios.get('/api/fields/', { params })
        this.fields = response.data.data.results
        return { success: true, data: response.data.data.results }
      } catch (error) {
        this.error = error.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách lĩnh vực'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async fetchPositionsByField(fieldId) {
      // Kiểm tra cache trước
      if (this.positionsCache.has(fieldId)) {
        this.positions = this.positionsCache.get(fieldId)
        return { success: true, data: this.positions }
      }

      try {
        this.loadingPositions = true
        const response = await axios.get(`/api/positions/field/${fieldId}/`)
        const positions = response.data.data
        // Lưu vào cache
        this.positionsCache.set(fieldId, positions)
        this.positions = positions
        
        return { success: true, data: positions }
      } catch (error) {
        this.error = error.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách vị trí'
        return { success: false, error: this.error }
      } finally {
        this.loadingPositions = false
      }
    },
    async getPositionById(positionId) {
      try {
        const response = await axios.get(`/api/position/${positionId}/`)
        return { 
          success: true, 
          data: response.data
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin vị trí'
        return { 
          success: false, 
          error: this.error 
        }
      }
    },
    async getFieldById(fieldId) {
      try {
        const response = await axios.get(`/api/fields/${fieldId}/`)
        return { 
          success: true, 
          data: response.data
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin lĩnh vực'
        return { 
          success: false, 
          error: this.error 
        }
      }
    }
  }
}) 