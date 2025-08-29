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
  PaginatedResponse
} from '@/types';

// Development mode fallback data
const isDevelopment = (import.meta as any).env?.DEV;
const mockData = {
  users: [
    {
      id: '1',
      name: 'John Doe',
      phone_number: '+254700123456',
      national_id: '12345678',
      role: 'customer' as 'customer' | 'agent' | 'admin',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone_number: '+254700123457',
      national_id: '87654321',
      role: 'agent' as 'customer' | 'agent' | 'admin',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ] as User[],
  products: [
    {
      id: '1',
      name: 'Funeral Cover',
      type: 'funeral' as 'funeral' | 'boda_boda',
      description: 'Comprehensive funeral insurance coverage',
      base_premium: 500,
      min_sum_assured: 10000,
      max_sum_assured: 100000,
      age_limit_min: 18,
      age_limit_max: 65,
      waiting_period_days: 30,
      is_active: true,
      terms_and_conditions: 'Standard terms apply',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Boda Boda Insurance',
      type: 'boda_boda' as 'funeral' | 'boda_boda',
      description: 'Motorcycle insurance for boda boda operators',
      base_premium: 300,
      min_sum_assured: 5000,
      max_sum_assured: 50000,
      age_limit_min: 18,
      age_limit_max: 60,
      waiting_period_days: 7,
      is_active: true,
      terms_and_conditions: 'Standard terms apply',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ] as Product[],
  policies: [
    {
      id: '1',
      user_id: '1',
      product_id: '1',
      policy_number: 'POL001',
      premium_amount: 500,
      sum_assured: 50000,
      payment_frequency: 'monthly' as 'monthly' | 'quarterly' | 'annually',
      status: 'active' as 'pending' | 'active' | 'expired' | 'cancelled',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      next_payment_date: '2024-02-01',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      user: {
        id: '1',
        name: 'John Doe',
        phone_number: '+254700123456',
        national_id: '12345678',
        role: 'customer' as 'customer' | 'agent' | 'admin',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      product: {
        id: '1',
        name: 'Funeral Cover',
        type: 'funeral' as 'funeral' | 'boda_boda',
        description: 'Comprehensive funeral insurance coverage',
        base_premium: 500,
        min_sum_assured: 10000,
        max_sum_assured: 100000,
        age_limit_min: 18,
        age_limit_max: 65,
        waiting_period_days: 30,
        is_active: true,
        terms_and_conditions: 'Standard terms apply',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    }
  ] as Policy[],
  stats: {
    totalUsers: 150,
    totalPolicies: 89,
    totalProducts: 2,
    totalRevenue: 44500,
    activePolicies: 67,
    pendingPolicies: 12,
    monthlyRevenue: 44500,
    userGrowth: 12
  }
};

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: 'https://imarabima-platform.vercel.app',
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
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data || config.params);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.config?.url, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log('Attempting login with:', credentials.phone_number);
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      console.log('Login successful:', response.data);
      
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock login for development');
        // Mock login for development
        if (credentials.phone_number === '+254700123456' && credentials.password === 'password') {
          return {
            user: mockData.users[0],
            token: 'mock-jwt-token',
            message: 'Login successful (development mode)'
          };
        }
        throw new Error('Invalid credentials');
      }
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
      console.log('Logout successful');
    } catch (error: any) {
      console.error('Logout error:', error.response?.data || error.message);
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock logout for development');
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  verifyToken: async (): Promise<User> => {
    try {
      const response = await api.get<{user: User}>('/auth/verify');
      console.log('Token verification successful:', response.data);
      return response.data.user;
    } catch (error: any) {
      console.error('Token verification failed:', error.response?.data || error.message);
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock user verification for development');
        return mockData.users[0];
      }
      throw error;
    }
  },
};

