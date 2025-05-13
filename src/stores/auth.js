import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'
import socketService from '../services/socketService'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: null,
      token: localStorage.getItem('token') || null,
      loading: false,
      error: null,
    }
  },
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    
    // Thêm getter isLoggedIn để đảm bảo nhất quán với isAuthenticated
    isLoggedIn(state) {
      console.log('isLoggedIn getter called');
      // Kiểm tra cả token và thông tin người dùng
      return !!state.token && !!this.userInfo;
    },
    
    // Giải mã JWT token để lấy thông tin
    decodedToken() {
      if (!this.token) return null
      
      try {
        // Phân tích JWT token để lấy payload
        const base64Url = this.token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const decoded = JSON.parse(window.atob(base64))
        console.log('Decoded token:', decoded);
        return decoded
      } catch (e) {
        console.error('Lỗi khi giải mã JWT token:', e)
        return null
      }
    },
    
    userInfo() {
      if (this.user) return this.user
      const decoded = this.decodedToken
      if (!decoded) return null
      return {
        username: decoded.username || decoded.email || localStorage.getItem('username'),
        user_id: decoded.user_id,
        is_active: decoded.is_active,
        is_admin: decoded.role === 'admin',
        is_recruiter: decoded.role === 'employer',
        is_applicant: decoded.role === 'candidate'
      }
    },
    
    // Các getter dựa trên userInfo
    isActivated() {
      console.log('isActivated getter - userInfo:', this.userInfo);
      const user = this.userInfo;
      return user ? user.is_active === true : false;
    },
    
    isEmployer() {
      const user = this.userInfo;
      console.log('isEmployer getter - user:', user);
      return user && user.is_recruiter === true;
    },
    
    isCandidate() {
      const user = this.userInfo;
      console.log('isCandidate getter - user:', user, 'is_applicant:', user?.is_applicant);
      return user && user.is_applicant === true;
    },
    
    isAdmin() {
      const user = this.userInfo;
      return user && user.is_admin === true;
    },
    
    userFullName() {
      const user = this.userInfo
      if (!user) return ''
      return user.fullname
    },
    
    userRole() {
      const user = this.userInfo;
      if (!user) return null;
      return user.role;
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
          
          // Lưu username vào localStorage
          localStorage.setItem('username', credentials.email)
          
          // Cập nhật thông tin từ token
          this.updateUserFromToken()
          
          
          // Kiểm tra tài khoản đã kích hoạt chưa
          if (!this.isActivated) {
            this.error = 'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản.'
            return router.push({
              name: 'Activate',
              params: { email: credentials.email }
            })
          }
          
          // Thông báo đăng nhập thành công
          this.createNotification('success', 'Đăng nhập thành công!')
          
          // Khởi tạo kết nối WebSocket
          socketService.init();
          
          // Chuyển hướng tùy theo role của người dùng
          router.push('/')
          return { success: true }
        } else {
          throw new Error('Không nhận được token từ server')
        }
      } catch (error) {
        // Cải thiện xử lý lỗi để trả về thông tin lỗi cụ thể
        const errorDetails = this.handleError(error, 'Đăng nhập thất bại')
        return { success: false, errors: errorDetails.errors }
      } finally {
        this.loading = false
      }
    },
    
    async googleLogin() {
      this.loading = true;
      this.error = null;
      
      try {
        // Redirect to backend Google OAuth endpoint
        // The backend is configured to use social-django for Google OAuth
        window.location.href = 'http://localhost:8000/api/auth/google/login/';
      } catch (error) {
        console.error('Lỗi đăng nhập với Google:', error);
        this.error = 'Có lỗi xảy ra khi đăng nhập với Google';
        this.loading = false;
      }
    },
    
    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        // 1. Đăng ký tài khoản
        const response = await axios.post('/api/register/', {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          fullname: userData.fullname,
          gender: userData.gender,
          role: userData.role
        })
        
        if (response.data.status === 201) {
          // 2. Nếu là employer thì tạo doanh nghiệp
          if (userData.role === 'employer' && userData.enterprise) {
            try {
              // Gọi API login để lấy token
              const loginResponse = await axios.post('/api/login/', {
                username: userData.email,
                password: userData.password
              })

              if (loginResponse.data.status === 200) {
                const accessToken = loginResponse.data.data.access
                
                // Tạo doanh nghiệp với token vừa lấy được
                const enterpriseResponse = await axios.post('/api/enterprises/create/', 
                  {
                    company_name: userData.enterprise.company_name,
                    address: userData.enterprise.address
                  },
                  {
                    headers: {
                      'Authorization': `Bearer ${accessToken}`
                    }
                  }
                )
                
                if (enterpriseResponse.data.status === 201) {
                  this.createNotification('success', 'Đăng ký thành công!')
                  return { success: true }
                }
              }
            } catch (error) {
              console.error('Lỗi khi tạo doanh nghiệp:', error)
              this.createNotification('error', 'Đăng ký tài khoản thành công nhưng không thể tạo doanh nghiệp. Vui lòng tạo doanh nghiệp sau.')
              return { success: true } // Vẫn return success vì tài khoản đã tạo được
            }
          }
          
          this.createNotification('success', 'Đăng ký thành công!')
          return { success: true }
        } else {
          throw new Error(response.data.message || 'Đăng ký thất bại')
        }
      } catch (error) {
        console.error('Đăng ký thất bại:', error)
        // Cải thiện xử lý lỗi để trả về thông tin lỗi cụ thể
        const errorDetails = this.handleError(error, 'Đăng ký thất bại')
        return { success: false, error: this.error, errors: errorDetails.errors }
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
      try {
        console.log('Đang cập nhật thông tin từ token');
        // Lấy token từ localStorage nếu cần
        if (!this.token) {
          this.token = localStorage.getItem('token');
          console.log('Lấy token từ localStorage:', !!this.token);
        }
        
        if (!this.token) {
          console.log('Không có token để cập nhật thông tin người dùng');
          return false;
        }
        
        // Giải mã token
        const decoded = this.decodedToken;
        
        if (!decoded) {
          console.error('Không thể giải mã token');
          return false;
        }
        
        // Kiểm tra token đã hết hạn chưa
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && currentTime >= decoded.exp) {
          console.log('Token đã hết hạn khi cập nhật thông tin');
          return false;
        }
        
        console.log('Thông tin token được giải mã:', JSON.stringify(decoded));
        
        // Cập nhật thông tin user
        this.user = {
          user_id: decoded.user_id,
          is_active: decoded.is_active === true,
          is_admin: decoded.role === 'admin',
          is_recruiter: decoded.role === 'employer',
          is_applicant: decoded.role === 'candidate',
          role: decoded.role
        };
        
        // Cập nhật _userRole từ token và lưu vào localStorage
        if (decoded.role) {
          console.log('updateUserFromToken: Role từ token:', decoded.role);
          this.setUserRole(decoded.role);
          console.log('updateUserFromToken: Role từ token đã được lưu:', decoded.role);
        }
        
        console.log('Đã cập nhật thông tin người dùng từ token:', this.user);
        
        // Kiểm tra trạng thái kích hoạt
        if (decoded.is_active === false) {
          console.log('Tài khoản chưa được kích hoạt');
          return false;
        }
        
        // Tải thông tin profile từ API để lấy trạng thái Premium
        this.fetchUserProfile();
        
        return true;
      } catch (error) {
        console.error('Lỗi khi cập nhật thông tin từ token:', error);
        return false;
      }
    },
    
    // Thêm phương thức tải thông tin profile từ API
    async fetchUserProfile() {
      try {
        if (!this.token) return;
        
        console.log('Đang tải thông tin profile từ API...');
        const response = await axios.get('/api/profile/');
        
        if (response.data.status === 200 && response.data.data) {
          const profileData = response.data.data;
          console.log('Đã tải thông tin profile:', profileData);
          
          // Cập nhật thông tin Premium vào user
          this.user = {
            ...this.user,
            is_premium: profileData.is_premium === true,
            premium_expiry: profileData.premium_expiry,
            fullname: profileData.fullname,
            email: profileData.email,
            gender: profileData.gender,
            balance: profileData.balance,
            name_display: profileData.name_display
          };
          
          console.log('Đã cập nhật thông tin Premium:', this.user.is_premium);
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin profile:', error);
      }
    },
    
    logout(redirect = true) {
      // Đóng kết nối WebSocket khi đăng xuất
      socketService.disconnect();
      
      // Xóa thông tin người dùng
      this.token = null;
      this.user = null;
      this._userRole = null;
      
      // Xóa sạch tất cả dữ liệu người dùng trong localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      localStorage.removeItem('user_role');
      
      // Xóa thêm các dữ liệu khác có thể liên quan đến phiên làm việc
      localStorage.removeItem('saved_posts');
      localStorage.removeItem('recent_searches');
      localStorage.removeItem('job_view_history');
      
      // Tạo thông báo đăng xuất thành công
      this.createNotification('success', 'Đăng xuất thành công!');
      
      // Chuyển hướng về trang đăng nhập
      if (redirect) {
        router.push('/login');
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
        if (!refreshToken) {
          console.log('Không tìm thấy refresh token');
          return false;
        }
        
        // Thử giải mã refresh token để kiểm tra thời hạn
        try {
          // Phân tích JWT token để lấy payload
          const base64Url = refreshToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const decoded = JSON.parse(window.atob(base64));
          
          // Kiểm tra thời hạn
          const currentTime = Math.floor(Date.now() / 1000);
          if (decoded.exp && currentTime >= decoded.exp) {
            console.log('Refresh token đã hết hạn');
            this.createNotification('error', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
            this.logout(true);
            return false;
          }
        } catch (decodeError) {
          console.log('Không thể giải mã refresh token, tiếp tục thử refresh');
        }
        
        // Xác định baseURL dựa trên môi trường
        let baseURL;
        // Nếu đang ở môi trường production
        if (import.meta.env.PROD) {
          baseURL = import.meta.env.VITE_API_URL || 'https://api.tuyendungtlu.site';
        } else {
          // Môi trường development
          baseURL = 'http://127.0.0.1:8000';
        }
        
        // Sử dụng fetch thay vì axios để tránh gửi access token hết hạn trong header
        console.log('Gọi API refresh token bằng fetch...');
        console.log('Base URL được sử dụng:', baseURL);
        
        const response = await fetch(`${baseURL}/api/token-refresh/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refresh: refreshToken
          })
        });
        
        const data = await response.json();
        console.log('Phản hồi token refresh:', data);
        
        if (response.ok && data.status === 200) {
          const newToken = data.data.access;
          this.token = newToken;
          localStorage.setItem('token', newToken);
          
          // Decode token mới để kiểm tra
          const decoded = this.decodedToken;
          
          // Cập nhật thông tin người dùng từ token mới
          this.updateUserFromToken();
          
          return true;
        }
        
        // Nếu response không ok hoặc status khác 200
        if (data.code === 'token_not_valid') {
          console.log('Refresh token không hợp lệ');
          this.createNotification('error', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
          this.logout(true);
        }
        
        return false;
      } catch (error) {
        console.error('Lỗi khi refresh token:', error);
        // Đảm bảo gọi logout cho mọi loại lỗi khi refresh token
        console.log('Đăng xuất do lỗi khi refresh token');
        this.createNotification('error', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        this.logout(true);
        return false;
      }
    },
    
    redirectAfterLogin() {
      // Implement the logic to redirect based on user role
      if (this.isAdmin) {
        return router.push('/admin')
      } else if (this.isEmployer) {
        return router.push('/employer')
      } else if (this.isCandidate) {
        return router.push('/job-search')
      } else {
        return router.push('/')
      }
    },
    
    createNotification(type, message) {
      localStorage.setItem('notification', JSON.stringify({
        type: type,
        message: message,
        show: true
      }))
    },
    
    handleError(error, defaultMessage) {
      console.error(`Error: ${defaultMessage}`, error)
      let errorMessage = defaultMessage
      let fieldErrors = {}
      
      if (error.response) {
        // Phản hồi từ server với status code không thành công
        const data = error.response.data
        
        // Nếu có trường message trong phản hồi, sử dụng nó
        if (data.message) {
          errorMessage = data.message
        }
        
        // Nếu có trường errors, lưu lại để hiển thị lỗi cụ thể cho từng trường
        if (data.errors) {
          fieldErrors = data.errors
          console.log('Server returned field errors:', data.errors)
        }
      } else if (error.request) {
        // Yêu cầu đã được gửi nhưng không nhận được phản hồi
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.'
      }
      
      this.error = errorMessage
      
      return {
        message: errorMessage,
        errors: fieldErrors
      }
    },
    
    // Thêm một action mới để kiểm tra tính hợp lệ của token và thời hạn token
    async checkTokenValidity() {
      console.log('Đang kiểm tra tính hợp lệ của token...');
      
      try {
        if (!this.token) {
          console.log('Không có token, không cần kiểm tra');
          return false;
        }
        
        // Lấy decoded token để kiểm tra thời hạn
        const decoded = this.decodedToken;
        if (!decoded || !decoded.exp) {
          console.log('Token không hợp lệ hoặc không có thời hạn');
          this.createNotification('error', 'Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại');
          this.logout(true);
          return false;
        }
        
        // Kiểm tra access token đã hết hạn chưa
        const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (giây)
        const tokenExp = decoded.exp; // Thời gian hết hạn của token (giây)
        
        console.log('Token expires at:', new Date(tokenExp * 1000).toLocaleString());
        console.log('Current time:', new Date(currentTime * 1000).toLocaleString());
        
        // Kiểm tra refresh token hết hạn chưa
        const refreshToken = localStorage.getItem('refreshToken');
        let refreshTokenExpiry = null;
        let shouldRefreshEarly = false;
        
        if (!refreshToken) {
          console.log('Không tìm thấy refresh token');
          this.createNotification('error', 'Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại');
          this.logout(true);
          return false;
        }
        
        try {
          // Giải mã refresh token để lấy thời hạn
          const base64Url = refreshToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const decodedRefresh = JSON.parse(window.atob(base64));
          
          refreshTokenExpiry = decodedRefresh.exp;
          console.log('Refresh token expires at:', new Date(refreshTokenExpiry * 1000).toLocaleString());
          
          // Kiểm tra nếu refresh token đã hết hạn
          if (refreshTokenExpiry && currentTime >= refreshTokenExpiry) {
            console.log('Refresh token đã hết hạn');
            this.createNotification('error', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
            this.logout(true);
            return false;
          }
          
          // Nếu refresh token cũng sắp hết hạn (còn dưới 1 ngày), hiển thị thông báo
          if (refreshTokenExpiry - currentTime < 86400) { // 86400 giây = 1 ngày
            console.log('Refresh token sắp hết hạn');
            // Tạo thông báo phiên làm việc sắp hết hạn, cần đăng nhập lại
            this.createNotification('warning', 'Phiên làm việc của bạn sẽ hết hạn trong vòng 24 giờ tới. Vui lòng đăng nhập lại để tiếp tục sử dụng.');
            shouldRefreshEarly = true;
          }
        } catch (error) {
          console.error('Lỗi khi giải mã refresh token:', error);
          this.createNotification('error', 'Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại');
          this.logout(true);
          return false;
        }
        
        // Nếu access token gần hết hạn (còn dưới 5 phút) hoặc đã hết hạn, thử refresh
        // Hoặc refresh sớm nếu refresh token sắp hết hạn
        if (tokenExp - currentTime < 300 || currentTime >= tokenExp || shouldRefreshEarly) {
          console.log('Token đã hết hạn hoặc gần hết hạn, thử refresh token...');
          const refreshed = await this.refreshToken();
          
          if (!refreshed) {
            console.log('Không thể refresh token, tiến hành đăng xuất');
            this.createNotification('error', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
            this.logout(true);
            return false;
          }
          
          console.log('Đã refresh token thành công');
          return true;
        }
        
        console.log('Token vẫn còn hiệu lực');
        return true;
      } catch (error) {
        console.error('Lỗi khi kiểm tra token:', error);
        this.createNotification('error', 'Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại');
        this.logout(true);
        return false;
      }
    },
    
    // Thêm method để set userRole
    setUserRole(role) {
      console.log('setUserRole called with:', role);
      this._userRole = role;
      localStorage.setItem('user_role', role);
      console.log('_userRole sau khi set:', this._userRole);
    }
  }
}) 