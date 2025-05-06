
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  History
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

export default function Sidebar() {
  const { user, logout, isEmployee, isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    // Using window.location.href instead of useNavigate
    window.location.href = "/login";
  };

  // Mock chat history for demo
  const chatHistory = [
    { id: '1', title: 'Project requirements', timestamp: new Date('2025-05-05T14:30:00') },
    { id: '2', title: 'User authentication flow', timestamp: new Date('2025-05-04T11:15:00') },
    { id: '3', title: 'Database migration', timestamp: new Date('2025-05-03T09:45:00') },
    { id: '4', title: 'API documentation', timestamp: new Date('2025-05-02T15:20:00') },
    { id: '5', title: 'Performance testing', timestamp: new Date('2025-05-01T10:10:00') },
    { id: '6', title: 'Security review', timestamp: new Date('2025-04-30T16:45:00') },
    { id: '7', title: 'Frontend updates', timestamp: new Date('2025-04-29T13:30:00') },
  ];

  return (
    <div
      className={cn(
        "relative h-full bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[250px]"
      )}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 bg-sidebar text-sidebar-foreground rounded-full p-1 shadow-md z-10"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo and title */}
      <div className={cn(
        "flex items-center p-4 mb-2 border-b border-sidebar-border",
        collapsed ? "justify-center" : "justify-start"
      )}>
        <div className="bg-primary/20 rounded-md p-1 h-8 w-8 flex items-center justify-center">
          <span className="font-bold">B</span>
        </div>
        {!collapsed && <h1 className="text-xl font-bold ml-2">BotLLM</h1>}
      </div>

      {/* New Chat Button */}
      <div className="px-2 mb-4">
        <Link to="/chat">
          <Button 
            variant="default" 
            className={cn(
              "w-full", 
              collapsed ? "justify-center px-0" : "justify-start"
            )}
          >
            <MessageSquare size={18} />
            {!collapsed && <span className="ml-2">New Chat</span>}
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="pr-2">
          {/* Chat History - Available for employees and admins */}
          {(isEmployee || isAdmin) && (
            <div className="mb-4">
              {!collapsed && (
                <h2 className="text-sm uppercase tracking-wider opacity-70 px-4 mb-2 flex items-center">
                  <History size={14} className="mr-1" />
                  Chat History
                </h2>
              )}
              <div className="space-y-1 px-2">
                {chatHistory.map((chat) => (
                  <Link
                    key={chat.id}
                    to={`/chat/${chat.id}`}
                    className="flex items-center p-2 rounded-md hover:bg-sidebar-accent group"
                  >
                    <MessageSquare size={18} className="flex-shrink-0" />
                    {!collapsed && (
                      <div className="ml-2 overflow-hidden">
                        <p className="truncate text-sm">{chat.title}</p>
                        <p className="text-xs opacity-70">
                          {chat.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Settings link - Only for admins */}
      {isAdmin && (
        <div className="p-2 border-t border-sidebar-border">
          <Link to="/settings">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start hover:bg-sidebar-accent",
                collapsed && "justify-center p-2"
              )}
            >
              <Settings size={18} />
              {!collapsed && <span className="ml-2">Settings</span>}
            </Button>
          </Link>
        </div>
      )}

      {/* User info and logout */}
      <div className="p-3 border-t border-sidebar-border">
        {!collapsed ? (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span>{user?.name.charAt(0)}</span>
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium truncate">
                  {user?.name}
                </p>
                <p className="text-xs capitalize opacity-70">
                  {user?.role}
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start hover:bg-sidebar-accent">
              <LogOut size={18} />
              <span className="ml-2">Logout</span>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span>{user?.name.charAt(0)}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut size={18} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
