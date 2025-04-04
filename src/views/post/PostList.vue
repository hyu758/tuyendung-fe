<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Danh sách tin tuyển dụng</h1>
        <router-link
          to="/employer/posts/create"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <i class="fas fa-plus mr-2"></i>
          Tạo tin mới
        </router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- Empty state -->
      <div v-else-if="posts.length === 0" class="text-center py-12">
        <i class="fas fa-briefcase text-4xl text-gray-400 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900">Chưa có tin tuyển dụng nào</h3>
        <p class="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tạo tin tuyển dụng mới</p>
        <div class="mt-6">
          <router-link
            to="/employer/posts/create"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <i class="fas fa-plus mr-2"></i>
            Tạo tin mới
          </router-link>
        </div>
      </div>

      <!-- Posts list -->
      <div v-else class="bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vị trí</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tin tuyển dụng</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng CV</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="post in posts" :key="post.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ post.position }}</td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 font-medium">{{ post.title }}</div>
                <div class="text-sm text-gray-500">
                  <span class="text-xs text-gray-500">{{ formatDate(post.created_at) }}</span>
                  <span class="mx-1">•</span>
                  <span class="text-xs text-gray-500">{{ post.city }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-center text-sm text-gray-500">0</td>
              <td class="px-6 py-4 text-center text-sm">
                <div class="flex justify-center space-x-3">
                  <button
                    @click="editPost(post)"
                    class="text-gray-400 hover:text-blue-500"
                    title="Chỉnh sửa"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <div class="relative inline-block">
                    <button
                      class="text-gray-400 hover:text-blue-500"
                      title="Trạng thái"
                    >
                      <i class="fas fa-toggle-on"></i>
                    </button>
                  </div>
                  <button
                    class="text-gray-400 hover:text-blue-500"
                    title="Xem chi tiết"
                  >
                    <i class="fas fa-file-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '../../stores/post'

const router = useRouter()
const postStore = usePostStore()
const loading = ref(true)
const posts = ref([])

// Format date
const formatDate = (dateString) => {
  try {
    if (!dateString) return '';
    
    // Xử lý timezone
    const date = new Date(dateString.replace('+07:00', 'Z'));
    
    if (isNaN(date.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

// Load posts
const loadPosts = async () => {
  try {
    loading.value = true
    const result = await postStore.fetchPosts()
    if (result.success) {
      posts.value = result.data.data
      console.log(posts.value)
    }
  } catch (err) {
    console.error('Error loading posts:', err)
  } finally {
    loading.value = false
  }
}

// Edit post
const editPost = (post) => {
  postStore.currentPost = post
  router.push({
    name: 'EditPost',
    params: { id: post.id }
  })
}

// Load posts when component is mounted
onMounted(loadPosts)
</script> 