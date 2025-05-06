
import { useState, useRef, useEffect, FormEvent, useCallback } from 'react';
import { Send, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface FileInfo {
  name: string;
  type: string;
  size: number;
  content?: string | ArrayBuffer | null;
}

export default function ChatInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm BotLLM. How can I help you today?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEmployee = user?.role === 'employee' || user?.role === 'admin';

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleFileSelection = (file: File) => {
    // Check if file type is allowed
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('File type not supported. Please upload PDF, DOCX, TXT, JPG or PNG files.');
      return;
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 10MB.');
      return;
    }
    
    setSelectedFile(file);
    
    // Display file information
    setFileInfo({
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFileInfo(prev => prev ? { ...prev, content: e.target?.result || null } : null);
      }
    };
    
    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Don't send empty messages
    if (!input.trim() && !fileInfo) return;

    // Create a new user message
    if (input.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: input.trim(),
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
    }
    
    // Add file message if there's a file
    if (fileInfo) {
      const fileMessage: Message = {
        id: `file-${Date.now().toString()}`,
        text: fileInfo.type.startsWith('image/') 
          ? `[Uploaded image: ${fileInfo.name}]` 
          : `[Uploaded document: ${fileInfo.name}]`,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fileMessage]);
    }
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate API response
    setTimeout(() => {
      let botResponse = '';
      
      if (fileInfo) {
        // Generate response based on file type
        if (fileInfo.type.startsWith('image/')) {
          botResponse = `I've analyzed the image you uploaded (${fileInfo.name}).\n\nThis appears to be an image file. In a real implementation, I would use AI vision capabilities to analyze the content and provide insights about what's in the image.`;
        } else {
          botResponse = `I've analyzed the document you uploaded (${fileInfo.name}).\n\nHere's a summary of the key points:\n• The document contains information that would be processed by AI\n• In a real implementation, I would extract text and provide meaningful insights\n• You can ask follow-up questions about the content`;
        }
      } else {
        // Generate response based on user input
        botResponse = "Thank you for your message. In a real implementation, this would be processed by an AI model like GPT-4, Gemini Pro, or a locally hosted model via Ollama. The response would be generated based on your specific query.";
      }
      
      const botMessage: Message = {
        id: `bot-${Date.now().toString()}`,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      setSelectedFile(null);
      setFileInfo(null);
    }, 1500);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFileInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message max-w-[80%] ${
              message.sender === 'user' ? 'chat-message-user' : 'chat-message-bot'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.text}</p>
            <div className="text-xs opacity-70 mt-1">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-message chat-message-bot inline-flex items-center space-x-2 max-w-[80%]">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* File upload area for employees */}
      {isEmployee && (
        <>
          {!fileInfo ? (
            <div 
              className={`file-drop-area mx-4 ${isDragging ? 'active' : ''}`} 
              onDragOver={handleDragOver} 
              onDragLeave={handleDragLeave} 
              onDrop={handleDrop}
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag & drop files here, or click to browse
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse files
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between bg-secondary/50 mx-4 p-3 rounded-md">
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {fileInfo.name.split('.').pop()?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{fileInfo.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(fileInfo.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={clearFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
      
      {/* Chat input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          <Button type="submit" size="icon" className="h-[60px] w-[60px]" disabled={isTyping}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
