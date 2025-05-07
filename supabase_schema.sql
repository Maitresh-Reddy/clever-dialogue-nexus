
-- This is a SQL schema for Supabase that needs to be executed in your Supabase SQL editor
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_history table
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES public.chat_history(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- User Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id OR auth.jwt() ->> 'role' = 'admin');

-- Chat History policies
CREATE POLICY "Users can view their own chat history"
  ON public.chat_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat history"
  ON public.chat_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat history"
  ON public.chat_history
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat history"
  ON public.chat_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Chat Messages policies
CREATE POLICY "Users can view messages from their chats"
  ON public.chat_messages
  FOR SELECT
  USING (
    chat_id IN (
      SELECT id FROM public.chat_history
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their chats"
  ON public.chat_messages
  FOR INSERT
  WITH CHECK (
    chat_id IN (
      SELECT id FROM public.chat_history
      WHERE user_id = auth.uid()
    )
  );

-- Create trigger function to handle user creation from auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 
    CASE 
      WHEN NEW.email LIKE '%@botllm.com' THEN 'admin'
      ELSE 'employee'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Ensure emails with admin domain get admin role
CREATE OR REPLACE FUNCTION public.set_admin_for_domain()
RETURNS trigger AS $$
BEGIN
  IF NEW.email LIKE '%@botllm.com' AND NEW.role != 'admin' THEN
    NEW.role := 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for role updates
DROP TRIGGER IF EXISTS ensure_admin_role ON public.user_profiles;
CREATE TRIGGER ensure_admin_role
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_admin_for_domain();
