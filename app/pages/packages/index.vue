<script setup lang="ts">
import { useI18n } from 'vue-i18n';

  definePageMeta({
    middleware: 'auth'
  })

  const { t } = useI18n()

  const pageName = 'packages'
  const pageTitle = t(`${ pageName }`)
  const isLoading = ref(true)

  const items = [
    { title: t('home'), to: '/' },
    { title: pageTitle, to: `/${ pageName }` }
  ]

  onMounted(() => {
    setTimeout(() => {
      isLoading.value = false
    }, 1000)
  })
</script>

<template>
  <v-container class="pt-0 pl-0 pr-0" fluid>
    
    <!-- Toolbar -->
    <v-toolbar flat color="transparent">
      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      
      <!-- Breadcrumb -->
      <v-breadcrumbs :items="items"/>
      
    </v-toolbar>
    
    <PackagesList />

  </v-container>
</template>
