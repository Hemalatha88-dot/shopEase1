import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    } else {
      setAuthToken(null);
    }
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Try to get user profile to verify token is valid
          const response = await api.get('/stores/profile');
          setUser({ ...response.data.data, role: 'store_manager' });
        } catch (error) {
          console.error('Token validation failed:', error.response?.data || error.message);
          // Token is invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Store Manager Authentication
  const storeManagerLogin = async (email, password) => {
    try {
      console.log('AuthContext: Attempting login with:', { email, password });
      
      const response = await api.post('/auth/login', {
        email,
        password
      });

      console.log('AuthContext: Login response:', response.data);

      const { token: newToken } = response.data.data;

      // Clear any existing invalid data first
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);

      // Set new token and user data
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setAuthToken(newToken);

      // fetch profile after login to populate user
      try {
        const profile = await api.get('/stores/profile');
        const userData = { ...profile.data.data, role: 'store_manager' };
        setUser(userData);
        console.log('AuthContext: User profile loaded:', userData);
      } catch (profileError) {
        console.error('AuthContext: Failed to load profile:', profileError);
        // Even if profile fails, we can still set basic user info from login response
        const basicUserData = { 
          id: response.data.data.storeId,
          name: response.data.data.name,
          email: response.data.data.email,
          role: 'store_manager' 
        };
        setUser(basicUserData);
      }
      
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('AuthContext: Login error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const storeManagerRegister = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      const { token: newToken } = response.data.data;

      // Clear any existing invalid data first
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);

      // Set new token and user data
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setAuthToken(newToken);

      try {
        const profile = await api.get('/stores/profile');
        const userData = { ...profile.data.data, role: 'store_manager' };
        setUser(userData);
      } catch (profileError) {
        console.error('AuthContext: Failed to load profile after registration:', profileError);
        // Even if profile fails, we can still set basic user info from registration response
        const basicUserData = { 
          id: response.data.data.storeId,
          name: response.data.data.name,
          email: response.data.data.email,
          role: 'store_manager' 
        };
        setUser(basicUserData);
      }
      
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Customer Authentication
  const customerRegister = async (customerData) => {
    try {
      const response = await api.post('/auth/customer/register', customerData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const customerVerifyOTP = async (phone, otp) => {
    try {
      const response = await api.post('/auth/customer/verify-otp', {
        phone,
        otp
      });

      const { token: newToken, ...userData } = response.data.data;
      
      localStorage.setItem('customerToken', newToken);
      setToken(newToken);
      setUser({ ...userData, role: 'customer' });
      
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'OTP verification failed' 
      };
    }
  };

  const resendOTP = async (phone) => {
    try {
      const response = await api.post('/auth/customer/resend-otp', {
        phone
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to resend OTP' 
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('customerToken');
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  // Clear all auth data (useful for debugging)
  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('customerToken');
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  // Check if user is store manager
  const isStoreManager = () => {
    return user && user.role === 'store_manager';
  };

  // Check if user is customer
  const isCustomer = () => {
    return user && user.role === 'customer';
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    token,
    storeManagerLogin,
    storeManagerRegister,
    customerRegister,
    customerVerifyOTP,
    resendOTP,
    logout,
    clearAuth,
    isStoreManager,
    isCustomer,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 