<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative rounded-md">
      <div 
        v-if="prefixIcon" 
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"
      >
        <font-awesome-icon :icon="prefixIcon" />
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
          'w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500',
          { 'pl-10': prefixIcon },
          { 'pr-10': suffixIcon || type === 'password' },
          { 'opacity-60 cursor-not-allowed': disabled },
          { 'bg-gray-100': readonly }
        ]"
        :min="min"
        :max="max"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      
      <div 
        v-if="suffixIcon" 
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500"
      >
        <font-awesome-icon :icon="suffixIcon" />
      </div>
      
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
        @click="togglePasswordVisibility"
      >
        <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
      </button>
    </div>
    
    <div v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </div>
    
    <div v-if="helpText" class="mt-1 text-sm text-gray-500">
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
  }
})

defineEmits(['update:modelValue', 'blur', 'focus'])

const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script> 