<template>
  <div class="container">
    <!-- 过滤条件表单 -->
    <div class="filter-form">
      <el-form :model="filterForm" inline>

        <el-form-item label="用户名">
          <el-input v-model="filterForm.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="filterForm.state" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="身份">
          <el-select v-model="filterForm.identity" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="普通用户" value="0"></el-option>
            <el-option label="管理员" value="1"></el-option>
            <el-option label="社团账号" value="2"></el-option>
            <el-option label="超级管理员" value="99"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="注册时间">
          <el-date-picker v-model="filterForm.createTimeRange" type="daterange" range-separator="至"
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
      <el-table :data="userList">
        <el-table-column prop="head" label="头像">
          <template #default="scope">
            <el-avatar :src=scope.row.head size="default"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="state" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.state ? 'success' : 'danger'">{{ scope.row.state ? '正常' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="identity" label="身份">
          <template #default="scope">
            <el-tag :type="getType(scope.row.identity)">
              {{ getDisplayName(scope.row.identity) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间"></el-table-column>
        <el-table-column label="操作1">
          <template #default="scope">
            <el-button v-if="canBanUser(scope.row.identity)" type="primary" plain
              @click="handledownEndChange(scope.row.id, scope.row.userName, scope.row.state == 0 ? 1 : 0)">
              {{ scope.row.state == 1 ? '封禁' : '解封' }}
            </el-button>
            <el-tag v-else type="danger">无权限</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作2">
          <template #default="scope">
            <el-button v-if="canBanUser(scope.row.identity)" type="primary" plain
              @click="updateIdentity(scope.row.id, scope.row.identity)">
              转化身份
            </el-button>
            <el-tag v-else type="danger">无权限</el-tag>
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
import { onMounted, ref, h } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute } from 'vue-router';
import { fetchUsers, banOrUnbanUser, updateUserIdentity } from '@/api/admin/user/userApi';

// 获取用户身份参数
const route = useRoute();
let identity = ref(Number(route.query.identity)); // 确保 identity 是数字

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

// 请求参数
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

  fetchUsers(params).then(response => {
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
    return 'danger';
  } else if (row === 0) {
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
  } else if (row === 0) {
    return '普通用户';
  } else {
    return '超级管理员';
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

// 更改用户封禁状态
function handledownEndChange(id: number, userName: string, downEnd: number) {
  if (downEnd == 0) {
    ElMessageBox.prompt('请输入封禁原因', '封禁用户:' + userName, {
      confirmButtonText: '封禁',
      cancelButtonText: '取消',
    })
      .then(({ value }) => {
        if (!value || value.trim() === '') {
          ElMessage({
            type: 'error',
            message: '封禁原因不能为空',
          });
        } else {
          const params = {
            id: id,
            state: downEnd,
            downReason: value
          };
          banOrUnbanUser(params)
            .then(() => {
              ElMessage({
                type: 'success',
                message: '封禁用户:' + userName + '<br>' + '封禁原因:' + value,
                dangerouslyUseHTMLString: true, // 允许使用 HTML 字符串
              });
              window.location.reload();
            })
            .catch((error) => {
              ElMessage({
                type: 'error',
                message: '封禁失败: ' + error.message,
              });
            });
        }
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '封禁操作已取消',
        });
      });

  } else {
    ElMessageBox.confirm('确认解封用户:' + userName + '?', {
      confirmButtonText: '解封',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const params = {
          id: id,
          state: downEnd
        }
        banOrUnbanUser(params)
          .then(() => {
            ElMessage({
              type: 'success',
              message: '成功解封用户:' + userName,
              dangerouslyUseHTMLString: true, // 允许使用 HTML 字符串
            });
            window.location.reload();
          })
          .catch((error) => {
            ElMessage({
              type: 'error',
              message: '解封失败: ' + error.message,
            });
          });
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '解封操作已取消',
        });
      });
  }
}

// 转化身份
function updateIdentity(userId: string, oldIndentity: number) {
  ElMessageBox({
    title: '提示',
    message: h('div', [
      h('select', { class: 'custom-select' }, [
        h('option', { value: '' }, '请选择新的身份'),
        h('option', { value: 1 }, '管理员'),
        h('option', { value: 0 }, '普通用户'),
        h('option', { value: 2 }, '社团账号'),
      ]),
      h('input', { class: 'custom-input', placeholder: '请输入更改原因' }),
    ]),
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        const selectElement = document.querySelector('.custom-select') as HTMLSelectElement;
        const inputElement = document.querySelector('.custom-input') as HTMLInputElement;

        if (selectElement && inputElement) {
          const newIndentity = selectElement.value.trim();
          const updateReason = inputElement.value.trim();

          if (newIndentity && updateReason) {
            const params = {
              userId: userId,
              oldIdentity: oldIndentity,
              newIdentity: parseInt(newIndentity),
              updateReason: updateReason
            };
            updateUserIdentity(params)
              .then(() => {
                ElMessage({
                  type: 'success',
                  message: '成功转化',
                });
                window.location.reload();
              })
              .catch((error) => {
                ElMessage({
                  type: 'error',
                  message: '转化失败: ' + error.message,
                });
              });
            done();
          } else {
            ElMessage({
              type: 'warning',
              message: '请选择选项并输入内容',
            });
          }
        } else {
          ElMessage({
            type: 'error',
            message: '选择器或输入框未找到',
          });
        }
      } else {
        done();
      }
    },
  });
};

// 用户封禁权限检测
function canBanUser(userIdentity: number): boolean {
  if (identity.value === 99) {
    return [0, 1, 2].includes(userIdentity);
  } else if (identity.value === 1) {
    return [0, 2].includes(userIdentity);
  } else {
    return false;
  }
}
</script>

<style scoped lang="scss"></style>
