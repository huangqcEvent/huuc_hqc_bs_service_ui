<template>
  <div class="admin-layout">
    <!-- Banner -->
    <el-header class="banner">
      <div class="banner-content">
        <div class="user-info">
          <!-- <Image :src="adminInfo.head" :width="60"></Image> -->
          <Image src="https://www.huuc.edu.cn/hncj/images/logo.png" :width="60"></Image>
          <span>{{ adminInfo.username }}</span>
        </div>
        <h1>欢迎来到管理后台</h1>
        <el-button type="text" @click="logout" class="logout-button">退出登录</el-button>
      </div>
    </el-header>

    <!-- 左侧导航 -->
    <el-container>
      <el-aside width="200px" class="sidebar">
        <el-menu :default-openeds="['1']" class="custom-menu" active-text-color="#42b983" background-color="#ffffff"
          text-color="#333333">
          <el-sub-menu index="1">
            <template #title>
              <i class="el-icon-user"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item type="defult" index="1-1" @click="router.push({
              path: '/adminIndex/users',
              query: { identity: adminInfo.identity }
            })">
              <i class="el-icon-user"></i>
              <span>用户列表</span>
            </el-menu-item>
            <el-menu-item index="1-2" @click="router.push('/adminIndex/downLog')">
              <i class="el-icon-lock"></i>
              <span>账号封禁记录</span>
            </el-menu-item>
          </el-sub-menu>
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
import { onBeforeMount, reactive } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/utils/axiosUtils';

import Image from '@/common/Image.vue';
import { confirm } from '@/utils/confirmUtils';

const router = useRouter();
const adminInfo = reactive({
  id: '',
  username: '',
  head: '',
  identity: ''
});

const logout = () => {
  confirm("确认要退出登录吗?", () => {
    request.get("/common/logout", { userType: 'admin' }).then(
      response => {
        console.log(response.data.msg);
        // 清除登录状态
        localStorage.removeItem('adminInfo');
        localStorage.removeItem('adminToken');
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
  const storedUserInfo = localStorage.getItem('adminInfo');
  if (storedUserInfo) {
    Object.assign(adminInfo, JSON.parse(storedUserInfo));
  }
});
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f0f2f5;
}

.banner {
  background: #42b983;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

.user-info img {
  border-radius: 50%;
  margin-right: 0.5rem;
}

.user-info span {
  font-size: 1.1rem;
  font-weight: bold;
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

.sidebar {
  background-color: #ffffff;
  color: #333333;
  padding: 1rem;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
}

.custom-menu {
  border-right: none;
  background: transparent;
  color: #333333;
}

.custom-menu .el-menu-item,
.custom-menu .el-sub-menu__title {
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  padding-left: 20px !important;
  transition: background-color 0.3s, color 0.3s;
  display: flex;
  align-items: center;
}

.custom-menu .el-menu-item i,
.custom-menu .el-sub-menu__title i {
  margin-right: 10px;
  font-size: 18px;
  color: #333333;
}

.custom-menu .el-menu-item.is-active,
.custom-menu .el-sub-menu__title.is-active {
  background-color: #e1f5fe;
  color: #42b983;
  border-left: 4px solid #42b983;
}

.custom-menu .el-menu-item:hover,
.custom-menu .el-sub-menu__title:hover {
  background-color: #f0f8ff;
  color: #42b983;
}

.custom-menu .el-menu-item-group__title {
  display: none;
}

.custom-menu .el-menu-item span {
  vertical-align: middle;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }

  .el-aside {
    width: 100%;
    height: auto;
  }

  .el-main {
    padding: 1rem;
  }

  .banner {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .banner-content {
    flex-direction: column;
    align-items: center;
  }

  .user-info {
    margin-bottom: 1rem;
  }

  .logout-button {
    margin-top: 1rem;
  }
}
</style>
