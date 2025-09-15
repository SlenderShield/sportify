import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useCalendar } from '@/hooks/useCalendar';
import { useNotifications } from '@/hooks/useNotifications';
import { MatchCard } from '@/components/MatchCard';
import { QuickActionButton } from '@/components/QuickActionButton';
import { CalendarEventCard } from '@/components/CalendarEventCard';
import type { Match } from '@/types';
import { MessageCircle, Calendar, Map, Bell, Plus } from 'lucide-react-native';

export default function DashboardScreen() {
  const { user, isAuthenticated } = useAuth();
  const { getUpcomingEvents } = useCalendar();
  const { unreadCount } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);

  // Mock upcoming matches data
  const mockMatches: Match[] = [
    {
      id: '1',
      homeTeam: 'Lions FC',
      awayTeam: 'Eagles FC',
      date: new Date(Date.now() + 86400000 * 2).toISOString(),
      time: '15:00',
      venue: 'City Stadium',
      status: 'upcoming'
    },
    {
      id: '2',
      homeTeam: 'Tigers FC',
      awayTeam: 'Lions FC',
      date: new Date(Date.now() + 86400000 * 5).toISOString(),
      time: '18:30',
      venue: 'Sports Complex',
      status: 'upcoming'
    }
  ];

  useEffect(() => {
    // TODO: Fetch real data from API
    setUpcomingMatches(mockMatches);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Refresh data from API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const upcomingEvents = getUpcomingEvents(7);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name}!</Text>
        <Text style={styles.subtitle}>Ready for your next match?</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <QuickActionButton
            icon={MessageCircle}
            title="Chat"
            onPress={() => router.push('/chat')}
            color="#10B981"
          />
          <QuickActionButton
            icon={Calendar}
            title="Calendar"
            onPress={() => router.push('/calendar')}
            color="#3B82F6"
          />
          <QuickActionButton
            icon={Map}
            title="Maps"
            onPress={() => router.push('/maps')}
            color="#F59E0B"
          />
          <QuickActionButton
            icon={Bell}
            title="Notifications"
            onPress={() => router.push('/notifications')}
            color="#EF4444"
            badge={unreadCount > 0 ? unreadCount : undefined}
          />
        </View>
      </View>

      {/* Upcoming Matches */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Matches</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {upcomingMatches.length > 0 ? (
          upcomingMatches.slice(0, 3).map(match => (
            <MatchCard key={match.id} match={match} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No upcoming matches</Text>
          </View>
        )}
      </View>

      {/* Today's Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/calendar')}
          >
            <Plus size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.slice(0, 3).map(event => (
            <CalendarEventCard key={event.id} event={event} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No events this week</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#3B82F6',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E7FF',
  },
  section: {
    padding: 20,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  seeAllText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  addButton: {
    padding: 6,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
  },
});