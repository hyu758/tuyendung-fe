<template>
  <div class="max-w-5xl mx-auto">
    <!-- Header section -->
    <div class="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ job.title }}</h1>
        
        <div class="grid grid-cols-3 gap-6 mb-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
              <font-awesome-icon icon="money-bill" class="text-emerald-500 text-xl" />
            </div>
            <div>
              <div class="text-gray-500 text-sm">Mức lương</div>
              <div class="font-medium">{{ getSalaryDisplay(job) }}</div>
            </div>
          </div>

          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <font-awesome-icon icon="map-marker-alt" class="text-blue-500 text-xl" />
            </div>
            <div>
              <div class="text-gray-500 text-sm">Địa điểm</div>
              <div class="font-medium">{{ job.city }}{{ job.district ? `, ${job.district}` : '' }}</div>
            </div>
          </div>

          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <font-awesome-icon icon="briefcase" class="text-purple-500 text-xl" />
            </div>
            <div>
              <div class="text-gray-500 text-sm">Kinh nghiệm</div>
              <div class="font-medium">{{ job.experience }}</div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button class="bg-emerald-500 text-white px-8 py-2.5 rounded-lg hover:bg-emerald-600 transition-colors flex items-center">
              <font-awesome-icon icon="paper-plane" class="mr-2" />
              Ứng tuyển ngay
            </button>
            <button class="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              Nhắn tin
            </button>
          </div>
          <div class="text-gray-500 text-sm">
            <span>Bạn đã gửi CV cho vị trí này vào ngày: {{ job.appliedDate }}</span>
            <a href="#" class="text-blue-600 hover:underline ml-2">Xem CV đã nộp</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="grid grid-cols-3 gap-6">
      <!-- Left column -->
      <div class="col-span-2 space-y-6">
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="p-6">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">{{ job.position_name }}</span>
              <span class="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">{{ job.field_name }}</span>
            </div>

            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Mô tả công việc</h2>
              <div class="prose text-gray-600 whitespace-pre-line">{{ job.description }}</div>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Yêu cầu ứng viên</h2>
              <div class="prose text-gray-600 whitespace-pre-line">{{ job.required }}</div>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 mb-4">Quyền lợi</h2>
              <div class="prose text-gray-600 whitespace-pre-line">{{ job.interest }}</div>
            </section>
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div class="space-y-6">
        <!-- Company info -->
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="p-6">
            <div class="flex items-center mb-6">
              <img :src="job.enterprise_logo" alt="Company logo" class="w-16 h-16 object-cover rounded mr-4" />
              <div>
                <h3 class="font-bold text-gray-900">{{ job.enterprise_name }}</h3>
                <div class="text-gray-600 text-sm mt-1">{{ job.field_name }}</div>
              </div>
            </div>

            <div class="space-y-4 text-gray-600">
              <div class="flex items-start">
                <font-awesome-icon icon="map-marker-alt" class="w-5 h-5 mr-3 mt-1" />
                <span>{{ job.detail_address }}</span>
              </div>
              <a href="#" class="text-blue-600 hover:underline flex items-center">
                <font-awesome-icon icon="external-link-alt" class="w-5 h-5 mr-3" />
                Xem trang công ty
              </a>
            </div>
          </div>
        </div>

        <!-- Additional info -->
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="p-6">
            <h3 class="font-bold text-gray-900 mb-4">Thông tin chung</h3>
            <div class="space-y-4">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                  <font-awesome-icon icon="graduation-cap" class="text-emerald-500" />
                </div>
                <div>
                  <div class="text-gray-500 text-sm">Cấp bậc</div>
                  <div class="font-medium">{{ job.level }}</div>
                </div>
              </div>

              <div class="flex items-center">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <font-awesome-icon icon="users" class="text-purple-500" />
                </div>
                <div>
                  <div class="text-gray-500 text-sm">Số lượng tuyển</div>
                  <div class="font-medium">{{ job.quantity }} người</div>
                </div>
              </div>

              <div class="flex items-center">
                <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <font-awesome-icon icon="clock" class="text-orange-500" />
                </div>
                <div>
                  <div class="text-gray-500 text-sm">Thời gian làm việc</div>
                  <div class="font-medium">{{ job.time_working }}</div>
                </div>
              </div>

              <div class="flex items-center">
                <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <font-awesome-icon icon="briefcase" class="text-orange-500" />
                </div>
                <div>
                  <div class="text-gray-500 text-sm">Hình thức làm việc</div>
                  <div class="font-medium">{{ job.type_working }}</div>
                </div>
              </div>

              <div class="flex items-center">
                <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <font-awesome-icon icon="calendar" class="text-orange-500" />
                </div>
                <div>
                  <div class="text-gray-500 text-sm">Hạn nộp hồ sơ</div>
                  <div class="font-medium">{{ new Date(job.deadline).toLocaleDateString('vi-VN') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="p-6">
            <h3 class="font-bold text-gray-900 mb-4">Kỹ năng cần có</h3>
            <div class="flex flex-wrap gap-2">
              <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">C# Programming</span>
              <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Unity Game Engine</span>
              <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Object Oriented Programming (oop)</span>
              <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Version Control (git)</span>
              <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Problem Solving And Debugging</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useJobStore } from '@/stores/job'

const route = useRoute()
const job = ref({})

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
    const jobStore = useJobStore()
    const response = await jobStore.fetchJobById(route.params.id)
    job.value = response.data.data
  } catch (error) {
    console.error('Error fetching job details:', error)
  }
}

onMounted(() => {
  fetchJobDetail()
})
</script>

<style scoped>
.prose ul {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>