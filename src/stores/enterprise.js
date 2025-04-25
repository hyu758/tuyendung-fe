import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useEnterpriseStore = defineStore('enterprise', {
  state: () => ({
    enterprises: [],
    currentEnterprise: null,
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      pageSize: 10
    }
  }),

  getters: {
    hasEnterprise: (state) => !!state.currentEnterprise,
    enterpriseId: (state) => state.currentEnterprise?.id,
    companyName: (state) => state.currentEnterprise?.company_name,
    address: (state) => state.currentEnterprise?.address,
    businessCertificate: (state) => state.currentEnterprise?.business_certificate,
    description: (state) => state.currentEnterprise?.description,
    emailCompany: (state) => state.currentEnterprise?.email_company,
    fieldOfActivity: (state) => state.currentEnterprise?.field_of_activity,
    linkWebSite: (state) => state.currentEnterprise?.link_web_site,
    logo: (state) => state.currentEnterprise?.logo,
    phoneNumber: (state) => state.currentEnterprise?.phone_number,
    scale: (state) => state.currentEnterprise?.scale,
    tax: (state) => state.currentEnterprise?.tax,
    city: (state) => state.currentEnterprise?.city
  },

  actions: {
    async fetchEnterprises(page = 1, pageSize = 10) {
      try {
        this.loading = true
        const response = await axios.get(`/api/enterprises?page=${page}&page_size=${pageSize}`)
        this.enterprises = response.data.data.results
        this.pagination = {
          currentPage: response.data.data.page,
          totalPages: response.data.data.total_pages,
          totalItems: response.data.data.total,
          pageSize: response.data.data.page_size
        }
        return { success: true, data: response.data }
      } catch (error) {
        console.error('Error fetching enterprises:', error)
        this.error = error.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách công ty'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async fetchEnterpriseById(id) {
      try {
        this.loading = true
        const response = await axios.get(`/api/enterprises/${id}`)
        this.currentEnterprise = response.data.data
        return { success: true, data: response.data }
      } catch (error) {
        console.error('Error fetching enterprise:', error)
        this.error = error.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin công ty'
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
          this.currentEnterprise = response.data.data
          return { success: true, data: this.currentEnterprise }
        }
        
        if (response.data.status === 404) {
          this.currentEnterprise = null
          return { success: false, notFound: true }
        }

        throw new Error(response.data.message || 'Không thể lấy thông tin doanh nghiệp')
      } catch (error) {
        console.error('Lỗi khi lấy thông tin doanh nghiệp:', error)
        if (error.response?.status === 404) {
          this.currentEnterprise = null
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
          this.currentEnterprise = response.data.data
          this.createNotification('success', 'Tạo doanh nghiệp thành công!')
          return { success: true, data: this.currentEnterprise }
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
        const authStore = useAuthStore()
        const response = await axios.put('api/enterprises/update/', data, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'multipart/form-data'
          },
        })
        
        if (response.data.status === 200) {
          this.currentEnterprise = response.data.data
          this.createNotification('success', 'Cập nhật thông tin doanh nghiệp thành công!')
          return { success: true, data: this.currentEnterprise }
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
    },

    async searchEnterprises({ q = '', city = '', field = '', scale = '', page = 1, pageSize = 10, sortBy = '', sortOrder = 'asc' } = {}) {
      try {
        this.loading = true
        const params = new URLSearchParams({
          ...(q && { q }),
          ...(city && { city }),
          ...(field && { field }),
          ...(scale && { scale }),
          page,
          page_size: pageSize,
          ...(sortBy && { sort_by: sortBy }),
          ...(sortOrder && { sort_order: sortOrder })
        })
        
        const response = await axios.get(`/api/enterprises/search/?${params.toString()}`)
        return { success: true, data: response.data }
      } catch (error) {
        console.error('Error searching enterprises:', error)
        this.error = error.response?.data?.message || 'Có lỗi xảy ra khi tìm kiếm công ty'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async getEnterpriseStatistics() {
      try {
        this.loading = true
        this.error = null
        const authStore = useAuthStore()
        
        const response = await axios.get('/api/enterprises/statistics/', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        
        if (response.data.status === 200) {
          return { success: true, data: response.data.data }
        }
        
        throw new Error(response.data.message || 'Không thể lấy thống kê doanh nghiệp')
      } catch (error) {
        console.error('Error getting enterprise statistics:', error)
        this.error = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi lấy thống kê doanh nghiệp'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async getEmployerStatistics() {
      try {
        this.loading = true
        this.error = null
        const authStore = useAuthStore()
        
        const response = await axios.get('/api/statistics/', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        
        if (response.data.status === 200) {
          return { success: true, data: response.data.data }
        }
        
        throw new Error(response.data.message || 'Không thể lấy thống kê nhà tuyển dụng')
      } catch (error) {
        console.error('Error getting employer statistics:', error)
        this.error = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi lấy thống kê nhà tuyển dụng'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    }
  }
}) 