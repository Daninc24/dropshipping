import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  EyeIcon,
  ShoppingBagIcon,
  TruckIcon,
  TagIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid'
import api from '../../services/api'
import toast from 'react-hot-toast'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedNotifications, setSelectedNotifications] = useState([])

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/notifications')
      setNotifications(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/read/${notificationId}`)
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      )
    } catch (error) {
      console.error('Failed to mark as read:', error)
      toast.error('Failed to mark as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all')
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      )
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      toast.error('Failed to mark all as read')
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`)
      setNotifications(prev => 
        prev.filter(notification => notification._id !== notificationId)
      )
      setSelectedNotifications(prev => prev.filter(id => id !== notificationId))
      toast.success('Notification deleted')
    } catch (error) {
      console.error('Failed to delete notification:', error)
      toast.error('Failed to delete notification')
    }
  }

  const deleteSelected = async () => {
    if (selectedNotifications.length === 0) return

    try {
      await Promise.all(
        selectedNotifications.map(id => api.delete(`/notifications/${id}`))
      )
      setNotifications(prev => 
        prev.filter(notification => !selectedNotifications.includes(notification._id))
      )
      setSelectedNotifications([])
      toast.success(`Deleted ${selectedNotifications.length} notifications`)
    } catch (error) {
      console.error('Failed to delete notifications:', error)
      toast.error('Failed to delete notifications')
    }
  }

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  const handleSelectAll = () => {
    const filteredNotifs = getFilteredNotifications()
    setSelectedNotifications(
      selectedNotifications.length === filteredNotifs.length
        ? []
        : filteredNotifs.map(notification => notification._id)
    )
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return ShoppingBagIcon
      case 'shipping': return TruckIcon
      case 'promotion': return TagIcon
      case 'warning': return ExclamationTriangleIcon
      case 'info':
      default: return InformationCircleIcon
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order': return 'text-blue-600 bg-blue-100'
      case 'shipping': return 'text-purple-600 bg-purple-100'
      case 'promotion': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-red-600 bg-red-100'
      case 'info':
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(notification => !notification.read)
      case 'read':
        return notifications.filter(notification => notification.read)
      default:
        return notifications
    }
  }

  const filterOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' }
  ]

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = notifications.filter(n => !n.read).length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48"></div>
        <div className="skeleton h-12 w-full"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-20 w-full"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="btn-outline flex items-center space-x-2"
          >
            <CheckIcon className="h-4 w-4" />
            <span>Mark All Read</span>
          </button>
        )}
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
              {option.value === 'unread' && unreadCount > 0 && (
                <span className="ml-2 bg-primary-100 text-primary-600 py-0.5 px-2 rounded-full text-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              {selectedNotifications.length} notification(s) selected
            </span>
            <div className="flex items-center space-x-3">
              <button
                onClick={deleteSelected}
                className="btn-outline btn-sm text-red-600 border-red-300 hover:bg-red-50"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleSelectAll}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {selectedNotifications.length === filteredNotifications.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {filteredNotifications.map((notification, index) => {
            const NotificationIcon = getNotificationIcon(notification.type)
            const iconColor = getNotificationColor(notification.type)
            
            return (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
                  !notification.read ? 'border-l-4 border-l-primary-500' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification._id)}
                      onChange={() => handleSelectNotification(notification._id)}
                      className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />

                    {/* Icon */}
                    <div className={`flex-shrink-0 p-2 rounded-lg ${iconColor}`}>
                      <NotificationIcon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-sm font-medium ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className={`mt-1 text-sm ${
                            !notification.read ? 'text-gray-700' : 'text-gray-500'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        {/* Unread Indicator */}
                        {!notification.read && (
                          <div className="flex-shrink-0 ml-4">
                            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                          </div>
                        )}
                      </div>

                      {/* Action Link */}
                      {notification.actionUrl && (
                        <div className="mt-3">
                          <a
                            href={notification.actionUrl}
                            className="text-sm font-medium text-primary-600 hover:text-primary-700"
                          >
                            {notification.actionText || 'View Details'}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex items-center space-x-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                          title="Mark as read"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                        title="Delete notification"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <BellIcon className="mx-auto h-24 w-24 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
            {filter === 'all' 
              ? 'No notifications yet' 
              : filter === 'unread'
              ? 'No unread notifications'
              : 'No read notifications'
            }
          </h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? "We'll notify you about important updates and activities."
              : filter === 'unread'
              ? "You're all caught up! No new notifications."
              : "You haven't read any notifications yet."
            }
          </p>
        </div>
      )}

      {/* Notification Settings */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Notification Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-3 text-sm text-gray-700">Order updates and shipping notifications</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-3 text-sm text-gray-700">Promotional offers and discounts</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-3 text-sm text-gray-700">Product recommendations</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-3 text-sm text-gray-700">Newsletter and updates</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default Notifications