class WebSocketClient {
  private ws: WebSocket | undefined;
  private reconnectInterval: number = 1000;
  private reconnectCount: number = 0;
  private reconnectIntervalId: NodeJS.Timeout | null = null;

  constructor(private url: string, private onMessage: (message: string) => void, private setConnected: (connected: boolean) => void, private set_state: (state: any) => void) {
    this.connect();
  }

  private connect() {
    // Only attempt to connect if ws is undefined or fully closed
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      console.log("WebSocket connection already in progress or open. Skipping connect attempt.");
      return;
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("Connected to WebSocket server");
      this.setConnected(true);
      this.clearReconnectInterval(); // Stop further reconnect attempts
      this.reconnectCount = 0; // Reset count on successful connection
    };

    this.ws.onmessage = (event) => {
      this.onMessage(event.data);
    };

    this.ws.onclose = (event: any) => {
      console.log("EVENT: ", event);

      if (event.reason === "Client already connected.") {
        console.log("Failed to connect because already connected. Avoiding reconnection attempts.");
        return;
      }

      console.log("Disconnected. Scheduling reconnection attempts...");
      this.set_state({}); // for now, we just clear state and let backend send all objects on reconnect -- planned task is to make reconnect logic smoother and not need to do this
      this.setConnected(false);
      this.scheduleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket encountered an error: ", error);
      this.ws?.close(); // Close to trigger `onclose` and initiate reconnect
    };
  }

  private scheduleReconnect() {
    if (this.reconnectIntervalId) {
      // Already scheduled, so skip scheduling again
      return;
    }

    // Schedule periodic reconnection attempts
    this.reconnectIntervalId = setInterval(() => {
      this.reconnectCount++;
      console.log(`Attempting to reconnect to WebSocket... (Attempt ${this.reconnectCount})`);

      // Attempt reconnection only if the WebSocket is fully closed
      if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
        this.connect();
      }
    }, this.reconnectInterval);
  }

  private clearReconnectInterval() {
    if (this.reconnectIntervalId) {
      clearInterval(this.reconnectIntervalId);
      this.reconnectIntervalId = null;
    }
  }

  getState(): number {
    return this.ws?.readyState ?? -1;
  }

  sendMessage(message: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.error("WebSocket is not open. Message not sent.");
    }
  }

  close(): void {
    this.clearReconnectInterval();
    this.ws?.close();
  }
}

export default WebSocketClient;
