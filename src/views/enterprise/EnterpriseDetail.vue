<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Banner section -->
    <div
      class="h-80 sm:h-96 relative bg-cover bg-center"
      :class="{ 'premium-banner-border': enterprise?.is_premium }"
      :style="{ backgroundImage: `url(${enterprise?.background_image_url})` }"
    >
      <!-- Premium overlay pattern -->
      <div v-if="enterprise?.is_premium" class="absolute inset-0 premium-pattern opacity-10"></div>
      
      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
      
      <!-- Premium border glow -->
      <div v-if="enterprise?.is_premium" class="absolute inset-0 premium-border-glow"></div>
      
      <!-- Content -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 h-full relative">
        <div class="flex items-end h-full pb-8">
          <div class="flex items-center space-x-6 w-full">
            <!-- Logo -->
            <div
              class="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg shadow-lg p-2 flex-shrink-0 relative"
              :class="{ 'premium-logo-glow': enterprise?.is_premium }"
            >
              <!-- Premium crown icon -->
              <div v-if="enterprise?.is_premium" class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg premium-crown-pulse">
                <i class="fas fa-crown text-white text-xs"></i>
              </div>
              
              <img
                v-if="enterprise?.logo_url"
                :src="enterprise.logo_url"
                :alt="enterprise?.company_name"
                class="w-full h-full object-contain rounded"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                <i class="fas fa-building text-gray-400 text-xl sm:text-2xl"></i>
              </div>
            </div>
            
            <!-- Company Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {{ enterprise?.company_name || 'TLU' }}
                </h1>
                <!-- Premium verified badge -->
                <div v-if="enterprise?.is_premium" class="premium-verified-badge">
                  <i class="fas fa-check-circle text-blue-400"></i>
                </div>
              </div>
              
              <div class="flex flex-wrap items-center gap-3">
                <!-- Scale badge -->
                <span class="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg border border-white/30">
                  <i class="fas fa-users mr-2 text-blue-200"></i>
                  {{ enterprise?.scale || '11-50' }} nhân viên
                </span>
                
                <!-- Premium badge -->
                <span v-if="enterprise?.is_premium" class="premium-badge">
                  <i class="fas fa-crown mr-2"></i>
                  <span class="premium-text">Premium Partner</span>
                  <div class="premium-shine"></div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <!-- Left column -->
        <div class="lg:col-span-8">
          <!-- Giới thiệu section -->
          <div class="bg-white rounded-lg p-4 sm:p-6 mb-6 shadow-sm">
            <h2 class="text-lg sm:text-xl font-semibold mb-4">Giới thiệu công ty</h2>
            <div class="text-gray-600 text-sm sm:text-base leading-relaxed">
              {{ enterprise?.description || 'TLU' }}
            </div>
          </div>

          <!-- Tin tuyển dụng section -->
          <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
              <h2 class="text-lg sm:text-xl font-semibold">Tin tuyển dụng</h2>
              <div class="text-gray-500 text-sm sm:text-base">Tìm thấy {{ jobs.length || 0 }} việc làm</div>
            </div>

            <!-- Loading skeleton -->
            <div v-if="loading" class="space-y-4">
              <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 bg-gray-200 rounded"></div>
                    <div class="flex-1 space-y-3">
                      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div class="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div class="flex space-x-4">
                        <div class="h-3 bg-gray-200 rounded w-1/4"></div>
                        <div class="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div class="w-24 h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Job list -->
            <div v-else class="space-y-4">
              <div v-if="jobs?.length === 0" class="text-center py-12">
                <i class="fas fa-briefcase text-gray-300 text-4xl sm:text-5xl mb-4"></i>
                <div class="text-gray-500 text-sm sm:text-base">Chưa có tin tuyển dụng nào</div>
              </div>
              
              <div v-else v-for="job in jobs" :key="job.id" 
                class="group border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                :class="{ 'premium-job-card': enterprise?.is_premium }"
              >
                <router-link :to="{ name: 'JobDetail', params: { id: job.id }}" 
                  class="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 space-y-4 sm:space-y-0">
                  
                  <!-- Logo và thông tin chính -->
                  <div class="flex items-start space-x-4 flex-1 min-w-0">
                  <img 
                    :src="job.enterprise_logo" 
                    :alt="job.enterprise_name"
                      class="w-12 h-12 sm:w-16 sm:h-16 rounded object-contain bg-white p-1 flex-shrink-0"
                    @error="handleImageError"
                  />
                    <div class="flex-1 min-w-0">
                      <h3 class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base line-clamp-2">
                        {{ job.title }}
                      </h3>
                      <div class="mt-1 text-xs sm:text-sm text-gray-500 truncate">{{ job.enterprise_name }}</div>
                      
                      <!-- Mobile: Stack vertically -->
                      <div class="mt-2 flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0 sm:space-x-4">
                      <div class="flex items-center">
                          <i class="fas fa-map-marker-alt mr-1 text-gray-400"></i>
                          <span class="truncate">{{ job.city }}</span>
                      </div>
                      <div class="flex items-center">
                          <i class="fas fa-clock mr-1 text-gray-400"></i>
                          <span>Hạn: {{ new Date(job.deadline).toLocaleDateString('vi-VN') }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Action button -->
                  <div class="flex-shrink-0 w-full sm:w-auto">
                    <div class="flex items-center justify-between sm:justify-end">
                      <div class="sm:hidden text-xs text-gray-400">
                        <i class="fas fa-eye mr-1"></i>
                        Chi tiết
                      </div>
                      <div class="text-emerald-600 font-medium text-sm sm:text-base flex items-center">
                        <span class="hidden sm:inline">Xem chi tiết</span>
                        <span class="sm:hidden">Xem</span>
                        <i class="fas fa-chevron-right ml-1 text-xs transition-transform group-hover:translate-x-1"></i>
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column -->
        <div class="lg:col-span-4">
          <div 
            class="bg-white rounded-lg p-4 sm:p-6 shadow-sm sticky top-4"
            :class="{ 'premium-contact-card': enterprise?.is_premium }"
          >
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <i class="fas fa-address-card mr-2 text-blue-500"></i>
              Thông tin liên hệ
            </h3>
            <div class="space-y-4">
              <!-- Địa chỉ -->
              <div class="flex items-start group">
                <div class="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <i class="fas fa-map-marker-alt text-gray-400 group-hover:text-blue-500 transition-colors"></i>
                </div>
                <div class="ml-3 flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900">Địa chỉ</div>
                  <div class="text-sm text-gray-600 mt-1 leading-relaxed">{{ enterprise?.address }}</div>
                </div>
              </div>

              <!-- Website -->
              <div class="flex items-start group">
                <div class="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <i class="fas fa-globe text-gray-400 group-hover:text-blue-500 transition-colors"></i>
                </div>
                <div class="ml-3 flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900">Website</div>
                  <a :href="enterprise?.link_web_site" target="_blank" 
                    class="text-sm text-blue-600 hover:text-blue-800 hover:underline mt-1 block truncate">
                    {{ enterprise?.link_web_site }}
                  </a>
                </div>
              </div>

              <!-- Điện thoại -->
              <div class="flex items-start group">
                <div class="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-green-50 transition-colors">
                  <i class="fas fa-phone text-gray-400 group-hover:text-green-500 transition-colors"></i>
                </div>
                <div class="ml-3 flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900">Điện thoại</div>
                  <a :href="`tel:${enterprise?.phone_number}`" 
                    class="text-sm text-gray-600 hover:text-green-600 mt-1 block">
                    {{ enterprise?.phone_number }}
                  </a>
                </div>
              </div>

              <!-- Email -->
              <div class="flex items-start group">
                <div class="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                  <i class="fas fa-envelope text-gray-400 group-hover:text-purple-500 transition-colors"></i>
                </div>
                <div class="ml-3 flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900">Email</div>
                  <a :href="`mailto:${enterprise?.email_company}`" 
                    class="text-sm text-gray-600 hover:text-purple-600 mt-1 block truncate">
                    {{ enterprise?.email_company }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Quick Actions (Mobile) -->
            <div class="mt-6 grid grid-cols-2 gap-3 sm:hidden">
              <a :href="`tel:${enterprise?.phone_number}`" 
                class="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                <i class="fas fa-phone mr-2"></i>
                Gọi ngay
              </a>
              <a :href="`mailto:${enterprise?.email_company}`" 
                class="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                <i class="fas fa-envelope mr-2"></i>
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEnterpriseStore } from '../../stores/enterprise'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const enterpriseStore = useEnterpriseStore()
const loading = ref(true)
const error = ref(null)
const enterprise = ref(null)
const jobs = ref({
  results: [],
  total: 0,
  total_pages: 0,
  page: 1,
  page_size: 10
})
const currentPage = ref(1)

const loadEnterprise = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Fetch enterprise info
    const result = await enterpriseStore.fetchEnterpriseById(route.params.id)
    if (result.success) {
      enterprise.value = result.data.data
      await loadJobs()
    } else {
      error.value = result.error
    }
  } catch (err) {
    console.error('Error loading enterprise:', err)
    error.value = 'Có lỗi xảy ra khi tải thông tin công ty'
  } finally {
    loading.value = false
  }
}

