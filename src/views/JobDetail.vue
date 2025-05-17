<template>
  <div class="job-detail-container px-4 pb-8 pt-4">
    <div class="max-w-5xl mx-auto">
      <!-- Loading skeleton -->
      <div v-if="loading" class="space-y-6">
        <!-- Header skeleton -->
        <div class="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
          <div class="p-4 md:p-6">
            <div class="h-8 bg-gray-200 rounded w-full md:w-2/3 mb-4 animate-pulse"></div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
              <div v-for="i in 3" :key="i" class="flex items-center animate-pulse">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full mr-3"></div>
                <div class="flex-1">
                  <div class="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div class="h-5 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-pulse">
              <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-4 sm:mb-0">
                <div class="h-10 w-full sm:w-32 bg-gray-200 rounded-lg"></div>
                <div class="h-10 w-full sm:w-24 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content skeleton -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
              <div class="p-4 md:p-6">
                <div class="flex gap-2 mb-4 animate-pulse">
                  <div class="h-6 w-24 bg-gray-200 rounded-full"></div>
                  <div class="h-6 w-24 bg-gray-200 rounded-full"></div>
                </div>

                <div v-for="i in 3" :key="i" class="mb-8 animate-pulse">
                  <div class="h-7 bg-gray-200 rounded w-48 mb-4"></div>
                  <div class="space-y-2">
                    <div class="h-4 bg-gray-200 rounded w-full"></div>
                    <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div class="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <!-- Company info skeleton -->
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
              <div class="p-4 md:p-6 animate-pulse">
                <div class="flex items-center mb-6">
                  <div class="w-16 h-16 bg-gray-200 rounded mr-4"></div>
                  <div class="flex-1">
                    <div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="h-4 bg-gray-200 rounded w-full"></div>
                  <div class="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>

            <!-- Additional info skeleton -->
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
              <div class="p-4 md:p-6">
                <div class="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
                <div class="space-y-4">
                  <div v-for="i in 5" :key="i" class="flex items-center animate-pulse">
                    <div class="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                    <div class="flex-1">
                      <div class="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                      <div class="h-5 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Skills skeleton -->
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
              <div class="p-4 md:p-6">
                <div class="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
                <div class="flex flex-wrap gap-2">
                  <div v-for="i in 5" :key="i" class="h-6 bg-gray-200 rounded-full w-24 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actual content -->
      <div v-else>
        <!-- Header section -->
        <div class="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
          <div class="p-4 md:p-6">
            <h1 class="text-xl md:text-2xl font-bold text-gray-900 mb-4">{{ job.title }}</h1>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
              <div class="flex items-center transform hover:scale-105 transition-transform">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                  <font-awesome-icon icon="money-bill" class="text-emerald-500 text-lg md:text-xl" />
                </div>
                <div>
                  <div class="text-gray-500 text-xs md:text-sm">Mức lương</div>
                  <div class="font-medium text-sm md:text-base">{{ getSalaryDisplay(job) }}</div>
                </div>
              </div>

              <div class="flex items-center transform hover:scale-105 transition-transform">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <font-awesome-icon icon="map-marker-alt" class="text-blue-500 text-lg md:text-xl" />
                </div>
                <div>
                  <div class="text-gray-500 text-xs md:text-sm">Địa điểm</div>
                  <div class="font-medium text-sm md:text-base truncate max-w-[180px]">{{ job.city }}{{ job.district ? `, ${job.district}` : '' }}</div>
                </div>
              </div>

              <div class="flex items-center transform hover:scale-105 transition-transform">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <font-awesome-icon icon="briefcase" class="text-purple-500 text-lg md:text-xl" />
                </div>
                <div>
                  <div class="text-gray-500 text-xs md:text-sm">Kinh nghiệm</div>
                  <div class="font-medium text-sm md:text-base">{{ job.experience }}</div>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-4 sm:mb-0">
                <base-button
                  text="Ứng tuyển ngay"
                  variant="primary"
                  size="md"
                  class="relative w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md overflow-hidden"
                  :class="{'animate-pulse-gentle': !authStore.isLoggedIn}"
                  :disabled="isApplied"
                  @click="applyForJob"
                >
                  <font-awesome-icon icon="paper-plane" class="text-white" />
                  <span class="text-white font-medium">{{ isApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay' }}</span>
                </base-button>

                <base-button
                  v-if="authStore.isCandidate && authStore.isLoggedIn && authStore.userInfo?.is_premium"
                  type="button"
                  variant="secondary" 
                  size="md"
                  class="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-300 shadow-md hover:shadow-lg"
                  @click="chatWithEmployer"
                >
                  <font-awesome-icon icon="comment-dots" class="text-blue-600" />
                  <span class="text-blue-600 font-medium">Nhắn tin</span>
                </base-button>
                
                <base-button
                  v-else-if="authStore.isCandidate && authStore.isLoggedIn && !authStore.userInfo?.is_premium"
                  type="button"
                  variant="secondary" 
                  size="md"
                  class="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 hover:border-yellow-300 shadow-md hover:shadow-lg"
                  @click="showPremiumRequiredModal('chat')"
                >
                  <font-awesome-icon icon="comment-dots" class="text-yellow-600" />
                  <span class="text-yellow-600 font-medium">Nâng cấp để nhắn tin</span>
                </base-button>

                <!-- Button Báo cáo bài đăng -->
                <base-button
                  v-if="authStore.isLoggedIn"
                  type="button"
                  variant="danger" 
                  size="md"
                  class="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 hover:border-red-300 shadow-md hover:shadow-lg"
                  @click="showReportModal = true"
                >
                  <font-awesome-icon icon="flag" class="text-red-600" />
                  <span class="text-red-600 font-medium">Báo cáo</span>
                </base-button>
              </div>
              <div v-if="authStore.isLoggedIn && job.latest_application_date" class="hidden sm:flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-100 shadow-sm">
                <font-awesome-icon icon="check-circle" class="text-green-500" />
                <div class="text-gray-700 text-sm">
                  <span>Đã ứng tuyển: {{ job.latest_application_date }}</span>
                  <router-link to="/my-applications" class="text-blue-600 hover:underline ml-2 font-medium">Xem CV</router-link>
                </div>
              </div>
            </div>
            
            <!-- Hiển thị thông báo đã ứng tuyển trên mobile -->
            <div v-if="authStore.isLoggedIn && job.latest_application_date" class="sm:hidden mt-4 flex items-center gap-2 bg-green-50 px-4 py-3 rounded-lg border border-green-100 shadow-sm">
              <font-awesome-icon icon="check-circle" class="text-green-500" />
              <div class="text-gray-700 text-sm">
                <span>Đã ứng tuyển: {{ job.latest_application_date }}</span>
                <router-link to="/my-applications" class="text-blue-600 hover:underline ml-2 font-medium">Xem CV</router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Main content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left column -->
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white shadow-lg rounded-lg overflow-hidden transform hover:shadow-xl transition-all duration-300">
              <div class="p-4 md:p-6">
                <div class="flex flex-wrap items-center gap-2 mb-4">
                  <span class="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-xs md:text-sm hover:bg-gray-200 transition-colors">
                    {{ job.position_name }}
                  </span>
                  <span class="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-xs md:text-sm hover:bg-gray-200 transition-colors">
                    {{ job.field_name }}
                  </span>
                </div>

                <section class="mb-8">
                  <h2 class="text-lg md:text-xl font-bold text-gray-900 mb-4">Mô tả công việc</h2>
                  <div class="prose text-gray-600 text-sm md:text-base whitespace-pre-line">{{ job.description }}</div>
                </section>

                <section class="mb-8">
                  <h2 class="text-lg md:text-xl font-bold text-gray-900 mb-4">Yêu cầu ứng viên</h2>
                  <div class="prose text-gray-600 text-sm md:text-base whitespace-pre-line">{{ job.required }}</div>
                </section>

                <section>
                  <h2 class="text-lg md:text-xl font-bold text-gray-900 mb-4">Quyền lợi</h2>
                  <div class="prose text-gray-600 text-sm md:text-base whitespace-pre-line">{{ job.interest }}</div>
                </section>
              </div>
            </div>
          </div>

          <!-- Right column -->
          <div class="space-y-6">
            <!-- Company info -->
             <!-- Nếu doanh nghiệp là premium thì hiện pro company -->
            <div class="bg-white shadow-lg rounded-lg overflow-hidden transform hover:shadow-xl transition-all duration-300">
              <div class="p-4 md:p-6">
                <div class="flex items-center mb-6">
                  <img 
                    :src="job.enterprise_logo" 
                    alt="Company logo" 
                    class="w-14 h-14 md:w-16 md:h-16 object-contain bg-white rounded p-1" 
                    @error="handleImageError"
                  />
                  
                  <div class="ml-3">
                    <h3 class="font-bold text-gray-900 text-sm md:text-base">{{ job.enterprise_name }}</h3>
                    <div v-if="job.is_enterprise_premium">
                      <span class="inline-flex items-center px-2 py-1 bg-amber-400 text-white rounded-full text-xs font-semibold shadow">Pro Company</span> 
                    </div>
                  </div>
                </div>
                

                <div class="space-y-4 text-gray-600 text-sm md:text-base">
                  <div class="flex items-start">
                    <font-awesome-icon icon="map-marker-alt" class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{{ job.enterprise_address }}</span>
                  </div>
                  <router-link 
                    :to="{ name: 'EnterpriseDetail', params: { id: job.enterprise } }" 
                    class="text-blue-600 hover:underline flex items-center group"
                  >
                    <font-awesome-icon icon="external-link-alt" class="w-5 h-5 mr-3 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                    Xem trang công ty
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Additional info -->
            <div class="bg-white shadow-lg rounded-lg overflow-hidden transform hover:shadow-xl transition-all duration-300">
              <div class="p-4 md:p-6">
                <h3 class="font-bold text-gray-900 mb-4 text-base md:text-lg">Thông tin chung</h3>
                <div class="space-y-4">
                  <div class="flex items-center transform hover:scale-105 transition-transform">
                    <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <font-awesome-icon icon="graduation-cap" class="text-emerald-500" />
                    </div>
                    <div>
                      <div class="text-gray-500 text-xs md:text-sm">Cấp bậc</div>
                      <div class="font-medium text-sm md:text-base">{{ job.level }}</div>
                    </div>
                  </div>

                  <div class="flex items-center transform hover:scale-105 transition-transform">
                    <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <font-awesome-icon icon="users" class="text-purple-500" />
                    </div>
                    <div>
                      <div class="text-gray-500 text-xs md:text-sm">Số lượng tuyển</div>
                      <div class="font-medium text-sm md:text-base">{{ job.quantity }} người</div>
                    </div>
                  </div>

                  <div class="flex items-center transform hover:scale-105 transition-transform">
                    <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <font-awesome-icon icon="clock" class="text-orange-500" />
                    </div>
                    <div>
                      <div class="text-gray-500 text-xs md:text-sm">Thời gian làm việc</div>
                      <div class="font-medium text-sm md:text-base">{{ job.time_working }}</div>
                    </div>
                  </div>

                  <div class="flex items-center transform hover:scale-105 transition-transform">
                    <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <font-awesome-icon icon="briefcase" class="text-orange-500" />
                    </div>
                    <div>
                      <div class="text-gray-500 text-xs md:text-sm">Hình thức làm việc</div>
                      <div class="font-medium text-sm md:text-base">{{ job.type_working }}</div>
                    </div>
                  </div>

                  <div class="flex items-center gap-1">
                    <i class="fas fa-calendar-alt text-green-500"></i>
                    <span>Hạn nộp: {{ formatDate(job.deadline) }}</span>
                  </div>
                  
                  <!-- Hiển thị số lượng ứng viên với animation khi có quyền premium -->
                  <div v-if="(authStore.isLoggedIn && authStore.userInfo?.is_premium) && job.total_applicants !== undefined" 
                       class="flex items-center gap-2 bg-blue-50 py-2 px-3 rounded-lg text-blue-700 transform hover:scale-105 transition-all duration-300">
                    <i class="fas fa-users text-blue-500"></i>
                    <div>
                      <span class="font-medium">{{ job.total_applicants }} ứng viên</span>
                      <span class="text-sm text-blue-600"> đã ứng tuyển</span>
                    </div>
                    <i class="fas fa-crown text-yellow-500 ml-1"></i>
                  </div>
                  
                  <!-- Khi có ứng viên nhưng không có quyền xem (premium lock) -->
                  <div v-else-if="job.has_applicants && !(authStore.isLoggedIn && authStore.userInfo?.is_premium)" 
                       @click="showPremiumRequiredModal('view-applicants')"
                       class="flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 py-2 px-3 rounded-lg text-gray-700 cursor-pointer hover:bg-yellow-50 transform hover:scale-105 transition-all duration-300">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-lock text-gray-400"></i>
                      <div>
                        <span class="font-medium">?? ứng viên</span>
                        <span class="text-sm text-gray-500"> đã ứng tuyển</span>
                      </div>
                    </div>
                    <div class="flex items-center gap-1 text-yellow-600 font-medium text-sm">
                      <i class="fas fa-crown text-yellow-500"></i>
                      <span>Nâng cấp Premium</span>
                      <i class="fas fa-arrow-right text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ứng tuyển -->
    <div v-if="showApplyModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black/50" @click="closeApplyModal"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300"
        :class="{'translate-y-0 opacity-100 scale-100': showApplyModal, 'translate-y-4 opacity-0 scale-95': !showApplyModal}">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg md:text-xl font-bold text-gray-900 pr-6">Ứng tuyển vị trí: {{ job.title }}</h3>
          <button @click="closeApplyModal" class="text-gray-400 hover:text-gray-600">
            <font-awesome-icon icon="times" class="text-xl" />
          </button>
        </div>
        
        <!-- Form -->
        <form @submit.prevent="submitApplication" class="p-4 md:p-6">
          <!-- Thông báo lỗi -->
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            <div class="flex items-center">
              <font-awesome-icon icon="exclamation-circle" class="mr-2 flex-shrink-0" />
              <span>{{ errorMessage }}</span>
            </div>
          </div>
          
          <div class="space-y-4">
            <!-- Tên -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span class="text-red-500">*</span></label>
              <input 
                v-model="applyForm.name" 
                type="text" 
                required
                class="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                :class="{'border-red-500': applyErrors.name}"
              >
              <p v-if="applyErrors.name" class="mt-1 text-sm text-red-500">{{ applyErrors.name }}</p>
            </div>
            
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
              <input 
                v-model="applyForm.email" 
                type="email" 
                required
                class="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                :class="{'border-red-500': applyErrors.email}"
              >
              <p v-if="applyErrors.email" class="mt-1 text-sm text-red-500">{{ applyErrors.email }}</p>
            </div>
            
            <!-- Số điện thoại -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span class="text-red-500">*</span></label>
              <input 
                v-model="applyForm.phone_number" 
                type="tel" 
                required
                class="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                :class="{'border-red-500': applyErrors.phone_number}"
              >
              <p v-if="applyErrors.phone_number" class="mt-1 text-sm text-red-500">{{ applyErrors.phone_number }}</p>
            </div>
            
            <!-- Mô tả -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Giới thiệu bản thân <span class="text-red-500">*</span></label>
              <textarea 
                v-model="applyForm.description" 
                rows="3"
                required
                class="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                :class="{'border-red-500': applyErrors.description}"
                placeholder="Giới thiệu ngắn gọn về bản thân bạn, kinh nghiệm và lý do muốn ứng tuyển vị trí này..."
              ></textarea>
              <p v-if="applyErrors.description" class="mt-1 text-sm text-red-500">{{ applyErrors.description }}</p>
            </div>
            
            <!-- Upload CV -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">CV của bạn <span class="text-red-500">*</span></label>
              <div class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 transition-all"
                :class="{'border-blue-500 bg-blue-50': isDragging, 'border-red-300': applyErrors.cv}"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleFileDrop"
              >
                <div v-if="cvFile" class="flex items-center justify-between">
                  <div class="flex items-center">
                    <font-awesome-icon icon="file-pdf" class="text-red-500 text-xl mr-3 flex-shrink-0" />
                    <div class="truncate">
                      <p class="font-medium text-gray-900 text-sm md:text-base truncate">{{ cvFile.name }}</p>
                      <p class="text-xs md:text-sm text-gray-500">{{ formatFileSize(cvFile.size) }}</p>
                    </div>
                  </div>
                  <button type="button" @click="removeCvFile" class="text-gray-400 hover:text-red-500 ml-2 flex-shrink-0">
                    <font-awesome-icon icon="times" />
                  </button>
                </div>
                
                <div v-else class="flex flex-col items-center justify-center">
                  <font-awesome-icon icon="cloud-upload-alt" class="text-gray-400 text-2xl md:text-3xl mb-3" />
                  <p class="text-center text-gray-500 text-sm md:text-base">Kéo thả file CV của bạn vào đây hoặc
                    <label class="text-blue-600 cursor-pointer hover:underline">
                      tải lên từ máy tính
                      <input 
                        type="file" 
                        class="hidden" 
                        @change="handleFileChange" 
                        accept=".pdf,.doc,.docx"
                      >
                    </label>
                  </p>
                  <p class="text-xs md:text-sm text-gray-400 mt-1">Chấp nhận PDF, DOCX (Tối đa 5MB)</p>
                </div>
              </div>
              <p v-if="applyErrors.cv" class="mt-1 text-sm text-red-500">{{ applyErrors.cv }}</p>
            </div>
          </div>
          
          <!-- Submit button -->
          <div class="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <button 
              type="button" 
              @click="closeApplyModal" 
              class="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mb-2 sm:mb-0"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="flex items-center justify-center">
                <font-awesome-icon icon="circle-notch" class="fa-spin mr-2" />
                Đang gửi...
              </span>
              <span v-else>Gửi ứng tuyển</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal thông báo cần đăng nhập -->
    <div v-if="showLoginRequiredModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black/50" @click="showLoginRequiredModal = false"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300"
        :class="{'translate-y-0 opacity-100 scale-100': showLoginRequiredModal, 'translate-y-4 opacity-0 scale-95': !showLoginRequiredModal}">
        <div class="p-4 md:p-6">
          <div class="flex items-center justify-center mb-4">
            <div class="bg-yellow-100 p-3 rounded-full">
              <font-awesome-icon icon="exclamation-triangle" class="text-yellow-500 text-xl md:text-2xl" />
            </div>
          </div>
          <h3 class="text-lg font-medium text-center text-gray-900 mb-2">Yêu cầu đăng nhập</h3>
          <p class="text-gray-500 text-center mb-6">Bạn cần đăng nhập để có thể ứng tuyển vào vị trí này</p>
          <div class="flex flex-col sm:flex-row justify-center gap-2 sm:space-x-4">
            <button
              @click="showLoginRequiredModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 order-2 sm:order-1"
            >
              Để sau
            </button>
            <button
              @click="redirectToLogin"
              class="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 order-1 sm:order-2 mb-2 sm:mb-0"
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div 
      v-if="showNotification" 
      class="fixed bottom-4 right-4 z-50 max-w-md w-full sm:w-auto shadow-xl rounded-lg overflow-hidden transform transition-all duration-300"
      :class="{
        'translate-y-0 opacity-100': showNotification,
        'translate-y-4 opacity-0': !showNotification,
        'bg-green-50 border border-green-200': notificationType === 'success',
        'bg-red-50 border border-red-200': notificationType === 'error'
      }"
    >
      <div class="p-4 flex items-center">
        <div 
          class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3"
          :class="{
            'bg-green-100': notificationType === 'success',
            'bg-red-100': notificationType === 'error'
          }"
        >
          <font-awesome-icon 
            :icon="notificationType === 'success' ? 'check-circle' : 'exclamation-circle'" 
            :class="{
              'text-green-500': notificationType === 'success',
              'text-red-500': notificationType === 'error'
            }" 
          />
        </div>
        <div class="flex-1 mr-2">
          <p 
            class="font-medium text-sm"
            :class="{
              'text-green-800': notificationType === 'success',
              'text-red-800': notificationType === 'error'
            }"
          >
            {{ notificationType === 'success' ? successMessage : errorMessage }}
          </p>
        </div>
        <button 
          @click="showNotification = false" 
          class="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <font-awesome-icon icon="times" />
        </button>
      </div>
    </div>
    
    <!-- Nút quay lại -->
    <button 
      @click="$router.go(-1)" 
      class="fixed bottom-6 left-6 z-30 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-300 focus:outline-none"
      aria-label="Quay lại"
    >
      <font-awesome-icon icon="arrow-left" class="text-gray-600" />
    </button>
    
    <!-- Công việc liên quan -->
    <div v-if="!loading && job.related_posts && job.related_posts.length > 0" class="max-w-5xl mx-auto mt-8">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <font-awesome-icon icon="briefcase" class="text-blue-500 mr-2" />
        <span>Việc làm liên quan</span>
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div 
          v-for="relatedJob in job.related_posts" 
          :key="relatedJob.id" 
          class="bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-all duration-300 flex flex-col"
          :class="{'border-2 border-amber-400 shadow-amber-200': relatedJob.is_enterprise_premium}"
        >
          <div class="p-4 flex-1">
            <!-- Pro badge cho doanh nghiệp premium -->
            <div v-if="relatedJob.is_enterprise_premium" class="flex justify-end -mt-2 -mr-2 mb-1">
              <span class="bg-amber-400 text-white text-xs font-semibold px-2 py-0.5 rounded-bl-lg rounded-tr-lg shadow-sm flex items-center">
                <font-awesome-icon icon="crown" class="mr-1" />
                Premium
              </span>
            </div>
            
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 
                  @click="navigateToJob(relatedJob.id)" 
                  class="font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer"
                >
                  {{ relatedJob.title }}
                </h3>
              </div>
              <div>
                <button 
                  @click="handleSaveJob(relatedJob)"
                  class="text-lg focus:outline-none transition-colors duration-300"
                  :title="relatedJob.is_saved ? 'Bỏ lưu' : 'Lưu tin tuyển dụng'"
                >
                  <font-awesome-icon 
                    :icon="['fas', 'heart']" 
                    :class="relatedJob.is_saved ? 'text-red-500' : 'text-gray-300 hover:text-red-500'"
                  />
                </button>
              </div>
            </div>
            
            <div class="flex items-center mb-2">
              <div class="relative w-8 h-8">
                <img 
                  :src="relatedJob.enterprise_logo" 
                  alt="Company logo" 
                  class="w-8 h-8 object-contain rounded-full mr-2" 
                  :class="{'border border-amber-400': relatedJob.is_enterprise_premium}"
                  @error="handleImageError"
                />
                <span v-if="relatedJob.is_enterprise_premium" class="absolute -right-1 -top-1 w-3 h-3 bg-amber-400 rounded-full border border-white"></span>
              </div>
              <p class="text-gray-700 text-sm font-medium ml-2" :class="{'text-amber-700': relatedJob.is_enterprise_premium}">
                {{ relatedJob.enterprise_name }}
              </p>
            </div>
            
            <div class="grid grid-cols-1 gap-2 mb-3">
              <div class="flex items-center text-sm text-gray-500">
                <font-awesome-icon icon="map-marker-alt" class="mr-2 text-gray-400" />
                <span>{{ relatedJob.city }}</span>
              </div>
              
              <div class="flex items-center text-sm text-gray-500">
                <font-awesome-icon icon="briefcase" class="mr-2 text-gray-400" />
                <span>{{ relatedJob.experience }}</span>
              </div>
              
              <div class="flex items-center text-sm text-gray-500">
                <font-awesome-icon icon="business-time" class="mr-2 text-gray-400" />
                <span>{{ relatedJob.type_working }}</span>
              </div>
              
              <div class="flex items-center text-sm" :class="{'text-amber-600 font-medium': relatedJob.is_enterprise_premium, 'text-gray-500': !relatedJob.is_enterprise_premium}">
                <font-awesome-icon icon="money-bill-wave" class="mr-2" :class="{'text-amber-500': relatedJob.is_enterprise_premium, 'text-gray-400': !relatedJob.is_enterprise_premium}" />
                <span>{{ getSalaryDisplay(relatedJob) }}</span>
              </div>
            </div>
            
            <div class="flex justify-between items-center mt-auto pt-2 border-t" :class="{'border-amber-100': relatedJob.is_enterprise_premium, 'border-gray-100': !relatedJob.is_enterprise_premium}">
              <div class="text-xs text-gray-500">
                <font-awesome-icon icon="calendar-alt" class="mr-1" />
                <span>Hạn: {{ formatDate(relatedJob.deadline) }}</span>
              </div>
              <button 
                @click="navigateToJob(relatedJob.id)" 
                class="text-sm font-medium flex items-center"
                :class="{'text-amber-600 hover:text-amber-800': relatedJob.is_enterprise_premium, 'text-blue-600 hover:text-blue-800': !relatedJob.is_enterprise_premium}"
              >
                <span>Xem chi tiết</span>
                <font-awesome-icon icon="arrow-right" class="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal giới hạn ứng tuyển -->
    <div v-if="showLimitReachedModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black/50" @click="showLimitReachedModal = false"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300"
        :class="{'translate-y-0 opacity-100 scale-100': showLimitReachedModal, 'translate-y-4 opacity-0 scale-95': !showLimitReachedModal}">
        <div class="p-4 md:p-6">
          <div class="flex items-center justify-center mb-4">
            <div class="bg-yellow-100 p-3 rounded-full">
              <font-awesome-icon icon="exclamation-triangle" class="text-yellow-500 text-xl md:text-2xl" />
            </div>
          </div>
          <h3 class="text-lg font-medium text-center text-gray-900 mb-2">Giới hạn ứng tuyển</h3>
          <p class="text-gray-500 text-center mb-6">Bạn đã đạt giới hạn số lượng ứng tuyển trong ngày. Vui lòng thử lại vào ngày mai hoặc nâng cấp tài khoản Premium để ứng tuyển không giới hạn.</p>
          <div class="flex flex-col sm:flex-row justify-center gap-2 sm:space-x-4">
            <button
              @click="showLimitReachedModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 order-2 sm:order-1"
            >
              Để sau
            </button>
            <button
              @click="redirectToPremium"
              class="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 order-1 sm:order-2 mb-2 sm:mb-0"
            >
              Nâng cấp ngay
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Báo cáo bài đăng -->
    <div v-if="showReportModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black/50" @click="closeReportModal"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300"
        :class="{'translate-y-0 opacity-100 scale-100': showReportModal, 'translate-y-4 opacity-0 scale-95': !showReportModal}">
        <div class="p-4 md:p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Báo cáo bài đăng</h3>
            <button @click="closeReportModal" class="text-gray-400 hover:text-gray-600">
              <font-awesome-icon icon="times" />
            </button>
          </div>

          <form @submit.prevent="submitReport" class="space-y-4">
            <div>
              <label for="report-reason" class="block text-sm font-medium text-gray-700 mb-1">Lý do báo cáo <span class="text-red-500">*</span></label>
              <textarea 
                id="report-reason"
                v-model="reportForm.reason" 
                rows="4" 
                class="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                :class="{'border-red-500': reportError}"
                placeholder="Vui lòng mô tả chi tiết lý do bạn báo cáo bài đăng này..."
                required
              ></textarea>
              <p v-if="reportError" class="mt-1 text-sm text-red-500">{{ reportError }}</p>
            </div>

            <div class="flex gap-2 justify-end">
              <button 
                type="button" 
                @click="closeReportModal" 
                class="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Hủy
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isReportSubmitting"
              >
                <span v-if="isReportSubmitting" class="flex items-center justify-center">
                  <font-awesome-icon icon="circle-notch" class="fa-spin mr-2" />
                  Đang gửi...
                </span>
                <span v-else>Gửi báo cáo</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import BaseButton from '../components/common/BaseButton.vue'
