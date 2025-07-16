# [YMGS Pharmacy Backend](https://ymgs-backend.vercel.app/) &middot; [![Author Sanskar Gupta](https://img.shields.io/badge/Author-Sanskar-%3C%3E)](https://www.linkedin.com/in/sanskar-gupta-12476423b/)  
[![GitHub](https://img.shields.io/badge/GitHub-%3C%3E)](https://github.com/Sanskargupta0/YMGS-Backend)  
[![Node.js](https://img.shields.io/badge/Node.js-%3C%3E)](https://nodejs.org/)  
[![Express](https://img.shields.io/badge/Express-%3C%3E)](https://expressjs.com/)  
[![MongoDB](https://img.shields.io/badge/MongoDB-%3C%3E)](https://mongodb.com/)  
[![Stripe](https://img.shields.io/badge/Stripe-%3C%3E)](https://stripe.com/)

## 📝 Project Description

YMGS Pharmacy Backend is a robust and scalable Node.js API server that powers a comprehensive e-commerce pharmacy platform. This backend service handles user authentication, product management, order processing, cart functionality, payment integration, and content management for a modern pharmacy e-commerce system. Built with Express.js and MongoDB, it provides secure RESTful APIs with support for multiple payment gateways, image upload capabilities, and comprehensive order management.

## ⚙️ Tech Stack

- **Backend Framework**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: Cloudinary
- **Payment Processing**: Stripe, Razorpay
- **File Upload**: Multer
- **Security**: bcrypt for password hashing
- **Validation**: Validator.js
- **Environment**: dotenv
- **Development**: Nodemon

## 🔋 Features

👉 **User Management System**: Complete user authentication with registration, login, and JWT-based authorization. Support for both customer and admin accounts with role-based access control.

👉 **Product Management**: 
- CRUD operations for pharmaceutical products
- Multi-image upload support with Cloudinary integration
- Category and subcategory organization
- Bestseller flagging system
- Bulk quantity pricing support
- Minimum order quantity management

👉 **Shopping Cart System**: 
- Add/remove items from cart
- Quantity management
- Cart persistence across sessions
- Guest cart support

👉 **Advanced Order Management**: 
- Multiple order placement methods (COD, Stripe, Razorpay, Manual Payment)
- Guest checkout functionality
- Order status tracking and updates
- Payment verification system
- Order history and analytics

👉 **Payment Integration**: 
- Stripe payment gateway integration
- Razorpay payment support
- Manual payment processing with detailed payment info capture
- Cryptocurrency payment support
- Payment status management and verification

👉 **Coupon System**: 
- Percentage and fixed amount discounts
- Minimum order value restrictions
- Usage limits and tracking
- Coupon validation and application

👉 **Address Management**: 
- Multiple saved addresses per user
- Separate billing and shipping addresses
- Address validation and management

👉 **Content Management**: 
- Blog post creation and management
- Contact form handling
- Image upload and management
- Content publishing system

👉 **Admin Dashboard Support**: 
- Comprehensive admin authentication
- Product management interfaces
- Order tracking and status updates
- User management capabilities
- Analytics and reporting endpoints

👉 **Security Features**: 
- Password encryption with bcrypt
- JWT token-based authentication
- CORS configuration for secure cross-origin requests
- Input validation and sanitization
- Secure file upload handling

## 🏗️ System Architecture

### Core API Endpoints

#### User Management (`/api/user`)
- `POST /register` - User registration
- `POST /login` - User authentication
- `POST /admin` - Admin authentication

#### Product Management (`/api/product`)
- `GET /:id` - Get single product
- `POST /user/list` - Get products for users (public)
- `POST /add` - Add new product (admin)
- `POST /remove` - Remove product (admin)
- `POST /list` - Get all products (admin)
- `POST /edit` - Edit product (admin)

#### Cart Management (`/api/cart`)
- `POST /add` - Add item to cart
- `POST /update` - Update cart quantities
- `POST /get` - Get user cart

#### Order Management (`/api/order`)
- `POST /place` - Place COD order
- `POST /stripe` - Place Stripe order
- `POST /razorpay` - Place Razorpay order
- `POST /manual` - Place manual payment order
- `POST /guest` - Guest checkout
- `POST /list` - Get user orders
- `POST /status` - Update order status (admin)
- `POST /verifyStripe` - Verify Stripe payment
- `POST /verifyRazorpay` - Verify Razorpay payment

#### Address Management (`/api/address`)
- Address CRUD operations
- Multiple address support per user

#### Contact & Content (`/api/contact`, `/api/blog`)
- Contact form submissions
- Blog post management
- Content publishing system

### Database Schema

#### User Model
- User authentication and profile information
- Cart data persistence
- Saved addresses management

#### Product Model
- Product information with multi-image support
- Category and subcategory organization
- Pricing and inventory management
- Quantity-based pricing tiers

#### Order Model
- Comprehensive order tracking
- Guest order support
- Payment method flexibility
- Billing and shipping address separation
- Coupon integration

#### Blog Model
- Content management system
- Publishing status control
- Author attribution

## 🚀 Quick Start

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) (version 16.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas account)

### Cloning the Repository

```bash
git clone https://github.com/Sanskargupta0/YMGS-Backend.git
cd YMGS-Backend
```

### Installation

Install dependencies using npm:

```bash
npm install
```

### Environment Setup

1. Create a `.env` file in the root directory by copying from `.env.example`:

```bash
copy .env.example .env
```

2. Fill in all the required environment variables in your `.env` file. See the [Environment Variables](#environment-variables) section below for detailed instructions.

### Database Setup

1. **Set up MongoDB Database**:
   - Create a free MongoDB database on [MongoDB Atlas](https://www.mongodb.com/atlas) or use local MongoDB
   - Copy the connection string to your `.env` file

2. **Database Configuration**:
   - The application will automatically connect to MongoDB on startup
   - Collections will be created automatically when first used

### Required External Services Setup

#### 1. Cloudinary (Image Storage)
- Sign up at [Cloudinary](https://cloudinary.com/)
- Get your cloud name, API key, and API secret
- Add credentials to your `.env` file

#### 2. Payment Gateways

##### Stripe
- Create account at [Stripe](https://stripe.com/)
- Get your secret key from the dashboard
- Add to your `.env` file

##### Razorpay (Optional)
- Create account at [Razorpay](https://razorpay.com/)
- Get your key ID and secret key
- Add to your `.env` file

### Running the Application

1. **Start the development server**:

```bash
npm run server
```

2. **Start the production server**:

```bash
npm start
```

3. The server will start on `http://localhost:4000` (or the port specified in your environment variables)

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

### Database
- `MONGODB_URI`: Your MongoDB connection string

### Authentication
- `JWT_SECRET`: Secret key for JWT token generation

### Image Storage (Cloudinary)
- `CLOUDINARY_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_SECRET_KEY`: Your Cloudinary secret key

### Payment Gateways
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `RAZORPAY_KEY_ID`: Your Razorpay key ID (optional)
- `RAZORPAY_SECRET_KEY`: Your Razorpay secret key (optional)

### CORS Configuration
- `FRONTEND_URL`: URL of your frontend application
- `ADMIN_URL`: URL of your admin panel

### Server Configuration
- `PORT`: Port number for the server (default: 4000)

## 🌐 Integration with Frontend and Admin Panel

This backend API seamlessly integrates with two frontend applications:

### Frontend E-commerce Application
**Repository**: [YMGS-Frontend](https://github.com/Sanskargupta0/YMGS-Frontend)

The main customer-facing e-commerce application that provides:
- Product browsing and search
- User registration and authentication
- Shopping cart functionality
- Checkout and order placement
- Order history and tracking
- User profile management

### Admin Panel
**Repository**: [YMGS-Admin](https://github.com/Sanskargupta0/YMGS-Admin)

The administrative dashboard that provides:
- Product management (CRUD operations)
- Order management and tracking
- User management
- Content management (blogs, contacts)
- Analytics and reporting
- Coupon management

### Integration Flow

1. **Authentication**: Both applications use JWT tokens provided by this backend for user authentication
2. **API Communication**: All frontend applications communicate with this backend through RESTful APIs
3. **Image Management**: Product images and blog images are uploaded through this backend to Cloudinary
4. **Payment Processing**: All payment transactions are processed through this backend's payment gateways
5. **Data Synchronization**: Real-time data updates across all applications through shared database

## 📁 Project Structure

```
YMGS-Backend/
├── config/                       # Configuration files
│   ├── cloudinary.js            # Cloudinary configuration
│   └── mongodb.js               # MongoDB connection setup
├── controllers/                  # Business logic controllers
│   ├── addressController.js     # Address management
│   ├── blogController.js        # Blog post management
│   ├── cartController.js        # Shopping cart operations
│   ├── contactController.js     # Contact form handling
│   ├── orderController.js       # Order processing and management
│   ├── productController.js     # Product CRUD operations
│   ├── uploadImage.js           # Image upload handling
│   └── userController.js        # User authentication and management
├── middleware/                   # Express middleware
│   ├── adminAuth.js             # Admin authentication middleware
│   ├── auth.js                  # User authentication middleware
│   ├── multer.js                # File upload middleware
│   └── optionalAuth.js          # Optional authentication middleware
├── models/                       # Database schemas
│   ├── blogModel.js             # Blog post schema
│   ├── contactModel.js          # Contact form schema
│   ├── couponModel.js           # Coupon system schema
│   ├── cryptoWalletModel.js     # Cryptocurrency wallet schema
│   ├── orderModel.js            # Order management schema
│   ├── productModel.js          # Product catalog schema
│   ├── settingsModel.js         # Application settings schema
│   └── userModel.js             # User account schema
├── routes/                       # API route definitions
│   ├── addressRoute.js          # Address management routes
│   ├── blogRoute.js             # Blog management routes
│   ├── cartRoute.js             # Cart operation routes
│   ├── contactRoutes.js         # Contact form routes
│   ├── orderRoute.js            # Order processing routes
│   ├── productRoute.js          # Product management routes
│   ├── uploadImageRoute.js      # Image upload routes
│   └── userRoutes.js            # User authentication routes
├── utils/                        # Utility functions
│   └── error.js                 # Error handling utilities
├── .env.example                 # Environment variables template
├── package.json                 # Project dependencies and scripts
├── server.js                    # Main application entry point
└── vercel.json                  # Vercel deployment configuration
```

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run server

# Start production server
npm start

# Check for security vulnerabilities
npm audit

# Update dependencies
npm update
```

## 🔒 Security Features

- **Password Security**: Passwords are hashed using bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication with expiration
- **CORS Protection**: Configured CORS policies for specific origins
- **Input Validation**: Server-side validation using validator.js
- **File Upload Security**: Secure file upload with type and size restrictions
- **Environment Variables**: Sensitive data stored securely in environment variables
- **Rate Limiting**: Built-in protection against API abuse (can be enhanced)

## 📊 API Response Format

All API endpoints follow a consistent response format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    // Error details (in development mode)
  }
}
```

## 🚦 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Check your MongoDB URI in the `.env` file
   - Ensure MongoDB service is running (for local installation)
   - Verify network access for MongoDB Atlas

2. **Cloudinary Upload Fails**:
   - Verify Cloudinary credentials in `.env` file
   - Check Cloudinary account quota and permissions
   - Ensure proper file format and size limits

3. **Payment Gateway Issues**:
   - Confirm Stripe/Razorpay API keys are correct
   - Check account status and permissions
   - Verify webhook configurations (if using webhooks)

4. **CORS Errors**:
   - Ensure frontend URLs are correctly configured in CORS settings
   - Check that the frontend is sending requests to the correct backend URL

5. **JWT Token Issues**:
   - Verify JWT_SECRET is set in environment variables
   - Check token expiration settings
   - Ensure proper token format in frontend requests

### Performance Tips

- Use database indexing for frequently queried fields
- Implement caching for product listings and static content
- Optimize image sizes before uploading to Cloudinary
- Monitor database query performance
- Use compression middleware for API responses

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow the existing code structure and naming conventions
2. Add proper error handling for all new endpoints
3. Include input validation for all user inputs
4. Write clear commit messages
5. Test thoroughly before submitting pull requests

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review your environment variables configuration
3. Ensure all external services are properly configured
4. Check server logs for detailed error messages

For additional support, feel free to open an issue on the GitHub repository.

---

Built with ❤️ by [Sanskar Gupta](https://www.linkedin.com/in/sanskar-gupta-12476423b/)