// Users API
export const usersAPI = {
  getAll: async (page = 1, limit = 10, search = ''): Promise<PaginatedResponse<User>> => {
    try {
      const response = await api.get<{users: User[], pagination: any}>('/users', {
        params: { page, limit, search },
      });
      console.log('Users fetched successfully:', response.data);
      
      // Transform the response to match our expected format
      return {
        data: response.data.users,
        total: response.data.pagination.total,
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        totalPages: response.data.pagination.totalPages
      };
    } catch (error: any) {
      console.error('Failed to fetch users:', error.response?.data || error.message);
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock users data for development');
        const filteredUsers = search 
          ? mockData.users.filter(user => 
              user.name.toLowerCase().includes(search.toLowerCase()) ||
              user.phone_number.includes(search)
            )
          : mockData.users;
        
        return {
          data: filteredUsers,
          total: filteredUsers.length,
          page,
          limit,
          totalPages: 1
        };
      }
      throw error;
    }
  },

  getById: async (id: string): Promise<User> => {
    try {
      const response = await api.get<{user: User}>(`/users/${id}`);
      return response.data.user;
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        const mockUser = mockData.users.find(u => u.id === id);
        if (!mockUser) throw new Error('User not found');
        return mockUser;
      }
      throw error;
    }
  },

  create: async (userData: CreateUserRequest): Promise<User> => {
    try {
      const response = await api.post<{user: User}>('/users/register', userData);
      return response.data.user;
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock user creation for development');
        const newUser: User = {
          id: Date.now().toString(),
          name: userData.name,
          phone_number: userData.phone_number,
          national_id: userData.national_id,
          role: userData.role,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockData.users.push(newUser);
        return newUser;
      }
      throw error;
    }
  },

  update: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    try {
      const response = await api.put<{user: User}>(`/users/${id}`, userData);
      return response.data.user;
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock user update for development');
        const userIndex = mockData.users.findIndex(u => u.id === id);
        if (userIndex === -1) throw new Error('User not found');
        
        const updatedUser = {
          ...mockData.users[userIndex],
          ...userData,
          updated_at: new Date().toISOString()
        };
        mockData.users[userIndex] = updatedUser as User;
        return updatedUser as User;
      }
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock user deletion for development');
        const userIndex = mockData.users.findIndex(u => u.id === id);
        if (userIndex !== -1) {
          mockData.users.splice(userIndex, 1);
        }
        return;
      }
      throw error;
    }
  },

  toggleStatus: async (id: string): Promise<User> => {
    try {
      const response = await api.patch<{user: User}>(`/users/${id}/toggle-status`);
      return response.data.user;
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock status toggle for development');
        const user = mockData.users.find(u => u.id === id);
        if (!user) throw new Error('User not found');
        
        user.is_active = !user.is_active;
        user.updated_at = new Date().toISOString();
        return user;
      }
      throw error;
    }
  },
};

// Products API
export const productsAPI = {
  getAll: async (type?: string): Promise<Product[]> => {
    try {
      const response = await api.get<{products: Product[]}>('/products', {
        params: { type },
      });
      return response.data.products;
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock products data for development');
        const filteredProducts = type 
          ? mockData.products.filter(product => product.type === type)
          : mockData.products;
        return filteredProducts;
      }
      throw error;
    }
  },

  getById: async (id: string): Promise<Product> => {
    try {
      const response = await api.get<{product: Product}>(`/products/${id}`);
      return response.data.product;
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        const mockProduct = mockData.products.find(p => p.id === id);
        if (!mockProduct) throw new Error('Product not found');
        return mockProduct;
      }
      throw error;
    }
  },

  create: async (productData: CreateProductRequest): Promise<Product> => {
    try {
      const response = await api.post<{product: Product}>('/products', productData);
      return response.data.product;
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock product creation for development');
        const newProduct: Product = {
          id: Date.now().toString(),
          ...productData,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockData.products.push(newProduct);
        return newProduct;
      }
      throw error;
    }
  },

  update: async (id: string, productData: Partial<CreateProductRequest>): Promise<Product> => {
    try {
      const response = await api.put<{product: Product}>(`/products/${id}`, productData);
      return response.data.product;
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock product update for development');
        const productIndex = mockData.products.findIndex(p => p.id === id);
        if (productIndex === -1) throw new Error('Product not found');
        
        const updatedProduct = {
          ...mockData.products[productIndex],
          ...productData,
          updated_at: new Date().toISOString()
        };
        mockData.products[productIndex] = updatedProduct as Product;
        return updatedProduct as Product;
      }
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock product deletion for development');
        const productIndex = mockData.products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
          mockData.products.splice(productIndex, 1);
        }
        return;
      }
      throw error;
    }
  },

  toggleStatus: async (id: string): Promise<Product> => {
    try {
      const response = await api.patch<{product: Product}>(`/products/${id}/toggle-status`);
      return response.data.product;
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock status toggle for development');
        const product = mockData.products.find(p => p.id === id);
        if (!product) throw new Error('Product not found');
        
        product.is_active = !product.is_active;
        product.updated_at = new Date().toISOString();
        return product;
      }
      throw error;
    }
  },
};

