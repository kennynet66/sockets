import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
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
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log(token);
    next();
})

const PORT = 3002;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
