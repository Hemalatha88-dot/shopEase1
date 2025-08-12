import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopperContext = createContext();

export const useShopperContext = () => {
  const context = useContext(ShopperContext);
  if (!context) {
    throw new Error('useShopperContext must be used within a ShopperProvider');
  }
  return context;
};

export const ShopperProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStore, setCurrentStore] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check for existing customer session on load
  useEffect(() => {
    const savedCustomer = localStorage.getItem('shopease_customer');
    if (savedCustomer) {
      try {
        const customerData = JSON.parse(savedCustomer);
        setCustomer(customerData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved customer data:', error);
        localStorage.removeItem('shopease_customer');
      }
    }
  }, []);

  const loginCustomer = (customerData) => {
    setCustomer(customerData);
    setIsAuthenticated(true);
    localStorage.setItem('shopease_customer', JSON.stringify(customerData));
  };

  const logoutCustomer = () => {
    setCustomer(null);
    setIsAuthenticated(false);
    localStorage.removeItem('shopease_customer');
  };

  const updateCurrentStore = (storeData) => {
    setCurrentStore(storeData);
  };

  const value = {
    customer,
    isAuthenticated,
    currentStore,
    loading,
    setLoading,
    loginCustomer,
    logoutCustomer,
    updateCurrentStore,
  };

  return (
    <ShopperContext.Provider value={value}>
      {children}
    </ShopperContext.Provider>
  );
};
