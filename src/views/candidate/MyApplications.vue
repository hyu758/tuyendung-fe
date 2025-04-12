<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Đơn ứng tuyển của tôi</h1>
        <p class="text-gray-600 mt-1">Quản lý tất cả đơn ứng tuyển của bạn</p>
      </div>

      <!-- Thông báo lỗi -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
        <div class="flex items-center">
          <svg class="h-5 w-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <p class="font-medium">{{ errorMessage }}</p>
        </div>
        <p class="mt-2 text-sm">Vui lòng thử đăng nhập lại hoặc liên hệ quản trị viên nếu lỗi vẫn tiếp tục xảy ra.</p>
      </div>

      <!-- Thống kê tổng quan -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
          <h3 class="text-sm font-medium text-gray-500">Tổng đơn ứng tuyển</h3>
          <p class="text-2xl font-bold text-gray-900 mt-2">{{ statistics.total }}</p>
        </div>
        <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
          <h3 class="text-sm font-medium text-gray-500">Đang xử lý</h3>
          <p class="text-2xl font-bold text-yellow-600 mt-2">{{ statistics.pending }}</p>
        </div>
        <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
          <h3 class="text-sm font-medium text-gray-500">Đã duyệt</h3>
          <p class="text-2xl font-bold text-green-600 mt-2">{{ statistics.approved }}</p>
        </div>
        <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
          <h3 class="text-sm font-medium text-gray-500">Từ chối</h3>
          <p class="text-2xl font-bold text-red-600 mt-2">{{ statistics.rejected }}</p>
        </div>
      </div>

      <!-- Bộ lọc -->
      <div class="bg-white p-4 mb-6 rounded-md shadow-sm">
        <div class="flex flex-wrap items-center gap-4">
          <div class="w-full md:w-auto">
            <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select 
              id="status-filter" 
              v-model="filters.status" 
              class="border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Đang xử lý</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
          <div class="w-full md:w-auto">
            <label for="date-filter" class="block text-sm font-medium text-gray-700 mb-1">Ngày ứng tuyển</label>
            <select 
              id="date-filter" 
              v-model="filters.dateRange" 
              class="border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tất cả thời gian</option>
              <option value="last7days">7 ngày qua</option>
              <option value="last30days">30 ngày qua</option>
              <option value="last3months">3 tháng qua</option>
              <option value="last6months">6 tháng qua</option>
            </select>
          </div>
          <div class="w-full md:w-auto md:ml-auto mt-2 md:mt-0">
            <button 
              @click="resetFilters" 
              class="py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      <!-- Danh sách ứng tuyển -->
      <div class="bg-white rounded-md shadow-sm">
        <div v-if="isLoading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>

        <div v-else-if="applications.length === 0" class="p-8 text-center">
          <div class="mx-auto h-24 w-24 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="mt-2 text-lg font-medium text-gray-900">Không có đơn ứng tuyển</h3>
          <p class="mt-1 text-gray-500">Bạn chưa ứng tuyển công việc nào hoặc không có kết quả phù hợp với bộ lọc.</p>
          <div class="mt-6">
            <router-link to="/job-search" class="text-sm font-medium text-blue-600 hover:text-blue-500">
              Tìm việc ngay <span aria-hidden="true">→</span>
            </router-link>
          </div>
        </div>

        <div v-else>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin ứng tuyển
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vị trí ứng tuyển
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày ứng tuyển
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="application in filteredApplications" :key="application.id">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ application.name }}</div>
                  <div class="text-sm text-gray-500">{{ application.email }}</div>
                  <div class="text-sm text-gray-500">{{ application.phoneNumber }}</div>
                  <div v-if="application.cvFileUrl" class="mt-1">
                    <a :href="application.cvFileUrl" target="_blank" class="text-xs text-blue-600 hover:underline inline-flex items-center">
                      <svg class="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Xem CV
                    </a>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ application.jobTitle }}</div>
                  <div class="text-sm text-gray-500">{{ application.companyName }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(application.appliedAt) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full" :class="getStatusClass(application.status)">
                    {{ getStatusText(application.status) }}
                  </span>
                  <div v-if="application.note" class="mt-1">
                    <span class="text-xs text-gray-500">{{ application.note }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <router-link :to="`/job/${application.jobId}`" class="text-blue-600 hover:text-blue-900 mr-4">
                    Xem công việc
                  </router-link>
                  <button @click="viewDetails(application)" class="text-indigo-600 hover:text-indigo-900">
                    Chi tiết
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Phân trang -->
      <div v-if="applications.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-2 rounded-md shadow-sm">
        <div class="flex-1 flex justify-between sm:hidden">
          <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Trước
          </button>
          <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
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
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-600 hover:bg-blue-50 border-blue-500">
                1
              </button>
              <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Trang sau</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      <!-- Modal chi tiết -->
      <div v-if="selectedApplication" class="fixed inset-0 overflow-y-auto z-50" @click.self="closeModal">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl">
            <div class="flex justify-between items-start">
              <h3 class="text-xl font-bold text-gray-900">Chi tiết đơn ứng tuyển</h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div class="mt-4 space-y-4">
              <div>
                <h4 class="text-sm font-medium text-gray-500">Thông tin ứng viên</h4>
                <div class="mt-2 border-t border-gray-200 pt-2">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-600">Họ tên:</p>
                      <p class="text-sm font-medium">{{ selectedApplication.name }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Email:</p>
                      <p class="text-sm font-medium">{{ selectedApplication.email }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Số điện thoại:</p>
                      <p class="text-sm font-medium">{{ selectedApplication.phoneNumber }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Ngày ứng tuyển:</p>
                      <p class="text-sm font-medium">{{ formatDate(selectedApplication.appliedAt) }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500">Thông tin công việc</h4>
                <div class="mt-2 border-t border-gray-200 pt-2">
                  <div class="mb-3">
                    <p class="text-sm text-gray-600">Vị trí:</p>
                    <p class="text-sm font-medium">{{ selectedApplication.jobTitle }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Công ty:</p>
                    <p class="text-sm font-medium">{{ selectedApplication.companyName }}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500">Trạng thái</h4>
                <div class="mt-2 border-t border-gray-200 pt-2 flex items-center">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full mr-2" :class="getStatusClass(selectedApplication.status)">
                    {{ getStatusText(selectedApplication.status) }}
                  </span>
                  <span v-if="selectedApplication.isViewed" class="text-xs text-blue-600">
                    (Đã xem)
                  </span>
                  <span v-else class="text-xs text-gray-500">
                    (Chưa xem)
                  </span>
                </div>
                <div v-if="selectedApplication.note" class="mt-2">
                  <p class="text-sm text-gray-600">Ghi chú:</p>
                  <p class="text-sm mt-1 p-2 bg-gray-50 rounded">{{ selectedApplication.note }}</p>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500">Nội dung</h4>
                <div class="mt-2 border-t border-gray-200 pt-2">
                  <p class="text-sm whitespace-pre-wrap">{{ selectedApplication.description }}</p>
                </div>
              </div>
              <div v-if="selectedApplication.cvFileUrl" class="mt-4">
                <a :href="selectedApplication.cvFileUrl" target="_blank" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Xem CV đính kèm
                </a>
              </div>
            </div>
            <div class="mt-6 flex justify-end">
              <button @click="closeModal" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Lớp phủ cho modal -->
      <div v-if="selectedApplication" class="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
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
  console.log('Token hiện tại:', token ? 'Có token' : 'Không có token');
  
  try {
    console.log('Đang gọi API để lấy danh sách đơn ứng tuyển...');
    const response = await candidateService.getApplications();
    console.log('Phản hồi API:', response.data);
    
    // Dữ liệu trả về từ API sẽ nằm trong response.data.results
    applications.value = response.data.data.results.map(cv => ({
      id: cv.id,
      jobId: cv.post,
      jobTitle: cv.post_title || 'Vị trí ứng tuyển #' + cv.post,
      jobLocation: cv.post_location || 'Không xác định',
      companyName: cv.company_name || 'Công ty tuyển dụng',
      companyLogo: cv.company_logo || null,
      appliedAt: cv.created_at,
      status: cv.status,
      isViewed: cv.is_viewed,
      name: cv.name,
      email: cv.email,
      phoneNumber: cv.phone_number,
      description: cv.description,
      cvFileUrl: cv.cv_file_url,
      note: cv.note
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
  statistics.value = {
    total: applications.value.length,
    pending: applications.value.filter(app => app.status === 'pending').length,
    approved: applications.value.filter(app => app.status === 'approved').length,
    rejected: applications.value.filter(app => app.status === 'rejected').length
  };
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
      result = result.filter(app => new Date(app.appliedAt) >= startDate);
    }
  }

  // Sắp xếp theo ngày mới nhất
  return result.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
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

onMounted(() => {
  fetchApplications();
});
</script> 