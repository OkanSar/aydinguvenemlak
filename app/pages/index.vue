<script setup lang="ts">
const { data: advertisements } = await useFetch('/api/highlightAdvert', {
  transform: (res: any) => res.result,
  default: () => [],
})
</script>

<template>
  <div class="tw-relative tw-w-full tw-min-h-screen tw-bg-gray-50">

    <section class="tw-bg-gradient-to-br tw-from-primary tw-to-secondary tw-text-white tw-py-40 tw-text-center tw-relative tw-overflow-hidden">
      <div class="tw-absolute tw-inset-0 tw-bg-[url('https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1400&q=80')] tw-bg-cover tw-bg-center tw-bg-black/60 "></div>

      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8" class="tw-relative">
            <h1 class="tw-text-5xl md:tw-text-6xl tw-font-extrabold tw-mb-6 tw-drop-shadow-xl">
              Hayalinizdeki Eve Bir Adım Daha Yakınsınız
            </h1>
            <p class="tw-text-lg md:tw-text-xl tw-mb-10 tw-text-gray-200 tw-font-light">
              Güvenilir, modern ve kullanıcı dostu platform ile rüya gibi yaşam alanlarını keşfedin.
            </p>

            <v-btn to="/advertisement"
            variant="elevated"
            color="#101e61">
              İlanlara Göz At
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- FEATURES SECTION -->
    <v-container class="tw-py-24 tw-mt-10">
      <h2 class="tw-text-3xl tw-font-bold tw-text-center tw-mb-14 tw-text-dark">
        Neden Bizi Tercih Etmelisiniz?
      </h2>

      <v-row class="tw-gap-8" justify="center">

        <!-- Card 1 -->
        <v-col cols="12" md="3">
          <v-card class="tw-rounded-2xl tw-shadow-xl tw-p-10 tw-text-center tw-bg-white hover:tw-shadow-2xl tw-transition">
            <v-icon size="48" color="primary" class="tw-mb-4">mdi-home-search</v-icon>
            <v-card-title class="tw-text-xl tw-font-semibold tw-mb-2">Geniş Portföy</v-card-title>
            <v-card-text>
              Binlerce güncel ilan ile her bütçeye uygun seçenekleri kolayca keşfedin.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Card 2 -->
        <v-col cols="12" md="3">
          <v-card class="tw-rounded-2xl tw-shadow-xl tw-p-8 tw-text-center tw-bg-white hover:tw-shadow-2xl tw-transition">
            <v-icon size="48" color="primary" class="tw-mb-4">mdi-shield-check</v-icon>
            <v-card-title class="tw-text-xl tw-font-semibold tw-mb-2">Güvenilir İlanlar</v-card-title>
            <v-card-text>
              Tüm ilanlar doğrulama süreçlerinden geçirilerek güvenli bir ortam sağlanır.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Card 3 -->
        <v-col cols="12" md="3">
          <v-card class="tw-rounded-2xl tw-shadow-xl tw-p-8 tw-text-center tw-bg-white hover:tw-shadow-2xl tw-transition">
            <v-icon size="48" color="primary" class="tw-mb-4">mdi-map-marker-radius</v-icon>
            <v-card-title class="tw-text-xl tw-font-semibold tw-mb-2">Lokasyon Odaklı</v-card-title>
            <v-card-text>
              İhtiyacınıza göre konum filtreleri <br> ile aradığınız bölgeyi kolayca bulun.
            </v-card-text>
          </v-card>
        </v-col>

      </v-row>
    </v-container>


    <!-- FEATURED LISTINGS -->
    <v-container class="tw-py-24 tw-bg-gray-100 tw-rounded-t-3xl tw-mt-10">
      <h2 class="tw-text-3xl tw-font-bold tw-text-center tw-mb-14 tw-text-dark">
        Öne Çıkan İlanlar
      </h2>

      <v-row class="tw-gap-10" justify="center">
        <v-col v-for="product in advertisements" :key="product.id" cols="12" md="4">
          <v-card class="tw-rounded-2xl tw-shadow-lg hover:tw-shadow-2xl tw-transition tw-bg-white">
            <div class="tw-relative">
              <v-img
                  :src="'/api/advertisement/images/' + product.image"
                  :height="$vuetify.display.smAndDown ? 480 : 200"
                  cover
                  class="tw-rounded-lg tw-mr-2 tw-cursor-pointer"
              />

              <div
                  class="tw-absolute"
                  style="top: 12px; left: -48px; transform: rotate(-30deg);"
              >
              <span v-if="product.type === 0" class="tw-bg-blue-900 tw-text-white tw-font-semibold tw-px-14 tw-py-1.5 tw-shadow-md">
                Kiralık
              </span>
              <span v-else class="tw-bg-blue-900 tw-text-white tw-font-semibold tw-px-14 tw-py-1.5 tw-shadow-md">
                Satılık
              </span>
              </div>

              <!-- Sağ üstte location chip -->
              <div class="tw-absolute tw-top-3 tw-right-3">
                <v-chip color="primary" text-color="white" variant="flat" size="x-small">
                  {{ product.city + ' / ' + product.district + (product.neighborhood ? ` / ${product.neighborhood}` : '' )}}
                </v-chip>
              </div>
            </div>

            <v-card-text class="tw-p-6">
              <h3 class="tw-text-lg tw-font-bold tw-mb-2 tw-truncate">
                {{ product.title || '' }}
              </h3>

              <p class="tw-text-gray-600 tw-mb-2 tw-truncate">
                {{ product.description || '' }}
              </p>
              <v-row>
                <v-col cols="7">
                  <p class="tw-text-primary tw-font-bold tw-text-xl">₺{{product.price}}</p>
                </v-col>
                <v-col cols="5">
                  <v-btn :to='`/advertisement/${product.advertId}`'
                         variant="outlined"
                         color="#101e61"
                         size="small"
                  >
                    Göz At →
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div class="tw-text-center tw-mt-14">
        <v-btn to="/advertisement"
               variant="elevated"
               color="#101e61">
          Daha Fazlası →
        </v-btn>
      </div>
    </v-container>
  </div>
</template>
