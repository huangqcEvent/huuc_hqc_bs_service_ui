<template>
  <div class="block text-center">
    <el-carousel height="500px" motion-blur>
      <el-carousel-item v-for="item in images" :key="item.id">
        <img :src="item.src" alt="carousel image" class="carousel-image" />
      </el-carousel-item>
      <button class="custom-next-button" @click="nextSlide">下一张</button>
    </el-carousel>
  </div>
</template>

<script setup lang="ts" name="Home">
import { ref } from 'vue';

// 图片数据
const images = ref([
  { id: 1, src: 'https://www.huuc.edu.cn/images/logo.png' },
  { id: 2, src: 'https://www.huuc.edu.cn/images/logo.png' },
  { id: 3, src: 'https://www.huuc.edu.cn/images/logo.png' },
  { id: 4, src: 'https://www.huuc.edu.cn/images/logo.png' }
]);


// 下一张
const nextSlide = () => {;
};
</script>

<style scoped>
.block {
  position: relative;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 使图片覆盖整个轮播图区域 */
}

.custom-prev-button, .custom-next-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  z-index: 10;
  font-size: 16px;
}

.custom-prev-button {
  left: 10px;
}

.custom-next-button {
  right: 10px;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
