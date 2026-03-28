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
  };
}

export const authService = {
  /**
   * Sends the Google ID token to the backend for verification and session creation.
   * @param googleToken 
   * @returns 
   */
  async loginWithGoogle(googleToken: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/google`, {
      token: googleToken,
    });
    return response.data;
  },

  /**
   * Stores the JWT token securely.
   * @param token 
   */
  async saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync('userToken', token);
  },

  /**
   * Retrieves the stored JWT token.
   * @returns 
   */
  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('userToken');
  },

  /**
   * Removes the stored JWT token.
   */
  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync('userToken');
  },
};