// Policies API
export const policiesAPI = {
  getAll: async (page = 1, limit = 10, status?: string): Promise<PaginatedResponse<Policy>> => {
    try {
      const response = await api.get<{policies: Policy[], pagination: any}>('/policies', {
        params: { page, limit, status },
      });
      
      // Transform the response to match our expected format
      return {
        data: response.data.policies,
        total: response.data.pagination.total,
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        totalPages: response.data.pagination.totalPages
      };
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock policies data for development');
        const filteredPolicies = status 
          ? mockData.policies.filter(policy => policy.status === status)
          : mockData.policies;
        
        return {
          data: filteredPolicies,
          total: filteredPolicies.length,
          page,
          limit,
          totalPages: 1
        };
      }
      throw error;
    }
  },

  getById: async (id: string): Promise<Policy> => {
    try {
      const response = await api.get<{policy: Policy}>(`/policies/${id}`);
      return response.data.policy;
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        const mockPolicy = mockData.policies.find(p => p.id === id);
        if (!mockPolicy) throw new Error('Policy not found');
        return mockPolicy;
      }
      throw error;
    }
  },

  create: async (policyData: CreatePolicyRequest): Promise<Policy> => {
    try {
      const response = await api.post<{policy: Policy}>('/policies', policyData);
      return response.data.policy;
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock policy creation for development');
        const newPolicy: Policy = {
          id: Date.now().toString(),
          user_id: '1', // Default user
          product_id: policyData.product_id,
          policy_number: `POL${Date.now()}`,
          premium_amount: policyData.premium_amount,
          sum_assured: policyData.sum_assured,
          payment_frequency: policyData.payment_frequency,
          status: 'pending',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: mockData.users[0],
          product: mockData.products.find(p => p.id === policyData.product_id)!
        };
        mockData.policies.push(newPolicy);
        return newPolicy;
      }
      throw error;
    }
  },

  update: async (id: string, policyData: Partial<CreatePolicyRequest>): Promise<Policy> => {
    try {
      const response = await api.put<{policy: Policy}>(`/policies/${id}`, policyData);
      return response.data.policy;
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock policy update for development');
        const policyIndex = mockData.policies.findIndex(p => p.id === id);
        if (policyIndex === -1) throw new Error('Policy not found');
        
        const updatedPolicy = {
          ...mockData.policies[policyIndex],
          ...policyData,
          updated_at: new Date().toISOString()
        };
        mockData.policies[policyIndex] = updatedPolicy as Policy;
        return updatedPolicy as Policy;
      }
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/policies/${id}`);
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock policy deletion for development');
        const policyIndex = mockData.policies.findIndex(p => p.id === id);
        if (policyIndex !== -1) {
          mockData.policies.splice(policyIndex, 1);
        }
        return;
      }
      throw error;
    }
  },

  updateStatus: async (id: string, status: Policy['status']): Promise<Policy> => {
    try {
      const response = await api.patch<{policy: Policy}>(`/policies/${id}/status`, { status });
      return response.data.policy;
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock status update for development');
        const policy = mockData.policies.find(p => p.id === id);
        if (!policy) throw new Error('Policy not found');
        
        policy.status = status;
        policy.updated_at = new Date().toISOString();
        return policy;
      }
      throw error;
    }
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get<DashboardStats>('/dashboard/stats');
      console.log('Dashboard stats fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch dashboard stats:', error.response?.data || error.message);
      if (isDevelopment && error.response?.status === 404) {
        console.warn('API unavailable, using mock dashboard stats for development');
        return mockData.stats;
      }
      throw error;
    }
  },

  getRevenueData: async (): Promise<any[]> => {
    try {
      const response = await api.get<{revenue: any[]}>('/dashboard/revenue');
      return response.data.revenue;
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        return [
          { month: 'Jan', revenue: 5000 },
          { month: 'Feb', revenue: 6000 },
          { month: 'Mar', revenue: 4500 },
          { month: 'Apr', revenue: 7000 }
        ];
      }
      throw error;
    }
  },

  getPolicyStatusData: async (): Promise<any[]> => {
    try {
      const response = await api.get<{policyStatus: any[]}>('/dashboard/policy-status');
      return response.data.policyStatus;
    } catch (error: any) {
      if (isDevelopment && error.response?.status === 404) {
        return [
          { status: 'Active', count: 67 },
          { status: 'Pending', count: 12 },
          { status: 'Expired', count: 10 }
        ];
      }
      throw error;
    }
  },
};

export default api;
