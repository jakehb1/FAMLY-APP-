import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { familyService } from '../services/familyService';
import { Family } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

export default function DiscoverScreen({ navigation }: any) {
  const { user } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentFamilyId, setCurrentFamilyId] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentFamily();
  }, [user]);

  useEffect(() => {
    if (currentFamilyId) {
      searchFamilies();
    }
  }, [searchTerm, currentFamilyId]);

  const loadCurrentFamily = async () => {
    if (!user) return;
    const family = await familyService.getOrCreateFamily(user.id);
    if (family) {
      setCurrentFamilyId(family.id);
    }
  };

  const searchFamilies = async () => {
    setLoading(true);
    const results = await familyService.searchFamilies(
      searchTerm || undefined,
      20
    );
    // Filter out current user's family
    const filtered = results.filter((f) => f.id !== currentFamilyId);
    setFamilies(filtered);
    setLoading(false);
  };

  const renderFamily = ({ item }: { item: Family }) => (
    <TouchableOpacity
      style={styles.familyCard}
      onPress={() => navigation.navigate('FamilyProfile', { familyId: item.id })}
    >
      <View style={styles.familyInfo}>
        <Text style={styles.familyName}>{item.name}</Text>
        {item.neighborhood && (
          <Text style={styles.familyLocation}>{item.neighborhood}</Text>
        )}
        {item.bio && (
          <Text style={styles.familyBio} numberOfLines={2}>
            {item.bio}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.connectButton}
        onPress={() =>
          navigation.navigate('SendConnection', {
            requesterFamilyId: currentFamilyId,
            receiverFamilyId: item.id,
            familyName: item.name,
          })
        }
      >
        <Text style={styles.connectButtonText}>Connect</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Families</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, neighborhood, or interests..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={families}
          renderItem={renderFamily}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No families found</Text>
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
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  familyCard: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  familyInfo: {
    flex: 1,
  },
  familyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  familyLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  familyBio: {
    fontSize: 14,
    color: '#999',
  },
  connectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 6,
    marginLeft: 12,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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

