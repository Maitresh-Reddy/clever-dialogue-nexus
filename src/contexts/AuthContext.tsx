
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes - will be replaced by Supabase
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

// Helper to check if email domain is allowed for employees
const isAllowedDomain = (email: string) => {
  const allowedDomains = ['botllm.com', 'company.com']; // Add your allowed domains
  const domain = email.split('@')[1];
  return allowedDomains.includes(domain);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for current Supabase session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        
        if (data?.session?.user) {
          // Get user role from user_roles table
          const { data: userData, error: userError } = await supabase
            .from('user_profiles')
            .select('id, name, role')
            .eq('id', data.session.user.id)
            .single();
            
          if (userError) {
            console.error('Error getting user data:', userError);
            return;
          }
          
          if (userData) {
            setUser({
              id: userData.id,
              email: data.session.user.email || '',
              name: userData.name,
              role: userData.role as UserRole
            });
          }
        }
      } catch (error) {
        console.error('Error in session check:', error);
        
        // Fallback to localStorage for demo
        const savedUser = localStorage.getItem('botllm-user');
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
          } catch (error) {
            localStorage.removeItem('botllm-user');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Get user role from user_roles table
          const { data: userData, error: userError } = await supabase
            .from('user_profiles')
            .select('id, name, role')
            .eq('id', session.user.id)
            .single();
            
          if (!userError && userData) {
            setUser({
              id: userData.id,
              email: session.user.email || '',
              name: userData.name,
              role: userData.role as UserRole
            });
            localStorage.setItem('botllm-user', JSON.stringify({
              id: userData.id,
              email: session.user.email || '',
              name: userData.name,
              role: userData.role
            }));
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('botllm-user');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Try Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // Fallback to mock users for demo
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
      }
      
      if (data.user) {
        toast.success(`Welcome back!`);
        return true;
      }
      
      return false;
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    // Check if email domain is allowed for employee signup
    if (!isAllowedDomain(email)) {
      toast.error('Only company email domains are allowed for employee registration');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      if (data.user) {
        // Create user profile with 'employee' role
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: data.user.id,
              name,
              role: 'employee'
            }
          ]);
        
        if (profileError) {
          toast.error('Error creating user profile');
          return false;
        }
        
        toast.success('Registration successful! Please sign in.');
        return true;
      }
      
      return false;
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
        isAdmin,
        signUp
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
