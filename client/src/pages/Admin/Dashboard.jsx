import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '../../services/api'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    revenueGrowth: 0,
    ordersGrowth: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [salesData, setSalesData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const fetchingRef = useRef(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    fetchDashboardData()
    
    return () => {
      mountedRef.current = false
    }
  }, [])

  const fetchDashboardData = async () => {
    // Prevent multiple simultaneous requests
    if (fetchingRef.current) {
      return
    }

    try {
      fetchingRef.current = true
      setIsLoading(true)
      
      // Fetch dashboard stats
      const [statsRes, ordersRes, productsRes, salesRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/orders?limit=5&sort=-createdAt'),
        api.get('/admin/products/top-selling?limit=5'),
        api.get('/admin/dashboard/sales-chart')
      ])

      if (mountedRef.current) {
        setStats(statsRes.data.data)
        setRecentOrders(ordersRes.data.data.orders || [])
        setTopProducts(productsRes.data.data || [])
        setSalesData(salesRes.data.data.salesData || [])
        setCategoryData(salesRes.data.data.categoryData || [])
      }
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      if (mountedRef.current) {
        if (error.response?.status === 429) {
          toast.error('Server is busy. Please refresh in a moment.')
        } else {
          toast.error('Failed to load dashboard data')
        }
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
      fetchingRef.current = false
    }
  }

  const StatCard = ({ title, value, icon: Icon, change, changeType, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-1">
              {changeType === 'increase' ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="skeleton h-16"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="skeleton h-64"></div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="skeleton h-64"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue?.toLocaleString() || '0'}`}
          icon={CurrencyDollarIcon}
          change={stats.revenueGrowth}
          changeType={stats.revenueGrowth >= 0 ? 'increase' : 'decrease'}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders?.toLocaleString() || '0'}
          icon={ShoppingBagIcon}
          change={stats.ordersGrowth}
          changeType={stats.ordersGrowth >= 0 ? 'increase' : 'decrease'}
          color="blue"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts?.toLocaleString() || '0'}
          icon={ChartBarIcon}
          color="purple"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers?.toLocaleString() || '0'}
          icon={UsersIcon}
          color="indigo"
        />
      </div>

      {/* Alert Cards */}
      {(stats.pendingOrders > 0 || stats.lowStockProducts > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.pendingOrders > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <TruckIcon className="h-6 w-6 text-yellow-600" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Pending Orders
                  </h3>
                  <p className="text-sm text-yellow-700">
                    You have {stats.pendingOrders} orders waiting to be processed
                  </p>
                </div>
                <Link
                  to="/admin/orders?status=pending"
                  className="ml-auto text-sm font-medium text-yellow-800 hover:text-yellow-900"
                >
                  View Orders
                </Link>
              </div>
            </div>
          )}
          
          {stats.lowStockProducts > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Low Stock Alert
                  </h3>
                  <p className="text-sm text-red-700">
                    {stats.lowStockProducts} products are running low on stock
                  </p>
                </div>
                <Link
                  to="/admin/products?stock=low"
                  className="ml-auto text-sm font-medium text-red-800 hover:text-red-900"
                >
                  View Products
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
              <Area type="monotone" dataKey="sales" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
              <Link
                to="/admin/orders"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.user?.firstName} {order.user?.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${order.totalAmount?.toFixed(2)}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No recent orders
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Top Selling Products</h3>
              <Link
                to="/admin/products"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={product._id} className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-500">
                          {product.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.totalSales || 0} sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${product.price?.toFixed(2)}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {product.views || 0}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No product data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard