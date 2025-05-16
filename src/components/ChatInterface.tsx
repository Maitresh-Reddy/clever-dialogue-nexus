import { useState, useEffect, FormEvent, KeyboardEvent } from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Send, FileText, Paperclip } from "lucide-react";
import { toast } from "sonner";
import FileUpload from "@/components/FileUpload";
import { documentService } from "@/services/documentService";

// Get Supabase credentials with appropriate fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for chat messages
interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  attachment?: {
    type: "document" | "image";
    content: string;
  };
}

export default function ChatInterface() {
  const { id: chatId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatTitle, setChatTitle] = useState("New Conversation");
  const isUsingMockData = supabaseUrl === 'https://placeholder-url.supabase.co';
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [documentContext, setDocumentContext] = useState<string | null>(null);

  // Load messages for the current chat
  useEffect(() => {
    const loadMessages = async () => {
      if (!chatId) return;

      setIsLoading(true);
      
      try {
        if (isUsingMockData) {
          // If using mock data, set some example messages
          const mockMessages: Message[] = [];
          if (chatId === "1") {
            mockMessages.push(
              {
                id: "m1",
                role: "user",
                content: "What are the project requirements for the new customer portal?",
                timestamp: new Date("2025-05-05T14:30:00")
              },
              {
                id: "m2",
                role: "assistant",
                content: "The requirements include user authentication, dashboard with analytics, support ticket system, and payment integration. Would you like me to elaborate on any specific aspect?",
                timestamp: new Date("2025-05-05T14:31:00")
              }
            );
            setChatTitle("Project requirements");
          } else if (chatId === "2") {
            mockMessages.push(
              {
                id: "m3",
                role: "user",
                content: "How should we handle the user authentication flow?",
                timestamp: new Date("2025-05-04T11:15:00")
              },
              {
                id: "m4",
                role: "assistant",
                content: "I recommend implementing OAuth 2.0 with JWT tokens for secure authentication. We should include email verification, password recovery, and role-based access control.",
                timestamp: new Date("2025-05-04T11:16:00")
              }
            );
            setChatTitle("User authentication flow");
          } else {
            // Default welcome message for new chats
            mockMessages.push({
              id: "welcome",
              role: "assistant", 
              content: "How can I help you today?",
              timestamp: new Date()
            });
          }
          setMessages(mockMessages);
          return;
        }
        
        // Fetch chat data to get the title
        const { data: chatData, error: chatError } = await supabase
          .from('chat_history')
          .select('title')
          .eq('id', chatId)
          .single();
          
        if (!chatError && chatData) {
          setChatTitle(chatData.title);
        }
        
        // Fetch messages for this chat
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('timestamp', { ascending: true });
          
        if (error) {
          console.error('Error fetching messages:', error);
          toast.error('Failed to load messages');
          return;
        }
        
        if (data && data.length > 0) {
          setMessages(data.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        } else {
          // Add a welcome message for new chats
          const welcomeMessage = {
            id: "welcome",
            role: "assistant" as "assistant", 
            content: "How can I help you today?",
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);
          
          // If this is a real chat in Supabase, save the welcome message
          if (!isUsingMockData && chatId) {
            await supabase
              .from('chat_messages')
              .insert([{
                chat_id: chatId,
                role: "assistant",
                content: welcomeMessage.content,
                timestamp: welcomeMessage.timestamp.toISOString()
              }]);
          }
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
  }, [chatId, isUsingMockData]);

  // Process user input and generate assistant response
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Save user message to Supabase if we have a real chat ID
      if (!isUsingMockData && chatId) {
        await supabase
          .from('chat_messages')
          .insert([{
            chat_id: chatId,
            role: "user",
            content: userMessage.content,
            timestamp: userMessage.timestamp.toISOString()
          }]);
          
        // Update chat title if this is a new conversation
        if (chatTitle === "New Conversation" && userMessage.content.length > 0) {
          const newTitle = userMessage.content.slice(0, 30) + (userMessage.content.length > 30 ? "..." : "");
          await supabase
            .from('chat_history')
            .update({ title: newTitle })
            .eq('id', chatId);
          
          setChatTitle(newTitle);
        }
      }
      
      let response: string;
      
      // If we have document context and the question seems related to it,
      // use document service to answer the question
      if (documentContext) {
        response = await documentService.analyzeQuestion(input, documentContext);
      } else {
        // Use the regular mock response for non-document questions
        response = generateMockResponse(userMessage.content);
      }
      
      // Create assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Save assistant message to Supabase if we have a real chat ID
      if (!isUsingMockData && chatId) {
        await supabase
          .from('chat_messages')
          .insert([{
            chat_id: chatId,
            role: "assistant",
            content: assistantMessage.content,
            timestamp: assistantMessage.timestamp.toISOString()
          }]);
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press events for textarea
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit form when Enter is pressed without Shift key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid new line
      handleSubmit(e as unknown as FormEvent);
    }
  };
  
  // Generate mock response for demo purposes
  const generateMockResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      return "Hello! How can I assist you today?";
    } else if (lowerInput.includes("help") || lowerInput.includes("support")) {
      return "I'm here to help! Please let me know what you need assistance with.";
    } else if (lowerInput.includes("feature") || lowerInput.includes("can you")) {
      return "That's a great question. I can help with information about our products, troubleshoot issues, provide technical support, and much more. What specific feature are you interested in?";
    } else if (lowerInput.includes("error") || lowerInput.includes("issue") || lowerInput.includes("problem")) {
      return "I'm sorry to hear you're experiencing an issue. Could you please provide more details about the error you're seeing? Screenshots or error messages would be helpful.";
    } else if (lowerInput.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?";
    } else if (lowerInput.includes("bye") || lowerInput.includes("goodbye")) {
      return "Goodbye! Feel free to come back if you have any more questions.";
    }
    
    // Default response if no patterns match
    return "Thank you for your message. As a support assistant, I'm here to help with any questions or issues you might have. Could you provide more details about what you're looking for?";
  };

  // Handle file processing
  const handleFileProcessed = (summary: string) => {
    setShowFileUpload(false);
    setDocumentContext(summary);

    // Create a system message with the document summary
    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      role: "system",
      content: "Document uploaded and processed successfully.",
      timestamp: new Date(),
      attachment: {
        type: "document",
        content: summary
      }
    };
    
    setMessages(prev => [...prev, systemMessage]);
    
    // Create assistant message with summary
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: `I've analyzed your document. Here's a summary:\n\n${summary}\n\nYou can ask me questions about this document.`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    
    // Save messages to Supabase if we have a real chat ID
    if (!isUsingMockData && chatId) {
      Promise.all([
        supabase
          .from('chat_messages')
          .insert([{
            chat_id: chatId,
            role: "system",
            content: systemMessage.content,
            timestamp: systemMessage.timestamp.toISOString(),
            metadata: { attachment: systemMessage.attachment }
          }]),
        supabase
          .from('chat_messages')
          .insert([{
            chat_id: chatId,
            role: "assistant",
            content: assistantMessage.content,
            timestamp: assistantMessage.timestamp.toISOString()
          }])
      ]).catch(error => {
        console.error('Error saving document messages:', error);
      });
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto px-4">
      {/* Chat header */}
      <div className="mb-4 pt-6">
        <h1 className="text-2xl font-bold">{chatTitle}</h1>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4 rounded-lg p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "assistant" ? "justify-start" : 
              message.role === "system" ? "justify-center" : "justify-end"
            }`}
          >
            {message.role === "assistant" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src="/bot-avatar.png" alt="Bot" />
                <AvatarFallback className="bg-primary/20">B</AvatarFallback>
              </Avatar>
            )}
            
            <Card
              className={`p-3 ${
                message.role === "assistant"
                  ? "bg-muted max-w-[80%]"
                  : message.role === "system"
                  ? "bg-secondary text-secondary-foreground max-w-[90%]"
                  : "bg-primary text-primary-foreground max-w-[80%]"
              }`}
            >
              <div className="space-y-1">
                {message.attachment && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b">
                    <FileText className="h-4 w-4" />
                    <span className="text-xs font-medium">Document Processed</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </Card>
            
            {message.role === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/20">B</AvatarFallback>
            </Avatar>
            <Card className="p-3 max-w-[80%] bg-muted">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
                <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </Card>
          </div>
        )}
        
        {showFileUpload && (
          <div className="mx-auto max-w-lg w-full">
            <FileUpload 
              onFileProcessed={handleFileProcessed} 
              disabled={isLoading} 
            />
          </div>
        )}
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={() => setShowFileUpload(!showFileUpload)}
              disabled={isLoading}
              title="Upload document"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Textarea
              placeholder="Type your message or ask about uploaded documents..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="resize-none min-h-[80px]"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="h-[80px] w-[80px]"
              disabled={isLoading || !input.trim()}
            >
              <Send />
            </Button>
          </div>
          {documentContext && (
            <div className="text-xs text-muted-foreground ml-11">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Document context is active. Ask questions about your uploaded document.
              </span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
