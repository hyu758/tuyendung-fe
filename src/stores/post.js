import { defineStore } from 'pinia'
import axios from 'axios'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [],
    currentPost: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchPosts() {
      try {
        this.loading = true
        const response = await axios.get('/api/posts/')
        this.posts = response.data
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách tin tuyển dụng'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async createPost(postData) {
      try {
        this.loading = true
        const response = await axios.post('/api/posts/create/', postData)
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.errors || 'Có lỗi xảy ra khi tạo tin tuyển dụng'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updatePost(id, postData) {
      try {
        this.loading = true
        const response = await axios.put(`/api/posts/${id}/`, postData)
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.errors || 'Có lỗi xảy ra khi cập nhật tin tuyển dụng'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async deletePost(id) {
      try {
        this.loading = true
        await axios.delete(`/api/posts/${id}`)
        this.posts = this.posts.filter(post => post.id !== id)
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Có lỗi xảy ra khi xóa tin tuyển dụng'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async fetchPostById(id) {
      try {
        this.loading = true
        const response = await axios.get(`/api/posts/${id}`)
        this.currentPost = response.data
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin tin tuyển dụng'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    }
  }
}) 