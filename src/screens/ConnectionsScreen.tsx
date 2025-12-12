import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { connectionService } from '../services/connectionService';
import { familyService } from '../services/familyService';
import { Connection, Family } from '../types/database';

export default function ConnectionsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFamilyId, setCurrentFamilyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'connected'>('pending');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    const family = await familyService.getOrCreateFamily(user.id);
    if (family) {
      setCurrentFamilyId(family.id);
      const pending = await connectionService.getPendingRequests(family.id);
      const connected = await connectionService.getConnections(family.id);
      setPendingRequests(pending);
      setConnections(connected);
    }
    setLoading(false);
  };

  const handleAccept = async (connectionId: string) => {
    const { error } = await connectionService.acceptConnection(connectionId);
    if (error) {
      Alert.alert('Error', 'Could not accept connection');
    } else {
      loadData();
    }
  };

  const handleDecline = async (connectionId: string) => {
    Alert.alert('Decline Connection', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Decline',
        style: 'destructive',
        onPress: async () => {
          const { error } = await connectionService.declineConnection(connectionId);
          if (error) {
            Alert.alert('Error', 'Could not decline connection');
          } else {
            loadData();
          }
        },
      },
    ]);
  };

  const renderPendingRequest = ({ item }: { item: Connection }) => {
    const otherFamilyId =
      item.requester_family_id === currentFamilyId
        ? item.receiver_family_id
        : item.requester_family_id;

    return (
      <View style={styles.requestCard}>
        <Text style={styles.requestText}>
          Connection request from family ID: {otherFamilyId.slice(0, 8)}...
        </Text>
        {item.message && <Text style={styles.messageText}>{item.message}</Text>}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleAccept(item.id)}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.declineButton]}
            onPress={() => handleDecline(item.id)}
          >
            <Text style={[styles.buttonText, styles.declineButtonText]}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderConnection = ({ item }: { item: Connection }) => {
    const otherFamilyId =
      item.requester_family_id === currentFamilyId
        ? item.receiver_family_id
        : item.requester_family_id;

    return (
      <TouchableOpacity
        style={styles.connectionCard}
        onPress={() => navigation.navigate('Chat', { familyId: otherFamilyId })}
      >
        <Text style={styles.connectionText}>
          Connected with family ID: {otherFamilyId.slice(0, 8)}...
        </Text>
        <Text style={styles.chatText}>Tap to message →</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Connections</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'pending' && styles.activeTabText,
            ]}
          >
            Pending ({pendingRequests.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'connected' && styles.activeTab]}
          onPress={() => setActiveTab('connected')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'connected' && styles.activeTabText,
            ]}
          >
            Connected ({connections.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'pending' ? (
        <FlatList
          data={pendingRequests}
          renderItem={renderPendingRequest}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No pending requests</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={connections}
          renderItem={renderConnection}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No connections yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  requestCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
  },
  requestText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#007AFF',
  },
  declineButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  declineButtonText: {
    color: '#666',
  },
  connectionCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  connectionText: {
    fontSize: 16,
    color: '#000',
  },
  chatText: {
    fontSize: 14,
    color: '#007AFF',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});

