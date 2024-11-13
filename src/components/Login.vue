<template>
	<div class="container">
		<el-row class="h-60">
		</el-row>
		<el-row justify="center" style="height: 30px">
			<el-col :span="8" class="bg-primary-subtle p-10">
				<el-form :model="loginForm" class="login-container" label-position="left" label-width="80px">
					<h4 class="text-center">管理后台登录</h4>
					<el-form-item label="账号" prop="email">
						<el-input v-model="loginForm.email" placeholder="账号"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input type="password" v-model="loginForm.pwd" placeholder="密码"></el-input>
					</el-form-item>
					<el-form-item class="text-center">
						<el-button type="primary" class="m-l-20"
							@click.prevent="toLogin(loginForm.email, loginForm.pwd)">登录</el-button>
						<el-button type="default" class="m-l-20"
							@click.prevent="() => { router.push('/register') }">去注册</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="Login">
import {login} from '@/api/commonApi/commonApi'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import { useWebSocketStore } from '@/stores/webSocket';
// Data
const loginForm = ref({
	email: "",
	pwd: ""
});
//pinia管理 webSocket
const webSocketStore = useWebSocketStore();
//拿到路由器
const router = useRouter()
// Methods
function toLogin(email: string, pwd: string) {
	let data = {
		username: email,
		password: pwd
	};
	
	login(data) // 修正 URL 并传递 data 参数
		.then(response => {
			if (response.data.code == 200) {
				if (response.data.data.identity == 1 || response.data.data.identity == 99) {
					localStorage.setItem("adminToken",response.data.data.jwt)
					localStorage.setItem("adminInfo", JSON.stringify(response.data.data))
					router.push('/adminIndex')
				} else if (response.data.data.identity == 0 || response.data.data.identity == 2) {
					localStorage.setItem("userToken",response.data.data.jwt)
					localStorage.setItem("userInfo", JSON.stringify(response.data.data))
					router.push('/userIndex')
					//登陆后建立webSocket连接
					webSocketStore.connectWebSocket(response.data.data.id);
				}
			}
			else {
				ElMessage({
					message: response.data.msg,
					type: 'error',
					dangerouslyUseHTMLString: true, // 允许使用 HTML 字符串
				})

			}
		})
		.catch(() => {
			ElMessage({
				message: '服务器接口错误',
				type: 'error',
			})
		});
}
</script>

<style scoped>
.h-60 {
	height: 250px;
}

.container {
	width: 100%;
	height: 100vh;
	/* 设置容器高度为视口高度 */
	background-image: url("/src/assets/back.png");
	background-size: auto;
	/* 背景图片铺满屏幕 */
	background-position: center;
	/* 背景图片居中 */
	background-repeat: no-repeat;
	/* 背景图片不重复 */
	background-attachment: fixed;
	/* 背景图片固定 */
	display: flex;
	/* 使用 Flexbox 布局 */
	flex-direction: column;
	/* 垂直排列 */
}

.p-10 {
	padding: 10px;
}

.text-center {
	text-align: center;
}
</style>