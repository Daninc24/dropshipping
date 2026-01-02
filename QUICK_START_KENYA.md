# 🚀 Quick Start Guide - Kenya E-Commerce Platform

## 🎯 Get Your Kenya E-Commerce Platform Running in 10 Minutes

This guide will help you quickly set up and test all the new Kenya-specific features that have been added to your e-commerce platform.

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB running (local or Atlas)
- Git repository cloned

## ⚡ Quick Setup Steps

### 1. Install Dependencies
```bash
# Install all dependencies
npm run install:all

# Or install separately
cd server && npm install
cd ../client && npm install
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

**Minimum required configuration:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce-kenya

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# M-Pesa (Sandbox for testing)
MPESA_CONSUMER_KEY=your-sandbox-consumer-key
MPESA_CONSUMER_SECRET=your-sandbox-consumer-secret
MPESA_BUSINESS_SHORTCODE=174379
MPESA_PASSKEY=your-sandbox-passkey
MPESA_CALLBACK_URL=http://localhost:5000
MPESA_ENVIRONMENT=sandbox

# Cloudinary (for images)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Seed Kenya Data
```bash
# Seed the database with Kenya-specific data
cd server
npm run seed:kenya
```

This will create:
- ✅ All 47 Kenyan counties as delivery zones
- ✅ Sample products (phones, coffee, crafts)
- ✅ Admin user account
- ✅ Kenya-specific coupons
- ✅ Product categories

### 4. Start the Application
```bash
# Start both frontend and backend
npm run dev

# Or start separately
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm run dev
```

## 🎉 Test the Kenya Features

### 🔐 Admin Login
- **URL**: http://localhost:3000/admin
- **Email**: admin@kenyashop.co.ke
- **Password**: admin123456

### 💳 Test M-Pesa Integration

1. **Create a test order**
2. **Go to checkout**
3. **Select M-Pesa payment**
4. **Use test phone number**: +254700000000
5. **Complete the payment flow**

### 💰 Test Wallet System

1. **Login as a customer**
2. **Go to Account > Wallet**
3. **View wallet balance and transactions**
4. **Test wallet payments**

### 🚚 Test Delivery System

1. **Login as admin**
2. **Go to Delivery Management**
3. **View delivery zones (all 47 counties)**
4. **Create delivery agents**
5. **Assign orders to agents**

## 🛠️ Available Test Data

### 🎫 Test Coupons
- **WELCOME10** - 10% off for new customers
- **MPESA5** - 5% off when paying with M-Pesa
- **FREESHIP** - Free shipping on orders above KES 1500

### 📱 Sample Products
- Samsung Galaxy A54 5G (KES 45,000)
- Tecno Spark 10 Pro (KES 18,500)
- Vitron 43" Smart TV (KES 28,000)
- Kenyan Coffee Beans AA Grade (KES 1,200)
- Maasai Shuka Blanket (KES 2,500)

### 🏛️ Delivery Zones
- Nairobi County (KES 150 delivery)
- Mombasa County (KES 200 delivery)
- Kisumu County (KES 250 delivery)
- All other 44 counties configured

## 🔍 Testing Checklist

### ✅ Core E-commerce Features
- [ ] User registration and login
- [ ] Product browsing and search
- [ ] Add to cart and checkout
- [ ] Order management
- [ ] Admin dashboard

### ✅ Kenya-Specific Features
- [ ] M-Pesa payment integration
- [ ] Digital wallet system
- [ ] County-based delivery zones
- [ ] Delivery agent management
- [ ] Audit logging system
- [ ] Kenya address format
- [ ] VAT calculation (16%)

### ✅ Payment Methods
- [ ] M-Pesa STK Push
- [ ] Wallet balance payment
- [ ] Cash on Delivery
- [ ] Card payments (if configured)

### ✅ Admin Features
- [ ] M-Pesa transaction monitoring
- [ ] Wallet management
- [ ] Delivery zone configuration
- [ ] Delivery agent approval
- [ ] Audit log viewing
- [ ] Order assignment to agents

## 🐛 Troubleshooting

### Common Issues

**1. M-Pesa Integration Not Working**
```bash
# Check M-Pesa configuration
echo $MPESA_CONSUMER_KEY
echo $MPESA_ENVIRONMENT

# Verify callback URL is accessible
curl http://localhost:5000/api/payments/mpesa/callback
```

**2. Database Connection Issues**
```bash
# Check MongoDB is running
mongosh

# Verify connection string
echo $MONGODB_URI
```

**3. Frontend Build Issues**
```bash
# Clear node modules and reinstall
cd client
rm -rf node_modules package-lock.json
npm install
```

**4. Missing Dependencies**
```bash
# Install missing backend dependencies
cd server
npm install axios

# Install missing frontend dependencies
cd client
npm install @heroicons/react framer-motion
```

## 📊 API Testing

### Test M-Pesa Endpoints
```bash
# Test M-Pesa STK Push (requires authentication)
curl -X POST http://localhost:5000/api/payments/mpesa/stk-push \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "orderId": "ORDER_ID",
    "phoneNumber": "+254700000000",
    "amount": 1000
  }'
```

### Test Wallet Endpoints
```bash
# Get wallet balance
curl -X GET http://localhost:5000/api/wallet \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get transaction history
curl -X GET http://localhost:5000/api/wallet/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Delivery Endpoints
```bash
# Get delivery zones
curl -X GET http://localhost:5000/api/delivery/zones

# Calculate delivery fee
curl -X POST http://localhost:5000/api/delivery/calculate-fee \
  -H "Content-Type: application/json" \
  -d '{
    "zoneCode": "NRB",
    "orderTotal": 2500
  }'
```

## 🚀 Production Deployment

Once testing is complete, follow the comprehensive deployment guide:

1. **Read**: `DEPLOYMENT.md` for full production setup
2. **Configure**: Production M-Pesa credentials
3. **Deploy**: Using Vercel + Render or your preferred platform
4. **Monitor**: Set up monitoring and analytics

## 📞 Support

If you encounter any issues:

1. **Check the logs**: Both frontend and backend console
2. **Verify environment variables**: Ensure all required vars are set
3. **Test API endpoints**: Use curl or Postman
4. **Review documentation**: Check API_DOCUMENTATION.md

## 🎯 Next Steps

After successful setup:

1. **Customize branding** and colors
2. **Add your products** and categories
3. **Configure real M-Pesa credentials**
4. **Set up production deployment**
5. **Launch your Kenya e-commerce platform!**

---

**🇰🇪 Your Kenya E-Commerce Platform is Ready!**

You now have a complete, production-ready e-commerce system with:
- ✅ M-Pesa payments
- ✅ Digital wallet
- ✅ All 47 counties delivery
- ✅ Comprehensive admin tools
- ✅ Mobile-first design
- ✅ Kenya compliance features

**Happy selling in Kenya! 🚀**