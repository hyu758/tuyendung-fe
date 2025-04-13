<template>
  <div>

    <!-- Phần hiển thị Chọn Role nếu cần -->
    <div v-if="authStore.isAuthenticated && !authStore.userRole" class="select-role-container py-10 bg-gray-100">
       <SelectRole /> 
    </div>

    <!-- Nội dung trang chủ bình thường (chỉ hiển thị khi không cần chọn role) -->
    <div v-else>
      <!-- Hero Section với banner tìm kiếm việc làm -->
      <section class="relative bg-gradient-to-r from-blue-700 to-indigo-800 py-20 overflow-hidden">
        <!-- Hình nền trang trí -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute -top-20 -left-20 w-72 h-72 bg-white rounded-full"></div>
          <div class="absolute top-10 right-10 w-40 h-40 bg-white rounded-full"></div>
          <div class="absolute bottom-10 left-1/3 w-56 h-56 bg-blue-300 rounded-full"></div>
        </div>

        <div class="container mx-auto px-4 relative z-10">
          <div class="text-center max-w-3xl mx-auto">
            <h1 class="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Tìm <span class="relative inline-block">
                <span class="relative z-10">công việc mơ ước</span>
                <span class="absolute bottom-1 left-0 w-full h-3 bg-blue-400 opacity-30 rounded"></span>
              </span> của bạn ngay hôm nay
            </h1>
            <p class="text-lg text-blue-100 mb-8">Kết nối với hàng ngàn cơ hội việc làm tại các công ty hàng đầu Việt Nam</p>
            
            <div class="bg-white p-4 md:p-6 rounded-xl shadow-2xl transform transition-all duration-300 hover:shadow-blue-300/20 hover:-translate-y-1">
              <div class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div class="flex-1 relative">
                  <div class="absolute inset-y-0 left-3 flex items-center">
                    <i class="fas fa-search text-gray-400"></i>
                  </div>
                  <input
                    v-model="searchKeyword"
                    type="text"
                    placeholder="Vị trí, kỹ năng, công ty..."
                    class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div class="md:w-1/3 relative">
                  <div class="absolute inset-y-0 left-3 flex items-center">
                    <i class="fas fa-map-marker-alt text-gray-400"></i>
                  </div>
                  <select
                    v-model="searchLocation"
                    class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Tất cả địa điểm</option>
                    <option v-for="location in locations" :key="location" :value="location">
                      {{ location }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <i class="fas fa-chevron-down text-gray-400 text-xs"></i>
                  </div>
                </div>
                <div>
                  <button
                    @click="searchJobs"
                    class="w-full px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transform transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <i class="fas fa-search mr-2"></i>
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-6 text-white">
              <span class="text-sm font-medium text-blue-200">Từ khóa phổ biến:</span>
              <div class="flex flex-wrap justify-center mt-2 gap-2">
                <a 
                  v-for="tag in popularTags" 
                  :key="tag" 
                  href="#" 
                  @click.prevent="setSearchKeyword(tag)"
                  class="px-4 py-1.5 text-sm bg-white/10 hover:bg-white/30 text-white rounded-full transition-all hover:shadow-md hover:shadow-blue-500/20"
                >
                  {{ tag }}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Wave divider -->
        <div class="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" class="w-full h-auto">
            <path fill="#f9fafb" fill-opacity="1" d="M0,32L80,42.7C160,53,320,75,480,69.3C640,64,800,32,960,21.3C1120,11,1280,21,1360,26.7L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"></path>
          </svg>
        </div>
      </section>

      <!-- Thống kê nhanh -->
      <section class="py-10 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="bg-white rounded-xl p-6 shadow-sm text-center hover:shadow-md transition-shadow">
              <div class="text-blue-600 text-3xl font-bold mb-1">
                <span>10.000+</span>
              </div>
              <p class="text-gray-600">Ứng viên</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm text-center hover:shadow-md transition-shadow">
              <div class="text-blue-600 text-3xl font-bold mb-1">
                <span>5.000+</span>
              </div>
              <p class="text-gray-600">Nhà tuyển dụng</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm text-center hover:shadow-md transition-shadow">
              <div class="text-blue-600 text-3xl font-bold mb-1">
                <span>20.000+</span>
              </div>
              <p class="text-gray-600">Việc làm</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm text-center hover:shadow-md transition-shadow">
              <div class="text-blue-600 text-3xl font-bold mb-1">
                <span>95%</span>
              </div>
              <p class="text-gray-600">Tỷ lệ hài lòng</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Danh mục công việc -->
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <span class="text-blue-600 font-medium text-sm uppercase tracking-wider">Danh mục</span>
            <h2 class="text-3xl font-bold text-gray-900 mt-1">Khám phá theo ngành nghề</h2>
            <p class="text-gray-600 mt-3 max-w-2xl mx-auto">Tìm công việc phù hợp với kỹ năng và sở thích của bạn trong các lĩnh vực đa dạng</p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            <div 
              v-for="category in categories" 
              :key="category.id" 
              class="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md hover:bg-blue-50 hover:-translate-y-1 transition-all cursor-pointer group"
              @click="searchByCategory(category.name)"
            >
              <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <i class="text-blue-600 text-xl" :class="category.icon || 'fas fa-briefcase'"></i>
              </div>
              <h3 class="text-base font-semibold text-gray-800 group-hover:text-blue-700 line-clamp-1">{{ category.name }}</h3>
            </div>
          </div>
        </div>
      </section>

      <!-- Tại sao chọn chúng tôi -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <span class="text-blue-600 font-medium text-sm uppercase tracking-wider">Lợi ích</span>
            <h2 class="text-3xl font-bold text-gray-900 mt-1">Tại sao chọn JobHub?</h2>
            <p class="text-gray-600 mt-3 max-w-2xl mx-auto">Chúng tôi giúp kết nối ứng viên tài năng với nhà tuyển dụng hàng đầu</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <i class="fas fa-search text-blue-600 text-2xl"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Tìm kiếm dễ dàng</h3>
              <p class="text-gray-600">Công cụ tìm kiếm thông minh giúp bạn nhanh chóng tìm được công việc phù hợp</p>
            </div>
            
            <div class="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <i class="fas fa-user-check text-blue-600 text-2xl"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Hồ sơ chuyên nghiệp</h3>
              <p class="text-gray-600">Tạo hồ sơ nổi bật để thu hút sự chú ý của nhà tuyển dụng</p>
            </div>
            
            <div class="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <i class="fas fa-handshake text-blue-600 text-2xl"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Kết nối trực tiếp</h3>
              <p class="text-gray-600">Liên hệ trực tiếp với nhà tuyển dụng và nhận phản hồi nhanh chóng</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Công việc nổi bật -->
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row justify-between items-center mb-10">
            <div>
              <span class="text-blue-600 font-medium text-sm uppercase tracking-wider">Cơ hội</span>
              <h2 class="text-3xl font-bold text-gray-900 mt-1">Công việc nổi bật</h2>
              <p class="text-gray-600 mt-2">Các vị trí hấp dẫn nhất đang chờ đón bạn</p>
            </div>
            <router-link 
              to="/job-search" 
              class="mt-4 md:mt-0 px-6 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center group"
            >
              Xem tất cả
              <i class="fas fa-arrow-right ml-2 group-hover:ml-3 transition-all"></i>
            </router-link>
          </div>

          <div v-if="loading" class="flex justify-center py-16">
            <div class="relative w-20 h-20">
              <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
              <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>

          <div v-else-if="featuredJobs.length === 0" class="text-center py-16 bg-white rounded-xl shadow-sm">
            <div class="w-20 h-20 mx-auto mb-4 text-gray-300">
              <i class="fas fa-search text-6xl"></i>
            </div>
            <h3 class="text-xl font-medium text-gray-800 mb-2">Không tìm thấy công việc</h3>
            <p class="text-gray-600 max-w-md mx-auto">Hiện tại chưa có công việc nổi bật nào. Vui lòng quay lại sau!</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <JobCard 
              v-for="job in featuredJobs" 
              :key="job.id" 
              :job="job" 
              @saveJob="handleSaveJob"
              class="transform transition hover:-translate-y-1 hover:shadow-md"
            />
          </div>
        </div>
      </section>

      

      <!-- Thông tin cho nhà tuyển dụng -->
      <section class="py-16 relative bg-gray-900 text-white overflow-hidden">
        <!-- Hình nền trang trí -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-20 right-20 w-72 h-72 bg-blue-500 rounded-full"></div>
          <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300 rounded-full"></div>
          <div class="absolute -top-20 left-1/3 w-56 h-56 bg-indigo-500 rounded-full"></div>
        </div>

        <div class="container mx-auto px-4 relative z-10">
          <div class="flex flex-col lg:flex-row items-center">
            <div class="lg:w-1/2 mb-8 lg:mb-0">
              <span class="text-blue-400 font-medium text-sm uppercase tracking-wider">Dành cho doanh nghiệp</span>
              <h2 class="text-3xl md:text-4xl font-bold mb-4 mt-1">Bạn là nhà tuyển dụng?</h2>
              <p class="text-lg text-gray-300 mb-6">
                Đăng tin tuyển dụng để tiếp cận hàng ngàn ứng viên tiềm năng.
                Chúng tôi cung cấp các giải pháp tuyển dụng hiệu quả giúp doanh nghiệp của bạn tìm được nhân tài phù hợp.
              </p>
              <div class="flex flex-wrap gap-4">
                <router-link 
                  to="/register" 
                  class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <i class="fas fa-plus-circle mr-2"></i>
                  Đăng tin tuyển dụng
                </router-link>
                <router-link 
                  to="/contact" 
                  class="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  Liên hệ với chúng tôi
                </router-link>
              </div>
            </div>
            <div class="lg:w-1/2 lg:pl-12">
              <div class="bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10">
                <h3 class="text-xl font-semibold mb-6 text-blue-300">Lợi ích dành cho nhà tuyển dụng</h3>
                <div class="space-y-4">
                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                      <i class="fas fa-check"></i>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-lg font-medium text-white">Đăng tin không giới hạn</h4>
                      <p class="text-gray-400">Đăng tuyển nhiều vị trí khác nhau với chi phí hợp lý</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                      <i class="fas fa-users"></i>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-lg font-medium text-white">Tiếp cận ứng viên chất lượng</h4>
                      <p class="text-gray-400">Kết nối với hàng ngàn ứng viên tiềm năng phù hợp với yêu cầu</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                      <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-lg font-medium text-white">Báo cáo chi tiết</h4>
                      <p class="text-gray-400">Phân tích hiệu quả tuyển dụng với các báo cáo trực quan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA cuối trang -->
      <section class="py-10 bg-blue-600">
        <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 class="text-xl md:text-2xl font-bold text-white">Bắt đầu tìm kiếm việc làm ngay hôm nay!</h3>
              <p class="text-blue-100 mt-1">Hàng ngàn cơ hội đang chờ đón bạn</p>
            </div>
            <div class="mt-6 md:mt-0">
              <router-link 
                to="/job-search" 
                class="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                <i class="fas fa-search mr-2"></i>
                Tìm việc ngay
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import JobCard from '../components/common/JobCard.vue'
import { usePostStore } from '../stores/post'
import { useFieldStore } from '../stores/field'
import { useAuthStore } from '../stores/auth'
import SelectRole from './auth/SelectRole.vue'

const router = useRouter()
const authStore = useAuthStore()

// State
const searchKeyword = ref('')
const searchLocation = ref('')
const loading = ref(true)
const featuredJobs = ref([])

// Dữ liệu mẫu (thường sẽ được lấy từ API)
const locations = [
  'Hà Nội', 
  'Hồ Chí Minh', 
  'Đà Nẵng', 
  'Hải Phòng', 
  'Cần Thơ', 
  'Khác'
]

const popularTags = [
  'Công nghệ thông tin', 
  'Marketing', 
  'Kế toán', 
  'Nhân sự', 
  'Kinh doanh', 
  'Remote'
]

const categories = ref([]);

const fetchPosts = async () =>{
  const postStore = usePostStore();
  const result = await postStore.fetchPosts(1, 9, "-salary-max");
  console.log(result);
  if (result.success){
    featuredJobs.value = result.data.data.results;
  }
}

// Lifecycle hooks
onMounted(async () => {
  const fieldStore = useFieldStore();
  try {
    const result = await fieldStore.fetchFields();
    console.log(result);
    if (result.success) {
      categories.value = result.data;
    }
    await fetchPosts();
    
    loading.value = false
  } catch (error) {
    console.error('Không thể lấy danh sách công việc nổi bật:', error)
    loading.value = false
  }
})

// Methods
const searchJobs = () => {
  router.push({
    path: '/job-search',
    query: {
      q: searchKeyword.value,
      location: searchLocation.value
    }
  })
}

const setSearchKeyword = (keyword) => {
  searchKeyword.value = keyword
  searchJobs()
}

const searchByCategory = (category) => {
  router.push({
    path: '/job-search',
    query: { category }
  })
}

const handleSaveJob = (jobId) => {
  // Trong thực tế, sẽ gọi API để lưu/bỏ lưu công việc
  const jobIndex = featuredJobs.value.findIndex(job => job.id === jobId)
  if (jobIndex !== -1) {
    featuredJobs.value[jobIndex].isSaved = !featuredJobs.value[jobIndex].isSaved
  }
}
</script>

<style scoped>
.select-role-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
</style> 