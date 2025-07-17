import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  username: string;
  role: 'admin' | 'staff';
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  categoryId?: number;
  category?: Category;
  totalCl: number;
  remainingCl: number;
  pricePerCl?: number;
  location?: string;
  photoUrl?: string;
  createdById?: number;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ClUpdate {
  id: number;
  productId: number;
  product?: Product;
  oldCl: number;
  newCl: number;
  updatedById?: number;
  updatedBy?: User;
  note?: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface CreateProductRequest {
  name: string;
  categoryId?: number;
  totalCl: number;
  remainingCl: number;
  pricePerCl?: number;
  location?: string;
}

export interface UpdateProductRequest {
  name?: string;
  categoryId?: number;
  totalCl?: number;
  remainingCl?: number;
  pricePerCl?: number;
  location?: string;
}

// Auth API
export const authAPI = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
  register: (data: { username: string; password: string; role: 'admin' | 'staff' }) => 
    api.post<User>('/auth/register', data),
  getProfile: () => api.get<User>('/auth/profile'),
};

// Users API
export const usersAPI = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get<Category[]>('/categories'),
  getById: (id: number) => api.get<Category>(`/categories/${id}`),
  create: (data: { name: string }) => api.post<Category>('/categories', data),
  update: (id: number, data: { name: string }) => api.patch<Category>(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Products API
export const productsAPI = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  create: (data: CreateProductRequest) => api.post<Product>('/products', data),
  update: (id: number, data: UpdateProductRequest) => api.patch<Product>(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
  uploadPhoto: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    return api.post<Product>(`/products/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getLowStock: (threshold?: number) => 
    api.get<Product[]>(`/products/low-stock${threshold ? `?threshold=${threshold}` : ''}`),
};

// CL Updates API
export const clUpdatesAPI = {
  getAll: () => api.get<ClUpdate[]>('/cl-updates'),
  getById: (id: number) => api.get<ClUpdate>(`/cl-updates/${id}`),
  getByProduct: (productId: number) => api.get<ClUpdate[]>(`/cl-updates/product/${productId}`),
  getRecent: (limit?: number) => 
    api.get<ClUpdate[]>(`/cl-updates/recent${limit ? `?limit=${limit}` : ''}`),
};

export default api; 