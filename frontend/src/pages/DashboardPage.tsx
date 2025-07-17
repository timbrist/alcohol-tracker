import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Tags, 
  TrendingDown, 
  AlertTriangle,
  Plus,
  Eye
} from 'lucide-react';
import { productsAPI, categoriesAPI, clUpdatesAPI } from '../services/api';
import { Product, Category, ClUpdate } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<ClUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, categoriesRes, lowStockRes, updatesRes] = await Promise.all([
          productsAPI.getAll(),
          categoriesAPI.getAll(),
          productsAPI.getLowStock(10),
          clUpdatesAPI.getRecent(5)
        ]);

        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setLowStockProducts(lowStockRes.data);
        setRecentUpdates(updatesRes.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalValue = products.reduce((sum, product) => {
    return sum + (product.pricePerCl || 0) * product.remainingCl;
  }, 0);

  const totalConsumed = products.reduce((sum, product) => {
    return sum + (product.totalCl - product.remainingCl);
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        {isAdmin && (
          <Link
            to="/products/new"
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Tags className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Categories</p>
              <p className="text-2xl font-semibold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingDown className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Consumed</p>
              <p className="text-2xl font-semibold text-gray-900">{totalConsumed.toFixed(1)}cl</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Low Stock</p>
              <p className="text-2xl font-semibold text-gray-900">{lowStockProducts.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Low Stock Products */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Low Stock Products</h3>
            <Link to="/products" className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">{product.remainingCl}cl</p>
                    <p className="text-xs text-gray-500">remaining</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No low stock products</p>
          )}
        </div>

        {/* Recent Updates */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Updates</h3>
            <Link to="/cl-updates" className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
          {recentUpdates.length > 0 ? (
            <div className="space-y-3">
              {recentUpdates.map((update) => (
                <div key={update.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{update.product?.name}</p>
                    <p className="text-sm text-gray-500">
                      {update.oldCl}cl → {update.newCl}cl
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {update.newCl - update.oldCl > 0 ? '+' : ''}{(update.newCl - update.oldCl).toFixed(1)}cl
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(update.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent updates</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {isAdmin && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/products/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-5 w-5 text-primary-600 mr-3" />
              <span className="font-medium text-gray-900">Add Product</span>
            </Link>
            <Link
              to="/categories"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Tags className="h-5 w-5 text-green-600 mr-3" />
              <span className="font-medium text-gray-900">Manage Categories</span>
            </Link>
            <Link
              to="/users"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-5 w-5 text-blue-600 mr-3" />
              <span className="font-medium text-gray-900">View Users</span>
            </Link>
            <Link
              to="/products"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="h-5 w-5 text-purple-600 mr-3" />
              <span className="font-medium text-gray-900">All Products</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage; 