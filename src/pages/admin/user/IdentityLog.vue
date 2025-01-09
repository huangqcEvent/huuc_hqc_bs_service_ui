<template>
    <div class="container">
        <!-- 过滤条件表单 -->
        <div class="filter-form">
            <el-form :model="filterForm" inline>

                <el-form-item label="用户名">
                    <el-input v-model="filterForm.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>

                <el-form-item label="原身份">
                    <el-select v-model="filterForm.oldIdentity" placeholder="全部">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="管理员" value="1"></el-option>
                        <el-option label="普通用户" value="0"></el-option>
                        <el-option label="社团" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="新身份">
                    <el-select v-model="filterForm.newIdentity" placeholder="全部">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="管理员" value="1"></el-option>
                        <el-option label="普通用户" value="0"></el-option>
                        <el-option label="社团" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="转化时间">
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
            <el-table :data="identityLog">
                <el-table-column prop="userName" label="用户名"></el-table-column>

                <el-table-column prop="updateAdminName" label="转化操作人"></el-table-column>

                <el-table-column prop="updateReason" label="转化原因">
                    <template #default="scope">
                        {{ scope.row.updateReason || '空' }}
                    </template>
                </el-table-column>

                <el-table-column prop="updateTime" label="转化时间"></el-table-column>

                <el-table-column prop="oldIdentity" label="转化前身份">
                    <template #default="scope">
                        <el-tag :type="getType(scope.row.oldIdentity)">
                            {{ getDisplayName(scope.row.oldIdentity) }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="newIdentity" label="转化后身份">
                    <template #default="scope">
                        <el-tag :type="getType(scope.row.newIdentity)">
                            {{ getDisplayName(scope.row.newIdentity) }}
                        </el-tag>
                    </template>
                </el-table-column>

            </el-table>
        </div>

        <div class="pagination">
            <Page :total="total" :pageChange="pageChange" />
        </div>
    </div>
</template>


<script setup lang="ts" name="IdentityLog">
import Page from '@/common/Page.vue';
import { onMounted, ref } from 'vue';
import { fetchIdentityLog } from '@/api/admin/user/userApi';

interface identityLog {
    id: string;
    userName: string;
    oldIdentity: number;
    newIdentity: number;
    updateTime: string;
    updateReason: number;
    updateAdminName: string;
}

// 接受数据
let identityLog = ref<identityLog[]>([]);
let total = ref(0);

//请求参数
let pageNumber = ref(1);
let pageSize = ref(10);

// 过滤条件表单
const filterForm = ref({
    userName: '',
    oldIdentity: ref(),
    newIdentity: ref(),
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
        oldIdentity: filterForm.value.oldIdentity,
        newIdentity: filterForm.value.newIdentity,
        downTimeStart: formatDateTime(filterForm.value.downTimeRange[0]),
        downTimeEnd: formatDateTime(filterForm.value.downTimeRange[1])
    };

    fetchIdentityLog(
        params,
    )
        .then(response => {
            total.value = response.data.data.total;
            identityLog.value = response.data.data.list;
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
        oldIdentity: ref(),
        newIdentity: ref(),
        downTimeRange: ['', ''] as [string, string]
    };
    fetchData();
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
        return 'danger'
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
        return '超级管理员'
    }
}
</script>

<style scoped lang="scss"></style>