<template>
  <el-container>
    <el-header class="banner">
      <el-row type="flex" justify="space-between" style="width: 100%;">
        <el-col :span="8" class="logo">
          <img src="https://www.huuc.edu.cn/images/logo.png" alt="Logo" />
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
            <el-popover placement="bottom" width="200" trigger="hover" popper-class="user-popover">
              <div class="popover-content">
                <h1>{{ userInfo.username }}</h1>
                <el-button type="danger" @click="logout1" class="logout-btn">退出登录</el-button>
              </div>
              <template #reference>
                <el-avatar :size="40" src="https://www.huuc.edu.cn/hncj/images/logo.png" />
              </template>
            </el-popover>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-scrollbar class="scrollbar" style="height: 100%;">
        <div class="content">
          <router-view></router-view>
        </div>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '@/api/commonApi/commonApi'
import { confirm } from '@/utils/confirmUtils';

const router = useRouter();
const userInfo = reactive({
  id: '',
  username: '',
  head: ''
});
const isLoggedIn = ref(false);

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

const logout1 = () => {
  confirm("确认要退出登录吗?", () => {
    logout('user').then(
      response => {
        console.log(response.data.msg);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userToken');
      }
    ).finally(() => {
      router.push('/login');
    });
  }, () => {
    console.log('取消退出');
  });
};

onMounted(() => {
  const storedUserInfo = localStorage.getItem('userInfo');
  if (storedUserInfo) {
    Object.assign(userInfo, JSON.parse(storedUserInfo));
    isLoggedIn.value = true;
  }
});
</script>

<style scoped>
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
  /* 移除底部间距 */
}

/* Logo 样式 */
.logo {
  display: flex;
  align-items: center;
  /* 垂直居中 */
  justify-content: flex-start;
  /* 左对齐 */
}

.logo img {
  height: 45px;
}

/* 导航菜单样式 */
.nav .el-menu {
  border-bottom: none;
  display: flex;
  justify-content: center;
  /* 导航菜单居中 */
  transition: background-color 0.3s ease;
  /* 添加背景颜色过渡效果 */
}

.nav .el-menu-item {
  height: 60px;
  line-height: 50px;
  padding: 0 20px;
  transition: background-color 0.3s ease, color 0.3s ease;
  /* 添加背景颜色和文字颜色过渡效果 */
}

.nav .el-menu-item:hover {
  background-color: #4a5058;
  /* 悬停时的背景颜色 */
  color: #ffd04b;
  /* 悬停时的文字颜色 */
}

.nav .el-menu-item.is-active {
  background-color: #4a5058;
  /* 激活时的背景颜色 */
  color: #ffd04b;
  /* 激活时的文字颜色 */
}

/* 登录按钮样式 */
.login-button {
  display: flex;
  align-items: center;
  /* 垂直居中 */
  height: 100%;
  /* 使按钮高度与 banner 一致 */
}

.login-button .login-btn {
  background-color: #409eff;
  border: none;
  border-radius: 20px;
  /* 更圆润的圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* 添加阴影效果 */
  padding: 10px 20px;
  color: #fff;
  font-size: 16px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

/* 登录按钮悬停样式 */
.login-button .login-btn:hover {
  background-color: #66b1ff;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  /* 悬停时增加阴影效果 */
}

/* 用户信息样式 */
.user {
  display: flex;
  align-items: center;
  /* 垂直居中 */
  justify-content: flex-end;
  /* 右对齐 */
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

/* 主体内容样式 */
.el-main {
  padding: 0;
  height: calc(100vh - 60px);
  /* 调整高度以适应屏幕 */
  overflow: hidden;
  /* 隐藏默认滚动条 */
  position: relative;
  margin-top: 0;
  /* 移除顶部间距 */
}

/* 内容容器样式 */
.content {
  padding: 0px;
  /* 内容内边距 */
  min-height: 100%;
  /* 确保内容容器高度至少为 el-main 的高度 */
}

/* 滚动条样式 */
.scrollbar {
  height: 100%;
  overflow-y: auto;
  /* 确保内容可以滚动 */
  scrollbar-width: thin;
  /* Firefox 滚动条宽度 */
  scrollbar-color: #888 #f1f1f1;
  /* Firefox 滚动条颜色 */
}

/* 滚动条轨道样式 */
.scrollbar::-webkit-scrollbar {
  width: 10px;
  /* 滚动条宽度 */
}

/* 滚动条滑块样式 */
.scrollbar::-webkit-scrollbar-thumb {
  background-color: #888;
  /* 滑块颜色 */
  border-radius: 5px;
  /* 滑块圆角 */
}

/* 滚动条滑块悬停样式 */
.scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #555;
  /* 滑块悬停时的颜色 */
}
</style>
