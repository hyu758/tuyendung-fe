<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative rounded-md shadow-sm">
      <div 
        v-if="prefixIcon" 
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"
      >
        <font-awesome-icon :icon="prefixIcon" class="text-lg" />
      </div>
      
      <input
        :id="id"
        :name="name"
        :type="showPassword ? 'text' : type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :class="[
          'w-full py-3 px-4 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base',
          { 'pl-10': prefixIcon },
          { 'pr-10': type === 'password' || suffixIcon },
          { 'opacity-60 cursor-not-allowed': disabled },
          { 'bg-gray-100': readonly }
        ]"
        :min="min"
        :max="max"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        @input="handleInput"
        @blur="handleBlur"
        @focus="$emit('focus', $event)"
      />
      
      <!-- Biểu tượng mắt cho trường mật khẩu -->
      <div v-if="type === 'password'" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <button 
          type="button" 
          @click.prevent.stop="togglePasswordVisibility"
          @mousedown.prevent
          class="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
        >
          <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" class="text-lg" />
        </button>
      </div>
      
      <!-- Biểu tượng suffix khác -->
      <div 
        v-else-if="suffixIcon" 
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500"
      >
        <font-awesome-icon :icon="suffixIcon" class="text-lg" />
      </div>
    </div>
    
    <div v-if="error" class="mt-1.5 text-sm text-red-600">
      {{ error }}
    </div>
    
    <div v-if="helpText" class="mt-1.5 text-sm text-gray-500">
      {{ helpText }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`
  },
  name: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  prefixIcon: {
    type: [String, Array],
    default: null
  },
  suffixIcon: {
    type: [String, Array],
    default: null
  },
  error: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  },
  min: {
    type: [String, Number],
    default: undefined
  },
  max: {
    type: [String, Number],
    default: undefined
  },
  maxlength: {
    type: [String, Number],
    default: undefined
  },
  autocomplete: {
    type: String,
    default: 'off'
  },
  autoTrim: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Xử lý input với tùy chọn tự động trim
const handleInput = (event) => {
  let value = event.target.value
  emit('update:modelValue', value)
}

// Tự động trim khi blur khỏi input
const handleBlur = (event) => {
  if (props.autoTrim && typeof props.modelValue === 'string') {
    const trimmedValue = props.modelValue.trim()
    
    // Kiểm tra nếu người dùng nhập toàn khoảng trắng
    if (props.modelValue !== '' && trimmedValue === '') {
      // Nếu trường bắt buộc hoặc type là password, không cho phép toàn khoảng trắng
      if (props.required || props.type === 'password' || props.type === 'email' || props.type === 'username') {
        emit('update:modelValue', '')
      } else {
        emit('update:modelValue', trimmedValue)
      }
    } else if (trimmedValue !== props.modelValue) {
      emit('update:modelValue', trimmedValue)
    }
  }
  emit('blur', event)
}
</script> 