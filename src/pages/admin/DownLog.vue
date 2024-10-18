<template>
    <div class="container">
      <!-- 过滤条件表单 -->
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
            <el-button type="defult" @click="clearFilters">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 用户列表 -->
      <div class="content">
        <el-table :data="downLogList" style="width: 100%;">
          <el-table-column prop="userName" label="用户名" width="150"></el-table-column>

          <el-table-column prop="downAdminName" label="封禁人" width="180"></el-table-column>

          <el-table-column prop="downReason" label="封禁原因" width="180">
            <template #default="scope">
              {{ scope.row.downReason || '空' }}
            </template>
          </el-table-column>
  
          <el-table-column prop="downTime" label="封禁时间" width="180"></el-table-column>
          
          <el-table-column prop="downEnd" label="是否已解封" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.downEnd ? 'success' : 'danger'">{{ scope.row.downEnd ? '已解封' : '封禁中' }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="downEndTime" label="解封时间" width="180"></el-table-column>

          <el-table-column prop="downEndAdminName" label="解封人" width="180"></el-table-column>

        </el-table>
      </div>
  
      <div class="pagination">
        <Page :total="total" :pageChange="pageChange" />
      </div>
    </div>
  </template>
  
  
  <script setup lang="ts" name="DownLog">
  import Page from '@/common/Page.vue';
  import { onMounted, ref } from 'vue';
  import request from '@/utils/axiosUtils';


  interface downLog {
    id: string;
    userName: string;
    downReason: string;
    downTime: string;
    downAdminName: string;
    downEnd: number;
    downEndTime: string;
    downEndAdminName: string
  }
  
  // 接受数据
  let downLogList = ref<downLog[]>([]);
  let total = ref(0);
  
  //请求参数
  let pageNumber = ref(1);
  let pageSize = ref(10);
  
  // 过滤条件表单
  const filterForm = ref({
    userName: '',
    downEnd: '',
    downTimeRange: ['', ''] as [string, string]
  });
  
  // 初始加载数据
  onMounted(() => {
    fetchData();
  });
  
  // 发送请求获取数据
  function fetchData() {
    const params = {
      pageSize: pageSize.value,
      pageNumber: pageNumber.value,
      userName: filterForm.value.userName,
      downEnd: filterForm.value.downEnd,
      downTimeStart: formatDateTime(filterForm.value.downTimeRange[0]),
      downTimeEnd: formatDateTime(filterForm.value.downTimeRange[1])
    };
  
    request.get('/admin/downLogPage', {
      params
    }).then(response => {
      total.value = response.data.data.total;
      downLogList.value = response.data.data.list;
      console.log(response.data.data);
    });
  }
  
  // 分页变化
  function pageChange(number: number, size: number) {
    pageNumber.value = number;
    pageSize.value = size;
    fetchData();
  }
  
  // 格式化日期时间
  function formatDateTime(dateStr: string | undefined): string {
    if (!dateStr) return '';
    return `${dateStr} 00:00:00`;
  }
  
  // 清空所有过滤项
  function clearFilters() {
    filterForm.value = {
      userName: '',
      downEnd:'',
      downTimeRange: ["", ""]
    };
    fetchData();
  }
  </script>
  
  <style scoped>
  .container {
    height: 100vh;
    /* 占据整个视口高度 */
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* 防止整个页面滚动 */
  }
  
  .filter-form {
    padding: 0px;
    background-color: #f8f9fa;
    margin-bottom: 0px;
    /* 减小过滤框和表格之间的间距 */
  }
  
  .el-form-item {
    margin-right: 16px;
  }
  
  .el-table .cell {
    text-align: center;
  }
  
  .el-button {
    margin-left: 16px;
  }
  
  .content {
    flex: 1;
    /* 占据剩余空间 */
    overflow-y: auto;
    /* 启用垂直滚动条 */
    padding: 0px;
    max-height: calc(100vh - 224px);
    /* 调整 max-height 以适应新的间距 */
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: auto;
    /* 使分页组件位于底部 */
    margin-bottom: 100px;
    /* 确保分页条与底部有一定距离 */
  }
  
  /* 使表格适应屏幕宽度 */
  .el-table {
    width: 100%;
  }
  
  /* 调整表格列的宽度 */
  .el-table__header-wrapper th {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>
  