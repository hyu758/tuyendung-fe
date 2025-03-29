<template>
  <div class="dashboard-container">
    <!-- Tiêu đề trang -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Bảng điều khiển nhà tuyển dụng</h1>
      <p class="text-gray-600 mt-1">Xin chào, quản lý tổng quan thông tin tuyển dụng của bạn</p>
    </div>

    <!-- Thống kê nhanh -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <i class="fas fa-bullhorn text-xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500 uppercase font-medium">Tin tuyển dụng</p>
            <p class="text-2xl font-semibold">{{ stats.jobs }}</p>
          </div>
        </div>
        <div class="mt-4 text-sm text-green-600">
          <i class="fas fa-arrow-up mr-1"></i>
          <span>{{ stats.jobsIncreasePercent }}% so với tháng trước</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <i class="fas fa-users text-xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500 uppercase font-medium">Ứng viên</p>
            <p class="text-2xl font-semibold">{{ stats.applications }}</p>
          </div>
        </div>
        <div class="mt-4 text-sm text-green-600">
          <i class="fas fa-arrow-up mr-1"></i>
          <span>{{ stats.applicationsIncreasePercent }}% so với tháng trước</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <i class="fas fa-eye text-xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500 uppercase font-medium">Lượt xem</p>
            <p class="text-2xl font-semibold">{{ stats.views }}</p>
          </div>
        </div>
        <div class="mt-4 text-sm text-green-600">
          <i class="fas fa-arrow-up mr-1"></i>
          <span>{{ stats.viewsIncreasePercent }}% so với tháng trước</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <i class="fas fa-handshake text-xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500 uppercase font-medium">Đã tuyển</p>
            <p class="text-2xl font-semibold">{{ stats.hired }}</p>
          </div>
        </div>
        <div class="mt-4 text-sm text-green-600">
          <i class="fas fa-arrow-up mr-1"></i>
          <span>{{ stats.hiredIncreasePercent }}% so với tháng trước</span>
        </div>
      </div>
    </div>

    <!-- Biểu đồ thống kê -->
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-800">Thống kê ứng viên</h2>
        <div class="flex space-x-2">
          <button class="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50">
            7 ngày
          </button>
          <button class="px-3 py-1 text-sm border border-gray-300 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            30 ngày
          </button>
          <button class="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50">
            1 năm
          </button>
        </div>
      </div>
      
      <div class="w-full h-64 flex items-center justify-center">
        <p class="text-gray-500">Biểu đồ đang tải...</p>
        <!-- Vị trí cho biểu đồ (sẽ được thêm vào trong tương lai) -->
      </div>
    </div>

    <!-- Tin tuyển dụng gần đây và ứng viên mới nhất -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Tin tuyển dụng gần đây -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-gray-800">Tin tuyển dụng gần đây</h2>
          <router-link 
            to="/employer/jobs" 
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Xem tất cả
          </router-link>
        </div>

        <div class="space-y-4">
          <div v-for="(job, index) in recentJobs" :key="index" class="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div class="flex justify-between">
              <div>
                <h3 class="font-medium text-gray-800">{{ job.title }}</h3>
                <p class="text-sm text-gray-500">{{ job.location }} • {{ job.type }}</p>
              </div>
              <div class="text-sm">
                <span 
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="getJobStatusClass(job.status)"
                >
                  {{ getJobStatusText(job.status) }}
                </span>
              </div>
            </div>
            <div class="flex justify-between items-center mt-3">
              <div class="text-sm text-gray-500">
                <i class="far fa-clock mr-1"></i> Đăng {{ job.postedDaysAgo }} ngày trước
              </div>
              <div class="text-sm text-gray-500">
                <i class="far fa-user mr-1"></i> {{ job.applications }} ứng viên
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ứng viên mới nhất -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-gray-800">Ứng viên mới nhất</h2>
          <router-link 
            to="/employer/applications" 
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Xem tất cả
          </router-link>
        </div>

        <div class="space-y-4">
          <div v-for="(candidate, index) in recentCandidates" :key="index" class="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div class="flex">
              <div class="flex-shrink-0 mr-3">
                <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <i class="fas fa-user text-gray-500"></i>
                </div>
              </div>
              <div class="flex-1">
                <div class="flex justify-between">
                  <h3 class="font-medium text-gray-800">{{ candidate.name }}</h3>
                  <span 
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="getCandidateStatusClass(candidate.status)"
                  >
                    {{ getCandidateStatusText(candidate.status) }}
                  </span>
                </div>
                <p class="text-sm text-gray-500">{{ candidate.position }}</p>
                <div class="flex justify-between items-center mt-2">
                  <div class="text-sm text-gray-500">
                    <i class="far fa-clock mr-1"></i> Ứng tuyển {{ candidate.appliedDaysAgo }} ngày trước
                  </div>
                  <button class="text-sm text-blue-600 hover:text-blue-800">
                    Xem hồ sơ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Dữ liệu giả định cho thống kê
