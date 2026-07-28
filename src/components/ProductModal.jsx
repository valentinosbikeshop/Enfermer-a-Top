import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts, getUnitPriceForQuantity } from '../data/ProductsContext';

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useProducts();
  const isPersonalizable = product?.es_personalizable && product.es_personalizable.toLowerCase() === 'sí';
  
  const [isCustomized, setIsCustomized] = useState(isPersonalizable ? null : false);
  const [customText, setCustomText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Reset state when product changes
  useEffect(() => {
    setIsCustomized(isPersonalizable ? null : false);
    setCustomText('');
    setQuantity(1);
    setCurrentImgIndex(0);
  }, [product, isPersonalizable]);

  // Determine which images to show
  let imagesToRender = product?.imagenes && product.imagenes.length > 0 ? product.imagenes : [product?.imagen_url];
  if (isPersonalizable) {
    if (isCustomized === false) {
      imagesToRender = [imagesToRender[0]];
    } else if (isCustomized === true || isCustomized === null) {
      imagesToRender = imagesToRender.length > 1 ? imagesToRender.slice(1) : imagesToRender;
    }
  }

  // Automatic carousel loop
  useEffect(() => {
    let interval;
    if (imagesToRender.length > 1) {
      interval = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % imagesToRender.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [imagesToRender.length, isCustomized]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const isOutOfStock = product.stock && product.stock.toString().toLowerCase() === 'agotado';

  const basePrice = parseInt(product.precio?.toString().replace(/\D/g, '') || 0, 10);
  const mayoreo12 = parseInt(product['precio de 12-24 unidades']?.toString().replace(/\D/g, ''), 10);
  const mayoreo25 = parseInt(product['precio de 25-50 unidades']?.toString().replace(/\D/g, ''), 10);
  const mayoreo51 = parseInt(product['precio de 51-100 unidades']?.toString().replace(/\D/g, ''), 10);
  const mayoreo100 = parseInt(product['precio sobre 100 unidades']?.toString().replace(/\D/g, ''), 10);
  
  const tiers = [];
  if (!isNaN(mayoreo12) && mayoreo12 > 0) tiers.push({ label: '12-24 un', price: mayoreo12, min: 12, max: 24 });
  if (!isNaN(mayoreo25) && mayoreo25 > 0) tiers.push({ label: '25-50 un', price: mayoreo25, min: 25, max: 50 });
  if (!isNaN(mayoreo51) && mayoreo51 > 0) tiers.push({ label: '51-100 un', price: mayoreo51, min: 51, max: 100 });
  if (!isNaN(mayoreo100) && mayoreo100 > 0) tiers.push({ label: '+100 un', price: mayoreo100, min: 100, max: Infinity });
  
  const currentUnitPrice = getUnitPriceForQuantity(product, quantity);
  const totalPrice = currentUnitPrice * quantity;

  const formatPrice = (p) => {
    if (!p) return '';
    const num = parseInt(p.toString().replace(/\D/g, ''), 10);
    return isNaN(num) ? p : `$${num.toLocaleString('es-CL')}`;
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const customData = isCustomized ? customText : null;
    addToCart(product, quantity, customData);
    onClose();
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % imagesToRender.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + imagesToRender.length) % imagesToRender.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md transition-opacity">
      <div 
        className="bg-white rounded-[32px] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative animate-fade-in-up flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-white/50 backdrop-blur-sm rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors z-30 hover-spring hover:scale-110 shadow-sm"
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Image */}
          <div className="w-full md:w-1/2 bg-slate-50 p-6 md:p-8 flex items-center justify-center relative overflow-hidden group min-h-[300px]">
             {product.etiqueta && (
              <div className="absolute top-6 left-6 z-10 px-4 py-1 text-sm font-bold rounded-full bg-rosa text-slate-800">
                {product.etiqueta}
              </div>
            )}
            
            {imagesToRender.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 z-20 bg-white/80 backdrop-blur text-slate-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 z-20 bg-white/80 backdrop-blur text-slate-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-6 flex gap-2 z-20">
                  {imagesToRender.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-2 rounded-full transition-all ${idx === (currentImgIndex % imagesToRender.length) ? 'bg-primary w-6' : 'bg-slate-300 w-2'}`}
                    />
                  ))}
                </div>
              </>
            )}

            <img 
              key={currentImgIndex}
              src={imagesToRender[currentImgIndex % imagesToRender.length]} 
              alt={product.nombre}
              className={`w-full h-full max-h-[500px] object-contain drop-shadow-lg transition-transform duration-500 animate-fade-in ${imagesToRender.length > 1 ? '' : 'group-hover:scale-105'} ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
            />
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight leading-tight">{product.nombre}</h2>
            
            <div className="flex flex-col gap-1 mb-8">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-slate-800">{formatPrice(totalPrice)}</span>
                {quantity > 1 && (
                  <span className="text-lg text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-lg">
                    {formatPrice(currentUnitPrice)} c/u
                  </span>
                )}
              </div>
            </div>

            {tiers.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Precios por Mayor</h4>
                <div className="flex flex-wrap gap-2 w-full">
                  <div className={`flex-1 min-w-[70px] py-3 px-2 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${quantity < 12 ? 'bg-primary/5 border-primary text-primary shadow-sm scale-105 z-10 relative' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                    <span className="text-[10px] md:text-[11px] font-bold uppercase text-center">1-11 un</span>
                    <span className="font-black text-xs md:text-sm mt-1">{formatPrice(basePrice)}</span>
                  </div>
                  {tiers.map((t, i) => {
                    const isActive = quantity >= t.min && quantity <= t.max;
                    return (
                      <div key={i} className={`flex-1 min-w-[70px] py-3 px-2 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'bg-primary/5 border-primary text-primary shadow-sm scale-105 z-10 relative' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                        <span className="text-[10px] md:text-[11px] font-bold uppercase text-center">{t.label}</span>
                        <span className="font-black text-xs md:text-sm mt-1">{formatPrice(t.price)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="text-slate-600 mb-8 whitespace-pre-line leading-relaxed">
              {product.descripcion_larga || product.descripcion_corta}
            </p>

            {isPersonalizable && !isOutOfStock && (
              <div className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-semibold text-slate-800 mb-4">Opciones de Personalización</h4>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="customization" 
                      checked={isCustomized === false}
                      onChange={() => setIsCustomized(false)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-slate-700">Estándar</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="customization" 
                      checked={isCustomized === true}
                      onChange={() => setIsCustomized(true)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-slate-700">Personalizado</span>
                  </label>
                </div>
                
                {isCustomized === true && (
                  <div className="animate-fade-in">
                    <input 
                      type="text" 
                      placeholder="Ingresa nombre o detalle clínico..." 
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="mt-auto flex gap-4">
              {!isOutOfStock && (
                <div className="flex items-center bg-slate-100 rounded-full h-[52px] shrink-0">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors font-medium rounded-l-full"
                  >-</button>
                  <span className="w-8 text-center font-semibold text-slate-800">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors font-medium rounded-r-full"
                  >+</button>
                </div>
              )}

              <button 
                onClick={handleAddToCart}
                disabled={isOutOfStock || (isPersonalizable && isCustomized === null) || (isCustomized === true && !customText.trim())}
                className={`flex-1 flex items-center justify-center gap-2 h-[52px] px-6 rounded-full font-extrabold transition-all duration-300 hover-spring ${
                  isOutOfStock 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-[#c94d45] hover:shadow-[0_8px_20px_-6px_rgba(220,90,81,0.5)] transform hover:-translate-y-1'
                }`}
              >
                <ShoppingBag size={20} strokeWidth={2.5} />
                {isOutOfStock ? 'Agotado' : 'Agregar'}
              </button>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Overlay click to close */}
      <div className="absolute inset-0 z-[-1]" onClick={onClose}></div>
    </div>
  );
};

export default ProductModal;
