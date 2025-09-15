import { useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';

export const useChat = () => {
  const {
    messages,
    isConnected,
    isTyping,
    activeUsers,
    addMessage,
    sendMessage,
    setTyping,
    connect,
    disconnect,
    clearMessages
  } = useChatStore();

  useEffect(() => {
    // Auto-connect when hook is used
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    messages,
    isConnected,
    isTyping,
    activeUsers,
    addMessage,
    sendMessage,
    setTyping,
    clearMessages
  };
};