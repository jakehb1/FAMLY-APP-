import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { familyService } from '../services/familyService';

interface CreateProfileScreenProps {
  navigation: any;
}

export default function CreateProfileScreen({ navigation }: CreateProfileScreenProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    // Load existing family data if available
    if (user) {
      loadFamilyData();
    }
  }, [user]);

  const loadFamilyData = async () => {
    if (!user) return;

    const family = await familyService.getOrCreateFamily(user.id);
    if (family) {
      setFamilyName(family.name);
      setNeighborhood(family.neighborhood || '');
      setCity(family.location_city || '');
      setZip(family.location_zip || '');
      setBio(family.bio || '');
    }
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }

    if (!familyName.trim()) {
      Alert.alert('Error', 'Family name is required');
      return;
    }

    setLoading(true);
    const family = await familyService.getOrCreateFamily(user.id);

    if (!family) {
      Alert.alert('Error', 'Could not load family profile');
      setLoading(false);
      return;
    }

    const { error } = await familyService.updateFamily(family.id, {
      name: familyName.trim(),
      neighborhood: neighborhood.trim() || null,
      location_city: city.trim() || null,
      location_zip: zip.trim() || null,
      bio: bio.trim() || null,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', 'Could not save profile');
    } else {
      Alert.alert('Success', 'Profile saved!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Profile'),
        },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create Your Family Profile</Text>
      <Text style={styles.subtitle}>Tell other families about yours</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Family Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., The Smith Family"
          value={familyName}
          onChangeText={setFamilyName}
          editable={!loading}
        />

        <Text style={styles.label}>Neighborhood</Text>
        <TextInput
          style={styles.input}
          placeholder="Your neighborhood"
          value={neighborhood}
          onChangeText={setNeighborhood}
          editable={!loading}
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          placeholder="Your city"
          value={city}
          onChangeText={setCity}
          editable={!loading}
        />

        <Text style={styles.label}>ZIP Code</Text>
        <TextInput
          style={styles.input}
          placeholder="ZIP code"
          value={zip}
          onChangeText={setZip}
          keyboardType="numeric"
          editable={!loading}
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Tell other families about your family..."
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Profile</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


