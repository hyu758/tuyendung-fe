<!-- PageHeader component -->
<template>
  <div class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-gray-900">
        {{ title }}
      </h1>
      <div v-if="subtitle" class="mt-1 text-sm text-gray-500">
        {{ subtitle }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    }
  }
}
</script> 