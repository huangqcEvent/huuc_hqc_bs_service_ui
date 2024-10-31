<template>
  <div class="publish-page">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="表白贴" name="first">
        <ConfessionForm />
      </el-tab-pane>
      <el-tab-pane label="找对象贴" name="second">
        <DatingForm />
      </el-tab-pane>
      <el-tab-pane label="寻物贴" name="third">
        <LostItemForm />
      </el-tab-pane>
      <el-tab-pane label="社团公告贴" name="fourth">
        <ClubAnnouncementForm />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup name="Publish">
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import ConfessionForm from './ConfessionForm.vue';
import DatingForm from './DatingForm.vue';
import LostItemForm from './LostItemForm.vue';
import ClubAnnouncementForm from './ClubAnnouncementForm.vue';
const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<style scoped>
.publish-page {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.demo-tabs {
  width: 80%;
  max-width: 1200px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs__header {
  margin-bottom: 20px;
}

.el-tabs__item {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.el-tabs__item.is-active {
  color: #409eff;
}

.el-tabs__nav-wrap::after {
  background-color: transparent;
}

.el-tabs__active-bar {
  background-color: #409eff;
  height: 3px;
}
</style>