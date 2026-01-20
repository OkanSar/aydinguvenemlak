<template>
  <v-footer color="#1F2F54FF" class="tw-text-gray-200 tw-py-12 tw-bg-[#1F2F54FF]">
    <v-container>
      <v-row justify="space-between">
        <!-- Hakkımızda -->
        <v-col cols="12" md="4">
          <h3 class="tw-text-xl tw-font-bold tw-mb-4">Aydın Güven Emlak</h3>
          <p class="tw-text-gray-400 tw-text-sm">
            Güvenilir, modern ve kullanıcı dostu platform ile rüya gibi yaşam alanlarını keşfedin.
          </p>
        </v-col>
        <!-- Sayfalar -->
        <v-col cols="12" md="2">
          <h3 class="tw-text-lg tw-font-bold tw-ml-8">SAYFALAR</h3>
          <v-divider />
          <v-list density="compact" bg-color="#1F2F54FF">
            <v-list-item>
              <v-btn variant="plain" to="/">Anasayfa</v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn variant="plain" to="/ofice">Ofisimiz</v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn variant="plain" to="/advertisement">İlanlar</v-btn>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="12" md="2">
          <h3 class="tw-text-lg tw-font-bold tw-ml-8">BİLGİLENDİRME</h3>
          <v-divider />
          <v-list density="compact" bg-color="#1F2F54FF">
            <v-list-item>
              <v-btn variant="plain" to="/contact">İletişim</v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn variant="plain" to="/sss">S.S.S.</v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn variant="plain" to="/privacy">GİZLİLİK</v-btn>
            </v-list-item>
          </v-list>
        </v-col>
        <!-- İletişim + Sosyal -->
        <v-col cols="12" md="2">
          <h3 class="tw-text-lg tw-font-bold tw-ml-8">İLETİŞİM</h3>
          <v-divider/>
          <p class="tw-text-gray-400 tw-text-sm tw-mt-4">aaydinguvenemlak@gmail.com</p>
        </v-col>
      </v-row>

      <v-row class="tw-mt-8">
        <v-col class="tw-text-center tw-text-gray-500 tw-text-sm">
          Copyright © {{new Date().getFullYear()}} Aydın Güven Emlak | All rights reserved
        </v-col>
        <div class="tw-flex tw-justify-between">
          <span class="tw-absolute tw-right-4 tw-bottom-0 tw-px-2 tw-py-1">
            <a href="https://portfolio.okansarioglu.me/" target="_blank" class="tw-text-xs tw-text-gray-400">
              Created by Okan Sarıoğlu
            </a>
          </span>
        </div>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
</script>
