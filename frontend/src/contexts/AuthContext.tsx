'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, LoginCredentials } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, mfaCode?: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  kolegiumId?: string;
  phone?: string;
  nik?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            // Try to verify token and get user data using authService
            const userData = await authService.getProfile();
            setUser(userData);
            setIsAuthenticated(true);
          } catch (apiError) {
            // API call failed, fall back to localStorage user (for demo/offline mode)
            console.warn('API not available, using cached user:', apiError);
            const cachedUser = localStorage.getItem('user');
            if (cachedUser) {
              try {
                const parsedUser = JSON.parse(cachedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
              } catch (parseError) {
                // Invalid cached data, clear everything
                localStorage.removeItem('token');
                localStorage.removeItem('user');
              }
            } else {
              // No cached user, remove token
              localStorage.removeItem('token');
            }
          }
        } else {
          // No token, user is not authenticated
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, mfaCode?: string) => {
    setIsLoading(true);
    try {
      // Use authService to login
      const loginData = await authService.login({ email, password });

      // Set user from login response (cast to User type as login response has subset of User fields)
      setUser(loginData.user as User);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      // Use authService to register (when implemented)
      // For now, this is a placeholder
      console.log('Registration successful:', userData);
      // TODO: Implement register endpoint in authService
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshToken = async () => {
    try {
      // Token refresh will be handled by API interceptor in authService
      // This is mainly for manual refresh if needed
      const userData = await authService.getProfile();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      // TODO: Implement email verification endpoint in authService
      console.log('Email verification:', token);
      // Return void as per interface
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken,
    verifyEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};