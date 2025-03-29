<template>
  <div class="dashboard-container">
    <!-- Thống kê tổng quan -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
        <div class="flex items-center">
          <div class="rounded-full bg-blue-100 p-3 mr-4">
            <i class="fas fa-file-alt text-blue-600 text-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-700">Đơn ứng tuyển</h3>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalApplications }}</p>
            <div class="flex items-center space-x-3 mt-1">
              <span class="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">{{ stats.pendingApplications }} Đang xử lý</span>
              <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">{{ stats.interviewApplications }} Phỏng vấn</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
        <div class="flex items-center">
          <div class="rounded-full bg-green-100 p-3 mr-4">
            <i class="fas fa-briefcase text-green-600 text-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-700">Việc làm phù hợp</h3>
            <p class="text-2xl font-bold text-gray-900">{{ stats.matchedJobs }}</p>
            <div class="flex items-center mt-1">
              <span class="text-xs text-blue-600">
                <i class="fas fa-sync-alt mr-1"></i> Cập nhật {{ stats.lastUpdate }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
        <div class="flex items-center">
          <div class="rounded-full bg-purple-100 p-3 mr-4">
            <i class="fas fa-eye text-purple-600 text-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-700">Lượt xem hồ sơ</h3>
            <p class="text-2xl font-bold text-gray-900">{{ stats.profileViews }}</p>
            <p class="text-sm text-green-600 flex items-center">
              <i class="fas fa-arrow-up mr-1"></i> {{ stats.viewsGrowth }}% so với tuần trước
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Đơn ứng tuyển và Tin tuyển dụng phù hợp-->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Tình trạng đơn ứng tuyển -->
      <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-800">Đơn ứng tuyển gần đây</h3>
          <a href="/candidate/applications" class="text-sm text-blue-600 hover:underline">Xem tất cả</a>
        </div>
        
        <div class="space-y-3">
          <div v-for="(application, index) in recentApplications" :key="index" 
               class="p-3 border-b border-gray-100 last:border-0">
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-sm font-medium text-gray-800">{{ application.jobTitle }}</h4>
              <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(application.status)">
                {{ getStatusText(application.status) }}
              </span>
            </div>
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs text-gray-500">
                <i class="fas fa-building mr-1"></i> {{ application.company }}
              </p>
              <p class="text-xs font-medium text-gray-700">
                <i class="fas fa-calendar-alt mr-1"></i> {{ application.appliedDate }}
              </p>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="flex items-center text-xs text-gray-500">
                  <i class="fas fa-map-marker-alt mr-1"></i> {{ application.location }}
                </span>
                <span class="mx-2 text-gray-300">|</span>
                <span class="text-xs text-gray-500"><i class="fas fa-money-bill-wave mr-1"></i> {{ application.salary }}</span>
              </div>
              <button class="text-xs text-blue-600 hover:underline">Xem chi tiết</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Việc làm phù hợp -->
      <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-800">Việc làm phù hợp</h3>
          <a href="/candidate/job-matches" class="text-sm text-blue-600 hover:underline">Xem thêm</a>
        </div>
        
        <div class="space-y-3">
          <div v-for="(job, index) in matchedJobs" :key="index" 
               class="p-3 border border-gray-100 rounded-md hover:border-blue-300 hover:shadow-sm transition-all">
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-sm font-medium text-gray-800">{{ job.title }}</h4>
              <span class="text-xs text-blue-600 font-medium">{{ job.matchPercentage }}% phù hợp</span>
            </div>
            <div class="flex items-center mb-2">
              <div class="flex items-center flex-grow">
                <i class="fas fa-building text-gray-400 mr-1"></i>
                <p class="text-xs text-gray-700 truncate">{{ job.company }}</p>
              </div>
              <div class="flex items-center ml-4">
                <i class="fas fa-map-marker-alt text-gray-400 mr-1"></i>
                <p class="text-xs text-gray-700">{{ job.location }}</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 mb-2">
              <span v-for="(skill, idx) in job.skills" :key="idx" 
                    class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {{ skill }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-500">
                <i class="fas fa-clock mr-1"></i> Đăng {{ job.postedAt }}
              </p>
              <button class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
                Ứng tuyển ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Biểu đồ hoạt động và Kỹ năng nổi bật -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Biểu đồ hoạt động -->
      <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm lg:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-800">Hoạt động ứng tuyển</h3>
          <div class="relative">
            <select class="border border-gray-300 rounded py-1 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>30 ngày qua</option>
              <option>3 tháng qua</option>
              <option>6 tháng qua</option>
            </select>
          </div>
        </div>
        
        <div class="h-64 flex items-center justify-center">
          <!-- Placeholder cho biểu đồ -->
          <div class="w-full h-full bg-gray-50 rounded flex items-center justify-center">
            <div class="text-center">
              <i class="fas fa-chart-line text-gray-400 text-4xl mb-3"></i>
              <p class="text-gray-500">Biểu đồ hoạt động ứng tuyển theo thời gian</p>
              <p class="text-sm text-gray-400">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Kỹ năng nổi bật -->
      <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-800">Kỹ năng của bạn</h3>
          <a href="/candidate/profile/skills" class="text-sm text-blue-600 hover:underline">Cập nhật</a>
        </div>
        
        <div class="space-y-3">
          <div v-for="(skill, index) in skills" :key="index">
            <div class="flex justify-between mb-1">
              <span class="text-sm text-gray-600">{{ skill.name }}</span>
              <span class="text-sm font-medium text-gray-800">{{ skill.level }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="h-2 rounded-full" 
                   :style="{ width: skill.percentage + '%', backgroundColor: getSkillLevelColor(skill.level) }"></div>
            </div>
          </div>
        </div>
        
        <div class="mt-4 text-center">
          <p class="text-sm text-gray-500 mb-3">Nhu cầu kỹ năng trên thị trường</p>
          <div class="flex justify-center flex-wrap gap-2">
            <span v-for="(trend, idx) in trendingSkills" :key="idx" 
                  class="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs flex items-center">
              {{ trend }} <i class="fas fa-arrow-up ml-1 text-green-500"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Hành động nhanh -->
    <div class="bg-white rounded-md border border-gray-200 p-4 shadow-sm mb-6">
      <h3 class="text-lg font-medium text-gray-800 mb-4">Thao tác nhanh</h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div class="border border-gray-200 rounded-md p-4 text-center hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer">
          <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
            <i class="fas fa-file-upload text-blue-600"></i>
          </div>
          <h4 class="text-sm font-medium text-gray-800 mb-1">Cập nhật CV</h4>
          <p class="text-xs text-gray-500">Tải lên CV mới nhất</p>
        </div>
        
        <div class="border border-gray-200 rounded-md p-4 text-center hover:border-green-500 hover:shadow-sm transition-all cursor-pointer">
          <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <i class="fas fa-search text-green-600"></i>
          </div>
          <h4 class="text-sm font-medium text-gray-800 mb-1">Tìm việc làm</h4>
          <p class="text-xs text-gray-500">Tìm kiếm cơ hội mới</p>
        </div>
        
        <div class="border border-gray-200 rounded-md p-4 text-center hover:border-purple-500 hover:shadow-sm transition-all cursor-pointer">
          <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
            <i class="fas fa-user-edit text-purple-600"></i>
          </div>
          <h4 class="text-sm font-medium text-gray-800 mb-1">Hồ sơ</h4>
          <p class="text-xs text-gray-500">Cập nhật thông tin</p>
        </div>
        
        <div class="border border-gray-200 rounded-md p-4 text-center hover:border-yellow-500 hover:shadow-sm transition-all cursor-pointer">
          <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3">
            <i class="fas fa-bell text-yellow-600"></i>
          </div>
          <h4 class="text-sm font-medium text-gray-800 mb-1">Thông báo</h4>
          <p class="text-xs text-gray-500">Cài đặt thông báo</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Dữ liệu mẫu cho bảng điều khiển (có thể thay thế bằng API thực tế sau)
const stats = ref({
  totalApplications: 12,
  pendingApplications: 5,
  interviewApplications: 2,
  matchedJobs: 18,
  lastUpdate: '3 giờ trước',
  profileViews: 68,
  viewsGrowth: 15.6
})

const recentApplications = ref([
  { 
    jobTitle: 'Frontend Developer', 
    company: 'Tech Solutions Vietnam', 
    status: 'pending',
    appliedDate: '15/06/2023',
    location: 'Hà Nội',
    salary: '15-20 triệu'
  },
  { 
    jobTitle: 'Web Developer', 
    company: 'Công ty ABC', 
    status: 'interview',
    appliedDate: '10/06/2023',
    location: 'TP.HCM',
    salary: '20-25 triệu'
  },
  { 
    jobTitle: 'UX/UI Designer', 
    company: 'Digital Agency XYZ', 
    status: 'rejected',
    appliedDate: '01/06/2023',
    location: 'Đà Nẵng',
    salary: '18-22 triệu'
  },
  { 
    jobTitle: 'Mobile Developer', 
    company: 'Công ty DEF', 
    status: 'viewed',
    appliedDate: '28/05/2023',
    location: 'TP.HCM',
    salary: '22-28 triệu'
  }
])

const matchedJobs = ref([
  { 
    title: 'Frontend Developer (Vue.js)',
    company: 'Tech Innovation Ltd',
    location: 'TP.HCM',
    matchPercentage: 95,
    skills: ['Vue.js', 'JavaScript', 'HTML/CSS'],
    postedAt: '2 ngày trước'
  },
  { 
    title: 'Web Developer (Front-end)',
    company: 'Global Solutions Inc',
    location: 'Hà Nội',
    matchPercentage: 90,
    skills: ['JavaScript', 'React', 'CSS3'],
    postedAt: '1 ngày trước'
  },
  { 
    title: 'Full Stack Developer',
    company: 'Digital Systems Co',
    location: 'Đà Nẵng',
    matchPercentage: 85,
    skills: ['JavaScript', 'Node.js', 'MongoDB'],
    postedAt: '5 giờ trước'
  }
])

const skills = ref([
  { name: 'JavaScript', level: 'Thành thạo', percentage: 90 },
  { name: 'Vue.js', level: 'Thành thạo', percentage: 85 },
  { name: 'HTML/CSS', level: 'Thành thạo', percentage: 90 },
  { name: 'React', level: 'Trung bình', percentage: 65 },
  { name: 'Node.js', level: 'Cơ bản', percentage: 40 }
])

const trendingSkills = ref([
  'React Native', 'TypeScript', 'AWS', 'Docker', 'GraphQL'
])

// Hàm trợ giúp để xác định các lớp CSS dựa trên trạng thái
function getStatusClass(status) {
  switch(status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'interview': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'viewed': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getStatusText(status) {
  switch(status) {
    case 'pending': return 'Đang xử lý';
    case 'interview': return 'Phỏng vấn';
    case 'rejected': return 'Từ chối';
    case 'viewed': return 'Đã xem';
    default: return 'Không xác định';
  }
}

function getSkillLevelColor(level) {
  switch(level) {
    case 'Thành thạo': return '#4F46E5';
    case 'Trung bình': return '#7C3AED';
    case 'Cơ bản': return '#EC4899';
    default: return '#10B981';
  }
}

onMounted(() => {
  // Có thể gọi API để lấy dữ liệu thật khi component được mount
  console.log('Candidate Dashboard loaded')
})
</script>

<style scoped>
.dashboard-container {
  min-height: calc(100vh - 64px);
}
</style> 