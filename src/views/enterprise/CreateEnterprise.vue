<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-8">Tạo thông tin doanh nghiệp</h1>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Tên công ty -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Tên công ty <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.company_name"
          type="text"
          required
          class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Địa chỉ -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Địa chỉ <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.address"
          type="text"
          required
          class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Mã số thuế -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Mã số thuế <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.tax"
          type="text"
          required
          class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Giấy phép kinh doanh -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Giấy phép kinh doanh <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.business_certificate"
          type="text"
          required
          class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Email công ty -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Email công ty <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.email_company"
          type="email"
          required
          class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Số điện thoại -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Số điện thoại <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.phone_number"
          type="tel"
          required
          class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Website -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Website
        </label>
        <input
          v-model="form.link_web_site"
          type="url"
          class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Lĩnh vực hoạt động -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Lĩnh vực hoạt động <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.field_of_activity"
          type="text"
          required
          class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Quy mô nhân sự -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Quy mô nhân sự <span class="text-red-500">*</span>
        </label>
        <select
          v-model="form.scale"
          required
          class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Chọn quy mô</option>
          <option value="Dưới 10 người">Dưới 10 người</option>
          <option value="10-24 người">10-24 người</option>
          <option value="25-99 người">25-99 người</option>
          <option value="100-499 người">100-499 người</option>
          <option value="500-1000 người">500-1000 người</option>
          <option value="Trên 1000 người">Trên 1000 người</option>
        </select>
      </div>

      <!-- Thành phố -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Thành phố <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.city"
          type="text"
          required
          class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Mô tả công ty -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Mô tả công ty <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.description"
          required
          rows="4"
          class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <!-- Submit button -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="loading"
        >
          <span v-if="loading">Đang xử lý...</span>
          <span v-else>Hoàn tất</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useEnterpriseStore } from '../../stores/enterprise'

const router = useRouter()
const authStore = useAuthStore()
const enterpriseStore = useEnterpriseStore()

const loading = ref(false)
const form = ref({
  company_name: '',
  address: '',
  business_certificate: '',
  description: '',
  email_company: '',
  field_of_activity: '',
  link_web_site: '',
  phone_number: '',
  scale: '',
  tax: '',
  city: ''
})

const handleSubmit = async () => {
  try {
    loading.value = true
    await enterpriseStore.createEnterprise(form.value)
    router.push('/employer')
  } catch (error) {
    console.error('Lỗi khi tạo doanh nghiệp:', error)
  } finally {
    loading.value = false
  }
}
</script> 