import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Save, X } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../services/api';
import { Product, Category } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface ProductFormProps {
  mode: 'create' | 'edit';
}

const ProductForm: React.FC<ProductFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    totalCl: '',
    remainingCl: '',
    pricePerCl: '',
    location: '',
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  useEffect(() => {
    fetchCategories();
    if (mode === 'edit' && id) {
      fetchProduct();
    }
  }, [mode, id]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const fetchProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await productsAPI.getById(Number(id));
      const product = response.data;
      setFormData({
        name: product.name,
        categoryId: product.categoryId?.toString() || '',
        totalCl: product.totalCl.toString(),
        remainingCl: product.remainingCl.toString(),
        pricePerCl: product.pricePerCl?.toString() || '',
        location: product.location || '',
      });
      if (product.photoUrl) {
        setPhotoPreview(product.photoUrl);
      }
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.totalCl || !formData.remainingCl) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (Number(formData.remainingCl) > Number(formData.totalCl)) {
      toast.error('Remaining CL cannot be greater than total CL');
      return;
    }

    setSaving(true);
    try {
      const productData = {
        name: formData.name,
        categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
        totalCl: Number(formData.totalCl),
        remainingCl: Number(formData.remainingCl),
        pricePerCl: formData.pricePerCl ? Number(formData.pricePerCl) : undefined,
        location: formData.location || undefined,
      };

      let product: Product;
      
      if (mode === 'create') {
        const response = await productsAPI.create(productData);
        product = response.data;
        toast.success('Product created successfully');
      } else {
        const response = await productsAPI.update(Number(id), productData);
        product = response.data;
        toast.success('Product updated successfully');
      }

      // Upload photo if selected
      if (photoFile && product) {
        try {
          await productsAPI.uploadPhoto(product.id, photoFile);
          toast.success('Photo uploaded successfully');
        } catch (error) {
          toast.error('Failed to upload photo');
        }
      }

      navigate('/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${mode} product`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Add New Product' : 'Edit Product'}
        </h1>
        <button
          onClick={() => navigate('/products')}
          className="btn-secondary flex items-center"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field mt-1"
                required
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="input-field mt-1"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="totalCl" className="block text-sm font-medium text-gray-700">
                Total CL *
              </label>
              <input
                type="number"
                id="totalCl"
                name="totalCl"
                value={formData.totalCl}
                onChange={handleInputChange}
                className="input-field mt-1"
                min="0"
                step="0.1"
                required
              />
            </div>

            <div>
              <label htmlFor="remainingCl" className="block text-sm font-medium text-gray-700">
                Remaining CL *
              </label>
              <input
                type="number"
                id="remainingCl"
                name="remainingCl"
                value={formData.remainingCl}
                onChange={handleInputChange}
                className="input-field mt-1"
                min="0"
                step="0.1"
                required
              />
            </div>

            <div>
              <label htmlFor="pricePerCl" className="block text-sm font-medium text-gray-700">
                Price per CL
              </label>
              <input
                type="number"
                id="pricePerCl"
                name="pricePerCl"
                value={formData.pricePerCl}
                onChange={handleInputChange}
                className="input-field mt-1"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="input-field mt-1"
                placeholder="e.g., Bar shelf, Storage room"
              />
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Photo</h3>
          
          <div className="space-y-4">
            {photoPreview && (
              <div className="flex justify-center">
                <img
                  src={photoPreview}
                  alt="Product preview"
                  className="h-48 w-48 object-cover rounded-lg"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photo
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="photo"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    id="photo"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm; 