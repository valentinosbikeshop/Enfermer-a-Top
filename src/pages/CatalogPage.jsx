import React, { useState, useEffect } from 'react';
import { useProducts } from '../data/ProductsContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

const CatalogPage = () => {
  const { products, loading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Listen for search product modal events
  useEffect(() => {
    const handler = (e) => setSelectedProduct(e.detail);
    window.addEventListener('openProductModal', handler);
    return () => window.removeEventListener('openProductModal', handler);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquesa"></div>
      </div>
    );
  }

  // Split products by category
  const esenciales = products.filter(p => {
    const cat = (p.categoria || '').toLowerCase().trim();
    return cat.includes('esencial');
  });

  const personalizables = products.filter(p => {
    const cat = (p.categoria || '').toLowerCase().trim();
    return cat.includes('personaliza') || cat.includes('colección perso') || cat.includes('coleccion perso');
  });

  // Products that don't match either category (catch-all)
  const otros = products.filter(p => {
    const cat = (p.categoria || '').toLowerCase().trim();
    const isEsencial = cat.includes('esencial');
    const isPerso = cat.includes('personaliza') || cat.includes('colección perso') || cat.includes('coleccion perso');
    return !isEsencial && !isPerso;
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-turquesa/10 via-rosa/5 to-turquesa/5 py-16 md:py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-turquesa/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-rosa/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block bg-turquesa/15 text-turquesa font-semibold text-sm px-5 py-2 rounded-full mb-6">
            Catálogo Completo
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Todos nuestros <span className="text-turquesa">Productos</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Encuentra todo lo que necesitas organizado por categorías. ¡Elige lo que más te guste!
          </p>
          <div className="mt-6 flex justify-center gap-4 text-sm text-slate-500">
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">{esenciales.length} Esenciales</span>
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">{personalizables.length} Personalizables</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-20">

        {/* Esenciales */}
        {esenciales.length > 0 && (
          <section id="esenciales">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1.5 h-10 bg-turquesa rounded-full"></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Esenciales de Enfermería</h2>
                <p className="text-slate-500 text-sm mt-1">{esenciales.length} productos</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {esenciales.map(product => (
                <ProductCard 
                  key={product._uid} 
                  product={product} 
                  onClick={setSelectedProduct} 
                />
              ))}
            </div>
          </section>
        )}

        {/* Divider */}
        {esenciales.length > 0 && personalizables.length > 0 && (
          <div className="flex items-center gap-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            <span className="text-slate-300 text-sm font-medium">✦</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          </div>
        )}

        {/* Personalizables */}
        {personalizables.length > 0 && (
          <section id="personalizables">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1.5 h-10 bg-rosa rounded-full"></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Colección Personalizable</h2>
                <p className="text-slate-500 text-sm mt-1">{personalizables.length} productos</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {personalizables.map(product => (
                <ProductCard 
                  key={product._uid} 
                  product={product} 
                  onClick={setSelectedProduct} 
                />
              ))}
            </div>
          </section>
        )}

        {/* Otros (catch-all) */}
        {otros.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1.5 h-10 bg-slate-300 rounded-full"></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Otros Productos</h2>
                <p className="text-slate-500 text-sm mt-1">{otros.length} productos</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {otros.map(product => (
                <ProductCard 
                  key={product._uid} 
                  product={product} 
                  onClick={setSelectedProduct} 
                />
              ))}
            </div>
          </section>
        )}

      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default CatalogPage;
