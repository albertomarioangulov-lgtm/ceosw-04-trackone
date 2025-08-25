<script setup lang="ts">

interface Props {
  item: any
  format?: 'date' | 'dateTime'
}

const props = withDefaults( defineProps<Props>(), {
  format: 'date'
})
const { item, format } = toRefs(props)

const dateFormat = computed(() => {
  if (format.value === 'date') return 'YYYY-MM-DD'
  if (format.value === 'dateTime') return 'YYYY-MM-DD HH:mm'
})

</script>

<template>
  {{ useDateFormat(item.createdAt, dateFormat).value }}
  <!-- <NuxtTime :datetime="item.createdAt" locale="en-CA" /> -->
</template>