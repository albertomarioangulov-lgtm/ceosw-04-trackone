<script setup lang="ts">
import { ref } from 'vue'
import 'pdfmake/build/vfs_fonts'
import pdfMake from 'pdfmake/build/pdfmake'
import { logoB64 } from '~~/app/assets/functions'
const image = logoB64()


interface Props {
  itemId: string
}

const props = defineProps<Props>()
const { itemId } = toRefs(props)

const isLoading = ref(false)

const downloadPDF = async (payload:any) => {
    isLoading.value = true

    const { getWR } = useWR()
    const wrId = payload
    const { data } = await getWR(wrId)
    console.log('wrData: ', data.value);
    
    try {
      // const wrData = await dispatch('getWRById', wrId)
      // const wrPackages = await dispatch('packages/getWRPackages', wrId, {root: true})
      const wrData = data.value
      if (!wrData) {
        console.error('No se pudo obtener la información del WR para generar el PDF.')
        // Aquí podrías mostrar una notificación al usuario.
        return
      }
      const wrPackages = data.value?.packages
      console.log('wrPackages: ', wrPackages);
      const packagesTable = []
      packagesTable.push([
        { text: 'BOX', bold: true, alignment: 'center' },
        { text: 'TRACKING NUMBER', bold: true, alignment: 'center' },
        { text: 'MEASURES', bold: true, alignment: 'center' },
        { text:'WEIGHT', bold: true, alignment: 'center' },
        { text:'WEIGHT (Kg)', bold: true, alignment: 'center' },
        { text:'VOL (FT)', bold: true, alignment: 'center' },
        { text:'VOL (Kgs)', bold: true, alignment: 'center' },
        { text:'DATE', bold: true, alignment: 'center' },
        { text:'NOTES', bold: true, alignment: 'center' }
      ])

      let totalWeight = 0
      let totalWeightKg = 0
      let totalVolKgs = 0
      let totalCft = 0
      if (Array.isArray(wrPackages)) {
        wrPackages.forEach(e => {
          if(!e.cr){
            const weightKg = (e.weight * 0.45359237).toFixed(2)
            const l = e.measures?.l ?? 0
            const w = e.measures?.w ?? 0
            const h = e.measures?.h ?? 0
            const cft = (l * w * h / 1728).toFixed(2)
            const volKgs = (l * w * h / 366).toFixed(2)
            totalWeight += Number.parseFloat(e.weight)
            totalWeightKg += Number.parseFloat(weightKg)
            totalCft += Number.parseFloat(cft)
            totalVolKgs += Number.parseFloat(volKgs)

            packagesTable.push([
              // e.pkgId,
              // e.wr.wrId + '-' + e.label,
              // wrData.wrId + '-' + e.label,
              `${wrData.wrId}-${e.label}`,
              e.trkgNum,
              // {text: e.measures.l ? e.measures.l : '' + (e.measures.h ? 'x' + e.measures.h : '') + (e.measures.w ? 'x' + e.measures.w : ''), alignment: 'center'},
              {
                text: (e.measures?.l != null || e.measures?.w != null || e.measures?.h != null)
                ? `${e.measures?.l ?? ''}x${e.measures?.w ?? ''}x${e.measures?.h ?? ''}`
                : '',
                alignment: 'center'
              },
              {text: e.weight, alignment: 'center'},
              {text: weightKg, alignment: 'center'},
              {text: cft, alignment: 'center'},
              {text: volKgs, alignment: 'center'},
              // formatDateTime(e.createdAt),
              useDateFormat(e.createdAt, 'YYYY-MM-DD').value,
              {text: e.notes, alignment: 'center'}
              // e.notes
            ])
          }
        });
      }

      packagesTable.push([
        '',
        // {text: 'TOTALS', alignment: 'center', bold: true},
        // '',
        // {text: totalWeight, alignment: 'center', bold: true},
        // {text: totalWeightKg.toFixed(2), alignment: 'center', bold: true},
        // {text: totalCft.toFixed(2), alignment: 'center', bold: true},
        // {text: totalVolKgs.toFixed(2), alignment: 'center', bold: true},
        {text: 'TOTALS', colSpan: 2, alignment: 'right', bold: true, margin: [0, 2, 4, 2]},
        {},
        {text: totalWeight.toFixed(2), alignment: 'center', bold: true, margin: [0, 2, 0, 2]},
        {text: totalWeightKg.toFixed(2), alignment: 'center', bold: true, margin: [0, 2, 0, 2]},
        {text: totalCft.toFixed(2), alignment: 'center', bold: true, margin: [0, 2, 0, 2]},
        {text: totalVolKgs.toFixed(2), alignment: 'center', bold: true, margin: [0, 2, 0, 2]},
        '','',
      ])

      // console.log('packagesTable: ', packagesTable);
      const docDefinition = {
        pageSize: 'LEGAL',
        pageMargins: [ 30, 92, 30, 60 ],
        header: [
          {
            fontSize: 8,
            margin: [30, 15, 30, 0],
            table: {
              widths: [150, '*', 130],
              body: [
                [
                  { image: image, width: 145, alignment: 'center', margin: [0, 6, 0, 0] },
                  { text: ['WAREHOUSE RECEIPT \n', 'WR No. '+ wrData.wrId], alignment: 'center', fontSize: 16, bold: true},
                  { text: 'COMPRAS Y ENVIOS ONLINE.COM\n7168 NW 50 STREET\nMIAMI, FLORIDA 33166\nTEL: 786-9706581', alignment: 'center'}
                ]
              ]
            },
            layout: 'noBorders'
          },
          {
            fontSize: 8,
            margin: [30, 5, 30, 50],
            table: {
              widths: ['auto', '*', 'auto', 'auto'],
              body: [
                [
                  {text: 'REMITENTE:', bold: true},
                  {text: wrData.client.name},
                  {text: 'FECHA:', bold: true, alignment: 'right'},
                  {text: useDateFormat(wrData.createdAt, 'YYYY-MM-DD').value, alignment: 'right'}
                ],
                [
                  {text: 'DESTINATARIO:', bold: true},
                  {text: wrData.client.name, colSpan: 3},
                  null, null
                ]
              ]
            },
            layout: 'noBorders'
          }
        ],
        // content: [
        //   {
        //     // layout: 'lightHorizontalLines',
        //     fontSize: 8,
        //     table: {
        //       //widths: ['auto', 'auto', 90, 'auto', 'auto', 50, '*'],
        //       widths: ['auto', 95, 'auto', 'auto', 'auto', 'auto', 'auto', 50, '*'],
        //       body: packagesTable
        //     }
        //   }
        // ],
        content: [
          {
            // layout: 'lightHorizontalLines',
            fontSize: 9,
            table: {
              //widths: ['auto', 'auto', 90, 'auto', 'auto', 50, '*'],
              widths: ['auto', 105, 'auto', 'auto', 30, 25, 25, 45, '*'],
              body: packagesTable
            },
            layout: {
              hLineWidth: () => 0.5,
              vLineWidth: (i, node) => (i === 0 || i === node.table.widths.length) ? 0.5 : 0,
              hLineColor: () => 'grey',
              vLineColor: () => 'grey',
              paddingTop: () => 2,
              paddingBottom: () => 2,
            },
          }
        ],
        footer: [
          {
            fontSize: 9,
            margin: [30, 5, 30, 0],
            italics: true,
            text: [
              '- El remitente declara que este env no contiene Dinero, joyas, valores, armas de fuego, explosivos, plantas, licor, obras de arte, animales o articulos restringidos por IATA\n',
              '- Please be advised that all cargo tendered by you (shipper or supplier) and by acepting and signing this receipt you are giving consen to search, inspect or screen cargo received by ComprasyEnviosOnline.com Corp, action required to comply with TSA Regulations'
            ]
          }
        ]
      }
      pdfMake.createPdf(docDefinition).open()
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }
</script>

<template>
  <v-tooltip location="top" :text="$t('Download WR PDF')">
    <template #activator="{ props: tooltipProps }">
      <v-btn v-bind="tooltipProps" color="red-darken-1" icon="mdi-file-download-outline" @click="downloadPDF(itemId)"
        :loading="isLoading" :disabled="isLoading"></v-btn>
    </template>
  </v-tooltip>
</template>