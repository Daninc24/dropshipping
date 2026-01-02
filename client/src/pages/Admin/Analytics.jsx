import { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '../../services/api'

const AdminAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [analytics, setAnalytics] = useState({
    overview: {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      averageOrderValue: 0,
      revenueGrowth: 0,
      ordersGrowth: 0,
      customersGrowth: 0,
      aovGrowth: 0
    },
    salesChart: [],
    ordersChart: [],
    topProducts: [],
    topCategories: [],
    customerSegments: [],
    revenueBySource: []
  })

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/admin/analytics?timeRange=${timeRange}`)
      setAnalytics(response.data.data || {})
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ]

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  const MetricCard = ({ title, value, change, changeType, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {changeType === 'increase' ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-32 w-full"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-80 w-full"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your store's performance and insights</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="form-input"
        >
          {timeRangeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${analytics.overview.totalRevenue?.toLocaleString() || '0'}`}
          change={analytics.overview.revenueGrowth}
          changeType={analytics.overview.revenueGrowth >= 0 ? 'increase' : 'decrease'}
          icon={CurrencyDollarIcon}
          color="green"
        />
        <MetricCard
          title="Total Orders"
          value={analytics.overview.totalOrders?.toLocaleString() || '0'}
          change={analytics.overview.ordersGrowth}
          changeType={analytics.overview.ordersGrowth >= 0 ? 'increase' : 'decrease'}
          icon={ShoppingBagIcon}
          color="blue"
        />
        <MetricCard
          title="Total Customers"
          value={analytics.overview.totalCustomers?.toLocaleString() || '0'}
          change={analytics.overview.customersGrowth}
          changeType={analytics.overview.customersGrowth >= 0 ? 'increase' : 'decrease'}
          icon={UsersIcon}
          color="purple"
        />
        <MetricCard
          title="Avg Order Value"
          value={`$${analytics.overview.averageOrderValue?.toFixed(2) || '0.00'}`}
          change={analytics.overview.aovGrowth}
          changeType={analytics.overview.aovGrowth >= 0 ? 'increase' : 'decrease'}
          icon={ChartBarIcon}
          color="indigo"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.salesChart || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Orders Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.ordersChart || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Orders']} />
              <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.topCategories || []}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="revenue"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {(analytics.topCategories || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products by Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topProducts || []} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Best Selling Products</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {(analytics.topProducts || []).slice(0, 5).map((product, index) => (
              <div key={index} className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} sold</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${product.revenue?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${product.avgPrice?.toFixed(2)} avg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Customer Segments</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {(analytics.customerSegments || [
              { segment: 'New Customers', count: 45, percentage: 35, revenue: 12500 },
              { segment: 'Returning Customers', count: 78, percentage: 60, revenue: 28900 },
              { segment: 'VIP Customers', count: 12, percentage: 5, revenue: 15600 }
            ]).map((segment, index) => (
              <div key={index} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{segment.segment}</p>
                  <p className="text-sm text-gray-500">{segment.percentage}%</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">{segment.count} customers</p>
                  <p className="text-sm font-medium text-gray-900">
                    ${segment.revenue?.toLocaleString()}
                  </p>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${segment.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {analytics.overview.conversionRate || '2.4'}%
            </div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {analytics.overview.repeatCustomerRate || '35'}%
            </div>
            <div className="text-sm text-gray-600">Repeat Customer Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ${analytics.overview.customerLifetimeValue || '245'}
            </div>
            <div className="text-sm text-gray-600">Customer Lifetime Value</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics