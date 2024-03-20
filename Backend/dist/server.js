"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mssql_1 = __importDefault(require("mssql"));
const sql_config_1 = require("./Config/sql.config");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});
const pool = mssql_1.default.connect(sql_config_1.sqlConfig);
const connectedUsers = new Map();
io.on('connection', (socket) => {
    const userId = socket.handshake.headers.userid;
    connectedUsers.set(userId, socket); // Store the socket associated with the user id
    console.log('A client connected', socket.id, 'with userId:', userId);
    socket.on('message', (message) => {
        console.log('Received message:', message.message, "To be sent to", message.recipientId);
        const recipientSocket = connectedUsers.get(message.recipientId);
        if (recipientSocket) {
            recipientSocket.emit('message', message.message); // Emit message to the recipient socket
            console.log("emitting to recipient", message.recipientId);
        }
        else {
            console.log("Recipient with userId", message.recipientId, "is not connected.");
        }
    });
    socket.on('disconnect', () => {
        connectedUsers.delete(userId); // Remove the socket from the map upon disconnection
        console.log('A client disconnected', socket.id, 'with userId:', userId);
    });
});
const PORT = 3002;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// socket.join("userId"); // Join the socket room with userId
// console.log(socket.rooms);
