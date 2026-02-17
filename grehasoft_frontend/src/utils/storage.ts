/**
 * Grehasoft Storage Utility
 * Handles persistent storage of JWT tokens and session data.
 */

const PREFIX = 'grehasoft_';
const ACCESS_TOKEN_KEY = `${PREFIX}access_token`;
const REFRESH_TOKEN_KEY = `${PREFIX}refresh_token`;
const USER_DATA_KEY = `${PREFIX}user_data`;

export const storage = {
  // Access Token
  getAccessToken: (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string): void => localStorage.setItem(ACCESS_TOKEN_KEY, token),

  // Refresh Token
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string): void => localStorage.setItem(REFRESH_TOKEN_KEY, token),

  // Bulk Token Update
  setTokens: (access: string, refresh: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },

  // User Metadata (Cached for UI snappiness)
  getUser: (): any | null => {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  },
  setUser: (userData: any): void => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  },

  // Clear Session
  clearStorage: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  },
};

// Direct exports for convenience in interceptors
export const getAccessToken = storage.getAccessToken;
export const getRefreshToken = storage.getRefreshToken;
export const setTokens = storage.setTokens;
export const clearStorage = storage.clearStorage;