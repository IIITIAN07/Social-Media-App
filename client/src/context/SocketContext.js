import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ user, children }) => {
    const socketRef = useRef(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if (!user?._id) {
            return;
        }

        socketRef.current = io('http://localhost:4000');
        setSocket(socketRef.current);
        socketRef.current.emit('addUser', user._id);
        socketRef.current.on('getUsers', setOnlineUsers);

        return () => {
            socketRef.current?.disconnect();
            socketRef.current = null;
            setSocket(null);
        };
    }, [user?._id]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
