<template>
    <div class="container">
        <div class="content">
            <el-table :data="pageData">
                <el-table-column prop="id" label="流水号" width="180" />
                <el-table-column prop="postType" label="贴大类型">
                    <template #default="scope">
                        <el-tag :type="getStatusType(scope.row.postType)">
                            {{ getStatusLabel(scope.row.postType) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="postSubType" label="贴小类型">
                    <template #default="scope">
                        <el-tag :type="getStatusSubType(scope.row.postSubType)">
                            {{ getStatusSubLabel(scope.row.postType, scope.row.postSubType) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="用户名称" />
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="createTime" label="提交时间" width="180" />
                <el-table-column v-if="status === '2' || status === '3' "prop="autoAuditTime" label="机器审核时间" width="180" />
                <el-table-column v-if="status === '3'" prop="auditTime" label="人工审核时间" width="180" />
                <el-table-column v-if="status === '4' || status === '3'" prop="auditUserName" label="审核人名称" />
                <el-table-column v-if="status === '4'" prop="reason" label="拒绝原因" />
            </el-table>
        </div>
    </div>
</template>

<script lang="ts" setup name="AutoAuditList">
import { type PageData } from '@/api/admin/audit/auditApi'

// 接收父组件传递的 props
const props = defineProps<{
    pageData: PageData[];
    status: string;
    total: number;
}>();

// 获取状态标签类型
function getStatusType(status: number): string {
    switch (status) {
        case 1:
            return 'success';
        case 2:
            return 'info';
        case 3:
            return 'danger';
        default:
            return 'default'
    }
}

// 获取状态标签文本
function getStatusLabel(status: number): string {
    switch (status) {
        case 1:
            return '表白墙';
        case 2:
            return '寻物';
        case 3:
            return '社团';
        default:
            return '未知';
    }
}


// 获取状态标签类型
function getStatusSubType(status: number): string {
    switch (status) {
        case 1:
            return 'success';
        case 2:
            return 'info';
        default:
            return 'default'
    }
}

// 获取状态标签文本
function getStatusSubLabel(bigType: number, summelType: number): string {
    switch (bigType) {
        case 1:
            return summelType == 1 ? '找对象' : '表白';
        case 2:
            return summelType == 1 ? '寻物' : '寻主';
        case 3:
            return summelType == 1 ? '纳新' : '公告';
        default:
            return '未知';
    }
}
</script>
