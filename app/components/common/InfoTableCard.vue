<script setup lang="ts">
defineProps<{
  title: string
  rows: { label: string, value: any, key: string }[]
}>()
</script>

<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <v-table density="compact">
        <tbody>
          <tr v-for="row in rows" :key="row.label">
            <td class="fit-content"><strong>{{ row.label }}:</strong></td>
            <td>
              <slot :name="row.key" :value="row.value">
                {{ row.value }}
              </slot>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.fit-content {
  width: 1%;
  white-space: nowrap;
}
</style>