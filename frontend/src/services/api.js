import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('amazon_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  getFeatured: () => api.get('/products/featured'),
};

export const cartAPI = {
  getCart: (userId) => api.get(`/cart/${userId}`),
  addItem: (data) => api.post('/cart/add', data),
  updateItem: (data) => api.put('/cart/update', data),
  removeItem: (userId, productId) => api.delete(`/cart/remove/${productId}`, { data: { userId } }),
  clearCart: (userId) => api.delete(`/cart/clear/${userId}`),
};

export const orderAPI = {
  placeOrder: (data) => api.post('/orders', data),
  getUserOrders: (userId) => api.get(`/orders/${userId}`),
  getOrderById: (orderId) => api.get(`/orders/detail/${orderId}`),
};

export const userAPI = {
  login: (data) => api.post('/users/login', data),
  register: (data) => api.post('/users/register', data),
  getProfile: () => api.get('/users/profile'),
  addAddress: (data) => api.post('/users/profile/address', data),
  addToWishlist: (productId) => api.post('/users/wishlist/add', { productId }),
  removeFromWishlist: (productId) => api.delete('/users/wishlist/remove', { data: { productId } }),
};

export default api;
