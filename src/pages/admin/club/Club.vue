<template>
    <div class="content">
        <!-- Tabs 切换 -->
        <el-tabs v-model="filterForm.type" @tab-click="handleTabClick">
            <el-tab-pane label="全部" name=""></el-tab-pane>
            <el-tab-pane label="纳新" name="1"></el-tab-pane>
            <el-tab-pane label="公告" name="2"></el-tab-pane>
        </el-tabs>

        <!-- 过滤条件表单 -->
        <div class="filter-form">
            <el-form :model="filterForm" inline>
                <el-form-item label="标题">
                    <el-input v-model="filterForm.title" placeholder="请输入标题"></el-input>
                </el-form-item>

                <el-form-item label="期限" v-if="filterForm.type == 1">
                    <el-select v-model="filterForm.timeType" placeholder="全部">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="长期" value="1"></el-option>
                        <el-option label="固定期限" value="2"></el-option>
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
                    <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="YYYY-MM-DD 00:00:00"
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
            <el-table :data="clubList">
                <el-table-column prop="clubName" label="社团名称"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column v-if="filterForm.type != 1 && filterForm.type != 2" prop="type" label="类型">
                    <template #default="scope">
                        <el-tag :type="scope.row.type === 1 ? 'success' : 'danger'">
                            {{ scope.row.typeName }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template #default="scope">
                        <el-tag :type="getStatusType(scope.row.status)">
                            {{ scope.row.statusName }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="提交时间" width="180"></el-table-column>
                <el-table-column prop="sort" label="排序" width="180">
                    <template #default="scope">
                        <el-popover placement="right" :width="200" trigger="click">
                            <template #reference=>
                                <el-button style="margin-right: 16px">{{ scope.row.sort }}</el-button>
                            </template>
                            <el-input-number v-model="scope.row.sort" :min="0" :max="100"
                                @change="updateToSort(scope.row.id, scope.row.sort)" />
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 纳新特有的列 -->
                <el-table-column v-if="filterForm.type == 1" prop="timeType" label="期限">
                    <template #default="scope">
                        <el-tag type="success" v-if="scope.row.timeType == 1">
                            {{ scope.row.timeTypeName }}
                        </el-tag>
                        <el-tooltip class="box-item" effect="dark"
                            :content="`${scope.row.startTime} 至 ${scope.row.endTime}`" placement="right-start">
                            <el-tag type="error" v-if="scope.row.timeType == 2">
                                {{ scope.row.timeTypeName }}
                            </el-tag>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column v-if="filterForm.type == 1" prop="number" label="已招人数">
                    <template #default="scope">
                        <el-tag type="success">
                            {{ scope.row.already }} / {{ scope.row.number }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="状态操作">
                    <template #default="scope">
                        <el-button v-if="scope.row.status == 1 || scope.row.status == 2"
                            @click="updateStatus(scope.row.id, scope.row.status)">
                            {{ scope.row.status == 1 ? '设为私密' : '设为正常' }}
                        </el-button>
                        <el-tag v-else type="info">状态不可切换</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="详情">
                    <template #default="scope">
                        <el-button
                            @click="pushDetail(scope.row.clubId, scope.row.id, 3, null, scope.row.status)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <Page :total="total" :pageChange="pageChange" />
        </div>
    </div>
</template>

<script setup lang="ts" name="Club">
import Page from '@/common/Page.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import '@/styles/modal.scss'
import { type ClubPage, type ClubList, pageQuery, updateToStatus, updateSort } from '@/api/user/Club'
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();

// 接受数据
let clubList = ref<ClubList[]>([]);
let total = ref(0);
let dateRange = ref(["", ""])

// 过滤条件表单
const filterForm = ref<ClubPage>({
    pageNumber: 1,
    pageSize: 10,
    title: '',
    type: null,
    status: null,
    timeType: null,
    createTimeStart: dateRange.value[0],
    createTimeEnd: dateRange.value[1]
});

// 初始加载数据
onMounted(() => {
    fetchData();
});

// 发送请求获取数据
const fetchData = async () => {
    const response = await pageQuery(filterForm.value, 'admin');
    clubList.value = response.data.data.list;
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
    dateRange.value = ['', '']
    filterForm.value = {
        pageNumber: filterForm.value.pageNumber,
        pageSize: filterForm.value.pageSize,
        title: '',
        type: filterForm.value.type,
        status: null,
        timeType: null,
        createTimeStart: dateRange.value[0],
        createTimeEnd: dateRange.value[1]
    };
    fetchData();
}

const applyFilters = () => {
    if (dateRange.value) {
        filterForm.value.createTimeStart = dateRange.value[0];
        filterForm.value.createTimeEnd = dateRange.value[1];
    } else {
        filterForm.value.createTimeStart = '';
        filterForm.value.createTimeEnd = '';
    }
    filterForm.value.pageNumber = 1; // 重置页码
    fetchData();
};

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

// Tab 切换处理
function handleTabClick(tab: any) {
    filterForm.value.type = tab.paneName;
    filterForm.value.pageNumber = 1; // 重置页码
    fetchData();
}

// 切换状态
function updateStatus(id: string, status: number) {
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
        updateToStatus({ id, status: newStatus }, 'admin').then(() => {
            fetchData();
        });
    }).catch(() => {
        ElMessage.info('已取消操作');
    });
}

//更改排序
function updateToSort(id: string, sort: number) {
    updateSort({ id, sort }, 'admin').then(() => {
        fetchData();
    })
}

//跳转详情
function pushDetail(userId: string, postId: string, postType: number, id: string | null, status: number) {
    router.push(`/adminIndex/detail/${userId}/${postId}/${postType}/${id}/${status}`)
}
</script>