import BaseAlert from '../components/common/BaseAlert.vue'
import { useToast } from '@/composables/useToast'
import socketService from '@/services/socketService'

const route = useRoute()
const router = useRouter()
const job = ref({})
const loading = ref(true)
const showApplyModal = ref(false)
const showLoginRequiredModal = ref(false)
const showLimitReachedModal = ref(false)
const showReportModal = ref(false)
const isDragging = ref(false)
const cvFile = ref(null)
const isSubmitting = ref(false)
const isReportSubmitting = ref(false)
const authStore = useAuthStore()
const { addToast } = useToast()

const applyForm = reactive({
  name: '',
  email: '',
  phone_number: '',
  description: ''
})

const applyErrors = reactive({
  name: '',
  email: '',
  phone_number: '',
  description: '',
  cv: ''
})

const successMessage = ref('')
const errorMessage = ref('')
const showNotification = ref(false)
const notificationType = ref('success') // success or error

const reportError = ref('')
const reportForm = reactive({
  reason: ''
})

const handleImageError = (e) => {
  // Nếu đã xử lý rồi hoặc src đang trống, không làm gì cả
  if (e.target.classList.contains('img-error-handled') || !e.target.src) {
    return;
  }
  
  console.warn('Lỗi khi tải hình ảnh:', e.target.src);
  
  // Đánh dấu đã xử lý để tránh gọi lại nhiều lần
  e.target.classList.add('img-error-handled');
  e.target.classList.add('img-error');
  
  // Ngăn chặn sự kiện error tiếp tục kích hoạt
  e.target.onerror = null;
  
  // Tắt tính năng tải lại ảnh
  e.target.loading = 'none';
  
  // Thay đổi src thành transparent image nhỏ 1x1 pixel
  e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  
  // Ẩn phần tử img
  e.target.style.display = 'none';
  
  // Nếu là logo công ty, hiển thị một div màu xám có chữ cái đầu công ty
  const companyName = job.value?.enterprise_name || 'Company';
  const initial = companyName.charAt(0).toUpperCase();
  
  // Tìm phần tử cha gần nhất
  const parent = e.target.parentElement;
  if (parent) {
    // Kiểm tra xem đã có placeholder chưa để tránh tạo thêm
    if (!parent.querySelector('.image-placeholder')) {
      // Tạo phần tử mới để hiển thị chữ cái đầu
      const placeholder = document.createElement('div');
      placeholder.className = 'w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xl image-placeholder';
      placeholder.textContent = initial;
      
      // Thêm vào parent
      parent.appendChild(placeholder);
    }
  }
}

