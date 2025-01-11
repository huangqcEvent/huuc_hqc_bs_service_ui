<template>
  <div class="block">
    <el-carousel height="500px" motion-blur>
      <el-carousel-item v-for="item in images" :key="item.id">
        <img :src="item.src" alt="carousel image" class="carousel-image" />
      </el-carousel-item>
    </el-carousel>
    <div id="app">
      <GuideQuestions />
    </div>
  </div>
</template>

<script setup lang="ts" name="Home">
import { ref } from 'vue';
import GuideQuestions from '@/pages/user/ai/GuideQuestions.vue';

// 图片数据
const images = ref([
  { id: 1, src: 'https://www.huuc.edu.cn/images/logo.png' },
  { id: 2, src: 'https://www.huuc.edu.cn/images/logo.png' },
  { id: 3, src: 'https://www.huuc.edu.cn/images/logo.png' },
  { id: 4, src: 'https://www.huuc.edu.cn/images/logo.png' }
]);
</script>

<style scoped>
.carousel-image {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  /* 使图片覆盖整个轮播图区域 */
}

#app {
  margin-top: 20px !important; /* 添加一些间距，确保问答组件不被轮播图遮挡 */
}

.custom-prev-button,
.custom-next-button {
  position: absolute !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  background-color: rgba(0, 0, 0, 0.5) !important;
  color: white !important;
  border: none !important;
  padding: 10px 20px !important;
  cursor: pointer !important;
  z-index: 10 !important;
  font-size: 16px !important;
}

.custom-prev-button {
  left: 10px !important;
}

.custom-next-button {
  right: 10px !important;
}

.el-carousel__item h3 {
  color: #475669 !important;
  opacity: 0.75 !important;
  line-height: 200px !important;
  margin: 0 !important;
  text-align: center !important;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf !important;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6 !important;
}
</style>
