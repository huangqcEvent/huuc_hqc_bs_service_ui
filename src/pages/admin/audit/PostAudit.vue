<template>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="待审核" name="first">

      </el-tab-pane>
      <el-tab-pane label="已审核" name="second">

      </el-tab-pane>
    </el-tabs>
  </template>
  <script lang="ts" setup name="PostAudit">
  import { ref } from 'vue'
  import type { TabsPaneContext } from 'element-plus'
  
  const activeName = ref('first')
  
  const handleClick = (tab: TabsPaneContext, event: Event) => {
  }
  </script>
  
  <style>
  .demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
  </style>
  