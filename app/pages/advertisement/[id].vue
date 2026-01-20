<script setup lang="ts">
const route = useRoute()
const defaultImage = '/images/default-advert-image.jpg'

const { data: advert, error } = await useAsyncData(
    'advert-detail',
    () => $fetch(`/api/advertisement/${route.params.id}`),
    {
      server: true,
      lazy: false,
    }
)

if (error.value || !advert.value || advert.value.data?.length === 0) {
  throw createError({
    statusCode: 404,
    statusMessage: 'İlan bulunamadı',
  })
}


const advertData = computed(() => advert.value.data[0])

const selectedImage = ref<string | null>(null)
const images = computed<string[]>(() => advertData.value?.images ?? [])

const dialog = ref(false)
const tab = ref('description')

const displayValue = (val: any) => {
  if (val === null || val === undefined || val === '') {
    return 'Belirtilmemiş'
  }
  return val
}
const yesNo = (val: number | null) => {
  if (val === null) return 'Belirtilmemiş'
  return val === 1 ? 'Evet' : 'Hayır'
}
const exists = (val: number | null) => {
  if (val === null) return 'Belirtilmemiş'
  return val === 1 ? 'Var' : 'Yok'
}

const features = computed(() => {
  if (!advertData.value) return []
  if (advertData.value.type === "Arsa") {
    return [
      { label: 'İlan No', value: displayValue(advertData.value.advertNo), key: 'advertNo' },
      {
        label: 'İlan Tipi',
        value: advertData.value.advertType === null
            ? 'Belirtilmemiş'
            : advertData.value.advertType === 1
                ? 'Satılık'
                : 'Kiralık',
        key: 'advertType'
      },
      { label: 'Türü', value: displayValue(advertData.value.type), key: 'type' },
      { label: 'Ada', value: displayValue(advertData.value.islandNo), key: 'islandNo' },
      { label: 'Parsel', value: displayValue(advertData.value.parcelNo), key: 'parcelNo' },
      { label: 'm²', value: displayValue(advertData.value.plotMetreSquare), key: 'plotMetreSquare' },
      {
        label: 'm² Fiyat',
        value: formatTL(advertData.value.plotMetreSquarePrice),
        key: 'plotMetreSquarePrice'
      },
      { label: 'İmar Durumu', value: displayValue(advertData.value.zoningStatus), key: 'zoningStatus' },
      { label: 'Tapu Durumu', value: displayValue(advertData.value.titleDeedStatus), key: 'titleDeedStatus' },
      { label: 'Krediye Uygun', value: displayValue(advertData.value.creditEligibility), key: 'creditEligibility' },
      { label: 'Kimden', value: displayValue(advertData.value.fromSale), key: 'fromSale' },
    ]
  }
  if (advertData.value.type === "Daire") {
    return [
      { label: 'İlan No', value: displayValue(advertData.value.advertNo), key: 'advertNo' },
      {
        label: 'İlan Tipi',
        value: advertData.value.advertType === null
            ? 'Belirtilmemiş'
            : advertData.value.advertType === 1
                ? 'Satılık'
                : 'Kiralık',
        key: 'advertType'
      },
      { label: 'Türü', value: displayValue(advertData.value.type), key: 'type' },
      { label: 'm² (Brüt)', value: displayValue(advertData.value.apartMetreSquareGross), key: 'apartMetreSquareGross' },
      { label: 'm² (Net)', value: displayValue(advertData.value.apartMetreSquareNet), key: 'apartMetreSquareNet' },
      { label: 'Oda Sayısı', value: displayValue(advertData.value.roomNumber), key: 'roomNumber' },
      { label: 'Bina Kat', value: displayValue(advertData.value.numberFloors), key: 'numberFloors' },
      { label: 'Bulunduğu Kat', value: displayValue(advertData.value.locatedFloor), key: 'locatedFloor' },
      { label: 'Bina Yaşı', value: displayValue(advertData.value.buildingAge), key: 'buildingAge' },
      { label: 'Isıtma Tipi', value: displayValue(advertData.value.heatingType), key: 'heatingType' },
      { label: 'Mutfak', value: exists(advertData.value.kitchen), key: 'kitchen' },
      { label: 'Balkon', value: exists(advertData.value.balcony), key: 'balcony' },
      { label: 'Asansör', value: exists(advertData.value.elevator), key: 'elevator' },
      { label: 'Eşyalı', value: yesNo(advertData.value.furnished), key: 'furnished' },
      { label: 'Site İçinde', value: yesNo(advertData.value.withinSite), key: 'withinSite' },
      {
        label: 'Aidat',
        value: formatTL(advertData.value.membershipFee),
        key: 'membershipFee'
      },
      { label: 'Tapu Durumu', value: displayValue(advertData.value.titleDeedStatus), key: 'titleDeedStatus' },
      { label: 'Krediye Uygun', value: displayValue(advertData.value.creditEligibility), key: 'creditEligibility' },
      { label: 'Kimden', value: displayValue(advertData.value.fromSale), key: 'fromSale' },
    ]
  }
  return [
    { label: 'İlan No', value: advertData.value.advertNo },
    { label: 'İlan Tipi', value: advertData.value.advertType === 1 ? 'Satılık' : 'Kiralık' },
    { label: 'Türü', value: advertData.value.type},
    { label: 'Ada', value: advertData.value.islandNo},
    { label: 'Parsel', value: advertData.value.parcelNo},
    { label: 'm²', value: advertData.value.plotMetreSquare },
    { label: 'm² (Brüt)', value: advertData.value.apartMetreSquareGross },
    { label: 'm² (Net)', value: advertData.value.apartMetreSquareNet },
    { label: 'm² Fiyat', value: advertData.value.plotMetreSquarePrice + 'TL' },
    { label: 'Oda Sayısı', value: advertData.value.roomNumber},
    { label: 'Bina Kat', value: advertData.value.numberFloors},
    { label: 'Bulunduğu Kat', value: advertData.value.locatedFloor},
    { label: 'Bina Yaşı', value: advertData.value.buildingAge},
    { label: 'Isıtma Tipi', value: advertData.value.heatingType},
    { label: 'Mutfak', value: advertData.value.kitchen === 1 ? 'Kapalı' :'Amerikan'},
    { label: 'Balkon', value: advertData.value.balcony === 1 ? 'Yok' :'Var'},
    { label: 'Eşyalı', value: advertData.value.furnished === 1 ? 'Hayır' : 'Evet'},
    { label: 'Site İçinde', value: advertData.value.withinSite === 1 ? 'Hayır' : 'Evet'},
    { label: 'Aidat', value: advertData.value.membershipFee + 'TL' },
    { label: 'İmar Durumu', value: advertData.value.zoningStatus },
    { label: 'Asansör', value: advertData.value.elevator === 1 ? 'Yok' :'Var'},
    { label: 'Tapu Durumu', value: advertData.value.titleDeedStatus },
    { label: 'Krediye Uygun', value: advertData.value.creditEligibility },
  ]
})

