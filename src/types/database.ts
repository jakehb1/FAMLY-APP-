/**
 * Database type definitions for Supabase
 * These types match the database schema
 */

export type Family = {
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

export type Child = {
  id: string;
  created_at: string;
  updated_at: string;
  family_id: string;
  name: string;
  age_years: number;
  age_months: number | null;
  interests: string[] | null;
  school_age_group: 'infant' | 'toddler' | 'preschool' | 'elementary' | 'middle' | 'high' | null;
};

export type ConnectionStatus = 'pending' | 'accepted' | 'declined';

export type Connection = {
  id: string;
  created_at: string;
  updated_at: string;
  requester_family_id: string;
  receiver_family_id: string;
  status: ConnectionStatus;
  message: string | null;
};

export type Conversation = {
  id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  family_ids: string[]; // Array of exactly 2 family IDs
};

export type Message = {
  id: string;
  created_at: string;
  conversation_id: string;
  sender_family_id: string;
  content: string;
  read: boolean;
};

export type Event = {
  id: string;
  created_at: string;
  updated_at: string;
  host_family_id: string;
  title: string;
  description: string | null;
  location_name: string | null;
  location_address: string | null;
  location_lat: number | null;
  location_lng: number | null;
  datetime: string;
  age_range_min: number | null;
  age_range_max: number | null;
  max_families: number | null;
  attendees: string[] | null;
  visibility: 'connections_only' | 'neighborhood' | 'public';
  active: boolean;
};


