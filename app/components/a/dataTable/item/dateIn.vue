<script setup lang="ts">

interface Props {
  item: any
}

const props = defineProps<Props>()
toRefs(props)

</script>

<template>
  <template v-if="item.dateIn">
    <!-- {{ useDateFormat(item.dateIn, 'YYYY-MM-DD').value }} -->
  </template>
</template>