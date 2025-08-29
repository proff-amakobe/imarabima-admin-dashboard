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

// Mock data for when API is not accessible
const mockData = {
  users: [
    {
      id: '1',
      name: 'John Doe',
      phone_number: '+254700123456',
      national_id: '12345678',
      role: 'customer' as const,
      status: 'active',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone_number: '+254700123457',
      national_id: '87654321',
      role: 'agent' as const,
      status: 'active',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ],
  products: [
    {
      id: '1',
      name: 'Funeral Cover',
      type: 'funeral' as const,
      description: 'Comprehensive funeral insurance coverage',
      base_premium: 500,
      premium_amount: 500,
      min_sum_assured: 10000,
      max_sum_assured: 100000,
      sum_assured: 50000,
      age_limit_min: 18,
      age_limit_max: 65,
      waiting_period_days: 30,
      is_active: true,
      terms_and_conditions: 'Standard terms apply',
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Boda Boda Insurance',
      type: 'boda_boda' as const,
      description: 'Motorcycle insurance for boda boda operators',
      base_premium: 300,
      premium_amount: 300,
      min_sum_assured: 5000,
      max_sum_assured: 50000,
      sum_assured: 30000,
      age_limit_min: 18,
      age_limit_max: 60,
      waiting_period_days: 7,
      is_active: true,
      terms_and_conditions: 'Standard terms apply',
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ],
  policies: [
    {
      id: '1',
      user_id: '1',
      product_id: '1',
      policy_number: 'POL001',
      premium_amount: 500,
      sum_assured: 50000,
      payment_frequency: 'monthly' as const,
      status: 'active' as const,
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      next_payment_date: '2024-02-01',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ],
  stats: {
    totalUsers: 150,
    totalPolicies: 89,
    totalProducts: 2,
    totalRevenue: 44500,
    activePolicies: 67,
    pendingPolicies: 12,
    expiredPolicies: 10,
    monthlyGrowth: 15,
    monthlyRevenue: 44500,
    userGrowth: 12
  }
};

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'https://imarabima-platform-fitpf2zz6-proff-amakobes-projects.vercel.app',
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

// Response interceptor to handle errors and fallback to mock data
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // If API is not accessible, we'll handle it in individual API calls
    console.warn('API Error:', error.message);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Fallback to mock login for testing
      console.warn('Using mock login due to API unavailability');
      if (credentials.phone_number === '+254700123458' && credentials.password === 'admin123') {
        const mockUser = mockData.users.find(u => u.phone_number === credentials.phone_number);
        return {
          user: mockUser!,
          token: 'mock-jwt-token',
          message: 'Login successful (mock)'
        };
      }
      throw new Error('Invalid credentials');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Using mock logout');
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  verifyToken: async (): Promise<User> => {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/verify');
      return response.data.data!;
    } catch (error) {
      // Fallback to mock user
      console.warn('Using mock user verification');
      return mockData.users[0];
    }
  },
};

// Users API
export const usersAPI = {
  getAll: async (page = 1, limit = 10, search = ''): Promise<PaginatedResponse<User>> => {
    try {
      const response = await api.get<PaginatedResponse<User>>('/users', {
        params: { page, limit, search },
      });
      return response.data;
    } catch (error) {
      // Fallback to mock data
      console.warn('Using mock users data');
      return {
        data: mockData.users,
        total: mockData.users.length,
        page,
        limit,
        totalPages: 1
      };
    }
  },

  getById: async (id: string): Promise<User> => {
    try {
      const response = await api.get<ApiResponse<User>>(`/users/${id}`);
      return response.data.data!;
    } catch (error) {
      const mockUser = mockData.users.find(u => u.id === id);
      if (!mockUser) throw new Error('User not found');
      return mockUser;
    }
  },

  create: async (userData: CreateUserRequest): Promise<User> => {
    try {
      const response = await api.post<ApiResponse<User>>('/users/register', userData);
      return response.data.data!;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  },

  update: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    try {
      const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
      return response.data.data!;
    } catch (error) {
      throw new Error('Failed to update user');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  },

  toggleStatus: async (id: string): Promise<User> => {
    try {
      const response = await api.patch<ApiResponse<User>>(`/users/${id}/toggle-status`);
      return response.data.data!;
    } catch (error) {
      throw new Error('Failed to toggle user status');
    }
  },
};

// Products API
export const productsAPI = {
  getAll: async (type?: string): Promise<Product[]> => {
    try {
      const response = await api.get<ApiResponse<Product[]>>('/products', {
        params: { type },
      });
      return response.data.data!;
    } catch (error) {
      // Fallback to mock data
      console.warn('Using mock products data');
      return mockData.products;
    }
  },

  getById: async (id: string): Promise<Product> => {
    try {
      const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
      return response.data.data!;
    } catch (error) {
      const mockProduct = mockData.products.find(p => p.id === id);
      if (!mockProduct) throw new Error('Product not found');
      return mockProduct;
    }
  },

  create: async (productData: CreateProductRequest): Promise<Product> => {
    try {
      const response = await api.post<ApiResponse<Product>>('/products', productData);
      return response.data.data!;
    } catch (error) {
      throw new Error('Failed to create product');
    }
  },

  update: async (id: string, productData: Partial<CreateProductRequest>): Promise<Product> => {
    try {
      const response = await api.put<ApiResponse<Product>>(`/products/${id}`, productData);
      return response.data.data!;
    } catch (error) {
      throw new Error('Failed to update product');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      throw new Error('Failed to delete product');
    }
  },

  toggleStatus: async (id: string): Promise<Product> => {
    try {
      const response = await api.patch<ApiResponse<Product>>(`/products/${id}/toggle-status`);
      return response.data.data!;
    } catch (error) {
      throw new Error('Failed to toggle product status');
    }
  },
};

// Policies API
export const policiesAPI = {
  getAll: async (page = 1, limit = 10, status?: string): Promise<PaginatedResponse<Policy>> => {
    try {
      const response = await api.get<PaginatedResponse<Policy>>('/policies', {
        params: { page, limit, status },
      });
      return response.data;
    } catch (error) {
      // Fallback to mock data
      console.warn('Using mock policies data');
      return {
        data: mockData.policies,
        total: mockData.policies.length,
        page,
        limit,
        totalPages: 1
      };
    }
  },

  getById: async (id: string): Promise<Policy> => {
    try {
      const response = await api.get<ApiResponse<Policy>>(`/policies/${id}`);
      return response.data.data!;
    } catch (error) {
      const mockPolicy = mockData.policies.find(p => p.id === id);
      if (!mockPolicy) throw new Error('Policy not found');
      return mockPolicy;
    }
  },

  create: async (policyData: CreatePolicyRequest): Promise<Policy> => {
    try {
      const response = await api.post<ApiResponse<Policy>>('/policies', policyData);
      return response.data.data!;
    } catch (error) {
      throw new Error('Failed to create policy');
    }
  },

  update: async (id: string, policyData: Partial<CreatePolicyRequest>): Promise<Policy> => {
    try {
      const response = await api.put<ApiResponse<Policy>>(`/policies/${id}`, policyData);
      return response.data.data!;
    } catch (error) {
      throw new Error('Failed to update policy');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/policies/${id}`);
    } catch (error) {
      throw new Error('Failed to delete policy');
    }
  },

  updateStatus: async (id: string, status: Policy['status']): Promise<Policy> => {
    try {
      const response = await api.patch<ApiResponse<Policy>>(`/policies/${id}/status`, { status });
      return response.data.data!;
    } catch (error) {
      throw new Error('Failed to update policy status');
    }
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
      return response.data.data!;
    } catch (error) {
      // Fallback to mock data
      console.warn('Using mock dashboard stats');
      return mockData.stats;
    }
  },

  getRevenueData: async (): Promise<any[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>('/dashboard/revenue');
      return response.data.data!;
    } catch (error) {
      // Fallback to mock data
      return [
        { month: 'Jan', revenue: 5000 },
        { month: 'Feb', revenue: 6000 },
        { month: 'Mar', revenue: 4500 },
        { month: 'Apr', revenue: 7000 }
      ];
    }
  },

  getPolicyStatusData: async (): Promise<any[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>('/dashboard/policy-status');
      return response.data.data!;
    } catch (error) {
      // Fallback to mock data
      return [
        { status: 'Active', count: 67 },
        { status: 'Pending', count: 12 },
        { status: 'Expired', count: 10 }
      ];
    }
  },
};

export default api;
