<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow-xl rounded-lg overflow-hidden">
        <div class="p-8">
          <!-- Header -->
          <div class="flex items-center justify-between mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Tạo tin tuyển dụng mới</h1>
            <button
              @click="router.back()"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
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
                <div v-memo="[form.title, errors.title]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tiêu đề tin <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.title"
                    type="text"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{'border-red-500': errors.title}"
                  >
                  <p v-if="errors.title" class="mt-1 text-sm text-red-500">{{ errors.title }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Lĩnh vực <span class="text-red-500">*</span></label>
                  <select
                    v-model="form.field_id"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{'border-red-500': errors.field_id}"
                    @change="handleFieldChange"
                  >
                    <option value="">Chọn lĩnh vực</option>
                    <option v-for="field in fields" :key="field.id" :value="field.id">
                      {{ field.name }}
                    </option>
                  </select>
                  <p v-if="errors.field_id" class="mt-1 text-sm text-red-500">{{ errors.field_id }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Vị trí <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <select
                      v-model="form.position"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      :class="{'border-red-500': errors.position}"
                      :disabled="!form.field_id || fieldStore.loadingPositions"
                    >
                      <option value="">{{ fieldStore.loadingPositions ? 'Đang tải...' : 'Chọn vị trí' }}</option>
                      <option v-for="position in positions" :key="position.id" :value="position.id">
                        {{ position.name }}
                      </option>
                    </select>
                    <div v-if="fieldStore.loadingPositions" class="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <i class="fas fa-circle-notch fa-spin text-blue-500"></i>
                    </div>
                  </div>
                  <p v-if="errors.position" class="mt-1 text-sm text-red-500">{{ errors.position }}</p>
                </div>

                <div v-memo="[form.deadline, errors.deadline]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Hạn nộp hồ sơ <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.deadline"
                    type="date"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{'border-red-500': errors.deadline}"
                    :min="new Date().toISOString().split('T')[0]"
                  >
                  <p v-if="errors.deadline" class="mt-1 text-sm text-red-500">{{ errors.deadline }}</p>
                </div>

                <div v-memo="[form.quantity, errors.quantity]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.quantity"
                    type="number"
                    required
                    min="1"
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{'border-red-500': errors.quantity}"
                  >
                  <p v-if="errors.quantity" class="mt-1 text-sm text-red-500">{{ errors.quantity }}</p>
                </div>
              </div>
            </div>

            <!-- Địa điểm làm việc -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Địa điểm làm việc</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Thành phố <span class="text-red-500">*</span></label>
                  <select
                    v-model="form.city"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{'border-red-500': errors.city}"
                    @change="handleProvinceChange(form.city)"
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    <option v-for="province in addressStore.provinces" 
                            :key="province.code" 
                            :value="province.name">
                      {{ province.name }}
                    </option>
                  </select>
                  <p v-if="errors.city" class="mt-1 text-sm text-red-500">{{ errors.city }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện <span class="text-red-500">*</span></label>
                  <select
                    v-model="form.district"
                    required
                    :disabled="!form.city"
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{'border-red-500': errors.district}"
                  >
                    <option value="">{{ form.city ? 'Chọn quận/huyện' : 'Vui lòng chọn tỉnh/thành phố trước' }}</option>
                    <option v-for="district in addressStore.getDistrictsByProvince" 
                            :key="district.code" 
                            :value="district.name">
                      {{ district.name }}
                    </option>
                  </select>
                  <p v-if="errors.district" class="mt-1 text-sm text-red-500">{{ errors.district }}</p>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.detail_address"
                    type="text"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{'border-red-500': errors.detail_address}"
                  >
                  <p v-if="errors.detail_address" class="mt-1 text-sm text-red-500">{{ errors.detail_address }}</p>
                </div>
              </div>
            </div>

            <!-- Yêu cầu chung -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Yêu cầu chung</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-memo="[form.experience, errors.experience]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kinh nghiệm <span class="text-red-500">*</span></label>
                  <select
                    v-model="form.experience"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{'border-red-500': errors.experience}"
                  >
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

                <div v-memo="[form.level, errors.level]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Cấp bậc <span class="text-red-500">*</span></label>
                  <select
                    v-model="form.level"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{'border-red-500': errors.level}"
                  >
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

                <div v-memo="[form.time_working, errors.time_working]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian làm việc <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.time_working"
                    type="text"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{'border-red-500': errors.time_working}"
                  >
                  <p v-if="errors.time_working" class="mt-1 text-sm text-red-500">{{ errors.time_working }}</p>
                </div>

                <div v-memo="[form.type_working, errors.type_working]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Loại hình công việc <span class="text-red-500">*</span></label>
                  <select
                    v-model="form.type_working"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{'border-red-500': errors.type_working}"
                  >
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

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mức lương <span class="text-red-500">*</span></label>
                  <div class="space-y-3">
                    <div class="flex items-center">
                      <input
                        type="checkbox"
                        v-model="form.is_salary_negotiable"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      >
                      <label class="ml-2 block text-sm text-gray-700">
                        Thỏa thuận
                      </label>
                    </div>
                    
                    <div v-if="!form.is_salary_negotiable" class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm text-gray-600 mb-1">Tối thiểu</label>
                        <input
                          v-model.number="form.salary_min"
                          type="number"
                          min="0"
                          step="1000000"
                          :required="!form.is_salary_negotiable"
                          class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          :class="{'border-red-500': errors.salary_min}"
                          :disabled="form.is_salary_negotiable"
                        >
                        <p v-if="errors.salary_min" class="mt-1 text-sm text-red-500">{{ errors.salary_min }}</p>
                      </div>
                      
                      <div>
                        <label class="block text-sm text-gray-600 mb-1">Tối đa</label>
                        <input
                          v-model.number="form.salary_max"
                          type="number"
                          :min="form.salary_min || 0"
                          step="1000000"
                          :required="!form.is_salary_negotiable"
                          class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          :class="{'border-red-500': errors.salary_max}"
                          :disabled="form.is_salary_negotiable"
                        >
                        <p v-if="errors.salary_max" class="mt-1 text-sm text-red-500">{{ errors.salary_max }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Thông tin chi tiết -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Thông tin chi tiết</h2>
              <div class="space-y-6">
                <div v-memo="[form.description, errors.description]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả công việc <span class="text-red-500">*</span></label>
                  <textarea
                    v-model="form.description"
                    rows="6"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{'border-red-500': errors.description}"
                    placeholder="Mô tả chi tiết về công việc, trách nhiệm..."
                  ></textarea>
                  <p v-if="errors.description" class="mt-1 text-sm text-red-500">{{ errors.description }}</p>
                </div>

                <div v-memo="[form.required, errors.required]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Yêu cầu ứng viên <span class="text-red-500">*</span></label>
                  <textarea
                    v-model="form.required"
                    rows="6"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{'border-red-500': errors.required}"
                    placeholder="Các yêu cầu về kỹ năng, trình độ..."
                  ></textarea>
                  <p v-if="errors.required" class="mt-1 text-sm text-red-500">{{ errors.required }}</p>
                </div>

                <div v-memo="[form.interest, errors.interest]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Quyền lợi ứng viên <span class="text-red-500">*</span></label>
                  <textarea
                    v-model="form.interest"
                    rows="6"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{'border-red-500': errors.interest}"
                    placeholder="Các quyền lợi, chế độ đãi ngộ..."
                  ></textarea>
                  <p v-if="errors.interest" class="mt-1 text-sm text-red-500">{{ errors.interest }}</p>
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                @click="router.back()"
                class="px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Hủy tin
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isSubmitting" class="flex items-center">
                  <i class="fas fa-circle-notch fa-spin mr-2"></i>
                  Đang tạo...
                </span>
                <span v-else>Tạo yêu cầu phê duyệt</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '../../stores/post'
import { useFieldStore } from '../../stores/field'
import { useAddressStore } from '../../stores/address'
import { debounce } from 'lodash'

const router = useRouter()
const postStore = usePostStore()
const fieldStore = useFieldStore()
const addressStore = useAddressStore()
const isSubmitting = ref(false)
const errors = ref({})
const fields = ref([])
const positions = ref([])

const form = reactive({
  title: '',
  deadline: '',
  district: '',
  experience: '',
  enterprise: null,
  position: null,
  interest: '',
  level: '',
  quantity: 1,
  required: '',
  salary_min: 0,
  salary_max: 0,
  is_salary_negotiable: false,
  time_working: '',
  type_working: '',
  city: '',
  description: '',
  detail_address: '',
  field_id: null
})

onMounted(async () => {
  const [fieldsResult, provincesResult] = await Promise.all([
    fieldStore.fetchFields(),
    addressStore.fetchProvinces()
  ])
  
  if (fieldsResult.success) {
    fields.value = fieldsResult.data.results
  }
  
  if (provincesResult.success) {
    console.log('Provinces loaded:', addressStore.provinces)
  }
})

const handleFieldChange = debounce(async () => {
  try {
    form.position = ''
    positions.value = []
    
    if (form.field_id) {
      const result = await fieldStore.fetchPositionsByField(form.field_id)
      if (result.success) {
        console.log('Positions data:', result.data)
        
        positions.value = result.data.results
        
        console.log('Updated positions:', positions.value)
      } else {
        console.error('Failed to fetch positions:', result.error)
      }
    }
  } catch (err) {
    console.error('Error in handleFieldChange:', err)
  }
}, 300)

// Thêm watch để debug
watch(() => positions.value, (newVal) => {
  console.log('Positions changed:', newVal)
}, { deep: true })

watch(() => form.position, (newVal) => {
  console.log('Selected position changed:', newVal)
})

const handleProvinceChange = (name) => {
  const province = addressStore.provinces.find(p => p.name === name)
  if (province) {
    form.district = ''
    addressStore.setSelectedProvince(province.code)
  }
  
}

// Thêm watch để validate mức lương
watch(() => form.salary_min, (newVal) => {
  if (newVal > form.salary_max && form.salary_max > 0) {
    form.salary_max = newVal
  }
})

watch(() => form.is_salary_negotiable, (isNegotiable) => {
  if (isNegotiable) {
    form.salary_min = 0
    form.salary_max = 0
  }
})

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    errors.value = {}

    // Validate salary
    if (!form.is_salary_negotiable) {
      if (form.salary_min < 0) {
        errors.value.salary_min = 'Mức lương tối thiểu không được âm'
        return
      }
      if (form.salary_max < form.salary_min) {
        errors.value.salary_max = 'Mức lương tối đa phải lớn hơn hoặc bằng mức lương tối thiểu'
        return
      }
    }

    const postData = {
      ...form,
      city: form.city,
      district: form.district,
      position: form.position || null,
      quantity: parseInt(form.quantity) || 1,
      deadline: form.deadline ? new Date(form.deadline).toISOString().split('T')[0] : null,
      field: form.field_id
    }
    
    console.log(postData)
    const result = await postStore.createPost(postData)
    if (result.success) {
      router.push('/employer/posts')
    } else {
      errors.value = result.error
    }
  } catch (err) {
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    } else {
      console.error('Error creating post:', err)
    }
  } finally {
    isSubmitting.value = false
  }
}
</script> 