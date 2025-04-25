<!-- Thêm liên kết thống kê vào menu -->
<router-link
  to="/enterprise/statistics"
  class="text-sm font-medium transition-colors rounded-md"
  :class="[
    $route.path.includes('/enterprise/statistics')
      ? 'bg-blue-100 text-blue-600'
      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
  ]"
>
  <div class="flex items-center px-4 py-2">
    <i class="fas fa-chart-bar mr-2"></i>
    <span>Thống kê</span>
  </div>
</router-link> 