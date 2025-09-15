import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Bell, 
  Map, 
  Trophy,
  ChevronRight
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Welcome to TeamSync',
    subtitle: 'Your Sports Team Hub',
    description: 'Manage your team, schedule matches, and stay connected with your teammates all in one place.',
    icon: Trophy,
    color: '#3B82F6'
  },
  {
    id: 2,
    title: 'Stay Connected',
    subtitle: 'Team Chat & Communication',
    description: 'Chat with your teammates in real-time, share updates, and coordinate team activities.',
    icon: MessageCircle,
    color: '#10B981'
  },
  {
    id: 3,
    title: 'Never Miss a Match',
    subtitle: 'Calendar & Notifications',
    description: 'Keep track of matches, training sessions, and important events with smart notifications.',
    icon: Calendar,
    color: '#F59E0B'
  },
  {
    id: 4,
    title: 'Find Your Way',
    subtitle: 'Venues & Locations',
    description: 'Get directions to match venues and training locations with integrated maps.',
    icon: Map,
    color: '#EF4444'
  }
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { completeOnboarding } = useAuth();

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleContinue = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding();
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];
  const IconComponent = slide.icon;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.slideContainer}>
          <View style={[styles.iconContainer, { backgroundColor: slide.color }]}>
            <IconComponent size={60} color="#FFFFFF" />
          </View>

          <Text style={styles.title}>{slide.title}</Text>
          <Text style={[styles.subtitle, { color: slide.color }]}>
            {slide.subtitle}
          </Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>

        {/* Progress Indicators */}
        <View style={styles.progressContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor: index === currentSlide ? slide.color : '#E5E7EB',
                  width: index === currentSlide ? 32 : 8,
                }
              ]}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.navigationContainer}>
          {currentSlide > 0 && (
            <TouchableOpacity 
              onPress={handleBack} 
              style={[styles.navButton, styles.backButton]}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            onPress={handleContinue}
            style={[styles.navButton, styles.continueButton, { backgroundColor: slide.color }]}
          >
            <Text style={styles.continueButtonText}>
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
            </Text>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  backButton: {
    backgroundColor: '#F3F4F6',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});