import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'
import { useEnterpriseStore } from './enterprise'

export const useCampaignStore = defineStore('campaign', {
  state: () => ({
    campaigns: [], // Danh sách các chiến dịch
    currentCampaign: null, // Chiến dịch hiện tại đang xem chi tiết
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10
    }
  }),

  getters: {
    // Getter lấy danh sách chiến dịch đã được sắp xếp theo thời gian
    sortedCampaigns: (state) => {
      return [...state.campaigns].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at)
      })
    },
    
    // Getter để kiểm tra xem có chiến dịch nào hay không
    hasCampaigns: (state) => state.campaigns && state.campaigns.length > 0,
    
    // Getter lấy chiến dịch đang hoạt động
    activeCampaigns: (state) => {
      return state.campaigns.filter(campaign => campaign.is_active)
    }
  },

  actions: {
    // Lấy danh sách chiến dịch
    async fetchCampaigns(page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc') {
      this.loading = true
      this.error = null
      
      try {
        const authStore = useAuthStore()
        const enterpriseStore = useEnterpriseStore()
        const token = authStore.token
        
        // Đảm bảo có ID của doanh nghiệp
        if (!enterpriseStore.enterpriseId) {
          await enterpriseStore.fetchEnterprise()
          if (!enterpriseStore.enterpriseId) {
            throw new Error('Chưa có thông tin doanh nghiệp')
          }
        }

        const response = await axios.get('/api/campaigns/', {
          params: {
            enterprise_id: enterpriseStore.enterpriseId,
            page,
            limit,
            sort_by: sortBy,
            sort_order: sortOrder
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        console.log('Danh sách chiến dịch từ API:', response.data)
        
        if (response.data.status === 200) {
          this.campaigns = response.data.data.items
          this.pagination = {
            currentPage: page,
            totalPages: response.data.data.total_pages || 1,
            totalItems: response.data.data.total_items || 0,
            itemsPerPage: limit
          }
          return { success: true, data: this.campaigns }
        } else {
          throw new Error(response.data.message || 'Không thể tải danh sách chiến dịch')
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách chiến dịch:', error)
        this.error = error.response?.data?.message || 'Không thể tải danh sách chiến dịch'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Lấy chi tiết một chiến dịch
    async fetchCampaignById(id) {
      this.loading = true
      this.error = null
      
      try {
        const authStore = useAuthStore()
        const token = authStore.token

        const response = await axios.get(`/api/campaigns/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        console.log('Chi tiết chiến dịch từ API:', response.data)
        
        if (response.data.status === 200) {
          this.currentCampaign = response.data.data
          return { success: true, data: this.currentCampaign }
        } else {
          throw new Error(response.data.message || 'Không thể tải thông tin chiến dịch')
        }
      } catch (error) {
        console.error(`Lỗi khi tải thông tin chiến dịch ID ${id}:`, error)
        this.error = error.response?.data?.message || 'Không thể tải thông tin chiến dịch'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Tạo chiến dịch mới
    async createCampaign(campaignData) {
      this.loading = true
      this.error = null
      
      try {
        const authStore = useAuthStore()
        const enterpriseStore = useEnterpriseStore()
        const token = authStore.token
        
        // Đảm bảo có ID của doanh nghiệp
        if (!enterpriseStore.enterpriseId) {
          await enterpriseStore.fetchEnterprise()
          if (!enterpriseStore.enterpriseId) {
            throw new Error('Chưa có thông tin doanh nghiệp')
          }
        }
        
        console.log('Dữ liệu tạo chiến dịch gửi đi:', campaignData)
        
        // Tạo payload với thông tin chiến dịch và ID doanh nghiệp
        const payload = {
          name: campaignData.name,
          description: campaignData.description || '',
          is_active: campaignData.is_active ?? true,
          enterprise: enterpriseStore.enterpriseId
        }

        const response = await axios.post('/api/campaigns/', payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        console.log('Kết quả tạo chiến dịch:', response.data)

        if (response.data.status === 201) {
          // Thông báo thành công
          this.createNotification('success', 'Tạo chiến dịch tuyển dụng thành công!')
          
          // Cập nhật danh sách chiến dịch
          await this.fetchCampaigns()
          
          return { success: true, data: response.data.data }
        } else {
          throw new Error(response.data.message || 'Không thể tạo chiến dịch')
        }
      } catch (error) {
        console.error('Lỗi khi tạo chiến dịch:', error)
        console.error('Chi tiết lỗi:', error.response?.data)
        this.error = error.response?.data?.message || 'Không thể tạo chiến dịch'
        
        // Thông báo lỗi
        this.createNotification('error', this.error)
        
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Cập nhật chiến dịch
    async updateCampaign(id, campaignData) {
      this.loading = true
      this.error = null
      
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        
        console.log('Dữ liệu cập nhật chiến dịch:', campaignData)
        
        const response = await axios.put(`/api/campaigns/${id}/`, campaignData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        console.log('Kết quả cập nhật chiến dịch:', response.data)

        if (response.data.status === 200) {
          // Thông báo thành công
          this.createNotification('success', 'Cập nhật chiến dịch thành công!')
          
          // Cập nhật chiến dịch hiện tại nếu đang xem
          if (this.currentCampaign && this.currentCampaign.id === id) {
            this.currentCampaign = { ...this.currentCampaign, ...campaignData }
          }
          
          // Cập nhật danh sách chiến dịch
          await this.fetchCampaigns(this.pagination.currentPage, this.pagination.itemsPerPage)
          
          return { success: true, data: response.data.data }
        } else {
          throw new Error(response.data.message || 'Không thể cập nhật chiến dịch')
        }
      } catch (error) {
        console.error(`Lỗi khi cập nhật chiến dịch ID ${id}:`, error)
        this.error = error.response?.data?.message || 'Không thể cập nhật chiến dịch'
        
        // Thông báo lỗi
        this.createNotification('error', this.error)
        
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Xóa chiến dịch
    async deleteCampaign(id) {
      this.loading = true
      this.error = null
      
      try {
        const authStore = useAuthStore()
        const token = authStore.token

        const response = await axios.delete(`/api/campaigns/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        console.log('Kết quả xóa chiến dịch:', response.data)

        if (response.data.status === 200) {
          // Thông báo thành công
          this.createNotification('success', 'Xóa chiến dịch thành công!')
          
          // Cập nhật danh sách chiến dịch
          await this.fetchCampaigns(this.pagination.currentPage, this.pagination.itemsPerPage)
          
          return { success: true }
        } else {
          throw new Error(response.data.message || 'Không thể xóa chiến dịch')
        }
      } catch (error) {
        console.error(`Lỗi khi xóa chiến dịch ID ${id}:`, error)
        this.error = error.response?.data?.message || 'Không thể xóa chiến dịch'
        
        // Thông báo lỗi
        this.createNotification('error', this.error)
        
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    createNotification(type, message) {
      localStorage.setItem('notification', JSON.stringify({
        type: type,
        message: message,
        show: true
      }))
    }
  }
}) 