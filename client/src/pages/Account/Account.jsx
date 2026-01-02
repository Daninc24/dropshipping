import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  UserIcon,
  MapPinIcon,
  ShoppingBagIcon,
  HeartIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../stores/authStore'

const Account = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuthStore()

  const navigation = [
    { name: 'Profile', href: '/account', icon: UserIcon, exact: true },
    { name: 'Addresses', href: '/account/addresses', icon: MapPinIcon },
    { name: 'Orders', href: '/account/orders', icon: ShoppingBagIcon },
    { name: 'Wishlist', href: '/account/wishlist', icon: HeartIcon },
    { name: 'Notifications', href: '/account/notifications', icon: BellIcon },
  ]

  const isActive = (href, exact = false) => {
    if (exact) {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Account</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href, item.exact)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-lg shadow-sm border sticky top-4">
            {/* User info */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={user.fullName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-primary-600" />
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {user?.fullName || 'User'}
                  </h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href, item.exact)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          {/* Mobile header */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Account