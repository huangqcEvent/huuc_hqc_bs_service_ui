import { defineStore } from 'pinia';

interface WebSocketState {
  socket: WebSocket | null;
  messages: string[];
  isConnected: boolean;
  userId: string | null;
  connectionCheckTimer: number | null;
}

export const useWebSocketStore = defineStore('webSocket', {
  state: (): WebSocketState => {
    const userId = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!).id : null;
    const savedMessages = localStorage.getItem(`messages_${userId}`);
    return {
      socket: null,
      messages: savedMessages ? JSON.parse(savedMessages) : [],  // 如果有缓存，加载它
      isConnected: false,
      userId: userId,
      connectionCheckTimer: null,
    };
  },
  actions: {
    // 建立 WebSocket 连接
    connectWebSocket(userId: string) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        console.log('WebSocket 连接已经存在');
        return;
      }
      this.userId = userId;

      // 连接时读取该用户的消息并更新
      this.loadMessages(userId);

      const socketUrl = `ws://localhost:8080/ws/${userId}`;
      this.socket = new WebSocket(socketUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        console.log('WebSocket 连接已建立');
      };

      localStorage.setItem(`messages_${this.userId}`, JSON.stringify(this.messages));

      this.socket.onmessage = (event: MessageEvent<string>) => {
        this.addMessage(event.data);  // 更新消息列表
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket 连接错误：', error);
        this.isConnected = false;
        this.reconnectWebSocket(userId);  // 错误时尝试重连
      };
    },

    // 从 localStorage 加载消息
    loadMessages(userId: string) {
      const savedMessages = localStorage.getItem(`messages_${userId}`);
      if (savedMessages) {
        this.messages = JSON.parse(savedMessages);  // 更新状态
      }
    },

    // 收到的消息
    addMessage(message: string) {
      this.messages.push(message);  // 更新 messages 数组
      if (this.userId) {
        // 将更新后的消息列表保存到 localStorage
        localStorage.setItem(`messages_${this.userId}`, JSON.stringify(this.messages));
      }
    },

    // 尝试重新连接
    reconnectWebSocket(userId: string) {
      if (!this.isConnected && this.userId) {
        console.log('尝试重新连接 WebSocket...');
        setTimeout(() => {
          this.connectWebSocket(userId);  // 尝试重新连接
        }, 10000);  // 10秒后重试
      }
    },

    // 停止 WebSocket 连接
    closeSocket() {
      if (this.socket) {
        // 清除连接检查定时器
        this.stopConnectionCheck();

        // 清除 WebSocket 事件监听
        this.socket.onopen = null;
        this.socket.onmessage = null;
        this.socket.onerror = null;
        this.socket.onclose = null;

        // 关闭 WebSocket 连接
        this.socket.close();
        this.socket = null; // 清空 socket 对象

        // 清除状态
        this.isConnected = false;
        this.userId = null;
        this.messages = [];
      }
    },

    // 启动全局的连接检查
    startConnectionCheck() {
      // 如果定时器已存在，先清除
      if (this.connectionCheckTimer !== null) {
        clearInterval(this.connectionCheckTimer);
      }

      // 每三秒检查一次连接
      this.connectionCheckTimer = setInterval(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          console.log('WebSocket 连接正常');
        } else {
          console.log('WebSocket 连接断开，正在尝试重新连接...');
          if (this.userId && !this.isConnected) {
            this.reconnectWebSocket(this.userId);  // 通过 userId 重新连接
          }
        }
      }, 60000);  // 每三秒检查一次连接
    },

    // 停止连接检查定时器
    stopConnectionCheck() {
      if (this.connectionCheckTimer !== null) {
        clearInterval(this.connectionCheckTimer); // 清除定时器
        this.connectionCheckTimer = null;
      }
    },
  },

  getters: {
    getMessages(state: WebSocketState): string[] {
      return state.messages;
    },
  },
});