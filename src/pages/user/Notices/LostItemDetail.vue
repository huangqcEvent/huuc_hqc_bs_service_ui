<template>
    <el-page-header @back="goBack">
        <template #content>
            <span class="text-large font-600 mr-3">来自 {{ lostItemDetail?.userName }} 的 {{ lostItemDetail?.type
                === 1 ? '寻物' : '寻主' }}贴 </span>
        </template>
    </el-page-header>
    <div class="card-detail-container">
        <div v-if="lostItemDetail" class="card-detail">
            <h1>{{ lostItemDetail.itemName }}</h1>
            <div class="user-info">
                <img v-if="lostItemDetail.head" :src="lostItemDetail.head" alt="User Head"
                    class="user-head">
                <p><strong>用户名:</strong> {{ lostItemDetail.userName }}</p>
            </div>
            <p><strong>失物名称:</strong> {{ lostItemDetail.itemName }}</p>
            <p><strong>失物描述:</strong> {{ lostItemDetail.itemDesc }}</p>
            <p><strong>丢失地点:</strong> {{ lostItemDetail.location }}</p>
            <p><strong>联系方式（电话）:</strong> {{ lostItemDetail.phone }}</p>
            <p><strong>发布时间:</strong> {{ lostItemDetail.createTime }}</p>
            <div class="image-container">
                <Image v-if="lostItemDetail.image1" :src="lostItemDetail.image1" :width="200" class="image" />
                <Image v-if="lostItemDetail.image2" :src="lostItemDetail.image2" :width="200" class="image" />
                <Image v-if="lostItemDetail.image3" :src="lostItemDetail.image3" :width="200" class="image" />
            </div>
        </div>
        <div v-else class="loading">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    </div>
    <ElButton @click="toggleComments" class="showButton">查看评论</ElButton>
    <CommentComponent :postId="id" :isShow="isShow" :postType=2 @update:isShow="isShow = $event" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getDetailById } from '@/api/user/LostItemApi';
import Image from '@/common/Image.vue';
import { ElButton } from 'element-plus';
import CommentComponent from '@/common/CommentComponent.vue';

// 详情接口类型
export interface LostItemDetail {
    id:string// 寻物贴id
    userId:string // 发布者id
    userName:string // 发布者用户名
    head:string // 发布者头像
    itemName:string // 失物名称
    type:number // 类型 1寻物 2寻主
    itemDesc:string // 失物描述
    location:string // 丢失地点
    phone:string // 联系方式（电话）
    createTime:string // 发布时间
    image1:string // 图片1
    image2:string // 图片2
    image3:string // 图片3
}

const route = useRoute();
const router = useRouter();

// 详情id
const id = ref<string>('');

// 接口返回的详情数据接收
const lostItemDetail = ref<LostItemDetail | null>(null);

// 是否显示评论抽屉
const isShow = ref(false);

const toggleComments = () => {
    isShow.value = !isShow.value;
};

const goBack = () => {
    router.push({ path: '/userIndex/notice' });
}

// 初始加载，获取详情数据
onMounted(() => {
    id.value = route.params.id as string;
    getDetailById(id.value).then((response) => {
        lostItemDetail.value = response.data.data;
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

.card-detail p {
    font-size: 16px;
    margin-bottom: 10px;
    color: #555;
    max-width: 50%; /* 设置最大宽度为容器宽度的50% */
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
