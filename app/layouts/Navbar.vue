<script setup lang="ts">
import { useDisplay } from 'vuetify'
const { xs } = useDisplay()

const drawer = ref(false)

const navLinks = [
  { text: 'Anasayfa', to: '/' },
  { text: 'Ofisimiz', to: '/ofice' },
  { text: 'İlanlar', to: '/advertisement' },
  { text: 'İletişim', to: '/contact' },
]
</script>

<template>
  <v-app-bar flat absolute class="transparent-bar tw-text-white" height="64">
    <v-container class="d-flex align-center tw-text-white">
      <v-card-title class="font-weight-bold text-h6">
        <v-icon icon="mdi-home-outline" />
        Aydın Güven Emlak
      </v-card-title>
      <v-spacer />
      <template v-if="!xs">
        <v-btn
            v-for="link in navLinks"
            :key="link.text"
            :to="link.to"
            text
            class="text-white"
        >
          {{ link.text }}
        </v-btn>
      </template>

      <template v-if="xs">
        <v-btn icon @click="drawer = true">
          <v-icon icon="mdi-menu" />
        </v-btn>
      </template>
    </v-container>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" right temporary class="transparent-bar tw-text-white">
    <v-list>
      <v-list-item
          v-for="link in navLinks"
          :key="link.text"
          :to="link.to"
          @click="drawer = false"
      >
        <v-list-item-title class="tw-text-white">{{ link.text }}</v-list-item-title>
      </v-list-item>
      <v-divider color="white" />
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.transparent-bar {
  background-color: rgb(31, 47, 84) !important;
  box-shadow: none !important;
}
.v-btn {
  text-transform: none;
}
</style>
