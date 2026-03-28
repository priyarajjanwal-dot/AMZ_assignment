import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartAPI } from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user._id) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await cartAPI.getCart(user._id);
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId, quantity = 1) => {
    try {
      const { data } = await cartAPI.addItem({ userId: user._id, productId, quantity });
      setCart(data);
    } catch (err) {
      console.error('Add cart error:', err);
    }
  };

  const updateQty = async (productId, quantity) => {
    try {
      const { data } = await cartAPI.updateItem({ userId: user._id, productId, quantity });
      setCart(data);
    } catch (err) {
      console.error('Update qty error:', err);
    }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await cartAPI.removeItem(user._id, productId);
      setCart(data);
    } catch (err) {
      console.error('Remove item error:', err);
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart(user._id);
      setCart({ items: [] });
    } catch (err) {
      console.error('Clear cart error:', err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addItem, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
