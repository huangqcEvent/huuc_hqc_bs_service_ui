<template>
    <div class="container">
        <!-- 过滤条件表单 -->
        <div class="filter-form">
            <el-form :model="filterForm" inline>
                <el-form-item label="用户名">
                    <el-input v-model="filterForm.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>

                <el-form-item label="类型">
                    <el-select v-model="filterForm.type" placeholder="全部" style="width: 100px;">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="找对象" value="0"></el-option>
                        <el-option label="表白" value="1"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="状态">
                    <el-select v-model="filterForm.status" placeholder="全部" style="width: 100px;">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="正常" value="1"></el-option>
                        <el-option label="私密" value="2"></el-option>
                        <el-option label="删除" value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="发布时间">
                    <el-date-picker v-model="filterForm.createTimeRange" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD"
                        style="width: 300px;"></el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="fetchData">搜索</el-button>
                    <el-button @click="clearFilters">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 表白墙列表 -->
        <div class="content">
            <el-table :data="confessionList" style="width: 100%;">
                <el-table-column prop="userName" label="用户名" width="150"></el-table-column>

                <el-table-column prop="type" label="类型" width="180">
                    <template #default="scope">
                        <el-tag :type="scope.row.type ? 'success' : 'danger'">{{ scope.row.type === 1 ? '表白贴' : '找对象贴' }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="isAnonymous" label="是否匿名" width="150">
                    <template #default="scope">
                        <el-tag :type="scope.row.isAnonymous ? 'success' : 'danger'">{{ scope.row.isAnonymous === 1 ? '是' : '否' }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="status" label="状态" width="100">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                            {{ scope.row.status === 1 ? '正常' : scope.row.status === 2 ? '私密' : '删除' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="isTop" label="是否置顶" width="100">
                    <template #default="scope">
                        <el-tag :type="scope.row.isTop ? 'success' : 'danger'">{{ scope.row.isTop === 1 ? '是' : '否' }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="发布时间" width="150"></el-table-column>
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

interface Confession {
    id: string;
    userName: string;
    type: number;
    isAnonymous: number;
    isTop: number;
    createTime: string;
    status: number;
}

// 接受数据
let confessionList = ref<Confession[]>([]);
let total = ref(0);

// 请求参数
let pageNumber = ref(1);
let pageSize = ref(10);

// 过滤条件表单
const filterForm = ref({
    status: '',
    userName: '',
    type: '',
    createTimeRange: ['', ''] as [string, string]
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
        status: filterForm.value.status,
        type: filterForm.value.type,
        createTimeStart: formatDateTime(filterForm.value.createTimeRange[0]),
        createTimeEnd: formatDateTime(filterForm.value.createTimeRange[1])
    };
    
    
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
        status: '',
        type: '',
        createTimeRange: ["", ""]
    };
    fetchData();
}
</script>

<style scoped>
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
</style>
