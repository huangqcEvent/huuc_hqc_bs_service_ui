<template>
    <el-page-header @back="goBack">
        <template #content>
            <span class="text-large font-600 mr-3">来自 {{ confessionDetail?.userName }} 的 {{ confessionDetail?.typeStr ==
                '找对象' ? '找对象' : '表白' }}贴 </span>
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
    <ElButton @click="getComment()" class="showButton">查看评论
    </ElButton>
    <el-drawer v-model:model-value="isShow" title="评论" direction="rtl" size="40%">
        <div class="comments-container">
            <div class="comments-list">
                <div v-for="(comment, index) in comments" :key="index" class="comment">
                    <img v-if="comment.userHead" :src="comment.userHead" alt="User Head" class="comment-user-head">
                    <div class="comment-content">
                        <p class="username">{{ comment.userName }}</p>
                        <p class="content">{{ comment.content }}</p>
                        <p class="comment-time">{{ comment.createTime }}</p>
                    </div>
                </div>
            </div>
            <form @submit.prevent="addComment()" class="comment-form">
                <textarea v-model="newContent" placeholder="写下你的评论..." required></textarea>
                <button type="submit" class="submit-comment-button">发表评论</button>
            </form>
        </div>
    </el-drawer>
</template>

<script setup lang="ts" name="CardDetail">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getDetailById } from '@/api/user/ConfessionWallApi';
import Image from '@/common/Image.vue';
import { ElButton, ElDrawer } from 'element-plus';

// 详情接口类型
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

// 评论接口类型
interface Comment {
    userHead: string;
    userName: string;
    content: string;
    createTime: string;
}

const route = useRoute();
const router = useRouter();

// 详情id
const id = ref<string>('');

// 接口返回的详情数据接收
const confessionDetail = ref<ConfessionDetail | null>(null);

// 接口返回的评论数据接收
const comments = ref<Comment[]>([]);

// 新的评论接收
const newContent = ref('');

// 点击查看评论，获取评论数据
function getComment() {
    // 显示评论框
    isShow.value = true;
}

// 点击发表评论，后端接口接收
function addComment() {
    // 发表评论的逻辑
}

const isShow = ref(false);
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
    });
    // 初始化一些示例评论数据
    comments.value = [
        {
            userHead: 'https://example.com/user1.jpg',
            userName: '用户1',
            content: '这是一个示例评论。',
            createTime: new Date().toISOString()
        },
        {
            userHead: 'https://example.com/user2.jpg',
            userName: '用户2',
            content: '这是另一个示例评论。',
            createTime: new Date().toISOString()
        },
        {
            userHead: 'https://example.com/user2.jpg',
            userName: '用户2',
            content: '这是另一个示例评论。',
            createTime: new Date().toISOString()
        },
        {
            userHead: 'https://example.com/user2.jpg',
            userName: '用户2',
            content: '这是另一个示例评论。',
            createTime: new Date().toISOString()
        },
        {
            userHead: 'https://example.com/user2.jpg',
            userName: '用户2',
            content: '这是另一个示例评论。',
            createTime: new Date().toISOString()
        },
        {
            userHead: 'https://example.com/user2.jpg',
            userName: '用户2',
            content: '这是另一个示例评论。',
            createTime: new Date().toISOString()
        },
        {
            userHead: 'https://example.com/user2.jpg',
            userName: '用户2',
            content: '这是另一个示例评论。',
            createTime: new Date().toISOString()
        },
        {
            userHead: 'https://example.com/user2.jpg',
            userName: '用户2',
            content: '这是另一个示例评论。',
            createTime: new Date().toISOString()
        },
        {
            userHead: 'https://example.com/user2.jpg',
            userName: '用户2',
            content: '这是另一个示例评论。',
            createTime: new Date().toISOString()
        },
        {
            userHead: 'https://example.com/user2.jpg',
            userName: '用户2',
            content: '这是另一个示例评论。',
            createTime: new Date().toISOString()
        }
    ];
});
</script>


<style scoped>
.card-detail-container {
    display: flex;
    justify-content: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
}

.card-detail {
    flex: 1;
    margin-right: 20px;
    text-align: left;
}

.showButton {
    background-color: #409EFF; /* 背景颜色 */
    color: white; /* 文字颜色 */
    border: none; /* 去掉边框 */
    padding: 10px 20px; /* 内边距 */
    border-radius: 5px; /* 圆角 */
    font-size: 16px; /* 字体大小 */
    cursor: pointer; /* 鼠标悬停时显示手指图标 */
    transition: background-color 0.3s ease; /* 平滑过渡效果 */
}

.showButton:hover {
    background-color: #66B1FF; /* 鼠标悬停时的背景颜色 */
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

.image-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.image {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
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

.comments-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.comments-list {
    flex: 1;
    margin-top: -25px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
}

.comments-list::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
}

.comments-list h2 {
    font-size: 20px;
    margin-bottom: 20px;
    color: #333;
    font-weight: bold;
}

.comment {
    display: flex;
    align-items: flex-start;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    flex: 1;
    margin-top: 10px;
    /* 添加顶部间距 */
    border: 1px solid #ddd;
    /* 添加边框 */
}

.comment:first-child {
    margin-top: 0;
    /* 移除第一个评论的顶部间距 */
}

.comment-user-head {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comment-content {
    flex: 1;
}

.comment-content .username {
    font-size: 12px;
    color: #333;
    margin: 0;
}

.comment-content .content {
    font-size: 14px;
    margin: 5px 0;
    color: #555;
    font-weight: bold;
}

.comment-content .comment-time {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}

.comment-form {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    position: sticky;
    bottom: 0;
}

.comment-form textarea {
    flex: 1;
    height: 50px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
    font-size: 16px;
    margin-right: 10px;
}

.submit-comment-button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.submit-comment-button:hover {
    background-color: #0056b3;
}
</style>