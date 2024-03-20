import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import mssql from 'mssql';
import { sqlConfig } from './Config/sql.config';

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

const pool = mssql.connect(sqlConfig)

const connectedUsers: Map<string, Socket> = new Map();

io.on('connection', (socket: Socket) => {
    const userId: string = socket.handshake.headers.userid as string;
    connectedUsers.set(userId, socket); // Store the socket associated with the user id
    
    console.log('A client connected', socket.id, 'with userId:', userId);

    socket.on('message', (message: { message: string, recipientId: string }) => {
        console.log('Received message:', message.message, "To be sent to", message.recipientId);

        const recipientSocket = connectedUsers.get(message.recipientId);
        if (recipientSocket) {
            recipientSocket.emit('message', message.message); // Emit message to the recipient socket
            console.log("emitting to recipient", message.recipientId);
        } else {
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