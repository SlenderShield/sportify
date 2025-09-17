import { Link, Stack } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { YStack, Text, Button } from 'tamagui';

export default function NotFoundScreen() {
  const bounceValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: -15,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.in(Easing.quad),
        }),
      ])
    );
    bounceAnimation.start();

    return () => bounceAnimation.stop();
  }, [bounceValue]);

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <YStack 
        flex={1} 
        alignItems="center" 
        justifyContent="center" 
        padding={20} 
        style={{ background: 'linear-gradient(180deg, #f0f4f8, #ffffff)' }}
      >
        <Animated.Text 
          style={{ 
            fontSize: 64, 
            marginBottom: 16, 
            transform: [{ translateY: bounceValue }] 
          }}
        >
          😅
        </Animated.Text>
        <Text fontSize={22} fontWeight="800" color="$text" textAlign="center" marginBottom={16}>
          This screen doesn't exist.
        </Text>
        <Link href="/" asChild>
          <Button
            backgroundColor="$primary"
            borderRadius={12}
            paddingVertical={14}
            marginTop={15}
            pressStyle={{ scale: 0.95 }}
          >
            <Text color="$background" fontWeight="700">Go to home screen!</Text>
          </Button>
        </Link>
      </YStack>
    </>
  );
}
