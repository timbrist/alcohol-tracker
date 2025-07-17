import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Edit, 
  ArrowLeft, 
  TrendingDown, 
  Calendar,
  User,
  Package
} from 'lucide-react';
import { productsAPI, clUpdatesAPI } from '../services/api';
import { Product, ClUpdate } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [updates, setUpdates] = useState<ClUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newCl, setNewCl] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchUpdates();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(Number(id));
      setProduct(response.data);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdates = async () => {
    try {
      const response = await clUpdatesAPI.getByProduct(Number(id));
      setUpdates(response.data);
    } catch (error) {
      toast.error('Failed to load update history');
    }
  };

  const handleUpdateCl = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCl || !product) return;
    
    const newClValue = Number(newCl);
    if (newClValue < 0 || newClValue > product.totalCl) {
      toast.error('Invalid CL value');
      return;
    }

    setUpdating(true);
    try {
      const response = await productsAPI.update(product.id, {
        remainingCl: newClValue
      });
      setProduct(response.data);
      setNewCl('');
      setNote('');
      await fetchUpdates(); // Refresh update history
      toast.success('Product updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Product not found</h3>
        <Link to="/products" className="btn-primary mt-4">
          Back to Products
        </Link>
      </div>
    );
  }

  const consumedCl = product.totalCl - product.remainingCl;
  const consumptionPercentage = (consumedCl / product.totalCl) * 100;

  const getStockStatus = (remainingCl: number) => {
    if (remainingCl <= 5) return { color: 'text-red-600', bg: 'bg-red-100', text: 'Critical' };
    if (remainingCl <= 10) return { color: 'text-orange-600', bg: 'bg-orange-100', text: 'Low' };
    if (remainingCl <= 25) return { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Medium' };
    return { color: 'text-green-600', bg: 'bg-green-100', text: 'Good' };
  };

  const stockStatus = getStockStatus(product.remainingCl);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/products')}
            className="btn-secondary flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        </div>
        {isAdmin && (
          <Link
            to={`/products/${product.id}/edit`}
            className="btn-primary flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Product Information */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
            
            {/* Product Image */}
            {product.photoUrl && (
              <div className="mb-6">
                <img
                  src={product.photoUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Category</label>
                <p className="mt-1 text-sm text-gray-900">{product.category?.name || 'No category'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Location</label>
                <p className="mt-1 text-sm text-gray-900">{product.location || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Total CL</label>
                <p className="mt-1 text-sm text-gray-900">{product.totalCl}cl</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Remaining CL</label>
                <p className="mt-1 text-sm text-gray-900">{product.remainingCl}cl</p>
              </div>
              {product.pricePerCl && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Price per CL</label>
                  <p className="mt-1 text-sm text-gray-900">${product.pricePerCl}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-500">Stock Status</label>
                <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                  {stockStatus.text}
                </div>
              </div>
            </div>

            {/* Consumption Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Consumption Progress</span>
                <span>{consumptionPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${consumptionPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Consumed: {consumedCl}cl</span>
                <span>Remaining: {product.remainingCl}cl</span>
              </div>
            </div>
          </div>

          {/* Quick Update Form */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Update Remaining CL</h3>
            <form onSubmit={handleUpdateCl} className="space-y-4">
              <div>
                <label htmlFor="newCl" className="block text-sm font-medium text-gray-700">
                  New Remaining CL
                </label>
                <input
                  type="number"
                  id="newCl"
                  value={newCl}
                  onChange={(e) => setNewCl(e.target.value)}
                  className="input-field mt-1"
                  min="0"
                  max={product.totalCl}
                  step="0.1"
                  placeholder={`0 - ${product.totalCl}`}
                  required
                />
              </div>
              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                  Note (optional)
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="input-field mt-1"
                  rows={3}
                  placeholder="Add a note about this update..."
                />
              </div>
              <button
                type="submit"
                disabled={updating || !newCl}
                className="btn-primary w-full flex items-center justify-center"
              >
                {updating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <TrendingDown className="h-4 w-4 mr-2" />
                )}
                {updating ? 'Updating...' : 'Update CL'}
              </button>
            </form>
          </div>
        </div>

        {/* Update History */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Update History</h3>
          
          {updates.length > 0 ? (
            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update.id} className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {update.oldCl}cl → {update.newCl}cl
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${
                      update.newCl - update.oldCl > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {update.newCl - update.oldCl > 0 ? '+' : ''}{(update.newCl - update.oldCl).toFixed(1)}cl
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(update.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {update.updatedBy?.username || 'Unknown'}
                    </div>
                  </div>
                  
                  {update.note && (
                    <p className="mt-2 text-sm text-gray-600">{update.note}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingDown className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No updates yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 