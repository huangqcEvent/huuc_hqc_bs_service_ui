<template>
  <div class="block">
    <el-carousel height="500px" motion-blur>
      <el-carousel-item v-for="item in images" :key="item.id">
        <img :src="item.src" alt="carousel image" class="carousel-image" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts" name="Home">
import { ref } from 'vue';

// 图片数据
const images = ref([
  { id: 1, src: 'https://cdn.pixabay.com/photo/2017/03/26/10/44/longboard-2175193_960_720.jpg' },
  { id: 2, src: 'https://cdn.pixabay.com/photo/2017/03/26/10/44/longboard-2175193_960_720.jpg' },
  { id: 3, src: 'https://cdn.pixabay.com/photo/2017/03/26/10/44/longboard-2175193_960_720.jpg' },
  { id: 4, src: 'https://cdn.pixabay.com/photo/2017/03/26/10/44/longboard-2175193_960_720.jpg' }
]);
</script>

<style scoped lang="scss">
.block {
  width: 100%;
  margin: 0 auto;
}

.el-carousel {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片覆盖整个容器 */
}

.el-carousel__button {
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.el-carousel__arrow {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 20px;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.el-carousel__arrow--left {
  left: 20px;
}

.el-carousel__arrow--right {
  right: 20px;
}

.el-carousel__indicators {
  bottom: 20px;
}

.el-carousel__indicator {
  button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
  }
}

.el-carousel__indicator.is-active button {
  background-color: #409EFF;
}
</style>
