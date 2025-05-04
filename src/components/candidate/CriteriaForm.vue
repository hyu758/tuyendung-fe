<template>
  <div class="criteria-form">
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="text-gray-500 text-sm">Đang tải dữ liệu...</p>
      </div>
    </div>
    
    <form v-else @submit.prevent="submitForm" class="space-y-8 bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Thành phố -->
      <div class="form-group">
          <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
            <font-awesome-icon icon="map-marker-alt" class="text-blue-500 mr-1" /> Thành phố
          </label>
          <div class="relative">
        <select
          id="city"
          v-model="form.city"
              class="block w-full rounded-lg border-gray-300 pl-3 pr-10 py-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all bg-white shadow-sm appearance-none"
        >
          <option value="">Chọn thành phố</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <font-awesome-icon icon="chevron-down" class="text-gray-400 text-xs" />
            </div>
          </div>
      </div>

      <!-- Kinh nghiệm -->
      <div class="form-group">
          <label for="experience" class="block text-sm font-medium text-gray-700 mb-1">
            <font-awesome-icon icon="briefcase" class="text-blue-500 mr-1" /> Kinh nghiệm
          </label>
          <div class="relative">
        <select
          id="experience"
          v-model="form.experience"
              class="block w-full rounded-lg border-gray-300 pl-3 pr-10 py-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all bg-white shadow-sm appearance-none"
        >
          <option value="">Chọn kinh nghiệm</option>
          <option v-for="exp in experiences" :key="exp" :value="exp">{{ exp }}</option>
        </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <font-awesome-icon icon="chevron-down" class="text-gray-400 text-xs" />
            </div>
          </div>
      </div>

      <!-- Lĩnh vực -->
      <div class="form-group">
          <label for="field" class="block text-sm font-medium text-gray-700 mb-1">
            <font-awesome-icon icon="industry" class="text-blue-500 mr-1" /> Lĩnh vực
          </label>
          <div class="relative">
        <select
          id="field"
          v-model="form.field"
          @change="loadPositions"
              class="block w-full rounded-lg border-gray-300 pl-3 pr-10 py-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all bg-white shadow-sm appearance-none"
        >
          <option value="">Chọn lĩnh vực</option>
          <option v-for="field in fields" :key="field.id" :value="field.id">{{ field.name }}</option>
        </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <font-awesome-icon icon="chevron-down" class="text-gray-400 text-xs" />
            </div>
          </div>
      </div>

      <!-- Vị trí -->
      <div class="form-group">
          <label for="position" class="block text-sm font-medium text-gray-700 mb-1">
            <font-awesome-icon icon="user-tie" class="text-blue-500 mr-1" /> Vị trí công việc
          </label>
          <div class="relative">
        <select
          id="position"
          v-model="form.position"
              class="block w-full rounded-lg border-gray-300 pl-3 pr-10 py-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all bg-white shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
          :disabled="!form.field"
        >
          <option value="">Chọn vị trí công việc</option>
          <option v-for="position in positions" :key="position.id" :value="position.id">{{ position.name }}</option>
        </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <font-awesome-icon icon="chevron-down" class="text-gray-400 text-xs" />
            </div>
          </div>
          <p v-if="!form.field" class="text-sm text-gray-500 mt-1.5 flex items-center">
            <font-awesome-icon icon="info-circle" class="mr-1 text-blue-400" /> Vui lòng chọn lĩnh vực trước
          </p>
      </div>

      <!-- Quy mô công ty -->
      <div class="form-group">
          <label for="scales" class="block text-sm font-medium text-gray-700 mb-1">
            <font-awesome-icon icon="building" class="text-blue-500 mr-1" /> Quy mô công ty
          </label>
          <div class="relative">
        <select
          id="scales"
          v-model="form.scales"
              class="block w-full rounded-lg border-gray-300 pl-3 pr-10 py-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all bg-white shadow-sm appearance-none"
        >
          <option value="">Chọn quy mô</option>
          <option v-for="scale in scales" :key="scale" :value="scale">{{ scale }}</option>
        </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <font-awesome-icon icon="chevron-down" class="text-gray-400 text-xs" />
            </div>
          </div>
      </div>

      <!-- Hình thức làm việc -->
      <div class="form-group">
          <label for="type_working" class="block text-sm font-medium text-gray-700 mb-1">
            <font-awesome-icon icon="laptop-house" class="text-blue-500 mr-1" /> Hình thức làm việc
          </label>
          <div class="relative">
        <select
          id="type_working"
          v-model="form.type_working"
              class="block w-full rounded-lg border-gray-300 pl-3 pr-10 py-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all bg-white shadow-sm appearance-none"
        >
          <option value="">Chọn hình thức làm việc</option>
          <option v-for="type in workingTypes" :key="type" :value="type">{{ type }}</option>
        </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <font-awesome-icon icon="chevron-down" class="text-gray-400 text-xs" />
            </div>
          </div>
        </div>
      </div>

      <!-- Mức lương tối thiểu -->
      <div class="form-group mt-4">
        <label for="salary_min" class="block text-sm font-medium text-gray-700 mb-1">
          <font-awesome-icon icon="money-bill-wave" class="text-blue-500 mr-1" /> Mức lương tối thiểu (VNĐ)
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <font-awesome-icon icon="coins" class="text-gray-400" />
          </div>
        <input
          id="salary_min"
          v-model.number="form.salary_min"
          type="number"
          min="0"
          step="1000000"
            class="block w-full rounded-lg border-gray-300 pl-10 pr-4 py-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all bg-white shadow-sm"
          placeholder="Nhập mức lương tối thiểu"
        />
        </div>
        <p class="text-sm text-blue-600 font-medium mt-2 flex items-center">
          <font-awesome-icon icon="info-circle" class="mr-1" /> {{ formatSalaryDisplay(form.salary_min) }}
        </p>
      </div>

      <!-- Nút submit -->
      <div class="flex justify-end mt-8 pt-4 border-t border-gray-100">
        <button
          type="button"
          @click="resetForm"
          class="mr-3 px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
        >
          <font-awesome-icon icon="times" class="mr-1" /> Hủy
        </button>
        <button
          type="submit"
          class="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="flex items-center">
            <span class="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
            Đang xử lý...
          </span>
          <span v-else class="flex items-center">
            <font-awesome-icon :icon="isEditMode ? 'save' : 'plus-circle'" class="mr-1.5" />
            {{ isEditMode ? 'Cập nhật' : 'Tạo mới' }}
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAddressStore } from '@/stores/address'
import { useFieldStore } from '@/stores/field'
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
const fields = ref([])
const positions = ref([])

