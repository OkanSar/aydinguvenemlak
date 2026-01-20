<template>
  <section class="tw-relative tw-overflow-hidden tw-py-20 tw-bg-gradient-to-br tw-bg-gray-900">
    <!-- decorative shapes -->
    <div class="pointer-events-none absolute tw-inset-0 tw-opacity-20">
      <div class="tw-absolute -tw-top-24 -tw-right-24 tw-w-72 tw-h-72 tw-rounded-full tw-bg-blue-900 tw-blur-3xl"></div>
      <div class="tw-absolute -tw-bottom-24 -tw-left-24 tw-w-72 tw-h-72 tw-rounded-full tw-bg-blue-300 tw-blur-3xl"></div>
    </div>

    <div class="tw-relative tw-max-w-7xl tw-mx-auto tw-px-4 tw-sm:px-6 tw-lg:px-8 tw-text-center">
      <h1 class="tw-text-4xl tw-lg:text-6xl tw-font-extrabold tw-tracking-tight tw-text-white tw-mb-4">
        {{ title }}
      </h1>
      <p v-if="description" class="tw-text-md tw-text-indigo-100 tw-max-w-3xl tw-mx-auto">
        {{ description }}
      </p>
      <div v-if="$slots.default" class="tw-mt-6">
        <slot />
      </div>
    </div>
  </section>

</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' }
})
</script>
