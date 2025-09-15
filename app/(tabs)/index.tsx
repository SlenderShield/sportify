import { View, Text, ScrollView, YStack, XStack, Button, Theme, useMedia } from 'tamagui';
import { RefreshControl } from 'react-native';
import { TouchableOpacity } from 'react-native';
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

  const media = useMedia();
  return (
    <Theme name={media.md ? 'light' : 'dark'}>
      <ScrollView
        backgroundColor="$background"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <YStack space="$md">
          <YStack backgroundColor="$primary" padding="$lg" paddingTop={60}>
            <Text fontSize={28} fontWeight="bold" color="$background">Hello, {user?.name}!</Text>
            <Text fontSize={16} color="$secondary">Ready for your next match?</Text>
          </YStack>
          {/* Quick Actions */}
          <YStack padding="$lg">
            <Text fontSize={20} fontWeight="600" color="$text">Quick Actions</Text>
            <XStack space="$md" flexWrap="wrap" justifyContent="space-between">
              <QuickActionButton icon={MessageCircle} title="Chat" onPress={() => router.push('/chat')} color="#10B981" />
              <QuickActionButton icon={Calendar} title="Calendar" onPress={() => router.push('/calendar')} color="#3B82F6" />
              <QuickActionButton icon={Map} title="Maps" onPress={() => router.push('/maps')} color="#F59E0B" />
              <QuickActionButton icon={Bell} title="Notifications" onPress={() => router.push('/notifications')} color="#EF4444" badge={unreadCount > 0 ? unreadCount : undefined} />
            </XStack>
          </YStack>
          {/* Upcoming Matches */}
          <YStack padding="$lg">
            <XStack alignItems="center" justifyContent="space-between" marginBottom="$md">
              <Text fontSize={20} fontWeight="600" color="$text">Upcoming Matches</Text>
              <Button chromeless>
                <Text color="$primary">See All</Text>
              </Button>
            </XStack>
            {upcomingMatches.length > 0 ? (
              upcomingMatches.slice(0, 3).map(match => (
                <MatchCard key={match.id} match={match} />
              ))
            ) : (
              <YStack padding="$lg" alignItems="center" borderRadius="$lg" borderWidth={1} borderColor="$border" backgroundColor="$background">
                <Text color="$secondary" fontSize={16}>No upcoming matches</Text>
              </YStack>
            )}
          </YStack>
          {/* This Week's Events */}
          <YStack padding="$lg">
            <XStack alignItems="center" justifyContent="space-between" marginBottom="$md">
              <Text fontSize={20} fontWeight="600" color="$text">This Week</Text>
              <Button chromeless onPress={() => router.push('/calendar')}>
                <Plus size={20} color="#3B82F6" />
              </Button>
            </XStack>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.slice(0, 3).map(event => (
                <CalendarEventCard key={event.id} event={event} />
              ))
            ) : (
              <YStack padding="$lg" alignItems="center" borderRadius="$lg" borderWidth={1} borderColor="$border" backgroundColor="$background">
                <Text color="$secondary" fontSize={16}>No events this week</Text>
              </YStack>
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </Theme>
  );
}

// Styles removed: now using Tamagui tokens and primitives for layout and spacing