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
    async fetchPosts(page = 1, pageSize = 10, sort = "-created_at") {
      try {
        this.loading = true
        const response = await axios.get(`/api/posts?page=${page}&page_size=${pageSize}&sort=${sort}`)
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
    async fetchPostByEmployer(page = 1, pageSize = 10) {
      try {
        this.loading = true
        const response = await axios.get(`/api/posts/enterprise?page=${page}&page_size=${pageSize}`)
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
        const response = await axios.put(`/api/posts/update/${id}/`, postData)
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
        const url = `/api/posts/delete/${id}/`;
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
        const response = await axios.get(`/api/post/${id}`)
        this.currentPost = response.data
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin tin tuyển dụng'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async togglePostStatus(postId) {
      try {
        const response = await axios.put(`/api/post/${postId}/toggle-status/`)
        return {
          success: true,
          data: response.data
        }
      } catch (error) {
        console.error('Error toggling post status:', error)
        return {
          success: false,
          error: error.response?.data?.message || 'Có lỗi xảy ra khi thay đổi trạng thái bài đăng'
        }
      }
    },

    // Lấy danh sách tin đã lưu
    async fetchSavedPosts() {
      try {
        this.loading = true
        const response = await axios.get('/api/saved-posts/')
        return {
          success: true,
          data: response.data
        }
      } catch (error) {
        console.error('Error fetching saved posts:', error)
        return {
          success: false,
          error: error.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách tin đã lưu'
        }
      } finally {
        this.loading = false
      }
    },

    // Lưu tin tuyển dụng
    async savePost(postId) {
      try {
        const response = await axios.post('/api/saved-posts/save/', { post_id: postId })
        return {
          success: true,
          data: response.data
        }
      } catch (error) {
        console.error('Error saving post:', error)
        return {
          success: false,
          error: error.response?.data?.message || 'Có lỗi xảy ra khi lưu tin tuyển dụng'
        }
      }
    },

    // Xóa tin đã lưu theo ID của saved post
    async deleteSavedPost(savedPostId) {
      try {
        const response = await axios.delete(`/api/saved-posts/${savedPostId}/delete/`)
        return {
          success: true,
          data: response.data
        }
      } catch (error) {
        console.error('Error deleting saved post:', error)
        return {
          success: false,
          error: error.response?.data?.message || 'Có lỗi xảy ra khi xóa tin đã lưu'
        }
      }
    },

    // Xóa tin đã lưu theo ID của bài đăng
    async deleteSavedPostByPostId(postId) {
      try {
        const response = await axios.delete(`/api/saved-posts/post/${postId}/delete/`)
        return {
          success: true,
          data: response.data
        }
      } catch (error) {
        console.error('Error deleting saved post:', error)
        return {
          success: false,
          error: error.response?.data?.message || 'Có lỗi xảy ra khi xóa tin đã lưu'
        }
      }
    }
  }
}) 