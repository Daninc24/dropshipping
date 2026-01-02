import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CreditCardIcon,
  TruckIcon,
  MapPinIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import api from '../services/api'
import toast from 'react-hot-toast'

const Checkout = () => {
  const navigate = useNavigate()
  const { items, totalItems, finalPrice, appliedCoupon, discountAmount, clearCart } = useCartStore()
  const { user } = useAuthStore()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [addresses, setAddresses] = useState([])
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })
  
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })
  
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [useNewAddress, setUseNewAddress] = useState(true)
  const [shippingMethod, setShippingMethod] = useState('standard')

  const shippingMethods = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '5-7 business days',
      price: finalPrice >= 100 ? 0 : 10
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '2-3 business days',
      price: 25
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day',
      price: 50
    }
  ]

  const steps = [
    { id: 1, name: 'Shipping', icon: TruckIcon },
    { id: 2, name: 'Payment', icon: CreditCardIcon },
    { id: 3, name: 'Review', icon: CheckCircleIcon }
  ]

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart')
      return
    }
    fetchAddresses()
  }, [items.length, navigate])

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/users/addresses')
      setAddresses(response.data.data || [])
      if (response.data.data?.length > 0) {
        setUseNewAddress(false)
        setSelectedAddress(response.data.data[0]._id)
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    }
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    if (useNewAddress) {
      // Validate shipping info
      const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
      const missing = required.filter(field => !shippingInfo[field])
      if (missing.length > 0) {
        toast.error('Please fill in all required fields')
        return
      }
    } else if (!selectedAddress) {
      toast.error('Please select a shipping address')
      return
    }
    setCurrentStep(2)
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    if (paymentInfo.method === 'card') {
      const required = ['cardNumber', 'expiryDate', 'cvv', 'cardName']
      const missing = required.filter(field => !paymentInfo[field])
      if (missing.length > 0) {
        toast.error('Please fill in all payment details')
        return
      }
    }
    setCurrentStep(3)
  }

  const handlePlaceOrder = async () => {
    setIsLoading(true)
    
    try {
      const selectedShipping = shippingMethods.find(method => method.id === shippingMethod)
      const shippingCost = selectedShipping.price
      const tax = finalPrice * 0.1
      const totalAmount = finalPrice + shippingCost + tax

      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          selectedVariants: item.selectedVariants
        })),
        shippingAddress: useNewAddress ? shippingInfo : selectedAddress,
        paymentMethod: paymentInfo.method,
        shippingMethod: shippingMethod,
        subtotal: finalPrice,
        shippingCost,
        tax,
        totalAmount,
        appliedCoupon: appliedCoupon?.code,
        discountAmount
      }

      const response = await api.post('/orders', orderData)
      
      if (response.data.success) {
        await clearCart()
        toast.success('Order placed successfully!')
        navigate(`/account/orders/${response.data.data._id}`)
      }
    } catch (error) {
      console.error('Failed to place order:', error)
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedShippingMethod = shippingMethods.find(method => method.id === shippingMethod)
  const shippingCost = selectedShippingMethod?.price || 0
  const tax = finalPrice * 0.1
  const totalAmount = finalPrice + shippingCost + tax

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}>
                <step.icon className="h-5 w-5" />
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
              }`}>
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
              
              {/* Address Selection */}
              {addresses.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!useNewAddress}
                        onChange={() => setUseNewAddress(false)}
                        className="mr-2"
                      />
                      Use saved address
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={useNewAddress}
                        onChange={() => setUseNewAddress(true)}
                        className="mr-2"
                      />
                      Use new address
                    </label>
                  </div>

                  {!useNewAddress && (
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <label
                          key={address._id}
                          className={`block p-4 border rounded-lg cursor-pointer ${
                            selectedAddress === address._id
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={address._id}
                            checked={selectedAddress === address._id}
                            onChange={(e) => setSelectedAddress(e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex items-start">
                            <MapPinIcon className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {address.firstName} {address.lastName}
                              </p>
                              <p className="text-gray-600">
                                {address.address}, {address.city}, {address.state} {address.zipCode}
                              </p>
                              <p className="text-gray-600">{address.phone}</p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* New Address Form */}
              {useNewAddress && (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                          className="input pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                          className="input pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                          className="input pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          required
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                          className="input pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="input"
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" className="btn-primary">
                      Continue to Payment
                    </button>
                  </div>
                </form>
              )}

              {!useNewAddress && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!selectedAddress}
                    className="btn-primary disabled:opacity-50"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
              
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-gray-400">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentInfo.method === 'card'}
                        onChange={(e) => setPaymentInfo(prev => ({ ...prev, method: e.target.value }))}
                        className="mr-3"
                      />
                      <CreditCardIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span>Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-gray-400">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentInfo.method === 'paypal'}
                        onChange={(e) => setPaymentInfo(prev => ({ ...prev, method: e.target.value }))}
                        className="mr-3"
                      />
                      <span className="text-blue-600 font-bold mr-3">PayPal</span>
                      <span>Pay with PayPal</span>
                    </label>
                  </div>
                </div>

                {/* Card Details */}
                {paymentInfo.method === 'card' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <div className="relative">
                        <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          placeholder="1234 5678 9012 3456"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                          className="input pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={paymentInfo.cardName}
                        onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardName: e.target.value }))}
                        className="input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <div className="relative">
                          <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            required
                            placeholder="123"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                            className="input pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="btn-outline"
                  >
                    Back to Shipping
                  </button>
                  <button type="submit" className="btn-primary">
                    Review Order
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.product._id}-${JSON.stringify(item.selectedVariants)}`} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {item.product.images?.[0] ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-400">
                            {item.product.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                      {item.selectedVariants?.length > 0 && (
                        <p className="text-sm text-gray-600">
                          {item.selectedVariants.map(v => `${v.name}: ${v.value}`).join(', ')}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="btn-outline"
                >
                  Back to Payment
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            {/* Shipping Method */}
            {currentStep >= 2 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Shipping Method</h4>
                <div className="space-y-2">
                  {shippingMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`block p-3 border rounded-lg cursor-pointer ${
                        shippingMethod === method.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.id}
                        checked={shippingMethod === method.id}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        <p className="font-medium text-gray-900">
                          {method.price === 0 ? 'Free' : `$${method.price}`}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <span className="font-medium">${finalPrice.toFixed(2)}</span>
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
                  {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <LockClosedIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  Your payment information is secure and encrypted
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout