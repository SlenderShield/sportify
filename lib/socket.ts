import { io, Socket } from 'socket.io-client';
import type { SocketEvents, Message, PresenceInfo, TypingInfo } from './types/chat';

// Mock socket implementation for development
class MockSocket {
  private connected = false;
  private listeners: Record<string, Function[]> = {};
  private mockUsers = [
    { id: 'bot1', name: 'TeamBot', isOnline: true },
    { id: 'bot2', name: 'Coach AI', isOnline: true },
    { id: 'bot3', name: 'Stats Bot', isOnline: false },
  ];
  private messageInterval: ReturnType<typeof setInterval> | null = null;
  private typingInterval: ReturnType<typeof setInterval> | null = null;
  private presenceInterval: ReturnType<typeof setInterval> | null = null;

  connect() {
    this.connected = true;
    this.emit('connect');
    this.startMockBehaviors();
  }

  disconnect() {
    this.connected = false;
    this.stopMockBehaviors();
    this.emit('disconnect');
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback?: Function) {
    if (!this.listeners[event]) return;
    
    if (callback) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    } else {
      this.listeners[event] = [];
    }
  }

  emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  private startMockBehaviors() {
    // Random bot messages every 5-15 seconds
    this.messageInterval = setInterval(() => {
      if (!this.connected) return;
      
      const messages = [
        "Let's discuss today's training session!",
        "Great match today everyone! 🏆",
        "Don't forget about tomorrow's practice at 3 PM",
        "Who's coming to the team dinner this Friday?",
        "Check out the new stats dashboard!",
        "Weather looks good for outdoor training 🌞",
        "Remember to hydrate during practice! 💧",
        "Team meeting at 7 PM tonight",
      ];
      
      const randomBot = this.mockUsers[Math.floor(Math.random() * this.mockUsers.length)];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      const conversationIds = ['general', 'dev', 'random'];
      const randomConversation = conversationIds[Math.floor(Math.random() * conversationIds.length)];
      
      const mockMessage: Message = {
        id: `mock-${Date.now()}-${Math.random()}`,
        conversationId: randomConversation,
        senderId: randomBot.id,
        text: randomMessage,
        timestamp: Date.now(),
      };
      
      this.emit('message:receive', mockMessage);
    }, Math.random() * 10000 + 5000); // 5-15 seconds

    // Random typing indicators
    this.typingInterval = setInterval(() => {
      if (!this.connected) return;
      
      const randomBot = this.mockUsers[Math.floor(Math.random() * this.mockUsers.length)];
      const conversationIds = ['general', 'dev', 'random'];
      const randomConversation = conversationIds[Math.floor(Math.random() * conversationIds.length)];
      
      // Start typing
      this.emit('typing:start', {
        conversationId: randomConversation,
        userId: randomBot.id,
        userName: randomBot.name,
      });
      
      // Stop typing after 2-5 seconds
      setTimeout(() => {
        this.emit('typing:stop', {
          conversationId: randomConversation,
          userId: randomBot.id,
        });
      }, Math.random() * 3000 + 2000);
    }, Math.random() * 15000 + 10000); // 10-25 seconds

    // Random presence updates
    this.presenceInterval = setInterval(() => {
      if (!this.connected) return;
      
      const randomBot = this.mockUsers[Math.floor(Math.random() * this.mockUsers.length)];
      const isOnline = Math.random() > 0.3; // 70% chance online
      
      this.emit('presence:update', {
        userId: randomBot.id,
        isOnline,
      });
    }, Math.random() * 20000 + 15000); // 15-35 seconds
  }

  private stopMockBehaviors() {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
      this.messageInterval = null;
    }
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.typingInterval = null;
    }
    if (this.presenceInterval) {
      clearInterval(this.presenceInterval);
      this.presenceInterval = null;
    }
  }

  get isConnected() {
    return this.connected;
  }
}

// Socket configuration
const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'ws://localhost:3000';
const USE_MOCK = process.env.NODE_ENV === 'development' || !process.env.EXPO_PUBLIC_SOCKET_URL;

// Export either mock or real socket based on environment
export const socket = USE_MOCK 
  ? new MockSocket() 
  : io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 5000,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

// Chat-specific socket utilities
export class ChatSocketManager {
  private static instance: ChatSocketManager;
  private eventHandlers: Map<string, Function> = new Map();

