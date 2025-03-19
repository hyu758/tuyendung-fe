<template>
  <div 
    v-if="show"
    :class="[
      'p-4 mb-4 rounded-md flex items-start',
      variantClasses
    ]"
    role="alert"
  >
    <div v-if="icon" class="mr-3 flex-shrink-0">
      <font-awesome-icon :icon="iconName" />
    </div>
    
    <div class="flex-1">
      <h3 v-if="title" class="text-sm font-medium" :class="titleClasses">
        {{ title }}
      </h3>
      <div class="text-sm" :class="{ 'mt-2': title }">
        <slot>{{ message }}</slot>
      </div>
    </div>
    
    <div v-if="dismissible" class="ml-3 flex-shrink-0">
      <button 
        type="button" 
        class="inline-flex rounded-md focus:outline-none"
        :class="closeButtonClasses"
        @click="dismiss"
      >
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  icon: {
    type: Boolean,
    default: true
  },
  dismissible: {
    type: Boolean,
    default: false
  },
  autoClose: {
    type: [Boolean, Number],
    default: false
  },
  show: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['dismiss', 'update:show'])

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'info':
      return 'bg-blue-50 text-blue-700'
    case 'success':
      return 'bg-green-50 text-green-700'
    case 'warning':
      return 'bg-yellow-50 text-yellow-700'
    case 'error':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-blue-50 text-blue-700'
  }
})

const titleClasses = computed(() => {
  switch (props.variant) {
    case 'info':
      return 'text-blue-800'
    case 'success':
      return 'text-green-800'
    case 'warning':
      return 'text-yellow-800'
    case 'error':
      return 'text-red-800'
    default:
      return 'text-blue-800'
  }
})

const closeButtonClasses = computed(() => {
  switch (props.variant) {
    case 'info':
      return 'text-blue-500 hover:bg-blue-100'
    case 'success':
      return 'text-green-500 hover:bg-green-100'
    case 'warning':
      return 'text-yellow-500 hover:bg-yellow-100'
    case 'error':
      return 'text-red-500 hover:bg-red-100'
    default:
      return 'text-blue-500 hover:bg-blue-100'
  }
})

const iconName = computed(() => {
  switch (props.variant) {
    case 'info':
      return 'info-circle'
    case 'success':
      return 'check-circle'
    case 'warning':
      return 'exclamation-circle'
    case 'error':
      return 'times-circle'
    default:
      return 'info-circle'
  }
})

const dismiss = () => {
  emit('dismiss')
  emit('update:show', false)
}

onMounted(() => {
  if (props.autoClose) {
    setTimeout(() => {
      dismiss()
    }, typeof props.autoClose === 'number' ? props.autoClose : 5000)
  }
})
</script> 