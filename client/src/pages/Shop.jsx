import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import api from '../services/api'

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    brand: searchParams.get('brand') || '',
    sort: searchParams.get('sort') || 'newest'
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [searchParams])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams(searchParams)
      const response = await api.get(`/products?${params.toString()}`)
      setProducts(response.data.data)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      setCategories(response.data.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Update URL params
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    setSearchParams(params)
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      brand: '',
      sort: 'newest'
    })
    setSearchParams({})
  }

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-600">
            {pagination.total ? `${pagination.total} products found` : 'Loading...'}
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="form-input"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="form-input"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="form-input"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  placeholder="Enter brand name"
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {[...Array(12)].map((_, index) => (
                <div key={index} className="card">
                  <div className="skeleton-image"></div>
                  <div className="card-body">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} viewMode={viewMode} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination pagination={pagination} onPageChange={handleFilterChange} />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Product Card Component
const ProductCard = ({ product, viewMode }) => {
  const mainImage = product.images?.find(img => img.isMain) || product.images?.[0]
  
  if (viewMode === 'list') {
    return (
      <div className="card">
        <div className="flex">
          <div className="w-48 h-48 bg-gray-100 overflow-hidden">
            {mainImage ? (
              <img
                src={mainImage.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <span className="text-2xl font-bold text-gray-400">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.shortDescription || product.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.comparePrice}
                  </span>
                )}
              </div>
              
              <button className="btn-primary btn-sm">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card group cursor-pointer">
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage.url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-2xl font-bold text-gray-400">
              {product.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      
      <div className="card-body">
        <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.comparePrice}
              </span>
            )}
          </div>
          
          {product.discountPercentage > 0 && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
              -{product.discountPercentage}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Pagination Component
const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages, hasPrev, hasNext } = pagination

  const handlePageChange = (newPage) => {
    onPageChange('page', newPage.toString())
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={!hasPrev}
        className="btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      <span className="text-sm text-gray-700">
        Page {page} of {totalPages}
      </span>
      
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={!hasNext}
        className="btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  )
}

export default Shop