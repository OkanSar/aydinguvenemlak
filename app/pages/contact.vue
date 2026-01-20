<template>
  <!-- ÜST BAŞLIK -->
  <about-us-header
      title="İletişim"
      description="Bizimle dilediğiniz zaman iletişime geçebilir, ofisimizi ziyaret edebilir
    veya konumumuzu harita üzerinden kolayca bulabilirsiniz."
  />

  <v-container class="tw-mt-20 tw-mb-20 tw-space-y-24">

    <v-row class="tw-items-stretch">
      <!-- SOL: İLETİŞİM BİLGİLERİ -->
      <v-col cols="12" md="5">
        <div class="tw-bg-white tw-rounded-3xl tw-shadow-xl tw-p-10 tw-h-full">
          <h2 class="tw-text-2xl tw-font-semibold tw-mb-8 tw-text-[#1F2F54FF]">
            Bize Ulaşın
          </h2>

          <div class="tw-space-y-6 tw-text-gray-700">
            <!-- Adres -->
            <div class="tw-flex tw-gap-4">
              <v-icon size="28" color="#1F2F54FF">mdi-map-marker</v-icon>
              <p>
                Akçay, Cumhuriyet Blv. no:33/C, 10300
                <br />
                Edremit / Balıkesir
              </p>
            </div>

            <!-- Telefon -->
            <div class="tw-flex tw-gap-4">
              <v-icon size="28" color="#1F2F54FF">mdi-phone</v-icon>
              <a
                  href="tel:+905324132071"
                  class="hover:tw-text-[#1F2F54FF] tw-text-black tw-no-underline"
              >
                +90 532 413 2071
              </a>
            </div>

            <div class="tw-flex tw-gap-4">
              <v-icon size="28" color="#1F2F54FF">mdi-whatsapp</v-icon>
              <a
                  href="https://wa.me/905324132071?text=Merhabalar%2C%20ilan%20i%C3%A7in%20bilgi%20al%C4%B1cakt%C4%B1m."
                  target="_blank"
                  class="hover:tw-text-[#1F2F54FF] tw-text-black tw-no-underline"
              >
                Bilgi Al
              </a>
            </div>

            <!-- Mail -->
            <div class="tw-flex tw-gap-4">
              <v-icon size="28" color="#1F2F54FF">mdi-email</v-icon>
              <a
                  href="mailto:aaydinguvenemlak@gmail.com"
                  class="hover:tw-text-[#1F2F54FF] tw-text-black tw-no-underline"
              >
                aaydinguvenemlak@gmail.com
              </a>
            </div>
          </div>

          <!-- BUTONLAR -->
          <div class="tw-flex tw-flex-wrap tw-gap-4 tw-mt-10">
            <v-btn
                color="#1F2F54FF"
                variant="elevated"
                href="https://www.google.com/maps/place/Ak%C3%A7ay+Ayd%C4%B1n+G%C3%BCven+Emlak/@39.5863775,26.9255096,293m/data=!3m1!1e3!4m6!3m5!1s0x14b0b9d7798226eb:0x68332ced02d448af!8m2!3d39.5864317!4d26.9256385!16s%2Fg%2F11fslvv5pg?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                class="tw-w-full sm:tw-w-auto"
            >
              <v-icon class="mr-2">mdi-map</v-icon>
              HARİTADA GÖR
            </v-btn>
          </div>
        </div>
      </v-col>

      <!-- SAĞ: GOOGLE MAPS -->
      <v-col cols="12" md="7">
        <div class="tw-rounded-3xl tw-shadow-xl tw-overflow-hidden tw-h-full tw-min-h-[400px]">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d537.1852730763184!2d26.925372849660295!3d39.58639297097466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b0b9d7798226eb%3A0x68332ced02d448af!2zQWvDp2F5IEF5ZMSxbiBHw7x2ZW4gRW1sYWs!5e1!3m2!1str!2str!4v1768569085399!5m2!1str!2str" width="100%"
                  height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import AboutUsHeader from "~/components/AboutUsHeader.vue";
</script>
