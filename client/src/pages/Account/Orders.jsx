import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShoppingBagIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowPathIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import api from '../../services/api'
import toast from 'react-hot-toast'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/orders/my')
      setOrders(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return ClockIcon
      case 'processing': return ArrowPathIcon
      case 'shipped': return TruckIcon
      case 'delivered': return CheckCircleIcon
      case 'cancelled': return XCircleIcon
      default: return ClockIcon
    }
  }

  const filterOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  const handleReorder = async (orderId) => {
    try {
      const response = await api.post(`/orders/${orderId}/reorder`)
      if (response.data.success) {
        toast.success('Items added to cart')
      }
    } catch (error) {
      console.error('Failed to reorder:', error)
      toast.error('Failed to reorder items')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48"></div>
        <div className="skeleton h-12 w-full"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-32 w-full"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                filter === option.value
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {option.label}
              {option.value !== 'all' && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {orders.filter(order => order.status === option.value).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order, index) => {
            const StatusIcon = getStatusIcon(order.status)
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${order.totalAmount?.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items?.length || 0} items
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {order.items?.slice(0, 3).map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.product?.images?.[0] ? (
                              <img
                                src={item.product.images[0].url}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.product?.name || 'Product'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity} × ${item.price?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="flex items-center justify-center text-sm text-gray-500">
                          +{order.items.length - 3} more items
                        </div>
                      )}
                    </div>

                    {/* Order Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <div className="flex items-center text-sm text-gray-600">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          {order.paymentMethod?.charAt(0).toUpperCase() + order.paymentMethod?.slice(1)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <TruckIcon className="h-4 w-4 mr-1" />
                          {order.shippingMethod?.charAt(0).toUpperCase() + order.shippingMethod?.slice(1)} Shipping
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {order.status === 'delivered' && (
                          <button
                            onClick={() => handleReorder(order._id)}
                            className="btn-outline btn-sm"
                          >
                            Reorder
                          </button>
                        )}
                        
                        <Link
                          to={`/account/orders/${order._id}`}
                          className="btn-primary btn-sm flex items-center space-x-1"
                        >
                          <EyeIcon className="h-4 w-4" />
                          <span>View Details</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingBagIcon className="mx-auto h-24 w-24 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
            {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? "When you place orders, they'll appear here."
              : `You don't have any ${filter} orders at the moment.`
            }
          </p>
          {filter === 'all' && (
            <Link to="/shop" className="btn-primary">
              Start Shopping
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default Orders