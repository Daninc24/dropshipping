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
  EyeIcon
} from '@heroicons/react/24/outline'
import api from '../../services/api'
import toast from 'react-hot-toast'

const AdminSettings = () => {
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
    { id: 'maintenance', name: 'Maintenance', icon: XMarkIcon }
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
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your store configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center space-x-2"
        >
          <CheckIcon className="h-5 w-5" />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
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
                    placeholder="My E-commerce Store"
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
                    placeholder="https://mystore.com"
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
                    placeholder="Your one-stop shop for amazing products"
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
                    placeholder="contact@mystore.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => handleInputChange('general', 'supportEmail', e.target.value)}
                    className="input"
                    placeholder="support@mystore.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.general.phone}
                    onChange={(e) => handleInputChange('general', 'phone', e.target.value)}
                    className="input"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={settings.general.currency}
                    onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
                    className="input"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={settings.general.address}
                    onChange={(e) => handleInputChange('general', 'address', e.target.value)}
                    rows={2}
                    className="input"
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Shipping Settings */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Free Shipping Threshold ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.shipping.freeShippingThreshold || 0}
                    onChange={(e) => handleInputChange('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Standard Shipping Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.shipping.standardShippingCost || 0}
                    onChange={(e) => handleInputChange('shipping', 'standardShippingCost', parseFloat(e.target.value))}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Express Shipping Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.shipping.expressShippingCost || 0}
                    onChange={(e) => handleInputChange('shipping', 'expressShippingCost', parseFloat(e.target.value))}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overnight Shipping Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.shipping.overnightShippingCost || 0}
                    onChange={(e) => handleInputChange('shipping', 'overnightShippingCost', parseFloat(e.target.value))}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Processing Time
                  </label>
                  <input
                    type="text"
                    value={settings.shipping.processingTime || ''}
                    onChange={(e) => handleInputChange('shipping', 'processingTime', e.target.value)}
                    className="input"
                    placeholder="1-2 business days"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Regions (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(settings.shipping.shippingRegions || []).join(', ')}
                    onChange={(e) => handleArrayChange('shipping', 'shippingRegions', e.target.value)}
                    className="input"
                    placeholder="US, CA, UK"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Accepted Payment Methods
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'credit_card', label: 'Credit/Debit Cards' },
                    { id: 'paypal', label: 'PayPal' },
                    { id: 'apple_pay', label: 'Apple Pay' },
                    { id: 'google_pay', label: 'Google Pay' }
                  ].map((method) => (
                    <label key={method.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(settings.payment.acceptedMethods || []).includes(method.id)}
                        onChange={(e) => {
                          const currentMethods = settings.payment.acceptedMethods || []
                          const methods = e.target.checked
                            ? [...currentMethods, method.id]
                            : currentMethods.filter(m => m !== method.id)
                          handleInputChange('payment', 'acceptedMethods', methods)
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={(settings.payment.taxRate || 0) * 100}
                    onChange={(e) => handleInputChange('payment', 'taxRate', parseFloat(e.target.value) / 100)}
                    className="input"
                  />
                </div>

                <div className="flex items-center pt-8">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.payment.enableTax}
                      onChange={(e) => handleInputChange('payment', 'enableTax', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable Tax Calculation</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={settings.email.smtpHost || ''}
                    onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
                    className="input"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={settings.email.smtpPort || 587}
                    onChange={(e) => handleInputChange('email', 'smtpPort', parseInt(e.target.value))}
                    className="input"
                    placeholder="587"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    value={settings.email.smtpUser || ''}
                    onChange={(e) => handleInputChange('email', 'smtpUser', e.target.value)}
                    className="input"
                    placeholder="your-email@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
                    className="input"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Email
                  </label>
                  <input
                    type="email"
                    value={settings.email.fromEmail || ''}
                    onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
                    className="input"
                    placeholder="noreply@mystore.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Name
                  </label>
                  <input
                    type="text"
                    value={settings.email.fromName}
                    onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
                    className="input"
                    placeholder="My Store"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.email.enableEmailNotifications}
                    onChange={(e) => handleInputChange('email', 'enableEmailNotifications', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable Email Notifications</span>
                </label>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={settings.security.sessionTimeout || 24}
                    onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={settings.security.maxLoginAttempts || 5}
                    onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="input"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.security.enableTwoFactor}
                    onChange={(e) => handleInputChange('security', 'enableTwoFactor', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable Two-Factor Authentication</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.security.enableCaptcha}
                    onChange={(e) => handleInputChange('security', 'enableCaptcha', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable CAPTCHA</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.security.allowGuestCheckout}
                    onChange={(e) => handleInputChange('security', 'allowGuestCheckout', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Allow Guest Checkout</span>
                </label>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    { key: 'newOrderEmail', label: 'New Order Notifications' },
                    { key: 'lowStockEmail', label: 'Low Stock Alerts' },
                    { key: 'newReviewEmail', label: 'New Review Notifications' },
                    { key: 'newUserEmail', label: 'New User Registrations' },
                    { key: 'systemMaintenanceEmail', label: 'System Maintenance Alerts' }
                  ].map((notification) => (
                    <label key={notification.key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications[notification.key]}
                        onChange={(e) => handleInputChange('notifications', notification.key, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{notification.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminSettings