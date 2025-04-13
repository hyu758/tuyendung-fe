<template>
  <!-- Regular button -->
  <button
    v-if="type !== 'chat'"
    :type="type === 'button' ? 'button' : type"
    :class="[
      'rounded-md font-medium focus:outline-none transition-colors',
      sizeClasses,
      variantClasses,
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <div class="flex items-center justify-center">
      <span v-if="loading" class="mr-2">
        <svg 
          class="animate-spin h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            class="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            stroke-width="4"
          ></circle>
          <path 
            class="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </span>
      <span v-if="icon && !loading" class="mr-2">
        <font-awesome-icon :icon="icon" />
      </span>
      <slot>{{ label }}</slot>
    </div>
  </button>

  <!-- Chat Icon Button -->
  <button 
    v-else-if="type === 'chat'" 
    type="button"
    :class="`
      ${sizeClasses} 
      rounded-full flex items-center justify-center
      ${variant === 'primary' 
        ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500' 
        : variant === 'secondary' 
          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300' 
          : variant === 'success' 
            ? 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
            : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${customClass}
    `"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <i class="fas fa-comment-dots"></i>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  label: {
    type: String,
    default: ''
  },
  icon: {
    type: [String, Array],
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-3 py-1 text-sm'
    case 'lg': return 'px-6 py-3 text-lg'
    default: return 'px-4 py-2'
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary': return 'bg-blue-600 text-white hover:bg-blue-700'
    case 'secondary': return 'bg-gray-600 text-white hover:bg-gray-700'
    case 'success': return 'bg-green-600 text-white hover:bg-green-700'
    case 'danger': return 'bg-red-600 text-white hover:bg-red-700'
    case 'warning': return 'bg-yellow-500 text-white hover:bg-yellow-600'
    case 'info': return 'bg-blue-400 text-white hover:bg-blue-500'
    case 'light': return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    case 'dark': return 'bg-gray-800 text-white hover:bg-gray-900'
    case 'link': return 'bg-transparent text-blue-600 hover:text-blue-800 hover:underline p-0'
    default: return 'bg-blue-600 text-white hover:bg-blue-700'
  }
})
</script> 