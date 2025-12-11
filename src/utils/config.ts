import Constants from 'expo-constants';

/**
 * Environment configuration utility
 * Access environment variables safely across the app
 */
export const config = {
  // API Configuration
  apiUrl: process.env.EXPO_PUBLIC_API_URL || '',
  
  // Backend Service (Supabase)
  supabaseUrl:
    process.env.EXPO_PUBLIC_SUPABASE_URL ||
    'https://szqfjtzktvajgnjqmbbw.supabase.co',
  supabaseAnonKey:
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cWZqdHprdHZhamduanFtYmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTM0MzcsImV4cCI6MjA4MDI2OTQzN30.wGn5N4OmbzmTEqWzbWA0JjGMzTdZFxUfwJIzBc2x2gs',
  
  // App Environment
  appEnv: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  
  // Check if running in development
  isDevelopment: () => {
    return config.appEnv === 'development' || __DEV__;
  },
  
  // Check if running in production
  isProduction: () => {
    return config.appEnv === 'production';
  },
};

