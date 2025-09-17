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
          width={64}
          height={64}
          borderRadius={32}
          alignItems="center"
          justifyContent="center"
          marginBottom={10}
          position="relative"
          shadowColor={color}
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.18}
          shadowRadius={10}
        >
          <Icon size={28} color="#FFFFFF" />
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
              borderWidth={2}
              borderColor="#fff"
            >
              <Text color="$background" fontSize={11} fontWeight="700">{badge > 99 ? '99+' : badge}</Text>
            </View>
          )}
        </View>
        <Text fontSize={13} fontWeight="700" color="$text" textAlign="center" marginTop={2}>{title}</Text>
      </YStack>
    </Button>
  );
};

// Styles removed: now using Tamagui tokens and primitives for layout and spacing