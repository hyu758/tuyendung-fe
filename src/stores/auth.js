import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: null,
      token: localStorage.getItem('token') || null,
      loading: false,
      error: null
    }
  },
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    
    // Giải mã JWT token để lấy thông tin
    decodedToken() {
      if (!this.token) return null
      
      try {
        // Phân tích JWT token để lấy payload
        const base64Url = this.token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        return JSON.parse(window.atob(base64))
      } catch (e) {
        console.error('Lỗi khi giải mã JWT token:', e)
        return null
      }
    },
    
    // Lấy toàn bộ thông tin user từ token hoặc state
    userInfo() {
      // Nếu đã có thông tin user trong state, trả về nó
      if (this.user) return this.user
      
      // Nếu không có, thử lấy từ token
      const decoded = this.decodedToken
      if (!decoded) return null
      
      // Tạo đối tượng user từ thông tin trong token
      return {
        username: decoded.username || decoded.email || localStorage.getItem('username'),
        user_id: decoded.user_id,
        is_active: decoded.is_active,
        is_admin: decoded.role === 'admin',
        is_recruiter: decoded.role === 'employer',
        is_applicant: decoded.role === 'candidate' || decoded.role === 'Người tìm việc'
      }
    },
    
    // Các getter dựa trên userInfo
    isActivated() {
      const user = this.userInfo
      return user ? user.is_active === true : false
    },
    
    isEmployer() {
      const user = this.userInfo
      return user ? user.is_recruiter === true : false
    },
    
    isCandidate() {
      const user = this.userInfo
      return user ? user.is_applicant === true : false
    },
    
    isAdmin() {
      const user = this.userInfo
      return user ? user.is_admin === true : false
    },
    
    userFullName() {
      const user = this.userInfo
      if (!user) return ''
      return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || ''
    },
    
    userRole() {
      const user = this.userInfo
      if (!user) return null
      if (user.is_admin) return 'admin'
      if (user.is_recruiter) return 'employer'
      if (user.is_applicant) return 'candidate'
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
          console.log('Full login response:', response.data)
          
          // Lưu token
          const accessToken = response.data.data.access
          const refreshToken = response.data.data.refresh
          
          this.token = accessToken
          localStorage.setItem('token', accessToken)
          localStorage.setItem('refreshToken', refreshToken)
          
          // Giải mã token để lấy thông tin người dùng
          const decodedToken = this.decodedToken
          console.log('Decoded JWT token:', decodedToken)
          
          // Lưu username vào localStorage
          localStorage.setItem('username', credentials.email)
          
          // Cập nhật thông tin từ token
          this.updateUserFromToken()
          
          // Kiểm tra tài khoản đã kích hoạt chưa
          if (!this.isActivated) {
            // Thông báo cần kích hoạt và chuyển hướng đến trang kích hoạt
            this.error = 'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản.'
            
            // Thêm thông báo cho người dùng
            localStorage.setItem('notification', JSON.stringify({
              type: 'warning',
              message: this.error,
              show: true
            }))
            
            this.logout(false) // Đăng xuất nhưng không chuyển hướng
            router.push({
              name: 'Activate',
              params: { email: credentials.email }
            })
            return { success: false, error: this.error }
          }
          
          // Thêm thông báo đăng nhập thành công
          localStorage.setItem('notification', JSON.stringify({
            type: 'success',
            message: 'Đăng nhập thành công! Chào mừng trở lại.',
            show: true
          }))
          
          // Chuyển hướng về trang chủ sau khi đăng nhập thành công
          router.push('/')
          
          return { success: true }
        } else {
          throw new Error(response.data.message || 'Đăng nhập thất bại')
        }
      } catch (error) {
        console.error('Đăng nhập thất bại:', error)
        this.error = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
        
        // Thêm thông báo lỗi đăng nhập
        localStorage.setItem('notification', JSON.stringify({
          type: 'error',
          message: this.error,
          show: true
        }))
        
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
          // Thêm thông báo đăng ký thành công
          const successMessage = 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.'
          localStorage.setItem('notification', JSON.stringify({
            type: 'success',
            message: successMessage,
            show: true
          }))
          
          // Đăng ký thành công, chuyển hướng về trang kích hoạt
          return { success: true, message: successMessage }
        } else {
          throw new Error(response.data.message || 'Đăng ký thất bại')
        }
      } catch (error) {
        console.error('Đăng ký thất bại:', error)
        this.error = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
        
        // Thêm thông báo lỗi đăng ký
        localStorage.setItem('notification', JSON.stringify({
          type: 'error',
          message: this.error,
          show: true
        }))
        
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
            await this.updateUserFromToken()
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
    
    updateUserFromToken() {
      if (!this.token) return null
      
      try {
        const decoded = this.decodedToken
        if (!decoded) {
          console.error('Không thể giải mã token')
          return null
        }
        
        console.log('Sử dụng thông tin từ token:', decoded)
        
        // Cập nhật thông tin user từ token
        this.user = {
          username: decoded.username || decoded.email || localStorage.getItem('username'),
          user_id: decoded.user_id,
          is_active: decoded.is_active,
          is_admin: decoded.role === 'admin',
          is_recruiter: decoded.role === 'employer',
          is_applicant: decoded.role === 'candidate' || decoded.role === 'Người tìm việc'
        }
        
        console.log('User object after setting from token:', this.user)
        
        // Nếu tài khoản chưa kích hoạt, xử lý tương tự fetchCurrentUser
        if (!this.isActivated) {
          this.error = 'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản.'
          router.push({
            name: 'Activate',
            params: { email: this.user.username }
          })
        }
        
        return this.user
      } catch (error) {
        console.error('Lỗi khi cập nhật thông tin từ token:', error)
        return null
      }
    },
    
    logout(redirect = true) {
      this.user = null
      this.token = null
      
      // Xóa dữ liệu từ localStorage
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