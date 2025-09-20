import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isTablet = width > 768;

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Sportify</Text>
          <Text style={styles.subtitle}>
            Your ultimate sports companion app
          </Text>
        </View>

        <View style={[styles.features, isTablet && styles.featuresTablet]}>
          <View
            style={[styles.featureCard, isTablet && styles.featureCardTablet]}
          >
            <Ionicons
              name='football'
              size={isTablet ? 40 : 32}
              color='#007AFF'
            />
            <Text
              style={[
                styles.featureTitle,
                isTablet && styles.featureTitleTablet,
              ]}
            >
              Live Scores
            </Text>
            <Text
              style={[
                styles.featureDescription,
                isTablet && styles.featureDescriptionTablet,
              ]}
            >
              Get real-time updates on your favorite sports
            </Text>
          </View>

          <View
            style={[styles.featureCard, isTablet && styles.featureCardTablet]}
          >
            <Ionicons
              name='calendar'
              size={isTablet ? 40 : 32}
              color='#007AFF'
            />
            <Text
              style={[
                styles.featureTitle,
                isTablet && styles.featureTitleTablet,
              ]}
            >
              Schedule
            </Text>
            <Text
              style={[
                styles.featureDescription,
                isTablet && styles.featureDescriptionTablet,
              ]}
            >
              Never miss a game with our smart scheduling
            </Text>
          </View>

          <View
            style={[styles.featureCard, isTablet && styles.featureCardTablet]}
          >
            <Ionicons
              name='stats-chart'
              size={isTablet ? 40 : 32}
              color='#007AFF'
            />
            <Text
              style={[
                styles.featureTitle,
                isTablet && styles.featureTitleTablet,
              ]}
            >
              Statistics
            </Text>
            <Text
              style={[
                styles.featureDescription,
                isTablet && styles.featureDescriptionTablet,
              ]}
            >
              Detailed stats and analytics for all teams
            </Text>
          </View>
        </View>

        <Button
          size='$4'
          backgroundColor='$blue10'
          color='white'
          borderRadius='$4'
          marginTop='$4'
          width={isTablet ? 200 : '100%'}
          alignSelf={isTablet ? 'center' : 'stretch'}
        >
          Get Started
        </Button>
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
    maxWidth: isWeb ? 1200 : undefined,
    alignSelf: isWeb ? 'center' : 'stretch',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
    textAlign: 'center',
  },
  features: {
    gap: 20,
    marginBottom: 30,
  },
  featuresTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
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
  featureCardTablet: {
    width: '30%',
    minWidth: 250,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 8,
  },
  featureTitleTablet: {
    fontSize: 20,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  featureDescriptionTablet: {
    fontSize: 16,
    lineHeight: 24,
  },
});