const formattedDescription = computed(() => {
  if (!advertData.value.detailDescription) return ''

  return advertData.value.detailDescription
      .replace(/<\/p>\s*<p>/g, '<br><br>')
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '')
})

const formatPrice = (price: number) => {
  if (price == null) return ''
  return new Intl.NumberFormat('tr-TR').format(price)
}
const formatTL = (val: number | string | null) => {
  if (val === null || val === undefined || val === '') {
    return 'Belirtilmemiş'
  }
  return formatPrice(Number(val)) + 'TL'
}

onMounted(() => {
  if (advertData.value) {
    $fetch(`/api/advertisement/${route.params.id}/view`, { method: 'POST' })
  }
})

watch(images, (val) => {
  if (val.length && !selectedImage.value) {
    selectedImage.value = val[0] || ''
  }
}, { immediate: true })
</script>

<template>
  <v-container class="tw-mt-10">
    <v-row>
      <h4 class="tw-ml-4 tw-justify-start">
        {{ advertData.title }}
        <div class="tw-text-xs tw-text-gray-400">
          👁 {{ advertData.viewCount }} görüntülenme
        </div>
      </h4>
    </v-row>
    <v-divider class="tw-mt-5 tw-mb-5"/>
    <v-row justify="center">
      <v-col cols="12" xl="10">
        <v-row class="tw-gap-10 tw-justify-between">
          <v-col cols="12" md="5" class="tw-select-none">
            <v-img
                :src="'/api/advertisement/images/' + selectedImage"
                :height="$vuetify.display.smAndDown ? 280 : 420"
                cover
                class="tw-rounded-xl tw-cursor-pointer"
                @click="dialog = true"
            >
              <template #error>
                <v-img
                    :src="defaultImage"
                    cover
                />
              </template>
            </v-img>

            <v-slide-group
                v-if="!$vuetify.display.smAndDown"
                class="tw-mt-4"
                show-arrows
            >
              <v-slide-group-item
                  v-for="(img, i) in images"
                  :key="i"
              >
                <v-img
                    :src="'/api/advertisement/images/' + img"
                    :height="$vuetify.display.smAndDown ? 90 : 80"
                    :width="$vuetify.display.smAndDown ? 140 : 120"
                    cover
                    class="tw-rounded-lg tw-mr-2 tw-cursor-pointer"
                    @click="selectedImage = img"
                >
                  <template #error>
                    <v-img
                        :src="defaultImage"
                        cover
                    />
                  </template>
                </v-img>
              </v-slide-group-item>
            </v-slide-group>
            <div
                v-else
                class="tw-flex tw-gap-3 tw-overflow-x-auto tw-mt-4"
            >
              <v-img
                v-for="(img, i) in images"
                :key="i"
                :src="'/api/advertisement/images/' + img"
                height="90"
                width="140"
                cover
                class="tw-rounded-lg tw-flex-shrink-0"
                @click="selectedImage = img"
              >
                <template #error>
                  <v-img
                      :src="defaultImage"
                      cover
                  />
                </template>
              </v-img>
              </div>
          </v-col>

          <v-col cols="12" md="5">
            <div class="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center md:tw-justify-between tw-gap-3 tw-mb-6">
              <div>
                <div class="tw-text-md tw-font-bold tw-text-blue-900">
                  {{ formatPrice(advertData.price) + 'TL' }}
                </div>
              </div>
              <div class="tw-text-sm tw-font-semibold tw-text-blue-900">
                İletişim:
                <span class="tw-underline tw-cursor-pointer">
                  {{ advertData.phoneNumber }}
                </span>
              </div>
            </div>
            <div class="tw-mb-2">
              <div class="tw-text-xs tw-font-bold tw-text-blue-900">
                {{ advertData.city + ' / ' + advertData.district + ' / ' + advertData.neighborhood }}
              </div>
            </div>
            <v-divider />
            <v-card class="tw-rounded-xl tw-p-6" variant="flat">
              <div
                  v-for="(item, index) in features"
                  :key="index"
              >
                <div class="tw-flex tw-justify-between tw-py-2 tw-text-sm">
                  <span class="tw-font-bold">{{ item.label }}</span>
                  <span class="tw-font-medium">
                    {{ item.value }}
                  </span>
                </div>

                <v-divider v-if="index !== features.length - 1" />
              </div>
            </v-card>

          </v-col>

        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" xl="10">
        <v-card class="tw-rounded-2xl tw-min-h-[600px]">

          <!-- TABS -->
          <v-tabs
              v-model="tab"
              color="primary"
              class="tw-border-b"
          >
            <v-tab value="description">
              İlan Açıklaması
            </v-tab>
            <v-tab value="location">
              Konum
            </v-tab>
          </v-tabs>

          <!-- TAB CONTENT -->
          <v-card-text class="tw-p-6">

            <v-window v-model="tab">

              <!-- AÇIKLAMA -->
              <v-window-item value="description">
                <div
                    class="prose max-w-none whitespace-pre-wrap [&>p]:mb-4"
                    v-html="formattedDescription || ''"
                />
              </v-window-item>

              <!-- KONUM -->
              <v-window-item value="location">
                <div class="tw-rounded-xl tw-overflow-hidden tw-shadow" v-html="advertData.location" />
              </v-window-item>

            </v-window>

          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
  <v-dialog
      v-model="dialog"
      max-width="900"
  >
    <v-card
        class="tw-relative tw-rounded-xl tw-overflow-hidden"
    >

      <!-- KAPAT BUTONU (CARD'IN İÇİNDE!) -->
      <v-btn
          icon
          variant="outlined"
          :style="{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 9999
            }"
          class="tw-bg-black/40 tw-text-white tw-backdrop-blur"
          @click="dialog = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-carousel
          hide-delimiters
          show-arrows
          :height="$vuetify.display.smAndDown ? '85vh' : 600"
      >
        <v-carousel-item
            v-for="(img, i) in images"
            :key="i"
        >
          <v-img
              :src="'/api/advertisement/images/' + img"
              cover
              class="tw-h-full"
          >
            <template #error>
              <v-img
                  :src="defaultImage"
                  cover
              />
            </template>
          </v-img>
        </v-carousel-item>
      </v-carousel>

    </v-card>
  </v-dialog>
</template>