<template>
  <div class="bg-gray-50 min-h-screen">
    <PageHeader title="Thống kê doanh nghiệp" />
    
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-exclamation-circle text-red-500 text-lg"></i>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Có lỗi xảy ra khi tải dữ liệu</h3>
            <div class="mt-2 text-sm text-red-700">{{ error }}</div>
          </div>
        </div>
      </div>
      
      <!-- Statistics content -->
      <div v-else class="space-y-8">
        <!-- Summary cards -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Tổng số tin tuyển dụng -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <i class="fas fa-briefcase text-white"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Tin tuyển dụng</dt>
                    <dd>
                      <div class="text-lg font-semibold text-gray-900">{{ statistics.total_posts }}</div>
                      <div class="text-xs text-gray-500">
                        <span class="text-green-600">{{ statistics.active_posts }} hoạt động</span>,
                        <span class="text-red-600">{{ statistics.expired_posts }} hết hạn</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Tổng số ứng viên -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <i class="fas fa-user-tie text-white"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Ứng viên</dt>
                    <dd>
                      <div class="text-lg font-semibold text-gray-900">{{ statistics.total_applicants }}</div>
                      <div class="text-xs text-gray-500">
                        <span class="text-yellow-600">{{ statistics.pending_applicants }} chờ xử lý</span>,
                        <span class="text-green-600">{{ statistics.approved_applicants }} đã duyệt</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Tổng số phỏng vấn -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <i class="fas fa-comments text-white"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Phỏng vấn</dt>
                    <dd>
                      <div class="text-lg font-semibold text-gray-900">{{ statistics.total_interviews }}</div>
                      <div class="text-xs text-gray-500">
                        <span class="text-blue-600">{{ statistics.upcoming_interviews }} sắp diễn ra</span>,
                        <span class="text-green-600">{{ statistics.completed_interviews }} đã hoàn thành</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Tỷ lệ chuyển đổi -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <i class="fas fa-chart-line text-white"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Tỷ lệ chuyển đổi</dt>
                    <dd>
                      <div class="text-lg font-semibold text-gray-900">
                        {{ statisticsTotalPosts > 0 ? ((statisticsTotalApplicants / statisticsTotalPosts).toFixed(1)) : 0 }}
                      </div>
                      <div class="text-xs text-gray-500">Ứng viên/tin đăng</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Charts -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Thống kê theo tháng</h2>
          <div class="h-80">
            <MonthlyStatsChart :data="statistics.monthly_stats" />
          </div>
        </div>
        
        <!-- Post stats table -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Thống kê theo tin tuyển dụng</h3>
            <p class="mt-1 text-sm text-gray-500">10 tin tuyển dụng gần nhất của doanh nghiệp.</p>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng ứng viên
                  </th>
                  <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chờ xử lý
                  </th>
                  <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đã duyệt
                  </th>
                  <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đã từ chối
                  </th>
                  <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="post in statistics.post_stats" :key="post.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ post.title }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="text-sm text-gray-900">{{ post.total_applicants }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="text-sm text-yellow-600">{{ post.pending_applicants }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="text-sm text-green-600">{{ post.approved_applicants }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="text-sm text-red-600">{{ post.rejected_applicants }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <router-link :to="`/posts/${post.id}`" class="text-blue-600 hover:text-blue-900">
                      Xem chi tiết
                    </router-link>
                  </td>
                </tr>
                <tr v-if="statistics.post_stats.length === 0">
                  <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                    Chưa có tin tuyển dụng nào
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useEnterpriseStore } from '@/stores/enterprise'
import PageHeader from '@/components/PageHeader.vue'
import MonthlyStatsChart from './components/MonthlyStatsChart.vue'

export default {
  name: 'EnterpriseStatistics',
  components: {
    PageHeader,
    MonthlyStatsChart
  },
  setup() {
    const enterpriseStore = useEnterpriseStore()
    const loading = ref(true)
    const error = ref(null)
    const statistics = ref({
      total_posts: 0,
      active_posts: 0,
      expired_posts: 0,
      total_applicants: 0,
      pending_applicants: 0,
      approved_applicants: 0,
      rejected_applicants: 0,
      total_interviews: 0,
      upcoming_interviews: 0,
      completed_interviews: 0,
      monthly_stats: [],
      post_stats: []
    })
    
    const statisticsTotalPosts = computed(() => statistics.value.total_posts)
    const statisticsTotalApplicants = computed(() => statistics.value.total_applicants)
    
    const fetchStatistics = async () => {
      loading.value = true
      error.value = null
      
      try {
        const result = await enterpriseStore.getEnterpriseStatistics()
        
        if (result.success) {
          statistics.value = result.data
        } else {
          error.value = result.error
        }
      } catch (err) {
        error.value = 'Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.'
        console.error('Failed to fetch statistics:', err)
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      fetchStatistics()
    })
    
    return {
      loading,
      error,
      statistics,
      statisticsTotalPosts,
      statisticsTotalApplicants
    }
  }
}
</script> 