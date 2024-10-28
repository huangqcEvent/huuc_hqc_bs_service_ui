<template>
  <div v-if="confessions !== null" class="wall">
    <div class="confession-wall">
      <button class="arrow left" @click="prevPage" :disabled="currentPage === 1">
        <i class="el-icon-arrow-left">上</i>
      </button>
      <transition name="slide-fade" mode="out-in">
        <el-card class="large-card" key="currentPage">
          <div class="filter-form">
            <el-form :model="filterForm" inline>
              <el-form-item label="标题">
                <el-input v-model="filterForm.title" placeholder="请输入标题"></el-input>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="filterForm.type" placeholder="全部" style="width: 100px;">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="表白" value="1"></el-option>
                  <el-option label="找对象" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发布时间">
                <el-date-picker v-model="filterForm.createTimeRange" type="daterange" range-separator="至"
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
            <el-col :span="8" v-for="confession in confessions" :key="confession.id">
              <ConfessionCard :title="confession.title" :content="confession.summary" :author="confession.userName"
                :id="confession.id" :createTime="confession.createTime" />
            </el-col>
          </div>
          <div class="page">
            {{ currentPage }} / {{ totalPages }} 共{{ total }}条
          </div>
        </el-card>
      </transition>
      <button class="arrow right" @click="nextPage" :disabled="currentPage === totalPages">
        <i class="el-icon-arrow-right">下</i>
      </button>
    </div>
  </div>
  <div v-else class="loading">
    <div class="spinner"></div>
    <p v-if="confessions === null">出错了,请稍后再试...........</p>
    <p v-else>加载失败，请重试。</p>
  </div>
</template>

<script setup lang="ts" name="ConfessionWall">
import { ref, computed, onMounted } from 'vue';
import { ElCard, ElCol } from 'element-plus';
import ConfessionCard from './ConfessionCard.vue';
import { cardQuery } from '@/api/user/ConfessionWallApi';

// 接口返回格式
interface Card {
  id: string;
  title: string;
  userName: string;
  summary: string;
  createTime: string;
}

// 接受返回
const confessions = ref<Card[] | null>(null);

// 当前页
const currentPage = ref(1);

// 每页多少条，固定为9
const itemsPerPage = 9;

// 总数量
const total = ref(0);

// 过滤条件表单
const filterForm = ref({
  title: '',
  type: '',
  createTimeRange: ['', ''] as [string, string]
});

// 请求数据
function fetchData() {
  const params = {
    pageSize: itemsPerPage,
    pageNumber: currentPage.value,
    createTimeStart: formatDateTime(filterForm.value.createTimeRange[0]),
    createTimeEnd: formatDateTime(filterForm.value.createTimeRange[1]),
    title: filterForm.value.title,
    type: filterForm.value.type
  };
  cardQuery(params)
    .then((response) => {
      confessions.value = response.data.data.list;
      total.value = response.data.data.total;
    })
    .catch((error) => {
      console.error('请求失败:', error);
      confessions.value = null;
    });
}

// 格式化日期时间
function formatDateTime(dateStr: string | undefined): string {
  if (!dateStr) return '';
  return `${dateStr} 00:00:00`;
}

// 清空过滤框
function clearFilters() {
  filterForm.value = {
    title: '',
    type: '',
    createTimeRange: ['', '']
  };
  fetchData();
}

// 计算总共多少页
const totalPages = computed(() => Math.ceil(total.value / itemsPerPage));

// 点击上一页
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchData();
  }
}

// 点击下一页
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchData();
  }
}

// 初始化时调用接口
onMounted(() => {
  fetchData();
});
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
  height: 670px;
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
  margin-top: -15px;
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

.page {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: aqua;
}

.loading {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #f50505;
}
</style>
