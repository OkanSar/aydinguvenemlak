<script setup lang="ts">
import Swal from 'sweetalert2'
let L: typeof import('leaflet')

onMounted(async () => {
  if (!process.client) return

  const leaflet = await import('leaflet')
  await import('leaflet/dist/leaflet.css')

  L = leaflet
})

const mapRef = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const marker = ref<L.Marker | null>(null)
const locationIframe = ref<string>('')
const defaultLatLng: [number, number] = [39.925533, 32.866287]
const generateIframe = (lat: number, lng: number) => {
  const iframe = `
<iframe
  src="https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed"
  width="800" height="450" style="border:0;"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade">
</iframe>
`.trim()

  locationIframe.value = iframe
  editValue.value = iframe // 🔴 saveEdit bunu kullanacak
}

const route = useRoute()
const res = await $fetch(
    `/api/advertisement/${route.params.id}`
)
const advert = computed(() => {
  const a = res.data[0]

  let images: string[] = []

  if (a.image) {
    images = a.image.includes('##')
        ? a.image.split('##').filter(Boolean)
        : [a.image]
  }

  return {
    ...a,
    images
  }
})

const editImages = ref<string[]>([])
const newImageFiles = ref<File[]>([])
const selectedImage = ref<string | null>(null)
const images = computed<string[]>(() => advert.value?.images ?? [])

const dialog = ref(false)
const tab = ref('description')

const yesNoOptions = [
  { label: 'Evet', value: 1 },
  { label: 'Hayır', value: 0 }
]

const existsNotExistsOptions = [
  { label: 'Var', value: 1 },
  { label: 'Yok', value: 0 }
]

