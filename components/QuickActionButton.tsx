import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
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
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Icon size={24} color="#FFFFFF" />
        {badge !== undefined && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    maxWidth: '22%',
    marginHorizontal: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
});