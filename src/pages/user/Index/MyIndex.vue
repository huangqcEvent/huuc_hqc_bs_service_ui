<!-- ParentComponent.vue -->
<template>
  <div class="bestsellers-container">
    <ChartWordCloud :options="chartOptions" @word-click="handleWordClick" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ChartWordCloud from '@/common/ChartWordCloud.vue';
import { getWordCloud } from '@/api/user/ConfessionWallApi';

interface WordCloudItem {
  name: string;
  value: number;
  postId: string | number;
  postType: number | string;
}

const router = useRouter();
const chartOptions = ref({
  series: [{
    gridSize: 30,
    data: [] as Array<{ name: string; value: number; postId: string; postType: number }>,
  }]
});

const handleWordClick = (postId: string, postType: number) => {
  console.log('postId:', postId,'postType', postType);
  if(postType === 1){
    router.push({ name: 'CardDetail', params: { id: postId } });
  }else if (postType === 2){
    router.push(`/userIndex/lostItemDetail/${postId}`);
  }else if (postType === 3){
    router.push({ name: 'ClubDetail', params: { id:postId } });
  }
};

onMounted(() => {
  getWordCloud().then((res) => {
    if (res.data?.data?.length) {
      chartOptions.value.series = [{
        ...chartOptions.value.series[0],
        data: res.data.data.map((item: WordCloudItem) => ({
          name: item.name?.toString() || '',
          value: Number(item.value) || 0,
          postId: item.postId?.toString() || '',
          postType: Number(item.postType) || 0
        }))
      }];
    }
  }).catch((error) => {
    console.error('Failed to load word cloud data:', error);
  });
});
</script>

<style scoped lang="less">
.bestsellers-container {
  height: 18.56rem;
  background: #f0f0f0;
  width: 100%;

  #charts-content {
    width: 100%;
    height: 100%;
    min-height: 300px;
  }
}
</style>