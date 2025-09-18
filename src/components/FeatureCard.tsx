import React from "react";
import { View, Text } from "react-native";
import { Feature } from "../features/dashboard/types";

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <View className="bg-surface rounded-xl shadow p-md items-center w-40 mr-md">
      <Text className="text-3xl mb-xs">{feature.icon}</Text>
      <Text className="text-heading font-bold mb-xs text-center">{feature.title}</Text>
      <Text className="text-body text-center">{feature.description}</Text>
    </View>
  );
}
