"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});
io.on('connection', (socket) => {
    console.log('A client connected', socket.id);
    socket.on('message', (message) => {
        console.log('Received message:', message);
        socket.broadcast.emit('message', message);
    });
    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});
const PORT = 3002;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
