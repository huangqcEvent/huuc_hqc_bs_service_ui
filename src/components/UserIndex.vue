<template>
  <el-container>
    <el-header class="banner">
      <el-row type="flex" justify="space-between" align="middle" style="width: 100%;">
        <el-col :span="8" class="logo">
          <img src="D:\vsCodeProject\vueProject\hqc_bysj_vue3\src\assets\9d62581ef8d2daf9ef72d81dcd756ed.png"
            alt="Logo" />
        </el-col>
        <el-col :span="8" class="nav">
          <el-menu mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"
            :router="true">
            <el-menu-item index="/userIndex/home">首页</el-menu-item>
            <el-menu-item index="/userIndex/confessionWall">校园表白墙</el-menu-item>
            <el-menu-item index="/userIndex/notice">校园寻物</el-menu-item>
            <el-menu-item index="/userIndex/club">社团咨询</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="8" class="user">
          <div v-if="!isLoggedIn" class="login-button">
            <el-button type="primary" @click="login" class="login-btn">登录</el-button>
          </div>
          <div v-else class="user-info">
            <div class="post-button-container">
              <GuideQuestions></GuideQuestions>
            </div>
            <div class="message-icon">
              <el-popover placement="bottom" width="300" trigger="click" popper-class="message-popover">
                <ul class="message-list">
                  <li v-if="messages.length === 0">
                    无消息
                  </li>
                  <li v-else v-for="(message, index) in messages" :key="index">
                    <span :class="{ read: message }">{{ message }}</span>
                  </li>
                </ul>
                <template #reference>
                  <el-badge :value="msgTotal" class="item" @click="getmsg">
                    <el-icon style="font-size: 25px;">
                      <Message />
                    </el-icon>
                  </el-badge>
                </template>
              </el-popover>
            </div>
            <div class="post-button-container">
              <el-button type="success" @click="goToPost" class="post-button">我要发贴</el-button>
            </div>
            <div class="user-avatar">
              <el-popover placement="bottom" width="200" trigger="hover" popper-class="user-popover">
                <div class="popover-content">
                  <h1>{{ userInfo.username }}</h1>
                  <el-button type="danger" @click="logout1" class="logout-btn">退出登录</el-button>
                </div>
                <template #reference>
                  <el-avatar size="default" :src="userInfo.head" />
                </template>
              </el-popover>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-scrollbar class="scrollbar" style="height: 100%;">
        <div>
          <router-view></router-view>
        </div>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '@/api/commonApi/commonApi';
import { confirm } from '@/utils/confirmUtils';
import { useWebSocketStore } from '@/stores/webSocket';
import GuideQuestions from '@/pages/user/ai/GuideQuestions.vue';

const router = useRouter();
const webSocketStore = useWebSocketStore();

// 响应式数据
const messages = computed(() => webSocketStore.getMessages);
const msgTotal = ref(0);

// 用户信息
const userInfo = reactive({
  id: '',
  username: '',
  head: ''
});
const isLoggedIn = ref(false);

// 监听消息变化，更新消息总数
watch(messages, (newMessages) => {
  msgTotal.value = newMessages.length;
});

// 登录逻辑
const login = () => {
  if (localStorage.getItem('userInfo') == null) {
    router.push("/login");
  } else {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      Object.assign(userInfo, JSON.parse(storedUserInfo));
      isLoggedIn.value = true;
    }
  }
};

// 退出登录逻辑
const logout1 = () => {
  confirm("确认要退出登录吗?", () => {
    logout('user').then(
      () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userToken');
        webSocketStore.closeSocket();
      }
    ).finally(() => {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userToken');
      webSocketStore.closeSocket();
      router.push('/login');
    });
  }, () => {});
};

// 获取消息
const getmsg = () => {
};

// 跳转到发帖页面
const goToPost = () => {
  router.push('/userIndex/post');
};

// 页面加载时初始化
onMounted(() => {
  const storedUserInfo = localStorage.getItem('userInfo');
  if (storedUserInfo) {
    Object.assign(userInfo, JSON.parse(storedUserInfo));
    isLoggedIn.value = true;
  }

  webSocketStore.loadMessages(userInfo.id)
  // 初始化消息数量
  msgTotal.value = messages.value.length;
});
</script>

<style scoped lang="scss">
.item {
  margin-top: -20px;
  margin-right: 30px;
  cursor: pointer;
}

/* 顶部横幅样式 */
.banner {
  background-color: #545c64;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
  height: 60px;
  /* 固定高度 */
}

/* Logo 样式 */
.logo {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.logo img {
  height: 40px;
  /* 调整 logo 高度 */
}

/* 导航菜单样式 */
.nav .el-menu {
  border-bottom: none;
  display: flex;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.nav .el-menu-item {
  height: 60px;
  line-height: 60px;
  /* 与 banner 高度一致 */
  padding: 0 20px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav .el-menu-item:hover {
  background-color: #4a5058;
  color: #ffd04b;
}

.nav .el-menu-item.is-active {
  background-color: #4a5058;
  color: #ffd04b;
}

/* 登录按钮样式 */
.login-button {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

.login-button .login-btn {
  background-color: #409eff;
  border: none;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  color: #fff;
  font-size: 16px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

/* 登录按钮悬停样式 */
.login-button .login-btn:hover {
  background-color: #66b1ff;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* 用户信息样式 */
.user {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
}

/* 消息图标样式 */
.message-icon {
  margin-top: 50px;
  margin-right: 20px;
}

/* 发贴按钮容器样式 */
.post-button-container {
  margin-top: 20px;
  margin-right: 20px;
}

/* 发贴按钮样式 */
.post-button {
  background-color: #67c23a;
  border: none;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  color: #fff;
  font-size: 16px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 发贴按钮悬停样式 */
.post-button:hover {
  background-color: #85ce61;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* 用户头像样式 */
.user-avatar {
  margin-top: 25px;
  margin-left: 20px;
}

/* 弹出框样式 */
.user-popover {
  background-color: #545c64;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
}

.popover-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popover-content h1 {
  margin: 0;
  font-size: 16px;
  margin-bottom: 10px;
}

.popover-content .logout-btn {
  color: #fff;
  font-size: 14px;
  transition: background-color 0.3s ease, color 0.3s ease;
  width: 100%;
  text-align: center;
}

.popover-content .logout-btn:hover {
  background-color: #f56c6c;
  color: #fff;
}

/* 消息弹出框样式 */
.message-popover {
  background-color: #fff;
  color: #333;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-popover .message-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.message-popover .message-list li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.message-popover .message-list li:last-child {
  border-bottom: none;
}

.message-popover .message-list span.read {
  color: #999;
}

/* 主体内容样式 */
.el-main {
  padding: 0;
  height: calc(100vh - 60px);
  overflow: hidden;
  position: relative;
  margin-top: 0;
}

/* 内容容器样式 */
.content {
  padding: 0px;
  min-height: 100%;
}

/* 滚动条样式 */
.scrollbar {
  padding: 0;
  height: calc(100vh - 60px); 
}
</style>
