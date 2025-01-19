<template>
    <div class="content">
        <!-- 过滤条件表单 -->
        <div class="filter-form">
            <el-form :model="filterForm" inline>
                <el-form-item label="用户名">
                    <el-input v-model="filterForm.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>

                <el-form-item label="类型">
                    <el-select v-model="filterForm.type" placeholder="全部">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="找对象" value="1"></el-option>
                        <el-option label="表白" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="状态">
                    <el-select v-model="filterForm.status" placeholder="全部">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="发布" value="1"></el-option>
                        <el-option label="私密" value="2"></el-option>
                        <el-option label="删除" value="3"></el-option>
                        <el-option label="待审核" value="4"></el-option>
                        <el-option label="已完结" value="5"></el-option>
                        <el-option label="拒审待修改" value="6"></el-option>
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
        <div class="container">
            <el-table :data="confessionList">
                <el-table-column prop="realName" label="用户名"></el-table-column>

                <el-table-column prop="type" label="类型">
                    <template #default="scope">
                        <el-tag :type="scope.row.type ? 'success' : 'danger'">{{ scope.row.typeName }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="isAnonymous" label="是否匿名">
                    <template #default="scope">
                        <el-tag :type="scope.row.isAnonymous ? 'success' : 'danger'">{{
                            scope.row.isAnonymousName }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="status" label="状态">
                    <template #default="scope">
                        <el-tag :type="getStatusType(scope.row.status)">
                            {{ scope.row.statusName }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="isTop" label="是否置顶">
                    <template #default="scope">
                        <el-tag :type="scope.row.isTop ? 'success' : 'danger'">{{ scope.row.isTopName }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="发布时间" width="180"></el-table-column>

                <el-table-column label="状态操作">
                    <template #default="scope">
                        <el-button v-if="(scope.row.status === 1 || scope.row.status === 2)" type="primary" plain
                            @click.stop="updateStatus(scope.row.id, scope.row.status, getNextStatus(scope.row.status), scope.row.userId)">
                            {{ getNextStatusLabel(scope.row.status) }}
                        </el-button>
                        <el-tag v-else type="info">状态不可切换</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="排序">
                    <template #default="scope">
                        <el-button type="primary" plain
                            @click.stop="updateTop(scope.row.id, scope.row.isTop === 1 ? 0 : 1, scope.row.userId)">
                            {{ scope.row.isTop === 1 ? "取消置顶" : "设为置顶" }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="详情">
                    <template #default="scope">
                        <el-button @click="pushDetail(scope.row.userId, scope.row.id, 1, null,scope.row.status)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <div class="pagination">
        <Page :total="total" :pageChange="pageChange" />
    </div>
</template>

<script setup lang="ts" name="DownLog">
import Page from '@/common/Page.vue';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { cardQuery, updateConfessionStatus, updateTopService } from '@/api/user/ConfessionWallApi';
import { ElMessage, ElMessageBox } from 'element-plus';
import '@/styles/modal.scss'

const router = useRouter();
// 列表数据
interface Confession {
    id: string;
    userId: string;
    realName: string;
    type: number;
    typeName: string;
    isAnonymous: number;
    isAnonymousName: string;
    isTop: number;
    isTopName: string;
    createTime: string;
    status: number;
    statusName: string;
    identity: number; // 添加 identity 字段
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
    cardQuery(params, 'admin').then((response) => {
        confessionList.value = response.data.data.list;
        total.value = response.data.data.total;
    })
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

// 修改表白墙状态
function updateStatus(id: string, oldStatus: number, newStatus: number, userId: string) {
    ElMessageBox.prompt(
        `确定要将此表白贴的状态修改为${getNextStatusLabel(newStatus)}吗？`,
        '请输入原因并确定',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then((value) => {
        const params = {
            confessionId: id,
            oldStatus: oldStatus,
            userId: userId,
            newStatus: newStatus,
            updateReason: value.value
        }
        updateConfessionStatus(params, 'admin').then(() => {
            fetchData();
        })
    }).catch(() => {
        ElMessage.info('已取消操作');
    });
}

// 置顶/取消置顶
function updateTop(id: string, newTop: number, userId: string) {
    const params = {
        confessionId: id,
        newTop: newTop,
        userId
    }
    ElMessageBox.confirm(
        '确定要' + (newTop == 1 ? '设为置顶吗' : '取消置顶吗'),
        'Warning',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            updateTopService(params, 'admin').then(() => {
                fetchData();
            })
        })
        .catch(() => {
            ElMessage.info('操作取消');
        })
}

// 获取状态标签类型
function getStatusType(status: number): string {
    switch (status) {
        case 1:
            return 'success';
        case 2:
            return 'info';
        case 3:
            return 'danger';
        case 4:
            return 'warning';
        case 5:
            return 'info';
        case 6:
            return 'error';
        default:
            return 'default';
    }
}

// 获取下一个状态
function getNextStatus(currentStatus: number): number {
    switch (currentStatus) {
        case 1:
            return 2; // 发布 -> 私密
        case 2:
            return 1; // 私密 -> 发布
        default:
            return currentStatus; // 其他状态不变
    }
}

// 获取下一个状态的标签文本
function getNextStatusLabel(currentStatus: number): string {
    switch (currentStatus) {
        case 1:
            return '设为私密';
        case 2:
            return '正常显示';
        default:
            return '状态不可切换';
    }
}

//跳转详情
function pushDetail(userId: string, postId: string, postType: number, id: string | null,status:number) {
    router.push(`/adminIndex/detail/${userId}/${postId}/${postType}/${id}/${status}`)
}
</script>