const loadJobs = async () => {
  try {
    const response = await axios.get(`/api/posts/enterprise/${route.params.id}/`, {
      params: {
        page: currentPage.value,
        page_size: jobs.value.page_size
      }
    })
    jobs.value = response.data
  } catch (error) {
    console.error('Error loading jobs:', error)
  }
}

const changePage = async (page) => {
  currentPage.value = page
  await loadJobs()
}

const handleImageError = (e) => {
  e.target.src = '/default-company-logo.png' // Thay thế bằng ảnh mặc định khi load ảnh lỗi
}

onMounted(() => {
  loadEnterprise()
})
</script>

<style scoped>
/* Premium effects */
.premium-gradient {
  background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%) !important;
}

.premium-glow {
  box-shadow: 0 0 0 6px rgba(253, 200, 48, 0.25), 0 0 32px 8px rgba(253, 200, 48, 0.25), 0 4px 24px 0 rgba(253, 200, 48, 0.15);
  animation: glow 2s infinite alternate;
}

/* Premium Banner Border */
.premium-banner-border {
  position: relative;
}

.premium-banner-border::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  background: linear-gradient(45deg, #ffd700, #ff6b35, #f7931e, #ffd700);
  background-size: 400% 400%;
  border-radius: 12px;
  z-index: -1;
  animation: premium-border-flow 3s ease-in-out infinite;
}

