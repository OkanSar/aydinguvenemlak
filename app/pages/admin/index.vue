<script setup lang="ts">
const panels = [
  {
    title: 'İlan Yönetimi',
    description: 'Sistemdeki kullanıcıları ekleyin, düzenleyin veya silin.',
    link: '/admin/advertisement'
  },
  {
    title: 'Öne Çıkan İlanlar',
    description: 'Sayfa ve içerikleri düzenleyin.',
    link: '/admin/highlightAdvert'
  },
  {
    title: 'İl-İlçe-Mahalle Yönetimi',
    description: 'İl, ilçe ve mahalle bilgilerini filtreleme ve yeni ilan girişi için buradan düzenleyebilirsiniz.',
    link: '/admin/area'
  },
  {
    title: 'Kullanıcı Yönetimi',
    description: 'Kullanıcıların kişisel giriş bilgilerini ve yetkisini bu sayfadan düzenleyebilirsiniz.'
  },
  {
    title: 'Hakkımızda Yazısı',
    description: 'Site hakkımızda sayfasının düzenini değiştirebilirsiniz.'
  },
  {
    title: 'İlan Görüntülenmeleri',
    description: 'İlanların görüntülenme grafiğine buradan erişebilirsiniz.',
    link: '/admin/graphic'
  }
]
</script>

<template>
  <v-container fluid class="tw-py-8">
    <div class="tw-max-w-7xl tw-mx-auto tw-px-4">
      <div class="tw-flex tw-items-center tw-justify-between">
        <h1 class="tw-text-lg sm:tw-text-xl tw-font-bold tw-text-gray-800">
          Yönetici Paneli
        </h1>
      </div>
      <v-divider class="tw-mt-3 tw-mb-6" />
    </div>
      <div class="tw-max-w-7xl tw-mx-auto tw-px-4">
        <v-row dense>
          <v-col
              v-for="(panel, index) in panels"
              :key="index"
              cols="12"
              sm="6"
              lg="6"
          >
            <v-card
                elevation="0"
                class="tw-rounded-2xl tw-border tw-border-gray-200
                   tw-shadow-sm hover:tw-shadow-lg
                   tw-transition tw-duration-300
                   tw-h-full tw-flex tw-flex-col"
            >
              <!-- Title -->
              <v-card-title class="tw-text-base tw-font-semibold tw-text-gray-800">
                {{ panel.title }}
              </v-card-title>

              <v-divider class="tw-mx-4" />

              <!-- Description -->
              <v-card-text class="tw-text-sm tw-text-gray-500 tw-leading-relaxed tw-flex-1">
                {{ panel.description }}
              </v-card-text>

              <!-- Action -->
              <v-card-actions class="tw-px-4 tw-pb-4">
                <v-btn
                    :href="panel.link"
                    block
                    color="#27416b"
                    variant="flat"
                    class="tw-rounded-xl tw-font-medium"
                >
                  Yönet
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
  </v-container>
</template>
