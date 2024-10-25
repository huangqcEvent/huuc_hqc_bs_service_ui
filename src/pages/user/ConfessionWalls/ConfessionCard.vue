<template>
  <el-card class="confession-card" @click="goToDetail">
    <div slot="header" class="card-header">
      <span>{{ title }}</span>
    </div>
    <div class="card-content">
      <p>{{ content }}</p>
    </div>
    <div class="card-footer">
      <small>来自 {{ author }}</small>
    </div>
  </el-card>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  title: String,
  content: String,
  author: String,
  id: String // 新增 id 属性，用于标识卡片
});

const router = useRouter();

const goToDetail = () => {
  router.push({ name: 'CardDetail', params: { id: props.id } });
};
</script>

<style scoped>
.confession-card {
  margin-bottom: 20px;
  width: 350px;
  height: 150px; /* 固定高度 */
  position: relative; /* 使子元素能够相对于卡片定位 */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 垂直居中对齐 */
  padding: 16px;
  background-color:rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer; /* 鼠标悬停时显示指针 */
  transition: box-shadow 0.3s, transform 0.3s; /* 平滑过渡效果 */
  border: 2px solid #e0e0e0; /* 增加边框 */
}

.confession-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 更深的阴影 */
  transform: translateY(-2px); /* 微微上移 */
  background-color: #f9f9f9; /* 背景颜色变浅 */
  border-color: #c0c0c0; /* 边框颜色加深 */
}

.card-header {
  font-weight: bold;
  margin-bottom: 10px;
}

.card-content {
  text-align: justify;
  flex-grow: 1; /* 内容区域自动扩展 */
  overflow: hidden; /* 防止内容溢出 */
}

.card-footer {
  position: absolute; /* 绝对定位 */
  bottom: 16px; /* 距离底部 16px */
  right: 16px; /* 距离右侧 16px */
  text-align: right;
  color: #999;
}
</style>
