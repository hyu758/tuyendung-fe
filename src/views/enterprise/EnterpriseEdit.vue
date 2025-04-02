<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <template v-else>
        <div class="bg-white shadow-xl rounded-lg overflow-hidden">
          <div class="p-8">
            <!-- Header -->
            <div class="flex items-center justify-between mb-8">
              <h1 class="text-2xl font-bold text-gray-900">Chỉnh sửa thông tin doanh nghiệp</h1>
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
              <!-- Logo và ảnh nền -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Logo công ty</label>
                  <div class="flex items-center">
                    <div class="relative w-32 h-32">
                      <img
                        v-if="logoPreview || form.logo"
                        :src="logoPreview || form.logo"
                        class="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                        alt="Logo preview"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                        <i class="fas fa-image text-3xl text-gray-400"></i>
                      </div>
                      <button
                        v-if="logoPreview || form.logo"
                        type="button"
                        class="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                        @click="removeLogo"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                    <div class="ml-5">
                      <label class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <i class="fas fa-upload mr-2"></i>
                        Tải logo lên
                        <input
                          type="file"
                          class="hidden"
                          accept="image/*"
                          @change="handleLogoUpload"
                        >
                      </label>
                      <p class="mt-2 text-xs text-gray-500">PNG, JPG, JPEG (Max. 2MB)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Ảnh nền</label>
                  <div class="flex items-center">
                    <div class="relative w-48 h-32">
                      <img
                        v-if="backgroundPreview || form.background_image"
                        :src="backgroundPreview || form.background_image"
                        class="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                        alt="Background preview"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                        <i class="fas fa-image text-3xl text-gray-400"></i>
                      </div>
                      <button
                        v-if="backgroundPreview || form.background_image"
                        type="button"
                        class="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                        @click="removeBackground"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                    <div class="ml-5">
                      <label class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <i class="fas fa-upload mr-2"></i>
                        Tải ảnh nền
                        <input
                          type="file"
                          class="hidden"
                          accept="image/*"
                          @change="handleBackgroundUpload"
                        >
                      </label>
                      <p class="mt-2 text-xs text-gray-500">PNG, JPG, JPEG (Max. 2MB)</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Thông tin cơ bản -->
              <div>
                <h2 class="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tên công ty <span class="text-red-500">*</span></label>
                    <input
                      v-model="form.company_name"
                      type="text"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      :class="{'border-red-500': errors.company_name}"
                    >
                    <p v-if="errors.company_name" class="mt-1 text-sm text-red-500">{{ errors.company_name }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Mã số thuế <span class="text-red-500">*</span></label>
                    <input
                      v-model="form.tax"
                      type="text"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      :class="{'border-red-500': errors.tax}"
                    >
                    <p v-if="errors.tax" class="mt-1 text-sm text-red-500">{{ errors.tax }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Giấy phép kinh doanh <span class="text-red-500">*</span></label>
                    <input
                      v-model="form.business_certificate"
                      type="text"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      :class="{'border-red-500': errors.business_certificate}"
                    >
                    <p v-if="errors.business_certificate" class="mt-1 text-sm text-red-500">{{ errors.business_certificate }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Lĩnh vực hoạt động <span class="text-red-500">*</span></label>
                    <select
                      v-model="form.field_of_activity"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      :class="{'border-red-500': errors.field_of_activity}"
                    >
                      <option value="">Chọn lĩnh vực</option>
                      <option value="it">Công nghệ thông tin</option>
                      <option value="finance">Tài chính - Ngân hàng</option>
                      <option value="marketing">Marketing - Truyền thông</option>
                      <option value="education">Giáo dục</option>
                      <option value="healthcare">Y tế - Chăm sóc sức khỏe</option>
                      <option value="manufacturing">Sản xuất - Công nghiệp</option>
                      <option value="retail">Bán lẻ - Thương mại</option>
                      <option value="other">Khác</option>
                    </select>
                    <p v-if="errors.field_of_activity" class="mt-1 text-sm text-red-500">{{ errors.field_of_activity }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Quy mô công ty <span class="text-red-500">*</span></label>
                    <select
                      v-model="form.scale"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                    <p v-if="errors.scale" class="mt-1 text-sm text-red-500">{{ errors.scale }}</p>
                  </div>
                </div>
              </div>

              <!-- Thông tin liên hệ -->
              <div>
                <h2 class="text-lg font-medium text-gray-900 mb-4">Thông tin liên hệ</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email công ty <span class="text-red-500">*</span></label>
                    <input
                      v-model="form.email_company"
                      type="email"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      :class="{'border-red-500': errors.email_company}"
                    >
                    <p v-if="errors.email_company" class="mt-1 text-sm text-red-500">{{ errors.email_company }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span class="text-red-500">*</span></label>
                    <input
                      v-model="form.phone_number"
                      type="tel"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      :class="{'border-red-500': errors.phone_number}"
                    >
                    <p v-if="errors.phone_number" class="mt-1 text-sm text-red-500">{{ errors.phone_number }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      v-model="form.link_web_site"
                      type="url"
                      placeholder="https://"
                      class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      :class="{'border-red-500': errors.link_web_site}"
                      @blur="validateUrl"
                    >
                    <p v-if="errors.link_web_site" class="mt-1 text-sm text-red-500">{{ errors.link_web_site }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Thành phố <span class="text-red-500">*</span></label>
                    <input
                      v-model="form.city"
                      type="text"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      :class="{'border-red-500': errors.city}"
                    >
                    <p v-if="errors.city" class="mt-1 text-sm text-red-500">{{ errors.city }}</p>
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ <span class="text-red-500">*</span></label>
                    <input
                      v-model="form.address"
                      type="text"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      :class="{'border-red-500': errors.address}"
                    >
                    <p v-if="errors.address" class="mt-1 text-sm text-red-500">{{ errors.address }}</p>
                  </div>
                </div>
              </div>

              <!-- Mô tả -->
              <div>
                <h2 class="text-lg font-medium text-gray-900 mb-4">Giới thiệu công ty</h2>
                <div>
                  <textarea
                    v-model="form.description"
                    rows="4"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    :class="{'border-red-500': errors.description}"
                    placeholder="Mô tả về công ty, sản phẩm, dịch vụ và văn hóa doanh nghiệp..."
                  ></textarea>
                  <p v-if="errors.description" class="mt-1 text-sm text-red-500">{{ errors.description }}</p>
                </div>
              </div>

              <!-- Buttons -->
              <div class="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  @click="router.back()"
                  class="px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="isSubmitting" class="flex items-center">
                    <i class="fas fa-circle-notch fa-spin mr-2"></i>
                    Đang lưu...
                  </span>
                  <span v-else>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEnterpriseStore } from '../../stores/enterprise'

const router = useRouter()
const enterpriseStore = useEnterpriseStore()
const loading = ref(true)
const isSubmitting = ref(false)
const logoPreview = ref(null)
const backgroundPreview = ref(null)
const errors = ref({})

const form = reactive({
  company_name: '',
  tax: '',
  address: '',
  phone_number: '',
  email_company: '',
  business_certificate: '',
  field_of_activity: '',
  scale: '',
  description: '',
  city: '',
  link_web_site: '',
  logo: null,
  background_image: null
})

// Xử lý upload logo
const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      errors.value.logo = 'Kích thước file không được vượt quá 2MB'
      return
    }
    if (!file.type.match('image.*')) {
      errors.value.logo = 'Vui lòng chọn file hình ảnh'
      return
    }
    form.logo = file
    logoPreview.value = URL.createObjectURL(file)
    errors.value.logo = ''
  }
}

// Xử lý upload ảnh nền
const handleBackgroundUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      errors.value.background_image = 'Kích thước file không được vượt quá 2MB'
      return
    }
    if (!file.type.match('image.*')) {
      errors.value.background_image = 'Vui lòng chọn file hình ảnh'
      return
    }
    form.background_image = file
    backgroundPreview.value = URL.createObjectURL(file)
    errors.value.background_image = ''
  }
}

