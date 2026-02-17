import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../api/auth.service';
import { getAccessToken, setTokens, clearStorage } from '../utils/storage';
import { UserProfile, LoginCredentials } from '../types/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on refresh
  useEffect(() => {
    const initialize = async () => {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await authService.getCurrentUser();
        setUser(profile);
      } catch (error) {
        clearStorage();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);

    setTokens(response.access, response.refresh);

    const profile = await authService.getCurrentUser();
    setUser(profile);
  };

  const logout = () => {
    clearStorage();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
