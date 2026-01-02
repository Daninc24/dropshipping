#!/bin/bash

# 🔒 Security Check Script for Kenya E-Commerce Platform
# This script verifies that sensitive files are properly protected

echo "🔍 Checking security configuration..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .gitignore exists
if [ -f ".gitignore" ]; then
    echo -e "${GREEN}✅ .gitignore file exists${NC}"
else
    echo -e "${RED}❌ .gitignore file missing!${NC}"
    exit 1
fi

# Check if .env files are ignored
if grep -q "\.env" .gitignore; then
    echo -e "${GREEN}✅ .env files are ignored${NC}"
else
    echo -e "${RED}❌ .env files not properly ignored!${NC}"
fi

# Check if node_modules are ignored
if grep -q "node_modules" .gitignore; then
    echo -e "${GREEN}✅ node_modules directories are ignored${NC}"
else
    echo -e "${RED}❌ node_modules not properly ignored!${NC}"
fi

# Check for existing sensitive files
echo ""
echo "🔍 Checking for sensitive files..."
echo "=================================="

# Check for .env files
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file found in root${NC}"
fi

if [ -f "server/.env" ]; then
    echo -e "${YELLOW}⚠️  .env file found in server/${NC}"
fi

if [ -f "client/.env" ]; then
    echo -e "${YELLOW}⚠️  .env file found in client/${NC}"
fi

# Check for log files
LOG_FILES=$(find . -name "*.log" -not -path "./node_modules/*" 2>/dev/null)
if [ ! -z "$LOG_FILES" ]; then
    echo -e "${YELLOW}⚠️  Log files found:${NC}"
    echo "$LOG_FILES"
fi

# Check for upload directories
if [ -d "uploads" ]; then
    echo -e "${YELLOW}⚠️  uploads/ directory found${NC}"
fi

if [ -d "server/uploads" ]; then
    echo -e "${YELLOW}⚠️  server/uploads/ directory found${NC}"
fi

# Check if git is initialized
if [ -d ".git" ]; then
    echo ""
    echo "🔍 Checking git status..."
    echo "========================="
    
    # Check if sensitive files are tracked
    TRACKED_ENV=$(git ls-files | grep -E "\.env$|\.env\." 2>/dev/null)
    if [ ! -z "$TRACKED_ENV" ]; then
        echo -e "${RED}❌ CRITICAL: .env files are tracked by git!${NC}"
        echo "$TRACKED_ENV"
        echo -e "${RED}Run: git rm --cached <file> to untrack them${NC}"
    else
        echo -e "${GREEN}✅ No .env files are tracked by git${NC}"
    fi
    
    # Check if node_modules are tracked
    TRACKED_MODULES=$(git ls-files | grep "node_modules" 2>/dev/null)
    if [ ! -z "$TRACKED_MODULES" ]; then
        echo -e "${RED}❌ node_modules files are tracked by git!${NC}"
        echo "First few files:"
        echo "$TRACKED_MODULES" | head -5
    else
        echo -e "${GREEN}✅ No node_modules files are tracked${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Git not initialized${NC}"
fi

echo ""
echo "🔍 Checking environment templates..."
echo "===================================="

if [ -f ".env.example" ]; then
    echo -e "${GREEN}✅ .env.example exists${NC}"
else
    echo -e "${YELLOW}⚠️  .env.example missing${NC}"
fi

if [ -f "server/.env.example" ]; then
    echo -e "${GREEN}✅ server/.env.example exists${NC}"
else
    echo -e "${YELLOW}⚠️  server/.env.example missing${NC}"
fi

echo ""
echo "🔍 Security recommendations..."
echo "=============================="

echo "1. 🔐 Ensure all .env files contain real secrets (not demo values)"
echo "2. 🔄 Rotate any secrets that may have been exposed"
echo "3. 🚀 Use different secrets for development and production"
echo "4. 📱 Never commit M-Pesa production credentials"
echo "5. 🏛️  Keep KRA PIN and business documents secure"
echo "6. 🔒 Use strong JWT secrets (32+ characters)"
echo "7. 📧 Use app passwords for email (not account passwords)"

echo ""
echo -e "${GREEN}🎉 Security check completed!${NC}"
echo "Review any warnings above and take appropriate action."