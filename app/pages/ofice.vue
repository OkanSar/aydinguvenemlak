<template>
  <about-us-header title="Hakkımızda" description="
              Aydın Güven Emlak olarak sektördeki uzun yıllara dayanan
              tecrübemizle, güvenilir ve kaliteli hizmet anlayışını ön planda
              tutuyoruz. Müşterilerimizin ihtiyaçlarını doğru analiz ederek onlara
              en uygun çözümleri sunmayı hedefliyoruz." />

  <v-container class="tw-mt-20 tw-mb-20 tw-space-y-32">

    <!-- HAKKIMIZDA -->
    <div class="tw-space-y-14">
      <v-row>
        <!-- Fotoğraf -->
        <v-col cols="12" md="6">
          <v-img
              :src="emlakresim"
              class="tw-rounded-3xl tw-shadow-xl tw-h-full"
              height="420"
              cover
          />
        </v-col>

        <!-- Metin -->
        <v-col cols="12" md="6" class="tw-flex tw-items-center">
          <div class="tw-text-gray-600 tw-text-lg tw-leading-relaxed tw-px-4">
            <p class="tw-mb-6">
              20 yılı aşkın süredir emlak sektöründe edindiğimiz tecrübe ile bu yola çıktık. Uzun yıllar boyunca dürüstlük, güven ve doğru yönlendirme ilkeleriyle yüzlerce alım–satıma aracılık ettik. Akçay’da güvenilen bir aile olarak, her müşterimizi kendi yakınımız gibi görürüz. Amacımız sadece bir taşınmaz değil, gönül rahatlığıyla alınan doğru bir yaşam alanı sunmaktır.
            </p>
            <p>
              Akçay’da yıllardır bilinen, yurtdışına da hizmet veren ve güven duyulan bir emlakçıyız. Tecrübemizi samimiyetle birleştirerek, müşterilerimize en doğru çözümleri sunmayı hedefliyoruz. Sizin için sadece bir ilan değil, doğru kararı bulmak için buradayız.
            </p>
            <div class="tw-flex tw-flex-wrap tw-gap-3 tw-mt-10">
              <v-btn
                  color="#1F2F54FF"
                  variant="elevated"
                  class="tw-w-full sm:tw-w-auto"
                  href="https://www.google.com/maps/place/Akçay+Aydın+Güven+Emlak/@39.5864317,26.9256385,698m/data=!3m2!1e3!4b1!4m6!3m5!1s0x14b0b9d7798226eb:0x68332ced02d448af!8m2!3d39.5864317!4d26.9256385!16s%2Fg%2F11fslvv5pg"
                  target="_blank"
              >
                <v-icon class="mr-2">mdi-map-marker</v-icon>
                KONUMU GÖR
              </v-btn>

              <v-btn
                  href="tel:+905324132071"
                  color="#1F2F54FF"
                  variant="outlined"
                  class="tw-w-full sm:tw-w-auto"
              >
                <v-icon class="mr-2">mdi-phone</v-icon>
                İLETİŞİME GEÇ
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import AboutUsHeader from "~/components/AboutUsHeader.vue";
import emlakresim from '~~/public/images/aydin-guven-emlak-s.jpg'
const team = [
    {
      id:1,
      name: "Onur Yıldırım",
      position: "Gayrimenkul Uzmanı",
      social: {
        tel: "05111111111",
        email: "info@onryldrmgyrmnkl.com",
      }
    },{
      id:2,
      name: "Oğuz Yıldırım",
      position: "Gayrimenkul Uzmanı",
      social: {
        tel: "05111111111",
        email: "info@onryldrmgyrmnkl.com",
      }
    }]
</script>
