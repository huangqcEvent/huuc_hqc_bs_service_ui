<template>
  <el-container style="height: 100vh;">
    <el-main>
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <!-- 我的帖子 Tab -->
        <el-tab-pane label="我的帖子" name="myPosts">
          <el-tabs v-model="postStatus" type="card" @tab-click="fetchPosts">
            <el-tab-pane label="发布" name="1"></el-tab-pane>
            <el-tab-pane label="私密" name="2"></el-tab-pane>
            <el-tab-pane label="删除" name="3"></el-tab-pane>
            <el-tab-pane label="待审核" name="4"></el-tab-pane>
            <el-tab-pane label="已完结" name="5"></el-tab-pane>
            <el-tab-pane label="被打回" name="6"></el-tab-pane>
          </el-tabs>
          <!-- 我的帖子 数据展示表格 -->
          <el-table :data="myPosts" style="width: 100%">
            <el-table-column label="帖子大类型" prop="postTypeName" width="180"></el-table-column>
            <el-table-column label="帖子小类型" prop="postSubType" width="180">
              <template #default="scope">
                <el-tag :type="getStatusSubType(scope.row.postSubType)">
                  {{ getStatusSubLabel(scope.row.postType, scope.row.postSubType) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="标题" prop="title" width="250"></el-table-column>
            <el-table-column label="状态" prop="statusName" width="250"></el-table-column>
            <el-table-column label="提交时间" prop="createTime" width="200"></el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
              v-if="myPosts.length > 0"
              :current-page="currentPagePosts"
              :page-size="pageSize"
              :total="totalPosts"
              @current-change="handleCurrentChangePosts"
              layout="total, prev, pager, next, jumper">
          </el-pagination>
        </el-tab-pane>

        <!-- 我的点赞 Tab -->
        <el-tab-pane label="我的点赞" name="myLikes">
          <el-table :data="myLikes" style="width: 100%">
            <el-table-column label="帖子大类型" prop="postTypeName" width="180"></el-table-column>
            <el-table-column label="帖子小类型" prop="postSubType" width="180">
              <template #default="scope">
                <el-tag :type="getStatusSubType(scope.row.postSubType)">
                  {{ getStatusSubLabel(scope.row.postType, scope.row.postSubType) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="标题" prop="title" width="250"></el-table-column>
            <el-table-column label="提交时间" prop="createTime" width="200"></el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
              v-if="myLikes.length > 0"
              :current-page="currentPageLikes"
              :page-size="pageSize"
              :total="totalLikes"
              @current-change="handleCurrentChangeLikes"
              layout="total, prev, pager, next, jumper">
          </el-pagination>
        </el-tab-pane>

        <!-- 我的收藏 Tab -->
        <el-tab-pane label="我的收藏" name="myCollections">
          <el-table :data="myCollections" style="width: 100%">
            <el-table-column label="帖子大类型" prop="postTypeName" width="180"></el-table-column>
            <el-table-column label="帖子小类型" prop="postSubType" width="180">
              <template #default="scope">
                <el-tag :type="getStatusSubType(scope.row.postSubType)">
                  {{ getStatusSubLabel(scope.row.postType, scope.row.postSubType) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="标题" prop="title" width="250"></el-table-column>
            <el-table-column label="提交时间" prop="createTime" width="200"></el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
              v-if="myCollections.length > 0"
              :current-page="currentPageCollections"
              :page-size="pageSize"
              :total="totalCollections"
              @current-change="handleCurrentChangeCollections"
              layout="total, prev, pager, next, jumper">
          </el-pagination>
        </el-tab-pane>

        <!-- 我的评论 Tab -->
        <el-tab-pane label="我的评论" name="myComments">
          <el-table :data="myComments" style="width: 100%">
            <el-table-column label="帖子大类型" prop="postTypeName" width="180"></el-table-column>
            <el-table-column label="帖子小类型" prop="postSubType" width="180">
              <template #default="scope">
                <el-tag :type="getStatusSubType(scope.row.postSubType)">
                  {{ getStatusSubLabel(scope.row.postType, scope.row.postSubType) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="标题" prop="title" width="250"></el-table-column>
            <el-table-column label="提交时间" prop="createTime" width="200"></el-table-column>
            <el-table-column label="评论内容" prop="content" width="250"></el-table-column>
            <el-table-column label="评论图片" prop="ImageUrl" width="200">
              <template #default="scope">
                <img v-if="scope.row.imageUrl" :src="scope.row.imageUrl" alt="评论图片" style="width: 50px; height: 50px; object-fit: cover;">
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
              v-if="myComments.length > 0"
              :current-page="currentPageComments"
              :page-size="pageSize"
              :total="totalComments"
              @current-change="handleCurrentChangeComments"
              layout="total, prev, pager, next, jumper">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { myLiked, myComment, myFavored, myPostPage } from "@/api/commonApi/commonApi";

// 当前活动的 Tab 和状态
const activeTab = ref<string>('myPosts');
const postStatus = ref<number>(1);  // 默认选择 "发布" 状态

interface MyPostVO {
  postId: string;
  postType: number;
  postSubType: number;
  title: string;
  status: string;
  statusName: string;
  createTime: string;
  content: string;
  ImageUrl: string;
}

// 存储每个 Tab 的数据
const myPosts = ref<MyPostVO[]>([]);
const myLikes = ref<MyPostVO[]>([]);
const myCollections = ref<MyPostVO[]>([]);
const myComments = ref<MyPostVO[]>([]);

// 分页信息
const pageSize = ref(10);
const currentPagePosts = ref(1);
const currentPageLikes = ref(1);
const currentPageCollections = ref(1);
const currentPageComments = ref(1);

const totalPosts = ref(0);
const totalLikes = ref(0);
const totalCollections = ref(0);
const totalComments = ref(0);

// 切换 Tab 时调用相应接口
async function fetchPosts() {
  const params = { pageSize: pageSize.value, pageNumber: currentPagePosts.value, status: postStatus.value };
  try {
    const response = await myPostPage(params);  // 使用 myPostPage 接口
    myPosts.value = response.data.data.list;
    totalPosts.value = response.data.data.total;
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

async function fetchLikes(params: any) {
  try {
    const response = await myLiked(params);
    myLikes.value = response.data.data.list;
    totalLikes.value = response.data.data.total;
  } catch (error) {
    console.error('Error fetching likes:', error);
  }
}

async function fetchCollections(params: any) {
  try {
    const response = await myFavored(params);
    myCollections.value = response.data.data.list;
    totalCollections.value = response.data.data.total;
  } catch (error) {
    console.error('Error fetching collections:', error);
  }
}

async function fetchComments(params: any) {
  try {
    const response = await myComment(params);
    myComments.value = response.data.data.list;
    totalComments.value = response.data.data.total;
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
}

function handleCurrentChangePosts(page: number) {
  currentPagePosts.value = page;
  fetchPosts();
}

function handleCurrentChangeLikes(page: number) {
  currentPageLikes.value = page;
  fetchLikes({ pageSize: pageSize.value, pageNumber: page });
}

function handleCurrentChangeCollections(page: number) {
  currentPageCollections.value = page;
  fetchCollections({ pageSize: pageSize.value, pageNumber: page });
}

function handleCurrentChangeComments(page: number) {
  currentPageComments.value = page;
  fetchComments({ pageSize: pageSize.value, pageNumber: page });
}

function handleTabChange(tab: string) {
  switch (tab) {
    case 'myPosts':
      fetchPosts();
      break;
    case 'myLikes':
      fetchLikes({ pageSize: pageSize.value, pageNumber: currentPageLikes.value });
      break;
    case 'myCollections':
      fetchCollections({ pageSize: pageSize.value, pageNumber: currentPageCollections.value });
      break;
    case 'myComments':
      fetchComments({ pageSize: pageSize.value, pageNumber: currentPageComments.value });
      break;
  }
}

// 获取状态标签类型
function getStatusSubType(status: number): string {
  switch (status) {
    case 1:
      return 'success';
    case 2:
      return 'info';
    default:
      return 'default'
  }
}

// 获取状态标签文本
function getStatusSubLabel(bigType: number, summelType: number): string {
  switch (bigType) {
    case 1:
      return summelType == 1 ? '找对象' : '表白';
    case 2:
      return summelType == 1 ? '寻物' : '寻主';
    case 3:
      return summelType == 1 ? '纳新' : '公告';
    default:
      return '未知';
  }
}
// 初始化时加载默认 Tab 的数据
fetchPosts();  // 默认加载 "我的帖子"
</script>

<style scoped>
</style>
