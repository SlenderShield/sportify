import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, TextInput, SafeAreaView } from "react-native";
import { MatchCard } from "../../components/MatchCard";
import { TeamCard } from "../../components/TeamCard";
import { EventCard } from "../../components/EventCard";
import { FeatureCard } from "../../components/FeatureCard";
import { mockMatches, mockTeams, mockEvents, mockFeatures, mockStats } from "./mockData";
import { Match, Team, Event, Feature } from "./types";

const TABS = ["Matches", "My Teams", "Events"];

export default function DashboardScreen() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");

  // Render callbacks
  const renderMatch = useCallback(
    ({ item }: { item: Match }) => (
      <MatchCard
        match={item}
        onJoin={() => {}}
        onDetails={() => {}}
      />
    ),
    [],
  );
  const renderTeam = useCallback(
    ({ item }: { item: Team }) => <TeamCard team={item} onChat={() => {}} />, []
  );
  const renderEvent = useCallback(
    ({ item }: { item: Event }) => (
      <EventCard event={item} onRegister={() => {}} onDetails={() => {}} />
    ),
    [],
  );
  const renderFeature = useCallback(
    ({ item }: { item: Feature }) => <FeatureCard feature={item} />, []
  );

  // Stats Card
  const StatsCard = () => (
    <View className="bg-surface rounded-xl shadow p-md mb-md flex-row justify-between items-center">
      <View>
        <Text className="text-heading font-bold mb-xs">Stats Overview</Text>
        <Text className="text-body">Matches: {mockStats.matches}</Text>
        <Text className="text-body">Wins: {mockStats.wins}</Text>
        <Text className="text-body">Losses: {mockStats.losses}</Text>
      </View>
      <View className="items-center">
        <Text className="text-2xl font-bold text-success">{mockStats.winRate}%</Text>
        <Text className="text-caption text-muted">Win Rate</Text>
      </View>
    </View>
  );

  // Header
  const Header = () => (
    <View className="flex-row items-center justify-between mb-md mt-md">
      <Text className="text-2xl font-bold">Sportify</Text>
      <View className="flex-row gap-md">
        <TouchableOpacity accessibilityLabel="Notifications">
          <Text className="text-2xl">🔔</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Chat">
          <Text className="text-2xl">💬</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Search Bar
  const SearchBar = () => (
    <View className="mb-md">
      <TextInput
        className="bg-surface border border-muted rounded-lg px-md py-sm text-body"
        placeholder="Search matches, teams, events..."
        value={search}
        onChangeText={setSearch}
        accessibilityLabel="Search"
      />
    </View>
  );

  // Tabs
  const Tabs = () => (
    <View className="flex-row mb-md">
      {TABS.map((t, i) => (
        <TouchableOpacity
          key={t}
          className={`flex-1 py-sm rounded-lg items-center ${tab === i ? "bg-primary" : "bg-surface"}`}
          onPress={() => setTab(i)}
          accessibilityLabel={`Show ${t}`}
        >
          <Text className={tab === i ? "text-white font-bold" : "text-body font-bold"}>{t}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Floating + Button
  const FloatingButton = () => (
    <TouchableOpacity
      className="absolute bottom-8 right-8 bg-primary w-16 h-16 rounded-full items-center justify-center shadow-lg z-50"
      accessibilityLabel="Add New"
      onPress={() => {}}
      style={{ elevation: 8 }}
    >
      <Text className="text-white text-3xl">+</Text>
    </TouchableOpacity>
  );

  // Main List
  let list;
  if (tab === 0) {
    list = (
      <FlatList
        data={mockMatches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    );
  } else if (tab === 1) {
    list = (
      <FlatList
        data={mockTeams}
        renderItem={renderTeam}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    );
  } else {
    list = (
      <FlatList
        data={mockEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-md">
        <Header />
        <SearchBar />
        <StatsCard />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-md"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {mockFeatures.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </ScrollView>
        <Tabs />
        <View className="flex-1">{list}</View>
      </View>
      <FloatingButton />
    </SafeAreaView>
  );
}
