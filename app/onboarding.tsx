import React, { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { YStack, XStack, Text, Button, ScrollView, Theme, styled } from 'tamagui';
import { Users, MessageCircle, Calendar, Bell, Map, Trophy, ChevronRight } from 'lucide-react-native';



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
    <YStack flex={1} backgroundColor="$background">
      {/* Header */}
      <XStack justifyContent="flex-end" alignItems="center" paddingHorizontal={20} paddingTop={60} paddingBottom={20}>
        <Button
          chromeless
          onPress={handleSkip}
          paddingHorizontal={16}
          paddingVertical={8}
        >
          <Text fontSize={16} color="$gray10" fontWeight="500">Skip</Text>
        </Button>
      </XStack>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
        <YStack flex={1} alignItems="center" justifyContent="center" paddingVertical={40}>
          <YStack width={120} height={120} borderRadius={60} alignItems="center" justifyContent="center" marginBottom={32} style={{ backgroundColor: slide.color }}>
            <IconComponent size={60} color="#FFFFFF" />
          </YStack>
          <Text fontSize={28} fontWeight="bold" color="$color" textAlign="center" marginBottom={8}>{slide.title}</Text>
          <Text fontSize={18} fontWeight="600" textAlign="center" marginBottom={16} style={{ color: slide.color }}>{slide.subtitle}</Text>
          <Text fontSize={16} color="$gray10" textAlign="center" lineHeight={24} paddingHorizontal={20}>{slide.description}</Text>
        </YStack>

        {/* Progress Indicators */}
        <XStack justifyContent="center" alignItems="center" paddingVertical={32}>
          {slides.map((_, index) => (
            <YStack
              key={index}
              height={8}
              borderRadius={4}
              marginHorizontal={4}
              width={index === currentSlide ? 32 : 8}
              style={{ backgroundColor: index === currentSlide ? slide.color : '#E5E7EB' }}
            />
          ))}
        </XStack>
      </ScrollView>

      {/* Footer Navigation */}
      <YStack paddingHorizontal={20} paddingBottom={40}>
        <XStack justifyContent="space-between" alignItems="center">
          {currentSlide > 0 ? (
            <Button
              onPress={handleBack}
              backgroundColor="$gray3"
              paddingHorizontal={32}
              paddingVertical={16}
              borderRadius={12}
              minWidth={120}
            >
              <Text fontSize={16} fontWeight="600" color="$gray10">Back</Text>
            </Button>
          ) : <YStack minWidth={120} />}
          <Button
            onPress={handleContinue}
            backgroundColor={slide.color}
            paddingHorizontal={32}
            paddingVertical={16}
            borderRadius={12}
            minWidth={120}
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            // gap is not a valid prop, so use marginLeft on icon
          >
            <Text fontSize={16} fontWeight="600" color="#FFFFFF">
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
            </Text>
            <ChevronRight size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </Button>
        </XStack>
      </YStack>
    </YStack>
  );
}
