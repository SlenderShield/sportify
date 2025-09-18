import { Match, Team, Event, Feature, Stats } from "./types";

export const mockMatches: Match[] = [
  {
    id: "1",
    image: "https://source.unsplash.com/400x200/?soccer",
    title: "Sunday Soccer Showdown",
    sport: "Soccer",
    skillLevel: "Intermediate",
    location: "Central Park Field 3",
    time: "Sun, 10:00 AM",
    participants: 14,
  },
  {
    id: "2",
    image: "https://source.unsplash.com/400x200/?basketball",
    title: "Hoops Night",
    sport: "Basketball",
    skillLevel: "Advanced",
    location: "Downtown Gym",
    time: "Fri, 7:00 PM",
    participants: 10,
  },
];

export const mockTeams: Team[] = [
  { id: "1", name: "Thunderbolts", sport: "Soccer", members: 12 },
  { id: "2", name: "Downtown Dunkers", sport: "Basketball", members: 8 },
];

export const mockEvents: Event[] = [
  {
    id: "1",
    name: "Charity 5K Run",
    date: "2025-10-12",
    location: "Riverside Park",
    participants: 120,
  },
  {
    id: "2",
    name: "Community Volleyball Day",
    date: "2025-09-25",
    location: "Beach Court",
    participants: 40,
  },
];

export const mockFeatures: Feature[] = [
  {
    id: "1",
    icon: "⚡️",
    title: "Quick Match",
    description: "Find and join matches instantly.",
  },
  {
    id: "2",
    icon: "👥",
    title: "Team Builder",
    description: "Create or join a team for any sport.",
  },
  {
    id: "3",
    icon: "🏆",
    title: "Tournaments",
    description: "Compete in local and online events.",
  },
];

export const mockStats: Stats = {
  matches: 24,
  wins: 15,
  losses: 9,
  winRate: 62.5,
};
