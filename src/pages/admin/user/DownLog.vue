<template>
  <div class="container">
    <!-- 过滤条件表单 -->
    <div class="filter-form">
      <el-form :model="filterForm" inline>

        <el-form-item label="用户名">
          <el-input v-model="filterForm.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="filterForm.downEnd" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="已解封" value="1"></el-option>
            <el-option label="封禁中" value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="封禁时间">
          <el-date-picker v-model="filterForm.downTimeRange" type="daterange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="fetchData">搜索</el-button>
          <el-button type="default" @click="clearFilters">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 用户列表 -->
    <div class="content">
      <el-table :data="downLogList">
        <el-table-column prop="userName" label="用户名"></el-table-column>

        <el-table-column prop="downAdminName" label="封禁人"></el-table-column>

        <el-table-column prop="downReason" label="封禁原因">
          <template #default="scope">
            {{ scope.row.downReason || '空' }}
          </template>
        </el-table-column>

        <el-table-column prop="downTime" label="封禁时间"></el-table-column>

        <el-table-column prop="downEnd" label="是否已解封">
          <template #default="scope">
            <el-tag :type="scope.row.downEnd ? 'success' : 'danger'">{{ scope.row.downEnd ? '已解封' : '封禁中' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="downEndTime" label="解封时间"></el-table-column>

        <el-table-column prop="downEndAdminName" label="解封人"></el-table-column>

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
import { fetchDownLog } from '@/api/admin/user/userApi'

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

  fetchDownLog(params).then(response => {
    total.value = response.data.data.total;
    downLogList.value = response.data.data.list;
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
    downEnd: '',
    downTimeRange: ["", ""]
  };
  fetchData();
}
</script>