<template>
    <el-page-header @back="goBack">
        <template #content>
            <span class="text-large font-600 mr-3">来自 {{ clubDetail?.clubName }} 的 {{
                clubDetail?.typeName }}贴 </span>
        </template>
    </el-page-header>
    <div class="card-detail-container">
        <div v-if="clubDetail" class="card-detail">
            <h1>{{ clubDetail.title }}</h1>
            <div class="user-info">
                <img v-if="clubDetail.clubHead" :src="clubDetail.clubHead" alt="User Head" class="user-head">
                <p><strong>社团名称:</strong> {{ clubDetail.clubName }}</p>
            </div>
            <template v-if="clubDetail.type === 1">
                <p><strong>社团工作:</strong> {{ clubDetail.daily }}</p>
                <p><strong>社团福利:</strong> {{ clubDetail.welfare }}</p>
                <p><strong>社团要求:</strong> {{ clubDetail.claim }}</p>
                <p><strong>招新计划:{{ clubDetail.already }} / {{ clubDetail.number }}</strong></p>
                <p><strong>时间类型:</strong> {{ clubDetail.timeTypeName }}</p>
                <template v-if="clubDetail.timeType === 2">
                    <p><strong>时间范围</strong> {{ clubDetail.startTime }} 至 {{ clubDetail.endTime }}</p>
                </template>
            </template>
            <template v-else-if="clubDetail.type === 2">
                <p><strong>公告内容:</strong> {{ clubDetail.claim }}</p>
            </template>
            <p><strong>创建时间:</strong> {{ clubDetail.createTime }}</p>
            <div class="image-container">
                <Image v-for="(image, index) in images" :key="index" :src="image" :width="200" class="image" />
            </div>
        </div>
        <div v-else class="loading">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    </div>
    <ElButton @click="toggleComments" class="showButton">查看评论</ElButton>
    <CommentComponent :postId="id" :isShow="isShow" :postType="1" @update:isShow="isShow = $event" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { type Detail, getDetailById } from '@/api/user/Club';
import Image from '@/common/Image.vue';
import { ElButton } from 'element-plus';
import CommentComponent from '@/common/CommentComponent.vue';
import '@/styles/cardDetail.scss'

const route = useRoute();
const router = useRouter();

// 详情id
const id = ref<string>('');

// 接口返回的详情数据接收
const clubDetail = ref<Detail | null>(null);

// 是否显示评论抽屉
const isShow = ref(false);

const toggleComments = () => {
    isShow.value = !isShow.value;
};

const goBack = () => {
    router.push({ path: '/userIndex/club' });
}

// 计算属性，获取图片列表
const images = computed(() => {
    return [clubDetail.value?.image1, clubDetail.value?.image2, clubDetail.value?.image3].filter(Boolean);
});

// 初始加载，获取详情数据
onMounted(() => {
    id.value = route.params.id as string;
    getDetailById(id.value)
        .then((response) => {
            clubDetail.value = response.data.data;
        })
        .catch((error) => {
            console.error('获取详情数据失败:', error);
            // 可以在这里添加用户提示，例如弹窗提示
        });
});
</script>
