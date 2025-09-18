import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Match } from "../features/dashboard/types";

interface MatchCardProps {
  match: Match;
  onJoin: () => void;
  onDetails: () => void;
}

export function MatchCard({ match, onJoin, onDetails }: MatchCardProps) {
  return (
    <View className="bg-surface rounded-xl shadow p-md mb-md">
      <Image
        source={{ uri: match.image }}
        className="w-full h-40 rounded-lg mb-sm"
        resizeMode="cover"
        accessibilityLabel={`${match.title} image`}
      />
      <Text className="text-heading font-bold mb-xs">{match.title}</Text>
      <Text className="text-body mb-xs">
        {match.sport} • {match.skillLevel}
      </Text>
      <Text className="text-muted mb-xs">{match.location} • {match.time}</Text>
      <Text className="text-body mb-sm">Participants: {match.participants}</Text>
      <View className="flex-row gap-md">
        <TouchableOpacity
          className="flex-1 bg-primary py-sm rounded-lg items-center"
          onPress={onJoin}
          accessibilityLabel="Join Match"
        >
          <Text className="text-white font-bold">Join Match</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-accent py-sm rounded-lg items-center"
          onPress={onDetails}
          accessibilityLabel="View Match Details"
        >
          <Text className="text-primary font-bold">Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
