// User types
export interface User {
  id: string;
  name: string;
  phone_number: string;
  national_id: string;
  email?: string;
  role: 'customer' | 'agent' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  name: string;
  phone_number: string;
  national_id: string;
  email?: string;
  password: string;
  role: 'customer' | 'agent' | 'admin';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'customer' | 'agent' | 'admin';
  is_active?: boolean;
}

// Product types
export interface Product {
  id: string;
  name: string;
  type: 'funeral' | 'boda_boda';
  description: string;
  base_premium: number;
  min_sum_assured: number;
  max_sum_assured: number;
  age_limit_min: number;
  age_limit_max: number;
  waiting_period_days: number;
  is_active: boolean;
  terms_and_conditions: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name: string;
  type: 'funeral' | 'boda_boda';
  description: string;
  base_premium: number;
  min_sum_assured: number;
  max_sum_assured: number;
  age_limit_min: number;
  age_limit_max: number;
  waiting_period_days: number;
  terms_and_conditions: string;
}

// Policy types
export interface Policy {
  id: string;
  user_id: string;
  product_id: string;
  policy_number: string;
  premium_amount: number;
  sum_assured: number;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  start_date: string;
  end_date: string;
  payment_frequency: 'monthly' | 'quarterly' | 'annually';
  next_payment_date: string;
  agent_id?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  product?: Product;
  beneficiaries?: PolicyBeneficiary[];
}

export interface PolicyBeneficiary {
  id: string;
  policy_id: string;
  name: string;
  relationship: string;
  phone_number: string;
  national_id: string;
  percentage: number;
  created_at: string;
}

export interface CreatePolicyRequest {
  product_id: string;
  premium_amount: number;
  sum_assured: number;
  payment_frequency: 'monthly' | 'quarterly' | 'annually';
  beneficiaries?: Omit<PolicyBeneficiary, 'id' | 'policy_id' | 'created_at'>[];
}

// Auth types
export interface LoginRequest {
  phone_number: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Dashboard stats
export interface DashboardStats {
  totalUsers: number;
  totalPolicies: number;
  totalProducts: number;
  totalRevenue: number;
  activePolicies: number;
  pendingPolicies: number;
  monthlyRevenue: number;
  userGrowth: number;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Chart data types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  policies: number;
}

export interface PolicyStatusData {
  status: string;
  count: number;
  percentage: number;
}
