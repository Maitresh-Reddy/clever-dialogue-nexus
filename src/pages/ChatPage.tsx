
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ChatInterface from "@/components/ChatInterface";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Get Supabase credentials with appropriate fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isUsingMockData = supabaseUrl === 'https://placeholder-url.supabase.co';

  useEffect(() => {
    // If no chat ID is provided, create one (unless using mock data)
    if (!id && !isUsingMockData && user && user.role !== 'customer') {
      const createNewChat = async () => {
        try {
          const { data, error } = await supabase
            .from('chat_history')
            .insert([
              {
                user_id: user?.id,
                title: 'New Conversation',
                created_at: new Date().toISOString()
              }
            ])
            .select();
            
          if (error) {
            toast.error('Failed to create new chat');
            console.error(error);
            return;
          }
          
          if (data && data.length > 0) {
            navigate(`/chat/${data[0].id}`);
          }
        } catch (error) {
          console.error('Error creating new chat:', error);
          toast.error('Something went wrong');
        }
      };
      
      createNewChat();
    }
  }, [id, user, navigate, isUsingMockData]);

  return (
    <Layout>
      <div className="h-full">
        <ChatInterface />
      </div>
    </Layout>
  );
}
