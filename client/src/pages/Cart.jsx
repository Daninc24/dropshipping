import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'

const Cart = () => {
  const navigate = useNavigate()
  const [couponCode, setCouponCode] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  
  const {
    items,
    totalItems,
    totalPrice,
    appliedCoupon,
    discountAmount,
    finalPrice,
    isLoading,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon
  } = useCartStore()
  
  const { isAuthenticated } = useAuthStore()

  const handleQuantityChange = async (productId, newQuantity, selectedVariants) => {
    if (newQuantity < 1) {
      await removeItem(productId, selectedVariants)
    } else {
      await updateQuantity(productId, newQuantity, selectedVariants)
    }
  }

  const handleApplyCoupon = async (e) => {
    e.preventDefault()
    if (!couponCode.trim()) return
    
    setIsApplyingCoupon(true)
    const result = await applyCoupon(couponCode.trim())
    if (result.success) {
      setCouponCode('')
    }
    setIsApplyingCoupon(false)
  }

  const handleRemoveCoupon = async () => {
    await removeCoupon()
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } })
    } else {
      navigate('/checkout')
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBagIcon className="mx-auto h-24 w-24 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-600">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/shop"
            className="mt-6 btn-primary inline-flex items-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Cart Items ({totalItems})
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <CartItem
                  key={`${item.product._id}-${JSON.stringify(item.selectedVariants)}`}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={removeItem}
                  isLoading={isLoading}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border sticky top-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            </div>

            <div className="p-6 space-y-4">
              {/* Coupon Code */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="form-input flex-1"
                    disabled={isApplyingCoupon || !!appliedCoupon}
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !!appliedCoupon || !couponCode.trim()}
                    className="btn-outline btn-sm"
                  >
                    {isApplyingCoupon ? 'Applying...' : 'Apply'}
                  </button>
                </div>
                
                {appliedCoupon && (
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <TagIcon className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">
                        {appliedCoupon.code}
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">
                      -${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {finalPrice >= 100 ? 'Free' : '$10.00'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    ${(finalPrice * 0.1).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>
                    ${(finalPrice + (finalPrice >= 100 ? 0 : 10) + finalPrice * 0.1).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="btn-primary w-full mt-6"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Checkout'}
              </button>

              <div className="text-center">
                <Link
                  to="/shop"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Cart Item Component
const CartItem = ({ item, onQuantityChange, onRemove, isLoading }) => {
  const { product, quantity, selectedVariants } = item
  const mainImage = product.images?.find(img => img.isMain) || product.images?.[0]

  const handleQuantityChange = (newQuantity) => {
    onQuantityChange(product._id, newQuantity, selectedVariants)
  }

  const handleRemove = () => {
    onRemove(product._id, selectedVariants)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6"
    >
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-lg font-bold text-gray-400">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <Link
            to={`/product/${product.slug}`}
            className="text-lg font-medium text-gray-900 hover:text-primary-600 line-clamp-2"
          >
            {product.name}
          </Link>
          
          {selectedVariants && selectedVariants.length > 0 && (
            <div className="mt-1 text-sm text-gray-600">
              {selectedVariants.map((variant, index) => (
                <span key={index}>
                  {variant.name}: {variant.value}
                  {index < selectedVariants.length - 1 && ', '}
                </span>
              ))}
            </div>
          )}
          
          <div className="mt-2 flex items-center justify-between">
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
            
            <div className="text-sm text-gray-600">
              Stock: {product.trackQuantity ? product.quantity : 'In Stock'}
            </div>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={isLoading || quantity <= 1}
            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          
          <span className="w-12 text-center font-medium">{quantity}</span>
          
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isLoading || (product.trackQuantity && quantity >= product.quantity)}
            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isLoading}
          className="p-2 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  )
}

export default Cart