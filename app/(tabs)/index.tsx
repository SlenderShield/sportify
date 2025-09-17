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
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <YStack space="$lg">
          {/* Header with gradient */}
          <YStack
            paddingHorizontal="$lg"
            paddingTop={60}
            paddingBottom={32}
            borderBottomLeftRadius={32}
            borderBottomRightRadius={32}
            backgroundImage="linear-gradient(90deg, #3B82F6 0%, #10B981 100%)"
            shadowColor="#3B82F6"
            shadowOffset={{ width: 0, height: 8 }}
            shadowOpacity={0.15}
            shadowRadius={16}
            elevation={8}
          >
            <Text fontSize={32} fontWeight="800" color="$background" marginBottom={4}>
              {user?.name ? `Hello, ${user.name}!` : 'Welcome!'}
            </Text>
            <Text fontSize={18} color="$background" opacity={0.85}>
              Ready for your next match?
            </Text>
          </YStack>
          {/* Quick Actions */}
          <YStack paddingHorizontal="$lg" marginTop={-32}>
            <Text fontSize={18} fontWeight="700" color="$text" marginBottom={8}>Quick Actions</Text>
            <XStack gap={16} flexWrap="wrap" justifyContent="space-between">
              <QuickActionButton icon={MessageCircle} title="Chat" onPress={() => router.push('/chat')} color="#10B981" />
              <QuickActionButton icon={Calendar} title="Calendar" onPress={() => router.push('/calendar')} color="#3B82F6" />
              <QuickActionButton icon={Map} title="Maps" onPress={() => router.push('/maps')} color="#F59E0B" />
              <QuickActionButton icon={Bell} title="Notifications" onPress={() => router.push('/notifications')} color="#EF4444" badge={unreadCount > 0 ? unreadCount : undefined} />
            </XStack>
          </YStack>
          {/* Upcoming Matches */}
          <YStack paddingHorizontal="$lg" marginTop={8}>
            <XStack alignItems="center" justifyContent="space-between" marginBottom={12}>
              <Text fontSize={20} fontWeight="700" color="$text">Upcoming Matches</Text>
              <Button chromeless borderRadius={20} backgroundColor="$primary" paddingHorizontal={16} paddingVertical={6}>
                <Text color="$background" fontWeight="600">See All</Text>
              </Button>
            </XStack>
            {upcomingMatches.length > 0 ? (
              upcomingMatches.slice(0, 3).map(match => (
                <MatchCard key={match.id} match={match} />
              ))
            ) : (
              <YStack padding="$lg" alignItems="center" borderRadius={20} borderWidth={1} borderColor="$border" backgroundColor="$background" shadowColor="#3B82F6" shadowOffset={{ width: 0, height: 4 }} shadowOpacity={0.08} shadowRadius={8}>
                <Text color="$secondary" fontSize={16}>No upcoming matches</Text>
              </YStack>
            )}
          </YStack>
          {/* This Week's Events */}
          <YStack paddingHorizontal="$lg" marginTop={8}>
            <XStack alignItems="center" justifyContent="space-between" marginBottom={12}>
              <Text fontSize={20} fontWeight="700" color="$text">This Week</Text>
              <Button chromeless borderRadius={20} backgroundColor="$primary" paddingHorizontal={12} paddingVertical={6} onPress={() => router.push('/calendar')}>
                <Plus size={20} color="#fff" />
              </Button>
            </XStack>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.slice(0, 3).map(event => (
                <CalendarEventCard key={event.id} event={event} />
              ))
            ) : (
              <YStack padding="$lg" alignItems="center" borderRadius={20} borderWidth={1} borderColor="$border" backgroundColor="$background" shadowColor="#10B981" shadowOffset={{ width: 0, height: 4 }} shadowOpacity={0.08} shadowRadius={8}>
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