const formatSalary = (salary) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(salary)
}

const getSalaryDisplay = (job) => {
  if (job.is_salary_negotiable) {
    return 'Thoả thuận'
  }

  if (job.salary_min === 0 && job.salary_max > 0) {
    return `Tới ${formatSalary(job.salary_max)}`
  }

  if (job.salary_max === 0 && job.salary_min > 0) {
    return `Từ ${formatSalary(job.salary_min)}`
  }

  if (job.salary_min > 0 && job.salary_max > 0) {
    return `${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)}`
  }

  return 'Thoả thuận'
}

const fetchJobDetail = async () => {
  try {
    loading.value = true
    const postStore = usePostStore()
    const response = await postStore.fetchPostById(route.params.id)
    job.value = response.data.data
  } catch (error) {
    console.error('Error fetching job details:', error)
  } finally {
    loading.value = false
  }
}

const closeApplyModal = () => {
  showApplyModal.value = false
  // Reset form and errors
  Object.keys(applyForm).forEach(key => {
    applyForm[key] = ''
  })
  Object.keys(applyErrors).forEach(key => {
    applyErrors[key] = ''
  })
  cvFile.value = null
  isDragging.value = false
  errorMessage.value = ''
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateCvFile(file)
  }
}

const handleFileDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    validateCvFile(file)
  }
}

