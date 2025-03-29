<template>
  <div class="dashboard-container">
    <!-- Phần tổng quan -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
        <div class="flex items-center">
          <div class="rounded-full bg-blue-100 p-3 mr-4">
            <i class="fas fa-user-tie text-blue-600 text-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-700">Nhà tuyển dụng</h3>
            <p class="text-2xl font-bold text-gray-900">{{ stats.employers }}</p>
            <p class="text-sm text-green-600 flex items-center">
              <i class="fas fa-arrow-up mr-1"></i> {{ stats.employerGrowth }}% so với tháng trước
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
        <div class="flex items-center">
          <div class="rounded-full bg-green-100 p-3 mr-4">
            <i class="fas fa-users text-green-600 text-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-700">Ứng viên</h3>
            <p class="text-2xl font-bold text-gray-900">{{ stats.candidates }}</p>
            <p class="text-sm text-green-600 flex items-center">
              <i class="fas fa-arrow-up mr-1"></i> {{ stats.candidateGrowth }}% so với tháng trước
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
        <div class="flex items-center">
          <div class="rounded-full bg-purple-100 p-3 mr-4">
            <i class="fas fa-briefcase text-purple-600 text-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-700">Việc làm đang tuyển</h3>
            <p class="text-2xl font-bold text-gray-900">{{ stats.activeJobs }}</p>
            <p class="text-sm text-green-600 flex items-center">
              <i class="fas fa-arrow-up mr-1"></i> {{ stats.jobGrowth }}% so với tháng trước
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Biểu đồ và thống kê -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Biểu đồ chính -->
      <div class="bg-white rounded-md border border-gray-200 p-4 lg:col-span-2 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-800">Thống kê việc làm theo tháng</h3>
          <div class="relative">
            <select class="border border-gray-300 rounded py-1 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>6 tháng gần đây</option>
              <option>12 tháng gần đây</option>
              <option>Năm nay</option>
            </select>
          </div>
        </div>
        
        <div class="h-72 flex items-center justify-center">
          <!-- Placeholder cho biểu đồ -->
          <div class="w-full h-full bg-gray-50 rounded flex items-center justify-center">
            <div class="text-center">
              <i class="fas fa-chart-line text-gray-400 text-5xl mb-3"></i>
              <p class="text-gray-500">Biểu đồ dữ liệu việc làm sẽ được hiển thị ở đây</p>
              <p class="text-sm text-gray-400">Tích hợp thư viện biểu đồ như Chart.js hoặc ApexCharts</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Thống kê ngành nghề -->
      <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
        <h3 class="text-lg font-medium text-gray-800 mb-4">Tin tuyển dụng theo ngành</h3>
        
        <div class="space-y-3">
          <div v-for="(industry, index) in topIndustries" :key="index">
            <div class="flex justify-between mb-1">
              <span class="text-sm text-gray-600">{{ industry.name }}</span>
              <span class="text-sm font-medium text-gray-800">{{ industry.count }} tin</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="h-2 rounded-full" 
                   :style="{ width: industry.percentage + '%', backgroundColor: industry.color }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tin tuyển dụng mới nhất và Hoạt động gần đây -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Tin tuyển dụng mới -->
      <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-800">Tin tuyển dụng mới nhất</h3>
          <a href="#" class="text-sm text-blue-600 hover:underline">Xem tất cả</a>
        </div>
        
        <div class="space-y-3">
          <div v-for="(job, index) in recentJobs" :key="index" 
               class="flex items-center p-3 border-b border-gray-100 last:border-0">
            <div class="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
              <i class="fas fa-building text-gray-500"></i>
            </div>
            <div class="flex-grow min-w-0">
              <h4 class="text-sm font-medium text-gray-800 truncate">{{ job.title }}</h4>
              <p class="text-xs text-gray-500 truncate">{{ job.company }}</p>
            </div>
            <div class="text-sm text-gray-500 ml-3 whitespace-nowrap">
              {{ job.postedAt }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Hoạt động gần đây -->
      <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-800">Hoạt động gần đây</h3>
          <a href="#" class="text-sm text-blue-600 hover:underline">Xem tất cả</a>
        </div>
        
        <div class="space-y-4">
          <div v-for="(activity, index) in recentActivities" :key="index" class="flex">
            <div class="relative mr-4">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center z-10 relative">
                <i :class="['fas', activity.icon, 'text-blue-600 text-sm']"></i>
              </div>
              <div v-if="index !== recentActivities.length - 1" class="absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200"></div>
            </div>
            <div class="pb-5">
              <p class="text-sm text-gray-800">{{ activity.description }}</p>
              <p class="text-xs text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Dữ liệu mẫu cho bảng điều khiển (có thể thay thế bằng API thực tế sau)
const stats = ref({
  employers: 1250,
  employerGrowth: 12.5,
  candidates: 8950,
  candidateGrowth: 18.3,
  activeJobs: 724,
  jobGrowth: 8.4
})

const topIndustries = ref([
  { name: 'Công nghệ thông tin', count: 245, percentage: 80, color: '#4F46E5' },
  { name: 'Tài chính - Ngân hàng', count: 185, percentage: 65, color: '#7C3AED' },
  { name: 'Marketing', count: 142, percentage: 50, color: '#EC4899' },
  { name: 'Kỹ thuật - Cơ khí', count: 98, percentage: 35, color: '#F59E0B' },
  { name: 'Y tế - Dược phẩm', count: 76, percentage: 25, color: '#10B981' }
])

const recentJobs = ref([
  { title: 'Frontend Developer (ReactJS)', company: 'Công ty ABC Solutions', postedAt: '1 giờ trước' },
  { title: 'Kế toán trưởng', company: 'Tập đoàn DEF Holdings', postedAt: '3 giờ trước' },
  { title: 'Chuyên viên Marketing', company: 'Công ty XYZ Media', postedAt: '5 giờ trước' },
  { title: 'Kỹ sư phần mềm', company: 'Tech Solutions Vietnam', postedAt: '8 giờ trước' }
])

const recentActivities = ref([
  { 
    icon: 'fa-user-plus', 
    description: 'Công ty ABC Solutions vừa đăng ký tài khoản', 
    time: '30 phút trước' 
  },
  { 
    icon: 'fa-briefcase', 
    description: 'Đã đăng 5 tin tuyển dụng mới', 
    time: '2 giờ trước' 
  },
  { 
    icon: 'fa-user-check', 
    description: 'Trần Văn A đã ứng tuyển vào vị trí Frontend Developer', 
    time: '3 giờ trước' 
  },
  { 
    icon: 'fa-building', 
    description: 'Công ty XYZ cập nhật thông tin doanh nghiệp', 
    time: '5 giờ trước' 
  },
])

onMounted(() => {
  // Có thể gọi API để lấy dữ liệu thật khi component được mount
  console.log('Dashboard loaded')
})
</script>

<style scoped>
.dashboard-container {
  min-height: calc(100vh - 64px);
}
</style> 