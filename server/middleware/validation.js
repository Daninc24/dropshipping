const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: message
      });
    }
    
    next();
  };
};

// Auth validation schemas
const registerSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters'
    }),
  
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required'
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required'
    }),
  
  phone: Joi.string()
    .pattern(/^\+?[\d\s-()]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    })
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required'
    })
});

// Product validation schemas
const productSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),
  
  description: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .required(),
  
  shortDescription: Joi.string()
    .trim()
    .max(200)
    .optional(),
  
  price: Joi.number()
    .min(0)
    .required(),
  
  comparePrice: Joi.number()
    .min(0)
    .optional(),
  
  cost: Joi.number()
    .min(0)
    .optional(),
  
  sku: Joi.string()
    .trim()
    .optional(),
  
  barcode: Joi.string()
    .trim()
    .optional(),
  
  trackQuantity: Joi.boolean()
    .optional(),
  
  quantity: Joi.number()
    .min(0)
    .optional(),
  
  lowStockThreshold: Joi.number()
    .min(0)
    .optional(),
  
  weight: Joi.number()
    .min(0)
    .optional(),
  
  dimensions: Joi.object({
    length: Joi.number().min(0).optional(),
    width: Joi.number().min(0).optional(),
    height: Joi.number().min(0).optional()
  }).optional(),
  
  category: Joi.string()
    .required(),
  
  subcategory: Joi.string()
    .trim()
    .optional(),
  
  brand: Joi.string()
    .trim()
    .optional(),
  
  tags: Joi.array()
    .items(Joi.string().trim())
    .optional(),
  
  variants: Joi.array()
    .items(Joi.object({
      name: Joi.string().required(),
      options: Joi.array().items(Joi.string()).required()
    }))
    .optional(),
  
  specifications: Joi.array()
    .items(Joi.object({
      name: Joi.string().required(),
      value: Joi.string().required()
    }))
    .optional(),
  
  seoTitle: Joi.string()
    .trim()
    .optional(),
  
  seoDescription: Joi.string()
    .trim()
    .optional(),
  
  seoKeywords: Joi.array()
    .items(Joi.string().trim())
    .optional(),
  
  status: Joi.string()
    .valid('active', 'inactive', 'draft')
    .optional(),
  
  featured: Joi.boolean()
    .optional()
});

// Category validation schema
const categorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),
  
  description: Joi.string()
    .trim()
    .max(500)
    .optional(),
  
  parent: Joi.string()
    .optional(),
  
  status: Joi.string()
    .valid('active', 'inactive')
    .optional(),
  
  featured: Joi.boolean()
    .optional(),
  
  sortOrder: Joi.number()
    .optional(),
  
  seoTitle: Joi.string()
    .trim()
    .optional(),
  
  seoDescription: Joi.string()
    .trim()
    .optional(),
  
  seoKeywords: Joi.array()
    .items(Joi.string().trim())
    .optional()
});

// Address validation schema
const addressSchema = Joi.object({
  type: Joi.string()
    .valid('home', 'work', 'other')
    .optional(),
  
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),
  
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),
  
  company: Joi.string()
    .trim()
    .max(100)
    .optional(),
  
  address: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .required(),
  
  apartment: Joi.string()
    .trim()
    .max(50)
    .optional(),
  
  city: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),
  
  state: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),
  
  zipCode: Joi.string()
    .trim()
    .min(3)
    .max(20)
    .required(),
  
  country: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),
  
  phone: Joi.string()
    .pattern(/^\+?[\d\s-()]+$/)
    .optional(),
  
  isDefault: Joi.boolean()
    .optional()
});

// Review validation schema
const reviewSchema = Joi.object({
  rating: Joi.number()
    .min(1)
    .max(5)
    .required(),
  
  title: Joi.string()
    .trim()
    .max(100)
    .optional(),
  
  comment: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .required(),
  
  pros: Joi.array()
    .items(Joi.string().trim())
    .optional(),
  
  cons: Joi.array()
    .items(Joi.string().trim())
    .optional()
});

// Coupon validation schema
const couponSchema = Joi.object({
  code: Joi.string()
    .trim()
    .uppercase()
    .min(3)
    .max(20)
    .required(),
  
  description: Joi.string()
    .trim()
    .max(200)
    .optional(),
  
  discountType: Joi.string()
    .valid('percentage', 'fixed')
    .required(),
  
  discountValue: Joi.number()
    .min(0)
    .required(),
  
  minimumAmount: Joi.number()
    .min(0)
    .optional(),
  
  maximumDiscount: Joi.number()
    .min(0)
    .optional(),
  
  usageLimit: Joi.number()
    .min(1)
    .optional(),
  
  userLimit: Joi.number()
    .min(1)
    .optional(),
  
  startDate: Joi.date()
    .required(),
  
  endDate: Joi.date()
    .greater(Joi.ref('startDate'))
    .required(),
  
  isActive: Joi.boolean()
    .optional(),
  
  isPublic: Joi.boolean()
    .optional()
});

// Export validation middleware
exports.validateRegister = validate(registerSchema);
exports.validateLogin = validate(loginSchema);
exports.validateProduct = validate(productSchema);
exports.validateCategory = validate(categorySchema);
exports.validateAddress = validate(addressSchema);
exports.validateReview = validate(reviewSchema);
exports.validateCoupon = validate(couponSchema);