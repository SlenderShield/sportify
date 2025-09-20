import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          height: isWeb ? 60 : undefined,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarLabelStyle: {
          fontSize: isWeb ? 14 : 12,
          fontWeight: '500',
        },
        tabBarIconStyle: {
          marginTop: isWeb ? 4 : 0,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='home'
              size={isWeb ? size + 4 : size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='compass'
              size={isWeb ? size + 4 : size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='person'
              size={isWeb ? size + 4 : size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