@keyframes premium-border-flow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Premium Border Glow */
.premium-border-glow {
  border: 2px solid transparent;
  background: linear-gradient(45deg, rgba(255, 215, 0, 0.3), rgba(255, 107, 53, 0.3)) border-box;
  border-radius: 12px;
  animation: premium-glow-pulse 2s ease-in-out infinite alternate;
}

@keyframes premium-glow-pulse {
  0% { 
    box-shadow: inset 0 0 20px rgba(255, 215, 0, 0.2), 0 0 20px rgba(255, 215, 0, 0.1);
  }
  100% { 
    box-shadow: inset 0 0 40px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.2);
  }
}

/* Premium Pattern Background */
.premium-pattern {
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
    linear-gradient(45deg, transparent 40%, rgba(255, 215, 0, 0.05) 50%, transparent 60%);
  background-size: 100px 100px, 150px 150px, 200px 200px;
  animation: premium-pattern-move 20s linear infinite;
}

@keyframes premium-pattern-move {
  0% { background-position: 0% 0%, 0% 0%, 0% 0%; }
  100% { background-position: 100% 100%, -100% -100%, 50% 50%; }
}

/* Premium Logo Glow */
.premium-logo-glow {
  position: relative;
  animation: premium-logo-pulse 3s ease-in-out infinite;
}

.premium-logo-glow::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(45deg, #ffd700, #ff6b35, #f7931e, #ffd700);
  background-size: 400% 400%;
  border-radius: 12px;
  z-index: -1;
  animation: premium-logo-border 4s ease-in-out infinite;
}

@keyframes premium-logo-pulse {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
  }
  50% { 
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
  }
}

