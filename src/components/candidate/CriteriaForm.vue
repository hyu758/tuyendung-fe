<template>
  <div class="criteria-form">
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
    
    <form v-else @submit.prevent="submitForm" class="space-y-6">
      <!-- Thành phố -->
      <div class="form-group">
        <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Thành phố</label>
        <select
          id="city"
          v-model="form.city"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Chọn thành phố</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </div>

      <!-- Kinh nghiệm -->
      <div class="form-group">
        <label for="experience" class="block text-sm font-medium text-gray-700 mb-1">Kinh nghiệm</label>
        <select
          id="experience"
          v-model="form.experience"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Chọn kinh nghiệm</option>
          <option v-for="exp in experiences" :key="exp" :value="exp">{{ exp }}</option>
        </select>
      </div>

      <!-- Lĩnh vực -->
      <div class="form-group">
        <label for="field" class="block text-sm font-medium text-gray-700 mb-1">Lĩnh vực</label>
        <select
          id="field"
          v-model="form.field"
          @change="loadPositions"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Chọn lĩnh vực</option>
          <option v-for="field in fields" :key="field.id" :value="field.id">{{ field.name }}</option>
        </select>
      </div>

      <!-- Vị trí -->
      <div class="form-group">
        <label for="position" class="block text-sm font-medium text-gray-700 mb-1">Vị trí công việc</label>
        <select
          id="position"
          v-model="form.position"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          :disabled="!form.field"
        >
          <option value="">Chọn vị trí công việc</option>
          <option v-for="position in positions" :key="position.id" :value="position.id">{{ position.name }}</option>
        </select>
        <p v-if="!form.field" class="text-sm text-gray-500 mt-1">Vui lòng chọn lĩnh vực trước</p>
      </div>

      <!-- Quy mô công ty -->
      <div class="form-group">
        <label for="scales" class="block text-sm font-medium text-gray-700 mb-1">Quy mô công ty</label>
        <select
          id="scales"
          v-model="form.scales"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Chọn quy mô</option>
          <option v-for="scale in scales" :key="scale" :value="scale">{{ scale }}</option>
        </select>
      </div>

      <!-- Hình thức làm việc -->
      <div class="form-group">
        <label for="type_working" class="block text-sm font-medium text-gray-700 mb-1">Hình thức làm việc</label>
        <select
          id="type_working"
          v-model="form.type_working"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Chọn hình thức làm việc</option>
          <option v-for="type in workingTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>

      <!-- Mức lương tối thiểu -->
      <div class="form-group">
        <label for="salary_min" class="block text-sm font-medium text-gray-700 mb-1">Mức lương tối thiểu (VNĐ)</label>
        <input
          id="salary_min"
          v-model.number="form.salary_min"
          type="number"
          min="0"
          step="1000000"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Nhập mức lương tối thiểu"
        />
        <p class="text-sm text-gray-500 mt-1">{{ formatSalaryDisplay(form.salary_min) }}</p>
      </div>

      <!-- Nút submit -->
      <div class="flex justify-end">
        <button
          type="button"
          @click="resetForm"
          class="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Hủy
        </button>
        <button
          type="submit"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="flex items-center">
            <span class="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
            Đang xử lý...
          </span>
          <span v-else>{{ isEditMode ? 'Cập nhật' : 'Tạo mới' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const props = defineProps({
  existingCriteria: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['created', 'updated', 'reset'])

// State
const loading = ref(true)
const isSubmitting = ref(false)
const cities = ref([])
const experiences = ref([])
const fields = ref([])
const positions = ref([])
const scales = ref([])
const workingTypes = ref([])

// Form data
const form = reactive({
  city: '',
  experience: '',
  field: '',
  position: '',
  scales: '',
  type_working: '',
  salary_min: 0
})

// Biến để phân biệt chế độ tạo mới và cập nhật
const isEditMode = computed(() => !!props.existingCriteria)

// Định dạng hiển thị lương
const formatSalaryDisplay = (salary) => {
  if (!salary) return 'Chưa đặt mức lương tối thiểu';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(salary);
}

// Lấy thông tin các lựa chọn từ API
const loadFilterOptions = async () => {
  try {
    const response = await axios.get('/api/filter-options/');
    const { data } = response.data;
    
    cities.value = data.cities || [];
    experiences.value = data.experiences || [];
    scales.value = data.enterprise_scales || [];
    workingTypes.value = data.type_workings || [];
  } catch (error) {
    console.error('Lỗi khi lấy thông tin lựa chọn:', error);
    useToast().error('Không thể lấy thông tin lựa chọn. Vui lòng thử lại sau.');
  }
}

// Lấy danh sách lĩnh vực
const loadFields = async () => {
  try {
    const response = await axios.get('/api/fields/');
    fields.value = response.data.data?.results || [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lĩnh vực:', error);
    useToast().error('Không thể lấy danh sách lĩnh vực. Vui lòng thử lại sau.');
  }
}

// Lấy danh sách vị trí dựa trên lĩnh vực
const loadPositions = async () => {
  if (!form.field) {
    positions.value = [];
    form.position = '';
    return;
  }
  
  try {
    const response = await axios.get(`/api/positions/field/${form.field}/`);
    positions.value = response.data.data?.results || [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách vị trí:', error);
    useToast().error('Không thể lấy danh sách vị trí. Vui lòng thử lại sau.');
  }
}

// Lấy thông tin tiêu chí hiện tại (nếu là chế độ cập nhật)
const loadExistingCriteria = () => {
  if (props.existingCriteria) {
    form.city = props.existingCriteria.city || '';
    form.experience = props.existingCriteria.experience || '';
    form.field = props.existingCriteria.field?.id || '';
    form.scales = props.existingCriteria.scales || '';
    form.type_working = props.existingCriteria.type_working || '';
    form.salary_min = props.existingCriteria.salary_min || 0;
    
    // Nếu có field, load positions và sau đó set giá trị cho position
    if (form.field) {
      loadPositions().then(() => {
        form.position = props.existingCriteria.position?.id || '';
      });
    }
  }
}

// Gửi form
const submitForm = async () => {
  isSubmitting.value = true;
  
  try {
    const formData = { ...form };
    
    // Call API to create or update
    if (isEditMode.value) {
      // Update existing criteria
      const response = await axios.put('/api/criteria/update/', formData);
      useToast().success('Cập nhật tiêu chí tìm việc thành công');
      emit('updated', response.data.data);
    } else {
      // Create new criteria
      const response = await axios.post('/api/criteria/create/', formData);
      useToast().success('Tạo tiêu chí tìm việc thành công');
      emit('created', response.data.data);
    }
    
    // Reset form after successful submit
    resetForm();
  } catch (error) {
    console.error('Lỗi khi gửi form:', error);
    if (error.response?.data?.errors) {
      // Show validation errors
      const errors = Object.entries(error.response.data.errors)
        .map(([key, value]) => `${key}: ${value.join(', ')}`)
        .join('\n');
      useToast().error(`Lỗi: ${errors}`);
    } else {
      useToast().error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  } finally {
    isSubmitting.value = false;
  }
}

// Reset form
const resetForm = () => {
  form.city = '';
  form.experience = '';
  form.field = '';
  form.position = '';
  form.scales = '';
  form.type_working = '';
  form.salary_min = 0;
  
  emit('reset');
}

// Lifecycle
onMounted(async () => {
  try {
    // Load all necessary data
    await Promise.all([
      loadFilterOptions(),
      loadFields()
    ]);
    
    // If in edit mode, load existing data
    loadExistingCriteria();
  } catch (error) {
    console.error('Lỗi khi khởi tạo form:', error);
    useToast().error('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
  } finally {
    loading.value = false;
  }
})
</script>

<style scoped>
.criteria-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}
</style> 