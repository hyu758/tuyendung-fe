<template>
  <div class="create-job-container">
    <!-- Header khu vực -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Đăng tin tuyển dụng mới</h1>
        <p class="text-gray-600 mt-1">Tạo tin tuyển dụng mới để tìm kiếm ứng viên phù hợp</p>
      </div>
      
      <div class="flex space-x-2">
        <button @click="saveDraft" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
          Lưu nháp
        </button>
        <button @click="publishJob" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Đăng tin
        </button>
      </div>
    </div>
    
    <!-- Form đăng tin -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Thông tin cơ bản</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Tiêu đề công việc -->
          <div class="col-span-1 md:col-span-2">
            <label for="jobTitle" class="block text-sm font-medium text-gray-700 mb-1">Tiêu đề công việc <span class="text-red-600">*</span></label>
            <input 
              type="text" 
              id="jobTitle" 
              v-model="jobForm.title" 
              placeholder="Ví dụ: Frontend Developer, UI/UX Designer..." 
              class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p class="mt-1 text-sm text-gray-500">Tiêu đề rõ ràng sẽ giúp thu hút ứng viên phù hợp hơn</p>
          </div>
          
          <!-- Vị trí làm việc -->
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Địa điểm làm việc <span class="text-red-600">*</span></label>
            <input 
              type="text" 
              id="location" 
              v-model="jobForm.location" 
              placeholder="Ví dụ: Hà Nội, Hồ Chí Minh..." 
              class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <!-- Loại công việc -->
          <div>
            <label for="jobType" class="block text-sm font-medium text-gray-700 mb-1">Loại công việc <span class="text-red-600">*</span></label>
            <select 
              id="jobType" 
              v-model="jobForm.jobType" 
              class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Chọn loại công việc --</option>
              <option value="full-time">Toàn thời gian</option>
              <option value="part-time">Bán thời gian</option>
              <option value="contract">Hợp đồng</option>
              <option value="internship">Thực tập</option>
              <option value="remote">Từ xa</option>
            </select>
          </div>
          
          <!-- Phòng ban -->
          <div>
            <label for="department" class="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
            <input 
              type="text" 
              id="department" 
              v-model="jobForm.department" 
              placeholder="Ví dụ: Công nghệ, Thiết kế..." 
              class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <!-- Cấp bậc -->
          <div>
            <label for="level" class="block text-sm font-medium text-gray-700 mb-1">Cấp bậc <span class="text-red-600">*</span></label>
            <select 
              id="level" 
              v-model="jobForm.level" 
              class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Chọn cấp bậc --</option>
              <option value="intern">Thực tập sinh</option>
              <option value="fresher">Fresher (0-1 năm)</option>
              <option value="junior">Junior (1-3 năm)</option>
              <option value="middle">Middle (3-5 năm)</option>
              <option value="senior">Senior (5+ năm)</option>
              <option value="lead">Team Lead</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          
          <!-- Mức lương -->
          <div class="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="salaryMin" class="block text-sm font-medium text-gray-700 mb-1">Mức lương tối thiểu (VNĐ)</label>
              <input 
                type="number" 
                id="salaryMin" 
                v-model="jobForm.salaryMin" 
                placeholder="Ví dụ: 15000000" 
                class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label for="salaryMax" class="block text-sm font-medium text-gray-700 mb-1">Mức lương tối đa (VNĐ)</label>
              <input 
                type="number" 
                id="salaryMax" 
                v-model="jobForm.salaryMax" 
                placeholder="Ví dụ: 25000000" 
                class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="flex items-center col-span-1 md:col-span-2">
              <input 
                type="checkbox" 
                id="hideSelectedSalary" 
                v-model="jobForm.hideSalary" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="hideSelectedSalary" class="ml-2 block text-sm text-gray-700">Không hiển thị mức lương trong tin đăng</label>
            </div>
          </div>
          
          <!-- Hạn ứng tuyển -->
          <div>
            <label for="deadline" class="block text-sm font-medium text-gray-700 mb-1">Hạn nộp hồ sơ <span class="text-red-600">*</span></label>
            <input 
              type="date" 
              id="deadline" 
              v-model="jobForm.deadline" 
              class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <!-- Số lượng tuyển -->
          <div>
            <label for="vacancies" class="block text-sm font-medium text-gray-700 mb-1">Số lượng cần tuyển <span class="text-red-600">*</span></label>
            <input 
              type="number" 
              id="vacancies" 
              v-model="jobForm.vacancies" 
              min="1" 
              placeholder="Ví dụ: 3" 
              class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      </div>
      
      <!-- Yêu cầu và Mô tả -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Mô tả công việc</h2>
        
        <!-- Mô tả công việc -->
        <div class="mb-6">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Mô tả công việc <span class="text-red-600">*</span></label>
          <textarea 
            id="description" 
            v-model="jobForm.description" 
            rows="6" 
            placeholder="Mô tả chi tiết về công việc, trách nhiệm, vị trí làm việc..." 
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>
        
        <!-- Yêu cầu công việc -->
        <div class="mb-6">
          <label for="requirements" class="block text-sm font-medium text-gray-700 mb-1">Yêu cầu công việc <span class="text-red-600">*</span></label>
          <textarea 
            id="requirements" 
            v-model="jobForm.requirements" 
            rows="6" 
            placeholder="Các kỹ năng, kinh nghiệm, yêu cầu về bằng cấp..." 
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>
        
        <!-- Quyền lợi -->
        <div>
          <label for="benefits" class="block text-sm font-medium text-gray-700 mb-1">Quyền lợi</label>
          <textarea 
            id="benefits" 
            v-model="jobForm.benefits" 
            rows="6" 
            placeholder="Các quyền lợi, chế độ, môi trường làm việc..." 
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
      </div>
      
      <!-- Kỹ năng và thông tin khác -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Kỹ năng & Thông tin bổ sung</h2>
        
        <!-- Kỹ năng -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Kỹ năng yêu cầu</label>
          <div class="flex flex-wrap gap-2 mb-2">
            <div v-for="(skill, index) in jobForm.skills" :key="index" class="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-sm">
              {{ skill }}
              <button @click="removeSkill(index)" class="ml-2 text-blue-600 hover:text-blue-800">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div class="flex">
            <input 
              type="text" 
              v-model="newSkill" 
              placeholder="Thêm kỹ năng (Ví dụ: JavaScript, React, UI/UX...)" 
              class="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @keyup.enter="addSkill"
            />
            <button 
              @click="addSkill" 
              class="ml-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Thêm
            </button>
          </div>
        </div>
        
        <!-- Yêu cầu hồ sơ ứng tuyển -->
        <div>
          <label for="applicationInstructions" class="block text-sm font-medium text-gray-700 mb-1">Yêu cầu hồ sơ ứng tuyển</label>
          <textarea 
            id="applicationInstructions" 
            v-model="jobForm.applicationInstructions" 
            rows="4" 
            placeholder="Hướng dẫn về cách thức nộp hồ sơ, các giấy tờ cần thiết..." 
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
      </div>
      
      <!-- Nút hành động -->
      <div class="flex justify-end space-x-2">
        <button @click="cancel" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
          Hủy
        </button>
        <button @click="saveDraft" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
          Lưu nháp
        </button>
        <button @click="publishJob" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Đăng tin
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form dữ liệu công việc
const jobForm = ref({
  title: '',
  location: '',
  jobType: '',
  department: '',
  level: '',
  salaryMin: null,
  salaryMax: null,
  hideSalary: false,
  deadline: '',
  vacancies: 1,
  description: '',
  requirements: '',
  benefits: '',
  skills: [],
  applicationInstructions: ''
})

