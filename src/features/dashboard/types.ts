// src/features/dashboard/types.ts

export interface Match {
  id: string;
  image: string;
  title: string;
  sport: string;
  skillLevel: string;
  location: string;
  time: string;
  participants: number;
}

export interface Team {
  id: string;
  name: string;
  sport: string;
  members: number;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  participants: number;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Stats {
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
}
