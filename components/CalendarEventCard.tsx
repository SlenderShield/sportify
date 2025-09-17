import { View, Text, YStack, XStack, Button } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import type { CalendarEvent } from '@/types';
import { Calendar, Clock, MapPin, Bell, BellOff, Trash2 } from 'lucide-react-native';

interface CalendarEventCardProps {
  event: CalendarEvent;
  onToggleReminder?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
}

export const CalendarEventCard: React.FC<CalendarEventCardProps> = ({
  event,
  onToggleReminder,
  onDelete
}) => {
  const getTypeColor = () => {
    switch (event.type) {
      case 'match':
        return '#EF4444';
      case 'training':
        return '#10B981';
      case 'meeting':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const getTypeLabel = () => {
    return event.type.charAt(0).toUpperCase() + event.type.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <YStack
      backgroundColor="$background"
      borderRadius={24}
      padding={20}
      marginBottom={20}
      borderWidth={1}
      borderColor="$border"
      shadowColor="#10B981"
      shadowOffset={{ width: 0, height: 8 }}
      shadowOpacity={0.10}
      shadowRadius={16}
    >
      <XStack justifyContent="space-between" alignItems="center" marginBottom={16}>
        <YStack backgroundColor={getTypeColor()} borderRadius={16} paddingHorizontal={12} paddingVertical={6}>
          <Text color="$background" fontSize={12} fontWeight="700" textTransform="uppercase">{getTypeLabel()}</Text>
        </YStack>
        <XStack flexDirection="row" gap={10}>
          {onToggleReminder && (
            <Button chromeless onPress={() => onToggleReminder(event.id)}>
              {event.reminder ? (
                <Bell size={20} color="$primary" />
              ) : (
                <BellOff size={20} color="$secondary" />
              )}
            </Button>
          )}
          {onDelete && (
            <Button chromeless onPress={() => onDelete(event.id)}>
              <Trash2 size={20} color="$danger" />
            </Button>
          )}
        </XStack>
      </XStack>
      <YStack gap={10}>
        <Text fontSize={18} fontWeight="700" color="$text">{event.title}</Text>
        {event.description && (
          <Text fontSize={15} color="$secondary" lineHeight={20} numberOfLines={2}>{event.description}</Text>
        )}
        <YStack gap={8}>
          <XStack alignItems="center" gap={8}>
            <Calendar size={16} color="$secondary" />
            <Text fontSize={13} color="$secondary">{formatDate(event.date)}</Text>
          </XStack>
          <XStack alignItems="center" gap={8}>
            <Clock size={16} color="$secondary" />
            <Text fontSize={13} color="$secondary">{formatTime(event.time)}</Text>
          </XStack>
          {event.location && (
            <XStack alignItems="center" gap={8}>
              <MapPin size={16} color="$secondary" />
              <Text fontSize={13} color="$secondary">{event.location}</Text>
            </XStack>
          )}
        </YStack>
      </YStack>
    </YStack>
  );
};

// Styles removed: now using Tamagui tokens and primitives for layout and spacing