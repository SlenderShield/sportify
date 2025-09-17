import { Link, Stack } from 'expo-router';
import { YStack, Text, Button } from 'tamagui';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <YStack flex={1} alignItems="center" justifyContent="center" padding={20}>
        <Text fontSize={22} fontWeight="800" color="$text" marginBottom={16}>This screen doesn't exist.</Text>
        <Link href="/" asChild>
          <Button backgroundColor="$primary" borderRadius={12} paddingVertical={14} marginTop={15}>
            <Text color="$background" fontWeight="700">Go to home screen!</Text>
          </Button>
        </Link>
      </YStack>
    </>
  );
}

