import { defineStore } from 'pinia'
import axios from 'axios'

export const useJobStore = defineStore('job', {
  state: () => ({
    jobs: [],
    currentJob: null,
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      pageSize: 10
    }
  }),

  actions: {
    async fetchJobsByEnterprise(enterpriseId, page = 1, pageSize = 10) {
      try {
        this.loading = true
        const response = await axios.get(`/api/posts/enterprise/${enterpriseId}?page=${page}&page_size=${pageSize}`)
        this.jobs = response.data.data.results
        this.pagination = {
          currentPage: response.data.data.page,
          totalPages: response.data.data.total_pages,
          totalItems: response.data.data.total,
          pageSize: response.data.data.page_size
        }
        return { success: true, data: response.data }
      } catch (error) {
        console.error('Error fetching jobs:', error)
        this.error = error.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách việc làm'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async fetchJobById(id) {
      try {
        this.loading = true
        const response = await axios.get(`/api/posts/${id}`)
        this.currentJob = response.data.data
        return { success: true, data: response.data }
      } catch (error) {
        console.error('Error fetching job:', error)
        this.error = error.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin việc làm'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    }
  }
}) 