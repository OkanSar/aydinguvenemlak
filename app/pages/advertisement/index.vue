<script setup>
const cityValue = ref(null)
const districtValue = ref(null)
const neighborhoodValue = ref(null)
const advertNoValue = ref(null)
const defaultImage = '/images/default-advert-image.jpg'

const ads = await $fetch('/api/advertisement')
const { data: areas } = await useAsyncData('areas', () =>
    $fetch('/api/area')
)

const city = computed(() => areas.value?.map(c => c.name) || [])

const district = computed(() => {
  if (!cityValue.value) return []
  const city = areas.value?.find(c => c.name === cityValue.value)
  return city?.districts.map(d => d.name) || []
})

const neighborhood = computed(() => {
  if (!districtValue.value) return []
  const city = areas.value?.find(c => c.name === cityValue.value)
  const district = city?.districts.find(d => d.name === districtValue.value)
  return district?.neighborhoods.map(n => n.name) || []
})

const neighborhoodNoDataText = computed(() => {
  if (!cityValue.value) return 'Önce şehir seçiniz'
  if (!districtValue.value) return 'Önce ilçe seçiniz'
  if (district.value.length && neighborhood.value.length === 0)
    return 'Mahalle yok'
  return 'Mahalle seçiniz'
})

const formatPrice = (price) => {
  if (price == null) return ''
  return new Intl.NumberFormat('tr-TR').format(price)
}

const adsFiltered = computed(() => {
  if (!ads || !Array.isArray(ads)) return []

  return ads.filter(ad => {
    if (ad.status !== 0) return false

    if (cityValue.value && ad.city !== cityValue.value) return false

    if (districtValue.value && ad.district !== districtValue.value) return false

    if (neighborhoodValue.value && ad.neighborhood !== neighborhoodValue.value)
      return false

    if (
        advertNoValue.value &&
        !String(ad.advertNo).startsWith(String(advertNoValue.value))
    ) {
      return false
    }

    return true
  })
})

const truncate = (text, length) => {
  if (!text) return '';
  return text.length > length ? text.slice(0, length) + '…' : text;
};
watch(cityValue, () => {
  districtValue.value = null
  neighborhoodValue.value = null
})

watch(districtValue, () => {
  neighborhoodValue.value = null
})
</script>

