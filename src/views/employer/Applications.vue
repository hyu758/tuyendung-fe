<template>
  <div class="applications-container">
    <!-- Tiêu đề và công cụ -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Quản lý ứng viên</h1>
      
      <div class="flex items-center space-x-2">
        <div class="relative">
          <input 
            type="text" 
            placeholder="Tìm kiếm ứng viên..." 
            class="border border-gray-300 rounded-md pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
        
        <div>
          <select class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả vị trí</option>
            <option value="frontend">Frontend Developer</option>
            <option value="backend">Backend Developer</option>
            <option value="fullstack">Full Stack Developer</option>
            <option value="ui-ux">UI/UX Designer</option>
          </select>
        </div>
        
        <div>
          <select class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả trạng thái</option>
            <option value="new">Mới</option>
            <option value="screening">Đang xem xét</option>
            <option value="interviewing">Đang phỏng vấn</option>
            <option value="hired">Đã tuyển</option>
            <option value="rejected">Đã từ chối</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Bảng danh sách ứng viên -->
    <div class="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ứng viên
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
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Đánh giá
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(candidate, index) in candidates" :key="index">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <i class="fas fa-user text-gray-500"></i>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ candidate.name }}</div>
                  <div class="text-sm text-gray-500">{{ candidate.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ candidate.position }}</div>
              <div class="text-xs text-gray-500">{{ candidate.department }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ candidate.appliedDate }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                :class="getStatusClass(candidate.status)"
              >
                {{ getStatusText(candidate.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex text-gray-400">
                <i class="fas fa-star" :class="{ 'text-yellow-400': candidate.rating >= 1 }"></i>
                <i class="fas fa-star" :class="{ 'text-yellow-400': candidate.rating >= 2 }"></i>
                <i class="fas fa-star" :class="{ 'text-yellow-400': candidate.rating >= 3 }"></i>
                <i class="fas fa-star" :class="{ 'text-yellow-400': candidate.rating >= 4 }"></i>
                <i class="fas fa-star" :class="{ 'text-yellow-400': candidate.rating >= 5 }"></i>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <button class="text-blue-600 hover:text-blue-900">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="text-green-600 hover:text-green-900">
                  <i class="fas fa-calendar-alt"></i>
                </button>
                <button class="text-red-600 hover:text-red-900">
                  <i class="fas fa-times-circle"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Phân trang -->
    <div class="flex justify-between items-center mt-4">
      <div class="text-sm text-gray-700">
        Hiển thị <span class="font-medium">1</span> đến <span class="font-medium">10</span> trong số <span class="font-medium">{{ candidates.length }}</span> ứng viên
      </div>
      <div class="flex space-x-2">
        <button class="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-500 hover:bg-gray-50">
          Trước
        </button>
        <button class="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-500 hover:bg-gray-50">
          Tiếp
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNotificationStore } from '../../stores/notification'

// Add notification store
const notificationStore = useNotificationStore()

const candidates = ref([
  {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    position: 'Frontend Developer',
    department: 'Công nghệ',
    appliedDate: '15/03/2023',
    status: 'new',
    rating: 4
  },
  {
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    position: 'UI/UX Designer',
    department: 'Thiết kế',
    appliedDate: '14/03/2023',
    status: 'screening',
    rating: 5
  },
  {
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    position: 'Full Stack Developer',
    department: 'Công nghệ',
    appliedDate: '12/03/2023',
    status: 'interviewing',
    rating: 3
  },
  {
    name: 'Phạm Thị D',
    email: 'phamthid@example.com',
    position: 'Product Manager',
    department: 'Sản phẩm',
    appliedDate: '10/03/2023',
    status: 'rejected',
    rating: 2
  },
  {
    name: 'Hoàng Văn E',
    email: 'hoangvane@example.com',
    position: 'Backend Developer',
    department: 'Công nghệ',
    appliedDate: '08/03/2023',
    status: 'hired',
    rating: 5
  },
  {
    name: 'Vũ Thị F',
    email: 'vuthif@example.com',
    position: 'Frontend Developer',
    department: 'Công nghệ',
    appliedDate: '05/03/2023',
    status: 'interviewing',
    rating: 4
  }
])

function getStatusClass(status) {
  switch(status) {
    case 'new': return 'bg-blue-100 text-blue-800';
    case 'screening': return 'bg-yellow-100 text-yellow-800';
    case 'interviewing': return 'bg-purple-100 text-purple-800';
    case 'hired': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getStatusText(status) {
  switch(status) {
    case 'new': return 'Mới';
    case 'screening': return 'Đang xem xét';
    case 'interviewing': return 'Phỏng vấn';
    case 'hired': return 'Đã tuyển';
    case 'rejected': return 'Từ chối';
    default: return 'Không xác định';
  }
}

// Xem CV
const viewCV = async (application) => {
  // Existing code for viewing CV...
  
  // Gửi thông báo đã xem CV cho ứng viên
  try {
    const jobLink = `/job-detail/${application.job_id}`;
    await notificationStore.createCVViewedNotification(
      application.id, 
      application.candidate_id,
      jobLink
    )
    console.log('Đã gửi thông báo xem CV');
  } catch (error) {
    console.error('Lỗi khi gửi thông báo xem CV:', error);
  }
}
</script>

<style scoped>
.applications-container {
  min-height: calc(100vh - 64px);
}
</style> 