import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  StarIcon as StarIconSolid,
  HeartIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import api from '../services/api'
import toast from 'react-hot-toast'

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  const { addItem } = useCartStore()
  const { isAuthenticated, isInWishlist, addToWishlist, removeFromWishlist } = useAuthStore()

  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    brand: searchParams.get('brand') || '',
    sort: searchParams.get('sort') || 'relevance'
  })

  useEffect(() => {
    if (query) {
      fetchSearchResults()
      fetchCategories()
    }
  }, [query, searchParams])

  const fetchSearchResults = async () => {
    try {
      setIsLoading(true)
      
      const params = new URLSearchParams(searchParams)
      params.set('search', query)
      
      const response = await api.get(`/products?${params.toString()}`)
      setProducts(response.data.data || [])
      setPagination(response.data.pagination || {})
      
    } catch (error) {
      console.error('Failed to fetch search results:', error)
      toast.error('Failed to load search results')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      setCategories(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Update URL params
    const params = new URLSearchParams()
    params.set('q', query)
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
      sort: 'relevance'
    })
    const params = new URLSearchParams()
    params.set('q', query)
    setSearchParams(params)
  }

  const handleAddToCart = async (product) => {
    const result = await addItem(product, 1, [])
    if (result.success) {
      toast.success('Added to cart')
    }
  }

  const handleWishlistToggle = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist')
      return
    }

    if (isInWishlist(productId)) {
      await removeFromWishlist(productId)
    } else {
      await addToWishlist(productId)
    }
  }

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ]

  if (!query) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <MagnifyingGlassIcon className="mx-auto h-24 w-24 text-gray-400" />
        <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Search for products</h1>
        <p className="text-gray-600 mb-6">Enter a search term to find products</p>
        <Link to="/shop" className="btn-primary">
          Browse All Products
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="skeleton h-8 w-64 mb-4"></div>
        <div className="skeleton h-4 w-96 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton aspect-square"></div>
              <div className="card-body">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary-600">Shop</Link>
        <span>/</span>
        <span className="text-gray-900">Search Results</span>
      </nav>

      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600">
          {pagination.total ? `${pagination.total} products found` : 'No products found'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
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

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
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
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:w-64">
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
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {products.length > 0 ? (
            <>
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard 
                      product={product} 
                      viewMode={viewMode}
                      onAddToCart={handleAddToCart}
                      onWishlistToggle={handleWishlistToggle}
                      isInWishlist={isInWishlist(product._id)}
                      searchQuery={query}
                    />
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
              <MagnifyingGlassIcon className="mx-auto h-24 w-24 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found for "{query}"
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters
              </p>
              <div className="space-x-4">
                <button onClick={clearFilters} className="btn-outline">
                  Clear Filters
                </button>
                <Link to="/shop" className="btn-primary">
                  Browse All Products
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Product Card Component
const ProductCard = ({ product, viewMode, onAddToCart, onWishlistToggle, isInWishlist, searchQuery }) => {
  const mainImage = product.images?.find(img => img.isMain) || product.images?.[0]
  
  // Highlight search terms in product name
  const highlightText = (text, query) => {
    if (!query) return text
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
  }
  
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
            <Link to={`/product/${product.slug}`}>
              <h3 
                className="text-lg font-medium text-gray-900 hover:text-primary-600 mb-2"
                dangerouslySetInnerHTML={{ __html: highlightText(product.name, searchQuery) }}
              />
            </Link>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.shortDescription || product.description}
            </p>
            
            {/* Rating */}
            {product.averageRating > 0 && (
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIconSolid
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.averageRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  ({product.numOfReviews})
                </span>
              </div>
            )}
            
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
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onWishlistToggle(product._id)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  {isInWishlist ? (
                    <HeartIconSolid className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => onAddToCart(product)}
                  className="btn-primary btn-sm flex items-center space-x-1"
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card group cursor-pointer relative">
      {/* Wishlist Button */}
      <button
        onClick={() => onWishlistToggle(product._id)}
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
      >
        {isInWishlist ? (
          <HeartIconSolid className="h-5 w-5 text-red-500" />
        ) : (
          <HeartIcon className="h-5 w-5 text-gray-400" />
        )}
      </button>

      <Link to={`/product/${product.slug}`}>
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
          
          {/* Discount Badge */}
          {product.discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
              -{product.discountPercentage}%
            </div>
          )}
        </div>
      </Link>
      
      <div className="card-body">
        <Link to={`/product/${product.slug}`}>
          <h3 
            className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2"
            dangerouslySetInnerHTML={{ __html: highlightText(product.name, searchQuery) }}
          />
        </Link>
        
        {/* Rating */}
        {product.averageRating > 0 && (
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIconSolid
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.averageRating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-sm text-gray-600">
              ({product.numOfReviews})
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
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
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="btn-primary w-full mt-3 flex items-center justify-center space-x-1"
        >
          <ShoppingCartIcon className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>
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

export default SearchResults