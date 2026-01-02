import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import api from '../../services/api'
import toast from 'react-hot-toast'

const AdminProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFiles, setImageFiles] = useState([])
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
    cost: '',
    sku: '',
    barcode: '',
    category: '',
    subcategory: '',
    brand: '',
    tags: [],
    trackQuantity: true,
    quantity: '',
    lowStockThreshold: '5',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    variants: [],
    specifications: [],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    status: 'active',
    featured: false
  })

  useEffect(() => {
    fetchCategories()
    if (isEditing) {
      fetchProduct()
    }
  }, [id, isEditing])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      setCategories(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchProduct = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/admin/products/${id}`)
      const product = response.data.data
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        price: product.price?.toString() || '',
        comparePrice: product.comparePrice?.toString() || '',
        cost: product.cost?.toString() || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        category: product.category?._id || '',
        subcategory: product.subcategory || '',
        brand: product.brand || '',
        tags: product.tags || [],
        trackQuantity: product.trackQuantity !== false,
        quantity: product.quantity?.toString() || '',
        lowStockThreshold: product.lowStockThreshold?.toString() || '5',
        weight: product.weight?.toString() || '',
        dimensions: {
          length: product.dimensions?.length?.toString() || '',
          width: product.dimensions?.width?.toString() || '',
          height: product.dimensions?.height?.toString() || ''
        },
        variants: product.variants || [],
        specifications: product.specifications || [],
        seoTitle: product.seoTitle || '',
        seoDescription: product.seoDescription || '',
        seoKeywords: product.seoKeywords || [],
        status: product.status || 'active',
        featured: product.featured || false
      })
    } catch (error) {
      console.error('Failed to fetch product:', error)
      toast.error('Failed to load product')
      navigate('/admin/products')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        quantity: formData.trackQuantity ? parseInt(formData.quantity) || 0 : undefined,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        dimensions: {
          length: formData.dimensions.length ? parseFloat(formData.dimensions.length) : undefined,
          width: formData.dimensions.width ? parseFloat(formData.dimensions.width) : undefined,
          height: formData.dimensions.height ? parseFloat(formData.dimensions.height) : undefined
        }
      }

      // Remove empty dimensions
      if (!submitData.dimensions.length && !submitData.dimensions.width && !submitData.dimensions.height) {
        delete submitData.dimensions
      }

      let response
      if (isEditing) {
        response = await api.put(`/admin/products/${id}`, submitData)
        toast.success('Product updated successfully')
      } else {
        response = await api.post('/admin/products', submitData)
        toast.success('Product created successfully')
      }

      // Handle image uploads if any
      if (imageFiles.length > 0) {
        const productId = response.data.data._id
        const formData = new FormData()
        imageFiles.forEach(file => {
          formData.append('images', file)
        })
        
        await api.post(`/admin/products/${productId}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      navigate('/admin/products')
    } catch (error) {
      console.error('Failed to save product:', error)
      toast.error(error.response?.data?.message || 'Failed to save product')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }))
  }

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const addVariant = () => {
    addArrayItem('variants', { name: '', options: [''] })
  }

  const addVariantOption = (variantIndex) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === variantIndex 
          ? { ...variant, options: [...variant.options, ''] }
          : variant
      )
    }))
  }

  const removeVariantOption = (variantIndex, optionIndex) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === variantIndex 
          ? { ...variant, options: variant.options.filter((_, j) => j !== optionIndex) }
          : variant
      )
    }))
  }

  const addSpecification = () => {
    addArrayItem('specifications', { name: '', value: '' })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(prev => [...prev, ...files])
  }

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48"></div>
        <div className="skeleton h-96 w-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update product information' : 'Create a new product for your store'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="input"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                    className="input"
                    placeholder="Brief product description"
                    maxLength={200}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="input"
                    rows={6}
                    placeholder="Detailed product description"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <PhotoIcon className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB each)</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {imageFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Product Variants</h2>
                <button
                  type="button"
                  onClick={addVariant}
                  className="btn-outline btn-sm flex items-center space-x-1"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Variant</span>
                </button>
              </div>

              {formData.variants.map((variant, variantIndex) => (
                <div key={variantIndex} className="border rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => handleArrayChange('variants', variantIndex, { ...variant, name: e.target.value })}
                      className="input flex-1 mr-4"
                      placeholder="Variant name (e.g., Size, Color)"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('variants', variantIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {variant.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newVariants = [...formData.variants]
                            newVariants[variantIndex].options[optionIndex] = e.target.value
                            setFormData(prev => ({ ...prev, variants: newVariants }))
                          }}
                          className="input flex-1"
                          placeholder="Option value"
                        />
                        <button
                          type="button"
                          onClick={() => removeVariantOption(variantIndex, optionIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addVariantOption(variantIndex)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      + Add Option
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="btn-outline btn-sm flex items-center space-x-1"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Specification</span>
                </button>
              </div>

              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex items-center space-x-4 mb-3">
                  <input
                    type="text"
                    value={spec.name}
                    onChange={(e) => handleArrayChange('specifications', index, { ...spec, name: e.target.value })}
                    className="input flex-1"
                    placeholder="Specification name"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleArrayChange('specifications', index, { ...spec, value: e.target.value })}
                    className="input flex-1"
                    placeholder="Specification value"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('specifications', index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="input"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compare at Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.comparePrice}
                    onChange={(e) => handleInputChange('comparePrice', e.target.value)}
                    className="input"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost per Item
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', e.target.value)}
                    className="input"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    className="input"
                    placeholder="Product SKU"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Barcode
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => handleInputChange('barcode', e.target.value)}
                    className="input"
                    placeholder="Product barcode"
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.trackQuantity}
                      onChange={(e) => handleInputChange('trackQuantity', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Track quantity</span>
                  </label>
                </div>

                {formData.trackQuantity && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        className="input"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Low Stock Threshold
                      </label>
                      <input
                        type="number"
                        value={formData.lowStockThreshold}
                        onChange={(e) => handleInputChange('lowStockThreshold', e.target.value)}
                        className="input"
                        placeholder="5"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Organization */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="input"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    className="input"
                    placeholder="Product brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                    className="input"
                    placeholder="Enter tags separated by commas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="input"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured product</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
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
            <span>{isSubmitting ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminProductForm