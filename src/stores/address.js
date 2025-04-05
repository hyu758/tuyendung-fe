import { defineStore } from 'pinia'

export const useAddressStore = defineStore('address', {
  state: () => ({
    provinces: [],
    selectedProvince: null,
    districts: [],
    loading: false,
    error: null
  }),

  getters: {
    getDistrictsByProvince: (state) => {
      if (!state.selectedProvince) return []
      const province = state.provinces.find(p => p.code === parseInt(state.selectedProvince))
      return province ? province.districts : []
    }
  },

  actions: {
    async fetchProvinces() {
      try {
        // Kiểm tra cache trong localStorage
        const cachedData = localStorage.getItem('provinces')
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData)
          // Cache có hiệu lực trong 24h
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
            this.provinces = data
            return { success: true, data }
          }
        }

        this.loading = true
        const response = await fetch('https://provinces.open-api.vn/api/?depth=2')
        const data = await response.json()
        
        // Lưu vào state
        this.provinces = data
        
        // Cache dữ liệu
        localStorage.setItem('provinces', JSON.stringify({
          data,
          timestamp: Date.now()
        }))

        return { success: true, data }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    setSelectedProvince(provinceCode) {
      const code = parseInt(provinceCode)
      this.selectedProvince = code
      const province = this.provinces.find(p => p.code === code)
      
      if (province) {
        this.districts = province.districts
      } else {
        this.districts = []
      }
    }
  }
}) 