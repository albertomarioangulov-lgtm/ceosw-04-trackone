import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import { VColorInput } from 'vuetify/components/VColorInput'
import { VDateInput } from 'vuetify/components/VDateInput'

const variant = 'filled'
const density = 'compact'
const hideDetails ='auto'

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#FAFAFA',
    surface: '#ECEFF1', // blue-lighten-5
    'surface-bright': '#FFFFFF',
    'surface-light': '#CFD8DC', // blue-grey-lighten-4
    // 'surface-light': '#EEEEEE',
    'surface-variant': '#424242',
    'on-surface-variant': '#EEEEEE',
    primary: '#1867C0',
    'primary-darken-1': '#1F5592',
    secondary: '#48A9A6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
  variables: {
    'border-color': '#000000',
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.60,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': '#212529',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#F5F5F5',
    'theme-on-code': '#000000',
  }
}

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    blueprint: md3,
    components: {
      VColorInput, VDateInput
    },

    defaults: {
      VToolbar: { density },
      VDataTable: { density },
      VDataTableServer: { density },
      VTextField: { variant, density, hideDetails },
      VTextarea: { variant,  density, hideDetails },
      VColorInput: { variant,  density, hideDetails },
      VDateInput: { variant,  density, hideDetails },
      VAutocomplete: { variant, density, hideDetails },
      VCombobox: { variant, density, hideDetails },
    },

    theme: {
      defaultTheme: 'light',
      // defaultTheme: 'myCustomLightTheme',
      themes: {
        light: myCustomLightTheme,
      },
    }
  })
  app.vueApp.use(vuetify)

  // Load theme from cookie
  const themeCookie = useCookie<string>('theme')
  if (themeCookie.value) {
    vuetify.theme.global.name.value = themeCookie.value
  }
})
