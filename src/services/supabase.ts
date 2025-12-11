import { createClient } from '@supabase/supabase-js';
import { config } from '../utils/config';

// Supabase configuration
const supabaseUrl = config.supabaseUrl || 'https://szqfjtzktvajgnjqmbbw.supabase.co';
const supabaseAnonKey =
  config.supabaseAnonKey ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cWZqdHprdHZhamduanFtYmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTM0MzcsImV4cCI6MjA4MDI2OTQzN30.wGn5N4OmbzmTEqWzbWA0JjGMzTdZFxUfwJIzBc2x2gs';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types (will be generated later, but basic structure)
export type Database = {
  public: {
    Tables: {
      families: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          name: string;
          neighborhood: string | null;
          location_lat: number;
          location_lng: number;
          location_city: string | null;
          location_zip: string | null;
          bio: string | null;
          photo_url: string | null;
          interests: string[] | null;
          verified: boolean;
          phone_verified: boolean;
          privacy_radius: number;
          active: boolean;
        };
      };
      children: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          family_id: string;
          name: string;
          age_years: number;
          age_months: number | null;
          interests: string[] | null;
          school_age_group: string | null;
        };
      };
      connections: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          requester_family_id: string;
          receiver_family_id: string;
          status: 'pending' | 'accepted' | 'declined';
          message: string | null;
        };
      };
      conversations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          last_message_at: string;
          family_ids: string[];
        };
      };
      messages: {
        Row: {
          id: string;
          created_at: string;
          conversation_id: string;
          sender_family_id: string;
          content: string;
          read: boolean;
        };
      };
    };
  };
};

