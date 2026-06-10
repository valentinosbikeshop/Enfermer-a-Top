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
    // Add cache-busting parameter so Google Sheets never serves stale CSV
    const urlWithCacheBust = `${SHEET_URL}&_t=${Date.now()}`;
    Papa.parse(urlWithCacheBust, {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data
          .filter(item => item.nombre && item.nombre.trim() !== '') // Filter out empty rows by nombre
          .map((item, index) => {
            const rawUrls = (item.imagen_url || '').split(/\s*;\s*/).filter(u => u.trim() !== '');
            const processedUrls = rawUrls.map(convertGoogleDriveUrl);
            const imagen_url = processedUrls.length > 0 ? processedUrls[0] : '';
            return {
              ...rest,
              _uid: `row_${index}`,
              categoria: (item.categoria || '').trim(), // Normalize whitespace
              imagen_url: imagen_url,
              imagenes: processedUrls,
            };
          });
        
        // Separate hero/banner from regular products
        const hero = data.find(item => {
          const cat = (item.categoria || '').toLowerCase();
          return cat.includes('banner') || cat.includes('sistema') || cat.includes('inicio');
        });
        if (hero) setHeroData(hero);
        
        // Only set displayable products (exclude banner/system items)
        const displayProducts = data.filter(item => {
          const cat = (item.categoria || '').toLowerCase();
          return !cat.includes('banner') && !cat.includes('sistema') && !cat.includes('inicio');
        });
        setProducts(displayProducts);
        
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
        item._uid === product._uid && item.customization === customization
      );
      if (existing) {
        return prev.map(item => 
          item._uid === product._uid && item.customization === customization
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, customization }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, customization = null) => {
    setCart(prev => prev.filter(item => !(item._uid === productId && item.customization === customization)));
  };

  const updateQuantity = (productId, customization, delta) => {
    setCart(prev => prev.map(item => {
      if (item._uid === productId && item.customization === customization) {
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
