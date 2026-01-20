<template>
  <v-app>
    <Navbar />

    <v-main class="tw-min-h-screen tw-bg-gray-50 tw-text-black">
      <slot />
    </v-main>

    <Footer />
  </v-app>
</template>

<script setup lang="ts">
import Navbar from '~/layouts/Navbar.vue'
import Footer from '~/layouts/Footer.vue'
</script>
