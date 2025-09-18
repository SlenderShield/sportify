import React from "react";
import { View, Text } from "react-native";
import { useGetProfileQuery } from "../../api/api";

export function ProfileCard() {
  const { data, error, isLoading } = useGetProfileQuery();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading profile</Text>;
  if (!data) return <Text>No profile found</Text>;

  return (
    <View className="p-md bg-surface rounded-lg">
      <Text className="text-heading font-bold">{data.name}</Text>
      <Text className="text-body">ID: {data.id}</Text>
    </View>
  );
}