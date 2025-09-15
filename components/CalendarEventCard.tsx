import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor() }]}>
          <Text style={styles.typeText}>{getTypeLabel()}</Text>
        </View>
        <View style={styles.actions}>
          {onToggleReminder && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onToggleReminder(event.id)}
            >
              {event.reminder ? (
                <Bell size={18} color="#3B82F6" />
              ) : (
                <BellOff size={18} color="#6B7280" />
              )}
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete(event.id)}
            >
              <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        {event.description && (
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        )}

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Calendar size={14} color="#6B7280" />
            <Text style={styles.detailText}>{formatDate(event.date)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.detailText}>{formatTime(event.time)}</Text>
          </View>
          {event.location && (
            <View style={styles.detailItem}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.detailText}>{event.location}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  content: {
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  details: {
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
  },
});