import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FAMLY!</Text>
      <Text style={styles.subtitle}>You're signed in as:</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    color: '#007AFF',
    marginBottom: 32,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

