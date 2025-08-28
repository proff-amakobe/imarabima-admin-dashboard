import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest,
  Product,
  CreateProductRequest,
  Policy,
  CreatePolicyRequest,
  LoginRequest,
  LoginResponse,
  DashboardStats,
  ApiResponse,
  PaginatedResponse
} from '@/types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  verifyToken: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/verify');
    return response.data.data!;
  },
};

// Users API
export const usersAPI = {
  getAll: async (page = 1, limit = 10, search = ''): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>('/users', {
      params: { page, limit, search },
    });
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data!;
  },

  create: async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/users/register', userData);
    return response.data.data!;
  },

  update: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  toggleStatus: async (id: string): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}/toggle-status`);
    return response.data.data!;
  },
};

// Products API
export const productsAPI = {
  getAll: async (type?: string): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>('/products', {
      params: { type },
    });
    return response.data.data!;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data!;
  },

  create: async (productData: CreateProductRequest): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>('/products', productData);
    return response.data.data!;
  },

  update: async (id: string, productData: Partial<CreateProductRequest>): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, productData);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  toggleStatus: async (id: string): Promise<Product> => {
    const response = await api.patch<ApiResponse<Product>>(`/products/${id}/toggle-status`);
    return response.data.data!;
  },
};

// Policies API
export const policiesAPI = {
  getAll: async (page = 1, limit = 10, status?: string): Promise<PaginatedResponse<Policy>> => {
    const response = await api.get<PaginatedResponse<Policy>>('/policies', {
      params: { page, limit, status },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Policy> => {
    const response = await api.get<ApiResponse<Policy>>(`/policies/${id}`);
    return response.data.data!;
  },

  create: async (policyData: CreatePolicyRequest): Promise<Policy> => {
    const response = await api.post<ApiResponse<Policy>>('/policies', policyData);
    return response.data.data!;
  },

  update: async (id: string, policyData: Partial<CreatePolicyRequest>): Promise<Policy> => {
    const response = await api.put<ApiResponse<Policy>>(`/policies/${id}`, policyData);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/policies/${id}`);
  },

  updateStatus: async (id: string, status: Policy['status']): Promise<Policy> => {
    const response = await api.patch<ApiResponse<Policy>>(`/policies/${id}/status`, { status });
    return response.data.data!;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data.data!;
  },

  getRevenueData: async (): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>('/dashboard/revenue');
    return response.data.data!;
  },

  getPolicyStatusData: async (): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>('/dashboard/policy-status');
    return response.data.data!;
  },
};

export default api;
