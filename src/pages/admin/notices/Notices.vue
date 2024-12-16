<template>
    <div class="container">
        <!-- 过滤条件表单 -->
        <div class="filter-form">
            <el-form :model="filterForm" inline>
                <el-form-item label="物品名">
                    <el-input v-model="filterForm.itemName" placeholder="请输入物品名称"></el-input>
                </el-form-item>

                <el-form-item label="类型">
                    <el-select v-model="filterForm.type" placeholder="全部" style="width: 100px;">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="寻物" value="1"></el-option>
                        <el-option label="寻主" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="状态">
                    <el-select v-model="filterForm.status" placeholder="全部" style="width: 100px;">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="正常" value="1"></el-option>
                        <el-option label="已解决" value="2"></el-option>
                        <el-option label="删除" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="发布时间">
                    <el-date-picker v-model="filterForm.dateRange" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD 00:00:00"
                        @change="applyFilters"
                        style="width: 300px;"></el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="fetchData">搜索</el-button>
                    <el-button @click="clearFilters">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 寻物列表 -->
        <div class="content">
            <el-table :data="noticeList" style="width: 100%;">
                <el-table-column prop="itemName" label="物品名称" width="150"></el-table-column>

                <el-table-column prop="type" label="类型" width="180">
                    <template #default="scope">
                        <el-tag :type="scope.row.type === 1 ? 'success' : 'danger'">{{ scope.row.type === 1 ? '寻物' : '寻主'
                            }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="status" label="状态" width="100">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                            {{ scope.row.status === 1 ? '正常' : scope.row.status === 2 ? '已解决' : '删除' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="isTop" label="是否置顶" width="100">
                    <template #default="scope">
                        <el-tag :type="scope.row.isTop ? 'success' : 'danger'">{{ scope.row.isTop === 1 ? '是' : '否'
                            }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="发布时间" width="180"></el-table-column>

                <el-table-column label="操作1" width="100">
                    <template #default="scope">
                        <el-button v-if="scope.row.status == 1 || scope.row.status == 4"
                        @click="status(scope.row.id,scope.row.status)">
                            {{scope.row.status == 1 ? '设为私密' : '设为正常'}}
                        </el-button>
                        <el-button v-else>
                            无法操作状态
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作2" width="100">
                    <template #default="scope">
                      
                    </template>
                </el-table-column>
                <el-table-column label="操作3" width="100">
                    <template #default="scope">
        
                    </template>
                </el-table-column>
            </el-table>
            <!-- 自定义模态框 -->
        </div>

        <div class="pagination">
            <Page :total="total" :pageChange="pageChange" />
        </div>
    </div>
</template>


<script setup lang="ts" name="Notices">
import Page from '@/common/Page.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { LostItem, Params } from '@/api/user/LostItemApi';
import { lostItemPage,updateStatus } from '@/api/user/LostItemApi'
import { ElAlert, ElMessage } from 'element-plus';

// 获取用户身份参数
const route = useRoute();
let identity = ref(Number(route.query.identity)); // 确保 identity 是数字

// 接受数据
let noticeList = ref<LostItem[]>([]);
let total = ref(0);

// 过滤条件表单
const filterForm = ref<Params>({
    type: null,
    itemName: '',
    createTimeStart: '',
    createTimeEnd: '',
    pageSize: 10, // 每页显示6条记录
    pageNumber: 1,
    dateRange: ['', '']
});

// 初始加载数据
onMounted(() => {
    fetchData();
});

// 发送请求获取数据
const fetchData = async () => {
  const response = await lostItemPage(filterForm.value,'admin');
  noticeList.value = response.data.data.list;
  total.value = response.data.data.total;
};
// 分页变化
function pageChange(number: number, size: number) {
    filterForm.value.pageNumber = number;
    filterForm.value.pageSize = size;
    fetchData();
}

// 清空所有过滤项
function clearFilters() {
    filterForm.value = {
    type: null,
    itemName: '',
    createTimeStart: '',
    createTimeEnd: '',
    pageSize: filterForm.value.pageSize, // 每页显示6条记录
    pageNumber: filterForm.value.pageNumber,
    dateRange: ['', '']
  };
    fetchData();
}

const applyFilters = () => {
  if (filterForm.value.dateRange) {
    filterForm.value.createTimeStart = filterForm.value.dateRange[0];
    filterForm.value.createTimeEnd = filterForm.value.dateRange[1];
  } else {
    filterForm.value.createTimeStart = '';
    filterForm.value.createTimeEnd = '';
  }
  filterForm.value.pageNumber = 1; // 重置页码
  fetchData();
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
// updateStatus
function status(id:string,status: number){
    if(status == 1){
         updateStatus({id,status:4},'admin')
         fetchData();
    }
    if(status == 4){
         updateStatus({id,status:1},'admin')
         fetchData();
    }
}
</script>

<style scoped>
.el-table__row:hover {
    background-color: #f0f9eb;
    cursor: pointer;
}

.container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.filter-form {
    padding: 16px;
    background-color: #f8f9fa;
    margin-bottom: 16px;
}

.el-form-item {
    margin-right: 16px;
}

.el-table .cell {
    text-align: center;
}

.el-button {
    margin-left: 16px;
    width: 60px;
}

.content {
    margin-top: -40px;
    flex: 1;
    overflow-y: auto;
    padding: 0 16px;
    max-height: calc(100vh - 224px);
}

.pagination {
    display: flex;
    justify-content: center;
    margin-top: auto;
    margin-bottom: 100px;
}

.el-table {
    width: 100%;
}

.el-table__header-wrapper th {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 自定义模态框样式 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    /* 确保模态框在最上层 */
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 80%;
    max-width: 600px;
    z-index: 1001;
    /* 确保模态框内容也在最上层 */
}

.modal-content h3 {
    margin-top: 0;
}

.modal-content p {
    margin: 10px 0;
}

.modal-content img {
    max-width: 100%;
    height: auto;
    transition: transform 0.3s ease;
    /* 平滑过渡效果 */
}

.modal-content img:hover {
    transform: scale(5);
    /* 放大5倍 */
}

.modal-content .image-container {
    display: flex;
    gap: 10px;
    /* 图片之间的间距 */
}

.modal-content .image-container img {
    max-width: 32%;
    /* 每张图片占总宽度的32%，留出8%的间距 */
    height: auto;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.modal-footer .el-button {
    margin-left: 10px;
}
</style>
