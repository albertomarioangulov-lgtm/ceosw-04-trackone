export const loadPdfMake = async () => {
  // Cargar pdfmake y fuentes dinámicamente (cliente)
  const pdfModule = await import('pdfmake/build/pdfmake')
  const pdfFontsModule = await import('pdfmake/build/vfs_fonts')
  const pdfMakeLib = (pdfModule as any).default || pdfModule
  const fontsVfs = (pdfFontsModule as any).pdfMake?.vfs || (pdfFontsModule as any).vfs || (pdfFontsModule as any).default?.vfs
  ;(pdfMakeLib as any).vfs = (pdfMakeLib as any).vfs || fontsVfs || {}

  // Asegurar mapping de la fuente Roboto (evita errores si falta la entrada)
  if (!(pdfMakeLib as any).fonts || !((pdfMakeLib as any).fonts as any).Roboto) {
    ;(pdfMakeLib as any).fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-Italic.ttf',
      },
    }
  }

  // Verificación rápida: si falta Roboto-Medium.ttf en vfs, registramos advertencia
  const available = Object.keys((pdfMakeLib as any).vfs || {})
  if (!available.includes('Roboto-Medium.ttf')) {
    console.warn('pdfMake vfs missing Roboto-Medium.ttf; available vfs keys (sample):', available.slice(0, 10))
  }

  return pdfMakeLib
}
