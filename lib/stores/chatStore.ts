import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ChatState, Message, Conversation, User, TypingInfo, GiftedChatMessage } from '../types/chat';
import { ChatSocketManager } from '../socket';

const STORAGE_KEY = 'chat-store';

// Helper functions
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const formatMessageForGiftedChat = (message: Message, users: Record<string, User>): GiftedChatMessage => {
  const user = users[message.senderId];
  return {
    _id: message.id,
    text: message.text,
    createdAt: new Date(message.timestamp),
    user: {
      _id: message.senderId,
      name: user?.name || 'Unknown User',
      avatar: user?.avatar,
    },
    reactions: message.reactions,
    replyTo: message.replyTo ? {
      _id: message.replyTo,
      text: 'Original message', // Would need to find the actual message
      user: { _id: 'unknown', name: 'User' }
    } : undefined,
  };
};

// Mock data
const mockUsers: Record<string, User> = {
  'current-user': {
    id: 'current-user',
    name: 'You',
    color: '#3B82F6',
    isOnline: true,
  },
  'bot1': {
    id: 'bot1',
    name: 'TeamBot',
    color: '#10B981',
    isOnline: true,
    avatar: '🤖',
  },
  'bot2': {
    id: 'bot2',
    name: 'Coach AI',
    color: '#F59E0B',
    isOnline: true,
    avatar: '👨‍💼',
  },
  'bot3': {
    id: 'bot3',
    name: 'Stats Bot',
    color: '#8B5CF6',
    isOnline: false,
    avatar: '📊',
  },
  'user1': {
    id: 'user1',
    name: 'Alex Johnson',
    color: '#EF4444',
    isOnline: true,
    avatar: '👤',
  },
  'user2': {
    id: 'user2',
    name: 'Sarah Williams',
    color: '#EC4899',
    isOnline: false,
    avatar: '👤',
  },
  'user3': {
    id: 'user3',
    name: 'Mike Davis',
    color: '#06B6D4',
    isOnline: true,
    avatar: '👤',
  },
};

const mockConversations: Conversation[] = [
  {
    id: 'general',
    name: '#general',
    type: 'team',
    memberIds: ['current-user', 'bot1', 'bot2', 'bot3', 'user1', 'user2', 'user3'],
    unreadCount: 0,
    description: 'General team discussions',
    avatar: '📢',
  },
  {
    id: 'dev',
    name: '#development',
    type: 'team',
    memberIds: ['current-user', 'bot1', 'bot2', 'user1', 'user3'],
    unreadCount: 0,
    description: 'Development and technical discussions',
    avatar: '💻',
  },
  {
    id: 'random',
    name: '#random',
    type: 'team',
    memberIds: ['current-user', 'bot1', 'user1', 'user2', 'user3'],
    unreadCount: 0,
    description: 'Random conversations and fun stuff',
    avatar: '🎲',
  },
  {
    id: 'dm-user1',
    name: 'Alex Johnson',
    type: 'dm',
    memberIds: ['current-user', 'user1'],
    unreadCount: 0,
    avatar: '👤',
  },
  {
    id: 'dm-user2',
    name: 'Sarah Williams',
    type: 'dm',
    memberIds: ['current-user', 'user2'],
    unreadCount: 0,
    avatar: '👤',
  },
];

const mockMessages: Record<string, Message[]> = {
  'general': [
    {
      id: 'msg-1',
      conversationId: 'general',
      senderId: 'bot1',
      text: 'Welcome to the team chat! 🏆',
      timestamp: Date.now() - 3600000,
    },
    {
      id: 'msg-2',
      conversationId: 'general',
      senderId: 'user1',
      text: 'Thanks! Excited to be here!',
      timestamp: Date.now() - 3500000,
    },
    {
      id: 'msg-3',
      conversationId: 'general',
      senderId: 'bot2',
      text: 'Don\'t forget about today\'s training session at 3 PM 💪',
      timestamp: Date.now() - 1800000,
    },
  ],
  'dev': [
    {
      id: 'msg-dev-1',
      conversationId: 'dev',
      senderId: 'bot1',
      text: 'Let\'s discuss the new chat feature implementation',
      timestamp: Date.now() - 2400000,
    },
    {
      id: 'msg-dev-2',
      conversationId: 'dev',
      senderId: 'user3',
      text: 'The real-time messaging is working great! 🚀',
      timestamp: Date.now() - 1200000,
    },
  ],
  'random': [
    {
      id: 'msg-random-1',
      conversationId: 'random',
      senderId: 'user1',
      text: 'Anyone up for pizza after practice? 🍕',
      timestamp: Date.now() - 7200000,
    },
    {
      id: 'msg-random-2',
      conversationId: 'random',
      senderId: 'user2',
      text: 'Count me in! 🙋‍♀️',
      timestamp: Date.now() - 7000000,
    },
  ],
  'dm-user1': [
    {
      id: 'msg-dm-1',
      conversationId: 'dm-user1',
      senderId: 'user1',
      text: 'Hey! How was your training today?',
      timestamp: Date.now() - 900000,
    },
    {
      id: 'msg-dm-2',
      conversationId: 'dm-user1',
      senderId: 'current-user',
      text: 'It was great! Really pushed myself 💪',
      timestamp: Date.now() - 600000,
    },
  ],
  'dm-user2': [],
};