@keyframes premium-logo-border {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Premium Crown Pulse */
.premium-crown-pulse {
  animation: premium-crown-bounce 2s ease-in-out infinite;
}

@keyframes premium-crown-bounce {
  0%, 100% { 
    transform: scale(1) rotate(0deg);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
  50% { 
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
  }
}

/* Premium Verified Badge */
.premium-verified-badge {
  animation: premium-verified-pulse 2s ease-in-out infinite;
}

@keyframes premium-verified-pulse {
  0%, 100% { 
    transform: scale(1);
    filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5));
  }
  50% { 
    transform: scale(1.1);
    filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.8));
  }
}

/* Premium Badge */
.premium-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: linear-gradient(135deg, #ffd700 0%, #ff6b35 50%, #f7931e 100%);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  overflow: hidden;
  animation: premium-badge-glow 3s ease-in-out infinite;
}

.premium-text {
  position: relative;
  z-index: 2;
}

.premium-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: premium-shine 3s ease-in-out infinite;
}

@keyframes premium-badge-glow {
  0%, 100% { 
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.1);
    transform: translateY(0);
  }
  50% { 
    box-shadow: 0 6px 25px rgba(255, 215, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.2);
    transform: translateY(-1px);
  }
}

@keyframes premium-shine {
  0% { left: -100%; }
  50%, 100% { left: 100%; }
}

/* Premium Job Cards Enhancement */
.premium-job-card {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 255, 255, 1) 100%);
  border: 2px solid transparent;
  background-clip: padding-box;
}

.premium-job-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  border-radius: inherit;
  padding: 2px;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  z-index: -1;
}

/* Premium Contact Card */
.premium-contact-card {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.03) 0%, rgba(255, 255, 255, 1) 100%);
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);
}

.premium-contact-card::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 107, 53, 0.3));
  border-radius: inherit;
  z-index: -1;
  animation: premium-contact-glow 4s ease-in-out infinite alternate;
}

@keyframes premium-contact-glow {
  0% { 
    opacity: 0.3;
    filter: blur(1px);
  }
  100% { 
    opacity: 0.6;
    filter: blur(2px);
  }
}

/* Text utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Banner responsive */
.premium-banner {
  background-attachment: fixed;
}

/* Company name styling */
h1 {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

@media (max-width: 768px) {
  .premium-banner {
    background-attachment: scroll;
  }
  
  /* Better line breaking for long company names on mobile */
  h1 {
    line-height: 1.1;
    word-break: break-word;
  }
  
  /* Reduce premium effects on mobile for performance */
  .premium-banner-border::before,
  .premium-logo-glow::before {
    animation-duration: 6s;
  }
  
  .premium-pattern {
    animation-duration: 30s;
  }
}

/* Touch targets for mobile */
@media (max-width: 640px) {
  /* Ensure minimum touch target size */
  .group {
    min-height: 44px;
  }
  
  /* Better spacing on mobile */
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  /* Improved typography hierarchy */
  h1 {
    line-height: 1.2;
  }
  
  h2, h3 {
    line-height: 1.3;
  }
}

/* Sticky sidebar only on large screens */
@media (min-width: 1024px) {
  .sticky {
    position: sticky;
    top: 1rem;
  }
}

/* Loading skeleton improvements */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Hover effects */
.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

.group:hover .group-hover\:-translate-y-1 {
  transform: translateY(-0.25rem);
}

.group:hover .group-hover\:text-blue-600 {
  color: rgb(37 99 235);
}

/* Focus states for accessibility */
a:focus,
button:focus {
  outline: 2px solid rgb(59 130 246);
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .premium-banner {
    background-image: none !important;
    background-color: #f3f4f6 !important;
  }
  
  .shadow-sm,
  .shadow-md,
  .shadow-lg {
    box-shadow: none !important;
    border: 1px solid #e5e7eb !important;
  }
  
  /* Hide premium effects in print */
  .premium-banner-border::before,
  .premium-logo-glow::before,
  .premium-pattern,
  .premium-border-glow,
  .premium-shine {
    display: none !important;
  }
}

/* Accessibility - Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .premium-banner-border::before,
  .premium-logo-glow,
  .premium-crown-pulse,
  .premium-verified-badge,
  .premium-badge,
  .premium-shine,
  .premium-pattern {
    animation: none !important;
  }
}
</style>