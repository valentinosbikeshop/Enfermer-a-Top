import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, ChevronDown, Search } from 'lucide-react';
import { useProducts } from '../data/ProductsContext';

const Header = () => {
  const { cart, setIsCartOpen, products } = useProducts();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const catRef = useRef(null);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Close everything on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsCatOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');
  }, [location]);

  // Close category dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setIsCatOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return products
      .filter(p => (
        (p.nombre && p.nombre.toLowerCase().includes(q)) ||
        (p.descripcion_corta && p.descripcion_corta.toLowerCase().includes(q)) ||
        (p.categoria && p.categoria.toLowerCase().includes(q))
      ))
      .slice(0, 6);
  }, [searchQuery, products]);

  const categories = [
    { name: 'Esenciales de Enfermería', slug: 'esenciales' },
    { name: 'Colección Personalizable', slug: 'personalizables' },
  ];

  const handleProductClick = (product) => {
    // Dispatch a custom event so pages can catch it and open the modal
    window.dispatchEvent(new CustomEvent('openProductModal', { detail: product }));
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const formatPrice = (p) => {
    if (!p) return '';
    const num = parseInt(p.toString().replace(/\D/g, ''), 10);
    return isNaN(num) ? p : `$${num.toLocaleString('es-CL')}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-turquesa/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-turquesa hover:opacity-80 transition-opacity flex-shrink-0">
          <span className="font-bold text-2xl tracking-tight">Enfermería Top</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-slate-600 font-medium">
          <Link 
            to="/" 
            className={`hover:text-turquesa transition-colors ${location.pathname === '/' ? 'text-turquesa' : ''}`}
          >
            Inicio
          </Link>
          
          {/* Categories Dropdown */}
          <div className="relative" ref={catRef}>
            <button 
              onClick={() => setIsCatOpen(!isCatOpen)}
              className={`flex items-center gap-1 hover:text-turquesa transition-colors ${
                location.pathname.startsWith('/categoria') ? 'text-turquesa' : ''
              }`}
            >
              Categorías
              <ChevronDown size={16} className={`transition-transform duration-200 ${isCatOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isCatOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in-up">
                <div className="p-2">
                  {categories.map(cat => (
                    <Link
                      key={cat.slug}
                      to={`/categoria/${cat.slug}`}
                      className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-turquesa/10 hover:text-turquesa transition-colors font-medium"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link 
            to="/sobre-nosotros" 
            className={`hover:text-turquesa transition-colors ${location.pathname === '/sobre-nosotros' ? 'text-turquesa' : ''}`}
          >
            Sobre Nosotros
          </Link>
        </nav>

        {/* Search + Cart + Mobile Toggle */}
        <div className="flex items-center gap-2">

          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-slate-600 hover:text-turquesa transition-colors md:hidden"
            >
              <Search size={22} />
            </button>

            {/* Desktop search input always visible */}
            <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 gap-2 w-56 focus-within:ring-2 focus-within:ring-turquesa/30 focus-within:bg-white transition-all">
              <Search size={18} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
                onFocus={() => setIsSearchOpen(true)}
                className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 w-full"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }} className="text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchOpen && searchQuery.length >= 2 && (
              <div className="absolute top-full right-0 md:left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto p-2">
                    {searchResults.map(product => (
                      <button
                        key={product._uid}
                        onClick={() => handleProductClick(product)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 p-1">
                          <img src={product.imagen_url} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{product.nombre}</p>
                          <p className="text-xs text-turquesa font-semibold">
                            {formatPrice(product.precio_oferta && product.precio_oferta.trim() !== '' ? product.precio_oferta : product.precio)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 text-sm">
                    No se encontraron productos para "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-600 hover:text-turquesa transition-colors"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-rosa text-slate-800 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
                {cartCount}
              </span>
            )}
          </button>
          
          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Search Bar (when toggled) */}
      {isSearchOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3" ref={searchRef}>
          <div className="flex items-center bg-slate-100 rounded-full px-4 py-2.5 gap-2 focus-within:ring-2 focus-within:ring-turquesa/30">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 w-full"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }} className="text-slate-400">
                <X size={14} />
              </button>
            )}
          </div>
          
          {/* Mobile Search Results */}
          {searchQuery.length >= 2 && (
            <div className="mt-2 max-h-64 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map(product => (
                  <button
                    key={product._uid}
                    onClick={() => handleProductClick(product)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 p-1">
                      <img src={product.imagen_url} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{product.nombre}</p>
                      <p className="text-xs text-turquesa font-semibold">
                        {formatPrice(product.precio_oferta && product.precio_oferta.trim() !== '' ? product.precio_oferta : product.precio)}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-center text-slate-400 text-sm py-4">Sin resultados para "{searchQuery}"</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            <Link 
              to="/" 
              className="px-4 py-3 rounded-xl text-slate-700 hover:bg-turquesa/10 hover:text-turquesa transition-colors font-medium"
            >
              Inicio
            </Link>
            
            <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Categorías</div>
            {categories.map(cat => (
              <Link
                key={cat.slug}
                to={`/categoria/${cat.slug}`}
                className="px-4 py-3 rounded-xl text-slate-700 hover:bg-turquesa/10 hover:text-turquesa transition-colors font-medium pl-8"
              >
                {cat.name}
              </Link>
            ))}
            
            <Link 
              to="/sobre-nosotros" 
              className="px-4 py-3 rounded-xl text-slate-700 hover:bg-turquesa/10 hover:text-turquesa transition-colors font-medium"
            >
              Sobre Nosotros
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
