import { ref, computed, watch } from 'vue'

export function useFormDialog<T extends Record<string, any>>(props: {
  action: string
  dataForm: Ref<Partial<T>>
  resourceName: string
}) {
  // const state = ref<Partial<T>>({ ...props.dataForm.value })

  // watch(
  //   () => props.dataForm,
  //   (newVal) => { state.value = { ...newVal } },
  //   { deep: true, immediate: true }
  // )

  const title = computed(() =>
    props.action === 'create'
      ? `new${props.resourceName.charAt(0).toUpperCase() + props.resourceName.slice(1)}`
      : `edit${props.resourceName.charAt(0).toUpperCase() + props.resourceName.slice(1)}`
  )
  const color = computed(() => (props.action === 'create' ? 'blue-darken-3' : 'warning'))

  return { title, color }
}