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
    <YStack backgroundColor="$background" borderRadius={12} padding={16} marginBottom={12} borderWidth={1} borderColor="$border">
      <XStack justifyContent="space-between" alignItems="center" marginBottom={12}>
        <YStack backgroundColor={getTypeColor()} borderRadius={12} paddingHorizontal={8} paddingVertical={4}>
          <Text color="$background" fontSize={10} fontWeight="600" textTransform="uppercase">{getTypeLabel()}</Text>
        </YStack>
        <XStack flexDirection="row" gap={8}>
          {onToggleReminder && (
            <Button chromeless onPress={() => onToggleReminder(event.id)}>
              {event.reminder ? (
                <Bell size={18} color="$primary" />
              ) : (
                <BellOff size={18} color="$secondary" />
              )}
            </Button>
          )}
          {onDelete && (
            <Button chromeless onPress={() => onDelete(event.id)}>
              <Trash2 size={18} color="$danger" />
            </Button>
          )}
        </XStack>
      </XStack>
      <YStack gap={8}>
        <Text fontSize={16} fontWeight="600" color="$text">{event.title}</Text>
        {event.description && (
          <Text fontSize={14} color="$secondary" lineHeight={18} numberOfLines={2}>{event.description}</Text>
        )}
        <YStack gap={6}>
          <XStack alignItems="center" gap={6}>
            <Calendar size={14} color="$secondary" />
            <Text fontSize={12} color="$secondary">{formatDate(event.date)}</Text>
          </XStack>
          <XStack alignItems="center" gap={6}>
            <Clock size={14} color="$secondary" />
            <Text fontSize={12} color="$secondary">{formatTime(event.time)}</Text>
          </XStack>
          {event.location && (
            <XStack alignItems="center" gap={6}>
              <MapPin size={14} color="$secondary" />
              <Text fontSize={12} color="$secondary">{event.location}</Text>
            </XStack>
          )}
        </YStack>
      </YStack>
    </YStack>
  );
};

// Styles removed: now using Tamagui tokens and primitives for layout and spacing