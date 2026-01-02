import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhotoIcon,
  CheckIcon,
  XMarkIcon,
  FolderIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import api from '../../services/api'
import toast from 'react-hot-toast'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    featured: false,
    status: 'active',
    seoTitle: '',
    seoDescription: '',
    sortOrder: 0
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/categories?includeStats=true')
      setCategories(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData)
        toast.success('Category updated successfully')
      } else {
        await api.post('/categories', formData)
        toast.success('Category created successfully')
      }
      
      setShowModal(false)
      setEditingCategory(null)
      resetForm()
      fetchCategories()
    } catch (error) {
      console.error('Failed to save category:', error)
      toast.error(error.response?.data?.message || 'Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      featured: category.featured,
      status: category.status,
      seoTitle: category.seoTitle || '',
      seoDescription: category.seoDescription || '',
      sortOrder: category.sortOrder || 0
    })
    setShowModal(true)
  }

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return

    try {
      await api.delete(`/categories/${categoryId}`)
      toast.success('Category deleted successfully')
      fetchCategories()
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast.error('Failed to delete category')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      featured: false,
      status: 'active',
      seoTitle: '',
      seoDescription: '',
      sortOrder: 0
    })
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCategory(null)
    resetForm()
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48"></div>
        <div className="skeleton h-12 w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage your product categories</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    {category.image?.url ? (
                      <img
                        src={category.image.url}
                        alt={category.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                    ) : (
                      <FolderIcon className="h-6 w-6 text-primary-600" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.productCount || 0} products
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {category.featured && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <TagIcon className="h-3 w-3 mr-1" />
                      Featured
                    </span>
                  )}
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    category.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {category.status}
                  </span>
                </div>
              </div>

              {category.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Order: {category.sortOrder || 0}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(`/categories/${category.slug}`, '_blank')}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    title="View Category"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-primary-600 hover:text-primary-700 rounded-full hover:bg-primary-50"
                    title="Edit Category"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="p-2 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
                    title="Delete Category"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <FolderIcon className="mx-auto h-24 w-24 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
            {searchTerm ? 'No categories found' : 'No categories yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Get started by creating your first category'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              Add Category
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCloseModal} />
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input"
                    placeholder="Category name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="input"
                    rows={3}
                    placeholder="Category description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="input"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                      className="input"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured category</span>
                  </label>
                </div>

                {/* SEO Fields */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">SEO Settings</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SEO Title
                      </label>
                      <input
                        type="text"
                        value={formData.seoTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                        className="input"
                        placeholder="SEO title for search engines"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SEO Description
                      </label>
                      <textarea
                        value={formData.seoDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                        className="input"
                        rows={2}
                        placeholder="SEO description for search engines"
                      />
                    </div>
                  </div>
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
                    <span>{isSubmitting ? 'Saving...' : 'Save Category'}</span>
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

export default AdminCategories