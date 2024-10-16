<template>
  <div class="container">
    <!-- 过滤条件表单 -->
    <div class="filter-form">
      <el-form :model="filterForm" inline>

        <el-form-item label="用户名">
          <el-input v-model="filterForm.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="filterForm.state" placeholder="全部" style="width: 100px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="身份">
          <el-select v-model="filterForm.identity" placeholder="全部" style="width: 100px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="普通用户" value="0"></el-option>
            <el-option label="管理员" value="1"></el-option>
            <el-option label="社团账号" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间">
          <el-date-picker v-model="filterForm.createTimeRange" type="daterange" range-separator="至"
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
      <el-table :data="userList" style="width: 100%">

        <el-table-column prop="head" label="头像" width="100">
          <template #default="scope">
            <el-avatar :src="scope.row.head" size="medium"></el-avatar>
          </template>
        </el-table-column>

        <el-table-column prop="userName" label="用户名" width="180"></el-table-column>

        <el-table-column prop="state" label="状态" width="180">
          <template #default="scope">
            <el-tag :type="scope.row.state ? 'success' : 'danger'">{{ scope.row.state ? '正常' : '停用' }}</el-tag>
            <!-- <el-switch  v-model="state" @change="updateState()" class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" /> -->
          </template>
        </el-table-column>

        <el-table-column prop="identity" label="身份" width="180">
          <template #default="scope"> 
            <el-tag :type="getType(scope.row.identity)">
              {{ getDisplayName(scope.row.identity) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="220"></el-table-column>

        <el-table-column prop="downTime" label="停用时间" width="220">
          <template #default="scope">
            {{ scope.row.downTime || '空' }}
          </template>
        </el-table-column>

        <el-table-column prop="downReason" label="停用原因" width="220">
          <template #default="scope">
            {{ scope.row.downReason || '空' }}
          </template>
        </el-table-column>

      </el-table>
    </div>

    <div class="pagination">
      <Page :total="total" :pageChange="pageChange" />
    </div>
  </div>
</template>


<script setup lang="ts" name="User">
import Page from '@/common/Page.vue';
import { onMounted, ref } from 'vue';
import request from '@/utils/axiosUtils';

// const state = ref(false); // 初始状态为 false

interface User {
  id: string;
  userName: string;
  state: boolean;
  identity: number;
  createTime: string;
  downTime: string;
  downReason: string;
}

// 接受数据
let userList = ref<User[]>([]);
let total = ref(0);

//请求参数
let pageNumber = ref(1);
let pageSize = ref(10);

// 过滤条件表单
const filterForm = ref({
  userName: '',
  state: '',
  identity: '',
  createTimeRange: ['', ''] as [string, string]
});

// 初始加载数据
onMounted(() => {
  fetchData();
});

// 获取数据
function fetchData() {
  const params = {
    pageSize: pageSize.value,
    pageNumber: pageNumber.value,
    userName: filterForm.value.userName,
    state: filterForm.value.state,
    identity: filterForm.value.identity,
    startTime: formatDateTime(filterForm.value.createTimeRange[0]),
    endTime: formatDateTime(filterForm.value.createTimeRange[1])
  };

  request.get('/admin/userPage', {
    params
  }).then(response => {
    total.value = response.data.data.total;
    userList.value = response.data.data.list;

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

// 获取类型
function getType(row: number) {
  if (row === 2) {
    return 'primary';
  } else if (row === 1) {
    return 'success';
  } else {
    return 'danger';
  }
}

// 获取显示名称
function getDisplayName(row: number) {
  if (row === 2) {
    return '社团账号';
  } else if (row === 1) {
    return '管理员';
  } else {
    return '普通用户';
  }
}

// 清空所有过滤项
function clearFilters() {
  filterForm.value = {
    userName: '',
    state: '',
    identity: '',
    createTimeRange: ["", ""]
  };
  fetchData();
}

//切换zhuangtai
// function updateState() {
//    alert(state.value);
// }
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
