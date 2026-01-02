const Settings = require('../models/Settings');
const asyncHandler = require('../utils/asyncHandler');
const AuditLog = require('../models/AuditLog');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public (for general site settings)
exports.getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings();
  
  // Only return public settings (no sensitive data)
  const publicSettings = {
    general: {
      siteName: settings.general.siteName,
      siteDescription: settings.general.siteDescription,
      siteUrl: settings.general.siteUrl,
      contactEmail: settings.general.contactEmail,
      phone: settings.general.phone,
      address: settings.general.address,
      currency: settings.general.currency,
      language: settings.general.language,
      logo: settings.general.logo,
      favicon: settings.general.favicon
    },
    seo: {
      metaTitle: settings.seo.metaTitle,
      metaDescription: settings.seo.metaDescription,
      metaKeywords: settings.seo.metaKeywords,
      ogTitle: settings.seo.ogTitle,
      ogDescription: settings.seo.ogDescription,
      ogImage: settings.seo.ogImage,
      twitterCard: settings.seo.twitterCard,
      twitterSite: settings.seo.twitterSite,
      googleAnalyticsId: settings.seo.googleAnalyticsId,
      googleTagManagerId: settings.seo.googleTagManagerId,
      facebookPixelId: settings.seo.facebookPixelId
    },
    branding: settings.branding,
    business: settings.business,
    shipping: {
      freeShippingThreshold: settings.shipping.freeShippingThreshold,
      standardShippingCost: settings.shipping.standardShippingCost,
      expressShippingCost: settings.shipping.expressShippingCost,
      processingTime: settings.shipping.processingTime,
      enableCountyDelivery: settings.shipping.enableCountyDelivery,
      maxDeliveryDays: settings.shipping.maxDeliveryDays
    },
    payment: {
      acceptedMethods: settings.payment.acceptedMethods,
      enableMpesa: settings.payment.enableMpesa,
      enableCards: settings.payment.enableCards,
      enableCOD: settings.payment.enableCOD,
      vatRate: settings.payment.vatRate,
      enableVAT: settings.payment.enableVAT,
      currency: settings.payment.currency
    },
    social: settings.social,
    features: settings.features,
    maintenance: settings.maintenance
  };

  res.status(200).json({
    success: true,
    data: publicSettings
  });
});

// @desc    Get all settings (admin)
// @route   GET /api/admin/settings
// @access  Private/Admin
exports.getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings();

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
exports.updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.updateSettings(req.body);

  // Log the settings update
  await AuditLog.create({
    user: req.user._id,
    action: 'admin_settings_update',
    resource: 'Settings',
    resourceId: settings._id,
    details: {
      updatedFields: Object.keys(req.body),
      userAgent: req.get('User-Agent'),
      ip: req.ip
    }
  });

  res.status(200).json({
    success: true,
    message: 'Settings updated successfully',
    data: settings
  });
});

// @desc    Reset settings to default
// @route   POST /api/admin/settings/reset
// @access  Private/Admin
exports.resetSettings = asyncHandler(async (req, res) => {
  // Delete existing settings to trigger default creation
  await Settings.deleteMany({});
  
  // Get fresh default settings
  const settings = await Settings.getSettings();

  // Log the settings reset
  await AuditLog.create({
    user: req.user._id,
    action: 'admin_settings_reset',
    resource: 'Settings',
    resourceId: settings._id,
    details: {
      userAgent: req.get('User-Agent'),
      ip: req.ip
    }
  });

  res.status(200).json({
    success: true,
    message: 'Settings reset to default values',
    data: settings
  });
});

// @desc    Get SEO settings for a specific page
// @route   GET /api/settings/seo/:page
// @access  Public
exports.getPageSEO = asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings();
  const { page } = req.params;
  
  let seoData = {
    title: settings.seo.metaTitle,
    description: settings.seo.metaDescription,
    keywords: settings.seo.metaKeywords,
    ogTitle: settings.seo.ogTitle,
    ogDescription: settings.seo.ogDescription,
    ogImage: settings.seo.ogImage,
    twitterCard: settings.seo.twitterCard,
    twitterSite: settings.seo.twitterSite,
    canonical: `${settings.general.siteUrl}/${page === 'home' ? '' : page}`
  };

  // Customize SEO data based on page
  switch (page) {
    case 'home':
      seoData.title = settings.seo.metaTitle;
      seoData.description = settings.seo.metaDescription;
      break;
    case 'shop':
      seoData.title = `Shop Online - ${settings.general.siteName}`;
      seoData.description = `Browse thousands of products on ${settings.general.siteName}. ${settings.seo.metaDescription}`;
      break;
    case 'categories':
      seoData.title = `Categories - ${settings.general.siteName}`;
      seoData.description = `Shop by category on ${settings.general.siteName}. Find electronics, fashion, home goods and more.`;
      break;
    case 'about':
      seoData.title = `About Us - ${settings.general.siteName}`;
      seoData.description = `Learn more about ${settings.general.siteName}. ${settings.general.siteDescription}`;
      break;
    case 'contact':
      seoData.title = `Contact Us - ${settings.general.siteName}`;
      seoData.description = `Get in touch with ${settings.general.siteName}. Phone: ${settings.general.phone}, Email: ${settings.general.contactEmail}`;
      break;
    default:
      // Keep default values
      break;
  }

  res.status(200).json({
    success: true,
    data: seoData
  });
});

// @desc    Update maintenance mode
// @route   PUT /api/admin/settings/maintenance
// @access  Private/Admin
exports.updateMaintenanceMode = asyncHandler(async (req, res) => {
  const { enabled, message, allowedIPs } = req.body;
  
  const settings = await Settings.updateSettings({
    maintenance: {
      enabled,
      message,
      allowedIPs: allowedIPs || []
    }
  });

  // Log maintenance mode change
  await AuditLog.create({
    user: req.user._id,
    action: enabled ? 'maintenance_mode_enabled' : 'maintenance_mode_disabled',
    resource: 'Settings',
    resourceId: settings._id,
    details: {
      message,
      allowedIPs,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    }
  });

  res.status(200).json({
    success: true,
    message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}`,
    data: settings.maintenance
  });
});