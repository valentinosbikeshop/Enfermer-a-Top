import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ProductsProvider, useProducts } from './data/ProductsContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import AboutPage from './pages/AboutPage';
import CategoryPage from './pages/CategoryPage';
import CatalogPage from './pages/CatalogPage';
import { Truck, CreditCard, Package, MessageCircle, Instagram, ArrowRight } from 'lucide-react';

const HomePage = () => {
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

  // "Más Vendidos" — products with etiqueta containing certain keywords, fallback to first 10
  const masVendidos = products.filter(p => 
    p.etiqueta && (
      p.etiqueta.toLowerCase().includes('popular') || 
      p.etiqueta.toLowerCase().includes('vendido') ||
      p.etiqueta.toLowerCase().includes('top')
    )
  );
  const displayBestsellers = masVendidos.length > 0 
    ? masVendidos 
    : products.slice(0, 10);

  return (
    <>
      <Hero />

      <main className="flex-1 container mx-auto px-4 py-16 space-y-24">
        
        {/* Más Vendidos */}
        <section id="mas-vendidos" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-slate-800">🔥 Más Vendidos</h2>
              <div className="hidden md:block flex-1 h-px bg-slate-200 w-24"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayBestsellers.map(product => (
              <ProductCard 
                key={product._uid} 
                product={product} 
                onClick={setSelectedProduct} 
              />
            ))}
          </div>
        </section>

        {/* Category Previews */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Nuestras Categorías</h2>
            <p className="text-slate-500">Explora todo lo que tenemos para ti</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link 
              to="/categoria/esenciales"
              className="group relative bg-gradient-to-br from-turquesa/10 to-turquesa/5 rounded-3xl p-8 md:p-10 border border-turquesa/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-turquesa/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 relative z-10">Esenciales de Enfermería</h3>
              <p className="text-slate-600 mb-4 relative z-10">Todo lo que necesitas para tu turno: organizado, práctico y bonito.</p>
              <span className="inline-flex items-center gap-1 text-turquesa font-semibold group-hover:gap-2 transition-all relative z-10">
                Ver productos <ArrowRight size={18} />
              </span>
            </Link>

            <Link 
              to="/categoria/personalizables"
              className="group relative bg-gradient-to-br from-rosa/15 to-rosa/5 rounded-3xl p-8 md:p-10 border border-rosa/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-rosa/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 relative z-10">Colección Personalizable</h3>
              <p className="text-slate-600 mb-4 relative z-10">Productos únicos con tu nombre, frase o especialidad. ¡Hazlos tuyos!</p>
              <span className="inline-flex items-center gap-1 text-rosa font-semibold group-hover:gap-2 transition-all relative z-10">
                Ver productos <ArrowRight size={18} />
              </span>
            </Link>
          </div>
        </section>

        {/* Entregas y Pagos */}
        <section id="entregas-pagos" className="bg-turquesa/5 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Entregas y Pagos</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Comprar en Enfermería Top es fácil y seguro. Revisa nuestras opciones de pago y métodos de envío.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-rosa/30 text-rosa rounded-full flex items-center justify-center mb-6">
                <CreditCard size={32} className="text-slate-800" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Medios de Pago</h3>
              <p className="text-slate-600">
                Aceptamos pagos a través de Efectivo y Transferencia Bancaria. Todo de forma segura.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-turquesa/20 text-turquesa rounded-full flex items-center justify-center mb-6">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Envíos a todo Chile</h3>
              <p className="text-slate-600">
                Realizamos envíos seguros a través de Blue Express para que tu pedido llegue a la puerta de tu casa.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-6">
                <Package size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Packaging Premium</h3>
              <p className="text-slate-600">
                Cada pedido va en un packaging de alta calidad, diseñado especialmente para proteger tus productos y sorprenderte.
              </p>
            </div>
          </div>
        </section>

      </main>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
};

const Layout = ({ children }) => {
  const [globalProduct, setGlobalProduct] = useState(null);

  useEffect(() => {
    const handler = (e) => setGlobalProduct(e.detail);
    window.addEventListener('openProductModal', handler);
    return () => window.removeEventListener('openProductModal', handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      
      <div className="flex-1">
        {children}
      </div>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center">
        <p>© {new Date().getFullYear()} Enfermería Top. Todos los derechos reservados.</p>
      </footer>

      <CartDrawer />
      <ProductModal product={globalProduct} onClose={() => setGlobalProduct(null)} />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-40">
        <a 
          href="https://wa.me/56996793455" 
          target="_blank" 
          rel="noreferrer"
          className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <MessageCircle size={28} />
        </a>
      </div>
      
      <div className="fixed bottom-6 left-6 flex flex-col gap-4 z-40">
        <a 
          href="https://www.instagram.com/enfermeria_top" 
          target="_blank" 
          rel="noreferrer"
          className="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <Instagram size={28} />
        </a>
      </div>
    </div>
  );
};

import ScrollToTop from './components/ScrollToTop';

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ProductsProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/sobre-nosotros" element={<AboutPage />} />
            <Route path="/categoria/:slug" element={<CategoryPage />} />
          </Routes>
        </Layout>
      </ProductsProvider>
    </BrowserRouter>
  );
};

export default App;
