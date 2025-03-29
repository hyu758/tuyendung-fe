import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useEnterpriseStore = defineStore('enterprise', {
  state: () => ({
    enterprise: null,
    loading: false,
    error: null
  }),

  getters: {
    hasEnterprise: (state) => !!state.enterprise,
    enterpriseId: (state) => state.enterprise?.id,
    companyName: (state) => state.enterprise?.company_name,
    address: (state) => state.enterprise?.address,
    businessCertificate: (state) => state.enterprise?.business_certificate,
    description: (state) => state.enterprise?.description,
    emailCompany: (state) => state.enterprise?.email_company,
    fieldOfActivity: (state) => state.enterprise?.field_of_activity,
    linkWebSite: (state) => state.enterprise?.link_web_site,
    logo: (state) => state.enterprise?.logo,
    phoneNumber: (state) => state.enterprise?.phone_number,
    scale: (state) => state.enterprise?.scale,
    tax: (state) => state.enterprise?.tax,
    city: (state) => state.enterprise?.city
  },

  actions: {
    // Lấy thông tin doanh nghiệp
    async fetchEnterprise() {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()
        const token = authStore.token

        const response = await axios.get('/api/enterprises/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        console.log('Dữ liệu doanh nghiệp từ API:', response.data)
        
        if (response.data.status === 200) {
          this.enterprise = response.data.data
          return { success: true, data: this.enterprise }
        } else {
          // Nếu là mã lỗi 404, có thể doanh nghiệp chưa được tạo
          if (response.data.status === 404) {
            this.enterprise = null
            return { success: false, notFound: true }
          }
          throw new Error(response.data.message || 'Không thể lấy thông tin doanh nghiệp')
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin doanh nghiệp:', error)
        this.error = error.response?.data?.message || 'Không thể lấy thông tin doanh nghiệp. Vui lòng thử lại.'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Tạo doanh nghiệp mới
    async createEnterprise(data) {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.post('/enterprises/create/', data)
        
        if (response.data) {
          this.enterprise = response.data
          // Lưu thông báo thành công
          localStorage.setItem('notification', JSON.stringify({
            show: true,
            type: 'success',
            message: 'Tạo doanh nghiệp thành công!'
          }))
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Có lỗi xảy ra khi tạo doanh nghiệp'
        // Lưu thông báo lỗi
        localStorage.setItem('notification', JSON.stringify({
          show: true,
          type: 'error',
          message: this.error
        }))
        throw error
      } finally {
        this.loading = false
      }
    },

    // Cập nhật thông tin doanh nghiệp
    async updateEnterprise(data) {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.put('/enterprises/update/', data)
        
        if (response.data) {
          this.enterprise = response.data
          // Lưu thông báo thành công
          localStorage.setItem('notification', JSON.stringify({
            show: true,
            type: 'success',
            message: 'Cập nhật thông tin doanh nghiệp thành công!'
          }))
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin doanh nghiệp'
        // Lưu thông báo lỗi
        localStorage.setItem('notification', JSON.stringify({
          show: true,
          type: 'error',
          message: this.error
        }))
        throw error
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