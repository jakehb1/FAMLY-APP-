import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { testSupabaseConnection } from './src/services/testConnection';
import { supabase } from './src/services/supabase';

// #region agent log
// Log immediately when module loads
if (typeof window !== 'undefined') {
  console.log('[DEBUG] App.tsx module loaded', {timestamp: Date.now()});
  fetch('http://127.0.0.1:7244/ingest/68e85477-9b30-4be5-bfea-b298b8a0a150',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:6',message:'App.tsx module loaded in browser',data:{userAgent:typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
}
// #endregion

export default function App() {
  // #region agent log
  console.log('[DEBUG] App.tsx: App component rendering');
  fetch('http://127.0.0.1:7244/ingest/68e85477-9b30-4be5-bfea-b298b8a0a150',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:7',message:'App component rendering',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  const [connectionStatus, setConnectionStatus] = useState<
    'testing' | 'success' | 'error'
  >('testing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tableInfo, setTableInfo] = useState<string>('');

  useEffect(() => {
    // #region agent log
    console.log('[DEBUG] App.tsx: useEffect started');
    fetch('http://127.0.0.1:7244/ingest/68e85477-9b30-4be5-bfea-b298b8a0a150',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:15',message:'useEffect started',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    async function testConnection() {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/68e85477-9b30-4be5-bfea-b298b8a0a150',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:17',message:'testConnection function called',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      try {
        // Test basic connection
        const isConnected = await testSupabaseConnection();
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/68e85477-9b30-4be5-bfea-b298b8a0a150',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:20',message:'testSupabaseConnection result',data:{isConnected},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        
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
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/68e85477-9b30-4be5-bfea-b298b8a0a150',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:49',message:'Error caught in testConnection',data:{errorMessage:error instanceof Error ? error.message : 'Unknown error',errorStack:error instanceof Error ? error.stack : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        setConnectionStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'Unknown error occurred'
        );
        console.error('Connection test error:', error);
      }
    }

    testConnection();
  }, []);

  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/68e85477-9b30-4be5-bfea-b298b8a0a150',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:60',message:'App component returning JSX',data:{connectionStatus},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
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
