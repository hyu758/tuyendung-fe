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
                    <option 
                      v-for="province in addressStore.provinces" 
                      :key="province.code" 
                      :value="province.name"
                    >
                      {{ province.name }}
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

      <!-- Phần doanh nghiệp Pro -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <!-- Banner tiêu đề Thương hiệu lớn tiêu biểu -->
          <div class="bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl overflow-hidden shadow-md mb-10 relative">
            <div class="absolute top-0 right-0 w-64 h-64 bg-amber-200 rounded-full opacity-20 -translate-y-1/2 translate-x-1/3"></div>
            <div class="p-6 md:p-10 relative z-10">
              <div class="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Thương hiệu lớn tiêu biểu</h2>
                  <p class="text-gray-700 max-w-3xl">Những thương hiệu tuyển dụng đã khẳng định được vị thế trên thị trường.</p>
                </div>
                <div class="mt-4 md:mt-0">
                  <div class="inline-flex items-center px-5 py-2.5 bg-amber-500 text-white rounded-full font-semibold shadow-md">
                    <i class="fas fa-crown mr-2"></i> Pro Company
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab filter ngành nghề -->
          <div class="flex overflow-x-auto gap-2 mb-8 scrollbar-hide pb-2">
            <button class="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium shadow-sm whitespace-nowrap flex-shrink-0">
              Tất cả
            </button>
            <button 
              v-for="category in categories.slice(0, 8)" 
              :key="category.id"
              @click="searchByCategory(category.name)"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap flex-shrink-0"
            >
              {{ category.name }}
            </button>
          </div>

          <!-- Premium companies grid -->
          <div v-if="loadingPremium" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            <!-- Skeleton loading cho card công ty -->
            <div v-for="index in 6" :key="index" class="enterprise-card-skeleton bg-white rounded-xl shadow-sm animate-pulse">
              <!-- Premium badge skeleton -->
              <div class="absolute top-0 right-0">
                <div class="bg-gray-200 w-16 h-5 rounded-bl-lg rounded-tr-lg"></div>
              </div>
              
              <div class="p-5 flex flex-col items-center">
                <!-- Logo skeleton -->
                <div class="mb-3 w-20 h-20 bg-gray-200 rounded-lg"></div>
                
                <!-- Company info skeleton -->
                <div class="w-4/5 h-4 bg-gray-200 rounded mt-2"></div>
                <div class="w-3/5 h-3 bg-gray-200 rounded mt-2"></div>
                
                <!-- Button skeleton -->
                <div class="mt-3 w-full">
                  <div class="w-full h-6 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else-if="premiumEnterprises.length === 0" 
            class="text-center py-16 border border-gray-200 rounded-xl"
          >
            <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <font-awesome-icon icon="building" class="text-gray-400 text-2xl" />
            </div>
            <p class="text-gray-500">Chưa có doanh nghiệp Pro</p>
          </div>
          
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            <router-link
              v-for="enterprise in premiumEnterprises" 
              :key="enterprise.id"
              :to="`/enterprises/${enterprise.id}`"
              class="enterprise-card bg-gradient-to-b from-blue-50 to-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <!-- Premium badge -->
              <div class="absolute top-0 right-0">
                <div class="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-bl-lg rounded-tr-lg flex items-center">
                  <i class="fas fa-crown text-amber-200 mr-1"></i> Premium
                </div>
              </div>
              
              <div class="p-5 flex flex-col items-center">
                <!-- Logo -->
                <div class="mb-3 w-20 h-20 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center p-1">
                  <img 
                    v-if="enterprise.logo_url" 
                    :src="enterprise.logo_url" 
                    :alt="enterprise.company_name"
                    class="max-w-full max-h-full object-contain" 
                    @error="handleImageError"
                  />
                  <font-awesome-icon v-else icon="building" class="text-gray-400 text-xl" />
                </div>
                
                <!-- Company info -->
                <h3 class="text-gray-800 font-medium text-sm text-center mt-2 line-clamp-1">{{ enterprise.company_name }}</h3>
                <p class="text-gray-500 text-xs text-center mt-1 line-clamp-1">{{ enterprise.field_of_activity }}</p>
                
                <!-- Hover button -->
                <div class="mt-3 w-full">
                  <div class="text-blue-600 text-xs bg-blue-50 py-1 px-3 rounded-full text-center transition-colors hover:bg-blue-100">
                    Xem chi tiết
                  </div>
                </div>
              </div>
            </router-link>
          </div>

          <!-- Controls di chuyển cho mobile -->
          <div class="flex justify-center mt-8 md:hidden gap-2">
            <button 
              class="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 shadow-sm"
              aria-label="Trang trước"
              @click="scrollPremium('left')"
            >
              <font-awesome-icon icon="chevron-left" />
            </button>
            <button 
              class="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 shadow-sm"
              aria-label="Trang sau"
              @click="scrollPremium('right')"
            >
              <font-awesome-icon icon="chevron-right" />
            </button>
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

          <!-- Skeleton loading cho JobCard -->
          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <JobCard 
              v-for="index in 6" 
              :key="'skeleton-' + index" 
              :loading="true"
              :job="{}" 
            />
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
import { useEnterpriseStore } from '../stores/enterprise'
import { useAddressStore } from '../stores/address'
import SelectRole from './auth/SelectRole.vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()
const addressStore = useAddressStore()
const toast = useToast()

