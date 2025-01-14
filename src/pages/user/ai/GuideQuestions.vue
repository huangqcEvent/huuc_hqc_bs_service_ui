<template>
    <div class="guide-questions">
        <div class="icon-container" @click="openDrawer">
            <el-icon class="item" style="font-size: 25px;">
                <ChatDotRound />
            </el-icon>
            <span class="icon-text">小助手</span>
        </div>
        <el-drawer title="智慧问答小助手" v-model="state.drawerVisible" direction="rtl" size="50%">
            <div class="conversation-container" ref="conversationContainer">
                <div class="conversation">
                    <div class="assistant-message">
                        <img :src="defaultAvatar" alt="Assistant Avatar" class="avatar" />
                        <div class="assistant"> 你好，我是AI小助手，请问有什么可以帮你的吗？</div>
                    </div>
                    <div v-for="(record, index) in state.conversation" :key="index" class="message">
                        <div v-if="record.user" class="user-message">
                            <div class="user">
                                {{ record.question }}
                            </div>
                            <img :src="userInfo.head || defaultAvatar" alt="User Avatar" class="avatar" />
                        </div>
                        <div v-if="record.loading" class="assistant-message">
                            <img :src="defaultAvatar" alt="Assistant Avatar" class="avatar" />
                            <div class="assistant">正在全力思考中...</div>
                        </div>
                        <div v-else-if="record.answer" class="assistant-message">
                            <img :src="defaultAvatar" alt="Assistant Avatar" class="avatar" />
                            <div class="assistant" v-html="parseNewLines(record.answer)"></div>
                        </div>
                    </div>
                </div>
                <div class="input-container">
                    <input v-model="state.question" type="text" placeholder="请输入问题" @keyup.enter="askQuestion" />
                    <el-button @click="askQuestion">提问</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script setup name="GuideQuestions">
import { reactive, onMounted, ref, nextTick } from 'vue';
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
    try {
        const response = await chat(state.question);
        newRecord.answer = response.data.data;
        state.question = ''; // 清空输入框
    } catch (error) {
        newRecord.answer = '提问失败，请重试';
    } finally {
        newRecord.loading = false;
        nextTick(() => {
            if (conversationContainer.value) {
                conversationContainer.value.scrollTop = conversationContainer.value.scrollHeight;
            }
        });
    }
};

// 解析换行符
function parseNewLines(text) {
    return text.replace(/\n/g, '<br>').replace(/\*\*/g, '');
};

const conversationContainer = ref(null);

onMounted(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
        Object.assign(userInfo, JSON.parse(storedUserInfo));
    }
});
</script>

<style scoped lang="scss">
.item {
    margin-top: 10px;
    margin-right: 0px;
    cursor: pointer;
}

.icon-text {
    visibility: hidden;
    margin-top: 10px;
    transition: opacity 0.3s;
}

.icon-container:hover .icon-text {
    visibility: visible;
    opacity: 1;
}

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
    overflow-y: auto;
    scrollbar-width: thin;
    /* Firefox */
    scrollbar-color: #888 #f1f1f1;
    /* Firefox */
}

.conversation-container::-webkit-scrollbar {
    width: 8px;
    /* Chrome, Safari, Edge */
}

.conversation-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    /* Chrome, Safari, Edge */
}

.conversation-container::-webkit-scrollbar-thumb {
    background: #888;
    /* Chrome, Safari, Edge */
    border-radius: 4px;
}

.conversation-container::-webkit-scrollbar-thumb:hover {
    background: #555;
    /* Chrome, Safari, Edge */
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
    background-color: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.input-container input {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: none;
    outline: none;
}

.input-container button {
    padding: 10px 20px;
    font-size: 16px;
    margin-left: 10px;
    cursor: pointer;
    border: none;
    background-color: #007bff;
    color: #fff;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.input-container button:hover {
    background-color: #0056b3;
}

.error {
    color: red;
}

.message {
    margin-bottom: 10px;
}

.assistant-message {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
}

.user-message {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    margin-bottom: 20px;
}

.user-message .avatar {
    margin-left: 10px;
    /* 调整用户头像与对话框的距离 */
}

.assistant-message .avatar {
    margin-right: 10px;
    /* 调整助手头像与对话框的距离 */
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.user {
    margin-top: 5px;
    color: #555;
    background-color: #d1ee99;
    padding: 10px;
    border-radius: 5px;
    max-width: 70%;
    text-align: left;
}

.assistant {
    margin-top: 5px;
    color: #555;
    background-color: #caf0f5;
    padding: 10px;
    border-radius: 5px;
    max-width: 70%;
    text-align: left;
}

.assistant.loading {
    color: #007bff;
}
</style>