const stats = ref({
  jobs: 12,
  jobsIncreasePercent: 25,
  applications: 87,
  applicationsIncreasePercent: 12,
  views: 1453,
  viewsIncreasePercent: 18,
  hired: 9,
  hiredIncreasePercent: 33
})

// Dữ liệu giả định cho tin tuyển dụng gần đây
const recentJobs = ref([
  {
    title: 'Frontend Developer',
    location: 'Hà Nội',
    type: 'Toàn thời gian',
    status: 'active',
    postedDaysAgo: 2,
    applications: 15
  },
  {
    title: 'UX/UI Designer',
    location: 'Hồ Chí Minh',
    type: 'Toàn thời gian',
    status: 'active',
    postedDaysAgo: 3,
    applications: 10
  },
  {
    title: 'Backend Developer',
    location: 'Đà Nẵng',
    type: 'Toàn thời gian',
    status: 'active',
    postedDaysAgo: 5,
    applications: 12
  },
  {
    title: 'Mobile Developer',
    location: 'Hà Nội',
    type: 'Toàn thời gian',
    status: 'expired',
    postedDaysAgo: 30,
    applications: 8
  }
])

// Dữ liệu giả định cho ứng viên mới nhất
const recentCandidates = ref([
  {
    name: 'Nguyễn Văn A',
    position: 'Frontend Developer',
    status: 'new',
    appliedDaysAgo: 1
  },
  {
    name: 'Trần Thị B',
    position: 'UX/UI Designer',
    status: 'screening',
    appliedDaysAgo: 2
  },
  {
    name: 'Lê Văn C',
    position: 'Backend Developer',
    status: 'interviewing',
    appliedDaysAgo: 3
  },
  {
    name: 'Phạm Thị D',
    position: 'Mobile Developer',
    status: 'hired',
    appliedDaysAgo: 5
  }
])

// Hàm lấy class style cho trạng thái công việc
function getJobStatusClass(status) {
  switch(status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'expired': return 'bg-red-100 text-red-800';
    case 'draft': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

// Hàm lấy text cho trạng thái công việc
function getJobStatusText(status) {
  switch(status) {
    case 'active': return 'Đang tuyển';
    case 'expired': return 'Hết hạn';
    case 'draft': return 'Bản nháp';
    default: return 'Không xác định';
  }
}

// Hàm lấy class style cho trạng thái ứng viên
function getCandidateStatusClass(status) {
  switch(status) {
    case 'new': return 'bg-blue-100 text-blue-800';
    case 'screening': return 'bg-yellow-100 text-yellow-800';
    case 'interviewing': return 'bg-purple-100 text-purple-800';
    case 'hired': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

// Hàm lấy text cho trạng thái ứng viên
function getCandidateStatusText(status) {
  switch(status) {
    case 'new': return 'Mới';
    case 'screening': return 'Đang xem xét';
    case 'interviewing': return 'Phỏng vấn';
    case 'hired': return 'Đã tuyển';
    case 'rejected': return 'Từ chối';
    default: return 'Không xác định';
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: calc(100vh - 64px);
}
</style> 