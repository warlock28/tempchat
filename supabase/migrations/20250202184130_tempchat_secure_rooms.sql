-- Location: supabase/migrations/20250202184130_tempchat_secure_rooms.sql
-- Schema Analysis: Creating new TempChat schema for secure room management
-- Integration Type: Full authentication and room management system
-- Dependencies: auth.users (Supabase auth schema)

-- 1. Create custom types
CREATE TYPE public.user_role AS ENUM ('admin', 'moderator', 'participant');
CREATE TYPE public.room_type AS ENUM ('private', 'games', 'work', 'social', 'study');
CREATE TYPE public.room_status AS ENUM ('active', 'expired', 'terminated', 'suspended');
CREATE TYPE public.message_type AS ENUM ('text', 'image', 'file', 'voice', 'system');
CREATE TYPE public.encryption_level AS ENUM ('standard', 'high', 'maximum');

-- 2. User profiles table (core user table)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role public.user_role DEFAULT 'participant'::public.user_role,
    is_active BOOLEAN DEFAULT true,
    last_seen TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Secure rooms table
CREATE TABLE public.secure_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code TEXT UNIQUE NOT NULL,
    room_name TEXT NOT NULL,
    creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    room_type public.room_type DEFAULT 'private'::public.room_type,
    encryption_level public.encryption_level DEFAULT 'high'::public.encryption_level,
    is_password_protected BOOLEAN DEFAULT false,
    password_hash TEXT,
    max_participants INTEGER DEFAULT 10,
    current_participants INTEGER DEFAULT 0,
    duration_minutes INTEGER DEFAULT 30,
    room_status public.room_status DEFAULT 'active'::public.room_status,
    advanced_settings JSONB DEFAULT '{}',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Room participants table
CREATE TABLE public.room_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.secure_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role public.user_role DEFAULT 'participant'::public.user_role,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(room_id, user_id)
);

-- 5. Messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.secure_rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    message_type public.message_type DEFAULT 'text'::public.message_type,
    content TEXT,
    encrypted_content BYTEA,
    attachment_url TEXT,
    attachment_metadata JSONB,
    reactions JSONB DEFAULT '[]',
    reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Essential indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_secure_rooms_room_code ON public.secure_rooms(room_code);
CREATE INDEX idx_secure_rooms_creator_id ON public.secure_rooms(creator_id);
CREATE INDEX idx_secure_rooms_expires_at ON public.secure_rooms(expires_at);
CREATE INDEX idx_secure_rooms_status ON public.secure_rooms(room_status);
CREATE INDEX idx_room_participants_room_id ON public.room_participants(room_id);
CREATE INDEX idx_room_participants_user_id ON public.room_participants(user_id);
CREATE INDEX idx_messages_room_id ON public.messages(room_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- 7. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secure_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 8. Helper functions for room access control
CREATE OR REPLACE FUNCTION public.is_room_participant(room_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.room_participants rp
    WHERE rp.room_id = room_uuid 
    AND rp.user_id = auth.uid()
    AND rp.is_active = true
)
$$;

CREATE OR REPLACE FUNCTION public.is_room_creator(room_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.secure_rooms sr
    WHERE sr.id = room_uuid 
    AND sr.creator_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.generate_room_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate 15-character alphanumeric code
        code := UPPER(
            SUBSTRING(
                REPLACE(REPLACE(REPLACE(
                    encode(gen_random_bytes(12), 'base64'),
                    '+', ''
                ), '/', ''
            ), '=', ''),
            1, 15
        ));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM public.secure_rooms WHERE room_code = code) INTO code_exists;
        
        IF NOT code_exists THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$;

-- 9. RLS Policies using the 7-pattern system

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for secure_rooms
CREATE POLICY "users_manage_own_secure_rooms"
ON public.secure_rooms
FOR ALL
TO authenticated
USING (creator_id = auth.uid())
WITH CHECK (creator_id = auth.uid());

-- Public read for active rooms (for joining)
CREATE POLICY "public_can_view_active_rooms"
ON public.secure_rooms
FOR SELECT
TO authenticated
USING (room_status = 'active' AND expires_at > NOW());

-- Pattern 2: Simple user ownership for room_participants
CREATE POLICY "users_manage_own_room_participants"
ON public.room_participants
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Room participants can view other participants in same room
CREATE POLICY "participants_can_view_room_members"
ON public.room_participants
FOR SELECT
TO authenticated
USING (public.is_room_participant(room_id));

-- Pattern 7: Complex relationship for messages - Room access control
CREATE POLICY "participants_can_access_room_messages"
ON public.messages
FOR SELECT
TO authenticated
USING (public.is_room_participant(room_id));

CREATE POLICY "participants_can_create_room_messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
    sender_id = auth.uid() 
    AND public.is_room_participant(room_id)
);

