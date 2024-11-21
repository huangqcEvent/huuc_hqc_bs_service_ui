<template>
  <el-drawer :model-value="isShow" :title="`评论 (${total})`" direction="rtl" size="40%"
    @update:model-value="handleUpdateIsShow">
    <div class="comments-container">
      <el-scrollbar>
        <div class="comments-list">
          <div v-for="(comment, index) in comments" :key="index" class="comment">
            <img v-if="comment.userHead" :src="comment.userHead" alt="User Head" class="comment-user-head">
            <div class="comment-content">
              <p class="username">{{ comment.userName }}</p>
              <p class="content">{{ comment.content }}</p>
              <Image v-if="comment.imageUrl" :src="comment.imageUrl" :width="200" class="image" />
              <p class="comment-time">{{ comment.createTime }}</p>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <form @submit.prevent="addComment()" class="comment-form">
        <textarea v-model="newContent" placeholder="写下你的评论..." required></textarea>
        <div class="image-upload">
          <button type="button" @click="selectImage" class="upload-button">上传图片</button>
          <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none;" />
          <div v-if="newImageUrl" class="image-preview">
            <img :src="newImageUrl" alt="Preview" class="preview-image" />
          </div>
        </div>
        <button type="submit" class="submit-comment-button">发表评论</button>
      </form>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElScrollbar, ElMessage } from 'element-plus';
import { upload } from '@/api/commonApi/commonApi';
import { saveComment, getComments } from '@/api/user/CommentApi';
import type { CommentParams } from '@/types/comment';

// 评论接口类型
interface Comment {
  id: string;
  userHead: string;
  userName: string;
  content: string;
  createTime: string;
  imageUrl?: string; // 添加图片 URL 字段
}

const props = defineProps({
  postId: {
    type: String,
    required: true
  },
  isShow: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:isShow']);

const total = ref(0);
const comments = ref<Comment[]>([]);
const newContent = ref('');
const newImageFile = ref<File | null>(null); // 新的图片文件
const newImageUrl = ref<string | null>(null); // 新的图片预览 URL

watch(() => props.isShow, async (newValue) => {
  if (newValue) {
    await fetchComments();
  }
});

async function fetchComments() {
  await getComments(props.postId).then((response) => {
    comments.value = response.data.data.list;
    total.value = response.data.data.total;
  });
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

  // 构建新增评论参数
  const params: CommentParams = {
    postId: props.postId,
    postType: 1,
    content: newContent.value,
    imageUrl: imageUrl
  };

  // 发送请求保存评论
  saveComment(params).then((response) => {
    ElMessage.success(response.data.msg);
    // 刷新评论列表
    fetchComments();
  });

  newContent.value = '';
  newImageFile.value = null;
  newImageUrl.value = null;
}

const handleUpdateIsShow = (value: boolean) => {
  emit('update:isShow', value);
};
</script>

<style scoped>
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
