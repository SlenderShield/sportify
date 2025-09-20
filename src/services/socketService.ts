import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(url: string = 'https://api.sportify.com'): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(url, {
      transports: ['websocket'],
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', error => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  emit(event: string, data?: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (data: any) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isSocketConnected(): boolean {
    return this.isConnected;
  }
}

export const socketService = new SocketService();