const features = computed(() => {
  if (!advert.value) return []
  if (advert.value.type === "Arsa") {
    return [
      { label: 'İlan No', value: displayValue(advert.value.advertNo), key: 'advertNo' },
      {
        label: 'İlan Tipi',
        value: advert.value.advertType === null
            ? 'Belirtilmemiş'
            : advert.value.advertType === 1
                ? 'Satılık'
                : 'Kiralık',
        key: 'advertType'
      },
      { label: 'Türü', value: displayValue(advert.value.type), key: 'type' },
      { label: 'Ada', value: displayValue(advert.value.islandNo), key: 'islandNo' },
      { label: 'Parsel', value: displayValue(advert.value.parcelNo), key: 'parcelNo' },
      { label: 'm²', value: displayValue(advert.value.plotMetreSquare), key: 'plotMetreSquare' },
      {
        label: 'm² Fiyat',
        value: formatTL(advert.value.plotMetreSquarePrice),
        key: 'plotMetreSquarePrice'
      },
      { label: 'İmar Durumu', value: displayValue(advert.value.zoningStatus), key: 'zoningStatus' },
      { label: 'Tapu Durumu', value: displayValue(advert.value.titleDeedStatus), key: 'titleDeedStatus' },
      { label: 'Krediye Uygun', value: displayValue(advert.value.creditEligibility), key: 'creditEligibility' },
      { label: 'Kimden', value: displayValue(advert.value.fromSale), key: 'fromSale' },
    ]
  }
  if (advert.value.type === "Daire") {
    return [
      { label: 'İlan No', value: displayValue(advert.value.advertNo), key: 'advertNo' },
      {
        label: 'İlan Tipi',
        value: advert.value.advertType === null
            ? 'Belirtilmemiş'
            : advert.value.advertType === 1
                ? 'Satılık'
                : 'Kiralık',
        key: 'advertType'
      },
      { label: 'Türü', value: displayValue(advert.value.type), key: 'type' },
      { label: 'm² (Brüt)', value: displayValue(advert.value.apartMetreSquareGross), key: 'apartMetreSquareGross' },
      { label: 'm² (Net)', value: displayValue(advert.value.apartMetreSquareNet), key: 'apartMetreSquareNet' },
      { label: 'Oda Sayısı', value: displayValue(advert.value.roomNumber), key: 'roomNumber' },
      { label: 'Bina Kat', value: displayValue(advert.value.numberFloors), key: 'numberFloors' },
      { label: 'Bulunduğu Kat', value: displayValue(advert.value.locatedFloor), key: 'locatedFloor' },
      { label: 'Bina Yaşı', value: displayValue(advert.value.buildingAge), key: 'buildingAge' },
      { label: 'Isıtma Tipi', value: displayValue(advert.value.heatingType), key: 'heatingType' },
      { label: 'Mutfak', value: exists(advert.value.kitchen), key: 'kitchen' },
      { label: 'Balkon', value: exists(advert.value.balcony), key: 'balcony' },
      { label: 'Asansör', value: exists(advert.value.elevator), key: 'elevator' },
      { label: 'Eşyalı', value: yesNo(advert.value.furnished), key: 'furnished' },
      { label: 'Site İçinde', value: yesNo(advert.value.withinSite), key: 'withinSite' },
      {
        label: 'Aidat',
        value: formatTL(advert.value.membershipFee),
        key: 'membershipFee'
      },
      { label: 'Tapu Durumu', value: displayValue(advert.value.titleDeedStatus), key: 'titleDeedStatus' },
      { label: 'Krediye Uygun', value: displayValue(advert.value.creditEligibility), key: 'creditEligibility' },
      { label: 'Kimden', value: displayValue(advert.value.fromSale), key: 'fromSale' },
    ]
  }
  return [
    { label: 'İlan No', value: advert.value.advertNo },
    { label: 'İlan Tipi', value: advert.value.advertType === 1 ? 'Satılık' : 'Kiralık' },
    { label: 'Türü', value: advert.value.type},
    { label: 'Ada', value: advert.value.islandNo},
    { label: 'Parsel', value: advert.value.parcelNo},
    { label: 'm²', value: advert.value.plotMetreSquare },
    { label: 'm² (Brüt)', value: advert.value.apartMetreSquareGross },
    { label: 'm² (Net)', value: advert.value.apartMetreSquareNet },
    { label: 'm² Fiyat', value: advert.value.plotMetreSquarePrice + 'TL' },
    { label: 'Oda Sayısı', value: advert.value.roomNumber},
    { label: 'Bina Kat', value: advert.value.numberFloors},
    { label: 'Bulunduğu Kat', value: advert.value.locatedFloor},
    { label: 'Bina Yaşı', value: advert.value.buildingAge},
    { label: 'Isıtma Tipi', value: advert.value.heatingType},
    { label: 'Mutfak', value: advert.value.kitchen === 1 ? 'Kapalı' :'Amerikan'},
    { label: 'Balkon', value: advert.value.balcony === 1 ? 'Yok' :'Var'},
    { label: 'Eşyalı', value: advert.value.furnished === 1 ? 'Hayır' : 'Evet'},
    { label: 'Site İçinde', value: advert.value.withinSite === 1 ? 'Hayır' : 'Evet'},
    { label: 'Aidat', value: advert.value.membershipFee + 'TL' },
    { label: 'İmar Durumu', value: advert.value.zoningStatus },
    { label: 'Asansör', value: advert.value.elevator === 1 ? 'Yok' :'Var'},
    { label: 'Tapu Durumu', value: advert.value.titleDeedStatus },
    { label: 'Krediye Uygun', value: advert.value.creditEligibility },
  ]
})

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

const isSelectFeature = computed(() => {
  return !!(editKey.value && featureOptions[editKey.value])
})
const featureOptions: Record<string, { label: string; value: any }[]> = {
  type: [
    { label: 'Arsa', value: 'Arsa' },
    { label: 'Daire', value: 'Daire' },
  ],
  advertType: [
    { label: 'Kiralık', value: 0 },
    { label: 'Satılık', value: 1 }
  ],

  kitchen: [
    { label: 'Amerikan', value: 0 },
    { label: 'Kapalı', value: 1 }
  ],

  balcony: existsNotExistsOptions,
  elevator: existsNotExistsOptions,

  furnished: yesNoOptions,
  withinSite: yesNoOptions,
  usageStatus: yesNoOptions
}

watch(images, (val) => {
  if (val.length && !selectedImage.value) {
    selectedImage.value = val[0] || ''
  }
}, { immediate: true })

type EditType =
    | 'title'
    | 'price'
    | 'phone'
    | 'locationFields'
    | 'feature'
    | 'description'
    | 'images'
    | 'location'
    | 'detailDescription'

const editDialog = ref(false)
const editType = ref<EditType | null>(null)
const editValue = ref<any>(null)
const editLabel = ref<string | null>(null)
const editKey = ref<string | null>(null)

function getEditLabel(type: EditType, label?: string) {
  switch(type) {
    case 'price': return 'Fiyat'
    case 'title': return 'Başlık'
    case 'phone': return 'Telefon'
    case 'description': return 'Açıklama'
    case 'locationFields': return 'Konum'
    case 'images': return 'Resimler'
    case 'location': return 'Harita Konumu'
    case 'feature': return label || 'Özellik'
    case 'detailDescription': return 'Detaylı Açıklama'
    default: return 'Bilgi'
  }
}

