<template>
	<div class="container">
		<el-row justify="center" class="login-row">
			<el-col :span="8" class="bg-card p-20">
				<el-form :model="loginForm" :rules="rules" ref="ruleFormRef" class="login-form" label-position="left"
					label-width="80px">
					<h4 class="text-center login-title">登录</h4>

					<!-- 账号输入框 -->
					<el-form-item label="用户名" prop="username">
						<el-input v-model="loginForm.username" placeholder="请输入用户名" class="input-field"></el-input>
					</el-form-item>

					<!-- 密码输入框 -->
					<el-form-item label="密码" prop="password">
						<el-input type="password" v-model="loginForm.password" placeholder="请输入密码"
							class="input-field"></el-input>
					</el-form-item>

					<!-- 登录和注册按钮 -->
					<el-form-item class="text-center">
						<el-button type="primary" class="login-btn"
							@click.prevent="toLogin(loginForm.username, loginForm.password)">
							登录
						</el-button>
						<el-button type="default" class="register-btn"
							@click.prevent="() => { router.push('/register') }">
							去注册
						</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts">
import { login } from '@/api/commonApi/commonApi';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useWebSocketStore } from '@/stores/webSocket';
import { onMounted } from 'vue';
import { useData } from 'element-plus/es/components/table-v2/src/composables/use-data.mjs';

// Data
const loginForm = ref({
	username: "",
	password: ""
});

const ruleFormRef = ref();

// 校验规则
const rules = {
	username: [
		{ required: true, message: '请输入账号', trigger: 'blur' },
		{ min: 3, message: '请输入有效的账号（至少3位）', trigger: 'blur' }
	],
	password: [
		{ required: true, message: '请输入密码', trigger: 'blur' },
		{ min: 6, message: '密码至少 6 个字符', trigger: 'blur' }
	]
};

// pinia 管理 webSocket
const webSocketStore = useWebSocketStore();

// 路由
const router = useRouter();

// 登录方法
function toLogin(username: string, password: string) {
	ruleFormRef.value.validate((valid: boolean) => {
		if (valid) {
			let data = {
				username,
				password
			};

			// 调用登录接口
			login(data)
				.then(response => {
					if (response.data.code === 200) {
						const userData = response.data.data;
						if (userData.identity === 1 || userData.identity === 99) {
							localStorage.setItem("adminToken", userData.jwt);
							localStorage.setItem("adminInfo", JSON.stringify(userData));
							router.push('/adminIndex');
						} else if (userData.identity === 0 || userData.identity === 2) {
							localStorage.setItem("userToken", userData.jwt);
							localStorage.setItem("userInfo", JSON.stringify(userData));
							webSocketStore.connectWebSocket(userData.id);
							webSocketStore.loadMessages(userData.id);
							router.push('/userIndex');
						}
					} else {
						ElMessage.warning(response.data.msg)
					}
				}).catch(() => {
					ElMessage.error("服务器错误")
				})
		} else {
			ElMessage.error('请填写必填项');
			return false;
		}
	});
}
</script>

<style scoped lang="scss">
/* 背景 */
.container {
	width: 100%;
	height: 100vh;
	background: linear-gradient(to right, #4facfe, #00f2fe);
	display: flex;
	justify-content: center;
	align-items: center;
}

.login-row {
	width: 100%;
	display: flex;
	justify-content: center;
}

.bg-card {
	background-color: #ffffff;
	border-radius: 10px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login-form {
	width: 100%;
	max-width: 400px;
	padding: 20px;
}

.login-title {
	font-size: 24px;
	font-weight: 500;
	color: #333;
	margin-bottom: 30px;
}

.input-field {
	border-radius: 10px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.el-input__inner {
	border-radius: 8px;
}

.el-button {
	border-radius: 20px;
	width: 100%;
	padding: 12px 0;
}

.login-btn {
	background-color: #4caf50;
	border-color: #4caf50;
	width: 200px;
	margin-top: 20px;
}

.el-input {
	width: 250px;
	margin-bottom: 0px;
	margin-top: 20px;
}

.register-btn {
	background-color: #f5f5f5;
	border-color: #dcdfe6;
	color: #409EFF;
	margin-top: 10px;
	width: 200px;
}

.text-center {
	text-align: center;
}

/* Align labels with input fields */
.el-form-item {
	display: flex;
	align-items: center;
	/* Ensures label is vertically centered with input */
}

.el-form-item__label {
	display: flex;
	align-items: center;
}

/* Adjusting the error message alignment */
.el-form-item__error {
	font-size: 12px;
	color: #f56c6c;
	margin-top: 5px;
	/* Reduce space between error message and input field */
}

@media (max-width: 768px) {
	.container {
		padding: 20px;
	}

	.login-form {
		padding: 15px;
		max-width: 100%;
	}
}
</style>