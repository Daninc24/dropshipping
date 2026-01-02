import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon as StarIconSolid,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import api from '../../services/api'
import toast from 'react-hot-toast'

const AdminReviews = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    rating: searchParams.get('rating') || '',
    verified: searchParams.get('verified') || '',
    sortBy: searchParams.get('sortBy') || '-createdAt'
  })

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    averageRating: 0
  })

  useEffect(() => {
    fetchReviews()
    fetchReviewStats()
  }, [searchParams])

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      params.append('page', searchParams.get('page') || '1')
      params.append('limit', '10')
      
      const response = await api.get(`/admin/reviews?${params}`)
      const { reviews: reviewsData, pagination: paginationData } = response.data.data
      
      setReviews(reviewsData || [])
      setPagination(paginationData || {})
      
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReviewStats = async () => {
    try {
      const response = await api.get('/admin/reviews/stats')
      setStats(response.data.data || {})
    } catch (error) {
      console.error('Failed to fetch review stats:', error)
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

  const handleStatusUpdate = async (reviewId, newStatus) => {
    try {
      await api.patch(`/admin/reviews/${reviewId}/status`, { status: newStatus })
      toast.success('Review status updated successfully')
      fetchReviews()
      fetchReviewStats()
    } catch (error) {
      console.error('Failed to update review status:', error)
      toast.error('Failed to update review status')
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return
    
    try {
      await api.delete(`/admin/reviews/${reviewId}`)
      toast.success('Review deleted successfully')
      fetchReviews()
      fetchReviewStats()
    } catch (error) {
      console.error('Failed to delete review:', error)
      toast.error('Failed to delete review')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return ClockIcon
      case 'approved': return CheckCircleIcon
      case 'rejected': return XCircleIcon
      default: return ClockIcon
    }
  }

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ]

  const ratingOptions = [
    { value: '', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ]

  const verifiedOptions = [
    { value: '', label: 'All Reviews' },
    { value: 'true', label: 'Verified Purchase' },
    { value: 'false', label: 'Unverified' }
  ]

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: '-rating', label: 'Highest Rating' },
    { value: 'rating', label: 'Lowest Rating' }
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
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600">Manage customer reviews and ratings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100">
              <StarIconSolid className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-yellow-100">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-purple-100">
              <StarIconSolid className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.averageRating?.toFixed(1) || '0.0'}
              </p>
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
                placeholder="Search reviews..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                  Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="input"
                >
                  {ratingOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification
                </label>
                <select
                  value={filters.verified}
                  onChange={(e) => handleFilterChange('verified', e.target.value)}
                  className="input"
                >
                  {verifiedOptions.map(option => (
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

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="divide-y divide-gray-200">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Review Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {review.user?.avatar?.url ? (
                              <img
                                src={review.user.avatar.url}
                                alt={review.user.fullName}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {review.user?.firstName} {review.user?.lastName}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {new Date(review.createdAt).toLocaleDateString()}
                              {review.verified && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIconSolid
                              key={i}
                              className={`h-5 w-5 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center space-x-2">
                        <select
                          value={review.status}
                          onChange={(e) => handleStatusUpdate(review._id, e.target.value)}
                          className={`text-xs font-medium rounded-full px-3 py-1 border-0 ${getStatusColor(review.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="mb-4">
                      <Link
                        to={`/product/${review.product?.slug}`}
                        className="text-sm font-medium text-primary-600 hover:text-primary-500"
                      >
                        {review.product?.name}
                      </Link>
                    </div>

                    {/* Review Content */}
                    <div className="space-y-3">
                      {review.title && (
                        <h4 className="text-lg font-medium text-gray-900">{review.title}</h4>
                      )}
                      
                      <p className="text-gray-700">{review.comment}</p>

                      {/* Pros and Cons */}
                      {(review.pros?.length > 0 || review.cons?.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {review.pros?.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-green-700 mb-2">Pros:</h5>
                              <ul className="list-disc list-inside text-sm text-green-600 space-y-1">
                                {review.pros.map((pro, i) => (
                                  <li key={i}>{pro}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {review.cons?.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-red-700 mb-2">Cons:</h5>
                              <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                                {review.cons.map((con, i) => (
                                  <li key={i}>{con}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/product/${review.product?.slug}`}
                      className="text-gray-400 hover:text-gray-600"
                      title="View Product"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Review"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <StarIconSolid className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filters.search || filters.status || filters.rating
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Reviews will appear here once customers start leaving them.'}
              </p>
            </div>
          )}
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
    </div>
  )
}

export default AdminReviews