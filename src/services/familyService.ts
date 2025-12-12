import { supabase } from './supabase';
import { Family, Child } from '../types/database';

export const familyService = {
  // Get or create family profile for current user
  async getOrCreateFamily(userId: string): Promise<Family | null> {
    // Check if family exists
    const { data: existing, error: fetchError } = await supabase
      .from('families')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existing) {
      return existing;
    }

    // Create new family if doesn't exist
    const { data: newFamily, error: createError } = await supabase
      .from('families')
      .insert({
        user_id: userId,
        name: 'My Family',
        location_lat: 0,
        location_lng: 0,
        privacy_radius: 500,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating family:', createError);
      return null;
    }

    return newFamily;
  },

  // Update family profile
  async updateFamily(familyId: string, updates: Partial<Family>) {
    const { data, error } = await supabase
      .from('families')
      .update(updates)
      .eq('id', familyId)
      .select()
      .single();

    return { data, error };
  },

  // Get family by ID
  async getFamily(familyId: string): Promise<Family | null> {
    const { data, error } = await supabase
      .from('families')
      .select('*')
      .eq('id', familyId)
      .single();

    if (error) {
      console.error('Error fetching family:', error);
      return null;
    }

    return data;
  },

  // Get children for a family
  async getChildren(familyId: string): Promise<Child[]> {
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching children:', error);
      return [];
    }

    return data || [];
  },

  // Add a child
  async addChild(familyId: string, childData: Omit<Child, 'id' | 'created_at' | 'updated_at' | 'family_id'>) {
    const { data, error } = await supabase
      .from('children')
      .insert({
        family_id: familyId,
        ...childData,
      })
      .select()
      .single();

    return { data, error };
  },

  // Update a child
  async updateChild(childId: string, updates: Partial<Child>) {
    const { data, error } = await supabase
      .from('children')
      .update(updates)
      .eq('id', childId)
      .select()
      .single();

    return { data, error };
  },

  // Delete a child
  async deleteChild(childId: string) {
    const { error } = await supabase
      .from('children')
      .delete()
      .eq('id', childId);

    return { error };
  },

  // Search families (for discovery)
  async searchFamilies(searchTerm?: string, limit = 20): Promise<Family[]> {
    let query = supabase
      .from('families')
      .select('*')
      .eq('active', true)
      .limit(limit);

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,neighborhood.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching families:', error);
      return [];
    }

    return data || [];
  },
};