  static getInstance(): ChatSocketManager {
    if (!ChatSocketManager.instance) {
      ChatSocketManager.instance = new ChatSocketManager();
    }
    return ChatSocketManager.instance;
  }

  // Connection management
  connect() {
    if ('connect' in socket && typeof socket.connect === 'function') {
      socket.connect();
    } else {
      (socket as MockSocket).connect();
    }
  }

  disconnect() {
    if ('disconnect' in socket && typeof socket.disconnect === 'function') {
      socket.disconnect();
    } else {
      (socket as MockSocket).disconnect();
    }
  }

  // Message events
  onMessage(callback: (message: Message) => void) {
    socket.on('message:receive', callback);
    this.eventHandlers.set('message:receive', callback);
  }

  sendMessage(conversationId: string, text: string, replyTo?: string) {
    socket.emit('message:send', { conversationId, text, replyTo });
  }

  editMessage(messageId: string, text: string) {
    socket.emit('message:edit', { messageId, text });
  }

  deleteMessage(messageId: string) {
    socket.emit('message:delete', messageId);
  }

  addReaction(messageId: string, emoji: string, userId: string) {
    socket.emit('message:react', { messageId, emoji, userId });
  }

  // Typing indicators
  onTypingStart(callback: (data: { conversationId: string; userId: string; userName: string }) => void) {
    socket.on('typing:start', callback);
    this.eventHandlers.set('typing:start', callback);
  }

  onTypingStop(callback: (data: { conversationId: string; userId: string }) => void) {
    socket.on('typing:stop', callback);
    this.eventHandlers.set('typing:stop', callback);
  }

  startTyping(conversationId: string, userId: string, userName: string) {
    socket.emit('typing:start', { conversationId, userId, userName });
  }

  stopTyping(conversationId: string, userId: string) {
    socket.emit('typing:stop', { conversationId, userId });
  }

  // Presence events
  onPresenceUpdate(callback: (data: { userId: string; isOnline: boolean }) => void) {
    socket.on('presence:update', callback);
    this.eventHandlers.set('presence:update', callback);
  }

  updatePresence(userId: string, isOnline: boolean) {
    socket.emit('presence:update', { userId, isOnline });
  }

  requestPresence() {
    socket.emit('presence:request');
  }

  // Conversation events
  onConversationCreate(callback: (conversation: any) => void) {
    socket.on('conversation:create', callback);
    this.eventHandlers.set('conversation:create', callback);
  }

  onConversationUpdate(callback: (data: { conversationId: string; updates: any }) => void) {
    socket.on('conversation:update', callback);
    this.eventHandlers.set('conversation:update', callback);
  }

  createConversation(conversation: any) {
    socket.emit('conversation:create', conversation);
  }

  updateConversation(conversationId: string, updates: any) {
    socket.emit('conversation:update', { conversationId, updates });
  }

  // Connection events
  onConnect(callback: () => void) {
    socket.on('connect', callback);
    this.eventHandlers.set('connect', callback);
  }

  onDisconnect(callback: () => void) {
    socket.on('disconnect', callback);
    this.eventHandlers.set('disconnect', callback);
  }

  onReconnect(callback: () => void) {
    socket.on('reconnect', callback);
    this.eventHandlers.set('reconnect', callback);
  }

  // Cleanup
  removeAllListeners() {
    this.eventHandlers.forEach((callback, event) => {
      socket.off(event, callback as any);
    });
    this.eventHandlers.clear();
  }

  removeListener(event: string) {
    const callback = this.eventHandlers.get(event);
    if (callback) {
      socket.off(event, callback as any);
      this.eventHandlers.delete(event);
    }
  }
}

// Legacy setup function for backward compatibility
export const setupSocketListeners = () => {
  const chatSocket = ChatSocketManager.getInstance();
  
  chatSocket.onConnect(() => {
    console.log('✅ Connected to chat server');
  });

  chatSocket.onDisconnect(() => {
    console.log('❌ Disconnected from chat server');
  });

  chatSocket.onReconnect(() => {
    console.log('🔄 Reconnected to chat server');
  });

  if ('on' in socket) {
    socket.on('error', (error: any) => {
      console.error('🚫 Socket error:', error);
    });
  }

  return chatSocket;
};
