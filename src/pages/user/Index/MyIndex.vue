<template>
  <div class="bestsellers-container">
    <chart-word-cloud :options="state.chartOptions"></chart-word-cloud>
  </div>
</template>

<script setup lang="ts">
import ChartWordCloud from '@/common/ChartWordCloud.vue';

import { onMounted, reactive } from 'vue'

const state = reactive({
  chartOptions: {
    series: [
      {
        gridSize: 20,
        data: [
          {
            name: '0',
            value: 30,
            textStyle: {
              color: 'rgba(0, 0, 0, 0.4)',
            },
          },
          { name: '1', value: 30 },
          { name: '2', value: 28 },
          { name: '3', value: 28 },
          { name: '4', value: 25 },
          { name: '5', value: 23 },
          { name: '6', value: 20 },
          { name: '7', value: 18 },
          { name: '8', value: 15 },
          { name: '9', value: 25 },
          { name: '10', value: 35 },
          { name: "11", value: 40 },
          { name: '1', value: 30 },
          { name: '2', value: 28 },
          { name: '3', value: 28 },
          { name: '4', value: 25 },
          { name: '5', value: 23 },
          { name: '6', value: 20 },
          { name: '7', value: 18 },
          { name: '8', value: 15 },
          { name: '9', value: 25 },
          { name: '10', value: 35 },
          { name: "11", value: 40 },
          { name: '1', value: 30 },
          { name: '2', value: 28 },
          { name: '3', value: 28 },
          { name: '4', value: 25 },
          { name: '5', value: 23 },
          { name: '6', value: 20 },
          { name: '7', value: 18 },
          { name: '8', value: 15 },
          { name: '9', value: 25 },
          { name: '10', value: 35 },
          { name: "11", value: 40 },
          { name: '1', value: 30 },
          { name: '2', value: 28 },
          { name: '3', value: 28 },
          { name: '4', value: 25 },
          { name: '5', value: 23 },
          { name: '6', value: 20 },
          { name: '7', value: 18 },
          { name: '8', value: 15 },
          { name: '9', value: 25 },
          { name: '10', value: 35 },
          { name: "11", value: 40 },
          { name: '1', value: 30 },
          { name: '2', value: 28 },
          { name: '3', value: 28 },
          { name: '4', value: 25 },
          { name: '5', value: 23 },
          { name: '6', value: 20 },
          { name: '7', value: 18 },
          { name: '8', value: 15 },
          { name: '9', value: 25 },
          { name: '10', value: 35 },
          { name: "11", value: 40 },
          { name: '1', value: 30 },
          { name: '2', value: 28 },
          { name: '3', value: 28 },
          { name: '4', value: 25 },
          { name: '5', value: 23 },
          { name: '6', value: 20 },
          { name: '7', value: 18 },
          { name: '8', value: 15 },
          { name: '9', value: 25 },
          { name: '10', value: 35 },
          { name: "11", value: 40 },
          { name: '1', value: 30 },
          { name: '2', value: 28 },
          { name: '3', value: 28 },
          { name: '4', value: 25 },
          { name: '5', value: 23 },
          { name: '6', value: 20 },
          { name: '7', value: 18 },
          { name: '8', value: 15 },
          { name: '9', value: 25 },
          { name: '10', value: 35 },
          { name: "11", value: 40 },
          { name: '1', value: 30 },
          { name: '2', value: 28 },
          { name: '3', value: 28 },
          { name: '4', value: 25 },
          { name: '5', value: 23 },
          { name: '6', value: 20 },
          { name: '7', value: 18 },
          { name: '8', value: 15 },
          { name: '9', value: 25 },
          { name: '10', value: 35 },
          { name: "11", value: 40 }
        ],
      },
    ],
  },
})

onMounted(() => { })
</script>

<style scoped lang="less">
.bestsellers-container {
  height: 18.56rem;
  background: #f0f0f0;

  #charts-content {
    /* 需要设置宽高后才会显示 */
    width: 100%;
    height: 100%;
  }
}
</style>