
import { ReactNode, useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import Sidebar from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { User } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close mobile sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileSidebarOpen(false);
    }
  }, [isMobile]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      if (
        isMobile &&
        mobileSidebarOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node)
      ) {
        setMobileSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, mobileSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - hidden on mobile when closed */}
      {user && (
        <div 
          id="sidebar"
          className={cn(
            "transition-all duration-300 ease-in-out z-30",
            isMobile && "absolute h-full",
            isMobile && !mobileSidebarOpen && "transform -translate-x-full"
          )}
        >
          <Sidebar />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-background border-b border-border h-16 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-2">
            {user && isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              >
                <User size={20} />
              </Button>
            )}
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
                <span className="font-bold">B</span>
              </div>
              <h1 className="text-xl font-bold ml-2">BotLLM</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </header>

        {/* Page content with ScrollArea */}
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            {children}
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
