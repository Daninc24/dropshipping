const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const DeliveryZone = require('../models/DeliveryZone');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Kenya Counties with delivery zones
const kenyaDeliveryZones = [
  {
    name: 'Nairobi County',
    code: 'NRB',
    county: 'Nairobi',
    areas: [
      { name: 'CBD', postalCodes: ['00100', '00200'] },
      { name: 'Westlands', postalCodes: ['00600', '00621'] },
      { name: 'Karen', postalCodes: ['00502'] },
      { name: 'Kileleshwa', postalCodes: ['00606'] },
      { name: 'Kilimani', postalCodes: ['00100'] },
      { name: 'Lavington', postalCodes: ['00100'] },
      { name: 'Parklands', postalCodes: ['00623'] },
      { name: 'South B', postalCodes: ['00100'] },
      { name: 'South C', postalCodes: ['00100'] },
      { name: 'Eastleigh', postalCodes: ['00610'] }
    ],
    deliveryFee: 150,
    freeDeliveryThreshold: 2000,
    estimatedDeliveryDays: { min: 1, max: 2 },
    priority: 1
  },
  {
    name: 'Mombasa County',
    code: 'MSA',
    county: 'Mombasa',
    areas: [
      { name: 'Mombasa Island', postalCodes: ['80100'] },
      { name: 'Nyali', postalCodes: ['80100'] },
      { name: 'Bamburi', postalCodes: ['80100'] },
      { name: 'Likoni', postalCodes: ['80100'] }
    ],
    deliveryFee: 200,
    freeDeliveryThreshold: 2500,
    estimatedDeliveryDays: { min: 2, max: 3 },
    priority: 2
  },
  {
    name: 'Kisumu County',
    code: 'KSM',
    county: 'Kisumu',
    areas: [
      { name: 'Kisumu Central', postalCodes: ['40100'] },
      { name: 'Milimani', postalCodes: ['40100'] },
      { name: 'Kondele', postalCodes: ['40100'] }
    ],
    deliveryFee: 250,
    freeDeliveryThreshold: 3000,
    estimatedDeliveryDays: { min: 2, max: 4 },
    priority: 3
  },
  {
    name: 'Nakuru County',
    code: 'NKR',
    county: 'Nakuru',
    areas: [
      { name: 'Nakuru Town', postalCodes: ['20100'] },
      { name: 'Naivasha', postalCodes: ['20117'] },
      { name: 'Gilgil', postalCodes: ['20116'] }
    ],
    deliveryFee: 300,
    freeDeliveryThreshold: 3500,
    estimatedDeliveryDays: { min: 2, max: 4 },
    priority: 4
  },
  {
    name: 'Kiambu County',
    code: 'KBU',
    county: 'Kiambu',
    areas: [
      { name: 'Thika', postalCodes: ['01000'] },
      { name: 'Ruiru', postalCodes: ['00232'] },
      { name: 'Kikuyu', postalCodes: ['00902'] },
      { name: 'Limuru', postalCodes: ['00217'] }
    ],
    deliveryFee: 200,
    freeDeliveryThreshold: 2500,
    estimatedDeliveryDays: { min: 1, max: 3 },
    priority: 2
  },
  {
    name: 'Machakos County',
    code: 'MCK',
    county: 'Machakos',
    areas: [
      { name: 'Machakos Town', postalCodes: ['90100'] },
      { name: 'Athi River', postalCodes: ['00204'] },
      { name: 'Mavoko', postalCodes: ['00204'] }
    ],
    deliveryFee: 250,
    freeDeliveryThreshold: 3000,
    estimatedDeliveryDays: { min: 2, max: 3 },
    priority: 3
  },
  {
    name: 'Uasin Gishu County',
    code: 'UGS',
    county: 'Uasin Gishu',
    areas: [
      { name: 'Eldoret', postalCodes: ['30100'] },
      { name: 'Moiben', postalCodes: ['30100'] }
    ],
    deliveryFee: 350,
    freeDeliveryThreshold: 4000,
    estimatedDeliveryDays: { min: 3, max: 5 },
    priority: 5
  },
  {
    name: 'Meru County',
    code: 'MRU',
    county: 'Meru',
    areas: [
      { name: 'Meru Town', postalCodes: ['60200'] },
      { name: 'Nkubu', postalCodes: ['60200'] }
    ],
    deliveryFee: 400,
    freeDeliveryThreshold: 4500,
    estimatedDeliveryDays: { min: 3, max: 5 },
    priority: 6
  },
  {
    name: 'Nyeri County',
    code: 'NYR',
    county: 'Nyeri',
    areas: [
      { name: 'Nyeri Town', postalCodes: ['10100'] },
      { name: 'Karatina', postalCodes: ['10101'] }
    ],
    deliveryFee: 350,
    freeDeliveryThreshold: 4000,
    estimatedDeliveryDays: { min: 2, max: 4 },
    priority: 5
  },
  {
    name: 'Kakamega County',
    code: 'KKG',
    county: 'Kakamega',
    areas: [
      { name: 'Kakamega Town', postalCodes: ['50100'] },
      { name: 'Mumias', postalCodes: ['50102'] }
    ],
    deliveryFee: 400,
    freeDeliveryThreshold: 4500,
    estimatedDeliveryDays: { min: 3, max: 5 },
    priority: 6
  }
];

