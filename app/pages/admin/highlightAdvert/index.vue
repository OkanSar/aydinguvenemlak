<script setup lang="ts">
type HighlightItem = {
  id: number
  advertId: number
  title: string
  order: number
}

type Advert = {
  id: number
  title: string
}

const addDialog = ref(false)

const { data: advertsData } = await useFetch<Advert[]>(
    '/api/advertisement',
    { server: false }
)

const adverts = computed(() => advertsData.value ?? [])

const highlightedIds = computed(() =>
    new Set(items.value.map(i => i.advertId))
)

const addHighlight = async (advert: Advert) => {
  await $fetch('/api/highlightAdvert', {
    method: 'POST',
    body: {
      advertId: advert.id
    }
  })
  await refresh()
}

const { data, refresh } = await useFetch<HighlightItem[]>(
    '/api/highlightAdvert', {method: 'GET', server: false},
)
const items = computed(() => data.value?.result ?? [])
const move = async (from: number, to: number) => {
  if (!items.value.length) return
  if (to < 0 || to >= items.value.length) return

  const list = [...items.value]

  const temp = list[from]
  list[from] = list[to]
  list[to] = temp

  await $fetch('/api/highlightAdvert', {
    method: 'PUT',
    body: {
      items: list.map((item, index) => ({
        id: item.id,
        order: index + 1
      }))
    }
  })

  await refresh()
}

const removeItem = async (id: number) => {
  await $fetch(`/api/highlightAdvert/${id}`, {
    method: 'DELETE'
  })
  await refresh()
}
</script>

<template>
  <v-container class="tw-max-w-5xl tw-mx-auto">
    <!-- HEADER -->
    <div class="tw-max-w-7xl tw-mx-auto tw-px-4">
      <div class="tw-flex tw-items-center tw-justify-between">
        <div class="tw-flex tw-items-center tw-justify-between">
          <v-btn href="/admin" variant="text">
            <v-icon icon="mdi-arrow-left" />
          </v-btn>
          <h1 class="tw-text-lg sm:tw-text-xl tw-font-bold tw-text-gray-800">
            Öne Çıkan İlanlar
          </h1>
        </div>
        <v-btn
            color="success"
            variant="flat"
            size="small"
            @click="addDialog = true"
        >
          + Öne Çıkart
        </v-btn>
      </div>
    </div>
    <v-divider class="tw-mt-3 tw-mb-6" />
      <span class="tw-text-sm tw-text-gray-500">
        Toplam: {{ items.length }}
      </span>

    <!-- LIST -->
    <v-card
        elevation="0"
        class="tw-border tw-border-gray-200 tw-rounded-xl tw-overflow-hidden"
    >
      <div
          v-for="(item, index) in items"
          :key="item.id"
          class="tw-flex tw-items-center tw-justify-between
               tw-px-4 tw-py-3
               hover:tw-bg-gray-50
               tw-transition"
      >
        <!-- LEFT -->
        <div class="tw-flex tw-items-center tw-gap-4">
          <!-- ORDER BADGE -->
          <div
              class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center
                   tw-rounded-full tw-bg-gray-100
                   tw-text-sm tw-font-medium tw-text-gray-700"
          >
            {{ index + 1 }}
          </div>

          <!-- TITLE -->
          <div>
            <div class="tw-font-medium tw-text-gray-800">
              <a :href="`/advertisement/${item.advertId}`" class="tw-no-underline tw-text-black">
                {{ item.title }}
              </a>
            </div>
          </div>
        </div>

        <!-- ACTIONS -->
        <div class="tw-flex tw-items-center tw-gap-4">
          <v-btn
              icon
              variant="text"
              size="medium"
              :disabled="index === 0"
              @click="move(index, index - 1)"
              class="tw-ml-4"
          >
            ⬆
          </v-btn>

          <v-btn
              icon
              variant="text"
              size="medium"
              :disabled="index === items.length - 1"
              @click="move(index, index + 1)"
          >
            ⬇
          </v-btn>

          <v-divider vertical />

          <v-btn
              icon
              color="red"
              variant="text"
              size="small"
              @click="removeItem(item.id)"
          >
            🗑
          </v-btn>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div
          v-if="items.length === 0"
          class="tw-text-center tw-py-10 tw-text-gray-500"
      >
        Henüz öne çıkan ilan eklenmedi.
      </div>
    </v-card>
  </v-container>
  <v-dialog v-model="addDialog" max-width="700">
    <v-card>
      <v-card-title class="tw-flex tw-justify-between tw-items-center">
        <span class="tw-font-semibold">İlan Ekle</span>
        <v-btn icon variant="text" @click="addDialog = false">✖</v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="tw-max-h-[400px] tw-overflow-y-auto">
        <div
            v-for="advert in adverts"
            :key="advert.id"
            class="tw-flex tw-items-center tw-justify-between
               tw-py-2 tw-border-b tw-border-gray-100"
        >
        <span class="tw-text-gray-800 tw-max-w-[200px]
         sm:tw-max-w-[320px]
         md:tw-max-w-[420px]
         tw-truncate
         tw-block">
          {{ advert.title }}
        </span>

          <!-- DURUM -->
          <div>
            <v-btn
                v-if="!highlightedIds.has(advert.id)"
                size="small"
                color="primary"
                variant="flat"
                @click="addHighlight(advert)"
            >
              Ekle
            </v-btn>

            <div
                v-else
                class="tw-flex tw-items-center tw-gap-1 tw-text-green-600 tw-text-sm"
            >
              ✔ Öne Çıkarıldı
            </div>
          </div>
        </div>

        <div
            v-if="adverts.length === 0"
            class="tw-text-center tw-text-gray-500 tw-py-6"
        >
          İlan bulunamadı.
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
