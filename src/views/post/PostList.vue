<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Xác nhận xóa</h3>
        <p class="text-gray-500 mb-6">Bạn có chắc chắn muốn xóa tin tuyển dụng này? Hành động này không thể hoàn tác.</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            @click="deletePost(selectedPost)"
            class="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>

    <!-- Success/Error Notification -->
    <div v-if="showNotification" class="fixed top-4 right-4 z-50">
      <div :class="[
        'rounded-lg p-4 shadow-lg',
        notificationType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      ]">
        <div class="flex items-center">
          <i :class="[
            'mr-2',
            notificationType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'
          ]"></i>
          <span>{{ notificationMessage }}</span>
        </div>
      </div>
    </div>

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
                  <button
                    @click="confirmDelete(post)"
                    class="text-gray-400 hover:text-red-500"
                    title="Xóa"
                  >
                    <i class="fas fa-trash"></i>
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
const showDeleteModal = ref(false)
const selectedPost = ref(null)
const showNotification = ref(false)
const notificationType = ref('')
const notificationMessage = ref('')

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
      posts.value = result.data.data.results || []
      pagination.value = {
        currentPage: result.data.data.page || 1,
        totalPages: result.data.data.total_pages || 1,
        totalItems: result.data.data.total || 0,
        pageSize: result.data.data.page_size || 10
      }
    }
  } catch (err) {
    console.error('Error loading posts:', err)
  } finally {
    loading.value = false
  }
}

// Edit post
const editPost = (post) => {
  console.log(post)
  router.push({
    name: 'EditPost',
    params: { id: post.id }
  })
}

// Delete post
const confirmDelete = (post) => {
  selectedPost.value = post
  showDeleteModal.value = true
}

const showNotificationMessage = (type, message) => {
  notificationType.value = type
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

const deletePost = async (post) => {
  try {
    showDeleteModal.value = false
    const result = await postStore.deletePost(post.id)
    if (result.success) {
      showNotificationMessage('success', 'Xóa tin tuyển dụng thành công')
      await loadPosts()
    } else {
      showNotificationMessage('error', result.error || 'Có lỗi xảy ra khi xóa tin tuyển dụng')
    }
  } catch (err) {
    console.error('Error deleting post:', err)
    showNotificationMessage('error', 'Có lỗi xảy ra khi xóa tin tuyển dụng')
  }
}

// Thêm state pagination
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  pageSize: 10
})

// Load posts when component is mounted
onMounted(loadPosts)
</script> 