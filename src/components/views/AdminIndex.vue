<template>
  <div class="admin-layout">
    <!-- Banner -->
    <el-header class="banner">
      <div class="banner-content">
        <div class="user-info">
          <Image :src="userInfo.head" :width="110"></Image>
          {{ userInfo.username }}
        </div>
        <h1>欢迎来到管理后台</h1>
        <el-button type="text" @click="logout">退出登录</el-button>
      </div>
    </el-header>

    <!-- 左侧导航 -->
    <el-container>
      <el-aside class="sidebar" width="200px">
        <el-menu router :default-active="$route.path" background-color="#545c64" text-color="#fff"
          active-text-color="#ffd04b" unique-opened>
          <el-menu-item index="/adminIndex/home">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="/adminIndex/orders">
            <i class="el-icon-s-order"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
          <el-menu-item index="/adminIndex/users">
            <i class="el-icon-user-solid"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主要内容区域 -->
      <el-main class="content">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts" name="AdminIndex">
import { RouterView } from 'vue-router';
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/utils/axiosUtils';
import type { userInfo } from '@/types/userInfo';
import Image from '@/common/Image.vue';
import { confirm } from '@/utils/confirmUtils';
const router = useRouter();
let userInfo: userInfo = {
  id: '',
  username: '',
  head: ''
};

const logout = () => {
  confirm("确认要退出登录吗?", () => {
    request.get("/common/logout").then(
      response => {
        console.log(response.data.msg);
        // 清除登录状态
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
      }
    );
    // 跳转到登录页面
    router.push('/login');
  }, () => {
    console.log('取消退出');
  });
};

// 挂载前 调用onBeforeMount()指定的函数
onBeforeMount(() => {
  const storedUserInfo = localStorage.getItem('userInfo');
  if (storedUserInfo) {
    userInfo = JSON.parse(storedUserInfo);
  }
});
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止整个页面滚动 */
}

.banner {
  background-color: #42b983;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info span {
  margin-right: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
}

.sidebar {
  background-color: #545c64;
  color: white;
  padding: 1rem;
}

.content {
  flex: 1; /* 占据剩余空间 */
  padding: 20px; /* 内容容器的内边距 */
}

.el-menu {
  border-right: none;
}

.el-menu-item {
  height: 60px;
  line-height: 60px;
}

.el-menu-item i {
  margin-right: 10px;
}

.el-menu-item.is-active {
  background-color: #409eff !important;
  color: white;
}

.el-button {
  background-color: black;
  padding: 1rem 1rem;
  font-size: 1rem;
  color: chocolate;
}
</style>
