import { useState, useEffect } from 'react'
import api from '../services/api'

const ApiTest = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('Testing API calls...')

        // Test products
        const productsRes = await api.get('/products?featured=true&limit=8')
        console.log('Products response:', productsRes.data)
        setProducts(productsRes.data.data || [])

        // Test categories
        const categoriesRes = await api.get('/categories?featured=true&limit=6')
        console.log('Categories response:', categoriesRes.data)
        setCategories(categoriesRes.data.data || [])

        // Test settings
        const settingsRes = await api.get('/settings')
        console.log('Settings response:', settingsRes.data)
        setSettings(settingsRes.data.data || null)

      } catch (err) {
        console.error('API test error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    testApi()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Loading State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Status</h2>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            {error && <p className="text-red-600">Error: {error}</p>}
          </div>

          {/* Products */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Products ({products.length})</h2>
            <div className="space-y-2">
              {products.slice(0, 3).map(product => (
                <div key={product._id} className="text-sm">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-gray-600">${product.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Categories ({categories.length})</h2>
            <div className="space-y-2">
              {categories.slice(0, 3).map(category => (
                <div key={category._id} className="text-sm">
                  <p className="font-medium">{category.name}</p>
                  <p className="text-gray-600">{category.slug}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          {settings ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Site Name:</strong> {settings.general?.siteName}</p>
                <p><strong>Currency:</strong> {settings.general?.currency}</p>
              </div>
              <div>
                <p><strong>Hero Title:</strong> {settings.branding?.heroTitle}</p>
                <p><strong>Free Shipping:</strong> {settings.shipping?.freeShippingThreshold}</p>
              </div>
            </div>
          ) : (
            <p>No settings data</p>
          )}
        </div>

        {/* Raw Data */}
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-4">Raw Data (First Product)</h2>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(products[0], null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default ApiTest