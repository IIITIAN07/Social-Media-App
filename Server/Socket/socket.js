import { Server } from 'socket.io';

let io;
const onlineUsers = new Map();

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST', 'PUT']
        }
    });

    io.on('connection', (socket) => {
        socket.on('addUser', (userId) => {
            if (userId) {
                onlineUsers.set(userId, socket.id);
                io.emit('getUsers', Array.from(onlineUsers.keys()));
            }
        });

        socket.on('disconnect', () => {
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            io.emit('getUsers', Array.from(onlineUsers.keys()));
        });
    });
};

export const emitToUser = (userId, eventName, payload) => {
    const socketId = onlineUsers.get(userId?.toString());
    if (io && socketId) {
        io.to(socketId).emit(eventName, payload);
    }
};
