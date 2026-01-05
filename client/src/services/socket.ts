import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private sessionId: string | null = null;

  connect(sessionId: string) {
    if (this.socket) {
      this.disconnect();
    }

    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

    this.socket = io(serverUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.sessionId = sessionId;

    this.socket.on('connect', () => {
      console.log('Connected to server');
      if (this.sessionId) {
        this.socket?.emit('join-session', this.sessionId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket && this.sessionId) {
      this.socket.emit('leave-session', this.sessionId);
      this.socket.disconnect();
      this.socket = null;
      this.sessionId = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }
}

export default new SocketService();