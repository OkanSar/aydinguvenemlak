<script setup lang="ts">
import Swal from 'sweetalert2'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const mapRef = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const marker = ref<L.Marker | null>(null)
const locationIframe = ref('')

const locations = await $fetch('/api/area')
const cities = computed(() =>
    locations.map((city: any) => ({
      label: city.name,
      value: city.id,
    }))
)

const districts = computed(() => {
  const city = locations.find((c: any) => c.id === form.city)
  return city
      ? city.districts.map((d: any) => ({
        label: d.name,
        value: d.id,
      }))
      : []
})

const neighborhoods = computed(() => {
  const city = locations.find((c: any) => c.id === form.city)
  const district = city?.districts.find((d: any) => d.id === form.district)
  return district
      ? district.neighborhoods.map((n: any) => ({
        label: n.name,
        value: n.id,
      }))
      : []
})

const selectedCity = computed(() =>
    locations.find((c: any) => c.id === form.city)
)

const selectedDistrict = computed(() =>
    selectedCity.value?.districts.find(
        (d: any) => d.id === form.district
    )
)

const selectedNeighborhood = computed(() =>
    selectedDistrict.value?.neighborhoods.find(
        (n: any) => n.id === form.neighborhood
    )
)

enum CreateStep {
  ADVERTTYPE,
  TYPE,
  TITLE,
  DESCRIPTION,
  PRICE,
  PHONE,
  CITY,
  DISTRICT,
  NEIGHBORHOOD,
  LOCATION,
  FEATURES,
  IMAGES,
  DETAIL,
}

const step = ref<CreateStep>(CreateStep.ADVERTTYPE)

/* ---------- FORM ---------- */
const form = reactive({
  advertType: null,
  type: '',
  title: '',
  description: '',
  price: null,
  phoneNumber: '',
  city: null as number | null,
  locationIframe: '',
  district: null as number | null,
  neighborhood: null as number | null,
  titleDeedStatus: null as string | null,
  creditEligibility: '',
  fromSale: '',
})

/* ---------- FEATURES ---------- */
const arsaFeatures = reactive({
  islandNo: null,
  parcelNo: null,
  plotMetreSquare: null,
  plotMetreSquarePrice: null,
  zoningStatus: '',
  creditEligibility: null,
  fromSale: null,
})

const daireFeatures = reactive({
  apartMetreSquareGross: null,
  apartMetreSquareNet: null,
  roomNumber: '',
  heatingType: '',

  locatedFloor: null,
  numberFloors: null,
  buildingAge: null,

  kitchen: null as number | null,
  balcony: null as number | null,
  elevator: null as number | null,
  furnished: null as number | null,
  withinSite: null as number | null,
  membershipFee: null,
  creditEligibility: '',
  fromSale: '',
})

/* ---------- IMAGES ---------- */
const images = ref<File[]>([])
const detailDescription = ref('')
const yesNoOptions = [
  { title: 'Belirtilmemiş', value: null },
  { title: 'Evet', value: 1 },
  { title: 'Hayır', value: 0 },
]
const kitchenOptions = [
  { title: 'Belirtilmemiş', value: null },
  { title: 'Amerikan', value: 1 },
  { title: 'Kapalı', value: 0 },
]
/* ---------- NAV ---------- */
const nextStep = async () => {
  if (step.value < CreateStep.DETAIL) {
    step.value++
    await nextTick()
  }
}

const prevStep = async () => {
  if (step.value > CreateStep.ADVERTTYPE) {
    step.value--
    await nextTick()
  }
}

/* ---------- SUBMIT ---------- */
const submit = async () => {
  try {
    const basePayload = {
      ...toRaw(form),
      city: selectedCity.value?.name ?? '',
      district: selectedDistrict.value?.name ?? '',
      neighborhood: selectedNeighborhood.value
          ? selectedNeighborhood.value.name
          : ' ',
      location: form.locationIframe,
      description: form.description,
      detailDescription: detailDescription.value,
      status: 0,
    }

    const featurePayload =
        form.type === 'Arsa'
            ? toRaw(arsaFeatures)
            : toRaw(daireFeatures)

    const formData = new FormData()

    Object.entries({ ...basePayload, ...featurePayload }).forEach(
        ([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, String(value))
          }
        }
    )

    images.value.forEach((file) => {
      formData.append('image', file)
    })

    await $fetch('/api/advertisement', {
      method: 'POST',
      body: formData,
    })
    await Swal.fire({
      icon: 'success',
      title: 'İlan Oluşturuldu!',
      text: 'İlan başarıyla kaydedildi.',
      confirmButtonText: 'Tamam',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })

    router.push('/admin/advertisement')

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Hata!',
      text: 'İlan oluşturulurken bir hata oluştu.',
    })
  }
}

const generateIframe = (lat: number, lng: number) => {
  const iframe = `
<iframe
  src="https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed"
  width="800" height="450" style="border:0;"
  style="border:0;"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade">
</iframe>
`.trim()

  locationIframe.value = iframe
  form.locationIframe = iframe
}
const initMap = async () => {
  await nextTick() // DOM garanti

  if (!mapRef.value || map.value) return

  map.value = L.map(mapRef.value).setView(
      [39.925533, 32.866287],
      6
  )

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
}

