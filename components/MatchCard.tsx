import { View, Text, YStack, XStack, Button, Theme } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import type { Match } from '@/types';
import { Calendar, Clock, MapPin, Users } from 'lucide-react-native';

interface MatchCardProps {
  match: Match;
  onPress?: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onPress }) => {
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
    <Button chromeless onPress={onPress} width="100%" padding={0}>
      <YStack backgroundColor="$background" borderRadius="$lg" padding="$md" marginBottom="$md" borderWidth={1} borderColor="$border">
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
          <YStack backgroundColor={getStatusColor()} borderRadius={12} paddingHorizontal={8} paddingVertical={4}>
            <Text color="$background" fontSize={10} fontWeight="600">{getStatusText()}</Text>
          </YStack>
          <XStack alignItems="center">
            <Calendar size={14} color="$secondary" />
            <Text fontSize={12} color="$secondary" marginLeft={4}>{formatDate(match.date)}</Text>
          </XStack>
        </XStack>
        <YStack alignItems="center">
          <XStack justifyContent="space-between" alignItems="center" width="100%" marginBottom="$md">
            <YStack alignItems="center" flex={1}>
              <Text fontSize={16} fontWeight="600" color="$text" textAlign="center" marginBottom={4}>{match.homeTeam}</Text>
              <Text fontSize={10} color="$secondary" fontWeight="500">HOME</Text>
            </YStack>
            <YStack marginInline={16} alignItems="center">
              {match.score ? (
                <YStack background="$background" paddingHorizontal={12} paddingVertical={6} borderRadius={8}>
                  <Text fontSize={18} fontWeight="bold" color="$text">{match.score.home} - {match.score.away}</Text>
                </YStack>
              ) : (
                <Text fontSize={14} fontWeight="600" color="$secondary">VS</Text>
              )}
            </YStack>
            <YStack alignItems="center" flex={1}>
              <Text fontSize={16} fontWeight="600" color="$text" textAlign="center" marginBottom={4}>{match.awayTeam}</Text>
              <Text fontSize={10} color="$secondary" fontWeight="500">AWAY</Text>
            </YStack>
          </XStack>
          <XStack justifyContent="center" gap={20}>
            <XStack alignItems="center">
              <Clock size={16} color="$secondary" />
              <Text fontSize={12} color="$secondary" marginLeft={4}>{match.time}</Text>
            </XStack>
            <XStack alignItems="center">
              <MapPin size={16} color="$secondary" />
              <Text fontSize={12} color="$secondary" marginLeft={4}>{match.venue}</Text>
            </XStack>
          </XStack>
        </YStack>
      </YStack>
    </Button>
  );
};
