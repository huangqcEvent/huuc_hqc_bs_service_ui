<template>
  <div class="banner">
    <el-row type="flex" justify="space-between" style="width: 100%;">
      <el-col :span="4" class="logo">
        <img src="https://www.huuc.edu.cn/images/logo.png" alt="Logo" />
      </el-col>
      <el-col :span="16" class="nav">
        <el-menu mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <el-menu-item index="1"><router-link to="/home">首页</router-link></el-menu-item>
          <el-menu-item index="2"><router-link to="/about">关于我们</router-link></el-menu-item>
          <el-menu-item index="3"><router-link to="/services">服务</router-link></el-menu-item>
          <el-menu-item index="4"><router-link to="/contact">联系我们</router-link></el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="4" class="user">
        <div v-if="!isLoggedIn" class="login-button">
          <el-button type="primary" @click="login" class="login-btn">登录</el-button>
        </div>
        <div v-else class="user-info">
          <el-dropdown>
            <div class="user-info-link">
              <el-avatar :size="50" :src="userInfo.head" />
              <h1>{{ userInfo.username }}</h1>
              <el-button type="text" @click="logout" class="logout-btn">退出登录</el-button>
            </div>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/utils/axiosUtils';
import { confirm } from '@/utils/confirmUtils';

const router = useRouter();
// 使用 reactive 创建响应式对象
const userInfo = reactive({
  id: '',
  username: '',
  head: ''
});

const isLoggedIn = ref(false);

// 登录方法
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

// 退出方法
const logout = () => {
  confirm("确认要退出登录吗?", () => {
    request.get("/common/logout", { userType: 'user' }).then(
      response => {
        console.log(response.data.msg);
        // 清除登录状态
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userToken');
      }
    ).finally(() => {
      // 跳转到登录页面
      router.push('/login');
    });
  }, () => {
    console.log('取消退出');
  });
};

// 挂载前 调用onBeforeMount()指定的函数
onBeforeMount(() => {
  const storedUserInfo = localStorage.getItem('userInfo');
  if (storedUserInfo) {
    Object.assign(userInfo, JSON.parse(storedUserInfo));
    isLoggedIn.value = true;
  }
});
</script>

<style scoped>
.banner {
  background-color: #545c64;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo img {
  height: 45px;
}

.nav .el-menu {
  border-bottom: none;
}

.login-button .login-btn {
  width: 100%;
  background-color: #409eff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  color: #fff;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.login-button .login-btn:hover {
  background-color: #66b1ff;
}

.user-info .user-info-link {
  display: flex;
  align-items: center;
  color: #fff;
  cursor: pointer;
}

.user-info h1 {
  margin-left: 10px;
  font-size: 16px;
}

.user-info .logout-btn {
  color: #fff;
  font-size: 14px;
  margin-left: 10px;
  transition: color 0.3s ease;
}

.user-info .logout-btn:hover {
  color: #ffd04b;
}

.user-info .el-icon-arrow-down {
  font-size: 12px;
  margin-left: 5px;
}
</style>

