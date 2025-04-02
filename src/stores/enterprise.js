import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useEnterpriseStore = defineStore('enterprise', {
  state: () => ({
    enterprise: null, // doanh nghiệp của user hiện tại
    enterprises: [], // danh sách doanh nghiệp
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0
    }
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
    // Lấy danh sách doanh nghiệp đang hoạt động
    async fetchEnterprises({ page = 1, pageSize = 10, sortBy = 'company_name', sortOrder = 'asc' } = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get('api/enterprises/', {
          params: {
            page,
            page_size: pageSize,
            sort_by: sortBy,
            sort_order: sortOrder
          }
        })

        if (response.data.status === 200) {
          this.enterprises = response.data.data.items || []
          this.pagination = {
            currentPage: page,
            totalPages: Math.ceil(response.data.data.total / pageSize),
            totalItems: response.data.data.total
          }
          return { success: true, data: this.enterprises }
        }
        
        throw new Error(response.data.message || 'Không thể lấy danh sách doanh nghiệp')
      } catch (error) {
        console.error('Lỗi khi lấy danh sách doanh nghiệp:', error)
        this.error = error.response?.data?.message || 'Không thể lấy danh sách doanh nghiệp. Vui lòng thử lại.'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Lấy thông tin doanh nghiệp của user đang đăng nhập
    async fetchUserEnterprise() {
      this.loading = true
      this.error = null
      const authStore = useAuthStore()

      try {
        const response = await axios.get('api/enterprises/user/', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        
        if (response.data.status === 200) {
          this.enterprise = response.data.data
          return { success: true, data: this.enterprise }
        }
        
        if (response.data.status === 404) {
          this.enterprise = null
          return { success: false, notFound: true }
        }

        throw new Error(response.data.message || 'Không thể lấy thông tin doanh nghiệp')
      } catch (error) {
        console.error('Lỗi khi lấy thông tin doanh nghiệp:', error)
        if (error.response?.status === 404) {
          this.enterprise = null
          return { success: false, notFound: true }
        }
        this.error = error.response?.data?.message || 'Không thể lấy thông tin doanh nghiệp. Vui lòng thử lại.'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Validate URL
    isValidUrl(string) {
      try {
        new URL(string)
        return true
      } catch (_) {
        return false
      }
    },

    async createEnterprise(data) {
      try {
        this.loading = true
        this.error = null
        const authStore = useAuthStore()

        if (data.link_web_site && !this.isValidUrl(data.link_web_site)) {
          throw new Error('URL website không hợp lệ. Vui lòng nhập đúng định dạng (ví dụ: https://example.com)')
        }

        const formData = new FormData()
        
        Object.keys(data).forEach(key => {
          if (data[key] !== '' && data[key] !== undefined && data[key] !== null) {
            if (key === 'logo' && data[key] instanceof File) {
              formData.append(key, data[key])
            } else {
              formData.append(key, data[key])
            }
          }
        })

        console.log('FormData being sent:', Object.fromEntries(formData))
        
        const response = await axios.post('api/enterprises/create/', formData, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        
        if (response.data.status === 201) {
          this.enterprise = response.data.data
          this.createNotification('success', 'Tạo doanh nghiệp thành công!')
          return { success: true, data: this.enterprise }
        }

        throw new Error(response.data.message || 'Không thể tạo doanh nghiệp')
      } catch (error) {
        console.error('Error creating enterprise:', error)
        this.error = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo doanh nghiệp'
        this.createNotification('error', this.error)
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
        
        const response = await axios.put('api/enterprises/update/', data)
        
        if (response.data.status === 200) {
          this.enterprise = response.data.data
          this.createNotification('success', 'Cập nhật thông tin doanh nghiệp thành công!')
          return { success: true, data: this.enterprise }
        }

        throw new Error(response.data.message || 'Không thể cập nhật thông tin doanh nghiệp')
      } catch (error) {
        this.error = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin doanh nghiệp'
        this.createNotification('error', this.error)
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