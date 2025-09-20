import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ExploreScreen() {
  const sports = [
    { name: 'Football', icon: 'football', color: '#4CAF50' },
    { name: 'Basketball', icon: 'basketball', color: '#FF9800' },
    { name: 'Tennis', icon: 'tennisball', color: '#2196F3' },
    { name: 'Soccer', icon: 'football-outline', color: '#9C27B0' },
    { name: 'Baseball', icon: 'baseball', color: '#F44336' },
    { name: 'Hockey', icon: 'ice-hockey', color: '#00BCD4' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Explore Sports</Text>
        <Text style={styles.subtitle}>
          Discover and follow your favorite sports
        </Text>

        <View style={styles.sportsGrid}>
          {sports.map((sport, index) => (
            <View key={index} style={styles.sportCard}>
              <View
                style={[styles.iconContainer, { backgroundColor: sport.color }]}
              >
                <Ionicons name={sport.icon as any} size={24} color='white' />
              </View>
              <Text style={styles.sportName}>{sport.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 30,
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  sportCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sportName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
});
