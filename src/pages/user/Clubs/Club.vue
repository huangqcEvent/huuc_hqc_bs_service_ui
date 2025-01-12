<template>
    <div class="home">
      <h1>社团咨询</h1>
      <p>欢迎来到社团咨询！</p>
    </div>
  </template>
  
  <script setup lang="ts" name="Club">
  // 这里可以添加一些逻辑，例如获取数据等
  </script>
  
  <style scoped lang="scss">
  .home {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-height: calc(100vh - 80px); /* 调整最大高度 */
    background-color: #f0f2f5; /* 背景颜色 */
    color: #333;
    text-align: center;
  }
  
  h1 {
    font-size: 2.5em;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 1.5em;
    color: #666;
  }
  </style>
  