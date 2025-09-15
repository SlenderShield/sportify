import {
  YStack,
  XStack,
  Text,
  Button,
  Input,
  ScrollView,
} from 'tamagui';
import { Dialog } from '@tamagui/dialog';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useCalendar } from '@/hooks/useCalendar';
import { CalendarEventCard } from '@/components/CalendarEventCard';
import { Plus } from 'lucide-react-native';
import type { CalendarEvent } from '@/types';

const defaultEvent = (): Partial<CalendarEvent> => ({
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  time: '12:00',
  type: 'other',
  reminder: true,
  location: '',
});

export default function CalendarScreen() {
  const { addEvent, removeEvent, getTodayEvents, getUpcomingEvents, toggleReminder } =
    useCalendar();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>(defaultEvent());

  const todayEvents = getTodayEvents();
  const upcomingEvents = getUpcomingEvents(14);

  const handleAddEvent = () => {
    if (!newEvent.title?.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }

    addEvent({
      title: newEvent.title,
      description: newEvent.description || '',
      date: newEvent.date || new Date().toISOString().split('T')[0],
      time: newEvent.time || '12:00',
      type: newEvent.type || 'other',
      reminder: newEvent.reminder ?? false,
      location: newEvent.location || '',
    });

    setNewEvent(defaultEvent());
    setShowAddModal(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeEvent(eventId) },
    ]);
  };

  const renderSection = (title: string, items: CalendarEvent[], emptyText: string) => (
    <YStack
      padding={20}
      backgroundColor="$background"
      marginBottom={8}
      borderRadius={12}
    >
      <Text fontSize={18} fontWeight="600" color="$gray12" marginBottom={16}>
        {title}
      </Text>
      {items.length > 0 ? (
        items.map(event => (
          <CalendarEventCard
            key={event.id}
            event={event}
            onToggleReminder={toggleReminder}
            onDelete={handleDeleteEvent}
          />
        ))
      ) : (
        <YStack
          padding={20}
          alignItems="center"
          backgroundColor="$background"
          borderRadius={12}
          borderWidth={1}
          borderColor="$gray5"
        >
          <Text color="$gray8" fontSize={16}>
            {emptyText}
          </Text>
        </YStack>
      )}
    </YStack>
  );

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header */}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={20}
        paddingVertical={16}
        borderBottomWidth={1}
        borderBottomColor="$gray5"
      >
        <Text fontSize={24} fontWeight="600" color="$gray12">
          Calendar
        </Text>
        <Button
          size="$4"
          backgroundColor="$blue10"
          borderRadius={20}
          padding={10}
          icon={<Plus size={20} color="#FFFFFF" />}
          onPress={() => setShowAddModal(true)}
          aria-label="Add Event"
        />
      </XStack>

      {/* Body */}
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {renderSection('Today', todayEvents, 'No events today')}
        {renderSection('Upcoming', upcomingEvents, 'No upcoming events')}
      </ScrollView>

      {/* Tamagui Dialog for Add Event */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            backgroundColor="rgba(0,0,0,0.5)"
            opacity={0.5}
            animation="fast"
          />
          <Dialog.Content
            key="content"
            bordered
            elevate
            width="90%"
            maxWidth={500}
            backgroundColor="$background"
            borderRadius="$4"
            padding={20}
          >
            <Dialog.Title>
              <Text fontSize={20} fontWeight="600" color="$gray12">
                Add Event
              </Text>
            </Dialog.Title>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 20 }}
            >
              {/* Title */}
              <YStack marginBottom={20}>
                <Text fontSize={16} fontWeight="500" color="$gray12" marginBottom={8}>
                  Title *
                </Text>
                <Input
                  value={newEvent.title}
                  onChangeText={text => setNewEvent({ ...newEvent, title: text })}
                  placeholder="Enter event title"
                  borderWidth={1}
                  borderColor="$gray5"
                  borderRadius={8}
                  paddingHorizontal={12}
                  paddingVertical={12}
                  fontSize={16}
                  backgroundColor="$background"
                  autoFocus
                />
              </YStack>

              {/* Description */}
              <YStack marginBottom={20}>
                <Text fontSize={16} fontWeight="500" color="$gray12" marginBottom={8}>
                  Description
                </Text>
                <Input
                  value={newEvent.description}
                  onChangeText={text => setNewEvent({ ...newEvent, description: text })}
                  placeholder="Enter event description"
                  multiline
                  numberOfLines={3}
                  borderWidth={1}
                  borderColor="$gray5"
                  borderRadius={8}
                  paddingHorizontal={12}
                  paddingVertical={12}
                  fontSize={16}
                  backgroundColor="$background"
                  height={80}
                />
              </YStack>

              {/* Location */}
              <YStack marginBottom={20}>
                <Text fontSize={16} fontWeight="500" color="$gray12" marginBottom={8}>
                  Location
                </Text>
                <Input
                  value={newEvent.location}
                  onChangeText={text => setNewEvent({ ...newEvent, location: text })}
                  placeholder="Enter location"
                  borderWidth={1}
                  borderColor="$gray5"
                  borderRadius={8}
                  paddingHorizontal={12}
                  paddingVertical={12}
                  fontSize={16}
                  backgroundColor="$background"
                />
              </YStack>

              {/* Date & Time */}
              <XStack gap={12}>
                <YStack flex={1}>
                  <Text fontSize={16} fontWeight="500" color="$gray12" marginBottom={8}>
                    Date
                  </Text>
                  <Input
                    value={newEvent.date}
                    onChangeText={text => setNewEvent({ ...newEvent, date: text })}
                    placeholder="YYYY-MM-DD"
                    borderWidth={1}
                    borderColor="$gray5"
                    borderRadius={8}
                    paddingHorizontal={12}
                    paddingVertical={12}
                    fontSize={16}
                    backgroundColor="$background"
                  />
                </YStack>
                <YStack flex={1}>
                  <Text fontSize={16} fontWeight="500" color="$gray12" marginBottom={8}>
                    Time
                  </Text>
                  <Input
                    value={newEvent.time}
                    onChangeText={text => setNewEvent({ ...newEvent, time: text })}
                    placeholder="HH:MM"
                    borderWidth={1}
                    borderColor="$gray5"
                    borderRadius={8}
                    paddingHorizontal={12}
                    paddingVertical={12}
                    fontSize={16}
                    backgroundColor="$background"
                  />
                </YStack>
              </XStack>

              {/* Type Selector */}
              {/* Type Selector */}
              <YStack marginVertical={20}>
                <Text fontSize={16} fontWeight="500" color="$gray12" marginBottom={8}>
                  Type
                </Text>
                <XStack gap={8} flexWrap="wrap">
                  {['match', 'training', 'meeting', 'other'].map(type => (
                    <Button
                      key={type}
                      backgroundColor={newEvent.type === type ? '$blue10' : '$background'}
                      borderColor={newEvent.type === type ? '$blue10' : '$gray5'}
                      borderWidth={1}
                      borderRadius={20}
                      paddingHorizontal={16}
                      paddingVertical={8}
                      onPress={() =>
                        setNewEvent({ ...newEvent, type: type as CalendarEvent['type'] })
                      }
                    >
                      <Text
                        fontSize={14}
                        color={newEvent.type === type ? '$white' : '$gray8'}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </Button>
                  ))}
                </XStack>
              </YStack>


              {/* Reminder Toggle */}
              <XStack alignItems="center" paddingVertical={12}>
                <YStack
                  width={20}
                  height={20}
                  borderWidth={2}
                  borderColor={newEvent.reminder ? '$blue10' : '$gray5'}
                  borderRadius={4}
                  marginRight={12}
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor={newEvent.reminder ? '$blue10' : '$background'}
                  onPress={() =>
                    setNewEvent({ ...newEvent, reminder: !newEvent.reminder })
                  }
                >
                  {newEvent.reminder && (
                    <Text color="$white" fontSize={12} fontWeight="bold">
                      ✓
                    </Text>
                  )}
                </YStack>
                <Text fontSize={16} color="$gray12">
                  Set reminder
                </Text>
              </XStack>
            </ScrollView>

            <XStack justifyContent="flex-end" marginTop={16} gap={12}>
              <Dialog.Close asChild>
                <Button
                  variant="outlined"
                  borderColor="$gray6"
                  onPress={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
              </Dialog.Close>
              <Button backgroundColor="$blue10" onPress={handleAddEvent}>
                <Text color="$white" fontWeight="500">
                  Save
                </Text>
              </Button>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </YStack>
  );
}
