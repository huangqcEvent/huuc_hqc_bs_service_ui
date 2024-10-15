<template>
    <div>
      <el-pagination
        background
        layout="total, prev, pager, next, jumper, sizes"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        :total="total"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </template>
  
  <script setup lang="ts" name="Page">
  import { ref, watch } from 'vue';
  
  // 组件属性
  interface Props {
    total: number;
    pageChange: (number: number, size: number) => void;
  }
  
  const props = defineProps<Props>();
  
  // 组件内部状态
  const total = ref(props.total);
  const pageSize = ref(10);
  const currentPage = ref(1);
  
  const handlePageChange = (p: number) => {
    currentPage.value = p;
    props.pageChange(p, pageSize.value);
  };
  
  const handleSizeChange = (size: number) => {
    pageSize.value = size;
    props.pageChange(currentPage.value, size);
  };
  
  watch(() => props.total, (newTotal) => {
    total.value = newTotal;
  });
  </script>
  
  <style scoped>
  /* 样式可以根据需要添加 */
  </style>
  