import { defineStore } from 'pinia';
import { io } from 'socket.io-client';

export const useSocketStore = defineStore('socket', {
  state: () => ({ socket: null }),
  actions: {
    connect(url) {
      if (!this.socket) {
        this.socket = io(url);
      }
    },
    join(room) {
      this.socket?.emit('join', room);
    },
    on(event, cb) {
      this.socket?.on(event, cb);
    }
  }
});
