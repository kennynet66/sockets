import { Server } from 'socket.io';
import { createServer } from 'http';
import express, { Request, Response, json } from 'express';
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

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

const PORT = 3002;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
