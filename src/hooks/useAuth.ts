import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginRequest, LoginResponse } from '@/types';
import { authAPI } from '@/services/api';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (credentials: LoginRequest) => {
        try {
          set({ isLoading: true });
          const response: LoginResponse = await authAPI.login(credentials);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Store in localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          toast.success('Login successful!');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.response?.data?.error || 'Login failed');
          throw error;
        }
      },
      
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          toast.success('Logged out successfully');
        }
      },
      
      setUser: (user: User) => {
        set({ user });
      },
      
      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
      },
      
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export const useAuth = () => {
  const auth = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          auth.setToken(token);
          auth.setUser(user);
          
          // Verify token with server
          await authAPI.verifyToken();
        } catch (error) {
          console.error('Token verification failed:', error);
          auth.logout();
        }
      }
      
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  return {
    ...auth,
    isInitialized,
  };
};
