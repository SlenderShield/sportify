import { View, Text, YStack, XStack, Image } from 'tamagui';
import type { ChatMessage } from '@/types';

interface ChatBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isCurrentUser }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <XStack flexDirection="row" marginBottom={16} alignItems="flex-end" justifyContent={isCurrentUser ? 'flex-end' : 'flex-start'}>
      {!isCurrentUser && (
        <YStack marginRight={8}>
          {message.avatar ? (
            <Image source={{ uri: message.avatar }} width={32} height={32} borderRadius={16} />
          ) : (
            <YStack width={32} height={32} borderRadius={16} backgroundColor="$primary" alignItems="center" justifyContent="center">
              <Text color="$background" fontSize={14} fontWeight="600">
                {message.username.charAt(0).toUpperCase()}
              </Text>
            </YStack>
          )}
        </YStack>
      )}
      <YStack
        maxWidth="75%"
        padding={12}
        borderRadius={16}
        backgroundColor={isCurrentUser ? "$primary" : "$background"}
        borderBottomRightRadius={isCurrentUser ? 4 : 16}
        borderBottomLeftRadius={!isCurrentUser ? 4 : 16}
      >
        {!isCurrentUser && (
          <Text fontSize={12} fontWeight="600" color="$secondary" marginBottom={4}>{message.username}</Text>
        )}
        <Text fontSize={16} lineHeight={20} color={isCurrentUser ? "$background" : "$text"}>
          {message.message}
        </Text>
        <Text fontSize={11} marginTop={4} color={isCurrentUser ? "$secondary" : "$secondary"} textAlign={isCurrentUser ? "right" : "left"}>
          {formatTime(message.timestamp)}
        </Text>
      </YStack>
    </XStack>
  );
};

// Styles removed: now using Tamagui tokens and primitives for layout and spacing