<!-- ChartWordCloud.vue -->
<template>
  <div id="charts-content" style="width: 100%; height: 100%; min-height: 300px"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import { onMounted, watch, nextTick, onUnmounted } from "vue";
import { merge } from 'lodash-es';

const emit = defineEmits(['word-click']);

const props = withDefaults(
    defineProps<{
      options: any;
    }>(),
    {}
);

const defaultSeries = [
  {
    type: 'wordCloud',
    shape: 'circle',
    keepAspect: false,
    left: 'center',
    top: 'center',
    width: '100%',
    height: '100%',
    sizeRange: [12, 60],
    rotationRange: [-90, 90],
    rotationStep: 45,
    gridSize: 8,
    drawOutOfBound: false,
    layoutAnimation: true,
    textStyle: {
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      color: () => {
        return `rgb(${[
          Math.round(Math.random() * 160),
          Math.round(Math.random() * 160),
          Math.round(Math.random() * 160),
        ].join(',')})`;
      },
    },
    emphasis: {
      focus: 'self',
      textStyle: {
        textShadowBlur: 10,
        textShadowColor: '#999',
      },
    },
    data: [] as Array<{ name: string; value: number; postId: string; postType: number }>,
  },
];

let myChart: echarts.ECharts | null = null;

const handleResize = () => {
  myChart?.resize();
};

function DrawWordCloud() {
  nextTick(() => {
    const container = document.getElementById('charts-content');
    if (!container) return;

    if (myChart) {
      myChart.dispose();
      window.removeEventListener('resize', handleResize);
    }

    myChart = echarts.init(container);
    window.addEventListener('resize', handleResize);

    const userSeries = props.options?.series?.[0] || {};
    const mergedSeries = merge({}, defaultSeries[0], userSeries);

    if (!mergedSeries.data) mergedSeries.data = [];

    myChart.setOption({
      series: mergedSeries,
      tooltip: {
        show: false,
        formatter: (params: any) => {
          return `${params.name}: ${params.value}`;
        },
      },
    });

    myChart.on('click', (params: any) => {
      if (params.componentType === 'series' && params.data) {
        const { postId, postType } = params.data;
        if (
            typeof postId !== 'undefined' &&
            typeof postType !== 'undefined' &&
            !isNaN(Number(postType))
        ) {
          emit('word-click', String(postId), Number(postType));
        }
      }
    });
  });
}

watch(
    () => props.options,
    () => DrawWordCloud(),
    { deep: true }
);

onMounted(DrawWordCloud);

onUnmounted(() => {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
  window.removeEventListener('resize', handleResize);
});
</script>