// State
const searchKeyword = ref('')
const searchLocation = ref('')
const loading = ref(true)
const featuredJobs = ref([])

// Premium Enterprises
const premiumEnterprises = ref([])
const loadingPremium = ref(true)
const premiumSlider = ref(null)

// Dữ liệu mẫu (thường sẽ được lấy từ API)
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

// Fetch Premium Enterprises
const fetchPremiumEnterprises = async () => {
  loadingPremium.value = true
  try {
    const enterpriseStore = useEnterpriseStore()
    const result = await enterpriseStore.fetchPremiumEnterprises()
    if (result.success) {
      premiumEnterprises.value = result.data
    }
    loadingPremium.value = false
  } catch (error) {
    console.error('Không thể lấy danh sách doanh nghiệp premium:', error)
    loadingPremium.value = false
  }
}

// Xử lý sự kiện scroll cho slider
const scrollPremium = (direction) => {
  if (!premiumSlider.value) return
  
  const scrollAmount = 200
  if (direction === 'left') {
    premiumSlider.value.scrollLeft -= scrollAmount
  } else {
    premiumSlider.value.scrollLeft += scrollAmount
  }
}

// Handle image errors
const handleImageError = (e) => {
  e.target.src = '/default-company-logo.png'
}

// Lifecycle hooks
onMounted(async () => {
  const fieldStore = useFieldStore();
  
  try {
    // Lấy danh sách tỉnh/thành từ address store
    await addressStore.fetchProvinces();
    
    const result = await fieldStore.fetchFields();
    console.log(result);
    if (result.success) {
      categories.value = result.data;
    }
    await fetchPosts();
    await fetchPremiumEnterprises();
    
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
      city: searchLocation.value
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

const handleSaveJob = async (jobId) => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }

  try {
    const jobIndex = featuredJobs.value.findIndex(job => job.id === jobId);
    if (jobIndex === -1) return;

    const job = featuredJobs.value[jobIndex];
    const postStore = usePostStore();
    
    if (!job.is_saved) {
      // Lưu job
      const result = await postStore.savePost(jobId);
      if (result.success) {
        featuredJobs.value[jobIndex].is_saved = true;
        toast.success('Đã lưu việc làm thành công');
      } else {
        toast.error(result.error || 'Có lỗi xảy ra khi lưu việc làm');
      }
    } else {
      // Bỏ lưu job
      const result = await postStore.deleteSavedPostByPostId(jobId);
      if (result.success) {
        featuredJobs.value[jobIndex].is_saved = false;
        toast.success('Đã bỏ lưu việc làm thành công');
      } else {
        toast.error(result.error || 'Có lỗi xảy ra khi bỏ lưu việc làm');
      }
    }
  } catch (error) {
    console.error('Error handling save job:', error);
    toast.error('Có lỗi xảy ra khi thực hiện thao tác');
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

/* CSS cho phần Premium Enterprises */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  scroll-behavior: smooth;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enterprise card */
.enterprise-card {
  position: relative;
  transform: translateY(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.enterprise-card:hover {
  transform: translateY(-5px);
}

/* Responsive CSS cho phần Premium */
@media (max-width: 768px) {
  .premium-enterprise-card {
    min-width: 150px;
  }
}

@media (max-width: 640px) {
  .premium-enterprise-card {
    min-width: 130px;
  }
}

/* CSS cho Enterprise card skeleton */
@keyframes pulse {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.enterprise-card-skeleton {
  position: relative;
  height: 180px;
}
</style> 