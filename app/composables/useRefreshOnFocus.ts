// ============================================================
// Refresco al enfocar la pestaña (fallback cuando el WS está apagado)
// ============================================================
export const useRefreshOnFocus = (refresh: () => void) => {
  const runConfig = useRuntimeConfig().public
  const wsEnabled = runConfig.enableWebSocket !== false

  const onFocus = () => {
    if (document.visibilityState === 'visible') {
      refresh()
    }
  }

  onMounted(() => {
    if (!wsEnabled) {
      document.addEventListener('visibilitychange', onFocus)
    }
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', onFocus)
  })
}
