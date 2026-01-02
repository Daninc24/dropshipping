# API Documentation

## 🔗 Base URL
```
Development: http://localhost:5000/api
Production: https://your-api-domain.com/api
```

## 🔐 Authentication

All protected endpoints require a valid JWT token sent via HttpOnly cookie or Authorization header.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": "Detailed error information"
}
```

## 🔑 Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "data": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Logout User
```http
POST /auth/logout
```

### Get Current User
```http
GET /auth/me
```
*Requires authentication*

### Forgot Password
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

### Reset Password
```http
PUT /auth/reset-password/:resetToken
```

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

## 🛍️ Product Endpoints

### Get All Products
```http
GET /products
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `search` (string): Search term
- `category` (string): Category slug
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `minRating` (number): Minimum rating
- `featured` (boolean): Featured products only
- `brand` (string): Brand name(s), comma-separated
- `tags` (string): Tags, comma-separated
- `sort` (string): Sort by (price-low, price-high, rating, newest, popular)

**Example:**
```http
GET /products?category=electronics&minPrice=100&maxPrice=500&sort=price-low&page=1&limit=12
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "slug": "product-name",
      "description": "Product description",
      "price": 299.99,
      "comparePrice": 399.99,
      "images": [
        {
          "url": "https://cloudinary.com/image.jpg",
          "alt": "Product image",
          "isMain": true
        }
      ],
      "category": {
        "_id": "category_id",
        "name": "Electronics",
        "slug": "electronics"
      },
      "averageRating": 4.5,
      "numOfReviews": 25,
      "stockStatus": "in-stock",
      "discountPercentage": 25,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 150,
    "totalPages": 13,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get Single Product
```http
GET /products/:slug
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "product_id",
      "name": "Product Name",
      "slug": "product-name",
      "description": "Detailed product description",
      "shortDescription": "Brief description",
      "price": 299.99,
      "comparePrice": 399.99,
      "sku": "PROD-001",
      "brand": "Brand Name",
      "category": {
        "_id": "category_id",
        "name": "Electronics",
        "slug": "electronics"
      },
      "images": [
        {
          "public_id": "cloudinary_id",
          "url": "https://cloudinary.com/image.jpg",
          "alt": "Product image",
          "isMain": true
        }
      ],
      "variants": [
        {
          "name": "Size",
          "options": ["S", "M", "L", "XL"]
        },
        {
          "name": "Color",
          "options": ["Red", "Blue", "Green"]
        }
      ],
      "specifications": [
        {
          "name": "Weight",
          "value": "1.5 kg"
        }
      ],
      "quantity": 50,
      "trackQuantity": true,
      "averageRating": 4.5,
      "numOfReviews": 25,
      "totalSales": 100,
      "views": 1500,
      "status": "active",
      "featured": true,
      "seoTitle": "SEO Title",
      "seoDescription": "SEO Description",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "relatedProducts": [
      // Array of related products
    ]
  }
}
```

### Create Product (Admin Only)
```http
POST /products
```
*Requires admin authentication*

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "shortDescription": "Brief description",
  "price": 299.99,
  "comparePrice": 399.99,
  "sku": "PROD-002",
  "category": "category_id",
  "brand": "Brand Name",
  "tags": ["tag1", "tag2"],
  "variants": [
    {
      "name": "Size",
      "options": ["S", "M", "L"]
    }
  ],
  "specifications": [
    {
      "name": "Weight",
      "value": "1.5 kg"
    }
  ],
  "quantity": 100,
  "trackQuantity": true,
  "status": "active",
  "featured": false
}
```

### Update Product (Admin Only)
```http
PUT /products/:id
```
*Requires admin authentication*

### Delete Product (Admin Only)
```http
DELETE /products/:id
```
*Requires admin authentication*

### Upload Product Images (Admin Only)
```http
POST /products/upload
```
*Requires admin authentication*

**Request:** Multipart form data with image files

## 📂 Category Endpoints

### Get All Categories
```http
GET /categories
```

**Query Parameters:**
- `featured` (boolean): Featured categories only
- `parent` (string): Parent category ID
- `level` (number): Category level

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "category_id",
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic products",
      "image": {
        "url": "https://cloudinary.com/category.jpg",
        "alt": "Category image"
      },
      "parent": null,
      "level": 0,
      "path": "",
      "status": "active",
      "featured": true,
      "sortOrder": 1,
      "productCount": 150,
      "children": [
        // Child categories
      ],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create Category (Admin Only)
```http
POST /categories
```

### Update Category (Admin Only)
```http
PUT /categories/:id
```

### Delete Category (Admin Only)
```http
DELETE /categories/:id
```

## 🛒 Cart Endpoints

