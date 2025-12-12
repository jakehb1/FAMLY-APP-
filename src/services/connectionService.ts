import { supabase } from './supabase';
import { Connection, ConnectionStatus } from '../types/database';

export const connectionService = {
  // Send a connection request
  async sendConnectionRequest(
    requesterFamilyId: string,
    receiverFamilyId: string,
    message?: string
  ) {
    const { data, error } = await supabase
      .from('connections')
      .insert({
        requester_family_id: requesterFamilyId,
        receiver_family_id: receiverFamilyId,
        status: 'pending',
        message: message || null,
      })
      .select()
      .single();

    return { data, error };
  },

  // Get pending requests for a family (where they are the receiver)
  async getPendingRequests(familyId: string): Promise<Connection[]> {
    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .eq('receiver_family_id', familyId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }

    return data || [];
  },

  // Get sent requests (where they are the requester)
  async getSentRequests(familyId: string): Promise<Connection[]> {
    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .eq('requester_family_id', familyId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sent requests:', error);
      return [];
    }

    return data || [];
  },

  // Get accepted connections
  async getConnections(familyId: string): Promise<Connection[]> {
    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .or(`requester_family_id.eq.${familyId},receiver_family_id.eq.${familyId}`)
      .eq('status', 'accepted')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching connections:', error);
      return [];
    }

    return data || [];
  },

  // Accept a connection request
  async acceptConnection(connectionId: string) {
    const { data, error } = await supabase
      .from('connections')
      .update({ status: 'accepted' })
      .eq('id', connectionId)
      .select()
      .single();

    return { data, error };
  },

  // Decline a connection request
  async declineConnection(connectionId: string) {
    const { data, error } = await supabase
      .from('connections')
      .update({ status: 'declined' })
      .eq('id', connectionId)
      .select()
      .single();

    return { data, error };
  },
};

