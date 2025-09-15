import { Text, YStack, XStack, View, Theme, Button } from 'tamagui';
import type { LucideIcon } from 'lucide-react-native';

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
  color = '#3B82F6',
  badge
}) => {
  return (
    <Button chromeless onPress={onPress} flex={1} maxWidth="22%" marginHorizontal={4}>
      <YStack alignItems="center">
        <View
          backgroundColor={color}
          width={56}
          height={56}
          borderRadius={28}
          alignItems="center"
          justifyContent="center"
          marginBottom={8}
          position="relative"
        >
          <Icon size={24} color="#FFFFFF" />
          {badge !== undefined && badge > 0 && (
            <View
              position="absolute"
              top={-4}
              right={-4}
              backgroundColor="$primary"
              borderRadius={10}
              minWidth={20}
              height={20}
              alignItems="center"
              justifyContent="center"
              paddingHorizontal={4}
            >
              <Text color="$background" fontSize={10} fontWeight="600">{badge > 99 ? '99+' : badge}</Text>
            </View>
          )}
        </View>
        <Text fontSize={12} fontWeight="500" color="$text" textAlign="center">{title}</Text>
      </YStack>
  </Button>
  );
};

// Styles removed: now using Tamagui tokens and primitives for layout and spacing