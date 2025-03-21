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
    isEmployer: (state) => state.user?.is_recruiter === true,
    isCandidate: (state) => state.user?.is_applicant === true,
    isAdmin: (state) => state.user?.is_admin === true,
    isActivated: (state) => state.user?.is_active === true,
    userFullName: (state) => state.user ? `${state.user.firstName || ''} ${state.user.lastName || ''}`.trim() : '',
    userRole: (state) => {
      if (!state.user) return null
      if (state.user.is_admin) return 'admin'
      if (state.user.is_recruiter) return 'employer'
      if (state.user.is_applicant) return 'candidate'
      return null
    }
  },
  
  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('/api/login/', {
          username: credentials.email,
          password: credentials.password
        })
        
        if (response.data.status === 200) {
          // Lưu token
          const accessToken = response.data.data.access
          const refreshToken = response.data.data.refresh
          
          this.token = accessToken
          localStorage.setItem('token', accessToken)
          localStorage.setItem('refreshToken', refreshToken)
          
          // Lấy thông tin người dùng từ token
          await this.fetchCurrentUser()
          
          // Kiểm tra tài khoản đã kích hoạt chưa
          if (!this.isActivated) {
            // Thông báo cần kích hoạt và chuyển hướng đến trang kích hoạt
            this.error = 'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản.'
            this.logout(false) // Đăng xuất nhưng không chuyển hướng
            router.push({
              name: 'Activate',
              params: { email: credentials.email }
            })
            return { success: false, error: this.error }
          }
          
          // Chuyển hướng dựa trên vai trò
          if (this.userRole === 'admin') {
            router.push('/admin/dashboard')
          } else if (this.userRole === 'employer') {
            router.push('/employer/dashboard')
          } else {
            router.push('/')
          }
          
          return { success: true }
        } else {
          throw new Error(response.data.message || 'Đăng nhập thất bại')
        }
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
        const response = await axios.post('/api/register/', {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          fullname: userData.fullname || userData.username,
          gender: userData.gender || 'male',
          is_recruiter: userData.is_recruiter || false,
        })
        
        if (response.data.status === 201) {
          // Đăng ký thành công, chuyển hướng về trang kích hoạt
          return { success: true, message: response.data.message }
        } else {
          throw new Error(response.data.message || 'Đăng ký thất bại')
        }
      } catch (error) {
        console.error('Đăng ký thất bại:', error)
        this.error = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async activateAccount(activationData) {
      this.loading = true
      this.error = null
      
      try {
        // Gọi API kích hoạt tài khoản với token từ URL
        const response = await axios.get(`/api/activate/${activationData.token}/`)
        
        if (response.data.status === 200) {
          // Nếu kích hoạt thành công, cập nhật trạng thái người dùng nếu đang đăng nhập
          if (this.isAuthenticated) {
            await this.fetchCurrentUser()
          }
          return { success: true, message: response.data.message || 'Tài khoản đã được kích hoạt thành công!' }
        } else {
          throw new Error(response.data.message || 'Kích hoạt tài khoản thất bại')
        }
      } catch (error) {
        console.error('Kích hoạt tài khoản thất bại:', error)
        this.error = error.response?.data?.message || 'Kích hoạt tài khoản thất bại. Vui lòng thử lại.'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async resendActivationCode(data) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('/api/resend-it/', {
          email: data.email
        })
        
        if (response.data.status === 200) {
          return { 
            success: true, 
            message: response.data.message || 'Mã kích hoạt mới đã được gửi vào email của bạn.' 
          }
        } else {
          throw new Error(response.data.message || 'Không thể gửi lại mã kích hoạt')
        }
      } catch (error) {
        console.error('Không thể gửi lại mã kích hoạt:', error)
        this.error = error.response?.data?.message || 'Không thể gửi lại mã kích hoạt. Vui lòng thử lại sau.'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async fetchCurrentUser() {
      if (!this.token) return
      
      this.loading = true
      
      try {
        // Giả định rằng API trả về thông tin người dùng hiện tại từ token
        // Đây là điểm bạn cần điều chỉnh dựa vào API thực tế của bạn
        const response = await axios.get('/api/user/me/') // Thay đổi endpoint thành API lấy thông tin user
        this.user = response.data
        
        // Chỉ lưu username, không lưu vai trò vào localStorage
        localStorage.setItem('username', this.user.username)
      } catch (error) {
        console.error('Không thể lấy thông tin người dùng:', error)
        if (error.response?.status === 401) {
          this.logout()
        }
      } finally {
        this.loading = false
      }
    },
    
    logout(redirect = true) {
      this.user = null
      this.token = null
      
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('username')
      
      if (redirect) {
        router.push('/login')
      }
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
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) return false
        
        const response = await axios.post('/api/token-refresh/', {
          refresh: refreshToken
        })
        
        if (response.data.access) {
          this.token = response.data.access
          localStorage.setItem('token', response.data.access)
          return true
        }
        return false
      } catch (error) {
        console.error('Không thể làm mới token:', error)
        return false
      }
    }
  }
}) 