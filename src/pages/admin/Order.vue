<template>
  <div class="container">
    <!-- 其他内容 -->
    <div class="content">
      <!-- 用户列表等其他内容 -->
    </div>
    <div class="pagination">
      <Page :total="total" :pageChange="pageChange" />
    </div>
  </div>
</template>

<script setup lang="ts" name="Order">
import Page from '@/common/Page.vue';
import { ref } from 'vue';

let total = ref(100);
let pageNumber = ref(1);
let pageSize = ref(10);

function pageChange(number: number, size: number) {
  pageNumber.value = number;
  pageSize.value = size;
  console.log(pageNumber.value, pageSize.value);
  // 发起接口请求数据，请求参数中使用 number 作为查询当前页码
}
</script>

<style scoped>
.container {
  height: 100%; /* 设置容器高度为父容器高度 */
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1; /* 占据剩余空间 */
  overflow-y: auto; /* 可滚动的内容区域 */
}

.pagination {
  display: flex;
  justify-content: center; /* 水平居中 */
  margin-top: auto; /* 使分页组件位于底部 */
}
</style>
