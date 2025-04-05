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
    async fetchPosts(page = 1, pageSize = 10) {
      try {
        this.loading = true
        const response = await axios.get(`/api/posts?page=${page}&page_size=${pageSize}`)
        return {
          success: true,
          data: response.data
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
        return {
          success: false,
          error: error.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách tin tuyển dụng'
        }
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
        const url = `/api/posts/${id}/delete/`;
        console.log("DELETE URL:", url);
        const response = await axios.delete(url);
        return {
          success: true,
          data: response.data
        }
      } catch (error) {
        console.error('Error deleting post:', error)
        return {
          success: false,
          error: error.response?.data?.message || 'Có lỗi xảy ra khi xóa tin tuyển dụng'
        }
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