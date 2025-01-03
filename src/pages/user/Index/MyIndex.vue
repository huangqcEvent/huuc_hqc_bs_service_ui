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
                name: '温柔宝宝',
                value: 30,
                // textStyle: {
                //   color: 'rgba(0, 0, 0, .4)',
                // },
              },
              {name: '王巧巧',value: 30},
              { name: '暴走小妮儿', value: 28 },
              { name: '邋遢小妮儿', value: 28 },
              { name: '马铃薯', value: 25 },
              { name: "土拨鼠", value: 23 },
              { name: '粗鲁美羊羊', value: 20 },
              { name: '巧巧大王', value: 18 },
              { name: '大大怪将军', value: 15 },
              { name: '可可爱爱', value: 25 },
              { name: '大美女', value: 35 },
              { name: "我的公主", value: 40 }
            ],
          },
        ],
      },
    })
   
    onMounted(() => {})
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