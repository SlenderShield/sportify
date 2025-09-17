import { Text, ScrollView, YStack, XStack, Button, View } from 'tamagui';
import { RefreshControl, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useCalendar } from '@/hooks/useCalendar';
import { useNotifications } from '@/hooks/useNotifications';
import { useTheme } from '@/hooks/useTheme';
import { MatchCard } from '@/components/MatchCard';
import { QuickActionButton } from '@/components/QuickActionButton';
import { CalendarEventCard } from '@/components/CalendarEventCard';
import type { Match } from '@/types';
import { MessageCircle, Calendar, Map, Bell, Plus, Moon, Sun, Settings } from 'lucide-react-native';

export default function DashboardScreen() {
  const { user, isAuthenticated } = useAuth();
  const { getUpcomingEvents } = useCalendar();
  const { unreadCount } = useNotifications();
  const { isDark, toggleTheme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
    
    // Animate in on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
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
      backgroundColor="$background"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <YStack>
          {/* Modern Header */}
          <YStack
            backgroundColor="$backgroundElevated"
            paddingHorizontal="$6"
            paddingTop={60}
            paddingBottom="$8"
            borderBottomLeftRadius="$xxxl"
            borderBottomRightRadius="$xxxl"
            shadowColor="$primary"
            shadowOffset={{ width: 0, height: 12 }}
            shadowOpacity={0.1}
            shadowRadius={24}
            elevation={12}
            position="relative"
            overflow="hidden"
          >
            {/* Background gradient overlay */}
            <View
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              backgroundColor="$glassAccent"
              opacity={0.3}
            />
            
            {/* Header content */}
            <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$4">
              <YStack flex={1}>
                <Text fontSize={28} fontWeight="800" color="$text" marginBottom="$1">
                  {user?.name ? `Hello, ${user.name}!` : 'Welcome!'}
                </Text>
                <Text fontSize={16} color="$textSecondary" opacity={0.9}>
                  Ready for your next match?
                </Text>
              </YStack>
              
              {/* Theme toggle button */}
              <Button
                chromeless
                backgroundColor="$surface"
                borderRadius="$lg"
                width={44}
                height={44}
                alignItems="center"
                justifyContent="center"
                shadowColor="$primary"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.1}
                shadowRadius={8}
                elevation={4}
                onPress={toggleTheme}
              >
                {isDark ? (
                  <Sun size={20} color="$primary" />
                ) : (
                  <Moon size={20} color="$primary" />
                )}
              </Button>
            </XStack>
          </YStack>
          {/* Quick Actions */}
          <YStack paddingHorizontal="$6" marginTop="-$8">
            <View
              backgroundColor="$backgroundElevated"
              borderRadius="$xxl"
              padding="$6"
              shadowColor="$primary"
              shadowOffset={{ width: 0, height: 8 }}
              shadowOpacity={0.06}
              shadowRadius={16}
              elevation={6}
              borderWidth={1}
              borderColor="$borderSubtle"
            >
              <Text fontSize={18} fontWeight="700" color="$text" marginBottom="$5">
                Quick Actions
              </Text>
              <XStack gap="$4" flexWrap="wrap" justifyContent="space-between">
                <QuickActionButton 
                  icon={MessageCircle} 
                  title="Chat" 
                  onPress={() => router.push('/chat')} 
                  color="$secondary" 
                />
                <QuickActionButton 
                  icon={Calendar} 
                  title="Calendar" 
                  onPress={() => router.push('/calendar')} 
                  color="$primary" 
                />
                <QuickActionButton 
                  icon={Map} 
                  title="Maps" 
                  onPress={() => router.push('/maps')} 
                  color="$accent" 
                />
                <QuickActionButton 
                  icon={Bell} 
                  title="Alerts" 
                  onPress={() => router.push('/notifications')} 
                  color="$error" 
                  badge={unreadCount > 0 ? unreadCount : undefined} 
                />
              </XStack>
            </View>
          </YStack>
          {/* Upcoming Matches */}
          <YStack paddingHorizontal="$6" marginTop="$6">
            <XStack alignItems="center" justifyContent="space-between" marginBottom="$4">
              <Text fontSize={20} fontWeight="700" color="$text">
                Upcoming Matches
              </Text>
              <Button 
                chromeless 
                backgroundColor="$primary" 
                borderRadius="$lg" 
                paddingHorizontal="$4" 
                paddingVertical="$2"
                shadowColor="$primary"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.15}
                shadowRadius={6}
                elevation={3}
              >
                <Text color="$textInverse" fontWeight="600" fontSize={12}>
                  See All
                </Text>
              </Button>
            </XStack>
            
            {upcomingMatches.length > 0 ? (
              <YStack gap="$3">
                {upcomingMatches.slice(0, 3).map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </YStack>
            ) : (
              <View
                backgroundColor="$backgroundElevated"
                padding="$8"
                alignItems="center"
                borderRadius="$xxl"
                borderWidth={1}
                borderColor="$borderSubtle"
                shadowColor="$primary"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.04}
                shadowRadius={12}
                // elevation={3}
              >
                <Text color="$textSecondary" fontSize={16} textAlign="center">
                  No upcoming matches
                </Text>
                <Text color="$textTertiary" fontSize={14} textAlign="center" marginTop="$1">
                  Check back later for new matches
                </Text>
              </View>
            )}
          </YStack>
          
          {/* This Week's Events */}
          <YStack paddingHorizontal="$6" marginTop="$6">
            <XStack alignItems="center" justifyContent="space-between" marginBottom="$4">
              <Text fontSize={20} fontWeight="700" color="$text">
                This Week
              </Text>
              <Button 
                chromeless 
                backgroundColor="$secondary" 
                borderRadius="$lg" 
                width={40} 
                height={40}
                alignItems="center"
                justifyContent="center"
                shadowColor="$secondary"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.15}
                shadowRadius={6}
                elevation={3}
                onPress={() => router.push('/calendar')}
              >
                <Plus size={18} color="$textInverse" />
              </Button>
            </XStack>
            
            {upcomingEvents.length > 0 ? (
              <YStack gap="$3">
                {upcomingEvents.slice(0, 3).map(event => (
                  <CalendarEventCard key={event.id} event={event} />
                ))}
              </YStack>
            ) : (
              <View
                backgroundColor="$backgroundElevated"
                padding="$8"
                alignItems="center"
                borderRadius="$xxl"
                borderWidth={1}
                borderColor="$borderSubtle"
                shadowColor="$secondary"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.04}
                shadowRadius={12}
                elevation={3}
              >
                <Text color="$textSecondary" fontSize={16} textAlign="center">
                  No events this week
                </Text>
                <Text color="$textTertiary" fontSize={14} textAlign="center" marginTop="$1">
                  Tap + to add a new event
                </Text>
              </View>
            )}
          </YStack>
        </YStack>
      </Animated.View>
    </ScrollView> 
  );
}

// Styles removed: now using Tamagui tokens and primitives for layout and spacing