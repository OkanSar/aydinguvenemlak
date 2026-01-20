<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
  }
}>()

const router = useRouter()
</script>

<template>
  <NuxtLayout name="error">
    <div class="tw-flex tw-justify-center tw-items-center tw-py-20">
      <div class="tw-bg-white tw-rounded-2xl tw-shadow-lg tw-p-10 tw-text-center">
        <h1 class="tw-text-6xl tw-font-bold tw-text-red-500">
          {{ props.error?.statusCode || 500 }}
        </h1>

        <p class="tw-text-lg tw-mt-2">
          {{ props.error?.statusMessage || 'Bir hata oluştu' }}
        </p>

        <div class="tw-mt-6 tw-flex tw-justify-center tw-gap-4">
          <v-btn variant="outlined" @click="router.back()">Geri</v-btn>
          <v-btn color="primary" @click="router.push('/')">Ana Sayfa</v-btn>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
