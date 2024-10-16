<template>
  <div class="container">
    <!-- 其他内容 -->
    <div class="content">
      <!-- 用户列表等其他内容 -->
      <el-table :data="userList" style="width: 100%">
        <el-table-column prop="head" label="头像" width="100">
          <template #default="scope">
            <el-avatar :src="scope.row.head" size="medium"></el-avatar>
            <!-- <Image :src="scope.row.head" :width="80"></Image> -->
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名" width="180"></el-table-column>
        <el-table-column prop="state" label="状态" width="180">
          <template #default="scope">
            <el-tag :type="scope.row.state ? 'success' : 'danger'">{{ scope.row.state ? '正常' : '停用' }}</el-tag>
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
        <el-table-column prop="downTime" label="停用时间" width="220"></el-table-column>
        <el-table-column prop="downReason" label="停用原因" width="220"></el-table-column>
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
import Image from '@/common/Image.vue';
let total = ref(100);
let pageNumber = ref(1);
let pageSize = ref(10);
interface User {
  id: string,
  userName: string;
  state: string;
  identity: number;
  createTime: string;
}

//接受数据
let userList = ref<User[]>([])
function pageChange(number: number, size: number) {
  pageNumber.value = number;
  pageSize.value = size;
  console.log(pageNumber.value, pageSize.value);
  // 发起接口请求数据，请求参数中使用 number 作为查询当前页码
  request.get("/admin/userPage", {
    params: {
      pageSize: pageSize.value,
      pageNumber: pageNumber.value
    }
  }
  ).then(response => {
    total.value = response.data.data.total
    userList.value = response.data.data.list
    console.log(response.data.data)
  })
}
function getType(row: number) {
  if (row == 2) {
    return 'primary'; // 假设超级管理员用 'primary' 类型
  } else if (row == 1) {
    return 'success';
  } else {
    return 'danger';
  }
}
function getDisplayName(row: number) {
  if (row == 2) {
    return '社团账号';
  } else if (row == 1) {
    return '管理员';
  } else {
    return '普通用户';
  }
}
//刚加载的时候先发请求
onMounted(() => {
  pageChange(pageNumber.value, pageSize.value)
})


</script>

<style scoped>
.container {
  height: 100%;
  /* 设置容器高度为父容器高度 */
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  /* 占据剩余空间 */
  overflow-y: auto;
  /* 启用垂直滚动条 */
  padding: 16px;
  max-height: 80vh; /* 设置最大高度，可以根据需要调整 */
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
  /* 使分页组件位于底部 */
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

/* 响应式布局 */
@media (max-width: 768px) {
  .el-table {
    font-size: 12px;
  }

  .el-table__header-wrapper th {
    width: 100%;
    display: block;
    text-align: left;
  }

  .el-table__body-wrapper td {
    display: block;
    text-align: left;
  }

  .el-table__body-wrapper tr {
    border-bottom: 1px solid #ebeef5;
  }

  .el-table__body-wrapper td:first-child {
    font-weight: bold;
  }
}
</style>