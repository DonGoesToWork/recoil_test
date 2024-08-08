import { WebSocketServer } from "ws";
import { createServer } from "http";
import express from "express";

const app = express();
const PORT = 5000;

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received:", message);
    ws.send(`Hello, you sent 4 -> ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.send("Connected to WebSocket server");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
