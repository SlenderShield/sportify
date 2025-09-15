import { create } from 'zustand';
import type { CalendarState, CalendarEvent } from '@/types';

interface CalendarStore extends CalendarState {
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (eventId: string, eventData: Partial<CalendarEvent>) => void;
  removeEvent: (eventId: string) => void;
  setSelectedDate: (date: string) => void;
  getEventsForDate: (date: string) => CalendarEvent[];
  toggleReminder: (eventId: string) => void;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  events: [
    // Mock events for development
    {
      id: '1',
      title: 'Match vs Eagles FC',
      description: 'Championship match at home stadium',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      time: '15:00',
      type: 'match',
      reminder: true,
      location: 'City Stadium'
    },
    {
      id: '2',
      title: 'Team Training',
      description: 'Regular training session with the team',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '18:00',
      type: 'training',
      reminder: true,
      location: 'Training Ground'
    },
    {
      id: '3',
      title: 'Strategy Meeting',
      description: 'Discussing tactics for upcoming matches',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      type: 'meeting',
      reminder: false,
      location: 'Club Office'
    }
  ],
  selectedDate: new Date().toISOString().split('T')[0],

  addEvent: (eventData) => {
    const event: CalendarEvent = {
      ...eventData,
      id: Date.now().toString()
    };

    set(state => ({
      events: [...state.events, event]
    }));

    // TODO: Sync with server
    // api.createEvent(event);

    // TODO: Schedule local reminder if enabled
    if (event.reminder) {
      // scheduleEventReminder(event);
    }
  },

  updateEvent: (eventId, eventData) => {
    set(state => ({
      events: state.events.map(e => 
        e.id === eventId ? { ...e, ...eventData } : e
      )
    }));

    // TODO: Sync with server
    // api.updateEvent(eventId, eventData);
  },

  removeEvent: (eventId) => {
    set(state => ({
      events: state.events.filter(e => e.id !== eventId)
    }));

    // TODO: Remove from server
    // api.deleteEvent(eventId);

    // TODO: Cancel reminder if scheduled
    // cancelEventReminder(eventId);
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },

  getEventsForDate: (date) => {
    return get().events.filter(event => event.date === date);
  },

  toggleReminder: (eventId) => {
    const event = get().events.find(e => e.id === eventId);
    if (event) {
      get().updateEvent(eventId, { reminder: !event.reminder });
      
      // TODO: Schedule or cancel reminder
      if (!event.reminder) {
        // scheduleEventReminder(event);
      } else {
        // cancelEventReminder(eventId);
      }
    }
  }
}));