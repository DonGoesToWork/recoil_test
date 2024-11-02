class WebSocketClient {
  private ws: WebSocket | undefined;
  private reconnectInterval: number;
  private isReconnecting: boolean = false; // Flag to prevent multiple concurrent reconnect attempts

  constructor(
    url: string,
    onMessage: (message: string) => void,
    setConnected: (connected: boolean) => void,
    setWsClient: (client: WebSocketClient) => void = () => {},
    reconnectInterval: number = 1000 // Retry every second by default
  ) {
    this.reconnectInterval = reconnectInterval;
    this.connect(url, onMessage, setConnected, setWsClient);
  }

  private connect(url: string, onMessage: (message: string) => void, setConnected: (connected: boolean) => void, setWsClient: (client: WebSocketClient) => void) {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log("Connected to WebSocket server");
      setConnected(true);
      this.isReconnecting = false; // Connection is successful, reset the reconnect flag
    };

    this.ws.onmessage = (event) => {
      onMessage(event.data);
    };

    this.ws.onclose = () => {
      console.log(`Disconnected from WebSocket server. Reconnecting in ${this.reconnectInterval / 1000} seconds...`);
      setConnected(false);
      this.scheduleReconnect(url, onMessage, setConnected, setWsClient); // Schedule reconnection attempts
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket encountered an error: ", error);

      if (this.ws === undefined) {
        return;
      }

      this.ws.close(); // Explicitly close the connection on error to trigger reconnection
    };
  }

  private scheduleReconnect(url: string, onMessage: (message: string) => void, setConnected: (connected: boolean) => void, setWsClient: (client: WebSocketClient) => void) {
    if (this.isReconnecting) {
      return; // If already reconnecting, don't schedule another one
    }

    this.isReconnecting = true;

    setTimeout(() => {
      console.log("Attempting to reconnect to WebSocket...");

      const newClient = new WebSocketClient(url, onMessage, setConnected, setWsClient, this.reconnectInterval);
      if (newClient.getState() !== WebSocket.OPEN) {
        console.log("Reconnection failed. Will retry...");
        this.isReconnecting = false; // Allow retrying if it fails
      } else {
        console.log("Reconnection successful.");
        setWsClient(newClient); // Successfully replace the WebSocketClient instance
      }
    }, this.reconnectInterval);
  }

  getState(): number {
    if (this.ws === undefined) {
      return -1;
    }

    return this.ws.readyState;
  }

  sendMessage(message: string): void {
    if (this.ws === undefined) {
      return;
    }

    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.error("WebSocket is not open. Message not sent.");
    }
  }

  close(): void {
    if (this.ws === undefined) {
      return;
    }

    this.ws.close();
  }
}

export default WebSocketClient;
