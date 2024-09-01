import { io, Socket } from "socket.io-client";

class WebSocketService {
  private socket: Socket | null = null;

  connect(url: string): Socket {
    if (!this.socket) {
      this.socket = io(url, {
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      this.socket.on("disconnect", (reason: string) => {
        console.log("Disconnected:", reason);
      });

      this.socket.on("connect_error", (error: Error) => {
        console.error("Connection Error:", error);
      });
    }

    return this.socket;
  }

  sendMessage(event: string, message: string) {
    if (this.socket) {
      this.socket.emit(event, message);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const webSocketService = new WebSocketService();
