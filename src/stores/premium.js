import { defineStore } from 'pinia'
import { premiumService } from '../services/api'
import { useAuthStore } from './auth'

export const usePremiumStore = defineStore('premium', {
  state: () => ({
    packages: [],
    selectedPackage: null,
    loading: false,
    error: null,
    paymentUrl: null
  }),
  
  getters: {
    isPremium() {
      const authStore = useAuthStore()
      return authStore.user?.is_premium || false
    },
    
    premiumExpiry() {
      const authStore = useAuthStore()
      return authStore.user?.premium_expiry || null
    },
    
    isPremiumActive() {
      if (!this.isPremium) return false
      if (!this.premiumExpiry) return false
      
      const expiryDate = new Date(this.premiumExpiry)
      const now = new Date()
      return expiryDate > now
    },
    
    isPremiumExpired() {
      if (!this.isPremium) return false
      if (!this.premiumExpiry) return false
      
      const expiryDate = new Date(this.premiumExpiry)
      const now = new Date()
      return expiryDate <= now
    }
  },
  
  actions: {
    async fetchPremiumPackages() {
      this.loading = true
      this.error = null
      
      try {
        const response = await premiumService.getPremiumPackages()
        
        if (response.data.status === 200) {
          this.packages = response.data.data.packages
          return { success: true, data: response.data.data }
        } else {
          throw new Error('Không thể lấy thông tin gói Premium')
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Đã xảy ra lỗi khi lấy thông tin gói Premium'
        console.error('Error fetching premium packages:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async purchasePremium(packageId) {
      this.loading = true
      this.error = null
      this.paymentUrl = null
      
      try {
        const response = await premiumService.purchasePremium(packageId)
        
        if (response.data.status === 200) {
          this.paymentUrl = response.data.data.payment_url
          this.selectedPackage = response.data.data.package
          return { 
            success: true, 
            paymentUrl: this.paymentUrl,
            package: this.selectedPackage
          }
        } else {
          throw new Error('Không thể tạo URL thanh toán')
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Đã xảy ra lỗi khi tạo URL thanh toán'
        console.error('Error purchasing premium:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async checkPremiumExpiry() {
      // Kiểm tra xem Premium đã hết hạn chưa
      if (this.isPremiumExpired) {
        console.log('Premium đã hết hạn, đang hủy Premium...')
        return await this.cancelPremium()
      }
      return { success: true, active: this.isPremiumActive }
    },
    
    async cancelPremium() {
      this.loading = true
      this.error = null
      
      try {
        const response = await premiumService.deletePremium()
        
        if (response.data.status === 200) {
          // Cập nhật thông tin người dùng
          const authStore = useAuthStore()
          await authStore.updateUserFromToken()
          
          return { success: true, message: response.data.message }
        } else {
          throw new Error('Không thể hủy gói Premium')
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Đã xảy ra lỗi khi hủy gói Premium'
        console.error('Error canceling premium:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    reset() {
      this.selectedPackage = null
      this.paymentUrl = null
      this.error = null
    }
  }
}) 