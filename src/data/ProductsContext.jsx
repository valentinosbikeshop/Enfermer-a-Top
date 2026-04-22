import React, { createContext, useContext, useState, useEffect } from 'react';
import Papa from 'papaparse';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQezEtJRT3AeoIJ5tAO3iS-3sOjBqDy4qUzrQPR2lgjIq81WGfBY_jIey67gAlx7-xuANiu0mKw-MRx/pub?gid=0&single=true&output=csv';

/**
 * Converts any Google Drive URL format into a direct image URL.
 * Supports:
 *   - https://drive.google.com/file/d/FILE_ID/...
 *   - https://drive.google.com/open?id=FILE_ID
 *   - https://drive.google.com/uc?id=FILE_ID&export=...
 *   - https://drive.google.com/uc?export=view&id=FILE_ID
 * Returns the original URL unchanged if it's not a Google Drive link.
 */
const convertGoogleDriveUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  const trimmed = url.trim();

  // Pattern 1: /file/d/FILE_ID/
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  }

  // Pattern 2: /open?id=FILE_ID  or  /uc?id=FILE_ID  or  /uc?export=view&id=FILE_ID
  const idParamMatch = trimmed.match(/drive\.google\.com\/(?:open|uc)\?.*?id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch) {
    return `https://lh3.googleusercontent.com/d/${idParamMatch[1]}`;
  }

  return trimmed;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data
          .filter(item => item.id) // Filter out empty rows
          .map(item => ({
            ...item,
            imagen_url: convertGoogleDriveUrl(item.imagen_url),
          }));
        setProducts(data);
        
        // Find hero data (ID 14)
        const hero = data.find(item => item.id === '14');
        if (hero) setHeroData(hero);
        
        setLoading(false);
      },
      error: (err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    });
  };

  const addToCart = (product, quantity, customization = null) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && item.customization === customization
      );
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.customization === customization
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, customization }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, customization = null) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.customization === customization)));
  };

  const updateQuantity = (productId, customization, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId && item.customization === customization) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  return (
    <ProductsContext.Provider value={{
      products,
      loading,
      heroData,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </ProductsContext.Provider>
  );
};