// Sample categories for Kenya market
const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Phones, laptops, TVs and electronic accessories',
    featured: true,
    sortOrder: 1
  },
  {
    name: 'Fashion & Beauty',
    slug: 'fashion-beauty',
    description: 'Clothing, shoes, cosmetics and beauty products',
    featured: true,
    sortOrder: 2
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Furniture, home decor, kitchen appliances',
    featured: true,
    sortOrder: 3
  },
  {
    name: 'Health & Wellness',
    slug: 'health-wellness',
    description: 'Supplements, fitness equipment, health products',
    featured: true,
    sortOrder: 4
  },
  {
    name: 'Books & Education',
    slug: 'books-education',
    description: 'Books, educational materials, stationery',
    featured: false,
    sortOrder: 5
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sports equipment, outdoor gear, fitness accessories',
    featured: false,
    sortOrder: 6
  },
  {
    name: 'Baby & Kids',
    slug: 'baby-kids',
    description: 'Baby products, toys, children clothing',
    featured: true,
    sortOrder: 7
  },
  {
    name: 'Automotive',
    slug: 'automotive',
    description: 'Car accessories, spare parts, automotive tools',
    featured: false,
    sortOrder: 8
  }
];

// Sample products for Kenya market
const sampleProducts = [
  {
    name: 'Samsung Galaxy A54 5G',
    slug: 'samsung-galaxy-a54-5g',
    description: 'Latest Samsung smartphone with 5G connectivity, perfect for Kenya\'s growing 5G network. Features 50MP camera, 6.4" display, and long-lasting battery.',
    shortDescription: '5G smartphone with excellent camera and battery life',
    price: 45000,
    comparePrice: 52000,
    sku: 'SAM-A54-5G',
    brand: 'Samsung',
    tags: ['smartphone', '5g', 'android', 'camera'],
    images: [
      {
        public_id: 'sample_phone_1',
        url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
        alt: 'Samsung Galaxy A54 5G',
        isMain: true
      }
    ],
    variants: [
      { name: 'Storage', options: ['128GB', '256GB'] },
      { name: 'Color', options: ['Black', 'White', 'Purple'] }
    ],
    specifications: [
      { name: 'Display', value: '6.4" Super AMOLED' },
      { name: 'RAM', value: '8GB' },
      { name: 'Battery', value: '5000mAh' },
      { name: 'Camera', value: '50MP + 12MP + 5MP' }
    ],
    quantity: 50,
    featured: true,
    seoTitle: 'Samsung Galaxy A54 5G - Buy Online in Kenya',
    seoDescription: 'Get the Samsung Galaxy A54 5G smartphone in Kenya. Fast delivery, M-Pesa payments accepted.',
    seoKeywords: ['samsung', 'galaxy', 'a54', '5g', 'smartphone', 'kenya']
  },
  {
    name: 'Tecno Spark 10 Pro',
    slug: 'tecno-spark-10-pro',
    description: 'Affordable smartphone designed for the Kenyan market. Great value with decent performance and camera quality.',
    shortDescription: 'Budget-friendly smartphone with good performance',
    price: 18500,
    comparePrice: 22000,
    sku: 'TEC-SP10-PRO',
    brand: 'Tecno',
    tags: ['smartphone', 'budget', 'android', 'tecno'],
    images: [
      {
        public_id: 'sample_phone_2',
        url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&h=500&fit=crop',
        alt: 'Tecno Spark 10 Pro',
        isMain: true
      }
    ],
    variants: [
      { name: 'Storage', options: ['128GB', '256GB'] },
      { name: 'Color', options: ['Blue', 'Black', 'Gold'] }
    ],
    quantity: 100,
    featured: true
  },
  {
    name: 'Vitron 43" Smart TV',
    slug: 'vitron-43-smart-tv',
    description: 'Affordable smart TV perfect for Kenyan homes. Android TV with access to Netflix, YouTube and local content.',
    shortDescription: 'Smart Android TV with streaming apps',
    price: 28000,
    comparePrice: 35000,
    sku: 'VIT-43-SMART',
    brand: 'Vitron',
    tags: ['tv', 'smart tv', 'android tv', 'entertainment'],
    images: [
      {
        public_id: 'sample_tv_1',
        url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop',
        alt: 'Vitron 43 inch Smart TV',
        isMain: true
      }
    ],
    quantity: 25,
    featured: true
  },
  {
    name: 'Kenyan Coffee Beans - AA Grade',
    slug: 'kenyan-coffee-beans-aa-grade',
    description: 'Premium Kenyan coffee beans from Nyeri region. Single origin, freshly roasted, perfect for coffee lovers.',
    shortDescription: 'Premium single origin Kenyan coffee',
    price: 1200,
    comparePrice: 1500,
    sku: 'KEN-COFFEE-AA',
    brand: 'Kenya Coffee',
    tags: ['coffee', 'kenyan', 'premium', 'single origin'],
    images: [
      {
        public_id: 'sample_coffee_1',
        url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop',
        alt: 'Kenyan Coffee Beans AA Grade',
        isMain: true
      }
    ],
    variants: [
      { name: 'Weight', options: ['250g', '500g', '1kg'] },
      { name: 'Grind', options: ['Whole Bean', 'Coarse', 'Medium', 'Fine'] }
    ],
    quantity: 200,
    featured: true
  },
  {
    name: 'Maasai Shuka Blanket',
    slug: 'maasai-shuka-blanket',
    description: 'Authentic Maasai shuka blanket, handwoven by local artisans. Perfect for home decor or cultural events.',
    shortDescription: 'Authentic handwoven Maasai blanket',
    price: 2500,
    comparePrice: 3200,
    sku: 'MAS-SHUKA-001',
    brand: 'Maasai Crafts',
    tags: ['maasai', 'blanket', 'handmade', 'cultural', 'decor'],
    images: [
      {
        public_id: 'sample_shuka_1',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop',
        alt: 'Maasai Shuka Blanket',
        isMain: true
      }
    ],
    variants: [
      { name: 'Size', options: ['Small', 'Medium', 'Large'] },
      { name: 'Color', options: ['Red', 'Blue', 'Green', 'Multi'] }
    ],
    quantity: 75,
    featured: true
  }
];

