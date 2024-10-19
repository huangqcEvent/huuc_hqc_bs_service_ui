<template>
    <div class="home">
      <h1>表白墙</h1>
      <p>欢迎来到表白墙！</p>
    </div>
  </template>
  
  <script setup lang="ts" name="ConfessionWall">
  // 这里可以添加一些逻辑，例如获取数据等
  </script>
  
  <style scoped>
  .home {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh; /* 占据整个视口高度 */
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
  