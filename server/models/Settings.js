const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // General Site Settings
  general: {
    siteName: {
      type: String,
      default: 'E-Shop Kenya'
    },
    siteDescription: {
      type: String,
      default: 'Your trusted online shopping destination in Kenya'
    },
    siteUrl: {
      type: String,
      default: 'https://eshop.co.ke'
    },
    contactEmail: {
      type: String,
      default: 'contact@eshop.co.ke'
    },
    supportEmail: {
      type: String,
      default: 'support@eshop.co.ke'
    },
    phone: {
      type: String,
      default: '+254 700 123 456'
    },
    address: {
      type: String,
      default: 'Nairobi, Kenya'
    },
    timezone: {
      type: String,
      default: 'Africa/Nairobi'
    },
    currency: {
      type: String,
      default: 'KES'
    },
    language: {
      type: String,
      default: 'en'
    },
    logo: {
      type: String,
      default: ''
    },
    favicon: {
      type: String,
      default: ''
    }
  },

  // SEO Settings
  seo: {
    metaTitle: {
      type: String,
      default: 'E-Shop Kenya - Online Shopping in Kenya'
    },
    metaDescription: {
      type: String,
      default: 'Shop online in Kenya with E-Shop. Electronics, fashion, home goods and more. Free delivery, M-Pesa payments, and quality products.'
    },
    metaKeywords: {
      type: String,
      default: 'online shopping kenya, e-commerce, electronics, fashion, m-pesa, delivery'
    },
    ogTitle: {
      type: String,
      default: 'E-Shop Kenya - Online Shopping Made Easy'
    },
    ogDescription: {
      type: String,
      default: 'Discover thousands of products with fast delivery across all 47 counties in Kenya. Pay with M-Pesa, cards, or cash on delivery.'
    },
    ogImage: {
      type: String,
      default: ''
    },
    twitterCard: {
      type: String,
      default: 'summary_large_image'
    },
    twitterSite: {
      type: String,
      default: '@EShopKenya'
    },
    googleAnalyticsId: {
      type: String,
      default: ''
    },
    googleTagManagerId: {
      type: String,
      default: ''
    },
    facebookPixelId: {
      type: String,
      default: ''
    },
    enableSitemap: {
      type: Boolean,
      default: true
    },
    enableRobotsTxt: {
      type: Boolean,
      default: true
    }
  },

  // Branding & Theme
  branding: {
    primaryColor: {
      type: String,
      default: '#2563eb'
    },
    secondaryColor: {
      type: String,
      default: '#1e40af'
    },
    accentColor: {
      type: String,
      default: '#dc2626'
    },
    fontFamily: {
      type: String,
      default: 'Inter'
    },
    heroTitle: {
      type: String,
      default: 'Shop Smart, Shop Kenya'
    },
    heroSubtitle: {
      type: String,
      default: 'Discover amazing products with fast delivery across all 47 counties'
    },
    heroImage: {
      type: String,
      default: ''
    },
    footerText: {
      type: String,
      default: 'Your trusted online shopping destination for quality products at great prices.'
    },
    enableDarkMode: {
      type: Boolean,
      default: false
    }
  },

  // Business Information
  business: {
    companyName: {
      type: String,
      default: 'E-Shop Kenya Ltd'
    },
    registrationNumber: {
      type: String,
      default: ''
    },
    vatNumber: {
      type: String,
      default: ''
    },
    businessAddress: {
      type: String,
      default: 'Nairobi, Kenya'
    },
    businessPhone: {
      type: String,
      default: '+254 700 123 456'
    },
    businessEmail: {
      type: String,
      default: 'business@eshop.co.ke'
    },
    workingHours: {
      type: String,
      default: 'Monday - Friday: 8AM - 6PM EAT'
    }
  },

  // Shipping Settings (Kenya-specific)
  shipping: {
    freeShippingThreshold: {
      type: Number,
      default: 2000 // KES
    },
    standardShippingCost: {
      type: Number,
      default: 200 // KES
    },
    expressShippingCost: {
      type: Number,
      default: 500 // KES
    },
    processingTime: {
      type: String,
      default: '1-2 business days'
    },
    enableCountyDelivery: {
      type: Boolean,
      default: true
    },
    maxDeliveryDays: {
      type: Number,
      default: 5
    }
  },

  // Payment Settings (Kenya-specific)
  payment: {
    acceptedMethods: {
      type: [String],
      default: ['mpesa', 'card', 'cod']
    },
    mpesaShortcode: {
      type: String,
      default: ''
    },
    mpesaPasskey: {
      type: String,
      default: ''
    },
    enableMpesa: {
      type: Boolean,
      default: true
    },
    enableCards: {
      type: Boolean,
      default: true
    },
    enableCOD: {
      type: Boolean,
      default: true
    },
    vatRate: {
      type: Number,
      default: 0.16 // 16% VAT in Kenya
    },
    enableVAT: {
      type: Boolean,
      default: true
    },
    currency: {
      type: String,
      default: 'KES'
    }
  },

  // Email Settings
  email: {
    smtpHost: {
      type: String,
      default: ''
    },
    smtpPort: {
      type: Number,
      default: 587
    },
    smtpUser: {
      type: String,
      default: ''
    },
    smtpPassword: {
      type: String,
      default: ''
    },
    fromEmail: {
      type: String,
      default: 'noreply@eshop.co.ke'
    },
    fromName: {
      type: String,
      default: 'E-Shop Kenya'
    },
    enableEmailNotifications: {
      type: Boolean,
      default: true
    }
  },

  // Security Settings
  security: {
    enableTwoFactor: {
      type: Boolean,
      default: false
    },
    sessionTimeout: {
      type: Number,
      default: 24 // hours
    },
    maxLoginAttempts: {
      type: Number,
      default: 5
    },
    enableCaptcha: {
      type: Boolean,
      default: false
    },
    allowGuestCheckout: {
      type: Boolean,
      default: true
    },
    enableAccountVerification: {
      type: Boolean,
      default: true
    }
  },

  // Notification Settings
  notifications: {
    newOrderEmail: {
      type: Boolean,
      default: true
    },
    lowStockEmail: {
      type: Boolean,
      default: true
    },
    newReviewEmail: {
      type: Boolean,
      default: true
    },
    newUserEmail: {
      type: Boolean,
      default: false
    },
    systemMaintenanceEmail: {
      type: Boolean,
      default: true
    },
    enableSMS: {
      type: Boolean,
      default: true
    },
    enablePushNotifications: {
      type: Boolean,
      default: true
    }
  },

  // Social Media
  social: {
    facebook: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    },
    instagram: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    youtube: {
      type: String,
      default: ''
    },
    whatsapp: {
      type: String,
      default: '+254700123456'
    }
  },

  // Features
  features: {
    enableWishlist: {
      type: Boolean,
      default: true
    },
    enableReviews: {
      type: Boolean,
      default: true
    },
    enableCoupons: {
      type: Boolean,
      default: true
    },
    enableWallet: {
      type: Boolean,
      default: true
    },
    enableLoyaltyProgram: {
      type: Boolean,
      default: false
    },
    enableMultiVendor: {
      type: Boolean,
      default: false
    },
    enableBlog: {
      type: Boolean,
      default: false
    },
    enableChat: {
      type: Boolean,
      default: true
    }
  },

  // Maintenance
  maintenance: {
    enabled: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'We are currently performing maintenance. Please check back soon.'
    },
    allowedIPs: {
      type: [String],
      default: []
    }
  }
}, {
  timestamps: true
});

// Static method to get settings (singleton pattern)
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  
  if (!settings) {
    // Create default settings if none exist
    settings = await this.create({});
  }
  
  return settings;
};

// Static method to update settings
settingsSchema.statics.updateSettings = async function(updates) {
  let settings = await this.findOne();
  
  if (!settings) {
    settings = await this.create(updates);
  } else {
    // Deep merge the updates
    Object.keys(updates).forEach(key => {
      if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
        settings[key] = { ...settings[key], ...updates[key] };
      } else {
        settings[key] = updates[key];
      }
    });
    
    await settings.save();
  }
  
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);