const validateCvFile = (file) => {
  applyErrors.cv = ''
  
  // Kiểm tra loại file
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!allowedTypes.includes(file.type)) {
    applyErrors.cv = 'Chỉ chấp nhận file PDF, DOC hoặc DOCX'
    return
  }
  
  // Kiểm tra kích thước file (tối đa 5MB)
  if (file.size > 5 * 1024 * 1024) {
    applyErrors.cv = 'Kích thước file không được vượt quá 5MB'
    return
  }
  
  cvFile.value = file
}

const removeCvFile = () => {
  cvFile.value = null
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(applyErrors).forEach(key => {
    applyErrors[key] = ''
  })
  
  // Validate name
  if (!applyForm.name.trim()) {
    applyErrors.name = 'Vui lòng nhập họ và tên'
    isValid = false
  }
  
  // Validate email
  if (!applyForm.email.trim()) {
    applyErrors.email = 'Vui lòng nhập email'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(applyForm.email)) {
    applyErrors.email = 'Email không hợp lệ'
    isValid = false
  }
  
  // Validate phone number
  if (!applyForm.phone_number.trim()) {
    applyErrors.phone_number = 'Vui lòng nhập số điện thoại'
    isValid = false
  } else if (!/^[0-9]{10}$/.test(applyForm.phone_number.replace(/\s/g, ''))) {
    applyErrors.phone_number = 'Số điện thoại không hợp lệ'
    isValid = false
  }
  
  // Validate description
  if (!applyForm.description.trim()) {
    applyErrors.description = 'Vui lòng nhập giới thiệu bản thân'
    isValid = false
  }
  
  // Validate CV
  if (!cvFile.value) {
    applyErrors.cv = 'Vui lòng tải lên CV của bạn'
    isValid = false
  }
  
  return isValid
}

