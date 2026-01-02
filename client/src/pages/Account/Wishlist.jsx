import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
  StarIcon as StarIconSolid,
  ShareIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useCartStore } from '../../stores/cartStore'
import { useAuthStore } from '../../stores/authStore'
import api from '../../services/api'
import toast from 'react-hot-toast'

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState([])

  const { addItem } = useCartStore()
  const { removeFromWishlist } = useAuthStore()

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/users/wishlist')
      setWishlistItems(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
      toast.error('Failed to load wishlist')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId)
      setWishlistItems(prev => prev.filter(item => item._id !== productId))
      setSelectedItems(prev => prev.filter(id => id !== productId))
      toast.success('Removed from wishlist')
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
      toast.error('Failed to remove from wishlist')
    }
  }

  const handleAddToCart = async (product) => {
    try {
      const result = await addItem(product, 1, [])
      if (result.success) {
        toast.success('Added to cart')
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
      toast.error('Failed to add to cart')
    }
  }

  const handleAddAllToCart = async () => {
    try {
      const itemsToAdd = selectedItems.length > 0 
        ? wishlistItems.filter(item => selectedItems.includes(item._id))
        : wishlistItems

      for (const item of itemsToAdd) {
        await addItem(item, 1, [])
      }
      
      toast.success(`Added ${itemsToAdd.length} items to cart`)
      setSelectedItems([])
    } catch (error) {
      console.error('Failed to add items to cart:', error)
      toast.error('Failed to add items to cart')
    }
  }

  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) return

    try {
      for (const productId of selectedItems) {
        await removeFromWishlist(productId)
      }
      
      setWishlistItems(prev => prev.filter(item => !selectedItems.includes(item._id)))
      setSelectedItems([])
      toast.success(`Removed ${selectedItems.length} items from wishlist`)
    } catch (error) {
      console.error('Failed to remove items:', error)
      toast.error('Failed to remove items')
    }
  }

  const handleSelectItem = (productId) => {
    setSelectedItems(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === wishlistItems.length
        ? []
        : wishlistItems.map(item => item._id)
    )
  }

  const handleShare = async (product) => {
    const url = `${window.location.origin}/product/${product.slug}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: url
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      toast.success('Product link copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48"></div>
        <div className="skeleton h-12 w-full"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-80 w-full"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        
        {wishlistItems.length > 0 && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSelectAll}
              className="btn-outline btn-sm"
            >
              {selectedItems.length === wishlistItems.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              {selectedItems.length} item(s) selected
            </span>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddAllToCart}
                className="btn-primary btn-sm"
              >
                Add to Cart
              </button>
              <button
                onClick={handleRemoveSelected}
                className="btn-outline btn-sm text-red-600 border-red-300 hover:bg-red-50"
              >
                Remove Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Items */}
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow relative"
            >
              {/* Selection Checkbox */}
              <div className="absolute top-3 left-3 z-10">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(product._id)}
                  onChange={() => handleSelectItem(product._id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveFromWishlist(product._id)}
                className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <HeartIconSolid className="h-5 w-5 text-red-500" />
              </button>

              <Link to={`/product/${product.slug}`}>
                <div className="aspect-square bg-gray-100 overflow-hidden rounded-t-lg">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0].url}
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
                    <div className="absolute top-12 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                      -{product.discountPercentage}%
                    </div>
                  )}

                  {/* Stock Status */}
                  {product.stockStatus === 'out-of-stock' && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
                      <span className="text-white font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/product/${product.slug}`}>
                  <h3 className="font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                    {product.name}
                  </h3>
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

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
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

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stockStatus === 'out-of-stock'}
                    className="btn-primary flex-1 flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCartIcon className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                  
                  <button
                    onClick={() => handleShare(product)}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <ShareIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Added to wishlist date */}
                <div className="mt-3 text-xs text-gray-500">
                  Added {new Date(product.addedToWishlistAt || product.createdAt).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <HeartIcon className="mx-auto h-24 w-24 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600 mb-6">
            Save items you love to your wishlist and shop them later.
          </p>
          <Link to="/shop" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      )}

      {/* Wishlist Tips */}
      {wishlistItems.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Wishlist Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <HeartIconSolid className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Items in your wishlist are saved across all your devices</span>
            </div>
            <div className="flex items-start space-x-2">
              <ShareIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>Share individual items with friends and family</span>
            </div>
            <div className="flex items-start space-x-2">
              <ShoppingCartIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Quickly add multiple items to your cart at once</span>
            </div>
            <div className="flex items-start space-x-2">
              <EyeIcon className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <span>Get notified when wishlist items go on sale</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Wishlist