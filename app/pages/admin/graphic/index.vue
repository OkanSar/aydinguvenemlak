<script setup lang="ts">
const today = new Date().toISOString().slice(0, 10)
const start = ref('2026-01-01')
const end = ref(today)
const isFiltered = ref(false)

const { data, refresh } = await useFetch('/api/graphic', {
  query: { start, end }
})

const series = computed(() => [
  {
    name: 'Görüntülenme',
    data: data.value?.data ?? []
  }
])

const applyFilter = async () => {
  isFiltered.value = true
  await refresh()
}

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  colors: ['#6366F1'], // indigo-500 vibe
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: series.value[0].data.length === 1 ? 0 : 3
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.05
    }
  },
  xaxis: {
    categories: data.value?.labels ?? [],
    labels: {
      formatter: (value: string) => formatShortDateTR(value),
      style: {
        colors: '#6B7280',
        fontSize: '12px'
      }
    }
  },
  markers: {
    size: series.value[0].data.length === 1 ? 6 : 0,
    strokeWidth: 2,
    strokeColors: '#6366F1',
    hover: {
      size: 8
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: '#6B7280'
      }
    }
  },
  tooltip: {
    theme: 'light'
  },
  grid: {
    borderColor: '#E5E7EB',
    strokeDashArray: 4
  },
}))

const summary = computed(() => {
  const values = data.value?.data ?? []
  const labels = data.value?.labels ?? []

  if (!values.length) return null

  // 🔹 SADECE 1 NOKTA VARSA
  if (values.length === 1) {
    return {
      single: true,
      value: values[0],
      date: labels[0],
      isFiltered: isFiltered.value
    }
  }

  const first = values[0]
  const last = values[values.length - 1]

  if (first === 0) return null

  const diff = last - first
  const percent = Math.round((diff / first) * 100)

  return {
    single: false,
    percent,
    trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'same',
    days: values.length,
    range: {
      start: labels[0],
      end: labels[labels.length - 1]
    },
    isFiltered: isFiltered.value
  }
})

const formatDateTR = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatShortDateTR = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: '2-digit'
  })
}

watch(end, (val) => {
  if (val > today) end.value = today
  if (val < start.value) end.value = start.value
})

watch(start, (val) => {
  if (val > end.value) start.value = end.value
})
</script>

<template>
  <v-container class="tw-max-w-5xl tw-mx-auto">
    <div class="tw-max-w-7xl tw-mx-auto tw-px-4">
      <div class="tw-flex tw-items-center tw-justify-between">
        <div class="tw-flex tw-items-center tw-justify-between">
          <v-btn href="/admin" variant="text">
            <v-icon icon="mdi-arrow-left" />
          </v-btn>
          <h1 class="tw-text-lg sm:tw-text-xl tw-font-bold tw-text-gray-800">
            İlan Görüntülenmeleri
          </h1>
        </div>
      </div>
    </div>
    <v-divider class="tw-mt-3 tw-mb-6" />
    <v-card class="tw-p-5 tw-mt-4 tw-rounded-xl tw-border">
      <!-- FILTER -->
      <div class="tw-flex tw-flex-wrap tw-gap-3 tw-mb-6">
        <v-text-field
            v-model="start"
            type="date"
            label="Başlangıç"
            density="compact"
            :max="end"
        />

        <v-text-field
            v-model="end"
            type="date"
            label="Bitiş"
            density="compact"
            :min="start"
            :max="today"
        />
      </div>

      <!-- CHART -->
      <ClientOnly>
        <apexchart
            v-if="series[0].data.length"
            height="320"
            type="area"
            :options="chartOptions"
            :series="series"
        />
      </ClientOnly>

      <div
          v-if="!series[0].data.length"
          class="tw-text-center tw-text-gray-500 tw-pt-10"
      >
        Veri bulunamadı
      </div>

      <!-- SUMMARY -->
      <div
          v-if="summary"
          class="tw-mt-4 tw-text-sm tw-flex tw-items-center tw-gap-2"
      >
        <!-- TEK NOKTA -->
        <template v-if="summary?.single">
  <span class="tw-text-gray-600">
    📍 {{ formatDateTR(summary.date) }} tarihinde
    toplam {{ summary.value }} görüntülenme oldu.
  </span>
        </template>

        <!-- FİLTRELİ -->
        <template v-if="summary.isFiltered">
    <span
        v-if="summary.trend === 'up'"
        class="tw-text-green-600 tw-font-medium"
    >
      📈 {{ formatDateTR(summary.range.start) }} –
      {{ formatDateTR(summary.range.end) }} arası
      görüntülenme sayısı %{{ summary.percent }} arttı.
    </span>

          <span
              v-else-if="summary.trend === 'down'"
              class="tw-text-red-600 tw-font-medium"
          >
      📉 {{ formatDateTR(summary.range.start) }} –
      {{ formatDateTR(summary.range.end) }} arası
      görüntülenme sayısı %{{ Math.abs(summary.percent) }} azaldı.
    </span>

          <span
              v-else
              class="tw-text-gray-500"
          >
      ➖ {{ formatDateTR(summary.range.start) }} –
      {{ formatDateTR(summary.range.end) }} arası
      görüntülenme sayısı değişmedi.
    </span>
        </template>

        <!-- İLK YÜKLEME -->
        <template v-else>
    <span
        v-if="summary.trend === 'up'"
        class="tw-text-green-600 tw-font-medium"
    >
      📊 Son {{ summary.days }} gün içinde
      görüntülenme sayısı %{{ summary.percent }} artış gösterdi.
    </span>

          <span
              v-else-if="summary.trend === 'down'"
              class="tw-text-red-600 tw-font-medium"
          >
      📊 Son {{ summary.days }} gün içinde
      görüntülenme sayısı %{{ Math.abs(summary.percent) }} düşüş gösterdi.
    </span>

          <span
              v-else
              class="tw-text-gray-500"
          >
      📊 Son {{ summary.days }} gün içinde
      görüntülenme sayısı değişmedi.
    </span>
        </template>
      </div>
    </v-card>

  </v-container>
</template>
