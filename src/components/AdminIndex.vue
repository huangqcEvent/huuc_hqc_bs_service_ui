<template>
  <div class="admin-layout">
    <!-- Banner -->
    <el-header class="banner">
      <div class="banner-content">
        <div class="user-info">
          <Image :src="adminInfo.head" :width="60"></Image>
          <span>{{ adminInfo.username }}</span>
        </div>
        <h1>欢迎来到管理后台</h1>
        <el-button @click="showDrawer = true" class="drawer-btn">
          <el-icon>
            <CircleCloseFilled />
          </el-icon>
          违禁词管理
        </el-button>
        <el-button link @click="logout1" class="logout-button">退出登录</el-button>
      </div>
    </el-header>

    <!-- 左侧导航 -->
    <el-container class="main-container">
      <el-aside width="200px" class="sidebar">
        <el-menu :default-openeds="['1']" class="custom-menu" active-text-color="#42b983" background-color="#ffffff"
          text-color="#333333">
          <el-sub-menu index="1">
            <template #title>
              <i class="el-icon-user"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item type="default" index="1-1"
              @click="router.push({ path: '/adminIndex/users', query: { identity: adminInfo.identity } })">
              <i class="el-icon-user"></i>
              <span>用户列表</span>
            </el-menu-item>
            <el-menu-item index="1-2" @click="router.push('/adminIndex/downLog')">
              <i class="el-icon-lock"></i>
              <span>账号封禁记录</span>
            </el-menu-item>
            <el-menu-item index="1-3" @click="router.push('/adminIndex/identityLog')">
              <i class="el-icon-lock"></i>
              <span>身份变更记录</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>

        <el-menu :default-openeds="['2']" class="custom-menu" active-text-color="#42b983" background-color="#ffffff"
          text-color="#333333">
          <el-sub-menu index="2">
            <template #title>
              <i class="el-icon-user"></i>
              <span>表白墙管理</span>
            </template>
            <el-menu-item index="1-1"
              @click="router.push({ path: '/adminIndex/confession', query: { identity: adminInfo.identity } })">
              <i class="el-icon-user"></i>
              <span>表白贴列表</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>

        <el-menu :default-openeds="['3']" class="custom-menu" active-text-color="#42b983" background-color="#ffffff"
          text-color="#333333">
          <el-sub-menu index="3">
            <template #title>
              <i class="el-icon-user"></i>
              <span>寻物贴管理</span>
            </template>
            <el-menu-item index="3-1"
              @click="router.push({ path: '/adminIndex/notices', query: { identity: adminInfo.identity } })">
              <i class="el-icon-user"></i>
              <span>寻物贴列表</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主要内容区域 -->
      <el-main class="content">
        <router-view />
      </el-main>
    </el-container>

    <!-- 抽屉 -->
    <el-drawer v-model="showDrawer" title="违禁词管理" direction="rtl" size="50%">
      <el-tabs class="demo-tabs">
        <el-tab-pane label="黑名单" name="first">
          <!-- 黑名单表格 -->
          <div class="word-table">
            <div v-for="(row, index) in chunkList(blackList, 4)" :key="index" class="word-row">
              <div v-for="(item, subIndex) in row" :key="subIndex" class="word-cell">
                {{ item.sensitiveWord }}
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="白名单" name="second">
          <!-- 白名单表格 -->
          <div class="word-table">
            <div v-for="(row, index) in chunkList(whiteList, 4)" :key="index" class="word-row">
              <div v-for="(item, subIndex) in row" :key="subIndex" class="word-cell">
                {{ item.sensitiveWord }}
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import Image from '@/common/Image.vue';
import { logout } from '@/api/commonApi/commonApi';
import { confirm } from '@/utils/confirmUtils';
import { getProhibitedWords } from '@/api/admin/user/userApi';

const router = useRouter();
const adminInfo = reactive({
  id: '',
  username: '',
  head: '',
  identity: ''
});

const showDrawer = ref(false);

interface BlackList {
  id: string;
  sensitiveWord: string;
}

interface WhiteList {
  id: string;
  sensitiveWord: string;
}

const blackList = ref<BlackList[]>([]);
const whiteList = ref<WhiteList[]>([]);

const logout1 = () => {
  confirm("确认要退出登录吗?", () => {
    logout('admin').then(response => {
      console.log(response.data.msg);
      // 清除登录状态
      localStorage.removeItem('adminInfo');
      localStorage.removeItem('adminToken');
    });
    // 跳转到登录页面
    router.push('/login');
  }, () => {
    console.log('取消退出');
  });
};

onBeforeMount(() => {
  const storedUserInfo = localStorage.getItem('adminInfo');
  if (storedUserInfo) {
    Object.assign(adminInfo, JSON.parse(storedUserInfo));
  }
  getProhibitedWords().then((response) => {
    blackList.value = response.data.data.blackList;
    whiteList.value = response.data.data.whiteList;
  });
});

// 将列表拆分为每行4个元素
const chunkList = (list: BlackList[] | WhiteList[], chunkSize: number) => {
  const result: (BlackList[] | WhiteList[])[] = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    result.push(list.slice(i, i + chunkSize));
  }
  return result;
};
</script>

<style scoped>
.banner {
  background: #42b983;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid #36a175;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 10px;
}

.user-info img {
  border-radius: 50%;
  width: 60px;
  height: 60px;
  object-fit: cover;
}

.user-info span {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
}

h1 {
  font-size: 1.5rem;
  font-weight: 500;
  color: white;
  text-align: center;
  flex-grow: 1;
  margin: 0;
}

.logout-button {
  background: none;
  border: none;
  color: #dfe6e9;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.3s, transform 0.3s;
}

.logout-button:hover {
  color: #ffffff;
  transform: scale(1.1);
}

.drawer-btn {
  background-color: #ffffff;
  border: 1px solid #42b983;
  color: #42b983;
  border-radius: 4px;
  padding: 0.5rem 1rem;
}

.word-table {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4列布局 */
  gap: 10px;
  padding: 10px;
}

.word-cell {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  font-size: 14px;
}

@media (max-width: 768px) {
  .banner {
    flex-direction: column;
    padding: 10px 15px;
  }

  .banner-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .word-table {
    grid-template-columns: repeat(2, 1fr); /* 小屏幕下 2列布局 */
  }
}
</style>
