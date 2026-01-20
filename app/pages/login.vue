<script setup>
const email = ref('')
const password = ref('')
const loading = ref(false)

const emailError = ref('')
const passwordError = ref('')
const showPassword = ref(false)

const showCard = ref(false)
const shake = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    showCard.value = true
  })
})

const login = async () => {
  emailError.value = ''
  passwordError.value = ''

  if (!email.value) emailError.value = 'Email zorunlu'
  if (!password.value) passwordError.value = 'Şifre zorunlu'

  if (emailError.value || passwordError.value) {
    triggerShake()
    return
  }

  loading.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    })

    navigateTo('/admin')
  } catch {
    emailError.value = 'Email veya şifre hatalı'
    passwordError.value = 'Email veya şifre hatalı'
    triggerShake()
  } finally {
    loading.value = false
  }
}

const triggerShake = () => {
  shake.value = true
  setTimeout(() => (shake.value = false), 450)
}
</script>

<template>
  <v-container
      fluid
      class="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gradient-to-br tw-from-indigo-950 tw-via-blue-900 tw-to-indigo-900"
  >
    <v-scale-transition>
      <v-card
          v-if="showCard"
          elevation="24"
          rounded="xl"
          class="tw-w-full tw-max-w-md tw-p-8 tw-pb-10 tw-bg-white/90 tw-backdrop-blur-xl tw-transition-all tw-duration-300"
          :class="{ 'shake': shake }"
          @keyup.enter="login"
      >
        <!-- HEADER -->
        <div class="tw-text-center tw-mb-8 tw-mt-4">
          <v-icon size="42" color="primary" class="tw-mb-2">
            mdi-shield-lock
          </v-icon>

          <h1 class="tw-text-2xl tw-font-bold">
            Admin Giriş
          </h1>

          <p class="tw-text-sm tw-text-gray-500">
            Yetkili kullanıcılar içindir
          </p>
        </div>

        <!-- EMAIL -->
        <v-text-field
            v-model="email"
            label="Email"
            variant="outlined"
            prepend-inner-icon="mdi-email"
            :error="!!emailError"
            :error-messages="emailError"
            class="tw-mb-4"
        />

        <!-- PASSWORD -->
        <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Şifre"
            variant="outlined"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            :error="!!passwordError"
            :error-messages="passwordError"
            class="tw-mb-6"
        />

        <!-- BUTTON -->
        <v-btn
            block
            size="large"
            :loading="loading"
            class="login-btn tw-mt-2 tw-mb-6 tw-font-semibold tw-tracking-wide"
            @click="login"
        >
          Giriş Yap
        </v-btn>
      </v-card>
    </v-scale-transition>
  </v-container>
</template>

<style scoped>
@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
  100% { transform: translateX(0); }
}

.shake {
  animation: shake 0.45s ease;
}

.login-btn {
  background: linear-gradient(135deg, #4f46e5, #2563eb);
  color: white;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow:
      0 10px 25px rgba(37, 99, 235, 0.35),
      0 0 0 2px rgba(37, 99, 235, 0.15);
}

.login-btn:active {
  transform: translateY(0);
  box-shadow:
      0 6px 16px rgba(37, 99, 235, 0.3);
}
</style>
