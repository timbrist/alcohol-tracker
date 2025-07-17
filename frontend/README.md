# Alcohol Tracker Frontend

A modern React TypeScript frontend for the Alcohol Tracker application, providing an intuitive interface for managing alcohol products, categories, and consumption tracking.

## Features

### 🎯 Core Features
- **User Authentication**: Secure login with JWT tokens
- **Role-Based Access Control**: Different interfaces for admin and staff users
- **Product Management**: Full CRUD operations for alcohol products
- **Category Management**: Organize products by categories
- **Consumption Tracking**: Track alcohol consumption in centiliters
- **Photo Upload**: Upload product images
- **Real-time Updates**: Live dashboard with statistics

### 👥 User Roles

#### Admin Users
- Create, edit, and delete products
- Manage categories
- Upload product photos
- View all users
- Access to all features

#### Staff Users
- View products and categories
- Update product quantities (remaining CL)
- View dashboard and statistics
- Limited access to management features

### 🎨 UI/UX Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean, professional design with Tailwind CSS
- **Interactive Elements**: Hover effects, loading states, and animations
- **Toast Notifications**: User-friendly feedback messages
- **Search & Filter**: Find products quickly with advanced filtering
- **Progress Indicators**: Visual consumption tracking

## Technology Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Headless UI** for accessible components

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Backend API running on `http://localhost:3000`

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

### Default Login Credentials
- **Username**: `admin`
- **Password**: `admin123`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with sidebar
│   └── ProductForm.tsx # Product creation/editing form
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── LoginPage.tsx   # Login page
│   ├── DashboardPage.tsx # Main dashboard
│   ├── ProductsPage.tsx # Products listing
│   ├── ProductDetailPage.tsx # Individual product view
│   ├── CategoriesPage.tsx # Categories management
│   └── UsersPage.tsx   # Users management (admin only)
├── services/           # API services
│   └── api.ts         # API client and types
├── App.tsx            # Main app component with routing
└── index.css          # Global styles and Tailwind imports
```

## Key Components

### Authentication
- **AuthContext**: Manages user authentication state
- **ProtectedRoute**: Guards routes requiring authentication
- **LoginPage**: User login interface

### Layout & Navigation
- **Layout**: Main application layout with sidebar navigation
- **Responsive Sidebar**: Collapsible navigation for mobile devices
- **Role-based Menu**: Different navigation items for admin/staff

### Product Management
- **ProductsPage**: Grid view of all products with filtering
- **ProductForm**: Create and edit product forms
- **ProductDetailPage**: Detailed product view with update history

### Dashboard
- **DashboardPage**: Overview with statistics and quick actions
- **Real-time Stats**: Product counts, consumption metrics
- **Quick Actions**: Direct links to common tasks

## API Integration

The frontend communicates with the NestJS backend through a centralized API service:

- **Base URL**: `http://localhost:3000/api`
- **Authentication**: JWT tokens in Authorization header
- **Error Handling**: Automatic token refresh and error notifications
- **Type Safety**: Full TypeScript integration with backend types

## Styling

The application uses Tailwind CSS with a custom color scheme:

- **Primary Colors**: Orange-based theme (`primary-500: #ed7516`)
- **Responsive Design**: Mobile-first approach
- **Custom Components**: Reusable button and input styles
- **Dark Mode Ready**: Prepared for future dark mode implementation

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Component Structure**: Functional components with hooks

## Deployment

### Build for Production

1. Build the application:
```bash
npm run build
```

2. The `build` folder contains the production-ready files

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Test on multiple screen sizes
4. Ensure accessibility standards are met

## License

This project is part of the Alcohol Tracker application.
