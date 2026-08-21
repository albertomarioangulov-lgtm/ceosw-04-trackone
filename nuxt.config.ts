import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      script: [
        // {
        //   src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.4/vfs_fonts.js',
        //   integrity: 'sha512-cktKDgjEiIkPVHYbn8bh/FEyYxmt4JDJJjOCu5/FQAkW4bc911XtKYValiyzBiJigjVEvrIAyQFEbRJZyDA1wQ==',
        //   crossorigin: 'anonymous', referrerpolicy: 'no-referrer'
        // },
      ]
    },
  },

  nitro: {
    experimental: {
      websocket: true,
    },
  },

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    plugins: [
      vuetify({ autoImport: true }),
    ],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  modules: [
    '@nuxt/icon',
    '@nuxt/image',
    'nuxt-auth-utils',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI_CEOSW,
    mongodbName: process.env.MONGODB_NAME,
    authSecret: process.env.NUXT_AUTH_SECRET,
    brevoApiKey: process.env.BREVO_API_KEY_CEOSW,

    public: {
      clientLogo: process.env.CLIENT_LOGO,
      // URL pública de la app para enlaces/imágenes en emails (ej. logo).
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
      // Desactivar en producción (App Hosting) con NUXT_PUBLIC_ENABLE_WS=false
      enableWebSocket: process.env.NUXT_PUBLIC_ENABLE_WS !== 'false',
    }
  },

  imports: {
    dirs: [
      'composables/*/*.{ts,js,mjs,mts}',
    ]
  },
  routeRules: {
    '/api/**': { cors: true }
  },
})
