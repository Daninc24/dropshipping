import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Settings state
      settings: null,
      isLoading: false,
      lastFetched: null,

      // Actions
      fetchSettings: async (force = false) => {
        const { settings, lastFetched, isLoading } = get()
        
        // Prevent multiple simultaneous requests
        if (isLoading) {
          return settings
        }
        
        // Don't fetch if we have recent data (unless forced)
        if (!force && settings && lastFetched && Date.now() - lastFetched < 10 * 60 * 1000) {
          return settings
        }

        try {
          set({ isLoading: true })
          const response = await api.get('/settings')
          const fetchedSettings = response.data.data
          
          set({ 
            settings: fetchedSettings, 
            lastFetched: Date.now(),
            isLoading: false 
          })
          
          return fetchedSettings
        } catch (error) {
          console.error('Failed to fetch settings:', error)
          set({ isLoading: false })
          
          // Return cached settings if available, even if stale
          if (settings) {
            console.warn('Using cached settings due to fetch error')
            return settings
          }
          
          return null
        }
      },

      // Get specific setting value with fallback
      getSetting: (path, fallback = null) => {
        const { settings } = get()
        if (!settings) return fallback

        const keys = path.split('.')
        let value = settings
        
        for (const key of keys) {
          if (value && typeof value === 'object' && key in value) {
            value = value[key]
          } else {
            return fallback
          }
        }
        
        return value !== undefined ? value : fallback
      },

      // Convenience getters for commonly used settings
      getSiteName: () => get().getSetting('general.siteName', 'E-Shop Kenya'),
      getSiteDescription: () => get().getSetting('general.siteDescription', 'Your trusted online shopping destination'),
      getSiteUrl: () => get().getSetting('general.siteUrl', 'https://eshop.co.ke'),
      getContactEmail: () => get().getSetting('general.contactEmail', 'contact@eshop.co.ke'),
      getPhone: () => get().getSetting('general.phone', '+254 700 123 456'),
      getCurrency: () => get().getSetting('general.currency', 'KES'),
      getLogo: () => get().getSetting('general.logo', ''),
      getFavicon: () => get().getSetting('general.favicon', ''),

      // SEO getters
      getMetaTitle: () => get().getSetting('seo.metaTitle', 'E-Shop Kenya - Online Shopping in Kenya'),
      getMetaDescription: () => get().getSetting('seo.metaDescription', 'Shop online in Kenya with E-Shop'),
      getMetaKeywords: () => get().getSetting('seo.metaKeywords', 'online shopping kenya, e-commerce'),
      getOgTitle: () => get().getSetting('seo.ogTitle', 'E-Shop Kenya'),
      getOgDescription: () => get().getSetting('seo.ogDescription', 'Discover thousands of products'),
      getOgImage: () => get().getSetting('seo.ogImage', ''),
      getGoogleAnalyticsId: () => get().getSetting('seo.googleAnalyticsId', ''),
      getFacebookPixelId: () => get().getSetting('seo.facebookPixelId', ''),

      // Branding getters
      getPrimaryColor: () => get().getSetting('branding.primaryColor', '#2563eb'),
      getSecondaryColor: () => get().getSetting('branding.secondaryColor', '#1e40af'),
      getAccentColor: () => get().getSetting('branding.accentColor', '#dc2626'),
      getHeroTitle: () => get().getSetting('branding.heroTitle', 'Shop Smart, Shop Kenya'),
      getHeroSubtitle: () => get().getSetting('branding.heroSubtitle', 'Discover amazing products with fast delivery'),
      getHeroImage: () => get().getSetting('branding.heroImage', ''),
      getFooterText: () => get().getSetting('branding.footerText', 'Your trusted online shopping destination'),

      // Business getters
      getCompanyName: () => get().getSetting('business.companyName', 'E-Shop Kenya Ltd'),
      getBusinessAddress: () => get().getSetting('business.businessAddress', 'Nairobi, Kenya'),
      getBusinessPhone: () => get().getSetting('business.businessPhone', '+254 700 123 456'),
      getBusinessEmail: () => get().getSetting('business.businessEmail', 'business@eshop.co.ke'),
      getWorkingHours: () => get().getSetting('business.workingHours', 'Monday - Friday: 8AM - 6PM EAT'),

      // Payment getters
      getAcceptedPaymentMethods: () => get().getSetting('payment.acceptedMethods', ['mpesa', 'card', 'cod']),
      isPaymentMethodEnabled: (method) => {
        const methods = get().getAcceptedPaymentMethods()
        return methods.includes(method)
      },
      getVATRate: () => get().getSetting('payment.vatRate', 0.16),
      isVATEnabled: () => get().getSetting('payment.enableVAT', true),

      // Shipping getters
      getFreeShippingThreshold: () => get().getSetting('shipping.freeShippingThreshold', 2000),
      getStandardShippingCost: () => get().getSetting('shipping.standardShippingCost', 200),
      getExpressShippingCost: () => get().getSetting('shipping.expressShippingCost', 500),
      getProcessingTime: () => get().getSetting('shipping.processingTime', '1-2 business days'),

      // Social media getters
      getSocialMedia: () => get().getSetting('social', {}),
      getFacebookUrl: () => get().getSetting('social.facebook', ''),
      getTwitterUrl: () => get().getSetting('social.twitter', ''),
      getInstagramUrl: () => get().getSetting('social.instagram', ''),
      getWhatsAppNumber: () => get().getSetting('social.whatsapp', '+254700123456'),

      // Feature flags
      isFeatureEnabled: (feature) => get().getSetting(`features.${feature}`, false),
      isWishlistEnabled: () => get().getSetting('features.enableWishlist', true),
      areReviewsEnabled: () => get().getSetting('features.enableReviews', true),
      areCouponsEnabled: () => get().getSetting('features.enableCoupons', true),
      isWalletEnabled: () => get().getSetting('features.enableWallet', true),
      isChatEnabled: () => get().getSetting('features.enableChat', true),

      // Maintenance mode
      isMaintenanceMode: () => get().getSetting('maintenance.enabled', false),
      getMaintenanceMessage: () => get().getSetting('maintenance.message', 'We are currently performing maintenance'),

      // Clear settings (for logout or refresh)
      clearSettings: () => set({ settings: null, lastFetched: null }),

      // Update local settings (after admin changes)
      updateLocalSettings: (newSettings) => set({ 
        settings: newSettings, 
        lastFetched: Date.now() 
      })
    }),
    {
      name: 'settings-store',
      partialize: (state) => ({
        settings: state.settings,
        lastFetched: state.lastFetched
      })
    }
  )
)

export default useSettingsStore