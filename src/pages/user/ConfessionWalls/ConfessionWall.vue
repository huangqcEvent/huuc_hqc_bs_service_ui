<template>
  <div class="wall">
    <div class="confession-wall">
     
      <button class="arrow left" @click="prevPage" :disabled="currentPage === 1">
        <i class="el-icon-arrow-left">上</i>
      </button>
      <transition name="slide-fade" mode="out-in">
        <el-card class="large-card" key="current-page">
          <div class="filter-form">
        <el-form :model="filterForm" inline>
          <el-form-item label="用户名">
            <el-input v-model="filterForm.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filterForm.downEnd" placeholder="全部" style="width: 100px;">
              <el-option label="全部" value=""></el-option>
              <el-option label="已解封" value="1"></el-option>
              <el-option label="封禁中" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="封禁时间">
            <el-date-picker v-model="filterForm.downTimeRange" type="daterange" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD"
              style="width: 300px;"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="fetchData">搜索</el-button>
            <el-button type="default" @click="clearFilters">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
          <div class="confession-grid">
            <el-col :span="8" v-for="(confession, index) in currentConfessions" :key="index">
              <ConfessionCard :title="confession.title" :content="confession.content" :author="confession.author" />
            </el-col>
          </div>
        </el-card>
      </transition>
      <button class="arrow right" @click="nextPage" :disabled="currentPage === totalPages">
        <i class="el-icon-arrow-right">下</i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElCard, ElCol } from 'element-plus';
import ConfessionCard from './ConfessionCard.vue';

const filterForm = ref({
  userName: '',
  downEnd: '',
  downTimeRange: ['', ''] as [string, string]
});

function fetchData() { }

function clearFilters() {
  filterForm.value = {
    userName: '',
    downEnd: '',
    downTimeRange: ["", ""]
  };
  fetchData();
}

const confessions = ref([
  {
    title: '致我心中的女神',
    content: '你是我的梦中情人，愿与你共度每一个明天。',
    author: '匿名'
  },
  {
    title: '给最爱的你',
    content: '你的笑容如阳光般温暖，愿你幸福快乐每一天。',
    author: '小明'
  },
  {
    title: '新的表白1',
    content: '这是一条新的表白内容1。',
    author: '匿名'
  },
  {
    title: '新的表白2',
    content: '这是一条新的表白内容2。',
    author: '匿名'
  },
  {
    title: '新的表白3',
    content: '这是一条新的表白内容3。',
    author: '匿名'
  },
  {
    title: '新的表白4',
    content: '这是一条新的表白内容4。',
    author: '匿名'
  },
  {
    title: '新的表白5',
    content: '这是一条新的表白内容5。',
    author: '匿名'
  },
  {
    title: '新的表白6',
    content: '这是一条新的表白内容6。',
    author: '匿名'
  },
  {
    title: '新的表白7',
    content: '这是一条新的表白内容7。',
    author: '匿名'
  },
  {
    title: '新的表白8',
    content: '这是一条新的表白内容8。',
    author: '匿名'
  },
  {
    title: '新的表白9',
    content: '这是一条新的表白内容9。',
    author: '匿名'
  },
  {
    title: '新的表白10',
    content: '这是一条新的表白内容10。',
    author: '匿名'
  }
]);

const currentPage = ref(1);
const itemsPerPage = 9;

const totalPages = computed(() => Math.ceil(confessions.value.length / itemsPerPage));

const currentConfessions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return confessions.value.slice(start, end);
});

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}
</script>

<style scoped>
.wall {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url('./../../../assets/表白墙背景.jpg');
  background-size: 1400px;
  background-position: center;
  background-repeat: no-repeat;
  color: #333;
  text-align: center;
  padding: 0px;
  height: 100vh;
  margin: 0;
}

.confession-wall {
  position: relative;
  width: 100%;
  height: 800px;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 0;
  margin-bottom: 30px;
}

.large-card {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  height: 670px; /* 增加高度 */
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 2px solid #e0e0e0;
  transition: box-shadow 0.3s, border-color 0.3s;
  margin-top: 0;
}

.large-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border-color: #c0c0c0;
}

.filter-form {
  margin-top: -15px; /* 减少顶部间距 */
}

.confession-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.arrow:hover {
  background-color: #66b1ff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.arrow.left {
  left: -20px;
}

.arrow.right {
  right: -20px;
}

/* 滑动和淡入淡出过渡效果 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
