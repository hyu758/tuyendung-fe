<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl transform transition-all">
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
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl transform transition-all">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ selectedPost?.is_active ? 'Ẩn bài đăng' : 'Hiển thị bài đăng' }}
        </h3>
        <p class="text-gray-600 mb-6" v-if="!selectedPost?.is_active && isDeadlinePassed(selectedPost)">
          Không thể kích hoạt tin tuyển dụng vì hạn ứng tuyển đã hết. Vui lòng cập nhật hạn ứng tuyển trước.
        </p>
        <p class="text-gray-600 mb-6" v-else>
          Bạn có chắc chắn muốn {{ selectedPost?.is_active ? 'ẩn' : 'hiển thị' }} bài đăng này?
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showStatusPopup = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 cursor-pointer"
          >
            Hủy
          </button>
          <template v-if="!selectedPost?.is_active && isDeadlinePassed(selectedPost)">
            <button
              @click="editDeadline(selectedPost)"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
            >
              Cập nhật hạn ứng tuyển
            </button>
          </template>
          <template v-else>
            <button
              @click="confirmToggleStatus"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
            >
              Xác nhận
            </button>
          </template>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h1 class="text-2xl font-bold text-gray-900">Danh sách tin tuyển dụng</h1>
        <router-link
          to="/employer/posts/create"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
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
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Tin tuyển dụng</th>
                <th class="px-2 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">CV</th>
                <th class="px-2 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Hạn ứng tuyển</th>
                <th class="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
                <td class="px-4 sm:px-6 py-4">
                  <div class="text-sm text-gray-900 font-medium">{{ post.title }}</div>
                  <div class="text-xs text-gray-500 mt-1">
                    <span>{{ formatDate(post.created_at) }}</span>
                    <span class="mx-1">•</span>
                    <span>{{ post.city }}</span>
                  </div>
                </td>
                <td class="px-2 sm:px-6 py-4 text-center text-sm text-gray-500 whitespace-nowrap">
                  <span class="inline-flex items-center justify-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                    {{ post.total_cvs }}
                  </span>
                </td>
                <td class="px-2 sm:px-6 py-4 text-center text-sm whitespace-nowrap">
                  <span :class="[
                    'text-xs font-medium px-2 py-1 rounded-full',
                    isDeadlinePassed(post) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  ]">
                    {{ formatDate(post.deadline) }}
                  </span>
                </td>
                <td class="px-4 sm:px-6 py-4 text-center text-sm whitespace-nowrap">
                  <div class="flex flex-wrap justify-center gap-1 sm:gap-3">
                    <button
                      @click="post.is_active ? null : editPost(post)"
                      class="text-gray-400 transition-colors duration-200 p-1.5"
                      :class="{
                        'hover:text-blue-500 cursor-pointer': !post.is_active,
                        'opacity-50 cursor-not-allowed': post.is_active
                      }"
                      :title="post.is_active ? 'Không thể chỉnh sửa bài đăng đang hoạt động' : 'Chỉnh sửa'"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      @click="togglePostStatus(post)"
                      class="text-gray-400 hover:text-blue-500 transition-colors duration-200 cursor-pointer p-1.5"
                      :title="post.is_active ? 'Đang hoạt động' : isDeadlinePassed(post) ? 'Hạn ứng tuyển đã hết' : 'Đã ẩn'"
                    >
                      <i :class="[
                        post.is_active ? 'fas fa-toggle-on text-green-500' : 'fas fa-toggle-off text-gray-400',
                        isDeadlinePassed(post) && !post.is_active ? 'text-red-400' : ''
                      ]"></i>
                    </button>
                    <button
                      class="text-gray-400 hover:text-blue-500 transition-colors duration-200 cursor-pointer p-1.5"
                      title="Xem chi tiết"
                      @click="viewCVList(post)"
                    >
                      <i class="fas fa-file-alt"></i>
                    </button>
                    <button
                      @click="post.is_active ? null : confirmDelete(post)"
                      class="text-gray-400 transition-colors duration-200 p-1.5"
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
        
        <!-- Phân trang -->
        <div v-if="pagination.totalPages > 1" class="px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between bg-gray-50">
          <div class="text-sm text-gray-700 mb-2 sm:mb-0">
            Hiển thị <span class="font-medium">{{ (pagination.currentPage - 1) * pagination.pageSize + 1 }}</span> đến 
            <span class="font-medium">{{ Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems) }}</span> của 
            <span class="font-medium">{{ pagination.totalItems }}</span> bài đăng
          </div>
          <div class="flex space-x-1">
            <button 
              @click="changePage(pagination.currentPage - 1)"
              :disabled="pagination.currentPage === 1"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button 
              v-for="page in getPageNumbers()" 
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-3 py-1 border rounded-md text-sm',
                page === pagination.currentPage
                  ? 'bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
            <button 
              @click="changePage(pagination.currentPage + 1)"
              :disabled="pagination.currentPage === pagination.totalPages"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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

// Kiểm tra deadline
const isDeadlinePassed = (post) => {
  if (!post || !post.deadline) return false;
  
  const deadline = new Date(post.deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
  
  return deadline < today;
};

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

// Lấy các số trang để hiển thị
const getPageNumbers = () => {
  const total = pagination.value.totalPages;
  const current = pagination.value.currentPage;
  
  if (total <= 5) {
    // Hiển thị tất cả trang nếu có ít hơn 5 trang
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  
  // Chiến lược hiển thị các trang gần trang hiện tại
  if (current <= 3) {
    // Gần đầu danh sách: 1, 2, 3, 4, 5
    return [1, 2, 3, 4, 5];
  } else if (current >= total - 2) {
    // Gần cuối danh sách: total-4, total-3, total-2, total-1, total
    return [total - 4, total - 3, total - 2, total - 1, total];
  } else {
    // Ở giữa: current-2, current-1, current, current+1, current+2
    return [current - 2, current - 1, current, current + 1, current + 2];
  }
};

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

// Thay đổi trang
const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.currentPage = page;
    loadPosts();
  }
};

// Edit post
const editPost = (post) => {
  router.push({
    name: 'EditPost',
    params: { id: post.id }
  })
}

// Chỉnh sửa deadline
const editDeadline = (post) => {
  showStatusPopup.value = false;
  router.push({
    name: 'EditPost',
    params: { id: post.id },
    query: { focus: 'deadline' }
  });
}

// View CV list
const viewCVList = (post) => {
  router.push({
    name: 'PostDetail',
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
    // Kiểm tra deadline trước khi kích hoạt
    if (!selectedPost.value.is_active && isDeadlinePassed(selectedPost.value)) {
      showNotificationMessage('error', 'Không thể kích hoạt vì hạn ứng tuyển đã hết')
      showStatusPopup.value = false
      return
    }
    
    const result = await postStore.togglePostStatus(selectedPost.value.id)
    if (result.success) {
      const index = posts.value.findIndex(p => p.id === selectedPost.value.id)
      if (index !== -1) {
        posts.value[index].is_active = !posts.value[index].is_active
      }
      
      showNotificationMessage('success', 
        posts.value[index].is_active ? 'Đã kích hoạt tin tuyển dụng' : 'Đã ẩn tin tuyển dụng'
      )
      
      showStatusPopup.value = false
    }
  } catch (error) {
    console.error('Error toggling post status:', error)
    showNotificationMessage('error', 'Có lỗi xảy ra khi thay đổi trạng thái tin tuyển dụng')
    showStatusPopup.value = false
  }
}

// Load posts when component is mounted
onMounted(loadPosts)
</script> 