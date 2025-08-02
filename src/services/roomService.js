import { supabase } from '../config/supabaseClient';

class RoomService {
  // Create a new secure room
  async createRoom(roomData) {
    try {
      const { data, error } = await supabase?.rpc('create_secure_room', {
        room_name_param: roomData?.roomName || 'Secure Chat Room',
        room_type_param: roomData?.roomType || 'private',
        encryption_level_param: roomData?.encryptionLevel || 'high',
        is_password_protected_param: roomData?.isPasswordProtected || false,
        password_param: roomData?.customPassword || null,
        max_participants_param: roomData?.maxParticipants || 10,
        duration_minutes_param: roomData?.duration || 30,
        advanced_settings_param: roomData?.advancedSettings || {}
      });

      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      console.error('Error creating room:', error);
      return { data: null, error };
    }
  }

  // Join an existing room
  async joinRoom(roomCode, password = null) {
    try {
      const { data, error } = await supabase?.rpc('join_room', {
        room_code_param: roomCode?.toUpperCase(),
        password_param: password
      });

      if (error) throw error;
      
      const result = data?.[0];
      if (!result?.success) {
        throw new Error(result?.message || 'Failed to join room');
      }

      return { data: result, error: null };
    } catch (error) {
      console.error('Error joining room:', error);
      return { data: null, error };
    }
  }

  // Get room details
  async getRoomDetails(roomId) {
    try {
      const { data, error } = await supabase?.from('secure_rooms')?.select(`
          *,
          creator:user_profiles!creator_id(id, full_name, email),
          participants:room_participants(
            id,
            role,
            joined_at,
            is_active,
            user:user_profiles(id, full_name, email, avatar_url, last_seen)
          )
        `)?.eq('id', roomId)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching room details:', error);
      return { data: null, error };
    }
  }

  // Get user's rooms
  async getUserRooms(userId) {
    try {
      const { data, error } = await supabase?.from('secure_rooms')?.select(`
          *,
          participants:room_participants!inner(user_id, role, is_active)
        `)?.eq('participants.user_id', userId)?.eq('participants.is_active', true)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user rooms:', error);
      return { data: null, error };
    }
  }

  // Leave a room
  async leaveRoom(roomId) {
    try {
      const { error } = await supabase?.from('room_participants')?.update({ 
          is_active: false, 
          left_at: new Date()?.toISOString() 
        })?.eq('room_id', roomId)?.eq('user_id', (await supabase?.auth?.getUser())?.data?.user?.id);

      if (error) throw error;

      // Update participant count
      await supabase?.rpc('decrement_room_participants', { room_id: roomId });

      return { error: null };
    } catch (error) {
      console.error('Error leaving room:', error);
      return { error };
    }
  }

  // Terminate room (creator only)
  async terminateRoom(roomId) {
    try {
      const { error } = await supabase?.from('secure_rooms')?.update({ 
          room_status: 'terminated',
          updated_at: new Date()?.toISOString()
        })?.eq('id', roomId)?.eq('creator_id', (await supabase?.auth?.getUser())?.data?.user?.id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error terminating room:', error);
      return { error };
    }
  }

  // Send message
  async sendMessage(roomId, messageData) {
    try {
      const user = (await supabase?.auth?.getUser())?.data?.user;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase?.from('messages')?.insert([{
          room_id: roomId,
          sender_id: user?.id,
          message_type: messageData?.type || 'text',
          content: messageData?.content || '',
          attachment_url: messageData?.attachmentUrl || null,
          attachment_metadata: messageData?.attachmentMetadata || null,
          reply_to_id: messageData?.replyToId || null
        }])?.select(`
          *,
          sender:user_profiles(id, full_name, email, avatar_url)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error sending message:', error);
      return { data: null, error };
    }
  }

  // Get room messages
  async getRoomMessages(roomId, limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase?.from('messages')?.select(`
          *,
          sender:user_profiles(id, full_name, email, avatar_url),
          reply_to:messages(id, content, sender:user_profiles(full_name))
        `)?.eq('room_id', roomId)?.eq('is_deleted', false)?.order('created_at', { ascending: false })?.range(offset, offset + limit - 1);

      if (error) throw error;
      return { data: data?.reverse() || [], error: null };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return { data: [], error };
    }
  }

  // Subscribe to room messages
  subscribeToRoomMessages(roomId, callback) {
    const channel = supabase?.channel(`room_messages_${roomId}`)?.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          // Fetch complete message data with sender info
          const { data } = await supabase?.from('messages')?.select(`
              *,
              sender:user_profiles(id, full_name, email, avatar_url)
            `)?.eq('id', payload?.new?.id)?.single();

          if (data && callback) {
            callback(data);
          }
        }
      )?.subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }

  // Subscribe to room participant changes
  subscribeToRoomParticipants(roomId, callback) {
    const channel = supabase?.channel(`room_participants_${roomId}`)?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_participants',
          filter: `room_id=eq.${roomId}`
        },
        callback
      )?.subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }
}

export default new RoomService();