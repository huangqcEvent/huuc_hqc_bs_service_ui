<template>
  <div class="container">
    <div class="content">
      <!-- Tab 组件，用于切换不同审核状态 -->
      <el-tabs v-model="filterForm.status" class="demo-tabs" @tab-click="handleTabClick">
        <el-tab-pane label="待机器审核" :name="STATUS_MACHINE_AUDIT">
          <el-button @click="showFilterDialog = true" class="filter-button">过滤</el-button>
          <AutoAuditList :status="filterForm.status" :pageData="pageData" :total="total"></AutoAuditList>
        </el-tab-pane>
        <el-tab-pane label="待人工审核" :name="STATUS_MANUAL_AUDIT">
          <el-button @click="showFilterDialog = true" class="filter-button">过滤</el-button>
          <AutoAuditList :status="filterForm.status" :pageData="pageData" :total="total"></AutoAuditList>
        </el-tab-pane>
        <el-tab-pane label="审核通过" :name="STATUS_AUDIT_PASSED">
          <el-button @click="showFilterDialog = true" class="filter-button">过滤</el-button>
          <AutoAuditList :status="filterForm.status" :pageData="pageData" :total="total"></AutoAuditList>
        </el-tab-pane>
        <el-tab-pane label="已打回" :name="STATUS_PENDING_MODIFICATION">
          <el-button @click="showFilterDialog = true" class="filter-button">过滤</el-button>
          <AutoAuditList :status="filterForm.status" :pageData="pageData" :total="total"></AutoAuditList>
        </el-tab-pane>
      </el-tabs>

      <!-- 筛选条件对话框 -->
      <el-dialog v-model="showFilterDialog" title="过滤条件" width="50%">
        <div class="filter-form">
          <el-form :model="filterForm" inline>
            <el-form-item label="流水号">
              <el-input v-model="filterForm.id" placeholder="请输入流水号"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="filterForm.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="filterForm.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="filterForm.status" placeholder="全部">
                <el-option label="待机器审核" :value="STATUS_MACHINE_AUDIT"></el-option>
                <el-option label="待人工审核" :value="STATUS_MANUAL_AUDIT"></el-option>
                <el-option label="已打回" :value="STATUS_PENDING_MODIFICATION"></el-option>
                <el-option label="审核通过" :value="STATUS_AUDIT_PASSED"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="贴大类型">
              <el-select v-model="filterForm.postType" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="表白帖" value="1"></el-option>
                <el-option label="寻物" value="2"></el-option>
                <el-option label="社团" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="filterForm.postType == 1" label="贴小类型">
              <el-select v-model="filterForm.postSubType" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="找对象" value="1"></el-option>
                <el-option label="表白" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="filterForm.postType == 2" label="贴小类型">
              <el-select v-model="filterForm.postSubType" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="寻物" value="1"></el-option>
                <el-option label="寻主" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="filterForm.postType == 3" label="贴小类型">
              <el-select v-model="filterForm.postSubType" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="纳新" value="1"></el-option>
                <el-option label="公告" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发布时间">
              <el-date-picker v-model="createTimeRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" style="width: 300px;"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="fetchData">搜索</el-button>
              <el-button @click="clearFilters">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>

      <div class="pagination">
        <Page :total="total" :pageChange="pageChange" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="PostAudit">
import Page from '@/common/Page.vue';
import { ref, watch, onMounted } from 'vue';
import AutoAuditList from './AutoAudit-list.vue';
import { type AuditPage, type PageData } from '@/api/admin/audit/auditApi';
import { auditPage } from '@/api/admin/audit/auditApi';
import { ElLoading } from 'element-plus';
import { debounce } from 'lodash';

// 定义状态常量
const STATUS_PENDING_MODIFICATION = '4';
const STATUS_MACHINE_AUDIT = '1';
const STATUS_MANUAL_AUDIT = '2';
const STATUS_AUDIT_PASSED = '3';

const createTimeRange = ref(['', '']);
const showFilterDialog = ref(false);
const filterForm = ref<AuditPage>({
  id: '',
  userName: '',
  title: '',
  postType: null,
  postSubType: null,
  status: STATUS_MANUAL_AUDIT, // 初始化 filterForm 的 status 为人工审核
  startTime: '',
  endTime: '',
  pageNumber: 1,
  pageSize: 10
});

const pageData = ref<PageData[]>([]);
const total = ref(0);

// 声明 loadingInstance
let loadingInstance: any = null;

// 监听 createTimeRange 的变化
watch(createTimeRange, (newRange) => {
  filterForm.value.startTime = newRange[0];
  filterForm.value.endTime = newRange[1];
});

// 点击 tab 更新状态
const handleTabClick = (tab: { name: string }) => {
  console.log('Tab clicked, updating status to:', tab.name); // 添加调试信息
  filterForm.value.status = tab.name; // 更新 filterForm 的 status
  filterForm.value.pageNumber = 1; // 每次切换 tab 重置页码
  createTimeRange.value = ['', '']; // 重置时间范围
  fetchData(); // 请求数据
};

// 获取数据
const fetchData = debounce(() => {
  showFilterDialog.value = false;

  // 显示加载状态
  loadingInstance = ElLoading.service({
    fullscreen: true,
    text: '加载中...',
  });

  // 调用 API 获取数据
  auditPage(filterForm.value, 'admin').then((res) => {
    loadingInstance.close(); // 关闭加载状态
    pageData.value = res.data.data.list;
    total.value = res.data.data.total;
  });
}, 500);

// 页码变化时重新请求数据
function pageChange(number: number, size: number) {
  filterForm.value.pageNumber = number;
  filterForm.value.pageSize = size;
  fetchData();
}

// 清空筛选条件
const clearFilters = () => {
  filterForm.value = {
    id: '',
    userName: '',
    title: '',
    postType: null,
    postSubType: null,
    status: STATUS_MANUAL_AUDIT, // 重置为人工审核
    startTime: '',
    endTime: '',
    pageNumber: 1,
    pageSize: 10
  };
  createTimeRange.value = ['', '']; // 重置时间范围
  fetchData();
};

// 初始化数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="scss">
.demo-tabs {
  --el-tabs-header-height: 40px;
}

.tabs-header {
  display: flex;
  align-items: center;
  height: var(--el-tabs-header-height);
}

.tabs-header .el-tabs {
  flex: 1;
}

.filter-button {
  margin-left: 16px;
}

.el-select {
  width: 120px;
}

.container {
  padding: 0px;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
