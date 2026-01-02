import { useState, useEffect } from 'react'
import {
  Cog6ToothIcon,
  CurrencyDollarIcon,
  TruckIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  PhotoIcon,
  GlobeAltIcon,
  BellIcon,
  CheckIcon,
  XMarkIcon,
  PaintBrushIcon,
  BuildingOfficeIcon,
  ShareIcon,
  WrenchScrewdriverIcon,
  EyeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import api from '../../services/api'
import toast from 'react-hot-toast'

const EnhancedSettings = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  
  const [settings, setSettings] = useState({
    general: {
      siteName: '',
      siteDescription: '',
      siteUrl: '',
      contactEmail: '',
      supportEmail: '',
      phone: '',
      address: '',
      timezone: '',
      currency: 'KES',
      language: 'en',
      logo: '',
      favicon: ''
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterCard: 'summary_large_image',
      twitterSite: '',
      googleAnalyticsId: '',
      googleTagManagerId: '',
      facebookPixelId: '',
      enableSitemap: true,
      enableRobotsTxt: true
    },
    branding: {
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      accentColor: '#dc2626',
      fontFamily: 'Inter',
      heroTitle: '',
      heroSubtitle: '',
      heroImage: '',
      footerText: '',
      enableDarkMode: false
    },
    business: {
      companyName: '',
      registrationNumber: '',
      vatNumber: '',
      businessAddress: '',
      businessPhone: '',
      businessEmail: '',
      workingHours: ''
    },
    shipping: {
      freeShippingThreshold: 2000,
      standardShippingCost: 200,
      expressShippingCost: 500,
      processingTime: '1-2 business days',
      enableCountyDelivery: true,
      maxDeliveryDays: 5
    },
    payment: {
      acceptedMethods: ['mpesa', 'card', 'cod'],
      mpesaShortcode: '',
      mpesaPasskey: '',
      enableMpesa: true,
      enableCards: true,
      enableCOD: true,
      vatRate: 0.16,
      enableVAT: true,
      currency: 'KES'
    },
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: '',
      fromName: '',
      enableEmailNotifications: true
    },
    security: {
      enableTwoFactor: false,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      enableCaptcha: false,
      allowGuestCheckout: true,
      enableAccountVerification: true
    },
    notifications: {
      newOrderEmail: true,
      lowStockEmail: true,
      newReviewEmail: true,
      newUserEmail: false,
      systemMaintenanceEmail: true,
      enableSMS: true,
      enablePushNotifications: true
    },
    social: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: '',
      whatsapp: ''
    },
    features: {
      enableWishlist: true,
      enableReviews: true,
      enableCoupons: true,
      enableWallet: true,
      enableLoyaltyProgram: false,
      enableMultiVendor: false,
      enableBlog: false,
      enableChat: true
    },
    maintenance: {
      enabled: false,
      message: '',
      allowedIPs: []
    }
  })

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'seo', name: 'SEO', icon: EyeIcon },
    { id: 'branding', name: 'Branding', icon: PaintBrushIcon },
    { id: 'business', name: 'Business', icon: BuildingOfficeIcon },
    { id: 'shipping', name: 'Shipping', icon: TruckIcon },
    { id: 'payment', name: 'Payment', icon: CurrencyDollarIcon },
    { id: 'email', name: 'Email', icon: EnvelopeIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'social', name: 'Social Media', icon: ShareIcon },
    { id: 'features', name: 'Features', icon: WrenchScrewdriverIcon },
    { id: 'maintenance', name: 'Maintenance', icon: ExclamationTriangleIcon }
  ]

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/settings/admin')
      
      // Deep merge to ensure all fields have values
      const apiData = response.data.data || {}
      setSettings(prev => ({
        general: { ...prev.general, ...(apiData.general || {}) },
        seo: { ...prev.seo, ...(apiData.seo || {}) },
        branding: { ...prev.branding, ...(apiData.branding || {}) },
        business: { ...prev.business, ...(apiData.business || {}) },
        shipping: { ...prev.shipping, ...(apiData.shipping || {}) },
        payment: { ...prev.payment, ...(apiData.payment || {}) },
        email: { ...prev.email, ...(apiData.email || {}) },
        security: { ...prev.security, ...(apiData.security || {}) },
        notifications: { ...prev.notifications, ...(apiData.notifications || {}) },
        social: { ...prev.social, ...(apiData.social || {}) },
        features: { ...prev.features, ...(apiData.features || {}) },
        maintenance: { ...prev.maintenance, ...(apiData.maintenance || {}) }
      }))
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await api.put('/settings/admin', settings)
      toast.success('Settings saved successfully')
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleArrayChange = (section, field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean)
    handleInputChange(section, field, array)
  }

  const handleMaintenanceToggle = async () => {
    const newMaintenanceState = !settings.maintenance.enabled
    
    try {
      await api.put('/settings/admin/maintenance', {
        enabled: newMaintenanceState,
        message: settings.maintenance.message,
        allowedIPs: settings.maintenance.allowedIPs
      })
      
      handleInputChange('maintenance', 'enabled', newMaintenanceState)
      toast.success(`Maintenance mode ${newMaintenanceState ? 'enabled' : 'disabled'}`)
    } catch (error) {
      console.error('Failed to toggle maintenance mode:', error)
      toast.error('Failed to update maintenance mode')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48"></div>
        <div className="skeleton h-12 w-full"></div>
        <div className="skeleton h-96 w-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enhanced Settings</h1>
          <p className="text-gray-600">Manage your store configuration and SEO</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => window.open('/api/settings', '_blank')}
            className="btn-outline flex items-center space-x-2"
          >
            <EyeIcon className="h-5 w-5" />
            <span>Preview Public Settings</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center space-x-2"
          >
            <CheckIcon className="h-5 w-5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Maintenance Mode Alert */}
      {settings.maintenance.enabled && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">
              Maintenance mode is currently enabled. Your site is not accessible to visitors.
            </span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.general.siteName || ''}
                    onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                    className="input"
                    placeholder="E-Shop Kenya"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site URL
                  </label>
                  <input
                    type="url"
                    value={settings.general.siteUrl || ''}
                    onChange={(e) => handleInputChange('general', 'siteUrl', e.target.value)}
                    className="input"
                    placeholder="https://eshop.co.ke"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={settings.general.siteDescription || ''}
                    onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                    rows={3}
                    className="input"
                    placeholder="Your trusted online shopping destination in Kenya"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.general.contactEmail || ''}
                    onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
                    className="input"
                    placeholder="contact@eshop.co.ke"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.general.supportEmail || ''}
                    onChange={(e) => handleInputChange('general', 'supportEmail', e.target.value)}
                    className="input"
                    placeholder="support@eshop.co.ke"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.general.phone || ''}
                    onChange={(e) => handleInputChange('general', 'phone', e.target.value)}
                    className="input"
                    placeholder="+254 700 123 456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={settings.general.currency || 'KES'}
                    onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
                    className="input"
                  >
                    <option value="KES">KES - Kenyan Shilling</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={settings.general.address || ''}
                    onChange={(e) => handleInputChange('general', 'address', e.target.value)}
                    rows={2}
                    className="input"
                    placeholder="Nairobi, Kenya"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={settings.general.logo || ''}
                    onChange={(e) => handleInputChange('general', 'logo', e.target.value)}
                    className="input"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favicon URL
                  </label>
                  <input
                    type="url"
                    value={settings.general.favicon || ''}
                    onChange={(e) => handleInputChange('general', 'favicon', e.target.value)}
                    className="input"
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-blue-800 mb-2">SEO Configuration</h3>
                <p className="text-sm text-blue-600">
                  These settings control how your site appears in search engines and social media.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={settings.seo.metaTitle || ''}
                    onChange={(e) => handleInputChange('seo', 'metaTitle', e.target.value)}
                    className="input"
                    placeholder="E-Shop Kenya - Online Shopping in Kenya"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(settings.seo.metaTitle || '').length}/60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={settings.seo.metaDescription || ''}
                    onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
                    rows={3}
                    className="input"
                    placeholder="Shop online in Kenya with E-Shop. Electronics, fashion, home goods and more."
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(settings.seo.metaDescription || '').length}/160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={settings.seo.metaKeywords || ''}
                    onChange={(e) => handleInputChange('seo', 'metaKeywords', e.target.value)}
                    className="input"
                    placeholder="online shopping kenya, e-commerce, electronics, fashion"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Open Graph Title
                    </label>
                    <input
                      type="text"
                      value={settings.seo.ogTitle || ''}
                      onChange={(e) => handleInputChange('seo', 'ogTitle', e.target.value)}
                      className="input"
                      placeholder="E-Shop Kenya - Online Shopping Made Easy"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Open Graph Image
                    </label>
                    <input
                      type="url"
                      value={settings.seo.ogImage || ''}
                      onChange={(e) => handleInputChange('seo', 'ogImage', e.target.value)}
                      className="input"
                      placeholder="https://example.com/og-image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Open Graph Description
                  </label>
                  <textarea
                    value={settings.seo.ogDescription || ''}
                    onChange={(e) => handleInputChange('seo', 'ogDescription', e.target.value)}
                    rows={2}
                    className="input"
                    placeholder="Discover thousands of products with fast delivery across Kenya."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      value={settings.seo.googleAnalyticsId || ''}
                      onChange={(e) => handleInputChange('seo', 'googleAnalyticsId', e.target.value)}
                      className="input"
                      placeholder="GA-XXXXXXXXX-X"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Tag Manager ID
                    </label>
                    <input
                      type="text"
                      value={settings.seo.googleTagManagerId || ''}
                      onChange={(e) => handleInputChange('seo', 'googleTagManagerId', e.target.value)}
                      className="input"
                      placeholder="GTM-XXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook Pixel ID
                    </label>
                    <input
                      type="text"
                      value={settings.seo.facebookPixelId || ''}
                      onChange={(e) => handleInputChange('seo', 'facebookPixelId', e.target.value)}
                      className="input"
                      placeholder="123456789012345"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.seo.enableSitemap || false}
                      onChange={(e) => handleInputChange('seo', 'enableSitemap', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable XML Sitemap</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.seo.enableRobotsTxt || false}
                      onChange={(e) => handleInputChange('seo', 'enableRobotsTxt', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable Robots.txt</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Continue with other tabs... */}
          {/* For brevity, I'll add a few more key sections */}

          {/* Maintenance Mode */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">Maintenance Mode</h3>
                <p className="text-sm text-yellow-600">
                  When enabled, your site will show a maintenance page to visitors. Admins can still access the site.
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.maintenance.enabled || false}
                    onChange={handleMaintenanceToggle}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Enable Maintenance Mode
                  </span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance Message
                  </label>
                  <textarea
                    value={settings.maintenance.message || ''}
                    onChange={(e) => handleInputChange('maintenance', 'message', e.target.value)}
                    rows={3}
                    className="input"
                    placeholder="We are currently performing maintenance. Please check back soon."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowed IP Addresses (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(settings.maintenance.allowedIPs || []).join(', ')}
                    onChange={(e) => handleArrayChange('maintenance', 'allowedIPs', e.target.value)}
                    className="input"
                    placeholder="192.168.1.1, 10.0.0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    These IP addresses will be able to access the site during maintenance.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EnhancedSettings