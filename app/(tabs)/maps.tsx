import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openMaps, openDirections } from '@/lib/maps';
import { MapPin, Navigation, Clock, Users } from 'lucide-react-native';

// Mock venue data
const venues = [
  {
    id: '1',
    name: 'City Stadium',
    address: '123 Stadium Ave, Downtown',
    latitude: 40.7128,
    longitude: -74.0060,
    nextEvent: 'Match vs Eagles FC',
    eventTime: '2024-01-20T15:00:00Z',
  },
  {
    id: '2',
    name: 'Training Ground',
    address: '456 Sports Complex Rd',
    latitude: 40.7589,
    longitude: -73.9851,
    nextEvent: 'Team Training',
    eventTime: '2024-01-18T18:00:00Z',
  },
  {
    id: '3',
    name: 'Sports Complex',
    address: '789 Athletic Center Blvd',
    latitude: 40.7505,
    longitude: -73.9934,
    nextEvent: 'Away Match',
    eventTime: '2024-01-25T18:30:00Z',
  }
];

export default function MapsScreen() {
  const handleOpenMaps = async (venue: typeof venues[0]) => {
    try {
      await openMaps(venue.name, venue.latitude, venue.longitude);
    } catch (error) {
      Alert.alert('Error', 'Unable to open maps. Please try again.');
    }
  };

  const handleGetDirections = async (venue: typeof venues[0]) => {
    try {
      await openDirections(venue.name, venue.latitude, venue.longitude);
    } catch (error) {
      Alert.alert('Error', 'Unable to get directions. Please try again.');
    }
  };

  const formatEventTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const renderVenueCard = (venue: typeof venues[0]) => (
    <View key={venue.id} style={styles.venueCard}>
      <View style={styles.venueHeader}>
        <View style={styles.venueInfo}>
          <Text style={styles.venueName}>{venue.name}</Text>
          <View style={styles.addressContainer}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.venueAddress}>{venue.address}</Text>
          </View>
        </View>
      </View>

      {venue.nextEvent && (
        <View style={styles.nextEventContainer}>
          <Clock size={16} color="#3B82F6" />
          <View style={styles.nextEventInfo}>
            <Text style={styles.nextEventTitle}>{venue.nextEvent}</Text>
            <Text style={styles.nextEventTime}>
              {formatEventTime(venue.eventTime)}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.venueActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => handleGetDirections(venue)}
        >
          <Navigation size={18} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Directions</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => handleOpenMaps(venue)}
        >
          <MapPin size={18} color="#3B82F6" />
          <Text style={styles.secondaryButtonText}>View on Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <TouchableOpacity
        style={styles.quickActionButton}
        onPress={() => openMaps()}
      >
        <MapPin size={24} color="#3B82F6" />
        <View style={styles.quickActionInfo}>
          <Text style={styles.quickActionTitle}>Open Maps</Text>
          <Text style={styles.quickActionDescription}>
            Explore nearby locations and venues
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionButton}
        onPress={() => {
          // TODO: Get user's current location and search for nearby sports facilities
          openMaps('sports facilities near me');
        }}
      >
        <Users size={24} color="#10B981" />
        <View style={styles.quickActionInfo}>
          <Text style={styles.quickActionTitle}>Find Sports Venues</Text>
          <Text style={styles.quickActionDescription}>
            Discover sports facilities in your area
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Maps & Venues</Text>
        <Text style={styles.headerSubtitle}>
          Find your way to matches and training
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderQuickActions()}
        
        <View style={styles.venuesContainer}>
          <Text style={styles.sectionTitle}>Team Venues</Text>
          {venues.map(renderVenueCard)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
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
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  quickActionsContainer: {
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
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
  },
  quickActionInfo: {
    marginLeft: 16,
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  quickActionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  venuesContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  venueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  venueHeader: {
    marginBottom: 12,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  nextEventContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  nextEventInfo: {
    marginLeft: 8,
    flex: 1,
  },
  nextEventTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E40AF',
    marginBottom: 2,
  },
  nextEventTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  venueActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontWeight: '500',
    fontSize: 14,
  },
});