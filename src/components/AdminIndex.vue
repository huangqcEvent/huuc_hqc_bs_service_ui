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
            <el-menu-item type="default" index="1-1" @click="router.push({ path: '/adminIndex/users', query: { identity: adminInfo.identity } })">
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
            <el-menu-item index="1-1" @click="router.push({ path: '/adminIndex/confession', query: { identity: adminInfo.identity } })">
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
            <el-menu-item index="3-1" @click="router.push({ path: '/adminIndex/notices', query: { identity: adminInfo.identity } })">
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
      <div class="drawer-content">
        <h2>黑名单</h2>
        <ul>
          <li v-for="(word, index) in blackList" :key="word">{{ word }}</li>
        </ul>
        <h2>白名单</h2>
        <ul>
          <li v-for="(word) in whiteList" :key="word">{{ word }}</li>
        </ul>
      </div>
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

const blackList = ref([]);
const whiteList = ref([]);

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

// 挂载前 调用onBeforeMount()指定的函数
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
  border-bottom: 2px solid #36a175; /* 为了增加层次感 */
}

.banner-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center; /* 确保内容垂直居中 */
}

.user-info {
  display: flex;
  align-items: center;
  flex-wrap: nowrap; /* 防止换行 */
  gap: 10px; /* 加一些间距，避免过于紧凑 */
}

.user-info img {
  border-radius: 50%;
  width: 60px; /* 确保头像大小固定 */
  height: 60px;
  object-fit: cover; /* 保证头像图片的裁剪不会变形 */
}

.user-info span {
  font-size: 1.2rem;
  font-weight: bold;
  margin-left: 10px; /* 确保用户名与头像有间距 */
  white-space: nowrap; /* 防止用户名换行 */
  color: white; /* 提升用户名对比度 */
}

h1 {
  font-size: 1.5rem;
  font-weight: 500;
  color: white;
  text-align: center; /* 在小屏幕上居中标题 */
  flex-grow: 1; /* 确保标题在较大的屏幕上能占满剩余空间 */
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
  transition: background-color 0.3s, border-color 0.3s;
}

.drawer-btn:hover {
  background-color: #e8f5e9;
  border-color: #36a175; /* 改变按钮边框颜色 */
}

@media (max-width: 768px) {
  .banner {
    flex-direction: column;
    padding: 10px 15px; /* 更小的 padding */
  }

  .banner-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .user-info {
    margin-bottom: 10px; /* 确保用户信息与其他内容有间距 */
  }

  .user-info img {
    width: 50px; /* 在小屏幕上调整头像大小 */
    height: 50px;
  }

  .user-info span {
    font-size: 1rem;
  }

  h1 {
    font-size: 1.2rem;
    margin-top: 10px;
  }

  .logout-button {
    margin-top: 10px;
  }

  .drawer-btn {
    width: 100%; /* 让按钮宽度自适应 */
    margin-top: 10px;
  }
}

</style>
