
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

export type UserRole = 'customer' | 'employee' | 'admin';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setCustomerRole: () => void;
  isCustomer: boolean;
  isEmployee: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers = [
  {
    id: '1',
    email: 'admin@botllm.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as UserRole
  },
  {
    id: '2',
    email: 'employee@botllm.com',
    password: 'employee123',
    name: 'Employee User',
    role: 'employee' as UserRole
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('botllm-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse saved user', error);
        localStorage.removeItem('botllm-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    setIsLoading(true);
    
    try {
      // For demo, just match against mock data
      const matchedUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (matchedUser) {
        const { password: _, ...userWithoutPassword } = matchedUser;
        setUser(userWithoutPassword);
        localStorage.setItem('botllm-user', JSON.stringify(userWithoutPassword));
        toast.success(`Welcome back, ${userWithoutPassword.name}!`);
        return true;
      } else {
        toast.error('Invalid email or password');
        return false;
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('botllm-user');
    toast.info('You have been logged out');
  };

  const setCustomerRole = () => {
    const customerUser = {
      id: 'guest',
      email: 'guest@botllm.com',
      name: 'Guest User',
      role: 'customer' as UserRole
    };
    setUser(customerUser);
    localStorage.setItem('botllm-user', JSON.stringify(customerUser));
    toast.success('Welcome! You are now using BotLLM as a customer.');
  };

  const isCustomer = user?.role === 'customer';
  const isEmployee = user?.role === 'employee';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        setCustomerRole,
        isCustomer,
        isEmployee,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
