<script setup lang="ts">

interface Props {
  item: any,
  value: any
}

const props = defineProps<Props>()
toRefs(props)

</script>

<template>
  <template v-if="item.createdBy">
    <!-- <v-icon color="blue"  size="x-small">mdi-account</v-icon> {{ item.createdBy.initials }} -->
    <v-chip rounded="pill" size="small" :color="value.color">
      {{ value.initials }}
      <v-tooltip activator="parent" location="end">
        <v-icon size="small" v-if="value.avatar"
          :color="value.color"
        >
          mdi-{{ value.avatar.icon }}
        </v-icon>
        {{ value.name }}
        <br>
        <!-- {{ item.createdAt }} -->
          created at: 
        <a-data-table-item-created-at :item="item" />
      </v-tooltip>
    </v-chip>
  </template>
</template>