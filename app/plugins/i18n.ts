import { createI18n } from 'vue-i18n'
import enLang from '~~/i18n/locales/en-US'
import esLang from '~~/i18n/locales/es-ES'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'es',
    messages: {
      en: enLang,
      es: esLang
    }
  })

  vueApp.use(i18n)
})