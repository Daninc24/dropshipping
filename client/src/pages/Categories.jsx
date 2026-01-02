import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  Squares2X2Icon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import api from '../services/api'
import toast from 'react-hot-toast'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/categories')
      setCategories(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Shop by Categories - E-Shop Kenya</title>
        <meta name="description" content="Browse all product categories on E-Shop Kenya. Find electronics, fashion, home goods, and more from trusted sellers across Kenya." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <Squares2X2Icon className="h-16 w-16 mx-auto mb-4 text-primary-100" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Shop by Categories
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                Discover thousands of products across all categories. 
                From electronics to fashion, find everything you need in Kenya.
              </p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              All Categories
            </h2>
            <p className="text-gray-600">
              Browse our complete range of product categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  to={`/categories/${category.slug}`}
                  className="group block bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {category.name}
                      </h3>
                      {category.featured && (
                        <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {category.productCount || 0} products
                      </span>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {categories.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Squares2X2Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No categories found
              </h3>
              <p className="text-gray-600">
                Categories will appear here once they are added.
              </p>
            </div>
          )}
        </div>

        {/* Featured Categories Section */}
        {categories.filter(cat => cat.featured).length > 0 && (
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Featured Categories
                </h2>
                <p className="text-lg text-gray-600">
                  Our most popular product categories
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories
                  .filter(category => category.featured)
                  .slice(0, 6)
                  .map((category, index) => (
                    <motion.div
                      key={category._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        to={`/categories/${category.slug}`}
                        className="group block bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-8 hover:from-primary-100 hover:to-primary-200 transition-all duration-200"
                      >
                        <div className="text-center">
                          <div className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Squares2X2Icon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            {category.description}
                          </p>
                          <div className="inline-flex items-center text-primary-600 font-medium">
                            Shop Now
                            <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Browse all our products or use our search feature to find exactly what you need.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/shop"
                  className="bg-primary-600 text-white px-8 py-3 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Browse All Products
                </Link>
                <Link
                  to="/search"
                  className="border border-gray-600 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Search Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Categories