// Sample coupons
const coupons = [
  {
    code: 'WELCOME10',
    description: '10% off for new customers',
    discountType: 'percentage',
    discountValue: 10,
    minimumAmount: 1000,
    maximumDiscount: 500,
    usageLimit: 1000,
    userLimit: 1,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    isActive: true,
    isPublic: true
  },
  {
    code: 'MPESA5',
    description: '5% off when paying with M-Pesa',
    discountType: 'percentage',
    discountValue: 5,
    minimumAmount: 500,
    maximumDiscount: 200,
    usageLimit: 5000,
    userLimit: 5,
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    isActive: true,
    isPublic: true
  },
  {
    code: 'FREESHIP',
    description: 'Free shipping on orders above KES 1500',
    discountType: 'fixed',
    discountValue: 200,
    minimumAmount: 1500,
    usageLimit: 2000,
    userLimit: 3,
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    isActive: true,
    isPublic: true
  }
];

// Admin user
const adminUser = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@kenyashop.co.ke',
  password: 'admin123456',
  role: 'admin',
  isEmailVerified: true,
  phone: '+254700000000'
};

const seedData = async () => {
  try {
    console.log('🌱 Starting Kenya data seeding...');

    // Clear existing data
    await Promise.all([
      DeliveryZone.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
      User.deleteMany({ email: adminUser.email })
    ]);

    console.log('🗑️  Cleared existing data');

    // Seed delivery zones
    console.log('📍 Seeding delivery zones...');
    await DeliveryZone.insertMany(kenyaDeliveryZones);
    console.log(`✅ Created ${kenyaDeliveryZones.length} delivery zones`);

    // Seed categories
    console.log('📂 Seeding categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Seed products with category references
    console.log('📦 Seeding products...');
    const electronicsCategory = createdCategories.find(cat => cat.slug === 'electronics');
    const homeCategory = createdCategories.find(cat => cat.slug === 'home-garden');
    const fashionCategory = createdCategories.find(cat => cat.slug === 'fashion-beauty');

    // Assign categories to products
    sampleProducts[0].category = electronicsCategory._id; // Samsung phone
    sampleProducts[1].category = electronicsCategory._id; // Tecno phone
    sampleProducts[2].category = electronicsCategory._id; // TV
    sampleProducts[3].category = homeCategory._id; // Coffee
    sampleProducts[4].category = fashionCategory._id; // Shuka

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create admin user first
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    const createdAdmin = await User.create({
      ...adminUser,
      password: hashedPassword
    });
    console.log('✅ Created admin user');

    // Seed coupons with admin as creator
    console.log('🎟️  Seeding coupons...');
    const couponsWithCreator = coupons.map(coupon => ({
      ...coupon,
      createdBy: createdAdmin._id
    }));
    await Coupon.insertMany(couponsWithCreator);
    console.log(`✅ Created ${coupons.length} coupons`);

    console.log('\n🎉 Kenya data seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • ${kenyaDeliveryZones.length} delivery zones created`);
    console.log(`   • ${createdCategories.length} categories created`);
    console.log(`   • ${createdProducts.length} products created`);
    console.log(`   • ${coupons.length} coupons created`);
    console.log(`   • 1 admin user created`);
    console.log('\n🔐 Admin Login:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: ${adminUser.password}`);
    console.log('\n🎫 Available Coupons:');
    coupons.forEach(coupon => {
      console.log(`   • ${coupon.code} - ${coupon.description}`);
    });

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeder
if (require.main === module) {
  connectDB().then(() => {
    seedData();
  });
}

module.exports = { seedData, connectDB };