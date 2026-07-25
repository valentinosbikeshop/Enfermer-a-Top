import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../data/ProductsContext';

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

  const hasOffer = product.precio_oferta && product.precio_oferta.trim() !== '' && product.precio_oferta !== product.precio;
  const isOutOfStock = product.stock && product.stock.toString().toLowerCase() === 'agotado';

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
          <div className="md:w-1/2 bg-slate-50 p-8 flex items-center justify-center relative overflow-hidden group">
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
              className={`max-w-full max-h-[400px] object-contain drop-shadow-lg transition-transform duration-500 animate-fade-in ${imagesToRender.length > 1 ? '' : 'group-hover:scale-105'} ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
            />
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight leading-tight">{product.nombre}</h2>
            
            <div className="flex items-end gap-3 mb-8">
              {hasOffer ? (
                <>
                  <span className="text-3xl font-black text-primary">{formatPrice(product.precio_oferta)}</span>
                  <span className="text-xl text-slate-400 line-through pb-1 font-medium">{formatPrice(product.precio)}</span>
                </>
              ) : (
                <span className="text-3xl font-black text-slate-800">{formatPrice(product.precio)}</span>
              )}
            </div>

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
                <div className="flex items-center bg-slate-100 rounded-full overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-slate-600 hover:bg-slate-200 transition-colors font-medium"
                  >-</button>
                  <span className="w-8 text-center font-semibold text-slate-800">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-slate-600 hover:bg-slate-200 transition-colors font-medium"
                  >+</button>
                </div>
              )}

              <button 
                onClick={handleAddToCart}
                disabled={isOutOfStock || (isPersonalizable && isCustomized === null) || (isCustomized === true && !customText.trim())}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full font-extrabold transition-all duration-300 hover-spring ${
                  isOutOfStock 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-[#c94d45] hover:shadow-[0_8px_20px_-6px_rgba(220,90,81,0.5)] transform hover:-translate-y-1'
                }`}
              >
                <ShoppingBag size={20} strokeWidth={2.5} />
                {isOutOfStock ? 'Agotado' : 'Agregar al Carrito'}
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