const submitApplication = async () => {
  if (!validateForm()) return
  
  try {
    isSubmitting.value = true
    errorMessage.value = ''
    
    const formData = new FormData()
    formData.append('post', job.value.id)
    formData.append('name', applyForm.name)
    formData.append('email', applyForm.email)
    formData.append('phone_number', applyForm.phone_number)
    formData.append('description', applyForm.description)
    formData.append('cv', cvFile.value)
    
    const response = await axios.post('/api/cv/create/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    if (response.data.status === 201) {
      // Đóng modal ứng tuyển
      closeApplyModal()
      
      // Cập nhật trạng thái đã ứng tuyển mà không cần reload trang
      const currentDate = new Date()
      const formattedDate = new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(currentDate)
      
      // Cập nhật thông tin job hiện tại với thông tin mới
      job.value = {
        ...job.value,
        latest_application_date: formattedDate,
        // Cập nhật số lượng ứng viên nếu đã có thông tin về số lượng
        total_applicants: job.value.total_applicants !== undefined ? 
                          job.value.total_applicants + 1 : 
                          undefined,
        // Đánh dấu là đã có ứng viên
        has_applicants: true
      }
      
      console.log('Đã cập nhật trạng thái ứng tuyển:', job.value.latest_application_date)
      
      // Hiển thị toast thành công
      showToast('Ứng tuyển thành công! CV của bạn đã được gửi đến nhà tuyển dụng.', 'success')
    }
  } catch (error) {
    console.error('Lỗi khi gửi ứng tuyển:', error)
    
    // Xử lý thông báo từ API
    if (error.response?.data) {
      const responseData = error.response.data
      
      // Kiểm tra trường hợp đạt giới hạn số lượng ứng tuyển
      if (responseData.message === 'Bạn đã đạt giới hạn số lượng ứng tuyển trong ngày') {
        errorMessage.value = responseData.message
        closeApplyModal()
        showLimitReachedModal.value = true
      } 
      // Kiểm tra lỗi từ validator (serializer errors)
      else if (responseData.errors) {
        if (typeof responseData.errors === 'string') {
          // Nếu errors là string, hiển thị nó
          errorMessage.value = responseData.errors
        } else {
          // Nếu errors là object, ánh xạ các lỗi vào form
          const serverErrors = responseData.errors
          Object.keys(serverErrors).forEach(key => {
            if (applyErrors.hasOwnProperty(key)) {
              if (Array.isArray(serverErrors[key])) {
                applyErrors[key] = serverErrors[key][0]
              } else {
                applyErrors[key] = serverErrors[key]
              }
            }
          })
          errorMessage.value = responseData.message || 'Vui lòng kiểm tra lại thông tin đã nhập.'
        }
      } 
      // Các lỗi khác từ server
      else {
        errorMessage.value = responseData.message || 'Đã xảy ra lỗi khi gửi ứng tuyển. Vui lòng thử lại sau.'
      }
    } else {
      errorMessage.value = 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại sau.'
    }
  } finally {
    isSubmitting.value = false
  }
}

