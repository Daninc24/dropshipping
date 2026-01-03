import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import api from '../services/api'
import SEOHead from '../components/SEO/SEOHead'
import useSEO from '../hooks/useSEO'
import useSettingsStore from '../stores/settingsStore'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const fetchingRef = useRef(false)
  const mountedRef = useRef(true)

  const { generateSEO, trackPageView } = useSEO()
  const { 
    getHeroTitle, 
    getHeroSubtitle, 
    fetchSettings
  } = useSettingsStore()

  const seoData = generateSEO('home')

  // Optimized fetch function for production
  const fetchHomeData = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (fetchingRef.current) {
      return
    }

    // Double-check component is still mounted
    if (!mountedRef.current) {
      return
    }

    try {
      fetchingRef.current = true
      setIsLoading(true)
      setError(null)

      // Fetch products and categories
      const productsRes = await api.get('/products?featured=true&limit=8')

      // Check if still mounted after first API call
      if (!mountedRef.current) {
        return
      }

      const categoriesRes = await api.get('/categories?featured=true&limit=6')
      
      // Final check before setting state
      if (mountedRef.current) {
        setFeaturedProducts(productsRes.data.data || [])
        setCategories(categoriesRes.data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch home data:', error)
      
      if (mountedRef.current) {
        if (error.response?.status === 429) {
          setError('Server is busy. Please refresh the page in a moment.')
        } else {
          setError(`Failed to load content: ${error.message}`)
        }
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
      fetchingRef.current = false
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    
    // Add a small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        fetchHomeData()
      }
    }, 100)
    
    // Cleanup function
    return () => {
      clearTimeout(timer)
      mountedRef.current = false
    }
  }, [fetchHomeData])

  // Separate cleanup effect
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const features = [
    {
      icon: TruckIcon,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Payment',
      description: '100% secure payment processing'
    },
    {
      icon: CreditCardIcon,
      title: 'Easy Returns',
      description: '30-day hassle-free returns'
    },
    {
      icon: ShoppingBagIcon,
      title: 'Quality Products',
      description: 'Curated selection of premium items'
    }
  ]

  return (
    <>
      <SEOHead {...seoData} />
      <div className="min-h-screen">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mx-4 mt-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => {
                    setError(null)
                    fetchHomeData()
                  }}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              {getHeroTitle() || 'Discover Amazing Products'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-gray-100"
            >
              {getHeroSubtitle() || 'Shop the latest trends with unbeatable prices and quality'}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/shop"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Shop Now
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/categories"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Browse Categories
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories to find exactly what you're looking for
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="text-center">
                  <div className="skeleton aspect-square rounded-lg mb-4"></div>
                  <div className="skeleton-text h-4 w-20 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    to={`/categories/${category.slug}`}
                    className="group block text-center"
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 group-hover:shadow-lg transition-shadow">
                      {category.image?.url ? (
                        <img
                          src={category.image.url}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                          <span className="text-2xl font-bold text-primary-600">
                            {category.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium products
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="btn-primary btn-lg"
            >
              View All Products
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new products, special offers, and exclusive deals.
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            />
            <button
              type="submit"
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
    </>
  )
}

// Product Card Component
const ProductCard = ({ product }) => {
  const mainImage = product.images?.find(img => img.isMain) || product.images?.[0]
  
  return (
    <div className="card group cursor-pointer">
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
              <ShoppingBagIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="card-body">
          <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          {product.averageRating > 0 && (
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.averageRating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                ({product.numOfReviews})
              </span>
            </div>
          )}
          
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
      </Link>
    </div>
  )
}

export default Home