export const useChatStore = create<ChatState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    conversations: [],
    messages: {},
    users: {},
    currentUser: null,
    activeConversationId: null,
    isLoading: false,
    searchQuery: '',
    typingUsers: {},

    // Basic actions
    setCurrentUser: (user: User) => {
      set({ currentUser: user });
      // Update user in users map
      set(state => ({
        users: { ...state.users, [user.id]: user }
      }));
    },

    setActiveConversation: (conversationId: string | null) => {
      set({ activeConversationId: conversationId });
      
      // Mark conversation as read when opened
      if (conversationId) {
        get().markAsRead(conversationId);
      }
    },

    // Conversation management
    createConversation: (conversation: Omit<Conversation, 'id'>) => {
      const id = generateId();
      const newConversation: Conversation = { ...conversation, id };
      
      set(state => ({
        conversations: [...state.conversations, newConversation],
        messages: { ...state.messages, [id]: [] }
      }));
      
      // Emit to socket
      const chatSocket = ChatSocketManager.getInstance();
      chatSocket.createConversation(newConversation);
      
      return id;
    },

    updateConversation: (conversationId: string, updates: Partial<Conversation>) => {
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId ? { ...conv, ...updates } : conv
        )
      }));
      
      // Emit to socket
      const chatSocket = ChatSocketManager.getInstance();
      chatSocket.updateConversation(conversationId, updates);
    },

    deleteConversation: (conversationId: string) => {
      set(state => {
        const { [conversationId]: deletedMessages, ...remainingMessages } = state.messages;
        return {
          conversations: state.conversations.filter(conv => conv.id !== conversationId),
          messages: remainingMessages,
          activeConversationId: state.activeConversationId === conversationId ? null : state.activeConversationId
        };
      });
    },

    // Message management
    sendMessage: (conversationId: string, text: string, replyTo?: string) => {
      const { currentUser } = get();
      if (!currentUser) return;

      const message: Message = {
        id: generateId(),
        conversationId,
        senderId: currentUser.id,
        text,
        timestamp: Date.now(),
        replyTo,
      };

      // Add message locally
      set(state => ({
        messages: {
          ...state.messages,
          [conversationId]: [...(state.messages[conversationId] || []), message]
        },
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, lastMessage: text, lastMessageTime: message.timestamp }
            : conv
        )
      }));

      // Emit to socket
      const chatSocket = ChatSocketManager.getInstance();
      chatSocket.sendMessage(conversationId, text, replyTo);
    },

    receiveMessage: (message: Message) => {
      set(state => {
        const existingMessages = state.messages[message.conversationId] || [];
        
        // Check if message already exists (prevent duplicates)
        if (existingMessages.some(m => m.id === message.id)) {
          return state;
        }

        const isActiveConversation = state.activeConversationId === message.conversationId;
        
        return {
          messages: {
            ...state.messages,
            [message.conversationId]: [...existingMessages, message]
          },
          conversations: state.conversations.map(conv =>
            conv.id === message.conversationId
              ? {
                  ...conv,
                  lastMessage: message.text,
                  lastMessageTime: message.timestamp,
                  unreadCount: isActiveConversation ? conv.unreadCount : conv.unreadCount + 1
                }
              : conv
          )
        };
      });
    },

    editMessage: (messageId: string, newText: string) => {
      set(state => {
        const updatedMessages = { ...state.messages };
        
        for (const conversationId in updatedMessages) {
          updatedMessages[conversationId] = updatedMessages[conversationId].map(msg =>
            msg.id === messageId
              ? { ...msg, text: newText, edited: true, editedAt: Date.now() }
              : msg
          );
        }
        
        return { messages: updatedMessages };
      });

      // Emit to socket
      const chatSocket = ChatSocketManager.getInstance();
      chatSocket.editMessage(messageId, newText);
    },

    deleteMessage: (messageId: string) => {
      set(state => {
        const updatedMessages = { ...state.messages };
        
        for (const conversationId in updatedMessages) {
          updatedMessages[conversationId] = updatedMessages[conversationId].filter(
            msg => msg.id !== messageId
          );
        }
        
        return { messages: updatedMessages };
      });

      // Emit to socket
      const chatSocket = ChatSocketManager.getInstance();
      chatSocket.deleteMessage(messageId);
    },

    addReaction: (messageId: string, emoji: string, userId: string) => {
      set(state => {
        const updatedMessages = { ...state.messages };
        
        for (const conversationId in updatedMessages) {
          updatedMessages[conversationId] = updatedMessages[conversationId].map(msg => {
            if (msg.id === messageId) {
              const reactions = { ...msg.reactions };
              if (!reactions[emoji]) {
                reactions[emoji] = [];
              }
              if (!reactions[emoji].includes(userId)) {
                reactions[emoji].push(userId);
              }
              return { ...msg, reactions };
            }
            return msg;
          });
        }
        
        return { messages: updatedMessages };
      });

      // Emit to socket
      const chatSocket = ChatSocketManager.getInstance();
      chatSocket.addReaction(messageId, emoji, userId);
    },

    removeReaction: (messageId: string, emoji: string, userId: string) => {
      set(state => {
        const updatedMessages = { ...state.messages };
        
        for (const conversationId in updatedMessages) {
          updatedMessages[conversationId] = updatedMessages[conversationId].map(msg => {
            if (msg.id === messageId && msg.reactions?.[emoji]) {
              const reactions = { ...msg.reactions };
              reactions[emoji] = reactions[emoji].filter(id => id !== userId);
              if (reactions[emoji].length === 0) {
                delete reactions[emoji];
              }
              return { ...msg, reactions };
            }
            return msg;
          });
        }
        
        return { messages: updatedMessages };
      });

      // Emit to socket
      const chatSocket = ChatSocketManager.getInstance();
      chatSocket.addReaction(messageId, emoji, userId); // Socket handles add/remove logic
    },

    // Typing indicators
    startTyping: (conversationId: string, userId: string, userName: string) => {
      set(state => {
        const conversationTyping = state.typingUsers[conversationId] || [];
        const existingIndex = conversationTyping.findIndex(t => t.userId === userId);
        
        const newTyping: TypingInfo = {
          conversationId,
          userId,
          userName,
          timestamp: Date.now()
        };
        
        let updatedTyping;
        if (existingIndex !== -1) {
          updatedTyping = [...conversationTyping];
          updatedTyping[existingIndex] = newTyping;
        } else {
          updatedTyping = [...conversationTyping, newTyping];
        }
        
        return {
          typingUsers: {
            ...state.typingUsers,
            [conversationId]: updatedTyping
          }
        };
      });
    },

    stopTyping: (conversationId: string, userId: string) => {
      set(state => ({
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: (state.typingUsers[conversationId] || []).filter(
            t => t.userId !== userId
          )
        }
      }));
    },

    // Presence
    updateUserPresence: (userId: string, isOnline: boolean) => {
      set(state => ({
        users: {
          ...state.users,
          [userId]: {
            ...state.users[userId],
            isOnline,
            lastSeen: Date.now()
          }
        }
      }));
    },

    // Search
    setSearchQuery: (query: string) => {
      set({ searchQuery: query });
    },

    searchMessages: (query: string) => {
      const { messages } = get();
      const results: Message[] = [];
      
      if (!query.trim()) return results;
      
      const searchTerm = query.toLowerCase();
      
      for (const conversationMessages of Object.values(messages)) {
        for (const message of conversationMessages) {
          if (message.text.toLowerCase().includes(searchTerm)) {
            results.push(message);
          }
        }
      }
      
      return results.sort((a, b) => b.timestamp - a.timestamp);
    },

    // Notifications
    markAsRead: (conversationId: string) => {
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      }));
    },

    getUnreadTotal: () => {
      const { conversations } = get();
      return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
    },

    // Mock data initialization
    initializeMockData: () => {
      set({
        conversations: mockConversations,
        messages: mockMessages,
        users: mockUsers,
        currentUser: mockUsers['current-user'],
      });
    },
  }))
);

