<template>
    <el-page-header @back="goBack">
        <template #content>
            <span class="text-large font-600 mr-3">来自 {{ confessionDetail?.userName }} 的 {{ confessionDetail?.typeStr
                === '找对象' ? '找对象' : '表白' }}贴 </span>
        </template>
    </el-page-header>
    <div class="card-detail-container">
        <div v-if="confessionDetail" class="card-detail">
            <h1>{{ confessionDetail.title }}</h1>
            <div class="user-info">
                <img v-if="confessionDetail.userHead" :src="confessionDetail.userHead" alt="User Head"
                    class="user-head">
                <p><strong>用户名:</strong> {{ confessionDetail.userName }}</p>
            </div>
            <p><strong>内容:</strong> {{ confessionDetail.content }}</p>
            <p><strong>创建时间:</strong> {{ confessionDetail.createTime }}</p>
            <p><strong>概要:</strong> {{ confessionDetail.summary }}</p>
            <p><strong>描述:</strong> {{ confessionDetail.toUserInfo }}</p>
            <p><strong>类型:</strong> {{ confessionDetail.typeStr }}</p>
            <div class="image-container">
                <Image v-if="confessionDetail.image1" :src="confessionDetail.image1" :width="200" class="image" />
                <Image v-if="confessionDetail.image2" :src="confessionDetail.image2" :width="200" class="image" />
                <Image v-if="confessionDetail.image3" :src="confessionDetail.image3" :width="200" class="image" />
            </div>
        </div>
        <div v-else class="loading">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    </div>
    <ElButton @click="toggleComments" class="showButton">查看评论</ElButton>
    <CommentComponent :postId="id" :isShow="isShow" @update:isShow="isShow = $event" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getDetailById } from '@/api/user/ConfessionWallApi';
import Image from '@/common/Image.vue';
import { ElButton } from 'element-plus';
import CommentComponent from '@/common/CommentComponent.vue';

// 详情接口类型
export interface ConfessionDetail {
    content: string;
    createTime: string;
    image1: string;
    image2: string;
    image3: string;
    summary: string;
    title: string;
    toUserInfo: string;
    typeStr: string;
    userHead: string;
    userId: string;
    userName: string;
}

const route = useRoute();
const router = useRouter();

// 详情id
const id = ref<string>('');

// 接口返回的详情数据接收
const confessionDetail = ref<ConfessionDetail | null>(null);

// 是否显示评论抽屉
const isShow = ref(false);

const toggleComments = () => {
    isShow.value = !isShow.value;
};

const goBack = () => {
    router.push({ path: '/userIndex/confessionWall' });
}

// 初始加载，获取详情数据
onMounted(() => {
    id.value = route.params.id as string;
    getDetailById(id.value).then((response) => {
        confessionDetail.value = response.data.data;
    }).catch((error) => {
        console.error('Error fetching detail:', error);
        // 可以在这里添加更多的错误处理逻辑，比如显示错误消息
        alert('加载详情失败，请稍后再试。');
    });
});
</script>

<style scoped>
.card-detail-container {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-detail {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-detail h1 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
    font-weight: bold;
}

.user-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.user-info img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-detail p {
    font-size: 16px;
    margin-bottom: 10px;
    color: #555;
}

.image-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
}

.image-container img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #007bff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.showButton {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #409EFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.showButton:hover {
    background-color: #66B1FF;
}
</style>
