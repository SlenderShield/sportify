import { YStack, XStack, Text, Button } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import type { NotificationItem as NotificationItemType } from '@/types';
import { Bell, MessageCircle, Calendar, Info, Trash2 } from 'lucide-react-native';

interface NotificationItemProps {
  notification: NotificationItemType;
  onPress: () => void;
  onDelete: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, onPress, onDelete 
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'match':
        return <Calendar size={20} color="#3B82F6" />;
      case 'chat':
        return <MessageCircle size={20} color="#10B981" />;
      case 'reminder':
        return <Bell size={20} color="#F59E0B" />;
      default:
        return <Info size={20} color="#6B7280" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <XStack
        alignItems="flex-start"
        padding={16}
        backgroundColor={notification.read ? '$background' : '$red1'}
        borderBottomWidth={1}
        borderBottomColor="$gray5"
        width="100%"
      >
        <YStack width={40} height={40} borderRadius={20} backgroundColor="$gray2" alignItems="center" justifyContent="center" marginRight={12}>
          {getIcon()}
        </YStack>
        <YStack flex={1} position="relative">
          <XStack justifyContent="space-between" alignItems="flex-start" marginBottom={4}>
            <Text fontSize={16} fontWeight={notification.read ? "500" : "600"} color="$gray12" flex={1} marginRight={8}>
              {notification.title}
            </Text>
            <Text fontSize={12} color="$gray8">{formatTime(notification.timestamp)}</Text>
          </XStack>
          <Text fontSize={14} color="$gray8" lineHeight={18} numberOfLines={2}>{notification.message}</Text>
          {!notification.read && (
            <YStack position="absolute" top={0} right={-8} width={8} height={8} borderRadius={4} backgroundColor="$blue10" />
          )}
        </YStack>
        <Button
          chromeless
          onPress={onDelete}
          padding={4}
          marginLeft={8}
          icon={<Trash2 size={16} color="#EF4444" />}
          aria-label="Delete notification"
        />
      </XStack>
    </TouchableOpacity>
  );
}
