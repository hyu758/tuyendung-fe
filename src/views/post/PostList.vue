<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl transform transition-all">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Xác nhận xóa</h3>
        <p class="text-gray-500 mb-6">Bạn có chắc chắn muốn xóa tin tuyển dụng này? Hành động này không thể hoàn tác.</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 cursor-pointer"
          >
            Hủy
          </button>
          <button
            @click="deletePost(selectedPost)"
            class="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 cursor-pointer"
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

    <!-- Popup xác nhận -->
    <div v-if="showStatusPopup" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl transform transition-all">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ selectedPost?.is_active ? 'Ẩn bài đăng' : 'Hiển thị bài đăng' }}
        </h3>
        <p class="text-gray-600 mb-6">
          Bạn có chắc chắn muốn {{ selectedPost?.is_active ? 'ẩn' : 'hiển thị' }} bài đăng này?
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showStatusPopup = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 cursor-pointer"
          >
            Hủy
          </button>
          <button
            @click="confirmToggleStatus"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
          >
            Xác nhận
          </button>
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tin tuyển dụng</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng CV</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="post in posts" :key="post.id">
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
                    @click="post.is_active ? null : editPost(post)"
                    class="text-gray-400 transition-colors duration-200"
                    :class="{
                      'hover:text-blue-500 cursor-pointer': !post.is_active,
                      'opacity-50 cursor-not-allowed': post.is_active
                    }"
                    :title="post.is_active ? 'Không thể chỉnh sửa bài đăng đang hoạt động' : 'Chỉnh sửa'"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <div class="relative inline-block">
                    <button
                      @click="togglePostStatus(post)"
                      class="text-gray-400 hover:text-blue-500 transition-colors duration-200 cursor-pointer"
                      :title="post.is_active ? 'Đang hoạt động' : 'Đã ẩn'"
                    >
                      <i :class="post.is_active ? 'fas fa-toggle-on text-green-500' : 'fas fa-toggle-off text-gray-400'"></i>
                    </button>
                  </div>
                  <button
                    class="text-gray-400 hover:text-blue-500 transition-colors duration-200 cursor-pointer"
                    title="Xem chi tiết"
                  >
                    <i class="fas fa-file-alt"></i>
                  </button>
                  <button
                    @click="post.is_active ? null : confirmDelete(post)"
                    class="text-gray-400 transition-colors duration-200"
                    :class="{
                      'hover:text-red-500 cursor-pointer': !post.is_active,
                      'opacity-50 cursor-not-allowed': post.is_active
                    }"
                    :title="post.is_active ? 'Không thể xóa bài đăng đang hoạt động' : 'Xóa'"
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
const showStatusPopup = ref(false)

const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  pageSize: 10
})
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
    const result = await postStore.fetchPostByEmployer(pagination.value.currentPage, pagination.value.pageSize)
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


const togglePostStatus = (post) => {
  selectedPost.value = post
  showStatusPopup.value = true
}

const confirmToggleStatus = async () => {
  if (!selectedPost.value) return
  
  try {
    const result = await postStore.togglePostStatus(selectedPost.value.id)
    if (result.success) {
      // Cập nhật lại trạng thái trong danh sách
      const index = posts.value.findIndex(p => p.id === selectedPost.value.id)
      if (index !== -1) {
        posts.value[index].is_active = !posts.value[index].is_active
      }
      showStatusPopup.value = false
    }
  } catch (error) {
    console.error('Error toggling post status:', error)
  }
}

// Load posts when component is mounted
onMounted(loadPosts)
</script> 