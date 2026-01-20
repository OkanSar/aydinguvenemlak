<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <div class="tw-flex tw-justify-center tw-items-center tw-py-20">
    <div class="tw-bg-white tw-rounded-2xl tw-shadow-lg tw-p-10 tw-text-center tw-max-w-md">
      <h1 class="tw-text-[6rem] tw-font-extrabold tw-text-primary">
        404
      </h1>

      <h2 class="tw-text-xl tw-font-semibold">
        Sayfa Bulunamadı
      </h2>

      <p class="tw-text-gray-500 tw-mt-2">
        Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.
      </p>

      <div class="tw-mt-6 tw-flex tw-justify-center tw-gap-4">
        <v-btn variant="outlined" @click="router.back()">Geri</v-btn>
        <v-btn color="primary" @click="router.push('/')">Ana Sayfa</v-btn>
      </div>
    </div>
  </div>
</template>
