export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  avatar?: string;
  teamId?: string;
  provider: 'email' | 'phone' | 'google';
  token: string;
  refreshToken?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'live' | 'finished';
  score?: {
    home: number;
    away: number;
  };
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  avatar?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'match' | 'chat' | 'reminder' | 'general';
  timestamp: string;
  read: boolean;
  actionData?: any;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'match' | 'training' | 'meeting' | 'other';
  reminder?: boolean;
  location?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  otpRequestId: string | null;
  resendTimer: number;
}

export interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  isTyping: boolean;
  activeUsers: string[];
}

export interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  settings: {
    matchReminders: boolean;
    chatNotifications: boolean;
    generalUpdates: boolean;
  };
}

export interface CalendarState {
  events: CalendarEvent[];
  selectedDate: string;
}

// Auth-related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export interface OTPRequest {
  phone: string;
}

export interface OTPVerification {
  phone: string;
  otp: string;
  requestId: string;
}

export interface GoogleAuthResponse {
  idToken: string;
  accessToken?: string;
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}
