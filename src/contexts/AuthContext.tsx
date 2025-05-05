
import React, { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";

interface User {
  _id: string;
  email: string;
  displayName?: string;
  uid: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Sign up function
  const signup = async (email: string, password: string, name: string): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, displayName: name }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      const user = data.user;
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      
      toast({
        title: "Account created",
        description: "Your account has been successfully created!"
      });
      
      return user;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "Failed to create account"
      });
      throw error;
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      const user = data.user;
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in."
      });
      
      return user;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid credentials"
      });
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      localStorage.removeItem("user");
      setCurrentUser(null);
      
      toast({
        title: "Logged out",
        description: "You've been successfully logged out."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message
      });
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }
      
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for further instructions."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error.message
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
