# Alcohol Tracker - NestJS API

A comprehensive alcohol inventory tracking system built with NestJS, TypeScript, and PostgreSQL. The system tracks alcohol products by centiliter consumption and provides role-based access control for admin and staff users.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Product Management**: CRUD operations for alcohol products with photo upload
- **Category Management**: Organize products by alcohol categories
- **Centiliter Tracking**: Monitor alcohol consumption with detailed update logs
- **Role-Based Access**: 
  - **Admin**: Can create, update, delete products and manage users
  - **Staff**: Can only update product quantities
- **File Upload**: Support for product photos
- **Low Stock Alerts**: Monitor products with low inventory

## Database Schema

The system uses PostgreSQL with the following tables:
- `users` - Bar staff and admin users
- `categories` - Alcohol categories (Whiskey, Vodka, etc.)
- `products` - Alcohol products with centiliter tracking
- `cl_updates` - Log of all centiliter changes

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alcohol-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=alcohol_tracker
   
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=24h
   
   UPLOAD_DEST=./uploads
   MAX_FILE_SIZE=5242880
   
   PORT=3000
   NODE_ENV=development
   ```

4. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE alcohol_tracker;
   ```

5. **Run database migrations**
   ```bash
   # The application will automatically create tables in development mode
   # Or run the SQL file manually:
   psql -d alcohol_tracker -f src/database/migrations/001-initial-schema.sql
   ```

6. **Start the application**
   ```bash
   npm run start:dev
   ```

## Default Admin User

The system comes with a default admin user:
- **Username**: `admin`
- **Password**: `admin123`

**Important**: Change the default password after first login!

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username and password
- `POST /api/auth/register` - Register new user (Admin only)
- `GET /api/auth/profile` - Get current user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (Admin only)
- `PATCH /api/products/:id` - Update product (Admin can update all fields, Staff can only update remaining_cl)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `POST /api/products/:id/photo` - Upload product photo (Admin only)
- `GET /api/products/low-stock` - Get products with low stock

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category (Admin only)
- `PATCH /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### CL Updates (Centiliter Tracking)
- `GET /api/cl-updates` - Get all centiliter updates
- `GET /api/cl-updates/recent` - Get recent updates
- `GET /api/cl-updates/product/:productId` - Get updates for specific product
- `GET /api/cl-updates/:id` - Get specific update

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)

## Usage Examples

### 1. Login as Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 2. Create a New Product (Admin)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jack Daniels Whiskey",
    "categoryId": 1,
    "totalCl": 750,
    "remainingCl": 750,
    "pricePerCl": 0.15,
    "location": "Main Bar Shelf"
  }'
```

### 3. Update Product Quantity (Staff)
```bash
curl -X PATCH http://localhost:3000/api/products/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"remainingCl": 650}'
```

### 4. Upload Product Photo (Admin)
```bash
curl -X POST http://localhost:3000/api/products/1/photo \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "photo=@/path/to/photo.jpg"
```

## Development

### Running in Development Mode
```bash
npm run start:dev
```

### Building for Production
```bash
npm run build
npm run start:prod
```

### Running Tests
```bash
npm run test
npm run test:e2e
```

## File Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── guards/          # JWT and role guards
│   ├── decorators/      # Role decorators
│   └── ...
├── users/               # User management
├── categories/          # Category management
├── products/            # Product management
├── cl-updates/          # Centiliter tracking
├── database/            # Database migrations and seeds
└── main.ts              # Application entry point
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation with class-validator
- File upload restrictions
- CORS enabled

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 
