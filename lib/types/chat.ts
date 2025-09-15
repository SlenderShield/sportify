export interface User {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  isOnline: boolean;
  lastSeen?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: number;
  reactions?: Record<string, string[]>; // emoji -> userIds
  replyTo?: string; // messageId
  edited?: boolean;
  editedAt?: number;
}

export interface Conversation {
  id: string;
  name: string;
  type: 'team' | 'dm';
  memberIds: string[];
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount: number;
  avatar?: string;
  description?: string;
  isPrivate?: boolean;
}

export interface TypingInfo {
  conversationId: string;
  userId: string;
  userName: string;
  timestamp: number;
}

export interface PresenceInfo {
  userId: string;
  isOnline: boolean;
  lastSeen: number;
}

export interface ChatState {
  // Data
  conversations: Conversation[];
  messages: Record<string, Message[]>; // conversationId -> messages
  users: Record<string, User>; // userId -> user
  currentUser: User | null;
  
  // UI State
  activeConversationId: string | null;
  isLoading: boolean;
  searchQuery: string;
  typingUsers: Record<string, TypingInfo[]>; // conversationId -> typing users
  
  // Actions
  setCurrentUser: (user: User) => void;
  setActiveConversation: (conversationId: string | null) => void;
  
  // Conversation management
  createConversation: (conversation: Omit<Conversation, 'id'>) => string;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
  deleteConversation: (conversationId: string) => void;
  
  // Message management
  sendMessage: (conversationId: string, text: string, replyTo?: string) => void;
  receiveMessage: (message: Message) => void;
  editMessage: (messageId: string, newText: string) => void;
  deleteMessage: (messageId: string) => void;
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  removeReaction: (messageId: string, emoji: string, userId: string) => void;
  
  // Typing indicators
  startTyping: (conversationId: string, userId: string, userName: string) => void;
  stopTyping: (conversationId: string, userId: string) => void;
  
  // Presence
  updateUserPresence: (userId: string, isOnline: boolean) => void;
  
  // Search
  setSearchQuery: (query: string) => void;
  searchMessages: (query: string) => Message[];
  
  // Notifications
  markAsRead: (conversationId: string) => void;
  getUnreadTotal: () => number;
  
  // Mock data initialization
  initializeMockData: () => void;
}

// GiftedChat compatible message format
export interface GiftedChatMessage {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  reactions?: Record<string, string[]>;
  replyTo?: {
    _id: string;
    text: string;
    user: {
      _id: string;
      name: string;
    };
  };
}

// Socket events
export interface SocketEvents {
  // Message events
  'message:send': (data: { conversationId: string; text: string; replyTo?: string }) => void;
  'message:receive': (message: Message) => void;
  'message:edit': (data: { messageId: string; text: string }) => void;
  'message:delete': (messageId: string) => void;
  'message:react': (data: { messageId: string; emoji: string; userId: string }) => void;
  
  // Typing events
  'typing:start': (data: { conversationId: string; userId: string; userName: string }) => void;
  'typing:stop': (data: { conversationId: string; userId: string }) => void;
  
  // Presence events
  'presence:update': (data: { userId: string; isOnline: boolean }) => void;
  'presence:request': () => void;
  'presence:response': (users: Record<string, PresenceInfo>) => void;
  
  // Conversation events
  'conversation:create': (conversation: Conversation) => void;
  'conversation:update': (data: { conversationId: string; updates: Partial<Conversation> }) => void;
  'conversation:delete': (conversationId: string) => void;
  
  // Connection events
  'connect': () => void;
  'disconnect': () => void;
  'reconnect': () => void;
}