watch(step, async (newStep) => {
  if (newStep === CreateStep.LOCATION) {
    await initMap()
  }
})

watch(() => form.city, () => {
  form.district = null
  form.neighborhood = null
})

watch(() => form.district, () => {
  form.neighborhood = null
})
</script>

<template>
  <v-container class="tw-mt-10">
    <v-card class="tw-max-w-[700px] tw-mx-auto tw-p-6 tw-rounded-xl">
      <div class="tw-flex tw-justify-between">
        <div class="tw-flex tw-items-center tw-justify-between">
          <v-btn href="/admin/advertisement" variant="text">
            <v-icon icon="mdi-arrow-left" />
          </v-btn>
          <h1 class="tw-text-lg sm:tw-text-xl tw-font-bold tw-text-gray-800">
            Yeni İlan Detayları
          </h1>
        </div>
      </div>
      <v-divider class="tw-mb-5" opacity="1"/>
      <!-- TYPE -->
      <v-select
          v-if="step === CreateStep.ADVERTTYPE"
          v-model="form.advertType"
          label="İlan Türü"
          :items="[
          { title: 'Kiralık', value: '0' },
          { title: 'Satılık', value: '1' },
        ]"
      />

      <v-select
          v-if="step === CreateStep.TYPE"
          v-model="form.type"
          label="Yapı Türü"
          :items="[
          { title: 'Arsa', value: 'Arsa' },
          { title: 'Daire', value: 'Daire' },
        ]"
      />

      <!-- TITLE -->
      <v-text-field
          v-if="step === CreateStep.TITLE"
          v-model="form.title"
          label="İlan Başlığı"
      />

      <!-- DESCRIPTION-->
      <v-text-field
          v-if="step === CreateStep.DESCRIPTION"
          v-model="form.description"
          label="Kısa Açıklama"
      />

      <!-- PRICE -->
      <v-text-field
          v-if="step === CreateStep.PRICE"
          v-model="form.price"
          label="Fiyat"
          type="number"
      />

      <!-- PHONE -->
      <v-text-field
          v-if="step === CreateStep.PHONE"
          v-model="form.phoneNumber"
          label="Telefon"
          type="number"
      />

      <!-- CITY -->
      <v-select
          v-if="step === CreateStep.CITY"
          v-model="form.city"
          :items="cities"
          item-title="label"
          item-value="value"
          label="Şehir"
          required
      />

      <v-select
          v-if="step === CreateStep.DISTRICT"
          v-model="form.district"
          :items="districts"
          item-title="label"
          item-value="value"
          label="İlçe"
          :disabled="!form.city"
          required
      />

      <v-select
          v-if="step === CreateStep.NEIGHBORHOOD"
          v-model="form.neighborhood"
          :items="neighborhoods"
          item-title="label"
          item-value="value"
          label="Mahalle"
          :disabled="!form.district"
          :no-data-text="'Mahalle bulunamadı'"
          clearable
      />

      <div v-if="step === CreateStep.LOCATION">
        <p class="tw-text-sm tw-text-gray-600 tw-mb-2">
          Haritadan konum seçin
        </p>

        <div
            ref="mapRef"
            class="tw-w-full tw-h-[300px] tw-rounded-lg tw-border"
        ></div>

        <v-textarea
            class="tw-mt-4"
            label="Harita iframe (otomatik)"
            v-model="form.locationIframe"
            rows="4"
            readonly
        />
      </div>

      <!-- FEATURES -->
      <div v-if="step === CreateStep.FEATURES">

        <!-- ARSA -->
        <template v-if="form.type === 'Arsa'">
          <v-text-field v-model="arsaFeatures.islandNo" label="Ada No" />
          <v-text-field v-model="arsaFeatures.parcelNo" label="Parsel No" />
          <v-text-field
              v-model="arsaFeatures.plotMetreSquare"
              label="Metrekare"
              type="number"
          />
          <v-text-field
              v-model="arsaFeatures.plotMetreSquarePrice"
              label="m² Fiyatı"
              type="number"
          />

          <v-select
              v-model="arsaFeatures.zoningStatus"
              label="İmar Durumu"
              :items="[
              { title: 'Belirtilmemiş', value: null },
              { title: 'İmarlı', value: 'İmarlı' },
              { title: 'İmarsız', value: 'İmarsız' },
              { title: 'Konut', value: 'Konut' },
              { title: 'Ticari', value: 'Ticari' },
              { title: 'Tarla', value: 'Tarla' },
              { title: 'Zeytinlik', value: 'Zeytinlik' },
              { title: 'Villa', value: 'Villa' },
            ]"
              item-title="title"
              item-value="value"
          />

          <v-select
              v-model="form.titleDeedStatus"
              label="Tapu Durumu"
              :items="[
              { title: 'Belirtilmemiş', value: null },
              { title: 'Müstakil Parsel', value: 'Müstakil Parsel' },
              { title: 'Kat İrtifakı', value: 'Kat İrtifakı' },
              { title: 'Kat Mülkiyeti', value: 'Kat Mülkiyeti' },
              { title: 'Arsa', value: 'Arsa' },
              { title: 'Tarla', value: 'Tarla' },
              { title: 'Hisseli', value: 'Hisseli' },
              { title: 'Tahsis', value: 'Tahsis' },
              { title: 'İşyeri', value: 'İşyeri' },
            ]"
              item-title="title"
              item-value="value"
          />

          <v-select
              v-model="arsaFeatures.creditEligibility"
              label="Krediye Uygun"
              :items="[
              { title: 'Evet', value: 'Evet' },
              { title: 'Hayır', value: 'Hayır' },
            ]"
          />

          <v-select
              v-model="arsaFeatures.fromSale"
              label="Kimden"
              :items="['Sahibinden', 'Emlak Ofisinden']"
          />
        </template>


        <!-- DAİRE -->
        <template v-else>
          <!-- BRÜT -->
          <v-text-field
              v-model.number="daireFeatures.apartMetreSquareGross"
              label="m² (Brüt)"
              type="number"
          />

          <!-- NET -->
          <v-text-field
              v-model.number="daireFeatures.apartMetreSquareNet"
              label="m² (Net)"
              type="number"
          />

          <v-text-field
              v-model="daireFeatures.roomNumber"
              label="Oda Sayısı (3+1)"
          />

          <v-text-field
              v-model="daireFeatures.heatingType"
              label="Isıtma Tipi"
          />

          <v-text-field
              v-model.number="daireFeatures.numberFloors"
              label="Bina Kat"
              type="number"
          />

          <v-text-field
              v-model.number="daireFeatures.locatedFloor"
              label="Bulunduğu Kat"
              type="number"
          />

          <v-text-field
              v-model.number="daireFeatures.buildingAge"
              label="Bina Yaşı"
              type="number"
          />

          <v-select
              v-model="daireFeatures.kitchen"
              :items="kitchenOptions"
              item-title="title"
              item-value="value"
              label="Mutfak"
          />

          <v-select
              v-model="daireFeatures.balcony"
              :items="yesNoOptions"
              label="Balkon"
          />

          <v-select
              v-model="daireFeatures.elevator"
              :items="yesNoOptions"
              item-title="title"
              item-value="value"
              label="Asansör"
          />


          <v-select
              v-model="daireFeatures.furnished"
              :items="yesNoOptions"
              item-title="title"
              item-value="value"
              label="Eşyalı"
          />

          <v-select
              v-model="daireFeatures.withinSite"
              :items="yesNoOptions"
              item-title="title"
              item-value="value"
              label="Site İçinde"
          />

          <v-text-field
              v-model.number="daireFeatures.membershipFee"
              label="Aidat (TL)"
              type="number"
          />

          <v-select
              v-model="daireFeatures.creditEligibility"
              :items="['Evet', 'Hayır']"
              item-title="title"
              item-value="value"
              label="Krediye Uygun"
          />

          <v-select
            v-model="form.titleDeedStatus"
            label="Tapu Durumu"
            :items="[
              { title: 'Belirtilmemiş', value: null },
              { title: 'Müstakil Parsel', value: 'Müstakil Parsel' },
              { title: 'Kat İrtifakı', value: 'Kat İrtifakı' },
              { title: 'Kat Mülkiyeti', value: 'Kat Mülkiyeti' },
              { title: 'Arsa', value: 'Arsa' },
              { title: 'Tarla', value: 'Tarla' },
              { title: 'Hisseli', value: 'Hisseli' },
              { title: 'Tahsis', value: 'Tahsis' },
              { title: 'İşyeri', value: 'İşyeri' },
            ]"
            item-title="title"
            item-value="value"
          />

          <v-text-field
              v-model="daireFeatures.fromSale"
              label="Kimden"
          />

        </template>
      </div>

      <!-- IMAGES -->
      <v-file-input
          v-if="step === CreateStep.IMAGES"
          multiple
          accept="image/*"
          label="Görseller"
          v-model="images"
      />

      <div v-if="step === CreateStep.DETAIL">
        <label class="tw-block tw-mb-2 tw-font-medium">
          Detaylı Açıklama
        </label>
          <ClientQuill
              v-model="detailDescription"
              content-type="html"
              class="tw-bg-white"
          />
      </div>

      <!-- NAV BUTTONS (ALTTA & ORTALI) -->
      <div class="tw-flex tw-justify-center tw-gap-4 tw-mt-6 tw-mb-4">
        <v-btn
            variant="outlined"
            :disabled="step === CreateStep.ADVERTTYPE"
            @click="prevStep"
        >
          Önceki
        </v-btn>

        <v-btn
            color="primary"
            v-if="step < CreateStep.DETAIL"
            @click="nextStep"
        >
          Sonraki
        </v-btn>

        <v-btn
            color="success"
            v-if="step === CreateStep.DETAIL"
            @click="submit"
        >
          Kaydet
        </v-btn>
      </div>

    </v-card>
  </v-container>
</template>