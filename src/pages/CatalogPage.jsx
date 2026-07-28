import React, { useState, useEffect } from 'react';
import { useProducts } from '../data/ProductsContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

const CatalogPage = () => {
  const { products, dynamicCategories, loading } = useProducts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-rosa/5 to-primary/5 py-16 md:py-24 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-pattern-medical opacity-100 mask-bottom-fade animate-bg-pan z-0"></div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 z-0"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-rosa/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block bg-primary/15 text-primary font-semibold text-sm px-5 py-2 rounded-full mb-6">
            Catálogo Completo
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Todos nuestros <span className="text-primary">Productos</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Encuentra todo lo que necesitas organizado por categorías. ¡Elige lo que más te guste!
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
            {dynamicCategories && dynamicCategories.map(cat => (
              <span key={cat.slug} className="bg-white px-4 py-2 rounded-full shadow-sm">{cat.count} {cat.name}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-20">

        {/* Dynamic Categories */}
        {dynamicCategories && dynamicCategories.map(cat => {
          const catProducts = products.filter(p => p.categoria && p.categoria.trim() === cat.name);
          if (catProducts.length === 0) return null;
          
          return (
            <section key={cat.slug} id={cat.slug}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">{cat.name}</h2>
                  <p className="text-slate-500 text-sm mt-1">{catProducts.length} productos</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {catProducts.map(product => (
                  <ProductCard 
                    key={product._uid} 
                    product={product} 
                    onClick={(p) => window.dispatchEvent(new CustomEvent('openProductModal', { detail: p }))} 
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* Otros (catch-all) */}
        {(() => {
          const otros = products.filter(p => !dynamicCategories.find(c => c.name === p.categoria?.trim()));
          if (otros.length === 0) return null;
          return (
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
                    onClick={(p) => window.dispatchEvent(new CustomEvent('openProductModal', { detail: p }))} 
                  />
                ))}
              </div>
            </section>
          );
        })()}

      </div>
    </div>
  );
};

export default CatalogPage;
