import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name='person' size={40} color='#007AFF' />
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
        </View>

        <View style={styles.menu}>
          <View style={styles.menuItem}>
            <Ionicons name='settings' size={24} color='#6B7280' />
            <Text style={styles.menuText}>Settings</Text>
            <Ionicons name='chevron-forward' size={20} color='#C7C7CC' />
          </View>

          <View style={styles.menuItem}>
            <Ionicons name='notifications' size={24} color='#6B7280' />
            <Text style={styles.menuText}>Notifications</Text>
            <Ionicons name='chevron-forward' size={20} color='#C7C7CC' />
          </View>

          <View style={styles.menuItem}>
            <Ionicons name='heart' size={24} color='#6B7280' />
            <Text style={styles.menuText}>Favorites</Text>
            <Ionicons name='chevron-forward' size={20} color='#C7C7CC' />
          </View>

          <View style={styles.menuItem}>
            <Ionicons name='help-circle' size={24} color='#6B7280' />
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name='chevron-forward' size={20} color='#C7C7CC' />
          </View>
        </View>

        <Button
          size='$4'
          backgroundColor='$red10'
          color='white'
          borderRadius='$4'
          marginTop='$6'
        >
          Sign Out
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#6B7280',
  },
  menu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    marginLeft: 16,
  },
});
