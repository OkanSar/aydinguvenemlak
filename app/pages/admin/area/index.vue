<script setup lang="ts">
import Swal from 'sweetalert2'

const confirmDeleteAlert = async (title: string, text?: string) => {
  const result = await Swal.fire({
    title,
    text: text ?? 'Bu işlem geri alınamaz!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Evet, sil',
    cancelButtonText: 'Vazgeç',
    customClass: {
      confirmButton: 'tw-bg-green-700 tw-text-white tw-px-4 tw-rounded',
      cancelButton: 'tw-bg-red-800 tw-text-white tw-px-4 tw-rounded',
      container: 'swal-high-z',
    },
    zIndex: 3000,
  })

  return result.isConfirmed
}

const successAlert = (text: string) =>
    Swal.fire({
      icon: 'success',
      title: 'Başarılı',
      text,
      timer: 1200,
      showConfirmButton: false
    })

const { data, pending, refresh } = await useFetch('/api/area', {
  server: false
})

const search = ref('')
const normalizeText = (text: string) =>
    text
        .toLocaleLowerCase('tr-TR')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
const areas = computed(() => {
  if (!search.value) return data.value ?? []

  const q = normalizeText(search.value)

  return (
      data.value?.filter(area =>
          normalizeText(area.name).includes(q)
      ) ?? []
  )
})

/* ADD STATES */
/* ADD CITY DIALOG */
const addCityDialog = ref(false)

const newCity = ref({
  city: '',
  district: '',
  neighborhood: ''
})

const openAddCityDialog = () => {
  newCity.value = {
    city: '',
    district: '',
    neighborhood: ''
  }
  addCityDialog.value = true
}

const closeAddCityDialog = () => {
  addCityDialog.value = false
}

const addingDistrict = ref(false)

const newDistrictName = ref('')

const addingNeighborhood = ref<{
  districtId: number | null
  name: string
}>({
  districtId: null,
  name: ''
})

const startAddDistrict = () => {
  addingDistrict.value = true
  newDistrictName.value = ''
}

const cancelAddDistrict = () => {
  addingDistrict.value = false
  newDistrictName.value = ''
}

const startAddNeighborhood = (districtId: number) => {
  addingNeighborhood.value = {
    districtId,
    name: ''
  }
}

const cancelAddNeighborhood = () => {
  addingNeighborhood.value = {
    districtId: null,
    name: ''
  }
}

/* DIALOG */
const dialog = ref(false)
const selectedArea = ref<any>(null)
const editing = ref<{
  type: 'area' | 'district' | 'neighborhood' | null
  id: number | null
  parentId?: number | null
}>({
  type: null,
  id: null
})

const isEditing = (type: 'area' | 'district' | 'neighborhood', id: number) =>
    editing.value.type === type && editing.value.id === id

const startEdit = (type: 'area' | 'district' | 'neighborhood', id: number) => {
  editing.value = { type, id }
}

const stopEdit = () => {
  editing.value = { type: null, id: null }
}

const openEditDialog = (area: any) => {
  // deep copy (orijinali bozmamak için)
  selectedArea.value = JSON.parse(JSON.stringify(area))
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  selectedArea.value = null
  stopEdit()
}

const saveNewCity = async () => {
  if (!newCity.value.city.trim() || !newCity.value.district.trim()) {
    return
  }

  // 1️⃣ İl
  const city = await $fetch('/api/area/city', {
    method: 'POST',
    body: { name: newCity.value.city }
  })

  // 2️⃣ İlçe
  const district = await $fetch('/api/area/district', {
    method: 'POST',
    body: {
      name: newCity.value.district,
      areaId: city.id
    }
  })

  // 3️⃣ Mahalle (opsiyonel)
  if (newCity.value.neighborhood.trim()) {
    await $fetch('/api/area/neighborhood', {
      method: 'POST',
      body: {
        name: newCity.value.neighborhood,
        districtId: district.id
      }
    })
  }

  addCityDialog.value = false
  await refresh()
}
const deleteArea = async (id: number) => {
  const ok = await confirmDeleteAlert(
      'Bu il silinsin mi?',
      'İlçe ve mahalleler de silinecek.'
  )
  if (!ok) return

  await $fetch(`/api/area/city/${id}`, {
    method: 'DELETE'
  })

  dialog.value = false
  await refresh()
  successAlert('İl silindi')
}

