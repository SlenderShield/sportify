import { View, Text, YStack, XStack, Button } from 'tamagui';
import { Pressable, Animated } from 'react-native';
import type { CalendarEvent } from '@/types';
import { Calendar, Clock, MapPin, Bell, BellOff, Trash2 } from 'lucide-react-native';
import React, { useState, useRef } from 'react';

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
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${getTypeLabel()} event: ${event.title}, ${formatDate(event.date)} at ${formatTime(event.time)}${event.location ? ` at ${event.location}` : ''}${event.reminder ? ' - Reminder enabled' : ''}`}
      accessibilityHint="Tap to view event details"
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
          shadowColor="$secondary"
          shadowOffset={{ width: 0, height: 12 }}
          shadowOpacity={0.08}
          shadowRadius={20}
          elevation={8}
          style={{
            opacity: pressed ? 0.95 : 1,
          }}
        >
          {/* Header with type badge and actions */}
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
            <View 
              backgroundColor={getTypeColor()} 
              borderRadius="$lg" 
              paddingHorizontal="$3" 
              paddingVertical="$2"
              shadowColor={getTypeColor()}
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.15}
              shadowRadius={4}
              elevation={2}
            >
              <Text color="$textInverse" fontSize={10} fontWeight="700" letterSpacing={0.5}>
                {getTypeLabel().toUpperCase()}
              </Text>
            </View>
            
            {/* Action buttons */}
            <XStack gap="$2">
              {onToggleReminder && (
                <Pressable
                  onPress={() => onToggleReminder(event.id)}
                  style={{
                    backgroundColor: event.reminder ? '$glassAccent' : '$surface',
                    borderRadius: 8,
                    padding: 8,
                    borderWidth: 1,
                    borderColor: event.reminder ? '$primary' : '$borderSubtle',
                  }}
                >
                  {event.reminder ? (
                    <Bell size={16} color="$primary" />
                  ) : (
                    <BellOff size={16} color="$textSecondary" />
                  )}
                </Pressable>
              )}
              {onDelete && (
                <Pressable
                  onPress={() => onDelete(event.id)}
                  style={{
                    backgroundColor: '$surface',
                    borderRadius: 8,
                    padding: 8,
                    borderWidth: 1,
                    borderColor: '$borderSubtle',
                  }}
                >
                  <Trash2 size={16} color="$error" />
                </Pressable>
              )}
            </XStack>
          </XStack>
          
          {/* Event details */}
          <YStack gap="$4">
            {/* Title */}
            <Text fontSize={18} fontWeight="700" color="$text" lineHeight={24}>
              {event.title}
            </Text>
            
            {/* Description */}
            {event.description && (
              <Text 
                fontSize={14} 
                color="$textSecondary" 
                lineHeight={20} 
                numberOfLines={2}
              >
                {event.description}
              </Text>
            )}
            
            {/* Event metadata */}
            <YStack 
              backgroundColor="$surface" 
              borderRadius="$lg" 
              padding="$4" 
              borderWidth={1}
              borderColor="$borderSubtle"
              gap="$3"
            >
              <XStack alignItems="center" gap="$3">
                <Calendar size={14} color="$textSecondary" />
                <Text fontSize={12} color="$textSecondary" fontWeight="500">
                  {formatDate(event.date)}
                </Text>
              </XStack>
              
              <XStack alignItems="center" gap="$3">
                <Clock size={14} color="$textSecondary" />
                <Text fontSize={12} color="$textSecondary" fontWeight="500">
                  {formatTime(event.time)}
                </Text>
              </XStack>
              
              {event.location && (
                <XStack alignItems="center" gap="$3">
                  <MapPin size={14} color="$textSecondary" />
                  <Text fontSize={12} color="$textSecondary" fontWeight="500" numberOfLines={1}>
                    {event.location}
                  </Text>
                </XStack>
              )}
            </YStack>
          </YStack>
        </YStack>
      </Animated.View>
    </Pressable>
  );
};

// Styles removed: now using Tamagui tokens and primitives for layout and spacing