// Helper hooks for easier component usage
export const useCurrentUser = () => useChatStore(state => state.currentUser);
export const useActiveConversation = () => {
  const activeId = useChatStore(state => state.activeConversationId);
  const conversations = useChatStore(state => state.conversations);
  return conversations.find(c => c.id === activeId);
};

export const useConversationMessages = (conversationId?: string) => {
  const messages = useChatStore(state => state.messages);
  const users = useChatStore(state => state.users);
  
  if (!conversationId) return [];
  
  const conversationMessages = messages[conversationId] || [];
  return conversationMessages
    .map(msg => formatMessageForGiftedChat(msg, users))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const useTypingUsers = (conversationId?: string) => {
  const typingUsers = useChatStore(state => state.typingUsers);
  const currentUser = useChatStore(state => state.currentUser);
  
  if (!conversationId) return [];
  
  return (typingUsers[conversationId] || [])
    .filter(typing => typing.userId !== currentUser?.id)
    .filter(typing => Date.now() - typing.timestamp < 10000); // Remove stale typing indicators
};

export const useUnreadTotal = () => useChatStore(state => state.getUnreadTotal());

// Socket integration setup
let isSocketSetup = false;

export const setupChatSocket = () => {
  if (isSocketSetup) return;
  
  const chatSocket = ChatSocketManager.getInstance();
  const store = useChatStore.getState();
  
  // Message events
  chatSocket.onMessage((message: Message) => {
    store.receiveMessage(message);
  });
  
  // Typing events
  chatSocket.onTypingStart((data) => {
    store.startTyping(data.conversationId, data.userId, data.userName);
  });
  
  chatSocket.onTypingStop((data) => {
    store.stopTyping(data.conversationId, data.userId);
  });
  
  // Presence events
  chatSocket.onPresenceUpdate((data) => {
    store.updateUserPresence(data.userId, data.isOnline);
  });
  
  // Connect
  chatSocket.connect();
  
  isSocketSetup = true;
};