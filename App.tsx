import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { testSupabaseConnection } from './src/services/testConnection';
import { supabase } from './src/services/supabase';

export default function App() {
  const [connectionStatus, setConnectionStatus] = useState<
    'testing' | 'success' | 'error'
  >('testing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tableInfo, setTableInfo] = useState<string>('');

  useEffect(() => {
    async function testConnection() {
      try {
        // Test basic connection
        const isConnected = await testSupabaseConnection();
        
        if (isConnected) {
          setConnectionStatus('success');
          
          // Get more info about the database
          const { data: families, error: familiesError } = await supabase
            .from('families')
            .select('id')
            .limit(5);
          
          const { data: children, error: childrenError } = await supabase
            .from('children')
            .select('id')
            .limit(5);
          
          const { data: connections, error: connectionsError } = await supabase
            .from('connections')
            .select('id')
            .limit(5);

          if (!familiesError && !childrenError && !connectionsError) {
            setTableInfo(
              `Families: ${families?.length || 0}, Children: ${children?.length || 0}, Connections: ${connections?.length || 0}`
            );
          }
        } else {
          setConnectionStatus('error');
          setErrorMessage('Failed to connect to Supabase');
        }
      } catch (error) {
        setConnectionStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'Unknown error occurred'
        );
        console.error('Connection test error:', error);
      }
    }

    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FAMLY APP</Text>
      <Text style={styles.subtitle}>Supabase Connection Test</Text>
      
      {connectionStatus === 'testing' && (
        <View style={styles.testingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.testingText}>Testing connection...</Text>
        </View>
      )}

      {connectionStatus === 'success' && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>✅ Connection Successful!</Text>
          <Text style={styles.infoText}>
            Supabase is connected and ready to use.
          </Text>
          {tableInfo && (
            <Text style={styles.tableInfoText}>{tableInfo}</Text>
          )}
        </View>
      )}

      {connectionStatus === 'error' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ Connection Failed</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <Text style={styles.infoText}>
            Check your Supabase configuration in src/services/supabase.ts
          </Text>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  testingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  testingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    minWidth: 280,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  tableInfoText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    minWidth: 280,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 14,
    color: '#C62828',
    textAlign: 'center',
    marginBottom: 8,
  },
});
