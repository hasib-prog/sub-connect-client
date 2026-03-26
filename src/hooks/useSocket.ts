'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(userId: string | undefined) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Create socket connection
    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5001', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setIsConnected(true);
      
      // Emit user_online event
      socket.emit('user_online', userId);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socketRef.current = socket;

    return () => {
      if (socketRef.current) {
        socket.emit('user_offline', userId);
        socket.disconnect();
      }
    };
  }, [userId]);

  return {
    socket: socketRef.current,
    isConnected,
  };
}

// Hook for listening to specific conversation events
export function useConversationEvents(
  conversationId: string | null,
  userId: string | undefined
) {
  const { socket } = useSocket(userId);

  useEffect(() => {
    if (!socket || !conversationId || !userId) return;

    // Join conversation room
    socket.emit('join_conversation', {
      userId,
      conversationId,
    });

    return () => {
      // Leave conversation room
      socket.emit('leave_conversation', {
        userId,
        conversationId,
      });
    };
  }, [socket, conversationId, userId]);

  return socket;
}
