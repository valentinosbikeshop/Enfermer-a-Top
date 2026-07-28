import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../data/ProductsContext';
import ProductCard from '../components/ProductCard';
import { ArrowLeft } from 'lucide-react';

const CategoryPage = () => {
  const { slug } = useParams();
  const { products, dynamicCategories, loading } = useProducts();

  const dynamicCategory = useMemo(() => {
    return dynamicCategories?.find(c => c.slug === slug);
  }, [dynamicCategories, slug]);

  const config = useMemo(() => {
    if (dynamicCategory) {
      const GRADIENTS = [
        { gradient: 'from-primary/10 to-primary/5', accent: 'primary' },
        { gradient: 'from-rosa/15 to-rosa/5', accent: 'rosa' },
        { gradient: 'from-blue-500/10 to-blue-500/5', accent: 'blue-500' },
        { gradient: 'from-emerald-500/10 to-emerald-500/5', accent: 'emerald-500' }
      ];
      const style = GRADIENTS[dynamicCategory.name.length % GRADIENTS.length];
      
      return {
        title: dynamicCategory.name,
        subtitle: `Explora nuestra selección de ${dynamicCategory.name.toLowerCase()}.`,
        gradient: style.gradient,
        accent: style.accent,
      };
    }
    return null;
  }, [dynamicCategory]);

  const filteredProducts = useMemo(() => {
    if (!dynamicCategory || !products.length) return [];
    return products.filter(p => p.categoria && p.categoria.trim() === dynamicCategory.name);
  }, [products, dynamicCategory]);

  if (!config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Categoría no encontrada</h2>
        <Link to="/" className="text-primary font-medium hover:underline">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Category Hero */}
      <section className={`relative bg-gradient-to-br ${config.gradient} py-16 md:py-24 overflow-hidden`}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-pattern-medical opacity-100 mask-bottom-fade animate-bg-pan z-0"></div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>
          
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">{config.title}</h1>
          <p className="text-lg text-slate-600 max-w-xl">{config.subtitle}</p>
          <div className="mt-4 text-sm text-slate-400 font-medium">{filteredProducts.length} productos</div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product._uid} 
                  product={product} 
                  onClick={(p) => window.dispatchEvent(new CustomEvent('openProductModal', { detail: p }))} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <p className="text-xl">No hay productos en esta categoría aún.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default CategoryPage;
