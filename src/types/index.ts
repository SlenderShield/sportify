export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  sport: string;
  league: string;
  country: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  startTime: string;
  status: 'upcoming' | 'live' | 'finished';
  score?: {
    home: number;
    away: number;
  };
  league: string;
  venue?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SocketEvents {
  'match:update': (match: Match) => void;
  'score:update': (data: {
    matchId: string;
    score: { home: number; away: number };
  }) => void;
  notification: (notification: Notification) => void;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}
