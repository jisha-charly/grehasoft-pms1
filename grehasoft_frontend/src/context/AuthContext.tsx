import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../api/auth.service';
import { storage } from '../utils/storage';
import { User, LoginCredentials, JWTPayload, UserRole } from '../types/auth';

/**
 * AuthContext Interface
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfileState: (updatedUser: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Helper: Extract User Info from JWT
   * Decodes the payload to get immediate Role and Department data
   */
  const getUserFromToken = useCallback((token: string): Partial<User> | null => {
    try {
      const decoded: JWTPayload = jwtDecode(token);
      // Logic to check if token is expired
      if (decoded.exp * 1000 < Date.now()) return null;

      return {
        id: decoded.user_id,
        email: decoded.email,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        full_name: `${decoded.first_name} ${decoded.last_name}`,
        role: decoded.role as UserRole,
        // Department is stored as a slug in JWT for routing, 
        // full details fetched later if needed
        department: decoded.department ? { id: 0, name: decoded.department } : null 
      };
    } catch (error) {
      return null;
    }
  }, []);

  /**
   * Initialize Auth State on Mount
   */
  const initializeAuth = useCallback(async () => {
    const accessToken = storage.getAccessToken();
    
    if (accessToken) {
      const userFromToken = getUserFromToken(accessToken);
      
      if (userFromToken) {
        // Optimistically set user from JWT for instant UI rendering
        setUser(userFromToken as User);
        setIsAuthenticated(true);

        // Then, fetch fresh profile data from the server for data integrity
        try {
          const freshUser = await authService.getCurrentUser();
          setUser(freshUser);
        } catch (err) {
          // If 401, Axios interceptor handles the refresh. 
          // If both fail, logout is triggered.
          console.error("Session sync failed, relying on JWT claims.");
        }
      } else {
        storage.clearStorage();
      }
    }
    setLoading(false);
  }, [getUserFromToken]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * Login Handler
   */
  const login = async (credentials: LoginCredentials) => {
    const data = await authService.login(credentials);
    storage.setTokens(data.access, data.refresh);
    
    // Immediately fetch full profile after successful login
    const freshUser = await authService.getCurrentUser();
    setUser(freshUser);
    setIsAuthenticated(true);
  };

  /**
   * Logout Handler
   */
  const logout = useCallback(() => {
    authService.logout();
    storage.clearStorage();
    setUser(null);
    setIsAuthenticated(false);
    // Explicit redirect to login is usually handled by the Router, 
    // but clearing state here triggers the PrivateRoute redirect.
  }, []);

  /**
   * Manual Profile State Update
   * Used when a user updates their own info in the Profile page
   */
  const updateProfileState = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateProfileState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};