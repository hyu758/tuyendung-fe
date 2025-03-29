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
              <div class="font-medium">{{ job.salary }}</div>
            </div>
          </div>

          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <font-awesome-icon icon="map-marker-alt" class="text-blue-500 text-xl" />
            </div>
            <div>
              <div class="text-gray-500 text-sm">Địa điểm</div>
              <div class="font-medium">{{ job.location }}</div>
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
              Ứng tuyển lại
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
              <span class="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">Game Developer</span>
              <span class="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">IT - Phần mềm</span>
              <span class="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">Nghi thứ 7</span>
            </div>

            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Mô tả công việc</h2>
              <div class="prose text-gray-600">
                <p>We are looking for a passionate developer who shares our excitement for creating amazing gameplay experiences for players.</p>
                <ul class="list-disc pl-5 mt-3">
                  <li>Learn how to build a game from scratch.</li>
                  <li>Learn how to collaborate with designers, artists, and engineers to deliver a complete product</li>
                </ul>
              </div>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Yêu cầu ứng viên</h2>
              <div class="prose text-gray-600">
                <ul class="list-disc pl-5">
                  <li>Currently in the final year of a college/university program or recently graduated in the field of Information Technology.</li>
                  <li>Passionate about RPG games and curious about game development.</li>
                  <li>Strong foundation in algorithms, data structures, and mathematics.</li>
                  <li>Excellent problem-solving and troubleshooting skills.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 mb-4">Quyền lợi</h2>
              <div class="prose text-gray-600">
                <ul class="list-disc pl-5">
                  <li>Provides competitive training support of up to $500.</li>
                  <li>Offers an exclusive training program.</li>
                  <li>Opportunity to work and learn from industry professionals, including those who have shipped both high-quality and low-quality console and mobile games.</li>
                </ul>
              </div>
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
              <img alt="Company logo" class="w-16 h-16 object-cover rounded mr-4" />
              <div>
                <h3 class="font-bold text-gray-900">CÔNG TY CỔ PHẦN KONG SOFTWARE</h3>
                <div class="text-gray-600 text-sm mt-1">IT - Phần mềm</div>
              </div>
            </div>

            <div class="space-y-4 text-gray-600">
              <div class="flex items-center">
                <font-awesome-icon icon="users" class="w-5 h-5 mr-3" />
                <span>Quy mô: 10-24 nhân viên</span>
              </div>
              <div class="flex items-start">
                <font-awesome-icon icon="map-marker-alt" class="w-5 h-5 mr-3 mt-1" />
                <span>V5-B03 KĐT The Terra An Hưng - P. Tố Hữu, Q. Hà Đông</span>
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
                  <div class="font-medium">Thực tập sinh</div>
                </div>
              </div>

              <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <font-awesome-icon icon="book" class="text-blue-500" />
                </div>
                <div>
                  <div class="text-gray-500 text-sm">Học vấn</div>
                  <div class="font-medium">Đại học trở lên</div>
                </div>
              </div>

              <div class="flex items-center">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <font-awesome-icon icon="users" class="text-purple-500" />
                </div>
                <div>
                  <div class="text-gray-500 text-sm">Số lượng tuyển</div>
                  <div class="font-medium">2 người</div>
                </div>
              </div>

              <div class="flex items-center">
                <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <font-awesome-icon icon="clock" class="text-orange-500" />
                </div>
                <div>
                  <div class="text-gray-500 text-sm">Hình thức làm việc</div>
                  <div class="font-medium">Toàn thời gian</div>
                </div>
              </div>

              <div class="flex items-center">
                <div class="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                  <font-awesome-icon icon="venus-mars" class="text-pink-500" />
                </div>
                <div>
                  <div class="text-gray-500 text-sm">Giới tính</div>
                  <div class="font-medium">Nam</div>
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
import { ref } from 'vue'

const job = ref({
  title: 'Unity Developer Fresher',
  salary: 'Tới 10 triệu',
  location: 'Hà Nội',
  experience: 'Không yêu cầu',
  appliedDate: '25/03/2025'
})
</script>

<style scoped>
.prose ul {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>