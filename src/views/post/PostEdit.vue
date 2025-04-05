<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow-xl rounded-lg overflow-hidden">
        <div class="p-8">
          <!-- Header -->
          <div class="flex items-center justify-between mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Chỉnh sửa tin tuyển dụng</h1>
            <button @click="router.back()"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <i class="fas fa-arrow-left mr-2"></i>
              Quay lại
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-8">
            <!-- Thông tin chung -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Thông tin chung</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tiêu đề tin <span
                      class="text-red-500">*</span></label>
                  <input v-model="form.title" type="text" required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.title }">
                  <p v-if="errors.title" class="mt-1 text-sm text-red-500">{{ errors.title }}</p>
                </div>
                <!-- Thêm một select box lấy thông tin lĩnh vực theo id, API là /api/fields/id. để readonly-->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Lĩnh vực <span
                      class="text-red-500">*</span></label>
                  <input 
                    :value="currentField?.name || 'Đang tải...'" 
                    type="text" 
                    readonly
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Vị trí <span
                      class="text-red-500">*</span></label>
                  <input 
                    :value="currentPosition?.name || 'Đang tải...'" 
                    type="text" 
                    readonly
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Hạn nộp hồ sơ <span
                      class="text-red-500">*</span></label>
                  <input v-model="form.deadline" type="date" required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.deadline }" :min="new Date().toISOString().split('T')[0]">
                  <p v-if="errors.deadline" class="mt-1 text-sm text-red-500">{{ errors.deadline }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng <span
                      class="text-red-500">*</span></label>
                  <input v-model="form.quantity" type="number" required min="1"
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.quantity }">
                  <p v-if="errors.quantity" class="mt-1 text-sm text-red-500">{{ errors.quantity }}</p>
                </div>
              </div>
            </div>

            <!-- Địa điểm làm việc -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Địa điểm làm việc</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Thành phố <span
                      class="text-red-500">*</span></label>
                  <input v-model="form.city" type="text" required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.city }">
                  <p v-if="errors.city" class="mt-1 text-sm text-red-500">{{ errors.city }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện <span
                      class="text-red-500">*</span></label>
                  <input v-model="form.district" type="text" required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.district }">
                  <p v-if="errors.district" class="mt-1 text-sm text-red-500">{{ errors.district }}</p>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết <span
                      class="text-red-500">*</span></label>
                  <input v-model="form.detail_address" type="text" required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.detail_address }">
                  <p v-if="errors.detail_address" class="mt-1 text-sm text-red-500">{{ errors.detail_address }}</p>
                </div>
              </div>
            </div>

            <!-- Yêu cầu chung -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Yêu cầu chung</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kinh nghiệm <span
                      class="text-red-500">*</span></label>
                  <select v-model="form.experience" required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.experience }">
                    <option value="">Chọn kinh nghiệm</option>
                    <option value="Chưa có kinh nghiệm">Chưa có kinh nghiệm</option>
                    <option value="Dưới 1 năm">Dưới 1 năm</option>
                    <option value="1 năm">1 năm</option>
                    <option value="2 năm">2 năm</option>
                    <option value="3 năm">3 năm</option>
                    <option value="4 năm">4 năm</option>
                    <option value="5 năm">5 năm</option>
                    <option value="Trên 5 năm">Trên 5 năm</option>
                  </select>
                  <p v-if="errors.experience" class="mt-1 text-sm text-red-500">{{ errors.experience }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Cấp bậc <span
                      class="text-red-500">*</span></label>
                  <select v-model="form.level" required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.level }">
                    <option value="">Chọn cấp bậc</option>
                    <option value="Intern">Intern</option>
                    <option value="Fresher">Fresher</option>
                    <option value="Junior">Junior</option>
                    <option value="Middle">Middle</option>
                    <option value="Senior">Senior</option>
                    <option value="Leader">Leader</option>
                    <option value="Manager">Manager</option>
                    <option value="Director">Director</option>
                  </select>
                  <p v-if="errors.level" class="mt-1 text-sm text-red-500">{{ errors.level }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian làm việc <span
                      class="text-red-500">*</span></label>
                  <input v-model="form.time_working" type="text" required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.time_working }">
                  <p v-if="errors.time_working" class="mt-1 text-sm text-red-500">{{ errors.time_working }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Loại hình công việc <span
                      class="text-red-500">*</span></label>
                  <select v-model="form.type_working" required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.type_working }">
                    <option value="">Chọn loại hình công việc</option>
                    <option value="Toàn thời gian">Toàn thời gian</option>
                    <option value="Bán thời gian">Bán thời gian</option>
                    <option value="Làm việc từ xa">Làm việc từ xa</option>
                    <option value="Làm việc kết hợp">Làm việc kết hợp</option>
                    <option value="Thực tập">Thực tập</option>
                    <option value="Hợp đồng">Hợp đồng</option>
                  </select>
                  <p v-if="errors.type_working" class="mt-1 text-sm text-red-500">{{ errors.type_working }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mức lương <span
                      class="text-red-500">*</span></label>
                  <input v-model="form.salary_range" type="text" required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.salary_range }">
                  <p v-if="errors.salary_range" class="mt-1 text-sm text-red-500">{{ errors.salary_range }}</p>
                </div>
              </div>
            </div>

            <!-- Thông tin chi tiết -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Thông tin chi tiết</h2>
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả công việc <span
                      class="text-red-500">*</span></label>
                  <textarea v-model="form.description" rows="6" required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.description }"
                    placeholder="Mô tả chi tiết về công việc, trách nhiệm..."></textarea>
                  <p v-if="errors.description" class="mt-1 text-sm text-red-500">{{ errors.description }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Yêu cầu ứng viên <span
                      class="text-red-500">*</span></label>
                  <textarea v-model="form.required" rows="6" required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.required }"
                    placeholder="Các yêu cầu về kỹ năng, trình độ..."></textarea>
                  <p v-if="errors.required" class="mt-1 text-sm text-red-500">{{ errors.required }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Quyền lợi ứng viên <span
                      class="text-red-500">*</span></label>
                  <textarea v-model="form.interest" rows="6" required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.interest }"
                    placeholder="Các quyền lợi, chế độ đãi ngộ..."></textarea>
                  <p v-if="errors.interest" class="mt-1 text-sm text-red-500">{{ errors.interest }}</p>
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t">
              <button type="button" @click="router.back()"
                class="px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Hủy
              </button>
              <button type="submit" :disabled="isSubmitting"
                class="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="isSubmitting" class="flex items-center">
                  <i class="fas fa-circle-notch fa-spin mr-2"></i>
                  Đang cập nhật...
                </span>
                <span v-else>Cập nhật tin</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '../../stores/post'