// Xóa logo
const removeLogo = () => {
  form.logo = null
  logoPreview.value = null
}

// Xóa ảnh nền
const removeBackground = () => {
  form.background_image = null
  backgroundPreview.value = null
}

// Validate URL
const validateUrl = () => {
  if (!form.link_web_site) return
  try {
    new URL(form.link_web_site)
    errors.value.link_web_site = ''
  } catch (_) {
    errors.value.link_web_site = 'URL không hợp lệ. Vui lòng nhập đúng định dạng (ví dụ: https://example.com)'
  }
}

// Submit form
const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    errors.value = {}

    // Validate URL nếu có
    if (form.link_web_site) {
      validateUrl()
      if (errors.value.link_web_site) return
    }

    const result = await enterpriseStore.updateEnterprise(form)
    if (result.success) {
      router.push('/employer/company')
    }
  } catch (err) {
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    } else {
      console.error('Error updating enterprise:', err)
    }
  } finally {
    isSubmitting.value = false
  }
}

// Load dữ liệu khi mount component
onMounted(async () => {
  try {
    const result = await enterpriseStore.fetchUserEnterprise()
    if (result.success) {
      const enterprise = result.data[0]
      Object.keys(form).forEach(key => {
        if (enterprise[key] !== undefined) {
          form[key] = enterprise[key]
        }
      })
    }
  } catch (err) {
    console.error('Error loading enterprise:', err)
  } finally {
    loading.value = false
  }
})
</script> 