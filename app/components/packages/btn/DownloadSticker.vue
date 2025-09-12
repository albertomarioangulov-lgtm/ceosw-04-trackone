<script setup lang="ts">
import { ref } from 'vue'
// import 'pdfmake/build/vfs_fonts'
import pdfMake from 'pdfmake/build/pdfmake'
// import pdfMake from 'pdfmake'
import { DOMImplementation, XMLSerializer } from 'xmldom'
import JsBarcode from 'jsbarcode'
// import { logoB64 } from '~~/app/assets/functions'
// const image = logoB64()


interface Props {
  itemId: string
}

const props = defineProps<Props>()
const { itemId } = toRefs(props)

const isLoading = ref(false)

const downloadSticker = async (payload:any) => {
    isLoading.value = true

    const { getPackage } = usePackage()
    const packageId = payload
    const { data } = await getPackage(packageId)
    console.log('packageInfo: ', data.value);
    
    try {
      const packageInfo = data.value
      if (!packageInfo) {
        console.error('No se pudo obtener la información del paquete para generar el PDF.')
        // Aquí podrías mostrar una notificación al usuario.
        return
      }

      const text = packageInfo.wr.wrId + ' ' + packageInfo.label
      const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
      const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      JsBarcode(svgNode, text, {
        xmlDocument: document,
        height: 50,
        fontSize: 40,
        fontOptions: 'bold'
      });

      const docDefinition = {
        pageSize: {
          width: 430,
          height: 290
        },
        pageMargins: [ 30, 25, 25, 20 ],
        fontSize: 16,
        content: [
          {text: packageInfo.client.name, fontSize: 15, bold: true},
          {text: 'P.O. BOX ' + packageInfo.client.seller.seller_code + '-' + packageInfo.client.poboxid, fontSize: 14, bold: true},
          {text: packageInfo.client.country + ' ' + packageInfo.client.state + ' ' + packageInfo.client.city, fontSize: 14, bold: true},
          {text: packageInfo.client.address, fontSize: 14, bold: true},
          // '.',
          { svg : svgNode },
          {text: packageInfo.trkgNum, fontSize: 14, bold: true}
        ],
        footer: [
                // { svg : svgNode }
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
  <v-tooltip location="top" :text="$t('Download Sticker')">
    <template #activator="{ props: tooltipProps }">
      <v-btn v-bind="tooltipProps"
        variant="text"
        size="small"
        color="brown-darken-1"
        icon="mdi-sticker-text-outline"
        @click="downloadSticker(itemId)"
        :loading="isLoading" :disabled="isLoading"></v-btn>
    </template>
  </v-tooltip>
</template>