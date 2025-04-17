<template>
  <div class="block">
    <el-carousel height="500px" motion-blur>
      <el-carousel-item v-for="item in images" :key="item.id">
        <img :src="item.src" alt="carousel image" class="carousel-image" />
      </el-carousel-item>
    </el-carousel>

    <!-- 今日推荐模块 -->
    <!-- 今日推荐模块 -->
    <div class="today-recommend">
      <h2>今日推荐</h2>
      <div class="recommend-items">
        <el-card v-for="recommend in recommends" :key="recommend.postId" class="recommend-item" @click="goToDetail(recommend.postId, recommend.postType)">
          <div class="recommend-content">
            <div class="header">
              <div class="author">{{ recommend.userName }}</div>
              <div class="type">{{ recommend.postTypeName}}</div>
            </div>
            <h3 class="title">{{ recommend.postTitle }}</h3>
            <div class="footer">
              <div class="time">{{ recommend.createTime}}</div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="Home">
import {onMounted, ref} from 'vue';
import {getRecommend} from '@/api/user/ConfessionWallApi';
import router from "@/router";
import {hColgroup} from "element-plus/lib/components/table/src/h-helper";

// 图片数据
const images = ref([
  { id: 1, src: 'https://www.huuc.edu.cn/images/BDBA3A41BE59FD0267403B939E9_FE169E7E_3B9B1.jpg' },
  { id: 2, src: 'https://www.huuc.edu.cn/images/ny-banner.jpg' },
    { id: 4, src: 'https://xyzh.huuc.edu.cn/__local/2/FB/CB/CD5BBB3D0CA09180D320C6957B7_F00D760D_466EA.jpg' },
]);
interface Recommends{
  postId: string;
  postType: number;
  postTypeName: string;
  userId:string;
  userName: string;
  postTitle: string;
  createTime: string;
}

// 今日推荐数据
const recommends = ref<Recommends>();

const goToDetail = (id: string, postType: number) => {
  if(postType === 1) {
    router.push({name: 'CardDetail', params: {id: id}});
  }else if(postType === 2) {
    router.push(`/userIndex/lostItemDetail/${id}`);
  } else if(postType === 3) {
    router.push({ name: 'ClubDetail', params: { id } });
  }
};

//加载钩子
onMounted(() => {
  getRecommend().then((response) => {
    recommends.value = response.data.data;
  });
});
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

.today-recommend {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.recommend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.recommend-item {
  width: calc(50% - 10px); /* 一排两个卡片，考虑间距 */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.recommend-content {
  padding: 10px;
  position: relative;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.author {
  font-size: 14px;
  color: #606266;
}

.type {
  font-size: 14px;
  color: #606266;
}

.title {
  margin: 10px 0;
  font-size: 18px;
  text-align: center;
}

.description {
  font-size: 14px;
  color: #909399;
}

.footer {
  position: absolute;
  bottom: 0;
  right: 10px;
  font-size: 14px;
  color: #606266;
}
</style>
