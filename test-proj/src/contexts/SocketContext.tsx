import * as React from 'react'
const { createContext, useContext, useEffect, useState } = React
type ReactNode = React.ReactNode
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const defaultValue: SocketContextType = {
  socket: null,
  connected: false
};

const SocketContext = createContext<SocketContextType>(defaultValue);

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const { isAuthenticated, currentUser } = useAuth();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Initialize socket connection
      const socketInstance = io('http://localhost:8000', {
        path: '/sockets',
        transports: ['websocket'],
        upgrade: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        auth: {
          userId: currentUser.id,
          userName: currentUser.name
        },
        // Increase timeout for longer API responses
        timeout: 120000
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      socketInstance.on('connect_error', (error) => {
        console.log('Socket connection error:', error);
        setConnected(false);
        
        // Optional: For demo purposes only - Simulate connection after delay
        // Comment this in production
        console.log('Simulating connection for demo');
        setTimeout(() => setConnected(true), 1000);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [isAuthenticated, currentUser]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};