CREATE POLICY "users_can_update_own_messages"
ON public.messages
FOR UPDATE
TO authenticated
USING (sender_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "users_can_delete_own_messages"
ON public.messages
FOR DELETE
TO authenticated
USING (sender_id = auth.uid());

-- 10. Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'participant')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. Room management functions
CREATE OR REPLACE FUNCTION public.create_secure_room(
    room_name_param TEXT,
    room_type_param TEXT DEFAULT 'private',
    encryption_level_param TEXT DEFAULT 'high',
    is_password_protected_param BOOLEAN DEFAULT false,
    password_param TEXT DEFAULT NULL,
    max_participants_param INTEGER DEFAULT 10,
    duration_minutes_param INTEGER DEFAULT 30,
    advanced_settings_param JSONB DEFAULT '{}'
)
RETURNS TABLE(
    room_id UUID,
    room_code TEXT,
    room_link TEXT,
    expires_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_room_id UUID;
    new_room_code TEXT;
    password_hash_val TEXT;
    expires_at_val TIMESTAMPTZ;
BEGIN
    -- Generate unique room code
    new_room_code := public.generate_room_code();
    new_room_id := gen_random_uuid();
    expires_at_val := NOW() + (duration_minutes_param || ' minutes')::INTERVAL;
    
    -- Hash password if provided
    IF is_password_protected_param AND password_param IS NOT NULL THEN
        password_hash_val := crypt(password_param, gen_salt('bf', 10));
    END IF;
    
    -- Create room
    INSERT INTO public.secure_rooms (
        id, room_code, room_name, creator_id, room_type, encryption_level,
        is_password_protected, password_hash, max_participants, duration_minutes,
        advanced_settings, expires_at
    ) VALUES (
        new_room_id, new_room_code, room_name_param, auth.uid(), 
        room_type_param::public.room_type, encryption_level_param::public.encryption_level,
        is_password_protected_param, password_hash_val, max_participants_param, 
        duration_minutes_param, advanced_settings_param, expires_at_val
    );
    
    -- Add creator as participant
    INSERT INTO public.room_participants (room_id, user_id, role)
    VALUES (new_room_id, auth.uid(), 'admin'::public.user_role);
    
    -- Update participant count
    UPDATE public.secure_rooms 
    SET current_participants = 1 
    WHERE id = new_room_id;
    
    RETURN QUERY
    SELECT 
        new_room_id,
        new_room_code,
        'https://tempchat.app/room-access-authentication?room=' || new_room_code,
        expires_at_val;
END;
$$;

CREATE OR REPLACE FUNCTION public.join_room(
    room_code_param TEXT,
    password_param TEXT DEFAULT NULL
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    room_id UUID,
    room_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    room_record RECORD;
    user_already_joined BOOLEAN;
BEGIN
    -- Get room details
    SELECT sr.*, up.full_name as creator_name
    INTO room_record
    FROM public.secure_rooms sr
    LEFT JOIN public.user_profiles up ON sr.creator_id = up.id
    WHERE sr.room_code = room_code_param
    AND sr.room_status = 'active'
    AND sr.expires_at > NOW();
    
    IF room_record IS NULL THEN
        RETURN QUERY SELECT false, 'Room not found or expired', NULL::UUID, NULL::TEXT;
        RETURN;
    END IF;
    
    -- Check if room is full
    IF room_record.current_participants >= room_record.max_participants THEN
        RETURN QUERY SELECT false, 'Room is full', NULL::UUID, NULL::TEXT;
        RETURN;
    END IF;
    
    -- Check password if required
    IF room_record.is_password_protected THEN
        IF password_param IS NULL OR NOT crypt(password_param, room_record.password_hash) = room_record.password_hash THEN
            RETURN QUERY SELECT false, 'Invalid password', NULL::UUID, NULL::TEXT;
            RETURN;
        END IF;
    END IF;
    
    -- Check if user already joined
    SELECT EXISTS(
        SELECT 1 FROM public.room_participants 
        WHERE room_id = room_record.id AND user_id = auth.uid() AND is_active = true
    ) INTO user_already_joined;
    
    IF user_already_joined THEN
        RETURN QUERY SELECT true, 'Already joined', room_record.id, room_record.room_name;
        RETURN;
    END IF;
    
    -- Add user as participant
    INSERT INTO public.room_participants (room_id, user_id, role)
    VALUES (room_record.id, auth.uid(), 'participant'::public.user_role)
    ON CONFLICT (room_id, user_id) 
    DO UPDATE SET is_active = true, joined_at = NOW(), left_at = NULL;
    
    -- Update participant count
    UPDATE public.secure_rooms 
    SET current_participants = current_participants + 1 
    WHERE id = room_record.id;
    
    RETURN QUERY SELECT true, 'Successfully joined room', room_record.id, room_record.room_name;
END;
$$;

-- 12. Mock data for testing
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    room_uuid UUID := gen_random_uuid();
    test_room_code TEXT := 'ABC123DEF456GHI';
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@tempchat.app', crypt('TempChat2025!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "TempChat Admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@tempchat.app', crypt('TempChat2025!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Demo User"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create test room
    INSERT INTO public.secure_rooms (
        id, room_code, room_name, creator_id, room_type, encryption_level,
        is_password_protected, password_hash, max_participants, expires_at
    ) VALUES (
        room_uuid, test_room_code, 'Demo Secure Room', admin_uuid, 
        'private'::public.room_type, 'high'::public.encryption_level,
        false, NULL, 10, NOW() + INTERVAL '2 hours'
    );

    -- Add participants
    INSERT INTO public.room_participants (room_id, user_id, role) VALUES
        (room_uuid, admin_uuid, 'admin'::public.user_role),
        (room_uuid, user_uuid, 'participant'::public.user_role);

    -- Update room participant count
    UPDATE public.secure_rooms SET current_participants = 2 WHERE id = room_uuid;

    -- Add sample messages
    INSERT INTO public.messages (room_id, sender_id, message_type, content) VALUES
        (room_uuid, admin_uuid, 'system'::public.message_type, 'Welcome to TempChat! This room is end-to-end encrypted.'),
        (room_uuid, user_uuid, 'text'::public.message_type, 'Hi everyone! This secure room system is working perfectly now.'),
        (room_uuid, admin_uuid, 'text'::public.message_type, 'Great! All authentication and access control features are fully functional.');

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Mock data setup error: %', SQLERRM;
END $$;

-- 13. Cleanup function for testing
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    test_user_ids UUID[];
BEGIN
    -- Get test user IDs
    SELECT ARRAY_AGG(id) INTO test_user_ids
    FROM auth.users
    WHERE email LIKE '%@tempchat.app';

    -- Delete in dependency order
    DELETE FROM public.messages WHERE sender_id = ANY(test_user_ids);
    DELETE FROM public.room_participants WHERE user_id = ANY(test_user_ids);
    DELETE FROM public.secure_rooms WHERE creator_id = ANY(test_user_ids);
    DELETE FROM public.user_profiles WHERE id = ANY(test_user_ids);
    DELETE FROM auth.users WHERE id = ANY(test_user_ids);

    RAISE NOTICE 'Test data cleanup completed';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;