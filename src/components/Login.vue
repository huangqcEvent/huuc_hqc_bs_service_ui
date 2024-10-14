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
						    @click.prevent="()=>{router.push('/register')}">去注册</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="Login">
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Data
const loginForm = ref({
	email: "",
	pwd: ""
});

//拿到路由器
const router = useRouter()
// Methods
function toLogin(email: string, pwd: string) {
	let data = {
		username: email,
		password: pwd
	};
	console.log(email, pwd);
	axios.post('/api/admin/login', data	
	) // 修正 URL 并传递 data 参数
		.then(response => {
			if(response.data.code == 200){
				localStorage.setItem("token",response.data.data.jwt)
				localStorage.setItem("userInfo",JSON.stringify(response.data.data))
				if(response.data.data.isAdmin == 1){
				router.push('/index')
				}
			}
			else{
				alert(response.data.msg)
			}
		})
		.catch(error => {
			console.error('Error during login:', error);
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