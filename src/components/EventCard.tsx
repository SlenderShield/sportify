import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Event } from "../features/dashboard/types";

interface EventCardProps {
  event: Event;
  onRegister: () => void;
  onDetails: () => void;
}

export function EventCard({ event, onRegister, onDetails }: EventCardProps) {
  return (
    <View className="bg-surface rounded-xl shadow p-md mb-md">
      <Text className="text-heading font-bold mb-xs">{event.name}</Text>
      <Text className="text-body mb-xs">{event.date} • {event.location}</Text>
      <Text className="text-muted mb-sm">Participants: {event.participants}</Text>
      <View className="flex-row gap-md">
        <TouchableOpacity
          className="flex-1 bg-success py-sm rounded-lg items-center"
          onPress={onRegister}
          accessibilityLabel="Register for Event"
        >
          <Text className="text-white font-bold">Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-accent py-sm rounded-lg items-center"
          onPress={onDetails}
          accessibilityLabel="View Event Details"
        >
          <Text className="text-primary font-bold">View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
