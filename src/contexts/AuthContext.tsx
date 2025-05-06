
import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_ENDPOINTS } from '@/config/api';

interface AuthContextType {
  currentUser: any;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<any>;
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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = () => {
      const user = localStorage.getItem('user');
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
      setLoading(false);
    };

    unsubscribe();
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH.SIGNUP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to signup');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH.LOGIN}`, {
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

      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return data;
    } catch (error) {
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
      const response = await fetch(`${API_ENDPOINTS.AUTH.RESET_PASSWORD}`, {
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
    } catch (error) {
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
