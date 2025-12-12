import { supabase } from './supabase';
import { Conversation, Message } from '../types/database';

export const messagingService = {
  // Get or create a conversation between two families
  async getOrCreateConversation(familyId1: string, familyId2: string): Promise<Conversation | null> {
    // Sort IDs to ensure consistent ordering
    const sortedIds = [familyId1, familyId2].sort();
    
    // Check if conversation exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .contains('family_ids', sortedIds)
      .single();

    if (existing) {
      return existing;
    }

    // Create new conversation
    const { data: newConv, error } = await supabase
      .from('conversations')
      .insert({
        family_ids: sortedIds,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }

    return newConv;
  },

  // Get all conversations for a family
  async getConversations(familyId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .contains('family_ids', [familyId])
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }

    return data || [];
  },

  // Get messages for a conversation
  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data || [];
  },

  // Send a message
  async sendMessage(
    conversationId: string,
    senderFamilyId: string,
    content: string
  ) {
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_family_id: senderFamilyId,
        content: content.trim(),
        read: false,
      })
      .select()
      .single();

    if (messageError) {
      return { data: null, error: messageError };
    }

    // Update conversation last_message_at
    const { error: updateError } = await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);

    return { data: message, error: updateError };
  },

  // Mark messages as read
  async markAsRead(conversationId: string, familyId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_family_id', familyId)
      .eq('read', false);

    return { error };
  },
};

