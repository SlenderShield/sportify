import { Animated } from 'react-native';

// Predefined animation configurations
export const AnimationConfig = {
  spring: {
    tension: 300,
    friction: 10,
  },
  timing: {
    duration: 300,
  },
  stagger: {
    delay: 50,
  },
};

// Scale animation for buttons
export const createScaleAnimation = (scale: Animated.Value) => ({
  pressIn: () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      ...AnimationConfig.spring,
    }).start();
  },
  pressOut: () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      ...AnimationConfig.spring,
    }).start();
  },
});

// Fade animation for content
export const createFadeAnimation = (opacity: Animated.Value, visible: boolean = true) => {
  return Animated.timing(opacity, {
    toValue: visible ? 1 : 0,
    duration: AnimationConfig.timing.duration,
    useNativeDriver: true,
  });
};

// Slide animation for modals and screens
export const createSlideAnimation = (translateY: Animated.Value, visible: boolean = true) => {
  return Animated.spring(translateY, {
    toValue: visible ? 0 : 50,
    useNativeDriver: true,
    ...AnimationConfig.spring,
  });
};

// Stagger animation for lists
export const createStaggeredAnimation = (
  animations: Animated.CompositeAnimation[],
  delay: number = AnimationConfig.stagger.delay
) => {
  return Animated.stagger(delay, animations);
};

// Pulse animation for notifications
export const createPulseAnimation = (scale: Animated.Value) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.05,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ])
  );
};