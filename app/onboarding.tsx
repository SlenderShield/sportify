import React, { useState, useRef } from 'react';
import { Animated, Dimensions, Pressable, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { YStack, XStack, Text, Button, ScrollView } from 'tamagui';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  animation: any; // Lottie animation JSON
  color: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Welcome to TeamSync',
    subtitle: 'Your Sports Team Hub',
    description: 'Manage your team, schedule matches, and stay connected with your teammates all in one place.',
    animation: require('@/assets/lottie/trophy.json'),
    color: '#3B82F6'
  },
  {
    id: 2,
    title: 'Stay Connected',
    subtitle: 'Team Chat & Communication',
    description: 'Chat with your teammates in real-time, share updates, and coordinate team activities.',
    animation: require('@/assets/lottie/chat.json'),
    color: '#10B981'
  },
  {
    id: 3,
    title: 'Never Miss a Match',
    subtitle: 'Calendar & Notifications',
    description: 'Keep track of matches, training sessions, and important events with smart notifications.',
    animation: require('@/assets/lottie/calendar.json'),
    color: '#F59E0B'
  },
  {
    id: 4,
    title: 'Find Your Way',
    subtitle: 'Venues & Locations',
    description: 'Get directions to match venues and training locations with integrated maps.',
    animation: require('@/assets/lottie/map.json'),
    color: '#EF4444'
  }
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { completeOnboarding } = useAuth();
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleContinue = () => {
    if (currentSlide < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentSlide + 1) * width, animated: true });
    } else {
      completeOnboarding();
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      scrollRef.current?.scrollTo({ x: (currentSlide - 1) * width, animated: true });
    }
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentSlide(slideIndex);
      },
    }
  );

  return (
    <YStack flex={1} style={{ background: 'linear-gradient(180deg, #f0f4f8, #ffffff)' }}>
      {/* Header */}
      <XStack justifyContent="flex-end" alignItems="center" paddingHorizontal={20} paddingTop={60} paddingBottom={20}>
        <Button chromeless onPress={handleSkip} paddingHorizontal={16} paddingVertical={8}>
          <Text fontSize={16} color="$gray10" fontWeight="500">Skip</Text>
        </Button>
      </XStack>

      {/* Slides */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => {
          const scale = scrollX.interpolate({
            inputRange: [(index - 1) * width, index * width, (index + 1) * width],
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange: [(index - 1) * width, index * width, (index + 1) * width],
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
          });

          return (
            <YStack
              key={slide.id}
              width={width}
              alignItems="center"
              justifyContent="center"
              paddingVertical={40}
            >
              <Animated.View style={{ transform: [{ scale }], opacity }}>
                <YStack
                  width={180}
                  height={180}
                  borderRadius={90}
                  alignItems="center"
                  justifyContent="center"
                  marginBottom={32}
                  style={{
                    background: `linear-gradient(135deg, ${slide.color} 0%, #FFFFFF33 100%)`,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.2,
                    shadowRadius: 10,
                    elevation: 5,
                  }}
                >
                  <LottieView
                    source={slide.animation}
                    autoPlay
                    loop
                    style={{ width: 120, height: 120 }}
                  />
                </YStack>
              </Animated.View>
              <Animated.View style={{ opacity, transform: [{ scale }] }}>
                <Text fontSize={28} fontWeight="bold" color="$color" textAlign="center" marginBottom={8}>
                  {slide.title}
                </Text>
                <Text fontSize={18} fontWeight="600" textAlign="center" marginBottom={16} style={{ color: slide.color }}>
                  {slide.subtitle}
                </Text>
                <Text fontSize={16} color="$gray10" textAlign="center" lineHeight={24} paddingHorizontal={20}>
                  {slide.description}
                </Text>
              </Animated.View>
            </YStack>
          );
        })}
      </Animated.ScrollView>

      {/* Progress Indicators */}
      <XStack justifyContent="center" alignItems="center" paddingVertical={32}>
        {slides.map((_, index) => {
          const widthAnim = scrollX.interpolate({
            inputRange: [(index - 1) * width, index * width, (index + 1) * width],
            outputRange: [12, 32, 12],
            extrapolate: 'clamp',
          });
          const bgColorAnim = scrollX.interpolate({
            inputRange: [(index - 1) * width, index * width, (index + 1) * width],
            outputRange: ['#E5E7EB', slides[index].color, '#E5E7EB'],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={index}
              style={{
                height: 8,
                borderRadius: 4,
                marginHorizontal: 4,
                width: widthAnim,
                backgroundColor: bgColorAnim,
              }}
            />
          );
        })}
      </XStack>

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
          <Pressable onPress={handleContinue} style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.95 : 1 }] })}>
            <YStack
              backgroundColor={slides[currentSlide].color}
              paddingHorizontal={32}
              paddingVertical={16}
              borderRadius={12}
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              minWidth={120}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 3
              }}
            >
              <Text fontSize={16} fontWeight="600" color="#FFFFFF">
                {currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
              </Text>
              <Text style={{ marginLeft: 8, color: '#fff', fontSize: 20 }}>›</Text>
            </YStack>
          </Pressable>
        </XStack>
      </YStack>
    </YStack>
  );
}
