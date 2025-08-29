import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Package, 
  DollarSign,
  TrendingUp,
  Activity,
  AlertCircle,
  Info
} from 'lucide-react';
import { DashboardStats } from '@/types';
import { dashboardAPI } from '@/services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatCurrency } from '@/utils/format';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const statsData = await dashboardAPI.getStats();
        setStats(statsData);
        
        // Check if we're in development mode (mock data was used)
        if ((import.meta as any).env?.DEV) {
          setIsDevelopmentMode(true);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('Failed to load dashboard data. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to ImaraBima Admin Dashboard</p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Connection Error</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Users',
      value: stats?.totalUsers.toLocaleString() || '0',
      icon: Users,
      change: stats?.userGrowth || 0,
      changeType: 'increase' as const,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Policies',
      value: stats?.activePolicies.toLocaleString() || '0',
      icon: FileText,
      change: 8.2,
      changeType: 'increase' as const,
      color: 'bg-green-500',
    },
    {
      name: 'Total Products',
      value: stats?.totalProducts.toString() || '0',
      icon: Package,
      change: 0,
      changeType: 'neutral' as const,
      color: 'bg-purple-500',
    },
    {
      name: 'Monthly Revenue',
      value: formatCurrency(stats?.monthlyRevenue || 0),
      icon: DollarSign,
      change: 15.3,
      changeType: 'increase' as const,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Development Mode Banner */}
      {isDevelopmentMode && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-blue-700 font-medium">Development Mode</p>
              <p className="text-blue-600 text-sm">The application is running with mock data since the API server is not available. This is normal for development.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to ImaraBima Admin Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                {stat.change !== 0 && (
                  <div className="flex items-center mt-1">
                    {stat.changeType === 'increase' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <Activity className="h-4 w-4 text-gray-500" />
                    )}
                    <span
                      className={`ml-1 text-sm font-medium ${
                        stat.changeType === 'increase'
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {stat.change > 0 ? '+' : ''}{stat.change}%
                    </span>
                    <span className="ml-1 text-sm text-gray-500">from last month</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Revenue chart will be displayed here</p>
          </div>
        </div>

        {/* Policy Status Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Policy Status Distribution</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Policy status chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">New policy created: POL-2024003</span>
            <span className="text-xs text-gray-400 ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">New user registered: John Doe</span>
            <span className="text-xs text-gray-400 ml-auto">4 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Policy payment received: POL-2024001</span>
            <span className="text-xs text-gray-400 ml-auto">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
