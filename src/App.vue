<template>
    <router-view />
</template>
<script lang="ts" setup name="App">
import { onMounted, onBeforeUnmount } from 'vue';
import { useWebSocketStore } from '@/stores/webSocket';

const webSocketStore = useWebSocketStore();

onMounted(() => {
    // 页面加载时检查用户是否已登录
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        console.log("链接检测")
        webSocketStore.startConnectionCheck();  // 启动全局的连接检查
    }
});

onBeforeUnmount(() => {
    // 页面卸载时停止检查
    console.log("关闭链接检测")
    webSocketStore.stopConnectionCheck();
});
</script>