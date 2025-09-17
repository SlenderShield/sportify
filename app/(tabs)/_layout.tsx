import { Tabs } from 'expo-router';
import { Chrome as Home, MessageCircle, Bell, Map, Calendar, Settings } from 'lucide-react-native';
import { useNotifications } from '@/hooks/useNotifications';
import { useTheme } from '@/hooks/useTheme';
import { Platform } from 'react-native';

export default function TabLayout() {
  const { unreadCount } = useNotifications();
  const { isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#60A5FA' : '#2563EB',
        tabBarInactiveTintColor: isDark ? '#94A3B8' : '#64748B',
        tabBarStyle: {
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: Platform.select({ ios: 32, android: 24 }),
          height: 68,
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: 0,
          borderRadius: 20,
          shadowColor: isDark ? '#000' : '#2563EB',
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 8 },
          elevation: 16,
          // Glassmorphic effect
          backdropFilter: 'blur(20px)',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          paddingHorizontal: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ size, color }) => (
            <Bell size={size} color={color} />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          title: 'Maps',
          tabBarIcon: ({ size, color }) => (
            <Map size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}