import { defineStore } from 'pinia';
//pinia管理 webSocket

interface WebSocketState {
  socket: WebSocket | null;
  messages: string[];
}

export const useWebSocketStore = defineStore('webSocket', {
  state: (): WebSocketState => ({
    socket: null,
    messages: [],
  }),
  actions: {
    connectWebSocket(userId: string) {
      this.socket = new WebSocket(`ws://localhost:8080/ws/${userId}`);
      this.socket.onmessage = (event: MessageEvent<string>) => {
        this.addMessage(event.data);
      };
    },
    addMessage(message: string) {
      this.messages.push(message);
    },
    closeScoket(){
      this.socket = null;
    }
  },
  getters: {
    getMessages(state: WebSocketState): string[] {
      return state.messages;
    },
  },
});
