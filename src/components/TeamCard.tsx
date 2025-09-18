import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Team } from "../features/dashboard/types";

interface TeamCardProps {
  team: Team;
  onChat: () => void;
}

export function TeamCard({ team, onChat }: TeamCardProps) {
  return (
    <View className="bg-surface rounded-xl shadow p-md mb-md flex-row items-center justify-between">
      <View>
        <Text className="text-heading font-bold mb-xs">{team.name}</Text>
        <Text className="text-body mb-xs">{team.sport}</Text>
        <Text className="text-muted">Members: {team.members}</Text>
      </View>
      <TouchableOpacity
        className="bg-primary p-sm rounded-full"
        onPress={onChat}
        accessibilityLabel={`Chat with ${team.name}`}
      >
        <Text className="text-white text-lg">💬</Text>
      </TouchableOpacity>
    </View>
  );
}
