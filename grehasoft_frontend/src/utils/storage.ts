// ===============================
// TOKEN STORAGE HELPERS
// ===============================

const ACCESS_KEY = 'grehasoft_access_token';
const REFRESH_KEY = 'grehasoft_refresh_token';

export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_KEY);
};

export const clearStorage = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
