import React, { createContext, useContext, useState, useEffect } from 'react';
import Papa from 'papaparse';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQezEtJRT3AeoIJ5tAO3iS-3sOjBqDy4qUzrQPR2lgjIq81WGfBY_jIey67gAlx7-xuANiu0mKw-MRx/pub?gid=0&single=true&output=csv';

/**
 * Converts any Google Drive URL format into a direct image URL.
 */
const convertGoogleDriveUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  const trimmed = url.trim();
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  const idParamMatch = trimmed.match(/drive\.google\.com\/(?:open|uc)\?.*?id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch) return `https://lh3.googleusercontent.com/d/${idParamMatch[1]}`;
  return trimmed;
};

/**
 * Pure function to calculate unit price based on quantity tiers.
 */
export const getUnitPriceForQuantity = (product, qty) => {
  if (!product) return 0;
  let price = parseInt(product.precio?.toString().replace(/\D/g, '') || 0, 10);
  
  const mayoreo12 = parseInt(product['precio de 12-24 unidades']?.toString().replace(/\D/g, ''), 10);
  const mayoreo25 = parseInt(product['precio de 25-50 unidades']?.toString().replace(/\D/g, ''), 10);
  const mayoreo51 = parseInt(product['precio de 51-100 unidades']?.toString().replace(/\D/g, ''), 10);
  const mayoreo100 = parseInt(product['precio sobre 100 unidades']?.toString().replace(/\D/g, ''), 10);
  
  if (qty >= 100 && !isNaN(mayoreo100) && mayoreo100 > 0) price = mayoreo100;
  else if (qty >= 51 && !isNaN(mayoreo51) && mayoreo51 > 0) price = mayoreo51;
  else if (qty >= 25 && !isNaN(mayoreo25) && mayoreo25 > 0) price = mayoreo25;
  else if (qty >= 12 && !isNaN(mayoreo12) && mayoreo12 > 0) price = mayoreo12;
  
  return price;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    const urlWithCacheBust = `${SHEET_URL}&_t=${Date.now()}`;
    Papa.parse(urlWithCacheBust, {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data
          .filter(item => item.nombre && item.nombre.trim() !== '') // Filter out empty rows
          .map((item, index) => {
            const { id, ...rest } = item;
            const rawUrls = (item.imagen_url || '').split(/\s*;\s*/).filter(u => u.trim() !== '');
            const processedUrls = rawUrls.map(convertGoogleDriveUrl);
            const imagen_url = processedUrls.length > 0 ? processedUrls[0] : '';
            return {
              ...rest,
              _uid: `row_${index}`,
              categoria: (item.categoria || '').trim(),
              imagen_url: imagen_url,
              imagenes: processedUrls,
              Peso_kg: parseFloat(item.Peso_kg?.toString().replace(',', '.') || '0') || 0,
              Largo_cm: parseFloat(item.Largo_cm?.toString().replace(',', '.') || '0') || 0,
              Ancho_cm: parseFloat(item.Ancho_cm?.toString().replace(',', '.') || '0') || 0,
              Alto_cm: parseFloat(item.Alto_cm?.toString().replace(',', '.') || '0') || 0,
            };
          });
        
        const hero = data.find(item => {
          const cat = (item.categoria || '').toLowerCase();
          return cat.includes('banner') || cat.includes('sistema') || cat.includes('inicio');
        });
        if (hero) setHeroData(hero);
        
        const displayProducts = data.filter(item => {
          const cat = (item.categoria || '').toLowerCase();
          return !cat.includes('banner') && !cat.includes('sistema') && !cat.includes('inicio');
        });

        // Compute Dynamic Categories (>= 2 products)
        const catCount = {};
        displayProducts.forEach(p => {
          if (p.categoria) {
            const cName = p.categoria.trim();
            if (!catCount[cName]) {
              catCount[cName] = { 
                name: cName, 
                slug: cName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                count: 0 
              };
            }
            catCount[cName].count++;
          }
        });

        const validCats = Object.values(catCount)
          .filter(c => c.count >= 2)
          .sort((a, b) => b.count - a.count);

        setDynamicCategories(validCats);
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
      dynamicCategories,
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

