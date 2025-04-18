<template>
    <el-page-header @back="goBack">
        <template #content>
            <span class="text-large font-600 mr-3">来自 {{ confessionDetail?.userName }} 的 {{
                confessionDetail?.typeName }}贴 </span>
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
            <p><strong>类型:</strong> {{ confessionDetail.typeName }}</p>
            <div class="image-container">
                <Image v-if="confessionDetail.image1" :src="confessionDetail.image1" :width="200" class="image" />
                <Image v-if="confessionDetail.image2" :src="confessionDetail.image2" :width="200" class="image" />
                <Image v-if="confessionDetail.image3" :src="confessionDetail.image3" :width="200" class="image" />
            </div>
          <div class="action-buttons">
            <el-button @click="handleLike" :type="isLiked ? 'success' : 'default'">
              <font-awesome-icon :icon="['fas', 'thumbs-up']" />
              点赞
            </el-button>
            <el-button @click="handleCollect" :type="isFavored ? 'warning' : 'default'">
              <font-awesome-icon :icon="['fas', 'star']" />
              收藏
            </el-button>
          </div>
        </div>
        <div v-else class="loading">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    </div>
    <ElButton @click="toggleComments" class="showButton">查看评论</ElButton>
    <CommentComponent :postId="id" :isShow="isShow" :postType=1 @update:isShow="isShow = $event" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getDetailById } from '@/api/user/ConfessionWallApi';
import Image from '@/common/Image.vue';
import {ElButton, ElMessage} from 'element-plus';
import CommentComponent from '@/common/CommentComponent.vue';
import '@/styles/cardDetail.scss'
import {likedOrCollect} from "@/api/commonApi/commonApi";

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
    type: number;
    typeName: string;
    userHead: string;
    userId: string;
    userName: string;
    isLiked: number;
    isFavored: number;
}

const route = useRoute();
const router = useRouter();
const isLiked = ref<number>(0);
const isFavored = ref<number>(0);

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
    router.back();
}

// 初始加载，获取详情数据
onMounted(() => {
    id.value = route.params.id as string;
    getDetailById(id.value).then((response) => {
        confessionDetail.value = response.data.data;
      isLiked.value = confessionDetail.value?.isLiked?confessionDetail.value?.isLiked:0;
      isFavored.value = confessionDetail.value?.isFavored?confessionDetail.value?.isFavored:0;
    })
});

const handleLike = async () => {
  if (!confessionDetail.value) return;
  try {
    const response = await likedOrCollect({
      id: id.value,
      postType: 1,
      status: isLiked.value===0 ? 1 : 0,
      updateType: 1
    });
    if (response.status === 200) {
      isLiked.value = isLiked.value===0 ? 1 : 0
    }
  } catch (error) {
    ElMessage.error('点赞失败，请稍后再试。');
  }
};

const handleCollect = async () => {
  if (!confessionDetail.value) return;

  try {
    const response = await likedOrCollect({
      id: id.value,
      postType: 1,
      status: isFavored.value===0 ? 1 : 0,
      updateType: 2
    });
    if (response.status === 200) {
      isFavored.value = isFavored.value===0 ? 1 : 0
    }
  } catch (error) {
    ElMessage.error('收藏失败，请稍后再试。');
  }
};
</script>