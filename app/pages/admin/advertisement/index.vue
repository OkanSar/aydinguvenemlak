<script setup lang="ts">
import Swal from 'sweetalert2'

const search = ref('')
const loading = ref(false)
const adverts = ref<any[]>([])
const defaultImage = '/images/default-advert-image.jpg'

const fetchAdverts = async () => {
  loading.value = true
  try {
    const res: any = await $fetch('/api/advertisement')
    adverts.value = res.data ?? res
  } finally {
    loading.value = false
  }
}

onMounted(fetchAdverts)

const headers = [
  { title: '', key: 'image' },
  { title: 'İlan No', key: 'advertNo'},
  { title: 'Başlık', key: 'title'},
  { title: 'İlan Tipi', key: 'advertType' },
  { title: 'Fiyat', key: 'price' },
  { title: 'Şehir', key: 'city' },
  { title: 'Durum', key: 'status' },
  { title: 'İşlemler', key: 'actions', sortable: false },
]

const goEdit = (id: number) => {
  navigateTo(`/admin/advertisement/${id}`)
}

async function changeStatus(id: number, currentStatus: number) {
  const isActive = currentStatus === 0

  const result = await Swal.fire({
    title: isActive
        ? 'İlanı yayından almak mı istiyorsunuz?'
        : 'İlanı tekrardan yayına almak mı istiyorsunuz?',
    text: isActive
        ? 'Bu ilan yayından kaldırılacaktır.'
        : 'Bu ilan tekrar yayına alınacaktır.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Evet',
    cancelButtonText: 'Vazgeç',
    customClass: {
      confirmButton: 'tw-bg-green-700 tw-text-white tw-px-4 tw-rounded',
      cancelButton: 'tw-bg-red-800 tw-text-white tw-px-4 tw-rounded',
    },
  })

  if (!result.isConfirmed) return

  try {
    await $fetch(`/api/advertisement/${id}`, {
      method: 'PUT',
      body: {
        status: isActive ? 1 : 0,
      },
    })

    await fetchAdverts()

    await Swal.fire({
      icon: 'success',
      title: 'Başarılı',
      text: isActive
          ? 'İlan yayından kaldırıldı.'
          : 'İlan tekrar yayına alındı.',
      timer: 1500,
      showConfirmButton: false,
    })
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Hata!',
      text: 'İlan durumu güncellenemedi.',
    })
  }
}

async function goDelete(id: number) {
  const result = await Swal.fire({
    title: 'Emin misiniz?',
    text: 'Bu ilan kalıcı olarak silinecektir!',
    icon: 'warning',
    showCancelButton: true,
    customClass: {
      confirmButton: 'tw-bg-green-700 tw-text-white tw-px-4 tw-rounded',
      cancelButton: 'tw-bg-red-800 tw-text-white tw-px-4 tw-rounded',
    },
    confirmButtonText: 'Evet, sil',
    cancelButtonText: 'Vazgeç',
  })

  if (!result.isConfirmed) return

  try {
    await $fetch(`/api/advertisement/${id}`, {
      method: 'DELETE',
    })

    await fetchAdverts()

    await Swal.fire({
      icon: 'success',
      title: 'Silindi!',
      text: 'İlan başarıyla silindi.',
      timer: 1500,
      showConfirmButton: false,
    })
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Hata!',
      text: 'İlan silinirken bir hata oluştu.',
    })
  }
}
</script>

<template>
  <v-container fluid>
    <v-card class="tw-rounded-2xl">
      <v-card-title class="tw-flex tw-items-center tw-justify-between">
        <div class="tw-flex tw-justify-between">
          <div class="tw-flex tw-items-center tw-justify-between">
            <v-btn href="/admin" variant="text">
              <v-icon icon="mdi-arrow-left" />
            </v-btn>
            <h1 class="tw-text-lg sm:tw-text-xl tw-font-bold tw-text-gray-800">
              İlan Yönetimi
            </h1>
          </div>
          <v-btn
              size="sm"
              color="success"
              class="tw-text-sm tw-mb-1 tw-px-4"
              @click="navigateTo('/admin/advertisement/create')"
          >
            + Yeni İlan
          </v-btn>
        </div>
        <v-divider class="tw-mb-5" opacity="1"/>
      </v-card-title>

      <v-divider />
      <div class="tw-flex tw-justify-between">
        <v-text-field
            v-model="search"
            label="İlan no, ilan başlığı, fiyat, şehir ara"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            flat
            density="comfortable"
            hide-details
            single-line
        ></v-text-field>
      </div>
      <v-data-table
          :headers="headers"
          :items="adverts"
          no-data-text="Herhangi bir ilan bulunamadı."
          :loading="loading"
          item-key="id"
          class="tw-min-h-[580px] md:tw-min-h-[540px] md:tw-ml-4"
          :search="search"
          items-per-page="8"
          items-per-page-text="Sayfa Başına İlan Sayısı"
          :items-per-page-options="[8, 10, 20, {title:'Hepsi',value:1000}]"
      >
        <template #item.image="{ value }">
          <div class="tw-max-w-[150px]">
            <v-img
                :src="value ? `/api/advertisement/images/${value}` : undefined"
                cover
                width="125"
                height="100"
            >
              <template #error>
                <v-img
                    :src="defaultImage"
                    cover
                    width="125"
                    height="100"
                />
              </template>
            </v-img>
          </div>
        </template>

        <template #item.advertNo="{ value }">
          <div class="tw-w-[70px]">
            {{ value }}
          </div>
        </template>

        <template #item.title="{ value }">
          <div class="tw-max-w-[200px] tw-truncate">
            {{ value }}
          </div>
        </template>

        <template #item.advertType="{ value }">
          <div class="tw-w-[70px]">
            <v-chip size="small" :color="value === 0 ? 'orange' : 'blue'" variant="tonal">
              {{ value === 1 ? 'Kiralık' : 'Satılık' }}
            </v-chip>
          </div>
        </template>

        <template #item.price="{ value }">
          <div class="tw-w-[100px]">
            <strong>{{ value?.toLocaleString('tr-TR') }} TL</strong>
          </div>
        </template>

        <template #item.status="{ item, value }">
          <v-chip
              size="small"
              :color="value === 0 ? 'green' : 'grey'"
              variant="flat"
              class="tw-cursor-pointer"
              @click="changeStatus(item.id, value)"
          >
            {{ value === 0 ? 'Yayında' : 'Pasif' }}
          </v-chip>
        </template>


        <template #item.actions="{ item }">
          <div class="tw-flex tw-gap-2">
            <v-btn
                size="small"
                color="blue"
                variant="outlined"
                @click="goEdit(item.id)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
                size="small"
                color="red"
                variant="outlined"
                @click="goDelete(item.id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>

    </v-card>
  </v-container>
</template>