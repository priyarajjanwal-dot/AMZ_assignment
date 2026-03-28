import React, { createContext, useState, useEffect } from 'react';
import { userAPI } from '../services/api';

export const AuthContext = createContext();

const defaultGuestUser = { _id: "000000000000000000000001", name: "Rahul Sharma" };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('amazon_user');
      const token = localStorage.getItem('amazon_token');
      
      if (storedUser && token) {
        try {
          // Verify with backend right away to get latest wishlist/addresses
          const res = await userAPI.getProfile();
          setUser(res.data);
          localStorage.setItem('amazon_user', JSON.stringify(res.data));
        } catch(err) {
          console.error("Token expired or invalid");
          localStorage.removeItem('amazon_user');
          localStorage.removeItem('amazon_token');
          setUser(defaultGuestUser);
        }
      } else {
        setUser(defaultGuestUser);
      }
    };
    initAuth();
  }, []);

  const loginUser = async (email, password) => {
    const { data } = await userAPI.login({ email, password });
    setUser(data);
    localStorage.setItem('amazon_user', JSON.stringify(data));
    localStorage.setItem('amazon_token', data.token);
  };

  const logoutUser = () => {
    setUser(defaultGuestUser);
    localStorage.removeItem('amazon_user');
    localStorage.removeItem('amazon_token');
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('amazon_user', JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
