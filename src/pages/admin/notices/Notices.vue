<template>
    <div class="content">
        <!-- 过滤条件表单 -->
        <div class="filter-form">
            <el-form :model="filterForm" inline>
                <el-form-item label="物品名">
                    <el-input v-model="filterForm.itemName" placeholder="请输入物品名称"></el-input>
                </el-form-item>

                <el-form-item label="类型">
                    <el-select v-model="filterForm.type" placeholder="全部">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="寻物" value="1"></el-option>
                        <el-option label="寻主" value="2"></el-option>
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
                    <el-date-picker v-model="filterForm.dateRange" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD 00:00:00"
                        @change="applyFilters"></el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="fetchData">搜索</el-button>
                    <el-button @click="clearFilters">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 寻物列表 -->
        <div class="container">
            <el-table :data="noticeList">

                <el-table-column prop="userName" label="用户名称"></el-table-column>
                <el-table-column prop="itemName" label="物品名称"></el-table-column>

                <el-table-column prop="type" label="类型">
                    <template #default="scope">
                        <el-tag :type="scope.row.type === 1 ? 'success' : 'danger'">{{ scope.row.typeName }}</el-tag>
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
                        <el-button v-if="scope.row.status === 1 || scope.row.status === 2"
                            @click="toggleStatus(scope.row.id, scope.row.status)">
                            {{ scope.row.status === 1 ? '设为私密' : '设为正常' }}
                        </el-button>
                        <el-tag v-else type="info">状态不可切换</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="排序">
                    <template #default="scope">
                        <el-button type="primary" plain
                            @click.stop="updateTop(scope.row.id, scope.row.isTop === 1 ? 0 : 1)">
                            {{ scope.row.isTop === 1 ? "取消置顶" : "设为置顶" }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="详情">
                    <template #default="scope">
                        <el-button
                            @click="pushDetail(scope.row.userId, scope.row.id, 2, null, scope.row.status)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <Page :total="total" :pageChange="pageChange" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="Notices">
import Page from '@/common/Page.vue';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import type { LostItem, Params } from '@/api/user/LostItemApi';
import { lostItemPage, updateStatus } from '@/api/user/LostItemApi'
import { ElMessage, ElMessageBox } from 'element-plus';
import { updateTopService } from '@/api/user/LostItemApi'
import '@/styles/modal.scss'

const router = useRouter();
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
    status: null,
    dateRange: ['', '']
});

// 初始加载数据
onMounted(() => {
    fetchData();
});

// 发送请求获取数据
const fetchData = async () => {
    const response = await lostItemPage(filterForm.value, 'admin');
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

// 置顶与取消置顶
function updateTop(id: string, newTop: number) {
    const params = {
        id: id,
        newTop: newTop
    }
    ElMessageBox.confirm(
        '确定要' + (newTop == 1 ? '设为置顶吗' : '取消置顶吗'),
        '修改状态',
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

// 切换状态
function toggleStatus(id: string, status: number) {
    ElMessageBox.confirm(
        '确定要' + (status == 1 ? '设为私密吗' : '设为正常吗'),
        'Warning',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        const newStatus = status === 1 ? 2 : 1;
        updateStatus({ id, status: newStatus }, 'admin').then(() => {
            fetchData();
        });
    }).catch(() => {
        ElMessage.info('已取消操作');
    });
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

//跳转详情
function pushDetail(userId: string, postId: string, postType: number, id: string | null, status: number) {
    router.push(`/adminIndex/detail/${userId}/${postId}/${postType}/${id}/${status}`)
}
</script>
