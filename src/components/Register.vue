<template>
	<div class="container">
		<el-row justify="center" class="register-row">
			<el-col :span="8" class="form-card">
				<el-form :model="loginForm" class="register-form" :rules="rules" ref="ruleFormRef" label-position="left"
					label-width="80px">
					<h4 class="text-center register-title">注册</h4>

					<!-- 账号输入框 -->
					<el-form-item label="账号" prop="username">
						<el-input v-model="loginForm.username" placeholder="请输入账号" class="input-field" />
					</el-form-item>

					<!-- 密码输入框 -->
					<el-form-item label="密码" prop="pwd">
						<el-input type="pwd" v-model="loginForm.pwd" placeholder="请输入密码" class="input-field" />
					</el-form-item>

					<!-- 头像上传 -->
					<el-form-item label="头像" prop="head" style="margin-top: 20px;">
						<Upload @upload-success="handleUploadSuccess" />
						<div v-if="loginForm.head" class="avatar-preview">
							<img :src="loginForm.head" alt="头像预览" class="avatar-img" />
						</div>
					</el-form-item>

					<!-- 注册和去登录按钮 -->
					<el-form-item class="text-center">
						<el-button type="primary" class="register-btn"
							@click.prevent="toRegister(loginForm.username, loginForm.pwd, loginForm.head)">
							注册
						</el-button>
						<el-button type="default" class="login-btn" @click.prevent="() => { router.push('/login') }">
							去登录
						</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts">
import { register } from '@/api/commonApi/commonApi';
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import Upload from '@/common/Upload.vue';

// Data
const loginForm = ref({
	username: "",
	pwd: "",
	head: ""
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

// Get router instance
const router = useRouter();

// Register method
function toRegister(email: string, pwd: string, head: string) {
	ruleFormRef.value.validate((valid: boolean) => {
		if (valid) {
			let data = {
				username: email,
				password: pwd,
				head: head
			};

			register(data).then(response => {
				if (response.data.code === 200) {
					ElMessage.success(response.data.msg);
					router.push('/login');
				} else {
					ElMessage.error(response.data.msg);
				}
			})
		} else {
			ElMessage.error('请填写必填项');
			return false;
		}
	});
};

// Handle avatar upload success
const handleUploadSuccess = (result: string) => {
	loginForm.value.head = result;
};

</script>

<style scoped lang="scss">
/* 背景 */
.container {
	width: 100%;
	height: 100vh;
	background: linear-gradient(to right, #6a11cb, #2575fc);
	display: flex;
	justify-content: center;
	align-items: center;
}

/* 表单容器 */
.register-row {
	width: 100%;
	display: flex;
	justify-content: center;
}

.form-card {
	background-color: #ffffff;
	border-radius: 10px;
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
	padding: 40px 30px;
	width: 100%;
	max-width: 400px;
}

/* 标题 */
.register-title {
	font-size: 24px;
	font-weight: 500;
	color: #333;
	margin-bottom: 20px;
}

/* 输入框 */
.input-field {
	border-radius: 10px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.el-input__inner {
	border-radius: 10px;
}

/* 按钮样式 */
.el-button {
	border-radius: 25px;
	width: 100%;
	padding: 14px 0;
}

.el-input {
	width: 250px;
	margin-bottom: 0px;
	margin-top: 20px;
}

.register-btn {
	background-color: #4CAF50;
	border-color: #4CAF50;
	color: #fff;
	margin-bottom: 10px;
	width: 200px;
}

.login-btn {
	background-color: #f4f6f9;
	border-color: #e4e7ed;
	color: #409EFF;
	margin-bottom: 10px;
	width: 200px;
}

/* 头像预览 */
.avatar-preview {
	margin-top: 10px;
	text-align: center;
}

.avatar-img {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	object-fit: cover;
	border: 2px solid #ddd;
}

/* 居中对齐 */
.text-center {
	text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
	.form-card {
		padding: 20px 15px;
	}

	.register-title {
		font-size: 20px;
	}
}
</style>