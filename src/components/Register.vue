<template>
	<div class="container">
		<el-row class="h-60">
		</el-row>
		<el-row justify="center" style="height: 30px">
			<el-col :span="8" class="bg-primary-subtle p-10">
				<el-form :model="loginForm" class="login-container" label-position="left" label-width="80px">
					<h4 class="text-center">管理后台注册</h4>
					<el-form-item label="账号" prop="email">
						<el-input v-model="loginForm.email" placeholder="账号"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input type="password" v-model="loginForm.pwd" placeholder="密码"></el-input>
					</el-form-item>
					<Upload @upload-success="handleUploadSuccess"></Upload>
					<el-form-item class="text-center">
						<el-button type="primary" class="m-l-20"
							@click.prevent="toRegister(loginForm.email, loginForm.pwd, loginForm.head)">注册</el-button>
						<el-button type="default" class="m-l-20"
							@click.prevent="() => { router.push('/login') }">去登陆</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="Register">
import { register } from '@/api/commonApi/commonApi';
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Upload from '@/common/Upload.vue';
// Data
const loginForm = ref({
	email: "",
	pwd: "",
	head: ""
});


//拿到路由器
const router = useRouter();

// Methods
function toRegister(email: string, pwd: string, head: string) {
	let data = {
		username: email,
		password: pwd,
		head: head
	};

	register(data).then(response => {
		if (response.data.code === 200) {
			alert(response.data.msg);
			router.push('/login');
		} else {
			alert(response.data.msg);
		}
	})
		.catch(error => {
			console.error('Error during registration:', error);
		});
}
const handleUploadSuccess = (result: string) => {
	console.log('上传成功结果:', result);
	loginForm.value.head = result;
};
//卸载时取消监听
//卸载完毕
onUnmounted(() => {
	console.log('卸载完毕,取消监听')

})

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
