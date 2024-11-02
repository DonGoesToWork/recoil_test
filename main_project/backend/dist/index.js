"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 5000;
const server = (0, http_1.createServer)(app);
const wss = new ws_1.WebSocketServer({ server });
wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        if (message.toString() === "hi") {
            ws.send("hi");
        }
        else {
            ws.send("Invalid message");
        }
    });
    ws.send("Connected to WebSocket server");
});
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// testf
