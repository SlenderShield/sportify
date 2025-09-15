import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Match } from '@/types';
import { Calendar, Clock, MapPin, Users } from 'lucide-react-native';

interface MatchCardProps {
  match: Match;
  onPress?: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = () => {
    switch (match.status) {
      case 'live':
        return '#EF4444';
      case 'upcoming':
        return '#3B82F6';
      case 'finished':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = () => {
    switch (match.status) {
      case 'live':
        return 'LIVE';
      case 'upcoming':
        return 'UPCOMING';
      case 'finished':
        return 'FINISHED';
      default:
        return String(match.status).toUpperCase();
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Calendar size={14} color="#6B7280" />
          <Text style={styles.dateText}>{formatDate(match.date)}</Text>
        </View>
      </View>

      <View style={styles.matchInfo}>
        <View style={styles.teamsContainer}>
          <View style={styles.team}>
            <Text style={styles.teamName}>{match.homeTeam}</Text>
            <Text style={styles.teamLabel}>HOME</Text>
          </View>
          
          <View style={styles.versus}>
            {match.score ? (
              <View style={styles.scoreContainer}>
                <Text style={styles.score}>
                  {match.score.home} - {match.score.away}
                </Text>
              </View>
            ) : (
              <Text style={styles.vsText}>VS</Text>
            )}
          </View>
          
          <View style={styles.team}>
            <Text style={styles.teamName}>{match.awayTeam}</Text>
            <Text style={styles.teamLabel}>AWAY</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.detailText}>{match.time}</Text>
          </View>
          <View style={styles.detailItem}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.detailText}>{match.venue}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  matchInfo: {
    alignItems: 'center',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  team: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  teamLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  versus: {
    marginHorizontal: 16,
    alignItems: 'center',
  },
  vsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  scoreContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
});