const applyForJob = () => {
  if (!authStore.isLoggedIn) {
    // Chuyển hướng đến trang đăng nhập kèm theo URL redirect
    addToast({
      title: 'Cần đăng nhập',
      message: 'Vui lòng đăng nhập để ứng tuyển công việc này',
      type: 'warning'
    })
    router.push({ 
      name: 'Login',
      query: { redirect: route.fullPath } 
    })
    return
  }
  
  if (!authStore.isCandidate) {
    addToast({
      title: 'Không thể ứng tuyển',
      message: 'Chỉ tài khoản ứng viên mới có thể ứng tuyển công việc',
      type: 'error'
    })
    return
  }
  
  // Đã đăng nhập và là ứng viên, mở modal ứng tuyển
  showApplyModal.value = true
}

const redirectToLogin = () => {
  showLoginRequiredModal.value = false
  router.push({
    name: 'Login',
    query: { redirect: route.fullPath }
  })
}

const showToast = (message, type = 'success') => {
  localStorage.setItem('notification', JSON.stringify({
    message,
    type,
    timestamp: new Date().getTime()
  }))

  successMessage.value = type === 'success' ? message : ''
  errorMessage.value = type === 'error' ? message : ''
  notificationType.value = type
  showNotification.value = true

  setTimeout(() => {
    showNotification.value = false
  }, 5000)
}

