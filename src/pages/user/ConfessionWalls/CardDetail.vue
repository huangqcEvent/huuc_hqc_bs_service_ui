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
    <ElButton @click="getComment()" class="showButton">查看评论</ElButton>
    <el-drawer v-model:model-value="isShow" :title="`评论 (${total})`" direction="rtl" size="40%">
        <div class="comments-container">
            <el-scrollbar>
                <div class="comments-list">
                    <div v-for="(comment, index) in comments" :key="index" class="comment">
                        <img v-if="comment.userHead" :src="comment.userHead" alt="User Head" class="comment-user-head">
                        <div class="comment-content">
                            <p class="username">{{ comment.userName }}</p>
                            <p class="content">{{ comment.content }}</p>
                            <Image v-if="comment.imageUrl" :src="comment.imageUrl" :width="200" class="image"/>
                            <p class="comment-time">{{ comment.createTime }}</p>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
            <form @submit.prevent="addComment()" class="comment-form">
                <textarea v-model="newContent" placeholder="写下你的评论..." required></textarea>
                <div class="image-upload">
                    <button type="button" @click="selectImage" class="upload-button">上传图片</button>
                    <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*"
                        style="display: none;" />
                    <div v-if="newImageUrl" class="image-preview">
                        <img :src="newImageUrl" alt="Preview" class="preview-image" />
                    </div>
                </div>
                <button type="submit" class="submit-comment-button">发表评论</button>
            </form>
        </div>
    </el-drawer>
</template>


<script setup lang="ts" name="CardDetail">import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getDetailById } from '@/api/user/ConfessionWallApi';
import { upload } from '@/api/commonApi/commonApi';
import Image from '@/common/Image.vue';
import { ElButton, ElDrawer, ElMessage } from 'element-plus';
import type { CommentParams } from '@/types/comment'
import { saveComment,getComments } from '@/api/user/CommentApi';

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

// 评论接口类型
interface Comment {
    id:string;
    userHead: string;
    userName: string;
    content: string;
    createTime: string;
    imageUrl?: string; // 添加图片 URL 字段
}

const total = ref();

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
const newImageFile = ref<File | null>(null); // 新的图片文件
const newImageUrl = ref<string | null>(null); // 新的图片预览 URL

// 点击查看评论，获取评论数据
async function getComment() {
    // 显示评论框
    isShow.value = true;
    //获取所有评论
    await getComments(id.value).then((response)=>{
        comments.value =  response.data.data.list
        total.value = response.data.data.total
    })
}

// 处理文件选择
function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        newImageFile.value = target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            newImageUrl.value = reader.result as string;
        };
        reader.readAsDataURL(newImageFile.value);
    }
}

// 打开文件选择对话框
function selectImage() {
    const fileInput = document.querySelector<HTMLInputElement>('.comment-form input[type="file"]');
    if (fileInput) {
        fileInput.click();
    }
}

// 点击发表评论，后端接口接收
async function addComment() {
    let imageUrl = '';
    if (newImageFile.value) {
        try {
            const response = await upload(newImageFile.value);
            imageUrl = response.data.msg;
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('上传图片失败，请稍后再试。');
            return;
        }
    }

    //构建新增评论参数a
    const params: CommentParams = {
        postId: id.value,
        postType: 1,
        content: newContent.value,
        imageUrl: imageUrl
    }
 
    //发送请求保存评论
    saveComment(params).then((response)=>{
        ElMessage.success(response.data.msg)
        //刷新评论列表
        getComment();
    })

    newContent.value = '';
    newImageFile.value = null;
    newImageUrl.value = null;
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
        alert('加载详情失败，请稍后再试。');
    });
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
    background-color: #409EFF;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.showButton:hover {
    background-color: #66B1FF;
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
    gap: 10px;
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
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    margin-bottom: 20px;
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
    border: 1px solid #ddd;
}

.comment:first-child {
    margin-top: 0;
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
    z-index: 10;
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

.upload-button {
    padding: 10px 20px;
    background-color: #409EFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.upload-button:hover {
    background-color: #66B1FF;
}

.image-upload {
    display: flex;
    align-items: center;
    margin-left: 10px;
}

.image-preview {
    margin-left: 10px;
}

.preview-image {
    max-width: 100px;
    max-height: 100px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.submit-comment-button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-left: 10px;
}

.submit-comment-button:hover {
    background-color: #0056b3;
}

.comment-image {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
}
</style>

