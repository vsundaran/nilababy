import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh`, { token: refreshToken });
          if (res.data.success) {
            const newAccessToken = res.data.data.accessToken;
            const newRefreshToken = res.data.data.refreshToken;
            await SecureStore.setItemAsync('userToken', newAccessToken);
            await SecureStore.setItemAsync('refreshToken', newRefreshToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
           await SecureStore.deleteItemAsync('userToken');
           await SecureStore.deleteItemAsync('refreshToken');
           await SecureStore.deleteItemAsync('userProfile');
           // the AuthContext or root routing should re-evaluate to trigger signout
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async loginWithGoogle(googleToken: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/google`, {
      token: googleToken,
    });
    return response.data;
  },

  async saveTokens(token: string, refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync('userToken', token);
    if (refreshToken) await SecureStore.setItemAsync('refreshToken', refreshToken);
  },

  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('userToken');
  },

  async removeTokens(): Promise<void> {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('userProfile');
  },

  async saveUser(user: User): Promise<void> {
    await SecureStore.setItemAsync('userProfile', JSON.stringify(user));
  },

  async getUser(): Promise<User | null> {
    const userStr = await SecureStore.getItemAsync('userProfile');
    return userStr ? JSON.parse(userStr) : null;
  },
};
