import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  TicketIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline'
import api from '../../services/api'
import toast from 'react-hot-toast'

const AdminCoupons = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [coupons, setCoupons] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    type: searchParams.get('type') || '',
    sortBy: searchParams.get('sortBy') || '-createdAt'
  })

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    totalUsage: 0
  })

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minimumAmount: '',
    maximumDiscount: '',
    usageLimit: '',
    userLimit: '',
    startDate: '',
    endDate: '',
    isActive: true,
    isPublic: true
  })

  useEffect(() => {
    fetchCoupons()
    fetchCouponStats()
  }, [searchParams])

  const fetchCoupons = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      params.append('page', searchParams.get('page') || '1')
      params.append('limit', '10')
      
      const response = await api.get(`/admin/coupons?${params}`)
      const { coupons: couponsData, pagination: paginationData } = response.data.data
      
      setCoupons(couponsData || [])
      setPagination(paginationData || {})
      
    } catch (error) {
      console.error('Failed to fetch coupons:', error)
      toast.error('Failed to load coupons')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCouponStats = async () => {
    try {
      const response = await api.get('/admin/coupons/stats')
      setStats(response.data.data || {})
    } catch (error) {
      console.error('Failed to fetch coupon stats:', error)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    
    setSearchParams(params)
  }

  const handleCreateCoupon = async (e) => {
    e.preventDefault()
    
    try {
      await api.post('/admin/coupons', newCoupon)
      toast.success('Coupon created successfully')
      setShowCreateModal(false)
      setNewCoupon({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minimumAmount: '',
        maximumDiscount: '',
        usageLimit: '',
        userLimit: '',
        startDate: '',
        endDate: '',
        isActive: true,
        isPublic: true
      })
      fetchCoupons()
      fetchCouponStats()
    } catch (error) {
      console.error('Failed to create coupon:', error)
      toast.error(error.response?.data?.message || 'Failed to create coupon')
    }
  }

  const handleToggleStatus = async (couponId, currentStatus) => {
    try {
      await api.patch(`/admin/coupons/${couponId}`, { isActive: !currentStatus })
      toast.success('Coupon status updated successfully')
      fetchCoupons()
      fetchCouponStats()
    } catch (error) {
      console.error('Failed to update coupon status:', error)
      toast.error('Failed to update coupon status')
    }
  }

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return
    
    try {
      await api.delete(`/admin/coupons/${couponId}`)
      toast.success('Coupon deleted successfully')
      fetchCoupons()
      fetchCouponStats()
    } catch (error) {
      console.error('Failed to delete coupon:', error)
      toast.error('Failed to delete coupon')
    }
  }

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
    toast.success('Coupon code copied to clipboard')
  }

  const getStatusColor = (coupon) => {
    const now = new Date()
    const endDate = new Date(coupon.endDate)
    
    if (!coupon.isActive) return 'bg-gray-100 text-gray-800'
    if (endDate < now) return 'bg-red-100 text-red-800'
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (coupon) => {
    const now = new Date()
    const endDate = new Date(coupon.endDate)
    
    if (!coupon.isActive) return 'Inactive'
    if (endDate < now) return 'Expired'
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return 'Used Up'
    return 'Active'
  }

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'expired', label: 'Expired' }
  ]

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'percentage', label: 'Percentage' },
    { value: 'fixed', label: 'Fixed Amount' }
  ]

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'code', label: 'Code A-Z' },
    { value: '-usedCount', label: 'Most Used' },
    { value: 'endDate', label: 'Expiring Soon' }
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-24 w-full"></div>
          ))}
        </div>
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
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-600">Manage discount coupons and promotions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100">
              <TicketIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Coupons</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-100">
              <TicketIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-red-100">
              <CalendarIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-purple-100">
              <UsersIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Usage</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsage}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search coupons..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center space-x-2"
          >
            <FunnelIcon className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="input"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="input"
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Until
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                            title="Copy code"
                          >
                            <ClipboardDocumentIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {coupon.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.discountType === 'percentage' 
                          ? `${coupon.discountValue}%` 
                          : `$${coupon.discountValue}`}
                      </div>
                      {coupon.minimumAmount && (
                        <div className="text-sm text-gray-500">
                          Min: ${coupon.minimumAmount}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.usedCount || 0}
                        {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {coupon.usageLimit ? 
                          `${Math.round(((coupon.usedCount || 0) / coupon.usageLimit) * 100)}% used` :
                          'Unlimited'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {new Date(coupon.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(coupon._id, coupon.isActive)}
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(coupon)}`}
                      >
                        {getStatusText(coupon)}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit Coupon"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Coupon"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No coupons found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {filters.search || filters.status || filters.type
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Get started by creating your first coupon.'}
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 btn-primary"
                    >
                      Create Coupon
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setSearchParams(prev => {
                    prev.set('page', pagination.page - 1)
                    return prev
                  })}
                  className="btn-outline disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setSearchParams(prev => {
                    prev.set('page', pagination.page + 1)
                    return prev
                  })}
                  className="btn-outline disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{pagination.total}</span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setSearchParams(prev => {
                          prev.set('page', i + 1)
                          return prev
                        })}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pagination.page === i + 1
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCreateModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateCoupon}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Coupon</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Coupon Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        className="input"
                        placeholder="e.g., SAVE20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCoupon.description}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, description: e.target.value }))}
                        className="input"
                        placeholder="e.g., 20% off for new customers"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Type *
                        </label>
                        <select
                          value={newCoupon.discountType}
                          onChange={(e) => setNewCoupon(prev => ({ ...prev, discountType: e.target.value }))}
                          className="input"
                        >
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Value *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={newCoupon.discountValue}
                          onChange={(e) => setNewCoupon(prev => ({ ...prev, discountValue: e.target.value }))}
                          className="input"
                          placeholder={newCoupon.discountType === 'percentage' ? '20' : '10.00'}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Amount
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newCoupon.minimumAmount}
                          onChange={(e) => setNewCoupon(prev => ({ ...prev, minimumAmount: e.target.value }))}
                          className="input"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Discount
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newCoupon.maximumDiscount}
                          onChange={(e) => setNewCoupon(prev => ({ ...prev, maximumDiscount: e.target.value }))}
                          className="input"
                          placeholder="100.00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Usage Limit
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={newCoupon.usageLimit}
                          onChange={(e) => setNewCoupon(prev => ({ ...prev, usageLimit: e.target.value }))}
                          className="input"
                          placeholder="Unlimited"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          User Limit
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={newCoupon.userLimit}
                          onChange={(e) => setNewCoupon(prev => ({ ...prev, userLimit: e.target.value }))}
                          className="input"
                          placeholder="1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={newCoupon.startDate}
                          onChange={(e) => setNewCoupon(prev => ({ ...prev, startDate: e.target.value }))}
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={newCoupon.endDate}
                          onChange={(e) => setNewCoupon(prev => ({ ...prev, endDate: e.target.value }))}
                          className="input"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newCoupon.isActive}
                          onChange={(e) => setNewCoupon(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="rounded border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Active</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newCoupon.isPublic}
                          onChange={(e) => setNewCoupon(prev => ({ ...prev, isPublic: e.target.checked }))}
                          className="rounded border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Public</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-auto sm:ml-3"
                  >
                    Create Coupon
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-outline w-full sm:w-auto mt-3 sm:mt-0"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCoupons