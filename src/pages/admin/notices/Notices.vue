<template>
    <div class="container">
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
        <div class="content">
            <el-table :data="noticeList">

                <el-table-column prop="userName" label="用户名称"></el-table-column>
                <el-table-column prop="itemName" label="物品名称"></el-table-column>

                <el-table-column prop="type" label="类型">
                    <template #default="scope">
                        <el-tag :type="scope.row.type === 1 ? 'success' : 'danger'">{{ scope.row.type === 1 ? '寻物' :
                            '寻主'
                            }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="status" label="状态">
                    <template #default="scope">
                        <el-tag :type="getStatusType(scope.row.status)">
                            {{ getStatusLabel(scope.row.status) }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="isTop" label="是否置顶">
                    <template #default="scope">
                        <el-tag :type="scope.row.isTop ? 'success' : 'danger'">{{ scope.row.isTop === 1 ? '是' : '否'
                            }}</el-tag>
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
                <el-table-column label="详情">
                    <template #default="scope">
                        <el-button type="primary" plain @click.stop="showDetails(scope.row.id)">
                            查看详情
                        </el-button>
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
            </el-table>
            <!-- 自定义模态框 -->
            <div v-if="dialogVisible" class="modal-overlay">
                <div class="modal-content">
                    <div v-if="lostItemDetail">
                        <h3>{{ lostItemDetail.itemName }}</h3>
                        <p><strong>用户名:</strong> {{ lostItemDetail.userName }}</p>
                        <p><strong>用户头像:</strong> <img :src="lostItemDetail.head" alt="User Head"
                                style="max-width: 50px;">
                        </p>
                        <p><strong>失物名称:</strong> {{ lostItemDetail.itemName }}</p>
                        <p><strong>丢失地点:</strong> {{ lostItemDetail.location }}</p>
                        <p><strong>描述:</strong> {{ lostItemDetail.itemDesc }}</p>
                        <p><strong>发布时间:</strong> {{ lostItemDetail.createTime }}</p>
                        <p><strong>类型:</strong> {{ lostItemDetail.type == 1 ? '寻物' : '寻主' }}</p>
                        <p><strong>联系方式:</strong> {{ lostItemDetail.phone }}</p>
                        <div class="image-container">
                            <img v-if="lostItemDetail.image1" :src="lostItemDetail.image1" alt="Image 1">
                            <img v-if="lostItemDetail.image2" :src="lostItemDetail.image2" alt="Image 2">
                            <img v-if="lostItemDetail.image3" :src="lostItemDetail.image3" alt="Image 3">
                        </div>
                    </div>
                    <span class="modal-footer">
                        <el-button @click="dialogVisible = false">关闭</el-button>
                    </span>
                </div>
            </div>
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
import { lostItemPage, updateStatus } from '@/api/user/LostItemApi'
import { ElMessage, ElMessageBox } from 'element-plus';
import { getDetailById, updateTopService } from '@/api/user/LostItemApi'
import type { LostItemDetail } from '@/pages/user/Notices/LostItemDetail.vue';
import '@/styles/modal.scss'

// 获取用户身份参数
const route = useRoute();

// 接受数据
let noticeList = ref<LostItem[]>([]);
let total = ref(0);
let dialogVisible = ref(false);
let lostItemDetail = ref<LostItemDetail | null>(null);

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

function showDetails(id: string) {
    getDetailById(id, 'admin').then((response) => {
        lostItemDetail.value = response.data.data;
        dialogVisible.value = true;
    });
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

// 获取状态标签文本
function getStatusLabel(status: number): string {
    switch (status) {
        case 1:
            return '发布';
        case 2:
            return '私密';
        case 3:
            return '删除';
        case 4:
            return '待审核';
        case 5:
            return '已完结';
        case 6:
            return '拒审待修改'
        default:
            return '未知';
    }
}
</script>
