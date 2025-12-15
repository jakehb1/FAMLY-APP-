import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { messagingService } from '../services/messagingService';
import { familyService } from '../services/familyService';
import { Conversation } from '../types/database';

export default function ChatListScreen({ navigation }: any) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFamilyId, setCurrentFamilyId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    // Refresh every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    const family = await familyService.getOrCreateFamily(user.id);
    if (family) {
      setCurrentFamilyId(family.id);
      const convos = await messagingService.getConversations(family.id);
      setConversations(convos);
    }
    setLoading(false);
  };

  const getOtherFamilyId = (conversation: Conversation): string => {
    return conversation.family_ids.find((id) => id !== currentFamilyId) || '';
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const otherFamilyId = getOtherFamilyId(item);
    return (
      <TouchableOpacity
        style={styles.conversationCard}
        onPress={() => navigation.navigate('Chat', { otherFamilyId, conversationId: item.id })}
      >
        <View style={styles.conversationInfo}>
          <Text style={styles.familyId}>
            Family: {otherFamilyId.slice(0, 8)}...
          </Text>
          <Text style={styles.lastMessage}>
            Last message: {new Date(item.last_message_at).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.arrow}>→</Text>
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
        <Text style={styles.title}>Messages</Text>
      </View>

      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>
              Connect with families to start messaging
            </Text>
          </View>
        }
      />
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
  list: {
    padding: 16,
  },
  conversationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
  },
  conversationInfo: {
    flex: 1,
  },
  familyId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    fontSize: 20,
    color: '#007AFF',
    marginLeft: 12,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#ccc',
    fontSize: 14,
  },
});


