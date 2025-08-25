<script setup lang="ts">

interface Props {
  item?: {any:any},
  value: any,
  density?: 'default'|'comfortable'|'compact'
}

const props = withDefaults( defineProps<Props>(),{
  density: 'default'
})
const { value } = toRefs(props)

const chipColor = computed(() => {
  // @ts-expect-error
return value.color
})

</script>

<template>
  <template v-if="value">
    <v-chip :density="density" rounded="pill" size="small" :color="value.color">
      {{ value.name }}
      <v-tooltip activator="parent" location="end">{{ value.name }}</v-tooltip>
    </v-chip>
  </template>
</template>