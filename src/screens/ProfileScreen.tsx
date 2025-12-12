import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { familyService } from '../services/familyService';
import { Family, Child } from '../types/database';

export default function ProfileScreen({ navigation }: any) {
  const { user } = useAuth();
  const [family, setFamily] = useState<Family | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    setLoading(true);
    const familyData = await familyService.getOrCreateFamily(user.id);
    if (familyData) {
      setFamily(familyData);
      const childrenData = await familyService.getChildren(familyData.id);
      setChildren(childrenData);
    }
    setLoading(false);
  };

  const handleDeleteChild = async (childId: string) => {
    Alert.alert('Delete Child', 'Are you sure you want to remove this child?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await familyService.deleteChild(childId);
          if (error) {
            Alert.alert('Error', 'Could not delete child');
          } else {
            loadProfile();
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Family Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('CreateProfile')}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {family && (
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Family Information</Text>
            <Text style={styles.fieldLabel}>Family Name</Text>
            <Text style={styles.fieldValue}>{family.name}</Text>

            {family.neighborhood && (
              <>
                <Text style={styles.fieldLabel}>Neighborhood</Text>
                <Text style={styles.fieldValue}>{family.neighborhood}</Text>
              </>
            )}

            {family.location_city && (
              <>
                <Text style={styles.fieldLabel}>City</Text>
                <Text style={styles.fieldValue}>{family.location_city}</Text>
              </>
            )}

            {family.bio && (
              <>
                <Text style={styles.fieldLabel}>Bio</Text>
                <Text style={styles.fieldValue}>{family.bio}</Text>
              </>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Children</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddChild', { familyId: family.id })}
              >
                <Text style={styles.addButtonText}>+ Add</Text>
              </TouchableOpacity>
            </View>

            {children.length === 0 ? (
              <Text style={styles.emptyText}>No children added yet</Text>
            ) : (
              children.map((child) => (
                <View key={child.id} style={styles.childCard}>
                  <View style={styles.childInfo}>
                    <Text style={styles.childName}>{child.name}</Text>
                    <Text style={styles.childAge}>
                      Age: {child.age_years} years
                      {child.age_months ? ` ${child.age_months} months` : ''}
                    </Text>
                    {child.school_age_group && (
                      <Text style={styles.childGroup}>{child.school_age_group}</Text>
                    )}
                  </View>
                  <View style={styles.childActions}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('EditChild', { childId: child.id })}
                    >
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteChild(child.id)}>
                      <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      )}
    </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: '#000',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
  childCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  childAge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  childGroup: {
    fontSize: 14,
    color: '#007AFF',
    textTransform: 'capitalize',
  },
  childActions: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  actionText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteText: {
    color: '#FF3B30',
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

