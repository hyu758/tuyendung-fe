<template>
  <div class="space-y-2">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    
    <div class="relative">
      <!-- Preview -->
      <div class="mb-4">
        <div 
          class="rounded-lg overflow-hidden bg-gray-50 border border-gray-200 shadow-sm transition-all duration-200"
          :class="[
            previewContainerClass,
            error ? 'border-red-300' : 'hover:border-blue-300',
            dragActive ? 'border-blue-500 bg-blue-50 shadow-md' : ''
          ]"
          @dragenter.prevent="dragActive = true"
          @dragleave.prevent="dragActive = false"
          @dragover.prevent
          @drop.prevent="onDrop"
        >
          <!-- Với file hình ảnh -->
          <template v-if="modelValue && isImage">
            <div class="relative">
              <img 
                :src="previewSrc" 
                :class="[
                  'h-full w-full object-center transition duration-200',
                  previewType === 'cover' ? 'object-cover' : 'object-contain'
                ]"
                :alt="alt || label"
              />
              <!-- Nút chỉnh sửa và xóa luôn hiển thị -->
              <div class="absolute top-2 right-2 flex space-x-2 z-10">
                <button 
                  type="button" 
                  @click.stop="triggerFileInput"
                  class="bg-white text-blue-600 p-2 rounded-full shadow-lg border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  title="Thay đổi ảnh"
                >
                  <i class="fas fa-edit text-sm"></i>
                </button>
                <button 
                  type="button" 
                  @click.stop="clearFile"
                  class="bg-white text-red-600 p-2 rounded-full shadow-lg border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                  title="Xóa ảnh"
                >
                  <i class="fas fa-trash text-sm"></i>
                </button>
              </div>
            </div>
          </template>
          
          <!-- Với file khác hoặc khi chưa có file -->
          <template v-else>
            <div class="p-4 flex flex-col items-center justify-center text-center">
              <div class="mb-3">
                <div v-if="modelValue" class="bg-blue-100 text-blue-600 rounded-full p-3 mx-auto">
                  <i class="fas fa-file-alt text-xl"></i>
                </div>
                <div v-else class="bg-gray-100 text-gray-400 rounded-full p-3 mx-auto">
                  <i :class="['text-xl', icon]"></i>
                </div>
              </div>
              
              <div v-if="modelValue && !isImage" class="text-sm text-gray-800 font-medium mb-1 truncate max-w-full">
                {{ fileName }}
              </div>
              
              <div class="text-sm text-gray-500 mb-2">
                <template v-if="modelValue">
                  <span>{{ formattedSize }} - </span>
                  <span class="text-blue-500 cursor-pointer hover:text-blue-700" @click.stop="triggerFileInput">
                    Thay đổi
                  </span>
                </template>
                <template v-else>
                  {{ placeholder || 'Kéo thả file hoặc nhấp để chọn' }}
                </template>
              </div>
              
              <button 
                v-if="!modelValue"
                type="button"
                @click.stop="triggerFileInput"
                class="mt-1 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Chọn file
              </button>
            </div>
          </template>
        </div>
      </div>
      
      <!-- File input ẩn -->
      <input
        :id="inputId"
        ref="fileInput"
        type="file"
        :accept="accept"
        class="hidden"
        @change="onFileChange"
      />
    </div>
    
    <!-- Thông báo lỗi -->
    <div v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </div>
    
    <!-- Hỗ trợ -->
    <div v-if="helpText" class="mt-1 text-sm text-gray-500">
      {{ helpText }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [File, String, null],
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  error: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  },
  previewType: {
    type: String,
    default: 'cover',
    validator: (value) => ['cover', 'contain'].includes(value)
  },
  previewContainerClass: {
    type: String,
    default: 'h-48 w-full'
  },
  icon: {
    type: String,
    default: 'fas fa-cloud-upload-alt'
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB
  },
  alt: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'error'])

const fileInput = ref(null)
const dragActive = ref(false)
const inputId = computed(() => props.name || `file-upload-${Date.now()}`)

const previewSrc = computed(() => {
  if (!props.modelValue) return ''
  return props.modelValue instanceof File 
    ? URL.createObjectURL(props.modelValue) 
    : props.modelValue
})

const fileName = computed(() => {
  if (!props.modelValue) return ''
  return props.modelValue instanceof File 
    ? props.modelValue.name 
    : 'File đã tải lên'
})

const formattedSize = computed(() => {
  if (!props.modelValue || !(props.modelValue instanceof File)) return ''
  
  const size = props.modelValue.size
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
})

const isImage = computed(() => {
  if (!props.modelValue) return false
  if (props.modelValue instanceof File) {
    return props.modelValue.type.startsWith('image/')
  }
  // Nếu là string URL, kiểm tra đuôi file hoặc có chứa từ khóa image
  if (typeof props.modelValue === 'string') {
    const url = props.modelValue.toLowerCase()
    const fileExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
    const result = fileExtensions.some(ext => url.includes(ext)) || url.includes('image')
    return result
  }
  return false
})

const validateFile = (file) => {
  if (!file) return null
  
  // Kiểm tra kích thước
  if (file.size > props.maxSize) {
    return `Kích thước file không được vượt quá ${props.maxSize / (1024 * 1024)}MB`
  }
  
  // Kiểm tra định dạng nếu có accept
  if (props.accept && props.accept !== '*') {
    const acceptedTypes = props.accept.split(',').map(type => type.trim())
    const fileType = file.type
    
    // Hỗ trợ wildcard như image/* 
    const isAccepted = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0]
        return fileType.startsWith(`${category}/`)
      }
      return type === fileType
    })
    
    if (!isAccepted) {
      return 'Định dạng file không được chấp nhận'
    }
  }
  
  return null
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const error = validateFile(file)
  if (error) {
    emit('error', error)
    return
  }
  
  emit('update:modelValue', file)
  emit('error', '')
}

const onDrop = (event) => {
  dragActive.value = false
  const file = event.dataTransfer.files[0]
  if (!file) return
  
  const error = validateFile(file)
  if (error) {
    emit('error', error)
    return
  }
  
  emit('update:modelValue', file)
  emit('error', '')
}

const clearFile = () => {
  emit('update:modelValue', null)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
/* Thêm animation cho khu vực kéo thả */
.drag-active {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
  }
  70% {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}
</style> 