// Kiểm tra xem job đã được ứng tuyển chưa
const isApplied = computed(() => {
  return !!job.value?.latest_application_date
})

// Kiểm tra quyền chat với nhà tuyển dụng
const canChatWithEmployer = computed(() => {
  return job.value?.can_chat_with_employer === true
})

// Kiểm tra quyền xem số ứng viên
const canViewApplicants = computed(() => {
  // Nếu người dùng đã đăng nhập và là premium, luôn cho phép xem số ứng viên
  if (authStore.isLoggedIn && authStore.userInfo?.is_premium) {
    return true;
  }
  // Nếu không phải premium, kiểm tra theo quyền từ job
  return job.value?.can_view_applicants === true;
})

// Format date string to Vietnamese format
const formatDate = (dateString) => {
  if (!dateString) return 'Không xác định'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

// Hiển thị modal yêu cầu premium
const showPremiumRequiredModal = (feature) => {
  let title = 'Tính năng Premium'
  let message = ''
  let icon = 'crown'
  
  if (feature === 'chat') {
    title = 'Trò chuyện với nhà tuyển dụng'
    message = 'Nâng cấp lên gói Premium để có thể trò chuyện trực tiếp với nhà tuyển dụng và tăng cơ hội được nhận việc!'
    icon = 'comment-dots'
  } else if (feature === 'view-applicants') {
    title = 'Xem số lượng ứng viên'
    message = 'Nâng cấp lên gói Premium để xem số lượng người đã ứng tuyển vào vị trí này và đánh giá mức độ cạnh tranh!'
    icon = 'users'
  }
  
  addToast({
    title,
    message,
    type: 'premium',
    icon,
    duration: 7000,
    action: {
      text: 'Nâng cấp ngay',
      callback: () => router.push({ name: 'CandidatePremium' })
    }
  })
  
  // Có thể chuyển hướng đến trang nâng cấp premium
  setTimeout(() => {
    router.push({ name: 'CandidatePremium' })
  }, 3000)
}

// Mở chat với nhà tuyển dụng
const chatWithEmployer = () => {
  console.log('------------ DEBUG CHAT WITH EMPLOYER ------------');
  console.log('Auth status:', {
    isLoggedIn: authStore.isLoggedIn,
    isAuthenticated: authStore.isAuthenticated,
    userRole: authStore.userRole,
    isCandidate: authStore.isCandidate,
    isPremium: authStore.userInfo?.is_premium,
    token: !!localStorage.getItem('token')
  });
  
  if (!authStore.isLoggedIn) {
    console.error('Không thể chat: Người dùng chưa đăng nhập');
    // Chuyển hướng đến trang đăng nhập kèm theo URL redirect
    addToast({
      title: 'Cần đăng nhập',
      message: 'Vui lòng đăng nhập để nhắn tin với nhà tuyển dụng',
      type: 'warning'
    })
    router.push({ 
      name: 'Login',
      query: { redirect: route.fullPath } 
    })
    return
  }
  
  if (!authStore.isCandidate) {
    console.error('Không thể chat: Người dùng không phải là ứng viên');
    addToast({
      title: 'Không thể nhắn tin',
      message: 'Chỉ tài khoản ứng viên mới có thể nhắn tin với nhà tuyển dụng',
      type: 'error'
    })
    return
  }
  
  if (!authStore.userInfo?.is_premium) {
    console.error('Không thể chat: Người dùng không phải là Premium');
    showPremiumRequiredModal('chat');
    return
  }

  // Kiểm tra thông tin của job
  if (!job.value) {
    addToast({
      title: 'Lỗi',
      message: 'Không tìm thấy thông tin công việc',
      type: 'error'
    })
    return
  }

  // Tìm ID của nhà tuyển dụng, ưu tiên theo thứ tự: user_id, enterprise_id, enterprise
  let employerId = null
  
  // Lấy các thông tin quan trọng của job object để kiểm tra
  console.log('Thông tin job để nhắn tin:', {
    id: job.value.id,
    title: job.value.title,
    user_id: job.value.user_id,
    enterprise_id: job.value.enterprise_id, 
    enterprise: job.value.enterprise,
    enterprise_name: job.value.enterprise_name
  })
  
  // Xác định employerId theo thứ tự ưu tiên
  if (job.value.user_id) {
    employerId = job.value.user_id
    console.log('Sử dụng user_id:', employerId)
  } else if (job.value.enterprise_id) {
    employerId = job.value.enterprise_id
    console.log('Sử dụng enterprise_id:', employerId)
  } else if (job.value.enterprise) {
    employerId = job.value.enterprise
    console.log('Sử dụng enterprise:', employerId)
  }
  
  // Kiểm tra xem có ID không
  if (!employerId) {
    addToast({
      title: 'Lỗi',
      message: 'Không tìm thấy thông tin nhà tuyển dụng',
      type: 'error'
    })
    return
  }
  
  // Đảm bảo kết nối socket được khởi tạo trước khi chuyển hướng
  if (!socketService.connected) {
    console.log('Đang khởi tạo kết nối Socket trước khi chuyển trang...')
    socketService.init()
  }
  
  // Logic để mở chat với nhà tuyển dụng
  console.log(`Chuyển hướng đến trang nhắn tin với nhà tuyển dụng ID: ${employerId}`)
  
  // Chờ một chút để đảm bảo socket đã kết nối
  setTimeout(() => {
    router.push({
      name: 'candidate-messages',
      query: { 
        user: employerId 
      }
    }).catch(error => {
      console.error('Lỗi chuyển hướng đến trang chat:', error)
      addToast({
        title: 'Lỗi chuyển hướng',
        message: 'Không thể mở trang chat, vui lòng thử lại sau',
        type: 'error'
      })
    })
  }, 300)
}

// Handle save/unsave related job
const handleSaveJob = async (relatedJob) => {
  if (!authStore.isLoggedIn) {
    addToast({
      title: 'Cần đăng nhập',
      message: 'Vui lòng đăng nhập để lưu công việc này',
      type: 'warning'
    })
    router.push({ 
      name: 'Login',
      query: { redirect: route.fullPath } 
    })
    return
  }
  
  try {
    const postStore = usePostStore()
    if (relatedJob.is_saved) {
      // Bỏ lưu công việc
      await postStore.deleteSavedPostByPostId(relatedJob.id)
      relatedJob.is_saved = false
      addToast({
        title: 'Đã bỏ lưu',
        message: 'Đã xóa công việc khỏi danh sách đã lưu',
        type: 'success'
      })
    } else {
      // Lưu công việc
      await postStore.savePost(relatedJob.id)
      relatedJob.is_saved = true
      addToast({
        title: 'Đã lưu',
        message: 'Đã thêm công việc vào danh sách đã lưu',
        type: 'success'
      })
    }
  } catch (error) {
    console.error('Lỗi khi lưu/bỏ lưu công việc:', error)
    addToast({
      title: 'Lỗi',
      message: 'Đã xảy ra lỗi khi thực hiện thao tác',
      type: 'error'
    })
  }
}

// Thêm phương thức để chuyển hướng đến trang nâng cấp Premium
const redirectToPremium = () => {
  showLimitReachedModal.value = false
  router.push({ name: 'CandidatePremium' })
}

// Thêm phương thức chuyển hướng đến công việc chi tiết khác
const navigateToJob = (jobId) => {
  if (jobId === parseInt(route.params.id)) {
    // Nếu đang ở trang công việc này rồi, chỉ cần scroll lên đầu
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  
  // Chuyển đến công việc mới
  router.push({ 
    name: 'JobDetail', 
    params: { id: jobId }
  })
}

// Watch for route param changes to reload job data when clicking on related jobs
watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId && newId) {
    console.log(`Job ID changed from ${oldId} to ${newId}, reloading job data...`)
    loading.value = true
    fetchJobDetail()
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}, { immediate: false })

