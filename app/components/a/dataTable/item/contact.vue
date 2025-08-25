<script setup lang="ts">

interface Props {
  item: any
}

const props = defineProps<Props>()
toRefs(props)

</script>

<template>
  <template v-if="item.phone">
    <v-icon color="blue"  size="x-small">mdi-phone</v-icon> {{ item.phone }} <br>
  </template>

  <template v-if="item.address">
    <v-icon color="red-darken-3" size="x-small">mdi-map-marker</v-icon> {{ item.address }}
  </template>
</template>