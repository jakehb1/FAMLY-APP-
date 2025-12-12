/**
 * Test Supabase connection
 * This file can be used to verify the Supabase connection is working
 */
import { supabase } from './supabase';

export async function testSupabaseConnection(): Promise<boolean> {
  try {
    // Test connection by querying a simple table
    const { data, error } = await supabase.from('families').select('id').limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }

    console.log('Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    return false;
  }
}


