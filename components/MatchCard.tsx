import { View, Text, YStack, XStack, Button, Theme } from 'tamagui';
import { Pressable,Animated} from 'react-native';
import type { Match } from '@/types';
import { Calendar, Clock, MapPin, Users } from 'lucide-react-native';
import React, { useState, useRef } from 'react';

interface MatchCardProps {
  match: Match;
  onPress?: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onPress }) => {
  const [pressed, setPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = () => {
    switch (match.status) {
      case 'live':
        return '#EF4444';
      case 'upcoming':
        return '#3B82F6';
      case 'finished':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = () => {
    switch (match.status) {
      case 'live':
        return 'LIVE';
      case 'upcoming':
        return 'UPCOMING';
      case 'finished':
        return 'FINISHED';
      default:
        return String(match.status).toUpperCase();
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Match: ${match.homeTeam} vs ${match.awayTeam}, ${formatDate(match.date)} at ${match.time}, ${match.venue}. Status: ${getStatusText()}`}
      accessibilityHint="Tap to view match details"
      style={{
        width: '100%',
        marginBottom: 16,
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <YStack
          backgroundColor="$backgroundElevated"
          borderRadius="$xxl"
          padding="$6"
          borderWidth={1}
          borderColor="$borderSubtle"
          shadowColor="$primary"
          shadowOffset={{ width: 0, height: 12 }}
          shadowOpacity={0.08}
          shadowRadius={20}
          elevation={8}
          style={{
            opacity: pressed ? 0.95 : 1,
          }}
        >
          {/* Header with status and date */}
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
            <View 
              backgroundColor={getStatusColor()} 
              borderRadius="$lg" 
              paddingHorizontal="$3" 
              paddingVertical="$2"
              shadowColor={getStatusColor()}
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.15}
              shadowRadius={4}
              elevation={2}
            >
              <Text color="$textInverse" fontSize={10} fontWeight="700" letterSpacing={0.5}>
                {getStatusText()}
              </Text>
            </View>
            <XStack alignItems="center" backgroundColor="$surface" borderRadius="$lg" paddingHorizontal="$3" paddingVertical="$2">
              <Calendar size={14} color="$textSecondary" />
              <Text fontSize={12} color="$textSecondary" marginLeft="$2" fontWeight="500">
                {formatDate(match.date)}
              </Text>
            </XStack>
          </XStack>
          
          {/* Teams section */}
          <YStack alignItems="center">
            <XStack justifyContent="space-between" alignItems="center" width="100%" marginBottom="$5">
              {/* Home team */}
              <YStack alignItems="center" flex={1}>
                <Text fontSize={16} fontWeight="700" color="$text" textAlign="center" marginBottom="$1">
                  {match.homeTeam}
                </Text>
                <Text fontSize={10} color="$textTertiary" fontWeight="600" letterSpacing={0.5}>
                  HOME
                </Text>
              </YStack>
              
              {/* Score or VS */}
              <YStack marginHorizontal="$5" alignItems="center">
                {match.score ? (
                  <View 
                    backgroundColor="$surface" 
                    paddingHorizontal="$4" 
                    paddingVertical="$3" 
                    borderRadius="$lg"
                    borderWidth={1}
                    borderColor="$borderSubtle"
                    shadowColor="$primary"
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.05}
                    shadowRadius={6}
                    elevation={2}
                  >
                    <Text fontSize={18} fontWeight="800" color="$text">
                      {match.score.home} - {match.score.away}
                    </Text>
                  </View>
                ) : (
                  <View 
                    backgroundColor="$glassAccent" 
                    paddingHorizontal="$4" 
                    paddingVertical="$2" 
                    borderRadius="$lg"
                    borderWidth={1}
                    borderColor="$primary"
                  >
                    <Text fontSize={14} fontWeight="700" color="$primary">VS</Text>
                  </View>
                )}
              </YStack>
              
              {/* Away team */}
              <YStack alignItems="center" flex={1}>
                <Text fontSize={16} fontWeight="700" color="$text" textAlign="center" marginBottom="$1">
                  {match.awayTeam}
                </Text>
                <Text fontSize={10} color="$textTertiary" fontWeight="600" letterSpacing={0.5}>
                  AWAY
                </Text>
              </YStack>
            </XStack>
            
            {/* Match details */}
            <XStack 
              justifyContent="center" 
              gap="$6" 
              backgroundColor="$surface" 
              borderRadius="$lg" 
              paddingHorizontal="$4" 
              paddingVertical="$3"
              borderWidth={1}
              borderColor="$borderSubtle"
            >
              <XStack alignItems="center">
                <Clock size={14} color="$textSecondary" />
                <Text fontSize={12} color="$textSecondary" marginLeft="$2" fontWeight="500">
                  {match.time}
                </Text>
              </XStack>
              <View width={1} height={16} backgroundColor="$borderAccent" />
              <XStack alignItems="center">
                <MapPin size={14} color="$textSecondary" />
                <Text fontSize={12} color="$textSecondary" marginLeft="$2" fontWeight="500">
                  {match.venue}
                </Text>
              </XStack>
            </XStack>
          </YStack>
        </YStack>
      </Animated.View>
    </Pressable>
  );
};