function openEdit(
    type: EditType,
    value?: any,
    key?: string,
    label?: string
) {
  editType.value = type
  editKey.value = key || null
  editLabel.value = label || null

  if (type === 'images') {
    editImages.value = [...advert.value.images]
    newImageFiles.value = []
  } else {
    editValue.value = value
  }

  editDialog.value = true
}

async function saveImages(files: File[], keepImages: string[]) {
  const fd = new FormData()

  keepImages.forEach(url => {
    fd.append('keepImages[]', url)
  })

  files.forEach(file => {
    fd.append('images', file)
  })

  await $fetch(`/api/advertisement/${advert.value.id}`, {
    method: 'PUT',
    body: fd
  })
  editDialog.value = false

  Swal.fire({
    icon: 'success',
    title: 'Başarılı!',
    text: 'Resimler güncellendi',
    confirmButtonText: 'Tamam'
  }).then(() => window.location.reload())
}
async function saveEdit() {
  let payload: Record<string, any> = {}
  let oldValue: any = null
  let newValue: any = editValue.value

  switch (editType.value) {
    case 'title':
      oldValue = advert.value.title
      payload = { title: newValue }
      advert.value.title = newValue
      break

    case 'price':
      oldValue = advert.value.price
      newValue = Number(editValue.value)
      payload = { price: newValue }
      advert.value.price = newValue
      break

    case 'phone':
      oldValue = advert.value.phoneNumber
      payload = { phoneNumber: newValue }
      advert.value.phoneNumber = newValue
      break

    case 'description':
      oldValue = advert.value.detailDescription
      payload = { detailDescription: newValue }
      advert.value.detailDescription = newValue
      break

    case 'locationFields':
      oldValue = `${advert.value.city} / ${advert.value.district} / ${advert.value.neighborhood}`

      payload = {
        city: editValue.value.city,
        district: editValue.value.district,
        neighborhood: editValue.value.neighborhood
      }

      advert.value.city = editValue.value.city
      advert.value.district = editValue.value.district
      advert.value.neighborhood = editValue.value.neighborhood

      newValue = `${payload.city} / ${payload.district} / ${payload.neighborhood}`
      break

    case 'feature':
      if (!editKey.value) return
      oldValue = advert.value[editKey.value]
      payload = { [editKey.value]: newValue }
      advert.value[editKey.value] = newValue

      if (featureOptions[editKey.value]) {
        const oldOption = featureOptions[editKey.value].find(o => o.value === oldValue)
        const newOption = featureOptions[editKey.value].find(o => o.value === newValue)
        oldValue = oldOption ? oldOption.label : oldValue
        newValue = newOption ? newOption.label : newValue
      }
      break

    case 'images':
      await saveImages(newImageFiles.value, editImages.value)
      advert.value.images = [...editImages.value]
      return

    case 'location':
      payload = { location: newValue }
      advert.value.location = newValue
      break

    case 'detailDescription':
      oldValue = advert.value.detailDescription
      payload = { detailDescription: newValue }
      advert.value.detailDescription = newValue
      break
  }

  await $fetch(`/api/advertisement/${advert.value.id}`, {
    method: 'PUT',
    body: payload
  })

  editDialog.value = false

  // SweetAlert göster
  let formattedOld = oldValue
  let formattedNew = newValue

  if (editType.value === 'price') {
    formattedOld = formatPrice(oldValue) + 'TL'
    formattedNew = formatPrice(newValue) + 'TL'
  }

  Swal.fire({
    icon: 'success',
    title: 'Başarılı!',
    html: `<strong>${getEditLabel(editType.value, editLabel.value)}</strong> başarıyla değiştirildi:<br>${formattedOld} → ${formattedNew}`,
    confirmButtonText: 'Tamam'
  }).then((result) => {
    if (result.isConfirmed) {
      setTimeout(() => window.location.reload())
    }
  })
}
watch(editDialog, async (open) => {
  if (!open || editType.value !== 'location') return
  if (!process.client) return

  await nextTick()

  if (!mapRef.value || map.value) return

  map.value = L.map(mapRef.value).setView(defaultLatLng, 6)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map.value)

  map.value.on('click', (e: any) => {
    const { lat, lng } = e.latlng

    if (marker.value) {
      marker.value.setLatLng([lat, lng])
    } else {
      marker.value = L.marker([lat, lng]).addTo(map.value!)
    }

    generateIframe(lat, lng)
  })
})
watch(editDialog, (open) => {
  if (!open) {
    if (map.value) {
      map.value.remove()
      map.value = null
    }

    marker.value = null
    locationIframe.value = ''
  }
})
</script>