### Get User Cart
```http
GET /cart
```
*Requires authentication*

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "product": {
          "_id": "product_id",
          "name": "Product Name",
          "slug": "product-name",
          "price": 299.99,
          "images": [
            {
              "url": "https://cloudinary.com/image.jpg",
              "alt": "Product image",
              "isMain": true
            }
          ],
          "status": "active",
          "quantity": 50,
          "trackQuantity": true
        },
        "quantity": 2,
        "price": 299.99,
        "selectedVariants": [
          {
            "name": "Size",
            "value": "M"
          }
        ]
      }
    ],
    "totalItems": 2,
    "totalPrice": 599.98,
    "appliedCoupon": {
      "code": "SAVE20",
      "discount": 20,
      "discountType": "percentage"
    },
    "discountAmount": 119.996,
    "finalPrice": 479.984,
    "lastModified": "2024-01-01T00:00:00.000Z"
  }
}
```

### Add Item to Cart
```http
POST /cart/add
```
*Requires authentication*

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 2,
  "selectedVariants": [
    {
      "name": "Size",
      "value": "M"
    },
    {
      "name": "Color",
      "value": "Blue"
    }
  ]
}
```

### Update Cart Item
```http
PUT /cart/update
```
*Requires authentication*

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 3,
  "selectedVariants": [
    {
      "name": "Size",
      "value": "M"
    }
  ]
}
```

### Remove Item from Cart
```http
DELETE /cart/remove/:productId
```
*Requires authentication*

**Request Body:**
```json
{
  "selectedVariants": [
    {
      "name": "Size",
      "value": "M"
    }
  ]
}
```

### Clear Cart
```http
DELETE /cart/clear
```
*Requires authentication*

### Apply Coupon
```http
POST /cart/coupon
```
*Requires authentication*

**Request Body:**
```json
{
  "code": "SAVE20"
}
```

### Remove Coupon
```http
DELETE /cart/coupon
```
*Requires authentication*

## 📦 Order Endpoints

### Create Order
```http
POST /orders
```
*Requires authentication*

**Request Body:**
```json
{
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "billingAddress": {
    // Same structure as shipping address (optional)
  },
  "paymentMethod": "card",
  "notes": "Please handle with care"
}
```

### Get User Orders
```http
GET /orders/my
```
*Requires authentication*

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Order status filter

### Get Single Order
```http
GET /orders/:id
```
*Requires authentication*

### Get All Orders (Admin Only)
```http
GET /orders
```
*Requires admin authentication*

### Update Order Status (Admin Only)
```http
PUT /orders/:id/status
```
*Requires admin authentication*

**Request Body:**
```json
{
  "status": "shipped",
  "note": "Order shipped via FedEx",
  "trackingNumber": "1234567890",
  "carrier": "FedEx"
}
```

## ⭐ Review Endpoints

### Create Review
```http
POST /reviews
```
*Requires authentication*

**Request Body:**
```json
{
  "product": "product_id",
  "rating": 5,
  "title": "Great product!",
  "comment": "I love this product. Highly recommended!",
  "pros": ["Great quality", "Fast shipping"],
  "cons": ["A bit expensive"]
}
```

### Get Product Reviews
```http
GET /reviews/:productId
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `sort` (string): Sort by (newest, oldest, rating-high, rating-low, helpful)

### Delete Review
```http
DELETE /reviews/:id
```
*Requires authentication (owner or admin)*

### Mark Review as Helpful
```http
POST /reviews/:id/helpful
```
*Requires authentication*

### Report Review
```http
POST /reviews/:id/report
```
*Requires authentication*

**Request Body:**
```json
{
  "reason": "inappropriate"
}
```

## 👤 User Profile Endpoints

### Get User Profile
```http
GET /users/profile
```
*Requires authentication*

### Update User Profile
```http
PUT /users/profile
```
*Requires authentication*

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

### Get User Addresses
```http
GET /users/addresses
```
*Requires authentication*

### Add Address
```http
POST /users/addresses
```
*Requires authentication*

**Request Body:**
```json
{
  "type": "home",
  "firstName": "John",
  "lastName": "Doe",
  "company": "Company Name",
  "address": "123 Main St",
  "apartment": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "phone": "+1234567890",
  "isDefault": true
}
```

### Update Address
```http
PUT /users/addresses/:id
```
*Requires authentication*

### Delete Address
```http
DELETE /users/addresses/:id
```
*Requires authentication*

### Add to Wishlist
```http
POST /users/wishlist/:productId
```
*Requires authentication*

### Remove from Wishlist
```http
DELETE /users/wishlist/:productId
```
*Requires authentication*

## 🎟️ Coupon Endpoints

### Validate Coupon
```http
GET /coupons/validate?code=SAVE20
```
*Requires authentication*

### Create Coupon (Admin Only)
```http
POST /coupons
```
*Requires admin authentication*

**Request Body:**
```json
{
  "code": "SAVE20",
  "description": "20% off on all items",
  "discountType": "percentage",
  "discountValue": 20,
  "minimumAmount": 100,
  "maximumDiscount": 50,
  "usageLimit": 1000,
  "userLimit": 1,
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T23:59:59.000Z",
  "isActive": true,
  "isPublic": true
}
```

## 🔔 Notification Endpoints

### Get User Notifications
```http
GET /notifications
```
*Requires authentication*

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `unread` (boolean): Unread notifications only

### Mark Notification as Read
```http
PUT /notifications/read/:id
```
*Requires authentication*

### Mark All Notifications as Read
```http
PUT /notifications/read-all
```
*Requires authentication*

## ❌ Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## 🔄 Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 requests per 15 minutes per IP
- **File Upload**: 10 requests per hour per user

## 📊 Pagination

All list endpoints support pagination with the following parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Response includes pagination metadata:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```