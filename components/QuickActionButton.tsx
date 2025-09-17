import { Text, YStack, View, Button, Theme } from 'tamagui';
import type { LucideIcon } from 'lucide-react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Pressable, Animated } from 'react-native';
import { getAdaptiveLayout } from '@/utils/responsive';

interface QuickActionButtonProps {
  icon: LucideIcon;
  title: string;
  onPress: () => void;
  color?: string;
  badge?: number;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon: Icon,
  title,
  onPress,
  color = '$primary',
  badge
}) => {
  const [pressed, setPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { isTablet, quickActionMaxWidth } = getAdaptiveLayout();

  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${title}${badge ? ` - ${badge} notifications` : ''}`}
      accessibilityHint={`Navigate to ${title} screen`}
      style={{
        flex: 1,
        maxWidth: quickActionMaxWidth,
        marginHorizontal: isTablet ? 6 : 4,
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          alignItems: 'center',
        }}
      >
        <YStack alignItems="center">
          {/* Glassmorphic container */}
          <View
            backgroundColor="$backgroundElevated"
            width={isTablet ? 80 : 72}
            height={isTablet ? 80 : 72}
            borderRadius="$xl"
            alignItems="center"
            justifyContent="center"
            marginBottom="$3"
            position="relative"
            borderWidth={1}
            borderColor="$borderSubtle"
            shadowColor={color}
            shadowOffset={{ width: 0, height: 8 }}
            shadowOpacity={0.12}
            shadowRadius={16}
            elevation={6}
            // Glassmorphic backdrop effect
            style={{
              backdropFilter: 'blur(20px)',
              backgroundColor: pressed ? '$glass' : '$backgroundElevated',
            }}
          >
            {/* Icon background circle */}
            <View
              backgroundColor={color}
              width={isTablet ? 56 : 48}
              height={isTablet ? 56 : 48}
              borderRadius={isTablet ? 28 : 24}
              alignItems="center"
              justifyContent="center"
              shadowColor={color}
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.3}
              shadowRadius={8}
              elevation={3}
            >
              <Icon size={isTablet ? 28 : 24} color="$textInverse" />
            </View>

            {/* Badge */}
            {badge !== undefined && badge > 0 && (
              <View
                position="absolute"
                top={-2}
                right={-2}
                backgroundColor="$error"
                borderRadius="$full"
                minWidth={22}
                height={22}
                alignItems="center"
                justifyContent="center"
                paddingHorizontal="$2"
                borderWidth={2}
                borderColor="$backgroundElevated"
                shadowColor="$error"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.25}
                shadowRadius={4}
                elevation={4}
              >
                <Text
                  color="$textInverse"
                  fontSize={10}
                  fontWeight="700"
                  lineHeight={12}
                >
                  {badge > 99 ? '99+' : badge}
                </Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text
            fontSize={12}
            fontWeight="600"
            color="$text"
            textAlign="center"
            numberOfLines={1}
            style={{
              opacity: pressed ? 0.7 : 1,
            }}
          >
            {title}
          </Text>
        </YStack>
      </Animated.View>
    </Pressable>
  );
};
