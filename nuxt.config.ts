import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  build: {
    transpile: ['vuetify'],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@nuxt/icon',
    '@nuxt/image',
    '@sidebase/nuxt-auth',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  auth: {
    // baseURL: process.env.NUXT_AUTH_ORIGIN,
    isEnabled: true,
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        // signOut: false,
        // signUp: { path: '/registration', method: 'post' },
        getSession: { path: '/user', method: 'get' }
      },
      pages: {
        login: '/login',    // page where unauthorized user will be redirect if it will try to access protected page
      },
      token: {
        maxAgeInSeconds: 60 * 60 * 24,    // token expiration 1d
        signInResponseTokenPointer: '/token/accessToken',
      },
      sessionDataType: {
        id: 'string',
        email: 'string',
        role: 'string',
        permissions: 'array'
      },
    },
    globalAppMiddleware: true
  },

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    mongodbName: process.env.MONGODB_NAME,
    authSecret: process.env.NUXT_AUTH_SECRET,
    authOrigin: process.env.NUXT_AUTH_ORIGIN,
    brevoApiKey: process.env.BREVO_API_KEY,

    public: {
      clientLogo: process.env.CLIENT_LOGO,
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