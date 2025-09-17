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
      <YStack
        backgroundColor="$background"
        borderRadius={24}
        padding={20}
        marginBottom={20}
        borderWidth={1}
        borderColor="$border"
        shadowColor="#3B82F6"
        shadowOffset={{ width: 0, height: 8 }}
        shadowOpacity={0.10}
        shadowRadius={16}
        elevation={6}
      >
        <XStack justifyContent="space-between" alignItems="center" marginBottom={16}>
          <YStack backgroundColor={getStatusColor()} borderRadius={16} paddingHorizontal={12} paddingVertical={6}>
            <Text color="$background" fontSize={12} fontWeight="700">{getStatusText()}</Text>
          </YStack>
          <XStack alignItems="center">
            <Calendar size={16} color="$secondary" />
            <Text fontSize={14} color="$secondary" marginLeft={6}>{formatDate(match.date)}</Text>
          </XStack>
        </XStack>
        <YStack alignItems="center">
          <XStack justifyContent="space-between" alignItems="center" width="100%" marginBottom={16}>
            <YStack alignItems="center" flex={1}>
              <Text fontSize={18} fontWeight="700" color="$text" textAlign="center" marginBottom={4}>{match.homeTeam}</Text>
              <Text fontSize={11} color="$secondary" fontWeight="500">HOME</Text>
            </YStack>
            <YStack marginHorizontal={20} alignItems="center">
              {match.score ? (
                <YStack background="$background" paddingHorizontal={16} paddingVertical={8} borderRadius={12} shadowColor="#3B82F6" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.08} shadowRadius={6}>
                  <Text fontSize={20} fontWeight="bold" color="$text">{match.score.home} - {match.score.away}</Text>
                </YStack>
              ) : (
                <Text fontSize={16} fontWeight="700" color="$secondary">VS</Text>
              )}
            </YStack>
            <YStack alignItems="center" flex={1}>
              <Text fontSize={18} fontWeight="700" color="$text" textAlign="center" marginBottom={4}>{match.awayTeam}</Text>
              <Text fontSize={11} color="$secondary" fontWeight="500">AWAY</Text>
            </YStack>
          </XStack>
          <XStack justifyContent="center" gap={32}>
            <XStack alignItems="center">
              <Clock size={16} color="$secondary" />
              <Text fontSize={13} color="$secondary" marginLeft={6}>{match.time}</Text>
            </XStack>
            <XStack alignItems="center">
              <MapPin size={16} color="$secondary" />
              <Text fontSize={13} color="$secondary" marginLeft={6}>{match.venue}</Text>
            </XStack>
          </XStack>
        </YStack>
      </YStack>
    </Button>
  );
};
