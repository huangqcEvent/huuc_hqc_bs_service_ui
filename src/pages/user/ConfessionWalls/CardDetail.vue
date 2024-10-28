<template>
    <el-page-header @back="goBack">
        <template #content>
            <span class="text-large font-600 mr-3">来自 {{ confessionDetail?.userName }} 的 {{ confessionDetail?.typeStr=='找对象'?'找对象':'表白' }}贴 </span>
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
            <div>
                <Image v-if="confessionDetail.image1" :src="confessionDetail.image1" :width="500" />
                <Image v-if="confessionDetail.image2" :src="confessionDetail.image2" :width="500" />
                <Image v-if="confessionDetail.image3" :src="confessionDetail.image3" :width="500" />
            </div>
        </div>
        <div v-else class="loading">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    </div>
</template>

<script setup lang="ts" name="CardDetail">
import { ref, onMounted } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { getDetailById } from '@/api/user/ConfessionWallApi';
import Image from '@/common/Image.vue';

interface ConfessionDetail {
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
const id = ref<string>('');
const confessionDetail = ref<ConfessionDetail | null>(null);
const goBack = () => {
    router.push({path:'/userIndex/confessionWall'})
}

onMounted(() => {
    id.value = route.params.id as string;
    getDetailById(id.value).then((response) => {
        confessionDetail.value = response.data.data;
    }).catch((error) => {
        console.error('Error fetching detail:', error);
        // 可以在这里添加更多的错误处理逻辑，比如显示错误消息
    });
});
</script>

<style scoped>
.card-detail-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
}

.card-detail {
    text-align: left;
}

.card-detail h1 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
    font-weight: bold;
}

.card-detail p {
    font-size: 16px;
    margin-bottom: 15px;
    color: #555;
}

.card-detail strong {
    color: #333;
    font-weight: bold;
}

.user-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.user-head {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading {
    text-align: center;
    padding: 20px;
    font-size: 18px;
    color: #777;
}

.spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #333;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 10px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>