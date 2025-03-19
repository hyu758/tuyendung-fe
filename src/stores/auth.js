import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isEmployer: (state) => state.user?.role === 'employer',
    isCandidate: (state) => state.user?.role === 'candidate',
    isAdmin: (state) => state.user?.role === 'admin',
    userFullName: (state) => state.user ? `${state.user.firstName || ''} ${state.user.lastName || ''}`.trim() : '',
  },
  
  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('/api/login/', credentials)
        const { user, token } = response.data
        
        this.user = user
        this.token = token
        
        localStorage.setItem('token', token)
        localStorage.setItem('userRole', user.role)
        localStorage.setItem('username', user.username || user.email)
        
        // Chuyển hướng dựa trên vai trò
        if (user.role === 'admin') {
          router.push('/admin/dashboard')
        } else if (user.role === 'employer') {
          router.push('/employer/dashboard')
        } else {
          router.push('/')
        }
        
        return { success: true }
      } catch (error) {
        console.error('Đăng nhập thất bại:', error)
        this.error = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('/api/register/', userData)
        const { user, token } = response.data
        
        this.user = user
        this.token = token
        
        localStorage.setItem('token', token)
        localStorage.setItem('userRole', user.role)
        localStorage.setItem('username', user.username || user.email)
        
        // Chuyển hướng về trang chủ sau khi đăng ký
        router.push('/')
        
        return { success: true }
      } catch (error) {
        console.error('Đăng ký thất bại:', error)
        this.error = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async fetchCurrentUser() {
      if (!this.token) return
      
      this.loading = true
      
      try {
        // API này không có trong danh sách bạn cung cấp, có thể cần điều chỉnh sau
        const response = await axios.get('/api/token-refresh/')
        this.user = response.data
        localStorage.setItem('userRole', this.user.role)
        localStorage.setItem('username', this.user.username || this.user.email)
      } catch (error) {
        console.error('Không thể lấy thông tin người dùng:', error)
        if (error.response?.status === 401) {
          this.logout()
        }
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      localStorage.removeItem('username')
      
      router.push('/login')
    },
    
    async forgotPassword(email) {
      this.loading = true
      this.error = null
      
      try {
        await axios.post('/api/forgot-password/', { email })
        return { success: true }
      } catch (error) {
        console.error('Lỗi quên mật khẩu:', error)
        this.error = error.response?.data?.message || 'Không thể gửi yêu cầu đặt lại mật khẩu.'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async resetPassword(resetData) {
      this.loading = true
      this.error = null
      
      try {
        await axios.post('/api/reset-password/', resetData)
        return { success: true }
      } catch (error) {
        console.error('Lỗi đặt lại mật khẩu:', error)
        this.error = error.response?.data?.message || 'Không thể đặt lại mật khẩu.'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async refreshToken() {
      try {
        const response = await axios.post('/api/token-refresh/')
        const { token } = response.data
        this.token = token
        localStorage.setItem('token', token)
        return true
      } catch (error) {
        console.error('Không thể làm mới token:', error)
        return false
      }
    }
  }
}) 