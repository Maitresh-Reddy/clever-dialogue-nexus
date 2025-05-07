
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { createClient, User as SupabaseUser } from '@supabase/supabase-js';
import { ALLOWED_EMPLOYEE_DOMAINS, isAdminDomain } from '@/lib/constants';

// Get Supabase credentials with appropriate fallback to prevent the "supabaseUrl is required" error
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create Supabase client with proper error handling
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

// Mock users for demo purposes - will be used as fallback when Supabase is not configured
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
  const isUsingMockData = supabaseUrl === 'https://placeholder-url.supabase.co';

  useEffect(() => {
    // Check for current Supabase session
    const checkSession = async () => {
      try {
        if (isUsingMockData) {
          console.warn('Using mock authentication as Supabase is not properly configured');
          // Try to load from localStorage for demo
          const savedUser = localStorage.getItem('botllm-user');
          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser);
              setUser(parsedUser);
            } catch (error) {
              localStorage.removeItem('botllm-user');
            }
          }
          setIsLoading(false);
          return;
        }

        // Real Supabase auth
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }
        
        if (data?.session?.user) {
          // Get user role from user_profiles table
          const { data: userData, error: userError } = await supabase
            .from('user_profiles')
            .select('id, name, role')
            .eq('id', data.session.user.id)
            .single();
            
          if (userError) {
            console.error('Error getting user data:', userError);
            
            // Handle case where user exists in auth but not in profiles (e.g., invitation)
            if (userError.code === 'PGRST116') {
              // Create user profile for invited user
              const email = data.session.user.email || '';
              const name = data.session.user.user_metadata?.full_name || email.split('@')[0];
              
              const role: UserRole = isAdminDomain(email) ? 'admin' : 'employee';
              
              const { error: insertError } = await supabase
                .from('user_profiles')
                .insert([
                  {
                    id: data.session.user.id,
                    name,
                    role
                  }
                ]);
                
              if (insertError) {
                console.error('Error creating profile for invited user:', insertError);
              } else {
                setUser({
                  id: data.session.user.id,
                  email,
                  name,
                  role
                });
              }
            }
            
            setIsLoading(false);
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
    
    // Set up auth state change listener (only when not using mock data)
    if (!isUsingMockData) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state change:', event);
          
          if (event === 'SIGNED_IN' && session?.user) {
            // Get user role from user_profiles table
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
            } else if (userError && userError.code === 'PGRST116') {
              // Handle invited users or users without profiles
              console.log('Creating profile for user without one');
              
              const email = session.user.email || '';
              const name = session.user.user_metadata?.full_name || email.split('@')[0];
              
              const role: UserRole = isAdminDomain(email) ? 'admin' : 'employee';
              
              const { error: insertError } = await supabase
                .from('user_profiles')
                .insert([
                  {
                    id: session.user.id,
                    name,
                    role
                  }
                ]);
                
              if (insertError) {
                console.error('Error creating profile for user:', insertError);
              } else {
                setUser({
                  id: session.user.id,
                  email,
                  name,
                  role
                });
              }
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
    }
  }, [isUsingMockData]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Check if using mock data
      if (isUsingMockData) {
        console.warn('Using mock authentication as Supabase is not properly configured');
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
      
      // Try Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      if (data.user) {
        toast.success(`Welcome back!`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    // Check if email domain is allowed for employee signup
    if (!ALLOWED_EMPLOYEE_DOMAINS.includes(email.split('@')[1])) {
      toast.error(`Only these email domains are allowed for employee registration: ${ALLOWED_EMPLOYEE_DOMAINS.join(', ')}`);
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Check if using mock data
      if (isUsingMockData) {
        toast.warning('Supabase is not properly configured. Your account will not be permanently saved.');
        
        // Create a mock user for demo purposes
        const newMockUser = {
          id: `mock-${Date.now()}`,
          email,
          name,
          role: 'employee' as UserRole
        };
        
        if (email.includes('@botllm.com')) {
          newMockUser.role = 'admin';
        }
        
        setUser(newMockUser);
        localStorage.setItem('botllm-user', JSON.stringify(newMockUser));
        toast.success('Registration successful! You are now logged in.');
        return true;
      }
      
      // Use Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            full_name: name
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      if (data.user) {
        // The user profile will be automatically created by the database trigger
        // When using email confirmation, we should inform the user
        if (data.session === null) {
          toast.success('Registration successful! Please check your email to confirm your account.');
        } else {
          toast.success('Registration successful! You are now logged in.');
        }
        
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
    if (!isUsingMockData) {
      await supabase.auth.signOut();
    }
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