// Quản lý kỹ năng
const newSkill = ref('')

function addSkill() {
  if (newSkill.value.trim() !== '' && !jobForm.value.skills.includes(newSkill.value.trim())) {
    jobForm.value.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

function removeSkill(index) {
  jobForm.value.skills.splice(index, 1)
}

// Các chức năng hành động
function saveDraft() {
  // Kiểm tra tiêu đề không được để trống
  if (!jobForm.value.title.trim()) {
    alert('Vui lòng nhập tiêu đề công việc')
    return
  }
  
  console.log('Lưu bản nháp:', jobForm.value)
  // Gọi API lưu bản nháp ở đây
  alert('Đã lưu bản nháp thành công')
}

function publishJob() {
  // Kiểm tra các trường bắt buộc
  const requiredFields = [
    { field: jobForm.value.title, name: 'Tiêu đề công việc' },
    { field: jobForm.value.location, name: 'Địa điểm làm việc' },
    { field: jobForm.value.jobType, name: 'Loại công việc' },
    { field: jobForm.value.level, name: 'Cấp bậc' },
    { field: jobForm.value.deadline, name: 'Hạn nộp hồ sơ' },
    { field: jobForm.value.vacancies, name: 'Số lượng cần tuyển' },
    { field: jobForm.value.description, name: 'Mô tả công việc' },
    { field: jobForm.value.requirements, name: 'Yêu cầu công việc' }
  ]
  
  for (const item of requiredFields) {
    if (!item.field || (typeof item.field === 'string' && !item.field.trim())) {
      alert(`Vui lòng nhập ${item.name}`)
      return
    }
  }
  
  console.log('Đăng tin:', jobForm.value)
  // Gọi API đăng tin ở đây
  alert('Đã đăng tin tuyển dụng thành công')
  router.push('/employer/jobs')
}

function cancel() {
  if (confirm('Bạn có chắc chắn muốn hủy? Tất cả thông tin sẽ bị mất.')) {
    router.push('/employer/jobs')
  }
}
</script>

<style scoped>
.create-job-container {
  min-height: calc(100vh - 64px);
}
</style> 