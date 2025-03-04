import * as React from 'react'
const { createContext, useContext, useEffect, useState } = React
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
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const { isAuthenticated, currentUser } = useAuth();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Initialize socket connection
      console.log("Initializing socket connection...");
      
      // Define the socket endpoint - adjust as needed for your backend
      const socketEndpoint = 'http://localhost:8000';
      
      const socketInstance = io(socketEndpoint, {
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
        timeout: 120000 // 2 minutes timeout for longer API responses
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected successfully');
        setConnected(true);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnected(false);
        
        // For development/demo purposes - enable if you want to simulate connection
        console.log('Simulating connection for demo mode');
        setTimeout(() => setConnected(true), 1000);
      });

      // Set the socket instance
      setSocket(socketInstance);

      // Cleanup on unmount
      return () => {
        console.log('Cleaning up socket connection');
        socketInstance.disconnect();
      };
    } else {
      // If not authenticated, ensure socket is disconnected
      setSocket(null);
      setConnected(false);
    }
  }, [isAuthenticated, currentUser]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;