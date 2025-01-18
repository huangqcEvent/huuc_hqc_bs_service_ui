<template>
    <div>
        <div class="detail-info">
            <el-divider style="margin-top: 0" />
            <div class="detail-header">
                <span>审批记录</span>
            </div>
            <div class="detail-content">
                <div class="base-item">
                        <el-table :data="props.auditInfoData" border show-overflow-tooltip>
                            <el-table-column label="审批类型" prop="auditTypeName" />
                            <el-table-column label="审批人" prop="auditUserName" />
                            <el-table-column label="审批时间" prop="auditTime" />
                            <el-table-column label="审批结果" prop="auditResultName" />
                            <el-table-column label="备注" prop="auditReason" />
                        </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="ClubInfo">
import { type AuditInfoData } from '@/api/admin/detail/detailApi'

const props = defineProps<{
    auditInfoData: AuditInfoData[]
}>()
</script>

<style lang="scss">
.approval-table__info {
    padding-bottom: 24px;
}
</style>