// Hiển thị modal báo cáo
const showReportModalFn = () => {
  if (!authStore.isLoggedIn) {
    addToast({
      title: 'Cần đăng nhập',
      message: 'Vui lòng đăng nhập để báo cáo bài đăng',
      type: 'warning'
    })
    router.push({ 
      name: 'Login',
      query: { redirect: route.fullPath } 
    })
    return
  }
  
  showReportModal.value = true
}

// Đóng modal báo cáo
const closeReportModal = () => {
  showReportModal.value = false
  reportForm.reason = ''
  reportError.value = ''
}

// Gửi báo cáo
const submitReport = async () => {
  if (!reportForm.reason.trim()) {
    reportError.value = 'Vui lòng nhập lý do báo cáo'
    return
  }
  
  try {
    isReportSubmitting.value = true
    
    const response = await axios.post('/api/posts/report/', {
      post: job.value.id,
      reason: reportForm.reason
    })
    
    if (response.status === 201 || response.status === 200) {
      closeReportModal()
      addToast({
        title: 'Báo cáo thành công',
        message: 'Cảm ơn bạn đã báo cáo bài đăng này. Chúng tôi sẽ xem xét và phản hồi sớm.',
        type: 'success'
      })
    }
  } catch (error) {
    console.error('Lỗi khi gửi báo cáo:', error)
    
    if (error.response?.data?.message) {
      reportError.value = error.response.data.message
    } else {
      reportError.value = 'Đã xảy ra lỗi khi gửi báo cáo. Vui lòng thử lại sau.'
    }
  } finally {
    isReportSubmitting.value = false
  }
}

onMounted(() => {
  // Tải thông tin profile để cập nhật trạng thái Premium
  authStore.fetchUserProfile().then(() => {
    console.log('[DEBUG] Thông tin người dùng sau khi tải profile:', authStore.userInfo);
    console.log('[DEBUG] Trạng thái premium sau khi tải profile:', authStore.userInfo?.is_premium);
  });
  
  fetchJobDetail()
})
</script>

<style scoped>
.prose ul {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-pulse-gentle {
  animation: pulse-gentle 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

@keyframes pulse-gentle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.03);
  }
}
</style>