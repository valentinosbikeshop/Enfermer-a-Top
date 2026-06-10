import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../data/ProductsContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { ArrowLeft } from 'lucide-react';

const CATEGORY_CONFIG = {
  esenciales: {
    title: 'Esenciales de Enfermería',
    subtitle: 'Todo lo que necesitas para tu turno: organizado, práctico y bonito.',
    gradient: 'from-turquesa/10 to-turquesa/5',
    accent: 'turquesa',
  },
  personalizables: {
    title: 'Colección Personalizable',
    subtitle: 'Productos únicos con tu nombre, frase o especialidad. ¡Hazlos tuyos!',
    gradient: 'from-rosa/15 to-rosa/5',
    accent: 'rosa',
  },
};

const CategoryPage = () => {
  const { slug } = useParams();
  const { products, loading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const config = CATEGORY_CONFIG[slug];

  const filteredProducts = useMemo(() => {
    if (!products.length) return [];

    if (slug === 'esenciales') {
      const byCategory = products.filter(p => {
        const cat = (p.categoria || '').toLowerCase().trim();
        return cat.includes('esencial');
      });
      return byCategory.length > 0 ? byCategory : products.filter(p => p.es_personalizable !== 'Sí');
    }
    if (slug === 'personalizables') {
      const byCategory = products.filter(p => {
        const cat = (p.categoria || '').toLowerCase().trim();
        return cat.includes('personaliza') || cat.includes('colección perso') || cat.includes('coleccion perso');
      });
      return byCategory.length > 0 ? byCategory : products.filter(p => p.es_personalizable === 'Sí');
    }
    return [];
  }, [products, slug]);

  if (!config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Categoría no encontrada</h2>
        <Link to="/" className="text-turquesa font-medium hover:underline">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquesa"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Category Hero */}
      <section className={`relative bg-gradient-to-br ${config.gradient} py-16 md:py-24 overflow-hidden`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-turquesa/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-turquesa transition-colors mb-6 group"
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
                  onClick={setSelectedProduct} 
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

      {/* Product Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default CategoryPage;
