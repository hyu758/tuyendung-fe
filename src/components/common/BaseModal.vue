<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div 
        v-if="modelValue" 
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="close"
      >
        <div class="flex items-center justify-center min-h-screen p-4">
          <div 
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            @click="close"
          ></div>
          
          <transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div 
              :class="[
                'relative bg-white rounded-lg shadow-xl transform transition-all',
                sizeClasses,
                { 'overflow-hidden': loading }
              ]"
              @click.stop
            >
              <!-- Loader overlay -->
              <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            
              <!-- Header -->
              <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900">
                  <slot name="header">{{ title }}</slot>
                </h3>
                <button 
                  v-if="showCloseButton"
                  type="button" 
                  class="text-gray-400 hover:text-gray-500 focus:outline-none"
                  @click="close"
                >
                  <span class="sr-only">Đóng</span>
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Body -->
              <div class="px-6 py-4">
                <slot></slot>
              </div>

              <!-- Footer -->
              <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <slot name="footer"></slot>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  persistent: {
    type: Boolean,
    default: false
  },
  showCloseButton: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

// Compute modal size classes
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'max-w-sm w-full'
    case 'md': return 'max-w-md w-full'
    case 'lg': return 'max-w-lg w-full'
    case 'xl': return 'max-w-xl w-full'
    case 'full': return 'max-w-4xl w-full'
    default: return 'max-w-md w-full'
  }
})

// Handle escape key to close modal
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && props.modelValue && !props.persistent) {
    close()
  }
}

// Add and remove event listener for escape key
watch(() => props.modelValue, (value) => {
  if (value) {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleKeyDown)
    document.body.style.overflow = ''
  }
})

// Close the modal
const close = () => {
  if (!props.persistent) {
    emit('update:modelValue', false)
    emit('close')
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style> 