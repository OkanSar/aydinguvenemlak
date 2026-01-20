<script setup lang="ts">
defineProps<{ form: any }>()
</script>

<template>
  <v-text-field
      v-model="form.title"
      label="İlan Başlığı"
      outlined
  />
</template>