<template>
  <v-container class="tw-mt-4">
    <div class="tw-flex tw-justify-between">
      <div class="tw-flex tw-items-center tw-justify-between">
        <v-btn href="/admin/advertisement" variant="text">
          <v-icon icon="mdi-arrow-left" />
        </v-btn>
        <h1 class="tw-text-lg sm:tw-text-xl tw-font-bold tw-text-gray-800">
          İlan Düzenleme
        </h1>
      </div>
    </div>
    <v-divider class="tw-mb-10" opacity="1"/>
    <v-row>
      <h4 class="tw-ml-4 tw-justify-start">
        {{ advert.title }}
        <v-btn
          size="small"
          variant="outlined"
          color="#1F2F54FF"
          @click="openEdit('title', advert.title)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </h4>
    </v-row>
    <v-divider class="tw-mt-5 tw-mb-5"/>
    <v-row justify="center">
      <v-col cols="12" xl="10">
        <v-row class="tw-gap-10 tw-justify-between">
          <v-col cols="12" md="5" class="tw-select-none">
            <v-btn
                size="small"
                variant="outlined"
                color="#1F2F54FF"
                class="tw-bg-black/40 tw-text-white tw-backdrop-blur"
                :style="{
                    top: '12px',
                    right: '12px',
                    zIndex: 9999
                  }"
                @click="openEdit('images', images)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-img
                :src="'/api/advertisement/images/' + selectedImage || ''"
                :height="$vuetify.display.smAndDown ? 280 : 420"
                cover
                class="tw-rounded-xl tw-cursor-pointer"
                @click="dialog = true"
            >
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
                />
              </v-slide-group-item>
            </v-slide-group>
            <div
                v-else
                class="tw-flex tw-gap-3 tw-overflow-x-auto tw-mt-4"
            >
              <v-img
                  v-for="(img, i) in images"
                  :key="i"
                  :src="img"
                  height="90"
                  width="140"
                  cover
                  class="tw-rounded-lg tw-flex-shrink-0"
                  @click="selectedImage = img"
              />
            </div>
          </v-col>

          <v-col cols="12" md="5">
            <div class="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center md:tw-justify-between tw-gap-3 tw-mb-6">
              <div>
                <div class="tw-text-md tw-font-bold tw-text-blue-900">
                  {{ formatPrice(advert.price) + 'TL' }}
                  <v-btn
                      size="small"
                      variant="outlined"
                      color="#1F2F54FF"
                      @click="openEdit('price', advert.price)"
                  >
                    <v-icon size="16">
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </div>
              </div>
              <div class="tw-text-sm tw-font-semibold tw-text-blue-900">
                İletişim:
                <span class="tw-underline tw-cursor-pointer">
                  {{ advert.phoneNumber }}
                    <v-btn
                        size="small"
                        variant="outlined"
                        color="#1F2F54FF"
                        @click="openEdit('phone', advert.phoneNumber)"
                    >
                    <v-icon size="18">
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </span>
              </div>
            </div>
            <div class="tw-mb-2">
              <div class="tw-text-xs tw-font-bold tw-text-blue-900">
                {{ advert.city + ' / ' + advert.district + ' / ' + advert.neighborhood }}
                <v-btn
                  size="small"
                  variant="outlined"
                  color="#1F2F54FF"
                  @click="openEdit(
                  'locationFields',
                  {
                    city: advert.city,
                    district: advert.district,
                    neighborhood: advert.neighborhood
                  })"
                  >
                    <v-icon size="18">mdi-pencil</v-icon>
                </v-btn>

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
                  <span v-if="item.value === advert.advertNo" class="tw-font-medium">
                    {{ item.value }}
                  </span>
                  <span v-else class="tw-font-medium">
                    {{ item.value }}
                    <v-btn
                        size="x-small"
                        variant="outlined"
                        color="#1F2F54FF"
                        @click="openEdit('feature', item.value, item.key, item.label)"
                    >
                    <v-icon>
                      mdi-pencil
                    </v-icon>
                  </v-btn>
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

              <v-window-item value="description">
                <v-btn
                    size="small"
                    variant="outlined"
                    color="#1F2F54FF"
                    :style="{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 9999
                    }"
                    @click="openEdit('detailDescription', advert.detailDescription)"
                >
                  <v-icon>
                    mdi-pencil
                  </v-icon>
                </v-btn>
                <div
                    class="prose max-w-none"
                    v-html="advert.detailDescription || ''"
                />
              </v-window-item>

              <!-- KONUM -->
              <v-window-item value="location">
                <v-btn
                    size="small"
                    variant="outlined"
                    color="#1F2F54FF"
                    :style="{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 9999
                    }"
                    @click="openEdit('location', advert.location)"
                >
                  <v-icon>
                    mdi-pencil
                  </v-icon>
                </v-btn>
                <div class="tw-rounded-xl tw-overflow-hidden tw-shadow" v-html="advert.location" />
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
          />
        </v-carousel-item>
      </v-carousel>

    </v-card>
  </v-dialog>
  <v-dialog v-model="editDialog" max-width="600">
    <v-card class="tw-rounded-xl tw-p-6">

      <v-card-title class="tw-text-lg tw-font-bold">
        Düzenle
      </v-card-title>

      <v-divider class="tw-my-3" />

      <!-- TITLE -->
      <v-text-field
          v-if="editType === 'title'"
          v-model="editValue"
          label="İlan Başlığı"
      />

      <!-- PRICE -->
      <v-text-field
          v-if="editType === 'price'"
          v-model="editValue"
          label="Fiyat"
          type="number"
          suffix="TL"
      />

      <!-- PHONE -->
      <v-text-field
          v-if="editType === 'phone'"
          v-model="editValue"
          label="Telefon"
      />

      <div v-if="editType === 'locationFields'" class="tw-flex tw-flex-col tw-gap-4">
        <v-text-field
            v-model="editValue.city"
            label="İl"
        />

        <v-text-field
            v-model="editValue.district"
            label="İlçe"
        />

        <v-text-field
            v-model="editValue.neighborhood"
            label="Mahalle"
        />
      </div>

      <!-- FEATURE SELECT -->
      <v-select
          v-if="editType === 'feature' && isSelectFeature"
          v-model="editValue"
          :items="featureOptions[editKey!]"
          item-title="label"
          item-value="value"
          :label="editLabel"
      />

      <!-- FEATURE TEXT -->
      <v-text-field
          v-if="editType === 'feature' && !isSelectFeature"
          v-model="editValue"
          :label="editLabel"
      />

      <!-- DESCRIPTION -->
      <v-textarea
          v-if="editType === 'description'"
          v-model="editValue"
          rows="6"
          label="Açıklama"
      />

      <!-- IMAGES -->
      <div v-if="editType === 'images'">
        <!-- YENİ RESİM EKLE -->
        <v-file-input
            multiple
            accept="image/*"
            label="Yeni Resimler"
            @update:model-value="files => newImageFiles = files || []"
        />

        <div class="tw-flex tw-flex-wrap tw-gap-2 tw-mt-4">
          <v-chip
              v-for="(img, i) in editImages"
              :key="img"
              closable
              @click:close="editImages.splice(i, 1)"
          >
            Resim {{ i + 1 }}
          </v-chip>
        </div>

        <div class="tw-text-xs tw-text-gray-500 tw-mt-2">
          Kapatılan resimler silinecektir
        </div>
      </div>

      <div v-if="editType === 'location'" class="tw-flex tw-flex-col tw-gap-4">

        <div class="tw-text-sm tw-text-gray-600">
          Haritadan konumu seç → otomatik kaydedilir
        </div>

        <!-- HARİTA -->
        <div
            ref="mapRef"
            class="tw-h-[400px] tw-rounded-xl tw-border"
        />

        <!-- ÖNİZLEME -->
        <div v-if="locationIframe" class="tw-rounded-xl tw-overflow-hidden tw-border">
          <div class="tw-text-xs tw-text-gray-500 tw-p-2">
            Google Maps Önizleme
          </div>
          <div v-html="locationIframe" />
        </div>

      </div>

      <v-card v-if="editType === 'detailDescription'" class="tw-p-2 tw-bg-white tw-rounded-lg">
        <ClientQuill v-model="editValue" />
      </v-card>

      <v-divider class="tw-my-4" />

      <v-card-actions class="tw-justify-end">
        <v-btn variant="text" @click="editDialog = false">
          İptal
        </v-btn>

        <v-btn color="primary" @click="saveEdit">
          Kaydet
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>