import { useFieldStore } from '../../stores/field'
import { showSuccess, showError, notificationTemplates } from '../../utils/notifications'

const router = useRouter()
const postStore = usePostStore()
const fieldStore = useFieldStore()

const isSubmitting = ref(false)
const errors = ref({})
const currentField = ref(null)
const currentPosition = ref(null)
const form = ref({
  title: '',
  deadline: '',
  district: '',
  experience: '',
  interest: '',
  level: '',
  quantity: 1,
  required: '',
  salary_range: '',
  time_working: '',
  type_working: '',
  city: '',
  description: '',
  detail_address: '',
})

const postId = router.currentRoute.value.params.id

onMounted(async () => {
  try {
    // Fetch post data
    const result = await postStore.fetchPostById(postId)
    if (!result.success) {
      router.push('/employer/posts')
      return
    }
    
    // Update form with fetched data
    form.value = {
      ...form.value,
      ...result.data.data
    }

    // Load field data
    if (form.value.field) {
      const fieldResult = await fieldStore.getFieldById(form.value.field)
      console.log(fieldResult)
      if (fieldResult.success) {
        currentField.value = fieldResult.data
        console.log(currentField.value)
      }
    }

    // Load position data
    if (form.value.position) {
      const positionResult = await fieldStore.getPositionById(form.value.position)
      if (positionResult.success) {
        currentPosition.value = positionResult.data
      }
    }
  } catch (error) {
    console.error('Error loading post data:', error)
    router.push('/employer/posts')
  }
})

// Submit form
const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    errors.value = {}

    const result = await postStore.updatePost(postId, form.value)
    if (result.success) {
      showSuccess(notificationTemplates.post.updateSuccess)
      // Thêm delay 1 giây trước khi chuyển trang
      setTimeout(() => {
        router.push('/employer/posts')
      }, 1000)
    } else {
      showError(notificationTemplates.post.updateError + (result.error || notificationTemplates.common.error))
      errors.value = result.error
    }
  } catch (err) {
    showError(notificationTemplates.post.updateError + (err.response?.data?.message || notificationTemplates.common.error))
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    } else {
      console.error('Error updating post:', err)
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>