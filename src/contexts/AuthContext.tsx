
import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_ENDPOINTS } from '@/config/api';

interface User {
  uid: string;
  email: string;
  displayName?: string;
  token?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    unsubscribe();
  }, []);

  const signup = async (email: string, password: string, displayName: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, displayName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to signup');
      }

      // Create user object with token from response
      const user = {
        uid: data.user?.id || data.user?._id || Date.now().toString(),
        email: email,
        displayName: displayName,
        token: data.token
      };

      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return data;
    } catch (error: any) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      // Create user object with token from response
      const user = {
        uid: data.user?.id || data.user?._id || Date.now().toString(),
        email: email,
        displayName: data.user?.displayName || email.split('@')[0],
        token: data.token
      };

      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return data;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Modified to not use useNavigate
  const logout = async () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    // Navigation should be handled by the component using this function
    return Promise.resolve();
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to request password reset');
      }

      return data;
    } catch (error: any) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
