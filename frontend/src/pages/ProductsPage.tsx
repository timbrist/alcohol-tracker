import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Upload,
  Package
} from 'lucide-react';
import { productsAPI, categoriesAPI } from '../services/api';
import { Product, Category } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [showLowStock, setShowLowStock] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productsAPI.delete(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.categoryId === selectedCategory;
    const matchesLowStock = !showLowStock || product.remainingCl <= 10;
    
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const getStockStatus = (remainingCl: number) => {
    if (remainingCl <= 5) return { color: 'text-red-600', bg: 'bg-red-100', text: 'Critical' };
    if (remainingCl <= 10) return { color: 'text-orange-600', bg: 'bg-orange-100', text: 'Low' };
    if (remainingCl <= 25) return { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Medium' };
    return { color: 'text-green-600', bg: 'bg-green-100', text: 'Good' };
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
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

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                placeholder="Search products..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : '')}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Filter
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="lowStock"
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="lowStock" className="ml-2 text-sm text-gray-700">
                Low Stock Only
              </label>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setShowLowStock(false);
              }}
              className="btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.remainingCl);
          const consumedCl = product.totalCl - product.remainingCl;
          const consumptionPercentage = (consumedCl / product.totalCl) * 100;

          return (
            <div key={product.id} className="card hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
                {product.photoUrl ? (
                  <img
                    src={product.photoUrl}
                    alt={product.name}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-48">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category?.name}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Remaining:</span>
                    <span className="font-medium">{product.remainingCl}cl</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total:</span>
                    <span className="font-medium">{product.totalCl}cl</span>
                  </div>
                  {product.pricePerCl && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-medium">${product.pricePerCl}/cl</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Consumption</span>
                    <span>{consumptionPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${consumptionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stock Status */}
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                  {stockStatus.text} Stock
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Link
                    to={`/products/${product.id}`}
                    className="flex-1 btn-secondary flex items-center justify-center text-sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                  {isAdmin && (
                    <>
                      <Link
                        to={`/products/${product.id}/edit`}
                        className="flex-1 btn-primary flex items-center justify-center text-sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 btn-danger flex items-center justify-center text-sm"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
