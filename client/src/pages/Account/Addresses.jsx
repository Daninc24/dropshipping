import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  PlusIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  HomeIcon,
  BuildingOfficeIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import api from '../../services/api'
import toast from 'react-hot-toast'

const Addresses = () => {
  const [addresses, setAddresses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    type: 'home',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    isDefault: false
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/users/addresses')
      setAddresses(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
      toast.error('Failed to load addresses')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingAddress) {
        await api.put(`/users/addresses/${editingAddress._id}`, formData)
        toast.success('Address updated successfully')
      } else {
        await api.post('/users/addresses', formData)
        toast.success('Address added successfully')
      }
      
      setShowModal(false)
      setEditingAddress(null)
      resetForm()
      fetchAddresses()
    } catch (error) {
      console.error('Failed to save address:', error)
      toast.error(error.response?.data?.message || 'Failed to save address')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (address) => {
    setEditingAddress(address)
    setFormData({
      type: address.type || 'home',
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      company: address.company || '',
      address: address.address || '',
      apartment: address.apartment || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      country: address.country || 'United States',
      phone: address.phone || '',
      isDefault: address.isDefault || false
    })
    setShowModal(true)
  }

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return

    try {
      await api.delete(`/users/addresses/${addressId}`)
      toast.success('Address deleted successfully')
      fetchAddresses()
    } catch (error) {
      console.error('Failed to delete address:', error)
      toast.error('Failed to delete address')
    }
  }

  const handleSetDefault = async (addressId) => {
    try {
      await api.patch(`/users/addresses/${addressId}/default`)
      toast.success('Default address updated')
      fetchAddresses()
    } catch (error) {
      console.error('Failed to set default address:', error)
      toast.error('Failed to set default address')
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'home',
      firstName: '',
      lastName: '',
      company: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      phone: '',
      isDefault: false
    })
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingAddress(null)
    resetForm()
  }

  const getAddressIcon = (type) => {
    switch (type) {
      case 'work': return BuildingOfficeIcon
      case 'home':
      default: return HomeIcon
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48"></div>
        <div className="skeleton h-12 w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-48 w-full"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
          <p className="text-gray-600">Manage your shipping and billing addresses</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Address</span>
        </button>
      </div>

      {/* Addresses Grid */}
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address, index) => {
            const AddressIcon = getAddressIcon(address.type)
            return (
              <motion.div
                key={address._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow relative"
              >
                {/* Default Badge */}
                {address.isDefault && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      <StarIconSolid className="h-3 w-3 mr-1" />
                      Default
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <AddressIcon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                          {address.type} Address
                        </h3>
                        <p className="text-sm text-gray-500">
                          {address.firstName} {address.lastName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {address.company && (
                      <p className="text-sm text-gray-600">{address.company}</p>
                    )}
                    <p className="text-sm text-gray-900">
                      {address.address}
                      {address.apartment && `, ${address.apartment}`}
                    </p>
                    <p className="text-sm text-gray-900">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-sm text-gray-900">{address.country}</p>
                    {address.phone && (
                      <p className="text-sm text-gray-600">{address.phone}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address._id)}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(address)}
                        className="p-2 text-primary-600 hover:text-primary-700 rounded-full hover:bg-primary-50"
                        title="Edit Address"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(address._id)}
                        className="p-2 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
                        title="Delete Address"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPinIcon className="mx-auto h-24 w-24 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
            No addresses saved
          </h3>
          <p className="text-gray-600 mb-6">
            Add your addresses to make checkout faster and easier.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            Add Your First Address
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCloseModal} />
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Address Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Address Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="home"
                        checked={formData.type === 'home'}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="mr-2"
                      />
                      <HomeIcon className="h-5 w-5 mr-1" />
                      Home
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="work"
                        checked={formData.type === 'work'}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="mr-2"
                      />
                      <BuildingOfficeIcon className="h-5 w-5 mr-1" />
                      Work
                    </label>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="input"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="input"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="input"
                    placeholder="Company name"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="input"
                    placeholder="Street address"
                  />
                </div>

                {/* Apartment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apartment, suite, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.apartment}
                    onChange={(e) => setFormData(prev => ({ ...prev, apartment: e.target.value }))}
                    className="input"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>

                {/* City, State, ZIP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="input"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      className="input"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                      className="input"
                      placeholder="ZIP code"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="input"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    {/* Add more countries as needed */}
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="input"
                    placeholder="Phone number"
                  />
                </div>

                {/* Default Address */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Set as default address</span>
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <CheckIcon className="h-4 w-4" />
                    <span>{isSubmitting ? 'Saving...' : 'Save Address'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Addresses