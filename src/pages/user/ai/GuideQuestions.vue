<template>
    <div class="guide-questions">
        <el-button @click="openDrawer">提问</el-button>
        <el-drawer title="问答" v-model="state.drawerVisible" direction="rtl" size="50%">
            <div class="conversation-container">
                <div class="conversation">
                    <div v-for="(record, index) in state.conversation" :key="index" class="message">
                        <div v-if="record.user" class="user-message">
                            <img :src="userInfo.head || defaultAvatar" alt="User Avatar" class="avatar" />
                            <div class="user">
                                {{ userInfo.username }}: {{ record.question }}
                            </div>
                        </div>
                        <div v-if="record.loading" class="assistant-message">
                            <img :src="defaultAvatar" alt="Assistant Avatar" class="avatar" />
                            <div class="assistant loading">正在全力思考中...</div>
                        </div>
                        <div v-else-if="record.answer" class="assistant-message">
                            <img :src="defaultAvatar" alt="Assistant Avatar" class="avatar" />
                            <div class="assistant" v-html="record.answer"></div>
                        </div>
                    </div>
                </div>
                <div class="input-container">
                    <input v-model="state.question" type="text" placeholder="请输入问题" />
                    <el-button @click="askQuestion">提问</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script setup name="GuideQuestions">
import { reactive, onMounted } from 'vue';
import { chat } from '@/api/user/ConfessionWallApi';

const userInfo = reactive({
    id: '',
    username: '',
    head: ''
});

// 响应式状态对象
const state = reactive({
    drawerVisible: false,
    question: '',
    conversation: [],
    loading: false,
    error: null,
});

// 默认头像路径
const defaultAvatar = '/favicon.png'; // 使用 public 目录下的 favicon.png

// 打开抽屉
const openDrawer = () => {
    state.drawerVisible = true;
};

// 提问函数
const askQuestion = async () => {
    if (!state.question) {
        state.error = '请输入问题';
        return;
    }
    state.error = null;
    const newRecord = {
        user: userInfo.username,
        question: state.question,
        answer: null,
        loading: true
    };
    state.conversation.push(newRecord);
    state.question = ''; // 清空输入框
    try {
        const response = await chat(state.question);
        newRecord.answer = response.data.msg;
    } catch (error) {
        newRecord.answer = '提问失败，请重试';
    } finally {
        newRecord.loading = false;
    }
};

onMounted(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
        Object.assign(userInfo, JSON.parse(storedUserInfo));
    }
});
</script>

<style scoped>
.guide-questions {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.el-drawer__body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.conversation-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.conversation {
    flex: 1;
    max-height: calc(100% - 100px);
    /* 确保输入框有足够的空间 */
    overflow-y: auto;
    margin-bottom: 20px;
}

.input-container {
    display: flex;
    border-top: 1px solid #ccc;
    padding-top: 10px;
}

.input-container input {
    flex: 1;
    padding: 10px;
    font-size: 16px;
}

.input-container button {
    padding: 10px 20px;
    font-size: 16px;
    margin-left: 10px;
    cursor: pointer;
}

.loading {
    color: #007bff;
}

.error {
    color: red;
}

.message {
    margin-bottom: 10px;
}

.user-message {
    display: flex;
    align-items: flex-start;
}

.assistant-message {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.user-message .avatar {
    margin-right: 10px;
}

.assistant-message .avatar {
    margin-left: 10px;
    margin-right: 0;
}

.user {
    font-weight: bold;
    color: #333;
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 5px;
    max-width: 70%;
}

.assistant {
    margin-top: 5px;
    color: #555;
    background-color: #e0f7fa;
    padding: 10px;
    border-radius: 5px;
    max-width: 70%;
    text-align: left;
}

.assistant.loading {
    color: #007bff;
}
</style>
