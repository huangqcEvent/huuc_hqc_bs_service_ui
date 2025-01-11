<template>
  <div class="home">
    <div class="filter-form">
            <el-form :model="filters" inline>
              <el-form-item label="名称">
                <el-input v-model="filters.itemName" placeholder="物品名称"></el-input>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="filters.type" placeholder="全部">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="寻物" value="1"></el-option>
                  <el-option label="寻主" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发布时间">
                <el-date-picker v-model="dateRange" type="daterange" range-separator="至"
                  start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD 00:00:00"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="fetchLostItems">搜索</el-button>
                <el-button type="default" @click="clearFilters">清空</el-button>
              </el-form-item>
            </el-form>
          </div>
    <el-row :gutter="20" class="card-list">
      <el-col :span="8" v-for="item in lostItems" :key="item.id">
        <el-card class="box-card" @click="goToDetail(item.id)">
          <div class="card-header">
            <span class="type">{{ item.type === 1 ? '寻物' : '寻主' }}</span>
          </div>
          <div class="card-body">
            <el-image :src="item.image1" fit="cover" class="item-image" />
            <div class="item-info">
              <p class="item-name">{{ item.itemName }}</p>
              <p class="location">{{ item.location }}</p>
            </div>
          </div>
          <div class="card-footer">
            <p class="phone">{{ item.phone }}</p>
            <p class="time">{{ item.createTime }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      layout="prev, pager, next"
      :total="total"
      :page-size="filters.pageSize"
      :current-page="filters.pageNumber"
      @current-change="handlePageChange"
      class="pagination"
    />
  </div>
</template>

<script setup lang="ts" name="Notice">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { LostItem, Params } from '@/api/user/LostItemApi';
import { lostItemPage } from '@/api/user/LostItemApi';

const router = useRouter();
const lostItems = ref<LostItem[]>([]);
const total = ref(0);
const dateRange = ref(['', '']); // 确保初始化为数组

// 过滤条件对象
const filters = ref<Params>({
  type: null,
  itemName: '',
  createTimeStart: '', // 初始化为空字符串
  createTimeEnd: '', // 初始化为空字符串
  pageSize: 6, // 每页显示6条记录
  pageNumber: 1,
  status: 1
});

// 监听 dateRange 的变化，更新 filters 对象
watch(dateRange, (newVal) => {
  if (Array.isArray(newVal) && newVal.length === 2) {
    filters.value.createTimeStart = newVal[0];
    filters.value.createTimeEnd = newVal[1];
  } else {
    filters.value.createTimeStart = '';
    filters.value.createTimeEnd = '';
  }
});

onMounted(() => {
  // 调接口
  fetchLostItems();
});

const fetchLostItems = async () => {
  const response = await lostItemPage(filters.value);
  lostItems.value = response.data.data.list;
  total.value = response.data.data.total;
};

const clearFilters = () => {
  filters.value = {
    type: null,
    itemName: '',
    createTimeStart: '',
    createTimeEnd: '',
    pageSize: 6, // 每页显示6条记录
    pageNumber: 1
  };
  dateRange.value = ['', ''];
  fetchLostItems();
};

const handlePageChange = (newPage: number) => {
  filters.value.pageNumber = newPage;
  fetchLostItems();
};

const goToDetail = (id: number | undefined) => {
  router.push(`/userIndex/lostItemDetail/${id}`);
};
</script>

<style scoped lang="scss">
.home {
  padding: 20px;
  background-color: #f0f2f5;
  max-height: calc(100vh - 80px); /* 调整最大高度 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.filter-row {
  width: 100%;
  max-width: 1200px;
  margin-bottom: 30px;
}

.card-list {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 30px;
}

.box-card {
  margin-bottom: 20px; /* 减少底部外边距 */
  cursor: pointer;
  transition: transform 0.3s ease;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-height: 250px; /* 设置最大高度 */
  padding: 10px; /* 减少内边距 */
}

.box-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 10px; /* 减少内边距 */
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  font-weight: bold;
  color: #409eff;
  text-align: left;
  font-size: 1.1em;
}

.card-body {
  padding: 10px; /* 减少内边距 */
  display: flex;
  align-items: center;
}

.card-footer {
  padding: 10px; /* 减少内边距 */
  border-top: 1px solid #ebeef5;
  text-align: left;
  color: #909399;
  font-size: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-image {
  width: 100px; /* 减小图片宽度 */
  height: 100px; /* 减小图片高度 */
  object-fit: cover;
  border-radius: 12px;
  margin-right: 10px; /* 减少右边距 */
}

.item-info {
  flex: 1;
  text-align: left;
}

.item-name {
  font-size: 1.2em; /* 减小字体大小 */
  margin: 0;
  color: #303133;
  font-weight: 600;
}

.location {
  color: #909399;
  margin: 0;
  font-size: 0.9em; /* 减小字体大小 */
  margin-top: 5px;
}

.card-footer .phone {
  margin: 0;
  font-weight: 500;
}

.card-footer .time {
  margin: 0;
  font-size: 0.8em; /* 减小字体大小 */
}

.pagination {
  margin-top: -30px;
  left: 700px;
}
</style>
