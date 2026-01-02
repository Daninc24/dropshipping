const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Sample data
const categories = [
  {
    name: 'Electronics',
    description: 'Latest electronic devices and gadgets',
    featured: true,
    sortOrder: 1,
    seoTitle: 'Electronics - Latest Gadgets & Devices',
    seoDescription: 'Shop the latest electronics, smartphones, laptops, and gadgets at great prices.'
  },
  {
    name: 'Clothing',
    description: 'Fashion and apparel for all occasions',
    featured: true,
    sortOrder: 2,
    seoTitle: 'Clothing & Fashion - Trendy Apparel',
    seoDescription: 'Discover trendy clothing and fashion items for men, women, and kids.'
  },
  {
    name: 'Home & Garden',
    description: 'Everything for your home and garden',
    featured: true,
    sortOrder: 3,
    seoTitle: 'Home & Garden - Furniture & Decor',
    seoDescription: 'Transform your home with our furniture, decor, and garden essentials.'
  },
  {
    name: 'Sports & Outdoors',
    description: 'Sports equipment and outdoor gear',
    featured: false,
    sortOrder: 4,
    seoTitle: 'Sports & Outdoors - Equipment & Gear',
    seoDescription: 'Get active with our sports equipment and outdoor adventure gear.'
  },
  {
    name: 'Books & Media',
    description: 'Books, movies, music, and more',
    featured: false,
    sortOrder: 5,
    seoTitle: 'Books & Media - Entertainment Collection',
    seoDescription: 'Explore our vast collection of books, movies, music, and digital media.'
  },
  {
    name: 'Health & Beauty',
    description: 'Health, wellness, and beauty products',
    featured: true,
    sortOrder: 6,
    seoTitle: 'Health & Beauty - Wellness Products',
    seoDescription: 'Enhance your health and beauty with our premium wellness products.'
  }
];

const users = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@eshop.com',
    password: 'admin123',
    role: 'admin',
    isEmailVerified: true,
    isActive: true
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    isEmailVerified: true,
    isActive: true
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    isEmailVerified: true,
    isActive: true
  },
  {
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@example.com',
    password: 'password123',
    role: 'user',
    isEmailVerified: true,
    isActive: true
  }
];

