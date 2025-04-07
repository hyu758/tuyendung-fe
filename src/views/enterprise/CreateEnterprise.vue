<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Tạo thông tin doanh nghiệp
        </h1>
        <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Điền đầy đủ thông tin doanh nghiệp của bạn để bắt đầu đăng tin tuyển dụng
        </p>
      </div>

      <div class="bg-white shadow-xl rounded-lg overflow-hidden">
        <div class="p-8">
          <BaseAlert
            v-if="error"
            variant="error"
            :message="error"
            :show="!!error"
            class="mb-8"
          />
          
          <form @submit.prevent="handleSubmit" class="space-y-8">
            <!-- Thông tin cơ bản -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-6">Thông tin cơ bản</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <BaseInput
                  v-model="form.company_name"
                  label="Tên công ty"
                  placeholder="VD: Công ty TNHH ABC"
                  required
                  prefix-icon="building"
                  :error="errors.company_name"
                  class="shadow-sm"
                />
                
                <BaseInput
                  v-model="form.tax"
                  label="Mã số thuế"
                  placeholder="VD: 0123456789"
                  required
                  prefix-icon="file-invoice"
                  :error="errors.tax"
                  class="shadow-sm"
                />
              </div>
            </div>

            <!-- Thông tin liên hệ -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-6">Thông tin liên hệ</h2>
              <div class="space-y-8">
                <BaseInput
                  v-model="form.address"
                  label="Địa chỉ"
                  placeholder="VD: Số 123, Đường ABC, Quận XYZ"
                  required
                  prefix-icon="map-marker-alt"
                  :error="errors.address"
                  class="shadow-sm"
                />

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <BaseInput
                    v-model="form.phone_number"
                    label="Số điện thoại"
                    placeholder="VD: 0912345678"
                    required
                    prefix-icon="phone"
                    :error="errors.phone_number"
                    class="shadow-sm"
                  />
                  
                  <BaseInput
                    v-model="form.email_company"
                    label="Email công ty"
                    placeholder="VD: contact@company.com"
                    required
                    prefix-icon="envelope"
                    :error="errors.email_company"
                    class="shadow-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Thông tin bổ sung -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-6">Thông tin bổ sung</h2>
              <div class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Lĩnh vực hoạt động</label>
                    <select
                      v-model="form.field_of_activity"
                      class="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                      :class="{'border-red-500': errors.field_of_activity}"
                    >
                      <option value="">Chọn lĩnh vực</option>
                      <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                      <option value="Tài chính - Ngân hàng">Tài chính - Ngân hàng</option>
                      <option value="Marketing - Truyền thông">Marketing - Truyền thông</option>
                      <option value="Giáo dục">Giáo dục</option>
                      <option value="Y tế - Chăm sóc sức khỏe">Y tế - Chăm sóc sức khỏe</option>
                      <option value="Sản xuất - Công nghiệp">Sản xuất - Công nghiệp</option>
                      <option value="Bán lẻ - Thương mại">Bán lẻ - Thương mại</option>
                      <option value="Khác">Khác</option>
                    </select>
                    <div v-if="errors.field_of_activity" class="mt-2 text-sm text-red-600">
                      {{ errors.field_of_activity }}
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Quy mô công ty</label>
                    <select
                      v-model="form.scale"
                      class="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                      :class="{'border-red-500': errors.scale}"
                    >
                      <option value="">Chọn quy mô</option>
                      <option value="1-10">1-10 nhân viên</option>
                      <option value="11-50">11-50 nhân viên</option>
                      <option value="51-200">51-200 nhân viên</option>
                      <option value="201-500">201-500 nhân viên</option>
                      <option value="501-1000">501-1000 nhân viên</option>
                      <option value="1000+">1000+ nhân viên</option>
                    </select>
                    <div v-if="errors.scale" class="mt-2 text-sm text-red-600">
                      {{ errors.scale }}
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Thành phố</label>
                    <select
                      v-model="form.city"
                      class="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                      :class="{'border-red-500': errors.city}"
                    >
                      <option value="">Chọn thành phố</option>
                      <option v-for="city in cities" :key="city.code" :value="city.name">
                        {{ city.name }}
                      </option>
                    </select>
                    <div v-if="errors.city" class="mt-2 text-sm text-red-600">
                      {{ errors.city }}
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả công ty</label>
                  <textarea
                    v-model="form.description"
                    rows="4"
                    class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    :class="{'border-red-500': errors.description}"
                    placeholder="Mô tả ngắn gọn về lĩnh vực, sản phẩm, dịch vụ và văn hóa công ty của bạn..."
                  ></textarea>
                  <div v-if="errors.description" class="mt-2 text-sm text-red-600">
                    {{ errors.description }}
                  </div>
                </div>

                <div class="space-y-4">
                  <label class="block text-sm font-medium text-gray-700">Logo công ty</label>
                  <div class="mt-1 flex items-center">
                    <span class="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                      <img 
                        v-if="form.logo" 
                        :src="previewImage(form.logo)" 
                        class="h-full w-full object-cover"
                        alt="Logo preview"
                      />
                      <svg v-else class="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      @change="e => handleFileUpload(e, 'logo')"
                      class="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    />
                  </div>
                  <div v-if="errors.logo" class="mt-2 text-sm text-red-600">
                    {{ errors.logo }}
                  </div>
                </div>

                <div class="space-y-4">
                  <label class="block text-sm font-medium text-gray-700">Ảnh nền doanh nghiệp</label>
                  <div class="mt-1 flex flex-col space-y-2">
                    <div class="w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        v-if="form.background_image" 
                        :src="previewImage(form.background_image)" 
                        class="w-full h-full object-cover"
                        alt="Background preview"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <svg class="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      @change="e => handleFileUpload(e, 'background_image')"
                      class="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    />
                  </div>
                  <div v-if="errors.background_image" class="mt-2 text-sm text-red-600">
                    {{ errors.background_image }}
                  </div>
                </div>

                <div class="space-y-4">
                  <label class="block text-sm font-medium text-gray-700">Giấy phép kinh doanh (Ảnh)</label>
                  <div class="mt-1 flex flex-col space-y-2">
                    <div class="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        v-if="form.business_certificate" 
                        :src="previewImage(form.business_certificate)"
                        class="w-full h-full object-contain"
                        alt="Business certificate preview"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <svg class="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      @change="e => handleFileUpload(e, 'business_certificate')"
                      class="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    />
                  </div>
                  <div v-if="errors.business_certificate" class="mt-2 text-sm text-red-600">
                    {{ errors.business_certificate }}
                  </div>
                </div>

                <BaseInput
                  v-model="form.link_web_site"
                  label="Website công ty"
                  placeholder="VD: https://company.com"
                  prefix-icon="globe"
                  :error="errors.link_web_site"
                  class="shadow-sm"
                  @blur="validateUrl(form.link_web_site)"
                />
              </div>
            </div>

            <div class="pt-6 border-t border-gray-200">
              <div class="flex justify-end">
                <BaseButton
                  type="submit"
                  variant="primary"
                  label="Tạo thông tin doanh nghiệp"
                  :loading="loading"
                  :disabled="loading"
                  class="w-full md:w-auto px-8 py-3 text-base font-medium"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { useEnterpriseStore } from '../../stores/enterprise'
import BaseInput from '../../components/common/BaseInput.vue'
import BaseButton from '../../components/common/BaseButton.vue'
import BaseAlert from '../../components/common/BaseAlert.vue'

const router = useRouter()
const enterpriseStore = useEnterpriseStore()

const loading = ref(false)
const error = ref('')
const errors = ref({})

const form = reactive({
  company_name: '',
  tax: '',
  address: '',
  phone_number: '',
  email_company: '',
  business_certificate: null,
  field_of_activity: '',
  scale: '',
  description: '',
  city: '',
  link_web_site: '',
  logo: null,
  background_image: null
})

const cities = ref([])

// Hàm lấy danh sách tỉnh thành
const fetchCities = async () => {
  try {
    const response = await fetch('https://provinces.open-api.vn/api/?depth=1')
    const data = await response.json()
    cities.value = data
  } catch (err) {
    console.error('Lỗi khi lấy danh sách tỉnh thành:', err)
  }
}

onMounted(() => {
  fetchCities()
})

const handleSubmit = async () => {
  // Reset errors
  error.value = ''
  errors.value = {}
  
  // Validate form
  if (!form.company_name) errors.value.company_name = 'Vui lòng nhập tên công ty'
  if (!form.tax) errors.value.tax = 'Vui lòng nhập mã số thuế'
  if (!form.address) errors.value.address = 'Vui lòng nhập địa chỉ'
  if (!form.phone_number) errors.value.phone_number = 'Vui lòng nhập số điện thoại'
  if (!form.email_company) errors.value.email_company = 'Vui lòng nhập email'
  if (!form.business_certificate) errors.value.business_certificate = 'Vui lòng tải lên ảnh giấy phép kinh doanh'
  if (!form.field_of_activity) errors.value.field_of_activity = 'Vui lòng chọn lĩnh vực hoạt động'
  if (!form.scale) errors.value.scale = 'Vui lòng chọn quy mô công ty'
  if (!form.description) errors.value.description = 'Vui lòng nhập mô tả công ty'
  if (!form.city) errors.value.city = 'Vui lòng nhập thành phố'
  if (!form.logo) errors.value.logo = 'Vui lòng tải lên logo công ty'
  if (!form.background_image) errors.value.background_image = 'Vui lòng tải lên ảnh nền doanh nghiệp'

  if (Object.keys(errors.value).length > 0) return

  try {
    loading.value = true
    const result = await enterpriseStore.createEnterprise(form)
    
    if (result.success) {
      router.push('/employer')
    } else {
      error.value = 'Có lỗi xảy ra khi tạo thông tin doanh nghiệp'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Có lỗi xảy ra khi tạo thông tin doanh nghiệp'
  } finally {
    loading.value = false
  }
}

const handleFileUpload = (event, type) => {
  const file = event.target.files[0]
  if (file) {
    // Kiểm tra kích thước file (giới hạn 5MB)
    if (file.size > 5 * 1024 * 1024) {
      errors.value[type] = 'Kích thước file không được vượt quá 5MB'
      return
    }
    // Kiểm tra loại file
    if (!file.type.match('image.*')) {
      errors.value[type] = 'Vui lòng chọn file hình ảnh'
      return
    }
    form[type] = file
    errors.value[type] = ''
  }
}

const validateUrl = (url) => {
  if (!url) return true
  try {
    new URL(url)
    errors.value.link_web_site = ''
    return true
  } catch (_) {
    errors.value.link_web_site = 'URL không hợp lệ. Vui lòng nhập đúng định dạng (ví dụ: https://example.com)'
    return false
  }
}

const previewImage = (image) => {
  if (!image) return ''
  return image instanceof File ? URL.createObjectURL(image) : image
}
</script> 