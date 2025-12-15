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
import { familyService } from '../services/familyService';
import { Child } from '../types/database';

const schoolAgeGroups = [
  { label: 'Select age group', value: null },
  { label: 'Infant', value: 'infant' },
  { label: 'Toddler', value: 'toddler' },
  { label: 'Preschool', value: 'preschool' },
  { label: 'Elementary', value: 'elementary' },
  { label: 'Middle School', value: 'middle' },
  { label: 'High School', value: 'high' },
];

export default function EditChildScreen({ navigation, route }: any) {
  const { childId } = route.params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [ageYears, setAgeYears] = useState('');
  const [ageMonths, setAgeMonths] = useState('');
  const [schoolAgeGroup, setSchoolAgeGroup] = useState<string | null>(null);
  const [interests, setInterests] = useState('');

  useEffect(() => {
    loadChild();
  }, []);

  const loadChild = async () => {
    // For now, we'll need to fetch from the children list
    // In a real app, you'd have a getChildById service method
    setLoading(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Child name is required');
      return;
    }

    const years = parseInt(ageYears, 10);
    if (isNaN(years) || years < 0) {
      Alert.alert('Error', 'Please enter a valid age in years');
      return;
    }

    const months = ageMonths ? parseInt(ageMonths, 10) : null;
    if (ageMonths && (isNaN(months!) || months! < 0 || months! >= 12)) {
      Alert.alert('Error', 'Months must be between 0 and 11');
      return;
    }

    setSaving(true);
    const interestsArray = interests
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const { error } = await familyService.updateChild(childId, {
      name: name.trim(),
      age_years: years,
      age_months: months,
      school_age_group: schoolAgeGroup as any,
      interests: interestsArray.length > 0 ? interestsArray : null,
    });

    setSaving(false);

    if (error) {
      Alert.alert('Error', 'Could not update child');
    } else {
      Alert.alert('Success', 'Child updated!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Edit Child</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Child's name"
          value={name}
          onChangeText={setName}
          editable={!saving}
        />

        <Text style={styles.label}>Age (Years) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 5"
          value={ageYears}
          onChangeText={setAgeYears}
          keyboardType="numeric"
          editable={!saving}
        />

        <Text style={styles.label}>Age (Months)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 6 (optional)"
          value={ageMonths}
          onChangeText={setAgeMonths}
          keyboardType="numeric"
          editable={!saving}
        />

        <Text style={styles.label}>School Age Group</Text>
        <View style={styles.pickerContainer}>
          {schoolAgeGroups.map((group) => (
            <TouchableOpacity
              key={group.value || 'none'}
              style={[
                styles.pickerOption,
                schoolAgeGroup === group.value && styles.pickerOptionSelected,
              ]}
              onPress={() => setSchoolAgeGroup(group.value)}
            >
              <Text
                style={[
                  styles.pickerOptionText,
                  schoolAgeGroup === group.value && styles.pickerOptionTextSelected,
                ]}
              >
                {group.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Interests</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., soccer, reading, art (comma separated)"
          value={interests}
          onChangeText={setInterests}
          editable={!saving}
        />

        <TouchableOpacity
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 8,
    overflow: 'hidden',
  },
  pickerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pickerOptionSelected: {
    backgroundColor: '#007AFF',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#000',
  },
  pickerOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
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


