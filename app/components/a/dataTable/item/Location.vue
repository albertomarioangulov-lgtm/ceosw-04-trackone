<script setup lang="ts">

interface Props {
  item: any
}

const props = defineProps<Props>()
toRefs(props)

</script>

<template>
  <!-- <span v-if="item.zipCode"> -->
    <span class="font-weight-medium">{{ item.city }}</span> <br>
    <span class="font-weight-medium">{{ item.state }}</span>
    <span v-if="item.zipCode" class="font-italic">, {{ item.zipCode }}</span>
    <v-tooltip activator="parent" location="end">
      <span class="font-weight-medium">{{ item.city }}</span> <br>
      <span class="font-weight-medium">{{ item.state }}</span>
      <span v-if="item.zipCode" class="font-italic">, {{ item.zipCode }}</span>

      <template v-if="item.address">
        <br>
        <v-icon color="red-darken-3" size="x-small">mdi-map-marker</v-icon>
        {{ item.address }}
      </template>

      <template v-if="item.phone">
        <br>
        <v-icon color="blue" size="x-small">mdi-phone</v-icon>
        {{ item.phone }}
      </template>

    </v-tooltip>
  <!-- </span> -->
</template>