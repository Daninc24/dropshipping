import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <div className="text-6xl mb-4">🔍</div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary inline-flex items-center"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-outline inline-flex items-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>
        
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Pages
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/shop"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Shop
            </Link>
            <Link
              to="/categories"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Categories
            </Link>
            <Link
              to="/about"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound