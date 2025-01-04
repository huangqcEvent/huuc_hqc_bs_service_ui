<template>
  <div class="home">
    <el-row :gutter="20" class="filter-row">
      类型：<el-col :span="4">
       <el-select v-model="filters.type" placeholder="请选择类型" clearable @change="applyFilters">
          <el-option label="寻物" value="1"></el-option>
          <el-option label="寻主" value="2"></el-option>
        </el-select>
      </el-col>
      名称： <el-col :span="4">
        <el-input v-model="filters.itemName" placeholder="请输入物品名称" clearable @input="applyFilters"></el-input>
      </el-col>
      发布时间：<el-col :span="8">
        <el-date-picker
          v-model="filters.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD 00:00:00"
          clearable
          @change="applyFilters"
        ></el-date-picker>
      </el-col>
      <el-col :span="4" style="text-align: right;">
        <el-button type="primary" @click="applyFilters">搜索</el-button>
        <el-button @click="clearFilters">清空</el-button>
      </el-col>
    </el-row>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { LostItem, Params } from '@/api/user/LostItemApi';
import { lostItemPage } from '@/api/user/LostItemApi';

const router = useRouter();
const lostItems = ref<LostItem[]>([]);
const total = ref(0);

// 过滤条件对象
const filters = ref<Params>({
  type: null,
  itemName: '',
  createTimeStart: '',
  createTimeEnd: '',
  pageSize: 6, // 每页显示6条记录
  pageNumber: 1,
  dateRange: ['', '']
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

const applyFilters = () => {
  if (filters.value.dateRange) {
    filters.value.createTimeStart = filters.value.dateRange[0];
    filters.value.createTimeEnd = filters.value.dateRange[1];
  } else {
    filters.value.createTimeStart = '';
    filters.value.createTimeEnd = '';
  }
  filters.value.pageNumber = 1; // 重置页码
  fetchLostItems();
};

const clearFilters = () => {
  filters.value = {
    type: null,
    itemName: '',
    createTimeStart: '',
    createTimeEnd: '',
    pageSize: 6, // 每页显示6条记录
    pageNumber: 1,
    dateRange: ['', '']
  };
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

<style scoped>
.home {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
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
}
</style>
