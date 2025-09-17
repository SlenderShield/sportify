import { YStack, XStack, Text, Button, ScrollView, View } from 'tamagui';
import { Alert } from 'react-native';
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
    <YStack
      key={venue.id}
      backgroundColor="$background"
      borderRadius={20}
      padding={20}
      marginBottom={20}
      borderWidth={1}
      borderColor="$border"
      shadowColor="#3B82F6"
      shadowOffset={{ width: 0, height: 8 }}
      shadowOpacity={0.08}
      shadowRadius={16}
    >
      <YStack marginBottom={12}>
        <Text fontSize={18} fontWeight="700" color="$text" marginBottom={4}>{venue.name}</Text>
        <XStack alignItems="center">
          <MapPin size={16} color="$secondary" />
          <Text fontSize={14} color="$secondary" marginLeft={6}>{venue.address}</Text>
        </XStack>
      </YStack>
      {venue.nextEvent && (
        <XStack alignItems="center" backgroundColor="$blue2" padding={12} borderRadius={12} marginBottom={16}>
          <Clock size={16} color="$primary" />
          <YStack marginLeft={10} flex={1}>
            <Text fontSize={14} fontWeight="600" color="$primary" marginBottom={2}>{venue.nextEvent}</Text>
            <Text fontSize={12} color="$secondary">{formatEventTime(venue.eventTime)}</Text>
          </YStack>
        </XStack>
      )}
      <XStack gap={12}>
        <Button
          flex={1}
          borderRadius={12}
          backgroundColor="$primary"
          onPress={() => handleGetDirections(venue)}
          icon={<Navigation size={18} color="#fff" />}
        >
          <Text color="$background" fontWeight="700">Directions</Text>
        </Button>
        <Button
          flex={1}
          borderRadius={12}
          backgroundColor="$blue2"
          borderWidth={1}
          borderColor="$primary"
          onPress={() => handleOpenMaps(venue)}
          icon={<MapPin size={18} color="#3B82F6" />}
        >
          <Text color="$primary" fontWeight="700">View on Map</Text>
        </Button>
      </XStack>
    </YStack>
  );

  const renderQuickActions = () => (
    <YStack padding={20} backgroundColor="$background" borderRadius={20} marginBottom={16}>
      <Text fontSize={18} fontWeight="700" color="$text" marginBottom={16}>Quick Actions</Text>
      <Button
        chromeless
        borderRadius={14}
        backgroundColor="$blue2"
        flexDirection="row"
        alignItems="center"
        paddingVertical={16}
        marginBottom={12}
        onPress={() => openMaps()}
        icon={<MapPin size={24} color="#3B82F6" />}
      >
        <YStack marginLeft={16} flex={1} alignItems="flex-start">
          <Text fontSize={16} fontWeight="600" color="$primary">Open Maps</Text>
          <Text fontSize={14} color="$secondary">Explore nearby locations and venues</Text>
        </YStack>
      </Button>
      <Button
        chromeless
        borderRadius={14}
        backgroundColor="$green2"
        flexDirection="row"
        alignItems="center"
        paddingVertical={16}
        onPress={() => openMaps('sports facilities near me')}
        icon={<Users size={24} color="#10B981" />}
      >
        <YStack marginLeft={16} flex={1} alignItems="flex-start">
          <Text fontSize={16} fontWeight="600" color="$green10">Find Sports Venues</Text>
          <Text fontSize={14} color="$secondary">Discover sports facilities in your area</Text>
        </YStack>
      </Button>
    </YStack>
  );

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack paddingHorizontal={20} paddingTop={32} paddingBottom={16} backgroundColor="$background" borderBottomWidth={1} borderBottomColor="$border">
        <Text fontSize={26} fontWeight="800" color="$text">Maps & Venues</Text>
        <Text fontSize={15} color="$secondary" marginTop={2}>Find your way to matches and training</Text>
      </YStack>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderQuickActions()}
        <YStack padding={20} backgroundColor="$background" borderRadius={20}>
          <Text fontSize={18} fontWeight="700" color="$text" marginBottom={16}>Team Venues</Text>
          {venues.map(renderVenueCard)}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
