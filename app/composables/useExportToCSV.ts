import Papa from 'papaparse'

interface ExportOptions {
  data: Record<string, any>[]
  filename: string
}

export function useExportToCSV() {
  const exportData = (options: ExportOptions) => {
    if (!options.data || options.data.length === 0) {
      console.warn('No data to export.')
      return
    }

    const csv = Papa.unparse(options.data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${options.filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url) // Limpia la URL del objeto para liberar memoria
  }

  return { exportData }
}