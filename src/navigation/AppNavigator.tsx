import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateProfileScreen from '../screens/CreateProfileScreen';
import AddChildScreen from '../screens/AddChildScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import ConnectionsScreen from '../screens/ConnectionsScreen';
import SendConnectionScreen from '../screens/SendConnectionScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import EditChildScreen from '../screens/EditChildScreen';
import Logo from '../components/Logo';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerTitle: () => <Logo size="small" />,
        }}
      >
        {session ? (
          // User is signed in - authenticated screens
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen
              name="CreateProfile"
              component={CreateProfileScreen}
              options={{ title: 'Edit Profile' }}
            />
            <Stack.Screen
              name="AddChild"
              component={AddChildScreen}
              options={{ title: 'Add Child' }}
            />
            <Stack.Screen
              name="EditChild"
              component={EditChildScreen}
              options={{ title: 'Edit Child' }}
            />
            <Stack.Screen name="Discover" component={DiscoverScreen} />
            <Stack.Screen name="Connections" component={ConnectionsScreen} />
            <Stack.Screen
              name="SendConnection"
              component={SendConnectionScreen}
              options={{ title: 'Send Connection Request' }}
            />
            <Stack.Screen name="ChatList" component={ChatListScreen} />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{ title: 'Chat' }}
            />
          </>
        ) : (
          // User is not signed in - auth screens
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

