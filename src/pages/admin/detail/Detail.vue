<template>
    <div>
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item @click="goBack" class="bold-text" :title="getPageName(postType) + '列表'">
                {{ getPageName(postType) }}列表
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{ getPageName(postType) }}详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="scroll-container">
            <UserInfo :userInfo="detailData?.userInfo" v-if="detailData?.userInfo" />
            <ClubInfo :clubDataInfo="detailData?.clubRecruitmentNewsInfo" v-if="detailData?.clubRecruitmentNewsInfo" />
            <LostItem :lostItemInfoData="detailData?.lostItemInfo" v-if="detailData?.lostItemInfo" />
            <ConfessionInfo :confessionInfoData="detailData?.confessionInfo" v-if="detailData?.confessionInfo" />
            <AuditInfo :auditInfoData="detailData?.auditInfo" v-if="detailData?.auditInfo" />
            <AuditStart :id="id" v-if="id != 'null' && status == 2" />
        </div>
    </div>
</template>

<script lang="ts" setup name="Detail">
import { ArrowRight } from '@element-plus/icons-vue'
import { type DetailData, getDetail } from '@/api/admin/detail/detailApi';
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue';
import UserInfo from './UserInfo.vue';
import ClubInfo from './ClubInfo.vue';
import LostItem from './LostItem.vue';
import ConfessionInfo from './ConfessionInfo.vue';
import AuditInfo from './AuditInfo.vue';
import AuditStart from './AuditStart.vue';

const route = useRoute();
const router = useRouter();
const userId = route.params.userId as string;
const postId = route.params.postId as string;
const postType = parseInt(route.params.postType as string);
const status = parseInt(route.params.status as string);

// 流水号
const id = route.params.id as string;

let detailData = ref<DetailData | null>(null);

function getPageName(type: number) {
    switch (type) {
        case 1: return '表白墙贴'
        case 2: return '寻物贴'
        case 3: return '社团贴'
        default: return '未知贴'
    }
}

function goBack() {
    router.back();
}

onMounted(() => {
    getDetail({ userId, postId, postType }, 'admin').then((res) => {
        detailData.value = res.data.data;
    })
})
</script>

<style scoped>
.scroll-container {
    height: calc(100vh - 60px);
    /* 减去面包屑的高度 */
    overflow-y: auto;
    position: relative;
    padding: 16px;
    /* 添加内边距 */
    box-sizing: border-box;
    /* 确保内边距和边框包含在高度内 */
}

.bold-text {
    font-weight: bold;
    cursor: pointer;
}
</style>
