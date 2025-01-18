<template>
    <div class="detail-info">
        <el-divider style="margin-top: 0" />
        <div class="detail-header">
            <span>审批</span>
        </div>
        <div class="detail-content">
            <div class="base-item">
                <div>
                    <el-radio-group v-model="from.result">
                        <el-radio value="1" size="large" border>通过</el-radio>
                        <el-radio value="2" size="large" border>不通过</el-radio>
                    </el-radio-group>
                </div>
                <div style="margin-top: 16px;">
                    <el-input v-model="from.remark" style="width: 340px" :rows="2" type="textarea"
                        placeholder="请输入审批备注" />
                </div>
                <div style="margin-top: 16px;">
                    <el-button type="success" @click="audit">确定审批</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="AuditStart">
import { ref } from 'vue';
import { defineProps } from 'vue';

const props = defineProps<{
    id: string;
}>();

const from = ref({
    id: props.id,
    result: '1',
    remark: ''
});

function audit() {
    console.log(from.value)
}
</script>

<style scoped></style>
