import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  StarIcon,
  HeartIcon,
  ShoppingCartIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import api from '../services/api'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariants, setSelectedVariants] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  const { addItem, isLoading: cartLoading } = useCartStore()
  const { isAuthenticated, isInWishlist, addToWishlist, removeFromWishlist } = useAuthStore()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const response = await api.get(`/products/${slug}`)
        const { product: productData, relatedProducts: related } = response.data.data
        
        setProduct(productData)
        setRelatedProducts(related || [])
        
        // Initialize selected variants
        if (productData.variants) {
          const initialVariants = {}
          productData.variants.forEach(variant => {
            initialVariants[variant.name] = variant.options[0]
          })
          setSelectedVariants(initialVariants)
        }

        // Fetch reviews
        const reviewsResponse = await api.get(`/reviews/${productData._id}`)
        setReviews(reviewsResponse.data.data || [])
        
      } catch (error) {
        console.error('Failed to fetch product:', error)
        toast.error('Product not found')
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const handleAddToCart = async () => {
    if (!product) return
    
    const variants = Object.entries(selectedVariants).map(([name, value]) => ({
      name,
      value
    }))
    
    const result = await addItem(product, quantity, variants)
    if (result.success) {
      toast.success(`Added ${quantity} item(s) to cart`)
    }
  }

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist')
      return
    }

    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id)
    } else {
      await addToWishlist(product._id)
    }
  }

  const handleVariantChange = (variantName, value) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: value
    }))
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: window.location.href
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="skeleton aspect-square"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton aspect-square"></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton h-12 w-32"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <Link to="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  const mainImage = product.images?.[selectedImage] || product.images?.[0]
  const inWishlist = isInWishlist(product._id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary-600">Shop</Link>
        <span>/</span>
        <Link to={`/categories/${product.category?.slug}`} className="hover:text-primary-600">
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
            {mainImage ? (
              <img
                src={mainImage.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-400">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Image Navigation */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(prev => 
                    prev > 0 ? prev - 1 : product.images.length - 1
                  )}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setSelectedImage(prev => 
                    prev < product.images.length - 1 ? prev + 1 : 0
                  )}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Discount Badge */}
            {product.discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                -{product.discountPercentage}%
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary-600' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleWishlistToggle}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {inWishlist ? (
                    <HeartIconSolid className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ShareIcon className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>
            
            {product.brand && (
              <p className="text-gray-600 mb-2">by {product.brand}</p>
            )}

            {/* Rating */}
            {product.averageRating > 0 && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIconSolid
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.averageRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.averageRating.toFixed(1)} ({product.numOfReviews} reviews)
                </span>
              </div>
            )}

            <p className="text-gray-600">{product.shortDescription}</p>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xl text-gray-500 line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              product.stockStatus === 'in-stock' ? 'bg-green-500' :
              product.stockStatus === 'low-stock' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className={`text-sm font-medium ${
              product.stockStatus === 'in-stock' ? 'text-green-700' :
              product.stockStatus === 'low-stock' ? 'text-yellow-700' : 'text-red-700'
            }`}>
              {product.stockStatus === 'in-stock' ? 'In Stock' :
               product.stockStatus === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
            </span>
            {product.trackQuantity && (
              <span className="text-sm text-gray-500">
                ({product.quantity} available)
              </span>
            )}
          </div>

          {/* Variants */}
          {product.variants && product.variants.map((variant) => (
            <div key={variant.name} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {variant.name}: {selectedVariants[variant.name]}
              </label>
              <div className="flex flex-wrap gap-2">
                {variant.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleVariantChange(variant.name, option)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      selectedVariants[variant.name] === option
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                disabled={product.trackQuantity && quantity >= product.quantity}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={cartLoading || product.stockStatus === 'out-of-stock'}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span>
                {cartLoading ? 'Adding...' : 'Add to Cart'}
              </span>
            </button>
            
            <button className="btn-outline w-full">
              Buy Now
            </button>
          </div>

          {/* Features */}
          <div className="border-t pt-6 space-y-3">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <TruckIcon className="h-5 w-5" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <ShieldCheckIcon className="h-5 w-5" />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
                {tab === 'reviews' && ` (${reviews.length})`}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.specifications && product.specifications.length > 0 ? (
                product.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-900">{spec.name}</span>
                    <span className="text-gray-600">{spec.value}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No specifications available.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {review.user?.avatar?.url ? (
                          <img
                            src={review.user.avatar.url}
                            alt={review.user.fullName}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {review.user?.firstName?.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">
                            {review.user?.fullName}
                          </span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIconSolid
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          {review.verified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        {review.title && (
                          <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                        )}
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        {(review.pros?.length > 0 || review.cons?.length > 0) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {review.pros?.length > 0 && (
                              <div>
                                <span className="font-medium text-green-700">Pros:</span>
                                <ul className="list-disc list-inside text-green-600 mt-1">
                                  {review.pros.map((pro, i) => (
                                    <li key={i}>{pro}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {review.cons?.length > 0 && (
                              <div>
                                <span className="font-medium text-red-700">Cons:</span>
                                <ul className="list-disc list-inside text-red-600 mt-1">
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
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct._id}
                to={`/product/${relatedProduct.slug}`}
                className="group"
              >
                <div className="card">
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {relatedProduct.images?.[0] ? (
                      <img
                        src={relatedProduct.images[0].url}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">
                          {relatedProduct.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${relatedProduct.price}
                      </span>
                      {relatedProduct.averageRating > 0 && (
                        <div className="flex items-center">
                          <StarIconSolid className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-gray-600 ml-1">
                            {relatedProduct.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail