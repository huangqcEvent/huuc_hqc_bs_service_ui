<template>
    <div class="container">
        <!-- 过滤条件表单 -->
        <div class="filter-form">
            <el-form :model="filterForm" inline>
                <el-form-item label="用户名">
                    <el-input v-model="filterForm.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>

                <el-form-item label="类型">
                    <el-select v-model="filterForm.type" placeholder="全部">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="找对象" value="0"></el-option>
                        <el-option label="表白" value="1"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="状态">
                    <el-select v-model="filterForm.status" placeholder="全部">
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
            <el-table :data="confessionList">
                <el-table-column prop="realName" label="用户名"></el-table-column>

                <el-table-column prop="type" label="类型">
                    <template #default="scope">
                        <el-tag :type="scope.row.type ? 'success' : 'danger'">{{ scope.row.type === 1 ? '表白贴' : '找对象贴'
                            }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="isAnonymous" label="是否匿名">
                    <template #default="scope">
                        <el-tag :type="scope.row.isAnonymous ? 'success' : 'danger'">{{ scope.row.isAnonymous === 1 ?
                            '是' : '否' }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="status" label="状态">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                            {{ scope.row.status === 1 ? '正常' : scope.row.status === 2 ? '私密' : '删除' }}
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

                <el-table-column label="操作1">
                    <template #default="scope">
                        <el-button v-if="canBanUser(scope.row.identity)" type="primary" plain
                            @click.stop="updateStatus(scope.row.id, scope.row.status, scope.row.status === 1 ? 2 : 1, scope.row.userId)">
                            {{ scope.row.status === 1 ? '设为私密' : scope.row.status === 2 ? '正常显示' : '已删除' }}
                        </el-button>
                        <el-tag v-else type="danger">无权限</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作2">
                    <template #default="scope">
                        <el-button v-if="canBanUser(scope.row.identity)" type="primary" plain
                            @click.stop="updateTop(scope.row.id, scope.row.isTop === 1 ? 0 : 1)">
                            {{ scope.row.isTop === 1 ? "取消置顶" : "设为置顶" }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作3">
                    <template #default="scope">
                        <el-button type="primary" plain @click.stop="showDetails(scope.row.id)">
                            查看详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 自定义模态框 -->
            <div v-if="dialogVisible" class="modal-overlay">
                <div class="modal-content">
                    <div v-if="confessionDetail">
                        <h3>{{ confessionDetail.title }}</h3>
                        <p><strong>用户名:</strong> {{ confessionDetail.userName }}</p>
                        <p><strong>用户头像:</strong> <img :src="confessionDetail.userHead" alt="User Head"
                                style="max-width: 50px;">
                        </p>
                        <p><strong>内容:</strong> {{ confessionDetail.content }}</p>
                        <p><strong>摘要:</strong> {{ confessionDetail.summary }}</p>
                        <p><strong>创建时间:</strong> {{ confessionDetail.createTime }}</p>
                        <p><strong>类型:</strong> {{ confessionDetail.typeStr }}</p>
                        <p><strong>接收者信息:</strong> {{ confessionDetail.toUserInfo }}</p>
                        <div class="image-container">
                            <img v-if="confessionDetail.image1" :src="confessionDetail.image1" alt="Image 1">
                            <img v-if="confessionDetail.image2" :src="confessionDetail.image2" alt="Image 2">
                            <img v-if="confessionDetail.image3" :src="confessionDetail.image3" alt="Image 3">
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


<script setup lang="ts" name="DownLog">
import Page from '@/common/Page.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { cardQuery, updateConfessionStatus, updateTopService } from '@/api/user/ConfessionWallApi';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { ConfessionDetail } from '@/pages/user/ConfessionWalls/CardDetail.vue';
import { getDetailById } from '@/api/user/ConfessionWallApi';
import '@/styles/modal.scss'

// 获取用户身份参数
const route = useRoute();
let identity = ref(Number(route.query.identity)); // 确保 identity 是数字

// 列表数据
interface Confession {
    id: string;
    userId: string;
    realName: string;
    type: number;
    isAnonymous: number;
    isTop: number;
    createTime: string;
    status: number;
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

// 详情模态框相关
let dialogVisible = ref(false);
let confessionDetail = ref<ConfessionDetail | null>(null);

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
    }).catch((error) => {
        console.error('请求失败:', error);
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
        status: '',
        type: '',
        createTimeRange: ["", ""]
    };
    fetchData();
}

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

// 修改表白墙状态
function updateStatus(id: string, oldStatus: number, newStatus: number, userId: string) {
    ElMessageBox.prompt(
        `确定要将此表白贴的状态修改为${newStatus === 1 ? '正常' : newStatus === 2 ? '私密' : '删除'}吗？`,
        '请输入原因并确定',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
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
            ElMessage.success('状态修改成功');
            fetchData();
        })
    }).catch(() => {
        ElMessage.info('已取消操作');
    });
}

// 置顶/取消置顶
function updateTop(id: string, newTop: number) {
    const params = {
        confessionId: id,
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
                ElMessage.success("设置成功");
                fetchData();
            })
        })
        .catch(() => {
            ElMessage.info('操作取消');
        })
}

// 显示详细信息
function showDetails(id: string) {
    getDetailById(id, 'admin').then((response) => {
        confessionDetail.value = response.data.data;
        dialogVisible.value = true;
    }).catch((error) => {
        console.error('Error fetching detail:', error);
        ElMessage.error('加载详情失败，请稍后再试。');
    });
}
</script>