const saveNewDistrict = async () => {
  if (!newDistrictName.value.trim()) return

  const newDistrict = await $fetch('/api/area/district', {
    method: 'POST',
    body: {
      name: newDistrictName.value,
      areaId: selectedArea.value.id
    }
  })

  selectedArea.value.districts.push({
    ...newDistrict,
    neighborhoods: []
  })

  cancelAddDistrict()
  stopEdit()
}
const deleteDistrict = async (districtId: number) => {
  const ok = await confirmDeleteAlert(
      'Bu ilçe silinsin mi?',
      'Bağlı mahalleler de silinecek.'
  )
  if (!ok) return

  await $fetch(`/api/area/district/${districtId}`, {
    method: 'DELETE'
  })

  selectedArea.value.districts =
      selectedArea.value.districts.filter(d => d.id !== districtId)

  successAlert('İlçe silindi')
}

const saveNewNeighborhood = async () => {
  if (!addingNeighborhood.value.districtId || !addingNeighborhood.value.name.trim()) return

  const newNeighborhood = await $fetch('/api/area/neighborhood', {
    method: 'POST',
    body: {
      name: addingNeighborhood.value.name,
      districtId: addingNeighborhood.value.districtId
    }
  })

  const district = selectedArea.value.districts.find(
      d => d.id === addingNeighborhood.value.districtId
  )

  district.neighborhoods.push(newNeighborhood)

  cancelAddNeighborhood()
  stopEdit()
}
const deleteNeighborhood = async (
    districtId: number,
    neighborhoodId: number
) => {
  const ok = await confirmDeleteAlert('Bu mahalle silinsin mi?')
  if (!ok) return

  await $fetch(`/api/area/neighborhood/${neighborhoodId}`, {
    method: 'DELETE'
  })

  const district = selectedArea.value.districts.find(d => d.id === districtId)
  district.neighborhoods =
      district.neighborhoods.filter(n => n.id !== neighborhoodId)

  successAlert('Mahalle silindi')
}

/* KAYDET */
const saveSingleEdit = async () => {
  if (!editing.value.type || !editing.value.id) return

  let payload
  let endpoint = ''

  if (editing.value.type === 'area') {
    payload = { name: selectedArea.value.name }
    endpoint = `/api/area/city/${editing.value.id}`
  }

  if (editing.value.type === 'district') {
    payload = selectedArea.value.districts.find(
        d => d.id === editing.value.id
    )
    endpoint = `/api/area/district/${editing.value.id}`
  }

  if (editing.value.type === 'neighborhood') {
    for (const d of selectedArea.value.districts) {
      const n = d.neighborhoods.find(n => n.id === editing.value.id)
      if (n) payload = n
    }
    endpoint = `/api/area/neighborhood/${editing.value.id}`
  }

  await $fetch(endpoint, {
    method: 'PUT',
    body: payload
  })

  stopEdit() // sadece edit modundan çıkar
}

const saveAllAndClose = async () => {
  if (!selectedArea.value) return

  await $fetch(`/api/area/city/${selectedArea.value.id}`, {
    method: 'PUT',
    body: selectedArea.value
  })

  dialog.value = false
  selectedArea.value = null
  stopEdit()
  await refresh()
}
</script>

