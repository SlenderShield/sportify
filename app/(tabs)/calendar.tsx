import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalendar } from '@/hooks/useCalendar';
import { CalendarEventCard } from '@/components/CalendarEventCard';
import { Plus, Calendar as CalendarIcon, Clock, MapPin, X } from 'lucide-react-native';
import type { CalendarEvent } from '@/types';

export default function CalendarScreen() {
  const { 
    events, 
    selectedDate, 
    addEvent, 
    removeEvent, 
    setSelectedDate, 
    getEventsForDate,
    getTodayEvents,
    getUpcomingEvents,
    toggleReminder
  } = useCalendar();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    type: 'other',
    reminder: true,
    location: ''
  });

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
      reminder: newEvent.reminder || false,
      location: newEvent.location || ''
    });

    // Reset form
    setNewEvent({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      type: 'other',
      reminder: true,
      location: ''
    });

    setShowAddModal(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeEvent(eventId),
        },
      ]
    );
  };

  const renderAddEventModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      presentationStyle="formSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setShowAddModal(false)}
            style={styles.modalCloseButton}
          >
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Event</Text>
          <TouchableOpacity
            onPress={handleAddEvent}
            style={styles.modalSaveButton}
          >
            <Text style={styles.modalSaveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Title *</Text>
            <TextInput
              style={styles.formInput}
              value={newEvent.title}
              onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
              placeholder="Enter event title"
              autoFocus
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={newEvent.description}
              onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
              placeholder="Enter event description"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Location</Text>
            <TextInput
              style={styles.formInput}
              value={newEvent.location}
              onChangeText={(text) => setNewEvent({ ...newEvent, location: text })}
              placeholder="Enter location"
            />
          </View>

          <View style={styles.formRow}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Date</Text>
              <TextInput
                style={styles.formInput}
                value={newEvent.date}
                onChangeText={(text) => setNewEvent({ ...newEvent, date: text })}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Time</Text>
              <TextInput
                style={styles.formInput}
                value={newEvent.time}
                onChangeText={(text) => setNewEvent({ ...newEvent, time: text })}
                placeholder="HH:MM"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Type</Text>
            <View style={styles.typeButtons}>
              {['match', 'training', 'meeting', 'other'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    newEvent.type === type && styles.typeButtonActive
                  ]}
                  onPress={() => setNewEvent({ ...newEvent, type: type as any })}
                >
                  <Text style={[
                    styles.typeButtonText,
                    newEvent.type === type && styles.typeButtonTextActive
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.reminderToggle}
            onPress={() => setNewEvent({ ...newEvent, reminder: !newEvent.reminder })}
          >
            <View style={[
              styles.reminderCheckbox,
              newEvent.reminder && styles.reminderCheckboxActive
            ]}>
              {newEvent.reminder && <Text style={styles.reminderCheckmark}>✓</Text>}
            </View>
            <Text style={styles.reminderText}>Set reminder</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderSection = (title: string, items: CalendarEvent[], emptyText: string) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
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
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSection('Today', todayEvents, 'No events today')}
        {renderSection('Upcoming', upcomingEvents, 'No upcoming events')}
      </ScrollView>

      {renderAddEventModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 10,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalSaveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  typeButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  reminderToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  reminderCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderCheckboxActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  reminderCheckmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reminderText: {
    fontSize: 16,
    color: '#111827',
  },
});