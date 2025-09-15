import { create } from 'zustand';
import type { ChatState, ChatMessage } from '@/types';

interface ChatStore extends ChatState {
  addMessage: (message: ChatMessage) => void;
  sendMessage: (message: string) => Promise<void>;
  setTyping: (isTyping: boolean) => void;
  connect: () => void;
  disconnect: () => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [
    // Mock messages for development
    {
      id: '1',
      userId: '2',
      username: 'Mike Johnson',
      message: 'Great game today! Really proud of the team.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      id: '2',
      userId: '3',
      username: 'Sarah Davis',
      message: 'Can\'t wait for the next match! 🔥',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    }
  ],
  isConnected: false,
  isTyping: false,
  activeUsers: ['Mike Johnson', 'Sarah Davis', 'Alex Wilson'],

  addMessage: (message: ChatMessage) => {
    set(state => ({
      messages: [...state.messages, message]
    }));
  },

  sendMessage: async (messageText: string) => {
    try {
      // TODO: Implement Socket.IO message sending
      // socket.emit('message', { message: messageText });
      
      // Mock message for development
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: '1', // Current user
        username: 'You',
        message: messageText,
        timestamp: new Date().toISOString(),
        avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      };
      
      get().addMessage(newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  },

  setTyping: (isTyping: boolean) => {
    set({ isTyping });
    // TODO: Emit typing status to socket
    // socket.emit('typing', { isTyping });
  },

  connect: () => {
    // TODO: Initialize Socket.IO connection
    // socket = io(process.env.EXPO_PUBLIC_SOCKET_URL);
    // socket.on('connect', () => set({ isConnected: true }));
    // socket.on('message', (message) => get().addMessage(message));
    
    // Mock connection for development
    set({ isConnected: true });
  },

  disconnect: () => {
    // TODO: Disconnect Socket.IO
    // socket?.disconnect();
    
    set({ isConnected: false });
  },

  clearMessages: () => {
    set({ messages: [] });
  }
}));