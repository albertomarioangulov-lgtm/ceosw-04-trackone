<script setup lang="ts">
interface Props {
  title: string
  stats: number | string
  icon: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
})
</script>

<template>
  <v-card class="mt-4">
    <v-card-text class="d-flex align-center">
      <v-avatar :color="color" size="44" rounded>
        <v-icon :icon="icon" size="28" color="white" />
      </v-avatar>

      <div class="ml-4">
        <p class="text-body-2 my-0 mb-0">
          {{ title }}
        </p>
        <h5 class="my-0 text-headline-small font-weight-bold">{{ stats }}</h5>
      </div>
    </v-card-text>
  </v-card>
</template>

