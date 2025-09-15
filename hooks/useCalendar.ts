import { useCalendarStore } from '@/store/calendarStore';

export const useCalendar = () => {
  const {
    events,
    selectedDate,
    addEvent,
    updateEvent,
    removeEvent,
    setSelectedDate,
    getEventsForDate,
    toggleReminder
  } = useCalendarStore();

  const getUpcomingEvents = (daysAhead: number = 7) => {
    const today = new Date();
    const futureDate = new Date(today.getTime() + (daysAhead * 24 * 60 * 60 * 1000));
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= futureDate;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getTodayEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return getEventsForDate(today);
  };

  return {
    events,
    selectedDate,
    addEvent,
    updateEvent,
    removeEvent,
    setSelectedDate,
    getEventsForDate,
    toggleReminder,
    getUpcomingEvents,
    getTodayEvents
  };
};