import { useEffect } from 'react'
import useSettingsStore from '../stores/settingsStore'

const useSEO = (seoData = {}) => {
  const { 
    fetchSettings,
    getSiteName,
    getMetaTitle,
    getMetaDescription,
    getSiteUrl 
  } = useSettingsStore()

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  // Generate page-specific SEO data
  const generateSEO = (pageType, data = {}) => {
    const siteName = getSiteName()
    const siteUrl = getSiteUrl()
    const baseTitle = getMetaTitle()
    const baseDescription = getMetaDescription()

    const seoConfig = {
      home: {
        title: baseTitle,
        description: baseDescription,
        url: '/'
      },
      shop: {
        title: `Shop Online - ${siteName}`,
        description: `Browse thousands of products on ${siteName}. ${baseDescription}`,
        url: '/shop'
      },
      categories: {
        title: `Categories - ${siteName}`,
        description: `Shop by category on ${siteName}. Find electronics, fashion, home goods and more.`,
        url: '/categories'
      },
      category: {
        title: data.categoryName ? `${data.categoryName} - ${siteName}` : `Category - ${siteName}`,
        description: data.categoryDescription || `Shop ${data.categoryName || 'products'} on ${siteName}`,
        url: `/categories/${data.categorySlug || ''}`
      },
      product: {
        title: data.productName ? `${data.productName} - ${siteName}` : `Product - ${siteName}`,
        description: data.productDescription || `Buy ${data.productName || 'this product'} on ${siteName}`,
        url: `/product/${data.productSlug || ''}`,
        image: data.productImage,
        type: 'product'
      },
      search: {
        title: data.query ? `Search: ${data.query} - ${siteName}` : `Search - ${siteName}`,
        description: data.query ? `Search results for "${data.query}" on ${siteName}` : `Search products on ${siteName}`,
        url: `/search${data.query ? `?q=${encodeURIComponent(data.query)}` : ''}`
      },
      cart: {
        title: `Shopping Cart - ${siteName}`,
        description: `Review your cart and checkout on ${siteName}`,
        url: '/cart',
        noindex: true
      },
      checkout: {
        title: `Checkout - ${siteName}`,
        description: `Complete your purchase on ${siteName}`,
        url: '/checkout',
        noindex: true
      },
      account: {
        title: `My Account - ${siteName}`,
        description: `Manage your account on ${siteName}`,
        url: '/account',
        noindex: true
      },
      about: {
        title: `About Us - ${siteName}`,
        description: `Learn more about ${siteName}. ${baseDescription}`,
        url: '/about'
      },
      contact: {
        title: `Contact Us - ${siteName}`,
        description: `Get in touch with ${siteName}. We're here to help with your shopping needs.`,
        url: '/contact'
      },
      careers: {
        title: `Careers - Join Our Team | ${siteName}`,
        description: `Join our team and help build the future of e-commerce in Kenya. Explore career opportunities at ${siteName}.`,
        url: '/careers'
      },
      press: {
        title: `Press & Media - ${siteName}`,
        description: `Latest news, press releases, and media resources from ${siteName}.`,
        url: '/press'
      },
      support: {
        title: `Support & Help Center - ${siteName}`,
        description: `Get help with your ${siteName} account, orders, payments, and more. 24/7 support available.`,
        url: '/support'
      },
      help: {
        title: `Help Center - ${siteName}`,
        description: `Find answers to your questions about shopping, payments, delivery, and more on ${siteName}.`,
        url: '/help'
      },
      shipping: {
        title: `Shipping Information - Delivery Across Kenya | ${siteName}`,
        description: `Learn about our shipping options, delivery zones, costs, and timeframes. We deliver to all 47 counties in Kenya.`,
        url: '/shipping'
      },
      returns: {
        title: `Returns & Refunds Policy - ${siteName}`,
        description: `Easy returns within 14 days. Learn about our return policy, process, and refund options.`,
        url: '/returns'
      },
      'size-guide': {
        title: `Size Guide - Find Your Perfect Fit | ${siteName}`,
        description: `Complete size guide for clothing, shoes, and accessories. Find your perfect fit with our detailed measurement charts.`,
        url: '/size-guide'
      },
      cookies: {
        title: `Cookie Policy - ${siteName}`,
        description: `Learn about how ${siteName} uses cookies to improve your browsing experience.`,
        url: '/cookies'
      },
      accessibility: {
        title: `Accessibility Statement - ${siteName}`,
        description: `${siteName} is committed to digital accessibility. Learn about our accessibility features and compliance standards.`,
        url: '/accessibility'
      },
      privacy: {
        title: `Privacy Policy - ${siteName}`,
        description: `Learn how ${siteName} protects your privacy and handles your personal information.`,
        url: '/privacy-policy'
      },
      terms: {
        title: `Terms of Service - ${siteName}`,
        description: `Terms and conditions for using ${siteName} services.`,
        url: '/terms'
      }
    }

    const config = seoConfig[pageType] || {
      title: `${siteName}`,
      description: baseDescription,
      url: '/'
    }

    // Merge with custom seoData
    return {
      ...config,
      ...seoData,
      url: seoData.url || config.url
    }
  }

  // Track page view for analytics
  const trackPageView = (pageName, additionalData = {}) => {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: pageName,
        page_location: window.location.href,
        ...additionalData
      })
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'PageView', {
        content_name: pageName,
        ...additionalData
      })
    }
  }

  // Track e-commerce events
  const trackEvent = (eventName, eventData = {}) => {
    // Google Analytics Enhanced E-commerce
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, eventData)
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', eventName, eventData)
    }
  }

  // Common e-commerce tracking functions
  const trackPurchase = (orderData) => {
    trackEvent('purchase', {
      transaction_id: orderData.orderId,
      value: orderData.total,
      currency: 'KES',
      items: orderData.items
    })
  }

  const trackAddToCart = (productData) => {
    trackEvent('add_to_cart', {
      currency: 'KES',
      value: productData.price,
      items: [{
        item_id: productData.id,
        item_name: productData.name,
        category: productData.category,
        quantity: productData.quantity,
        price: productData.price
      }]
    })
  }

  const trackViewItem = (productData) => {
    trackEvent('view_item', {
      currency: 'KES',
      value: productData.price,
      items: [{
        item_id: productData.id,
        item_name: productData.name,
        category: productData.category,
        price: productData.price
      }]
    })
  }

  const trackSearch = (searchTerm) => {
    trackEvent('search', {
      search_term: searchTerm
    })
  }

  return {
    generateSEO,
    trackPageView,
    trackEvent,
    trackPurchase,
    trackAddToCart,
    trackViewItem,
    trackSearch
  }
}

export default useSEO