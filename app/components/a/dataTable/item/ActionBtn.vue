<script setup lang="ts">

interface Props {
  item: object
  itemId: string
  text?: string
  icon?: string
  color?: string
  isLoading?: boolean
}

interface Emits {
  ( e: 'onAction' ):void
}

const props = withDefaults( defineProps<Props>(), {
  color: 'primary',
  isLoading: false
})

const emits = defineEmits<Emits>()

const { item, text, icon, color, isLoading } = toRefs(props)

const clickAction = () => {
  emits('onAction')
}

</script>

<template>
  <!-- @vue-expect-error -->
  <v-btn v-if="!(isLoading && itemId === item._id)" class="ml-1"
    size="dafault" density="compact" variant="tonal" :color
    :prepend-icon="icon"
    @click="clickAction"
  >
    <template v-slot:prepend>
      <v-icon></v-icon>  
    </template>
    {{ text }}
  </v-btn>
  <!-- @vue-expect-error -->
  <v-progress-circular v-if="isLoading && itemId === item._id" :indeterminate="isLoading"
    color="warning" size="small" :width="2"
  />
</template>