<template>
  <v-container class="tw-mt-10">
    <v-row class="tw-space-y-6 md:tw-space-y-0">

      <!-- SOL FİLTRE -->
      <v-col cols="12" md="4">
        <v-card class="tw-rounded-2xl tw-shadow-md tw-p-6">
          <v-row>
            <v-col cols="6" md="12">
              <h3 class="tw-mt-6 tw-ml-3 tw-text-lg tw-font-semibold tw-text-blue-950">
                Bölge Seç
              </h3>
              <v-divider color="#172554" class="tw-my-3" />

              <v-select
                  v-model="cityValue"
                  :items="city"
                  label="İl / Şehir"
                  class="tw-mb-3"
                  no-data-text="Şehir seçiniz"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
              />

              <v-select
                  v-model="districtValue"
                  :items="district"
                  label="İlçe"
                  class="tw-mb-3"
                  no-data-text="Önce şehir seçiniz"
                  variant="outlined"
                  density="compact"
                  hide-details
                  :disabled="!cityValue"
                  clearable
              />

              <v-select
                  v-model="neighborhoodValue"
                  :items="neighborhood"
                  label="Mahalle"
                  class="tw-mb-3"
                  :no-data-text="neighborhoodNoDataText"
                  variant="outlined"
                  density="compact"
                  hide-details
                  :disabled="!districtValue"
                  clearable
              />
            </v-col>
            <v-col cols="6" md="12">
              <h3 class="tw-mt-6 tw-ml-3 tw-text-lg tw-font-semibold tw-text-blue-950">
                İlan Numarası
              </h3>
              <v-divider color="#172554" class="tw-my-3" />

              <v-row>
                <v-col cols="12">
                  <v-text-field
                      v-model="advertNoValue"
                      placeholder="Örn: 12345"
                      variant="outlined"
                      label="İlan No"
                      density="compact"
                      class="tw-mb-2"
                      hide-details
                      clearable
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- SAĞ İLANLAR -->
      <v-col cols="12" md="8">
        <v-row class="tw-gap-6">
          <v-col
              cols="12"
              v-for="ad in adsFiltered"
              :key="ad.id"
          >
            <v-card
                class="tw-rounded-2xl tw-shadow-md hover:tw-shadow-xl tw-transition tw-overflow-hidden"
            >
              <v-row no-gutters>
                <!-- Görsel -->
                <v-col cols="12" md="4">
                  <v-img
                      :src="ad.image ? `/api/advertisement/images/${ad.image}` : undefined"
                      height="220"
                      cover
                  >
                    <template #error>
                      <v-img
                          :src="defaultImage"
                          height="220"
                          cover
                      />
                    </template>
                  </v-img>
                  <div
                      class="tw-absolute"
                      style="top: 12px; left: -48px; transform: rotate(-30deg);"
                  >
                    <span v-if="ad.advertType  === 1" class="tw-bg-blue-900 tw-text-white tw-font-semibold tw-px-14 tw-py-1.5 tw-shadow-md">
                      Satılık
                    </span>
                    <span v-else class="tw-bg-blue-900 tw-text-white tw-font-semibold tw-px-14 tw-py-1.5 tw-shadow-md">
                      Kiralık
                    </span>
                  </div>
                </v-col>

                <!-- İçerik -->
                <v-col
                    cols="12"
                    md="7"
                    class="tw-p-6 tw-ml-2 md:tw-pl-8 tw-flex tw-flex-col tw-justify-between"
                >
                  <!-- Üst -->
                  <div class="tw-space-y-2">
                    <h3 :to="'/advertisement/'+`${ad.id}`"
                        class="tw-text-xl tw-mt-3 md:tw-mt-0 tw-font-semibold tw-text-gray-800">
                      {{ ad.title }}
                    </h3>

                    <p class="tw-text-sm tw-leading-relaxed tw-text-gray-600">
                      {{ truncate(ad.description, 70) }}
                    </p>
                  </div>

                  <!-- Alt -->
                  <div class="tw-mt-5 tw-flex tw-items-end tw-justify-between">
                    <!-- Sol: Buton + Fiyat -->
                    <div class="tw-flex tw-flex-col tw-gap-2">
                      <!-- Göz At -->
                      <v-btn
                          :to="'/advertisement/'+`${ad.id}`"
                          size="md"
                          class="tw-text-sm tw-w-fit tw-px-4 tw-py-1"
                          color="#101e61"
                          variant="outlined"
                      >
                        Göz At
                        <v-icon icon="mdi-arrow-right" />
                      </v-btn>

                      <!-- Fiyat -->
                      <div>
                        <span class="tw-text-xs tw-text-gray-400">Fiyat</span>
                        <div class="tw-text-xl tw-font-bold tw-text-primary">
                          ₺{{ formatPrice(ad.price) }}
                        </div>
                      </div>
                    </div>

                    <!-- Sağ Bilgiler -->
                    <div class="tw-flex tw-items-center tw-gap-2">
                      <div class="tw-text-right">
                        <div class="tw-text-xs tw-text-gray-400 tw-mb-1">İlan No</div>
                        <div class="tw-text-sm tw-font-medium tw-text-gray-700">
                          {{ ad.advertNo }}
                        </div>
                      </div>

                      <v-chip
                          size="small"
                          class="tw-font-medium"
                          :color="ad.type === 'Arsa' ? 'green-lighten-4' : 'blue-lighten-4'"
                          :text-color="ad.type === 'Arsa' ? 'green-darken-2' : 'blue-darken-2'"
                      >
                        {{ ad.type }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>