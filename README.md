# Banitha Tex

A comprehensive e-commerce platform for yarn and textile products.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Testing](#testing)
- [License](#license)

## Overview

Banitha Tex is a full-featured e-commerce solution designed specifically for yarn and textile businesses. The platform allows customers to browse products, manage their cart, and place orders, while providing administrators with comprehensive tools for inventory management, order processing, and business analytics.

## Features

### User Authentication and Management
- User registration and login system
- Password reset functionality
- Role-based authorization (customer and admin roles)

### Product Management
- Add, update, delete, and view products
- Product categorization by type and count
- Image upload and management
- Stock level tracking

### Cart Management
- Add products to cart with options (color, count, quantity)
- View cart items
- Remove individual items or clear entire cart
- Persistent cart across sessions

### Order Management
- Place orders with shipping information
- Multiple payment options (COD and card)
- Order history for customers

### Notifications
- Low stock alerts for admins
- Order confirmation messages
- Order status update notifications

### Admin Dashboard
- Inventory management
- Order processing and status updates
- Business insights and analytics
- User account management

### Customer Dashboard 
- Profile management
- Password change

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Library used React JS with Vite framework.

### Backend
- Node.js
- Express.js
- MySQL database

### Other Technologies
- JWT for authentication
- Payment gateway used
- Image storage solution used



## Configuration

Configure the application by editing the `.env` file:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=banitha_tex

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Email Configuration (for password reset)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# Upload Configuration
UPLOAD_PATH=./uploads
```

## API Documentation

### User Authentication

#### Register User
```
POST /api/auth/register
```
Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "gender": "Male",
  "contact": "1234567890"
}
```

#### Login
```
POST /api/auth/login
```
Request body:
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

#### Request Password Reset
```
POST /api/auth/forgot-password
```
Request body:
```json
{
  "email": "john@example.com"
}
```

### Product Management

#### Add Product
```
POST /api/products
```
Request body:
```json
{
  "name": "Cotton Yarn",
  "description": "High-quality cotton yarn",
  "price": 299.99,
  "color": "White",
  "stock_quantity": 500,
  "image_url": "base64_encoded_image",
  "type_id": 1,
  "count_id": 2
}
```

#### Get All Products
```
GET /api/products
```

#### Update Product
```
PUT /api/products/:id
```

#### Delete Product
```
DELETE /api/products/:id
```

### Cart Management

#### Add to Cart
```
POST /api/cart
```
Request body:
```json
{
  "product_id": 1,
  "color": "White",
  "count_id": 2,
  "quantity": 5
}
```

#### Get Cart
```
GET /api/cart
```

#### Delete Cart Item
```
DELETE /api/cart/:id
```

#### Clear Cart
```
DELETE /api/cart
```

### Order Management

#### Place Order
```
POST /api/orders
```
Request body:
```json
{
  "shipping_address": "123 Main St, City, Country",
  "payment_method": "cod"
}
```

#### Get User Orders
```
GET /api/orders
```

#### Update Order Status (Admin)
```
PUT /api/orders/:id
```
Request body:
```json
{
  "status": "shipped"
}
```

## Screenshots

![login page](https://github.com/user-attachments/assets/1adb22b8-6564-4725-9115-03eec0ea497c)
![home page](https://github.com/user-attachments/assets/010d528a-9dc5-4bc3-9b69-11fea5ed3c41)
![customer dashboard](https://github.com/user-attachments/assets/21b0104b-f475-4983-bf59-56ee90aa158b)
![admin dashboard](https://github.com/user-attachments/assets/fa1538d4-7029-4fdd-9ce6-d703837a5ba3)


