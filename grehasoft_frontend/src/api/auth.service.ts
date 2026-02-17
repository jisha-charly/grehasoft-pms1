import api from './axiosInstance';
import { LoginCredentials, AuthResponse, UserProfile } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('auth/login/', credentials);
    return response.data;
  },

  logout: () => {
    // Logic for blacklisting token on backend can be added here
    return Promise.resolve();
  },

  getCurrentUser: async (): Promise<UserProfile> => {
    const response = await api.get('users/me/');
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.patch('users/me/', data);
    return response.data;
  }
};