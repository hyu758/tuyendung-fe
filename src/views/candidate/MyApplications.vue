<template>
  <div class="bg-gray-50 min-h-screen py-4 sm:py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="mb-4 sm:mb-6">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Đơn ứng tuyển của tôi</h1>
        <p class="text-sm sm:text-base text-gray-600 mt-1">Quản lý tất cả đơn ứng tuyển của bạn</p>
      </div>

      <!-- Thông báo lỗi -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 sm:mb-6 shadow-sm">
        <div class="flex items-center">
          <font-awesome-icon icon="exclamation-circle" class="mr-2 text-red-500" />
          <p class="font-medium">{{ errorMessage }}</p>
        </div>
        <p class="mt-2 text-sm">Vui lòng thử đăng nhập lại hoặc liên hệ quản trị viên nếu lỗi vẫn tiếp tục xảy ra.</p>
      </div>

      <!-- Thống kê tổng quan -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex flex-col">
            <h3 class="text-xs sm:text-sm font-medium text-gray-500 mb-1">Tổng đơn</h3>
            <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ statistics.total }}</p>
          </div>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex flex-col">
            <h3 class="text-xs sm:text-sm font-medium text-gray-500 mb-1">Đang xử lý</h3>
            <p class="text-xl sm:text-2xl font-bold text-yellow-600">{{ statistics.pending }}</p>
          </div>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex flex-col">
            <h3 class="text-xs sm:text-sm font-medium text-gray-500 mb-1">Đã duyệt</h3>
            <p class="text-xl sm:text-2xl font-bold text-green-600">{{ statistics.approved }}</p>
          </div>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex flex-col">
            <h3 class="text-xs sm:text-sm font-medium text-gray-500 mb-1">Từ chối</h3>
            <p class="text-xl sm:text-2xl font-bold text-red-600">{{ statistics.rejected }}</p>
          </div>
        </div>
      </div>

      <!-- Bộ lọc -->
      <div class="bg-white p-4 mb-4 sm:mb-6 rounded-lg shadow-sm">
        <div class="flex flex-wrap items-end gap-4">
          <div class="w-full sm:w-auto">
            <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
            <select 
              id="status-filter" 
              v-model="filters.status" 
              class="border border-gray-300 rounded-lg p-2 w-full sm:w-auto focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Đang xử lý</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>

          <div class="w-full sm:w-auto sm:ml-auto">
            <button 
              @click="resetFilters" 
              class="w-full sm:w-auto py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center text-sm">
              <font-awesome-icon icon="redo-alt" class="mr-2" />
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      <!-- Danh sách ứng tuyển -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <!-- Loading state -->
        <div v-if="isLoading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="applications.length === 0" class="p-6 sm:p-8 text-center">
          <div class="mx-auto h-16 sm:h-24 w-16 sm:w-24 text-gray-400">
            <font-awesome-icon icon="file-alt" class="text-5xl sm:text-6xl" />
          </div>
          <h3 class="mt-2 text-base sm:text-lg font-medium text-gray-900">Không có đơn ứng tuyển</h3>
          <p class="mt-1 text-sm text-gray-500">Bạn chưa ứng tuyển công việc nào hoặc không có kết quả phù hợp với bộ lọc.</p>
          <div class="mt-4 sm:mt-6">
            <router-link to="/job-search" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <font-awesome-icon icon="search" class="mr-2" />
              Tìm việc ngay
            </router-link>
          </div>
        </div>

        <!-- Application list -->
        <div v-else>
          <div class="p-4">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-base sm:text-lg font-medium text-gray-900">Việc làm đã ứng tuyển</h2>
            </div>
            
            <div class="space-y-4">
              <div v-for="application in filteredApplications" :key="application.id" 
                   class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                   @click="viewDetails(application)">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12">
                      <img v-if="application.enterprise_logo" :src="application.enterprise_logo" 
                          :alt="application.enterprise_name" class="w-full h-full object-contain rounded-lg">
                      <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg text-gray-500">
                        {{ getCompanyInitials(application.enterprise_name) }}
                      </div>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">{{ application.post_title }}</h3>
                      <p class="text-xs sm:text-sm text-gray-600">{{ application.enterprise_name }}</p>
                    </div>
                  </div>
                  <div class="flex items-center justify-between sm:justify-end mt-2 sm:mt-0 w-full sm:w-auto">
                    <span class="px-2.5 py-1 text-xs rounded-full" :class="getStatusClass(application.status)">
                      {{ getStatusText(application.status) }}
                    </span>
                    <span class="text-xs text-gray-500 sm:ml-3">{{ formatDate(application.created_at) }}</span>
                  </div>
                </div>
                
                <div class="mt-3 pt-3 border-t border-gray-100">
                  <div class="flex flex-wrap gap-2 justify-end">
                    <a v-if="application.cv_file_url" 
                       :href="application.cv_file_url" 
                       target="_blank"
                       @click.stop
                       class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs sm:text-sm rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                      <font-awesome-icon icon="file-pdf" class="mr-1.5" />
                      CV
                    </a>
                    <button
                      @click.stop="chatWithEmployer(application.user)"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs sm:text-sm rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                      <font-awesome-icon icon="comment" class="mr-1.5" />
                      Nhắn tin
                    </button>
                    <router-link 
                      :to="{ name: 'JobDetail', params: { id: application.post } }"
                      @click.stop
                      class="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs sm:text-sm rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                      <font-awesome-icon icon="eye" class="mr-1.5" />
                      Xem việc làm
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Phân trang -->
      <div v-if="applications.length > 0" class="mt-4 bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 rounded-lg shadow-sm">
        <div class="flex-1 flex justify-between sm:hidden">
          <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
            Trước
          </button>
          <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
            Sau
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Hiển thị <span class="font-medium">1</span> đến <span class="font-medium">{{ filteredApplications.length }}</span> của <span class="font-medium">{{ applications.length }}</span> kết quả
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Trang trước</span>
                <font-awesome-icon icon="chevron-left" />
              </button>
              <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-600 hover:bg-blue-50 border-blue-500">
                1
              </button>
              <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Trang sau</span>
                <font-awesome-icon icon="chevron-right" />
              </button>
            </nav>
          </div>
        </div>
      </div>

      <!-- Modal chi tiết -->
      <div v-if="selectedApplication" class="fixed inset-0 overflow-y-auto z-50">
        <div class="flex items-center justify-center min-h-screen px-4 py-6 sm:p-0">
          <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>
          
          <div class="bg-white rounded-lg max-w-lg w-full mx-auto p-4 sm:p-6 shadow-xl transform transition-all relative">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-lg sm:text-xl font-bold text-gray-900">Chi tiết đơn ứng tuyển</h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
                <font-awesome-icon icon="times" class="text-xl" />
              </button>
            </div>
            
            <div class="overflow-y-auto max-h-[70vh] pr-1">
              <div class="space-y-5">
                <!-- Thông tin công việc -->
                <div class="bg-blue-50 p-3 rounded-lg">
                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12">
                      <img v-if="selectedApplication.enterprise_logo" :src="selectedApplication.enterprise_logo" 
                          :alt="selectedApplication.enterprise_name" class="w-full h-full object-contain rounded-lg bg-white p-1">
                      <div v-else class="w-full h-full bg-white flex items-center justify-center rounded-lg text-gray-500">
                        {{ getCompanyInitials(selectedApplication.enterprise_name) }}
                      </div>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm sm:text-base font-medium text-gray-900">{{ selectedApplication.post_title }}</h3>
                      <p class="text-xs sm:text-sm text-gray-600">{{ selectedApplication.enterprise_name }}</p>
                      <div class="flex items-center mt-1">
                        <span class="px-2 py-0.5 text-xs rounded-full mr-2" :class="getStatusClass(selectedApplication.status)">
                          {{ getStatusText(selectedApplication.status) }}
                        </span>
                        <span class="text-xs text-gray-500">
                          {{ formatDate(selectedApplication.created_at) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Thông tin ứng viên -->
                <div>
                  <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <font-awesome-icon icon="user" class="mr-2 text-blue-500" />
                    Thông tin ứng viên
                  </h4>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p class="text-xs text-gray-500">Họ tên:</p>
                        <p class="text-sm font-medium">{{ selectedApplication.name || 'Chưa cập nhật' }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Email:</p>
                        <p class="text-sm font-medium">{{ selectedApplication.email || 'Chưa cập nhật' }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Số điện thoại:</p>
                        <p class="text-sm font-medium">{{ selectedApplication.phoneNumber || 'Chưa cập nhật' }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Ngày ứng tuyển:</p>
                        <p class="text-sm font-medium">{{ formatDate(selectedApplication.created_at) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Trạng thái -->
                <div>
                  <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <font-awesome-icon icon="info-circle" class="mr-2 text-blue-500" />
                    Trạng thái đơn
                  </h4>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <div class="flex items-center">
                      <span class="px-2.5 py-1 text-xs rounded-full mr-2" :class="getStatusClass(selectedApplication.status)">
                        {{ getStatusText(selectedApplication.status) }}
                      </span>
                      <span v-if="selectedApplication.is_viewed" class="text-xs text-blue-600 flex items-center">
                        <font-awesome-icon icon="check-circle" class="mr-1" />
                        Đã xem
                      </span>
                      <span v-else class="text-xs text-gray-500 flex items-center">
                        <font-awesome-icon icon="clock" class="mr-1" />
                        Chưa xem
                      </span>
                    </div>
                    <div v-if="selectedApplication.note" class="mt-2 pt-2 border-t border-gray-200">
                      <p class="text-xs text-gray-500">Ghi chú:</p>
                      <p class="text-sm mt-1 p-2 bg-white rounded">{{ selectedApplication.note }}</p>
                    </div>
                  </div>
                </div>

                <!-- Nội dung -->
                <div v-if="selectedApplication.description">
                  <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <font-awesome-icon icon="file-alt" class="mr-2 text-blue-500" />
                    Nội dung đơn
                  </h4>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-sm whitespace-pre-wrap">{{ selectedApplication.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
              <div>
                <a v-if="selectedApplication.cv_file_url" 
                   :href="selectedApplication.cv_file_url" 
                   target="_blank" 
                   class="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                  <font-awesome-icon icon="file-pdf" class="mr-2" />
                  Xem CV đính kèm
                </a>
              </div>
              <div class="flex gap-3 justify-end">
                <button 
                  @click="chatWithEmployer(selectedApplication.user)"
                  class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                  <font-awesome-icon icon="comment" class="mr-2" />
                  Nhắn tin
                </button>
                <button 
                  @click="closeModal" 
                  class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { candidateService } from '../../services/api';

const router = useRouter();
const applications = ref([]);
const isLoading = ref(true);
const error = ref(false);
const errorMessage = ref('');
const selectedApplication = ref(null);
const filters = ref({
  status: '',
  dateRange: ''
});

const statistics = ref({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0
});

// Hàm lấy dữ liệu từ API
const fetchApplications = async () => {
  isLoading.value = true;
  error.value = false;
  errorMessage.value = '';
  
  // Kiểm tra token
  const token = localStorage.getItem('token');
  
  try {
    const response = await candidateService.getApplications();
    
    applications.value = response.data.data.results.map(app => ({
      ...app,
      jobId: app.post
    }));
    updateStatistics();
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu đơn ứng tuyển:', error);
    
    applications.value = [];
    statistics.value = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    };
    
    error.value = true;
    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage.value = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
          break;
        case 403:
          errorMessage.value = 'Bạn không có quyền truy cập danh sách ứng tuyển. Liên hệ quản trị viên.';
          break;
        case 404:
          errorMessage.value = 'Không tìm thấy dữ liệu ứng tuyển.';
          break;
        default:
          errorMessage.value = `Lỗi máy chủ: ${error.response.status}. Vui lòng thử lại sau.`;
      }
    } else if (error.request) {
      errorMessage.value = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
    } else {
      errorMessage.value = 'Đã xảy ra lỗi khi xử lý yêu cầu.';
    }
  } finally {
    isLoading.value = false;
  }
};

// Cập nhật thống kê
const updateStatistics = () => {
  // Đặt lại giá trị thống kê
  statistics.value = {
    total: applications.value.length,
    pending: 0,
    approved: 0,
    rejected: 0
  };
  
  // Tính toán số lượng đơn ứng tuyển theo trạng thái
  applications.value.forEach(app => {
    if (app.status === 'pending') {
      statistics.value.pending++;
    } else if (app.status === 'approved') {
      statistics.value.approved++;
    } else if (app.status === 'rejected') {
      statistics.value.rejected++;
    }
  });
};

// Lọc ứng dụng dựa trên bộ lọc
const filteredApplications = computed(() => {
  let result = [...applications.value];

  // Lọc theo trạng thái
  if (filters.value.status) {
    result = result.filter(app => app.status === filters.value.status);
  }

  // Lọc theo ngày
  if (filters.value.dateRange) {
    const now = new Date();
    let startDate;

    switch (filters.value.dateRange) {
      case 'last7days':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'last30days':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case 'last3months':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'last6months':
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
    }

    if (startDate) {
      result = result.filter(app => new Date(app.created_at) >= startDate);
    }
  }

  // Sắp xếp theo ngày mới nhất
  return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

// Đặt lại bộ lọc
const resetFilters = () => {
  filters.value = {
    status: '',
    dateRange: ''
  };
};

// Định dạng ngày
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

// Lấy chữ cái đầu của công ty để hiển thị khi không có logo
const getCompanyInitials = (companyName) => {
  if (!companyName) return '';
  return companyName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
};

// Lấy class CSS dựa trên trạng thái
const getStatusClass = (status) => {
  switch(status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'approved': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Chuyển đổi trạng thái thành văn bản tiếng Việt
const getStatusText = (status) => {
  switch(status) {
    case 'pending': return 'Đang xử lý';
    case 'approved': return 'Đã duyệt';
    case 'rejected': return 'Từ chối';
    default: return 'Không xác định';
  }
};

// Xem chi tiết đơn ứng tuyển
const viewDetails = (application) => {
  selectedApplication.value = application;
};

// Đóng modal
const closeModal = () => {
  selectedApplication.value = null;
};

// Chat với nhà tuyển dụng
const chatWithEmployer = (employerId) => {
  router.push({ 
    name: 'candidate-messages',
    query: { user: employerId }
  });
};

onMounted(() => {
  fetchApplications();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 