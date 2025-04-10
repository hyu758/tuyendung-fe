<template>
  <div>

    <!-- Phần hiển thị Chọn Role nếu cần -->
    <div v-if="authStore.isAuthenticated && !authStore.userRole" class="select-role-container py-10 bg-gray-100">
       <SelectRole /> 
    </div>

    <!-- Nội dung trang chủ bình thường (chỉ hiển thị khi không cần chọn role) -->
    <div v-else>
      <!-- Hero Section với banner tìm kiếm việc làm -->
      <section class="bg-blue-600 py-16">
        <div class="container mx-auto px-4">
          <div class="text-center max-w-3xl mx-auto">
            <h1 class="text-4xl font-bold text-white mb-6">Tìm việc làm phù hợp với bạn</h1>
            <p class="text-xl text-white mb-8">Hàng ngàn cơ hội việc làm đang chờ đón bạn tại JobHub</p>
            
            <div class="bg-white p-4 rounded-lg shadow-lg">
              <div class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div class="flex-1">
                  <input
                    v-model="searchKeyword"
                    type="text"
                    placeholder="Tiêu đề công việc, vị trí, kỹ năng..."
                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div class="md:w-1/3">
                  <select
                    v-model="searchLocation"
                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả địa điểm</option>
                    <option v-for="location in locations" :key="location" :value="location">
                      {{ location }}
                    </option>
                  </select>
                </div>
                <div>
                  <button
                    @click="searchJobs"
                    class="w-full px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-4 text-white">
              <span class="text-sm">Từ khóa phổ biến:</span>
              <div class="flex flex-wrap justify-center mt-2 gap-2">
                <a 
                  v-for="tag in popularTags" 
                  :key="tag" 
                  href="#" 
                  @click.prevent="setSearchKeyword(tag)"
                  class="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 text-white rounded-full transition"
                >
                  {{ tag }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Danh mục công việc -->
      <section class="py-12 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="text-center mb-10">
            <h2 class="text-3xl font-bold text-gray-800">Khám phá theo ngành nghề</h2>
            <p class="text-gray-600 mt-2">Tìm công việc phù hợp với kỹ năng và sở thích của bạn</p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div 
              v-for="category in categories" 
              :key="category.id" 
              class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
              @click="searchByCategory(category.name)"
            >
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <i class="text-blue-600 text-2xl" :class="category.icon"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">{{ category.name }}</h3>
              <p class="text-gray-600 text-sm mt-2">{{ category.jobs }} việc làm</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Công việc nổi bật -->
      <section class="py-12">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h2 class="text-3xl font-bold text-gray-800">Công việc nổi bật</h2>
              <p class="text-gray-600 mt-2">Các công việc hấp dẫn nhất hiện tại</p>
            </div>
            <router-link 
              to="/job-search" 
              class="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Xem tất cả
            </router-link>
          </div>

          <div v-if="loading" class="flex justify-center py-10">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>

          <div v-else-if="featuredJobs.length === 0" class="text-center py-10">
            <p class="text-gray-600">Không tìm thấy công việc nổi bật nào.</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <JobCard 
              v-for="job in featuredJobs" 
              :key="job.id" 
              :job="job" 
              @saveJob="handleSaveJob"
            />
          </div>
        </div>
      </section>

      <!-- Thông tin cho nhà tuyển dụng -->
      <section class="py-12 bg-gray-900 text-white">
        <div class="container mx-auto px-4">
          <div class="flex flex-col lg:flex-row items-center">
            <div class="lg:w-1/2 mb-8 lg:mb-0">
              <h2 class="text-3xl font-bold mb-4">Bạn là nhà tuyển dụng?</h2>
              <p class="text-lg text-gray-300 mb-6">
                Đăng tin tuyển dụng để tiếp cận hàng ngàn ứng viên tiềm năng.
                Chúng tôi cung cấp các giải pháp tuyển dụng hiệu quả giúp doanh nghiệp của bạn tìm được nhân tài phù hợp.
              </p>
              <div class="flex flex-wrap gap-4">
                <router-link 
                  to="/register" 
                  class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                >
                  Đăng tin tuyển dụng
                </router-link>
                <router-link 
                  to="/contact" 
                  class="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-md hover:bg-white/10 transition-colors"
                >
                  Liên hệ với chúng tôi
                </router-link>
              </div>
            </div>
            <div class="lg:w-1/2 lg:pl-12">
              <div class="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <div class="grid grid-cols-2 gap-6">
                  <div class="text-center">
                    <div class="text-4xl font-bold text-blue-400 mb-2">10K+</div>
                    <p class="text-gray-300">Ứng viên</p>
                  </div>
                  <div class="text-center">
                    <div class="text-4xl font-bold text-blue-400 mb-2">5K+</div>
                    <p class="text-gray-300">Nhà tuyển dụng</p>
                  </div>
                  <div class="text-center">
                    <div class="text-4xl font-bold text-blue-400 mb-2">20K+</div>
                    <p class="text-gray-300">Việc làm</p>
                  </div>
                  <div class="text-center">
                    <div class="text-4xl font-bold text-blue-400 mb-2">95%</div>
                    <p class="text-gray-300">Tỷ lệ hài lòng</p>
                  </div>
                </div>
              </div>
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
  const result = await postStore.fetchPosts(1,9,"-salary-max");
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
      categories.value = result.data.results;
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
/* Thêm style nếu cần */
.select-role-container {
  /* Đảm bảo nó chiếm không gian phù hợp */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px); /* Ví dụ: trừ đi chiều cao header/footer */
}
</style> 