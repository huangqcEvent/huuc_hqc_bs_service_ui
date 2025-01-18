<!-- 父组件 -->
<template>
  <div class="admin-layout">
    <!-- Banner -->
    <el-header class="banner">
      <div class="banner-content">
        <div class="user-info">
          <el-avatar size="default" :src="adminInfo.head" />
          <span>{{ adminInfo.username }}</span>
        </div>
        <h1>欢迎来到管理后台</h1>
        <el-button @click="openDrawer" class="drawer-btn">
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
          <el-menu-item index="1-1" @click="router.push({ path: '/adminIndex/audit' })">
            <i class="el-icon-user"></i>
            <span>审核列表</span>
          </el-menu-item>
        </el-menu>
        <el-menu :default-openeds="['2']" class="custom-menu" active-text-color="#42b983" background-color="#ffffff"
          text-color="#333333">
          <el-sub-menu index="2">
            <template #title>
              <i class="el-icon-user"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item type="default" index="2-1"
              @click="router.push({ path: '/adminIndex/users', query: { identity: adminInfo.identity } })">
              <i class="el-icon-user"></i>
              <span>用户列表</span>
            </el-menu-item>
            <el-menu-item index="2-2" @click="router.push('/adminIndex/downLog')">
              <i class="el-icon-lock"></i>
              <span>账号封禁记录</span>
            </el-menu-item>
            <el-menu-item index="2-3" @click="router.push('/adminIndex/identityLog')">
              <i class="el-icon-lock"></i>
              <span>身份变更记录</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
        <el-menu :default-openeds="['3']" class="custom-menu" active-text-color="#42b983" background-color="#ffffff"
          text-color="#333333">
          <el-sub-menu index="3">
            <template #title>
              <i class="el-icon-user"></i>
              <span>表白墙管理</span>
            </template>
            <el-menu-item index="3-1" @click="router.push({ path: '/adminIndex/confession' })">
              <i class="el-icon-user"></i>
              <span>表白贴列表</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
        <el-menu :default-openeds="['4']" class="custom-menu" active-text-color="#42b983" background-color="#ffffff"
          text-color="#333333">
          <el-sub-menu index="4">
            <template #title>
              <i class="el-icon-user"></i>
              <span>寻物贴管理</span>
            </template>
            <el-menu-item index="4-1" @click="router.push({ path: '/adminIndex/notices' })">
              <i class="el-icon-user"></i>
              <span>寻物贴列表</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
        <el-menu :default-openeds="['5']" class="custom-menu" active-text-color="#42b983" background-color="#ffffff"
          text-color="#333333">
          <el-sub-menu index="5">
            <template #title>
              <i class="el-icon-user"></i>
              <span>社团贴管理</span>
            </template>
            <el-menu-item index="5-1" @click="router.push({ path: '/adminIndex/club' })">
              <i class="el-icon-user"></i>
              <span>社团贴列表</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主要内容区域 -->
      <el-main >
        <router-view />
      </el-main>
    </el-container>

    <!-- 敏感词抽屉 -->
    <SensitiveWordDrawer v-model:showDrawer="showDrawer" :activeTab="activeTab" :blackList="blackList"
      :whiteList="whiteList" @update:activeTab="activeTab = $event" :getWord="getWord" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '@/api/commonApi/commonApi';
import { confirm } from '@/utils/confirmUtils';
import { getProhibitedWords } from '@/api/admin/user/userApi';
import SensitiveWordDrawer from '@/pages/admin/word/SensitiveWordDrawer.vue';

const router = useRouter();
const adminInfo = reactive({
  id: '',
  username: '',
  head: '',
  identity: ''
});

const showDrawer = ref(false);
const activeTab = ref('first'); // 默认选中黑名单 Tab

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
      // 清除登录状态
      localStorage.removeItem('adminInfo');
      localStorage.removeItem('adminToken');
    });
    // 跳转到登录页面
    router.push('/login');
  }, () => {
  });
};

onBeforeMount(() => {
  const storedUserInfo = localStorage.getItem('adminInfo');
  if (storedUserInfo) {
    Object.assign(adminInfo, JSON.parse(storedUserInfo));
  }
});

// 获取列表
function getWord() {
  getProhibitedWords().then((response) => {
    blackList.value = response.data.data.blackList;
    whiteList.value = response.data.data.whiteList;
  });
}

// 打开抽屉并调用 getWord
function openDrawer() {
  showDrawer.value = true;
  activeTab.value = 'first'; // 默认选中黑名单 Tab
  getWord(); // 获取违禁词
}
</script>

<style scoped lang="scss">
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
  margin-top: 20px;
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
</style>
