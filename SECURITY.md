# 🔒 Security Guidelines - Kenya E-Commerce Platform

## 🚨 Critical Security Notice

This project contains sensitive information that must **NEVER** be exposed publicly. Follow these guidelines to protect your business and customers.

## 🔐 Protected Information

### **Environment Variables (.env files)**
- **Database credentials** - MongoDB connection strings
- **API keys** - Cloudinary, M-Pesa, WhatsApp Business
- **JWT secrets** - Authentication tokens
- **Payment credentials** - M-Pesa consumer keys and secrets
- **Email credentials** - SMTP passwords
- **Business information** - KRA PIN, registration numbers

### **Sensitive Files**
- User uploaded files (`uploads/` directories)
- Log files containing user data
- Database backups and dumps
- SSL certificates and private keys
- Payment processor webhooks and certificates

## 🛡️ Security Measures Implemented

### **1. Comprehensive .gitignore**
- ✅ All `.env` files excluded
- ✅ `node_modules/` directories excluded
- ✅ Upload directories excluded
- ✅ Log files excluded
- ✅ Database files excluded
- ✅ SSL certificates excluded

### **2. Environment Variable Templates**
- ✅ `.env.example` files provided
- ✅ No actual secrets in templates
- ✅ Clear documentation for each variable

### **3. File Structure Protection**
```
🔒 PROTECTED (Never commit):
├── .env
├── server/.env
├── uploads/
├── logs/
├── node_modules/
├── *.log
├── database-backup/
└── ssl/

✅ SAFE TO COMMIT:
├── .env.example
├── server/.env.example
├── src/
├── public/ (except uploads)
├── README.md
└── package.json
```

## 🇰🇪 Kenya-Specific Security

### **M-Pesa Integration**
- **Consumer Key/Secret**: Never expose in client-side code
- **Passkey**: Store securely in server environment
- **Callback URLs**: Use HTTPS in production
- **Business Shortcode**: Treat as sensitive information

### **KRA Compliance**
- **Tax PIN**: Store in environment variables only
- **Business Registration**: Keep certificates secure
- **VAT Numbers**: Don't expose in public repositories

### **Data Protection (GDPR/Kenya Data Protection Act)**
- User data exports must be excluded from version control
- Personal information in logs must be sanitized
- Database backups must be encrypted and secured

## 🚀 Production Security Checklist

### **Before Deployment:**
- [ ] All `.env` files configured with production values
- [ ] JWT secrets are strong and unique
- [ ] Database credentials are secure
- [ ] M-Pesa is configured for production environment
- [ ] SSL certificates are installed
- [ ] CORS is configured for production domain only
- [ ] Rate limiting is enabled
- [ ] File upload restrictions are in place

### **Environment Variables to Change:**
```bash
# Development → Production
NODE_ENV=production
MPESA_ENVIRONMENT=production
ENABLE_RATE_LIMITING=true
SECURE_COOKIES=true
HTTPS_REDIRECT=true
```

## 🔧 Setup Instructions

### **1. Clone Repository**
```bash
git clone <repository-url>
cd kenya-ecommerce
```

### **2. Setup Environment Variables**
```bash
# Root level
cp .env.example .env
# Edit .env with your actual values

# Server level
cp server/.env.example server/.env
# Edit server/.env with your actual values
```

### **3. Install Dependencies**
```bash
npm install
cd client && npm install
cd ../server && npm install
```

### **4. Verify Security**
```bash
# Check that .env files are ignored
git status
# Should NOT show .env files as untracked
```

## 🚨 What to Do If Secrets Are Exposed

### **If you accidentally commit secrets:**

1. **Immediately rotate all exposed credentials**
2. **Remove secrets from Git history:**
   ```bash
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch .env' \
   --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push to overwrite history:**
   ```bash
   git push origin --force --all
   ```
4. **Update all team members**
5. **Monitor for unauthorized access**

### **Credentials to Rotate:**
- [ ] JWT secrets
- [ ] Database passwords
- [ ] M-Pesa API keys
- [ ] Cloudinary credentials
- [ ] Email passwords
- [ ] Any other exposed API keys

## 📞 Security Contacts

### **For Security Issues:**
- **Email**: security@yourdomain.com
- **Phone**: +254 700 XXX XXX (Business hours)

### **Emergency Contacts:**
- **Safaricom M-Pesa Support**: 0722 000 000
- **Cloudinary Support**: support@cloudinary.com

## 📚 Additional Resources

- [OWASP Security Guidelines](https://owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Kenya Data Protection Act](https://www.odpc.go.ke/)
- [Safaricom M-Pesa Security Guidelines](https://developer.safaricom.co.ke/docs)

## 🔄 Regular Security Tasks

### **Weekly:**
- [ ] Review access logs
- [ ] Check for failed login attempts
- [ ] Monitor API usage patterns

### **Monthly:**
- [ ] Update dependencies
- [ ] Review user permissions
- [ ] Backup security configurations

### **Quarterly:**
- [ ] Rotate JWT secrets
- [ ] Review and update API keys
- [ ] Security audit of codebase
- [ ] Update SSL certificates (if needed)

---

**Remember**: Security is not a one-time setup but an ongoing process. Stay vigilant and keep your Kenya e-commerce platform secure! 🇰🇪🔒