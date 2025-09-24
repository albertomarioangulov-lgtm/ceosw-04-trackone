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

    const { getCR } = useCR()
    const crId = payload
    const { data } = await getCR(crId)
    console.log('crData: ', data.value);
    
    try {
      // const wrData = await dispatch('getWRById', wrId)
      // const wrPackages = await dispatch('packages/getWRPackages', wrId, {root: true})
      const crData = data.value
      if (!crData) {
        console.error('No se pudo obtener la información del CR para generar el PDF.')
        // Aquí podrías mostrar una notificación al usuario.
        return
      }
      const crPackages = data.value?.packages
      console.log('crPackages: ', crPackages);
      const packagesTable = []
      packagesTable.push([
        //{text: 'ID', bold: true},
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
      if (Array.isArray(crPackages)) {
        crPackages.forEach(e => {
          if(e.cr){
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
              `${crData.wr.wrId}-${e.label}`,
              e.trkgNum,
              // {text: e.measures.l ? e.measures.l : '' + (e.measures.h ? 'x' + e.measures.h : '') + (e.measures.w ? 'x' + e.measures.w : ''), alignment: 'center'},
              {
                text: (l != null || w != null || h != null)
                  ? `${l ?? ''}x${w ?? ''}x${h ?? ''}`
                  : '',
                alignment: 'center'
              },
              {text: e.weight, alignment: 'center'},
              {text: weightKg, alignment: 'center'},
              {text: cft, alignment: 'center'},
              {text: volKgs, alignment: 'center'},
              // formatDateTime(e.createdAt),
              useDateFormat(e.createdAt, 'YYYY-MM-DD').value,
              e.notes
            ])
          }
        });
      }

      packagesTable.push([
        '',
        {text: 'TOTALS', alignment: 'center', bold: true},
        '',
        {text: totalWeight, alignment: 'center', bold: true},
        {text: totalWeightKg.toFixed(2), alignment: 'center', bold: true},
        {text: totalCft.toFixed(2), alignment: 'center', bold: true},
        {text: totalVolKgs.toFixed(2), alignment: 'center', bold: true},
        '','',
      ])

      console.log('packagesTable: ', packagesTable);
      const docDefinition = {
        pageSize: 'LEGAL',
        pageMargins: [ 30, 88, 30, 60 ],
        header: [
          {
            fontSize: 8,
            margin: [30, 15, 30, 0],
            table: {
              widths: [150, '*', 130],
              body: [
                [
                  { image: image, width: 145, alignment: 'center', margin: [0, 6, 0, 0] },
                  { text: ['CARGO RELEASE \n', 'CR No. '+ crData.crId], alignment: 'center', fontSize: 14},
                  { text: 'COMPRAS Y ENVIOS ONLINE.COM\n7168 NW 50 STREET\nMIAMI, FLORIDA 33166\nTEL: 786-9706581', alignment: 'center'}
                ]
              ]
            },
          },
          {
            fontSize: 8,
            margin: [30, 0, 30, 50],
            table: {
              widths: [60, '*', 130],
              body: [
                [
                  {text: 'REMITENTE:\nDESTINATARIO:', border: [true, false, true, true]},
                  {text: [crData.wr.client.name + '\n', crData.wr.client.name], border: [true, false, true, true]},
                  {text: useDateFormat(crData.createdAt, 'YYYY-MM-DD').value + '\n ', alignment: 'center', border: [true, false, true, true]}
                ]
              ]
            },
          }
        ],
        content: [
          {
            fontSize: 8,
            table: {
              //widths: ['auto', 'auto', 90, 'auto', 'auto', 50, '*'],
              widths: ['auto', 90, 'auto', 'auto', 'auto', 'auto', 'auto', 50, '*'],
              body: packagesTable
            }
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