<template>
  <v-container class="tw-max-w-6xl tw-mx-auto">
    <div class="tw-max-w-7xl tw-mx-auto tw-px-4">
      <div class="tw-flex tw-items-center tw-justify-between">
        <div class="tw-flex tw-items-center tw-justify-between">
          <v-btn href="/admin" variant="text">
            <v-icon icon="mdi-arrow-left" />
          </v-btn>
          <h1 class="tw-text-lg sm:tw-text-xl tw-font-bold tw-text-gray-800">
            Bölgeler
          </h1>
        </div>
        <v-btn size="small" color="success" @click="openAddCityDialog">
          + Yeni İl
        </v-btn>
      </div>
    </div>
    <v-divider class="tw-mt-3 tw-mb-6" />

    <!-- SEARCH -->
    <v-text-field
        v-model="search"
        label="İl ara"
        density="compact"
        class="tw-mb-4"
        prepend-inner-icon="mdi-magnify"
    />

    <!-- LOADING -->
    <v-skeleton-loader v-if="pending" type="article" />

    <!-- EMPTY -->
    <v-alert
        v-else-if="!areas.length"
        type="info"
        variant="tonal"
    >
      Kayıt bulunamadı.
    </v-alert>

    <!-- LIST -->
    <v-expansion-panels v-else multiple>
      <v-expansion-panel
          v-for="area in areas"
          :key="area.id"
          class="tw-border tw-rounded-xl tw-mb-2"
      >
        <!-- İL -->
        <v-expansion-panel-title>
          <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
            <span class="tw-font-semibold">
              🏙️ {{ area.name }}
            </span>

            <v-btn
                size="small"
                color="#27416b"
                variant="flat"
                @click.stop="openEditDialog(area)"
            >
              Düzenle
            </v-btn>
          </div>
        </v-expansion-panel-title>

        <!-- İLÇELER -->
        <v-expansion-panel-text>
          <div v-if="!area.districts?.length" class="tw-text-gray-500">
            İlçe yok
          </div>

          <div
              v-for="district in area.districts"
              :key="district.id"
              class="tw-ml-4 tw-mb-3"
          >
            <div class="tw-font-medium">
              🏘️ {{ district.name }}
            </div>

            <!-- MAHALLELER -->
            <div
                v-if="district.neighborhoods?.length"
                class="tw-ml-4 tw-mt-1 tw-text-sm tw-text-gray-600"
            >
              <div
                  v-for="neighborhood in district.neighborhoods"
                  :key="neighborhood.id"
              >
                • {{ neighborhood.name }}
              </div>
            </div>

            <div v-if="!district.neighborhoods.length"
                class="tw-ml-4 tw-text-sm tw-text-gray-400"
            >
              Mahalle yok
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
  <v-dialog v-model="dialog" max-width="700">
    <v-card class="tw-rounded-xl">
      <v-card-title class="tw-font-bold">
        Bölge Düzenle
      </v-card-title>

      <v-divider />

      <v-card-text v-if="selectedArea">
        <!-- İL -->
        <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
          <div class="tw-flex-1">
            <template v-if="isEditing('area', selectedArea.id)">
              <v-text-field
                  v-model="selectedArea.name"
                  density="compact"
                  hide-details
                  autofocus
              />
            </template>
            <template v-else>
      <span class="tw-font-bold tw-text-lg">
        🏙️ {{ selectedArea.name }}
      </span>
            </template>
          </div>
          <v-btn
              icon
              color="red"
              variant="text"
              @click="deleteArea(selectedArea.id)"
          >
            <v-icon icon="mdi-delete" />
          </v-btn>

          <v-btn
              icon
              variant="text"
              @click.stop="
              isEditing('area', selectedArea.id)
                ? saveSingleEdit()
                : startEdit('area', selectedArea.id)
            "
          >
            <v-icon
                :icon="
          isEditing('area', selectedArea.id)
            ? 'mdi-check'
            : 'mdi-pencil'
            "
            />
          </v-btn>
        </div>
        <div class="tw-flex tw-justify-end tw-mb-3">
          <v-btn
              size="small"
              color="success"
              variant="outlined"
              prepend-icon="mdi-plus"
              @click="startAddDistrict"
              v-if="!addingDistrict"
          >
            İlçe Ekle
          </v-btn>
        </div>

        <div v-if="addingDistrict" class="tw-flex tw-gap-2 tw-mb-4">
          <v-text-field
              v-model="newDistrictName"
              label="Yeni İlçe"
              density="compact"
              hide-details
          />
          <v-btn icon @click="saveNewDistrict">
            <v-icon icon="mdi-check" />
          </v-btn>
          <v-btn icon @click="cancelAddDistrict">
            <v-icon icon="mdi-close" />
          </v-btn>
        </div>

        <!-- İLÇELER -->
        <v-expansion-panels multiple>
          <v-expansion-panel
              v-for="district in selectedArea.districts"
              :key="district.id"
          >
            <!-- İLÇE BAŞLIK -->
            <v-expansion-panel-title>
              <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
                <div class="tw-flex-1">
                  <template v-if="isEditing('district', district.id)">
                    <v-text-field
                        v-model="district.name"
                        density="compact"
                        hide-details
                        autofocus
                    />
                  </template>
                  <template v-else>
                    🏘️ {{ district.name }}
                  </template>
                </div>

                <div class="tw-flex tw-items-center tw-gap-1">
                  <!-- MAHALLE EKLE -->
                  <v-btn
                      size="x-small"
                      icon
                      variant="text"
                      @click.stop="startAddNeighborhood(district.id)"
                      title="Mahalle Ekle"
                  >
                    <v-icon icon="mdi-plus" />
                  </v-btn>

                  <v-btn
                      size="x-small"
                      icon
                      color="red"
                      variant="text"
                      @click.stop="deleteDistrict(district.id)"
                  >
                    <v-icon icon="mdi-delete" />
                  </v-btn>

                  <!-- DÜZENLE -->
                  <v-btn
                      icon
                      variant="text"
                      @click.stop="
          isEditing('district', district.id)
            ? saveSingleEdit()
            : startEdit('district', district.id)
        "
                  >
                    <v-icon
                        :icon="
            isEditing('district', district.id)
              ? 'mdi-check'
              : 'mdi-pencil'
          "
                    />
                  </v-btn>
                </div>
              </div>
            </v-expansion-panel-title>

            <div v-if="!district.neighborhoods.length && addingNeighborhood.districtId !== district.id"
                class="tw-text-sm tw-text-gray-400 tw-ml-4 tw-flex tw-items-center tw-gap-2"
            >
              Mahalle yok
              <v-btn
                  size="x-small"
                  icon
                  variant="text"
                  @click="startAddNeighborhood(district.id)"
              >
                <v-icon icon="mdi-plus" />
              </v-btn>
            </div>

            <div
                v-if="addingNeighborhood.districtId === district.id"
                class="tw-flex tw-items-center tw-gap-2 tw-ml-4 tw-mt-2"
            >
              <v-text-field
                  v-model="addingNeighborhood.name"
                  label="Yeni Mahalle"
                  density="compact"
                  hide-details
              />
              <v-btn size="small" icon @click="saveNewNeighborhood">
                <v-icon size="small" icon="mdi-check" />
              </v-btn>
              <v-btn size="small" icon @click="cancelAddNeighborhood">
                <v-icon size="small" icon="mdi-close" />
              </v-btn>
            </div>

            <!-- MAHALLELER -->
            <v-expansion-panel-text>
              <div
                  v-for="neighborhood in district.neighborhoods"
                  :key="neighborhood.id"
                  class="tw-flex tw-items-center tw-justify-between tw-ml-4 tw-mb-2"
              >
                <div class="tw-flex-1">
                  <template v-if="isEditing('neighborhood', neighborhood.id)">
                    <v-text-field
                        v-model="neighborhood.name"
                        density="compact"
                        hide-details
                        autofocus
                    />
                  </template>
                  <template v-else>
                    • {{ neighborhood.name }}
                  </template>
                </div>

                <v-btn
                    icon
                    size="x-small"
                    color="red"
                    variant="text"
                    @click.stop="deleteNeighborhood(district.id, neighborhood.id)"
                >
                  <v-icon icon="mdi-delete" />
                </v-btn>

                <v-btn
                    icon
                    variant="text"
                    @click.stop="
            isEditing('neighborhood', neighborhood.id)
              ? saveSingleEdit()
              : startEdit('neighborhood', neighborhood.id)
          "
                >
                  <v-icon
                      :icon="
              isEditing('neighborhood', neighborhood.id)
                ? 'mdi-check'
                : 'mdi-pencil'
            "
                  />
                </v-btn>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>

      <v-divider />

      <v-card-actions class="tw-justify-end">
        <v-btn variant="text" @click="closeDialog">
          Vazgeç
        </v-btn>
        <v-btn color="primary" @click="saveAllAndClose">
          Kaydet
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="addCityDialog" max-width="500">
    <v-card class="tw-rounded-xl">
      <v-card-title class="tw-font-bold">
        Yeni Bölge Ekle
      </v-card-title>

      <v-divider />

      <v-card-text class="tw-flex tw-flex-col tw-gap-4">
        <v-text-field
            v-model="newCity.city"
            label="İl"
            density="compact"
            required
        />

        <v-text-field
            v-model="newCity.district"
            label="İlçe"
            density="compact"
            required
        />

        <v-text-field
            v-model="newCity.neighborhood"
            label="Mahalle (Opsiyonel)"
            density="compact"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions class="tw-justify-end">
        <v-btn variant="text" @click="closeAddCityDialog">
          Vazgeç
        </v-btn>
        <v-btn color="primary" @click="saveNewCity">
          Kaydet
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style>
.swal-high-z {
  z-index: 9999 !important;
}
</style>