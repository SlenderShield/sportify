import { create } from 'zustand';
import type { NotificationState, NotificationItem } from '@/types';

interface NotificationStore extends NotificationState {
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  updateSettings: (settings: Partial<NotificationState['settings']>) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [
    // Mock notifications for development
    {
      id: '1',
      title: 'Match Reminder',
      message: 'Your team plays against Eagles FC in 2 hours',
      type: 'match',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false,
      actionData: { matchId: 'match-1' }
    },
    {
      id: '2',
      title: 'New Message',
      message: 'Mike Johnson sent a message in team chat',
      type: 'chat',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      actionData: { chatId: 'team-chat' }
    },
    {
      id: '3',
      title: 'Training Session',
      message: 'Don\'t forget about training tomorrow at 6 PM',
      type: 'reminder',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true
    }
  ],
  unreadCount: 2,
  settings: {
    matchReminders: true,
    chatNotifications: true,
    generalUpdates: true
  },

  addNotification: (notificationData) => {
    const notification: NotificationItem = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };

    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));

    // TODO: Show local notification
    // scheduleLocalNotification(notification);
  },

  markAsRead: (notificationId: string) => {
    set(state => ({
      notifications: state.notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }));
  },

  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0
    }));
  },

  removeNotification: (notificationId: string) => {
    set(state => {
      const notification = state.notifications.find(n => n.id === notificationId);
      const wasUnread = notification && !notification.read;
      
      return {
        notifications: state.notifications.filter(n => n.id !== notificationId),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
      };
    });
  },

  updateSettings: (newSettings) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }));

    // TODO: Update notification preferences on server
    // api.updateNotificationSettings(get().settings);
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  }
}));