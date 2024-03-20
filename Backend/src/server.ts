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

io.on('connection', (socket: Socket) => {
    const userId: string = socket.handshake.headers.userid as string;
    
    console.log('A client connected', socket.id, 'with userId:', userId);

    // socket.join(userId); // Join the socket room with userId

    socket.on('message', (message: any) => {
        console.log('Received message:', message);

        if (message.recipientId === userId) {
            console.log("emitting to sender", userId);
            socket.emit('message', message.message); // Emit message only to the sender
        } else {
            console.log("emitting to recipient", userId);
            io.to(message.recipientId).emit('message', message.message); // Emit message to the recipient
        }
    });

    socket.on('disconnect', () => {
        console.log('A client disconnected', socket.id, 'with userId:', userId);
    });
});


const PORT = 3002;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});