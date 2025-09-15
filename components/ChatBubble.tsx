import { View, Text, StyleSheet, Image } from 'react-native';
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
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      {!isCurrentUser && (
        <View style={styles.avatarContainer}>
          {message.avatar ? (
            <Image source={{ uri: message.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {message.username.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      )}
      
      <View style={[
        styles.bubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
      ]}>
        {!isCurrentUser && (
          <Text style={styles.username}>{message.username}</Text>
        )}
        <Text style={[
          styles.messageText,
          isCurrentUser ? styles.currentUserText : styles.otherUserText
        ]}>
          {message.message}
        </Text>
        <Text style={[
          styles.timestamp,
          isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp
        ]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  currentUserContainer: {
    justifyContent: 'flex-end',
  },
  otherUserContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  currentUserBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  username: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  currentUserText: {
    color: '#FFFFFF',
  },
  otherUserText: {
    color: '#111827',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  currentUserTimestamp: {
    color: '#E0E7FF',
    textAlign: 'right',
  },
  otherUserTimestamp: {
    color: '#6B7280',
    textAlign: 'left',
  },
});