// Dữ liệu tĩnh
const experiences = [
  "Chưa có kinh nghiệm",
  "Dưới 1 năm",
  "1 năm",
  "2 năm",
  "3 năm",
  "4 năm",
  "5 năm",
  "Trên 5 năm"
]

const scales = [
  "Dưới 10 nhân viên",
  "10-50 nhân viên",
  "50-100 nhân viên", 
  "100-500 nhân viên",
  "500-1000 nhân viên",
  "Trên 1000 nhân viên"
]

const workingTypes = [
  "Toàn thời gian",
  "Bán thời gian",
  "Làm việc từ xa",
  "Làm việc kết hợp",
  "Thực tập",
  "Hợp đồng"
]

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
    const addressStore = useAddressStore();
    const provincesResult = await addressStore.fetchProvinces();
    
    if (provincesResult.success) {
      cities.value = provincesResult.data.map(province => province.name);
    } else {
      useToast().error('Không thể lấy danh sách tỉnh thành. Vui lòng thử lại sau.');
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin lựa chọn:', error);
    useToast().error('Không thể lấy thông tin lựa chọn. Vui lòng thử lại sau.');
  }
}

// Lấy danh sách lĩnh vực
const loadFields = async () => {
  try {
    const fieldStore = useFieldStore();
    const result = await fieldStore.fetchFields();
    
    if (result.success) {
      fields.value = result.data;
    } else {
      useToast().error('Không thể lấy danh sách lĩnh vực. Vui lòng thử lại sau.');
    }
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
    const fieldStore = useFieldStore();
    const result = await fieldStore.fetchPositionsByField(form.field);
    
    if (result.success) {
      positions.value = result.data.results || result.data;
    } else {
      useToast().error('Không thể lấy danh sách vị trí. Vui lòng thử lại sau.');
    }
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
  max-width: 900px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

form {
  animation: fadeIn 0.4s ease-out;
}

/* Hover effects for selects and inputs */
select:hover, input:hover {
  border-color: #93c5fd;
}

select, input {
  transition: all 0.2s ease;
}

/* Ẩn mũi tên mặc định của select */
select.appearance-none::-ms-expand {
  display: none;
}

/* Mobile styles */
@media (max-width: 640px) {
  .criteria-form {
    padding: 0 1rem;
  }
}
</style> 