const products = [
  // Electronics
  {
    name: 'iPhone 15 Pro',
    description: 'The latest iPhone with advanced camera system, A17 Pro chip, and titanium design. Experience the future of smartphones with cutting-edge technology.',
    shortDescription: 'Latest iPhone with A17 Pro chip and titanium design',
    price: 999.99,
    comparePrice: 1199.99,
    sku: 'IPHONE15PRO',
    brand: 'Apple',
    tags: ['smartphone', 'apple', 'ios', 'premium'],
    images: [
      {
        public_id: 'iphone15pro_main',
        url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop',
        alt: 'iPhone 15 Pro',
        isMain: true
      }
    ],
    variants: [
      { name: 'Storage', options: ['128GB', '256GB', '512GB', '1TB'] },
      { name: 'Color', options: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'] }
    ],
    specifications: [
      { name: 'Display', value: '6.1-inch Super Retina XDR' },
      { name: 'Chip', value: 'A17 Pro' },
      { name: 'Camera', value: '48MP Main, 12MP Ultra Wide, 12MP Telephoto' },
      { name: 'Battery', value: 'Up to 23 hours video playback' }
    ],
    quantity: 50,
    trackQuantity: true,
    status: 'active',
    featured: true,
    seoTitle: 'iPhone 15 Pro - Latest Apple Smartphone',
    seoDescription: 'Buy the new iPhone 15 Pro with A17 Pro chip, advanced cameras, and titanium design.'
  },
  {
    name: 'MacBook Air M2',
    description: 'Supercharged by the M2 chip, the redesigned MacBook Air combines incredible performance with up to 18 hours of battery life.',
    shortDescription: 'Powerful laptop with M2 chip and all-day battery',
    price: 1199.99,
    comparePrice: 1399.99,
    sku: 'MACBOOKAIR-M2',
    brand: 'Apple',
    tags: ['laptop', 'apple', 'macbook', 'productivity'],
    images: [
      {
        public_id: 'macbook_air_m2',
        url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop',
        alt: 'MacBook Air M2',
        isMain: true
      }
    ],
    variants: [
      { name: 'Memory', options: ['8GB', '16GB', '24GB'] },
      { name: 'Storage', options: ['256GB', '512GB', '1TB', '2TB'] },
      { name: 'Color', options: ['Silver', 'Space Gray', 'Gold', 'Starlight'] }
    ],
    quantity: 30,
    trackQuantity: true,
    status: 'active',
    featured: true
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'The ultimate Android flagship with S Pen, advanced AI features, and professional-grade cameras.',
    shortDescription: 'Premium Android phone with S Pen and AI features',
    price: 1199.99,
    comparePrice: 1299.99,
    sku: 'GALAXY-S24-ULTRA',
    brand: 'Samsung',
    tags: ['smartphone', 'samsung', 'android', 'premium'],
    images: [
      {
        public_id: 'galaxy_s24_ultra',
        url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop',
        alt: 'Samsung Galaxy S24 Ultra',
        isMain: true
      }
    ],
    quantity: 25,
    trackQuantity: true,
    status: 'active',
    featured: true
  },

  // Clothing
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Soft, comfortable, and stylish cotton t-shirt perfect for everyday wear. Made from 100% organic cotton.',
    shortDescription: '100% organic cotton t-shirt for everyday comfort',
    price: 29.99,
    comparePrice: 39.99,
    sku: 'COTTON-TSHIRT-001',
    brand: 'EcoWear',
    tags: ['clothing', 'cotton', 'casual', 'organic'],
    images: [
      {
        public_id: 'cotton_tshirt',
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
        alt: 'Premium Cotton T-Shirt',
        isMain: true
      }
    ],
    variants: [
      { name: 'Size', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { name: 'Color', options: ['White', 'Black', 'Navy', 'Gray', 'Red'] }
    ],
    quantity: 100,
    trackQuantity: true,
    status: 'active',
    featured: false
  },
  {
    name: 'Designer Jeans',
    description: 'Premium denim jeans with perfect fit and contemporary style. Crafted from high-quality denim fabric.',
    shortDescription: 'Premium denim jeans with perfect fit',
    price: 89.99,
    comparePrice: 120.00,
    sku: 'DESIGNER-JEANS-001',
    brand: 'DenimCo',
    tags: ['clothing', 'jeans', 'denim', 'fashion'],
    images: [
      {
        public_id: 'designer_jeans',
        url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',
        alt: 'Designer Jeans',
        isMain: true
      }
    ],
    variants: [
      { name: 'Size', options: ['28', '30', '32', '34', '36', '38', '40'] },
      { name: 'Color', options: ['Dark Blue', 'Light Blue', 'Black', 'Gray'] }
    ],
    quantity: 75,
    trackQuantity: true,
    status: 'active',
    featured: true
  },

  // Home & Garden
  {
    name: 'Modern Coffee Table',
    description: 'Sleek and modern coffee table perfect for contemporary living rooms. Made from sustainable wood.',
    shortDescription: 'Sleek modern coffee table for contemporary homes',
    price: 299.99,
    comparePrice: 399.99,
    sku: 'COFFEE-TABLE-MOD',
    brand: 'ModernHome',
    tags: ['furniture', 'table', 'living room', 'modern'],
    images: [
      {
        public_id: 'modern_coffee_table',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop',
        alt: 'Modern Coffee Table',
        isMain: true
      }
    ],
    variants: [
      { name: 'Color', options: ['Natural Wood', 'White', 'Black', 'Walnut'] },
      { name: 'Size', options: ['Small (90cm)', 'Medium (120cm)', 'Large (150cm)'] }
    ],
    quantity: 20,
    trackQuantity: true,
    status: 'active',
    featured: true
  },

  // Sports & Outdoors
  {
    name: 'Professional Yoga Mat',
    description: 'High-quality yoga mat with excellent grip and cushioning. Perfect for all types of yoga practice.',
    shortDescription: 'Premium yoga mat with superior grip and comfort',
    price: 49.99,
    comparePrice: 69.99,
    sku: 'YOGA-MAT-PRO',
    brand: 'YogaLife',
    tags: ['sports', 'yoga', 'fitness', 'wellness'],
    images: [
      {
        public_id: 'yoga_mat',
        url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop',
        alt: 'Professional Yoga Mat',
        isMain: true
      }
    ],
    variants: [
      { name: 'Color', options: ['Purple', 'Blue', 'Green', 'Pink', 'Black'] },
      { name: 'Thickness', options: ['4mm', '6mm', '8mm'] }
    ],
    quantity: 60,
    trackQuantity: true,
    status: 'active',
    featured: false
  },

  // Books & Media
  {
    name: 'The Complete Guide to Web Development',
    description: 'Comprehensive guide covering modern web development technologies, frameworks, and best practices.',
    shortDescription: 'Complete guide to modern web development',
    price: 39.99,
    comparePrice: 49.99,
    sku: 'BOOK-WEBDEV-001',
    brand: 'TechBooks',
    tags: ['books', 'programming', 'web development', 'education'],
    images: [
      {
        public_id: 'web_dev_book',
        url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=800&fit=crop',
        alt: 'Web Development Book',
        isMain: true
      }
    ],
    variants: [
      { name: 'Format', options: ['Paperback', 'Hardcover', 'E-book'] }
    ],
    quantity: 40,
    trackQuantity: true,
    status: 'active',
    featured: false
  },

  // Health & Beauty
  {
    name: 'Organic Face Moisturizer',
    description: 'Natural and organic face moisturizer with anti-aging properties. Suitable for all skin types.',
    shortDescription: 'Organic anti-aging face moisturizer for all skin types',
    price: 24.99,
    comparePrice: 34.99,
    sku: 'MOISTURIZER-ORG',
    brand: 'NaturalGlow',
    tags: ['skincare', 'organic', 'moisturizer', 'beauty'],
    images: [
      {
        public_id: 'face_moisturizer',
        url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop',
        alt: 'Organic Face Moisturizer',
        isMain: true
      }
    ],
    variants: [
      { name: 'Size', options: ['30ml', '50ml', '100ml'] },
      { name: 'Skin Type', options: ['Normal', 'Dry', 'Oily', 'Sensitive'] }
    ],
    quantity: 80,
    trackQuantity: true,
    status: 'active',
    featured: true
  }
];

const coupons = [
  {
    code: 'WELCOME20',
    description: '20% off for new customers',
    discountType: 'percentage',
    discountValue: 20,
    minimumAmount: 50,
    maximumDiscount: 100,
    usageLimit: 1000,
    userLimit: 1,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    isActive: true,
    isPublic: true
  },
  {
    code: 'SAVE50',
    description: '$50 off orders over $200',
    discountType: 'fixed',
    discountValue: 50,
    minimumAmount: 200,
    usageLimit: 500,
    userLimit: 1,
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    isActive: true,
    isPublic: true
  },
  {
    code: 'ELECTRONICS15',
    description: '15% off electronics',
    discountType: 'percentage',
    discountValue: 15,
    minimumAmount: 100,
    maximumDiscount: 200,
    usageLimit: 200,
    userLimit: 2,
    startDate: new Date(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
    isActive: true,
    isPublic: true
  }
];

// Seeding functions
const seedCategories = async () => {
  console.log('Seeding categories...');
  await Category.deleteMany({});
  
  const createdCategories = [];
  for (const categoryData of categories) {
    const category = await Category.create(categoryData);
    createdCategories.push(category);
  }
  
  console.log(`✅ Created ${createdCategories.length} categories`);
  return createdCategories;
};

const seedUsers = async () => {
  console.log('Seeding users...');
  await User.deleteMany({});
  
  const createdUsers = [];
  for (const userData of users) {
    const user = await User.create(userData);
    createdUsers.push(user);
  }
  
  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
};

const seedProducts = async (categories) => {
  console.log('Seeding products...');
  await Product.deleteMany({});
  
  const categoryMap = {
    'iPhone 15 Pro': 'Electronics',
    'MacBook Air M2': 'Electronics',
    'Samsung Galaxy S24 Ultra': 'Electronics',
    'Premium Cotton T-Shirt': 'Clothing',
    'Designer Jeans': 'Clothing',
    'Modern Coffee Table': 'Home & Garden',
    'Professional Yoga Mat': 'Sports & Outdoors',
    'The Complete Guide to Web Development': 'Books & Media',
    'Organic Face Moisturizer': 'Health & Beauty'
  };
  
  const createdProducts = [];
  for (const productData of products) {
    const categoryName = categoryMap[productData.name];
    const category = categories.find(cat => cat.name === categoryName);
    
    if (category) {
      productData.category = category._id;
      const product = await Product.create(productData);
      createdProducts.push(product);
    }
  }
  
  console.log(`✅ Created ${createdProducts.length} products`);
  return createdProducts;
};

const seedCoupons = async (adminUser) => {
  console.log('Seeding coupons...');
  await Coupon.deleteMany({});
  
  const createdCoupons = [];
  for (const couponData of coupons) {
    couponData.createdBy = adminUser._id;
    const coupon = await Coupon.create(couponData);
    createdCoupons.push(coupon);
  }
  
  console.log(`✅ Created ${createdCoupons.length} coupons`);
  return createdCoupons;
};

const seedReviews = async (users, products) => {
  console.log('Seeding reviews...');
  await Review.deleteMany({});
  
  const sampleReviews = [
    {
      rating: 5,
      title: 'Excellent product!',
      comment: 'This product exceeded my expectations. Great quality and fast shipping.',
      pros: ['Great quality', 'Fast shipping', 'Good value'],
      cons: []
    },
    {
      rating: 4,
      title: 'Very good',
      comment: 'Good product overall, would recommend to others.',
      pros: ['Good quality', 'Works as expected'],
      cons: ['Could be cheaper']
    },
    {
      rating: 5,
      title: 'Love it!',
      comment: 'Amazing product, exactly what I was looking for.',
      pros: ['Perfect fit', 'Great design', 'High quality'],
      cons: []
    }
  ];
  
  const createdReviews = [];
  const regularUsers = users.filter(user => user.role === 'user');
  
  for (let i = 0; i < Math.min(products.length * 2, 20); i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const user = regularUsers[Math.floor(Math.random() * regularUsers.length)];
    const reviewTemplate = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ user: user._id, product: product._id });
    if (!existingReview) {
      const review = await Review.create({
        ...reviewTemplate,
        user: user._id,
        product: product._id,
        verified: true,
        status: 'approved'
      });
      createdReviews.push(review);
    }
  }
  
  console.log(`✅ Created ${createdReviews.length} reviews`);
  return createdReviews;
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...\n');
    
    // Seed in order due to dependencies
    const categories = await seedCategories();
    const users = await seedUsers();
    const products = await seedProducts(categories);
    const adminUser = users.find(user => user.role === 'admin');
    const coupons = await seedCoupons(adminUser);
    const reviews = await seedReviews(users, products);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Products: ${products.length}`);
    console.log(`   Coupons: ${coupons.length}`);
    console.log(`   Reviews: ${reviews.length}`);
    
    console.log('\n👤 Admin Login:');
    console.log('   Email: admin@eshop.com');
    console.log('   Password: admin123');
    
    console.log('\n👤 Test User Login:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };