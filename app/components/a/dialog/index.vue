<script setup lang="ts">

interface Props {
  isOpen: boolean
  type?: "info" | "success" | "warning" | "error" | undefined
  color?: string
  title?: string
  text?: string
}

interface Emits {
  (e: 'onClose'):void
}

const props = withDefaults( defineProps<Props>(), {
  isOpen: false,
  type: 'info',
  color: 'primary',
  isLoading: false
})

const emits = defineEmits<Emits>()

const { isOpen, type, color, title, text } = toRefs(props)

const close = () => {
  // clear()
  emits('onClose')
  // isLoading.value = false
}

</script>

<template>
  <v-dialog absolute
    transition="scroll-y-transition"
    width="auto"
    v-model="isOpen"
  >
    <v-card>
      
      <v-alert absolute
        variant="text"
        density="default"
        border="top"
        :type="type"
        :title="title"
        :text="text"
        >
      
        <!-- <v-btn variant="plain" color="light" block @click="close"
        >Close Dialog</v-btn> -->

        <template v-slot:[`prepend`]>
          <Icon size="3rem" name="line-md:close-circle" />
        </template>
      </v-alert>
      <template v-slot:actions>
        <v-btn variant="tonal" :color="type"
          text="Close Dialog"
          @click="close"
        ></v-btn>
      </template>
      <!-- <v-btn variant="text" color="info" block @click="close"
        >Close Dialog</v-btn> -->
    </v-card>
  </v-dialog>
</template>