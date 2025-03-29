import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null,
    loading: false,
    error: null
  }),

  getters: {
    fullName: (state) => state.profile?.fullname || '',
    gender: (state) => state.profile?.gender || '',
    email: (state) => state.profile?.email || '',
    phoneNumber: (state) => state.profile?.phone || ''
  },

  actions: {
    // Lấy thông tin hồ sơ người dùng
    async fetchProfile() {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()
        const token = authStore.token

        const response = await axios.get('/api/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        console.log('Dữ liệu profile từ API:', response.data)
        if (response.data.status === 200) {
          this.profile = response.data.data;
          return { success: true, data: this.profile }
        } else {
          throw new Error(response.data.message || 'Không thể lấy thông tin hồ sơ')
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin hồ sơ:', error)
        this.error = error.response?.data?.message || 'Không thể lấy thông tin hồ sơ. Vui lòng thử lại.'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Cập nhật thông tin hồ sơ
    async updateProfile(profileData) {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()
        const token = authStore.token
        console.log('Dữ liệu gửi đi:', profileData)
        
        // Đảm bảo profile đã được lấy về trước đó
        if (!this.profile || !this.profile.user) {
          await this.fetchProfile()
        }
        
        const response = await axios.put('/api/profile/update/', {
          fullname: profileData.fullname,
          gender: profileData.gender,
          user: this.profile.user // Thêm trường user ID từ profile hiện tại
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        console.log('Kết quả cập nhật:', response.data)

        if (response.data.status === 200) {
          // Cập nhật lại thông tin hồ sơ từ server
          await this.fetchProfile()
          
          // Thông báo cập nhật thành công
          localStorage.setItem('notification', JSON.stringify({
            type: 'success',
            message: 'Cập nhật thông tin hồ sơ thành công!',
            show: true
          }))
          
          return { success: true }
        } else {
          throw new Error(response.data.message || 'Cập nhật thông tin hồ sơ thất bại')
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật hồ sơ:', error)
        console.error('Chi tiết lỗi:', error.response?.data)
        this.error = error.response?.data?.message || 'Không thể cập nhật hồ sơ. Vui lòng thử lại.'
        
        // Thông báo lỗi
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

    // Đổi mật khẩu
    async changePassword(passwordData) {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()
        const token = authStore.token
        
        const response = await axios.post('/api/change-password/', {
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
          confirm_password: passwordData.confirmPassword
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.data.status === 200) {
          // Thông báo đổi mật khẩu thành công
          localStorage.setItem('notification', JSON.stringify({
            type: 'success',
            message: 'Đổi mật khẩu thành công!',
            show: true
          }))
          
          return { success: true }
        } else {
          throw new Error(response.data.message || 'Đổi mật khẩu thất bại')
        }
      } catch (error) {
        console.error('Lỗi khi đổi mật khẩu:', error)
        this.error = error.response?.data?.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.'
        
        // Thông báo lỗi
        localStorage.setItem('notification', JSON.stringify({
          type: 'error',
          message: this.error,
          show: true
        }))
        
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    }
  }
}) 