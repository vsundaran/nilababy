import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Platform } from 'react-native';
import { authService, User } from '../services/auth.service';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '';
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';
  const androidReverseClientId = androidClientId.split('.').reverse().join('.');
  const iosReverseClientId = iosClientId.split('.').reverse().join('.');

  const redirectUri = AuthSession.makeRedirectUri({
    native: Platform.OS === 'android' ? `${androidReverseClientId}:/oauthredirect` : `${iosReverseClientId}:/oauthredirect`,
  });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: iosClientId,
    androidClientId: androidClientId,
    redirectUri,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.idToken) {
        handleGoogleLogin(authentication.idToken);
      } else {
        setIsLoading(false);
      }
    } else if (response?.type === 'cancel' || response?.type === 'dismiss' || response?.type === 'error') {
       if (response.type === 'error') {
         console.error('Google Sign-In Error:', response.error);
       }
       setIsLoading(false);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    try {
      setIsLoading(true);
      const res = await authService.loginWithGoogle(idToken);
      if (res.success) {
        await authService.saveTokens(res.data.token, res.data.refreshToken);
        await authService.saveUser(res.data.user);
        setUser(res.data.user);
        router.replace('/chat');
      }
    } catch (error: any) {
      console.error('Google Server Auth Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = await authService.getToken();
      if (token) {
        const userProfile = await authService.getUser();
        if (userProfile) {
          setUser(userProfile);
          router.replace('/chat');
        }
      }
    } catch (error) {
      console.error('Failed to check auth status', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async () => {
    setIsLoading(true);
    try {
      await promptAsync();
      console.log('Sign-In Error:', response);
    } catch (error) {
      console.error('Sign-In Error:', error);
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await authService.removeTokens();
      setUser(null);
      router.replace('/');
    } catch (error) {
      console.error('Sign-Out Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
