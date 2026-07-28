import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductCard = ({ product, onClick }) => {
  const { 
    nombre, 
    descripcion_corta, 
    precio, 
    imagen_url, 
    imagenes,
    etiqueta,
    stock 
  } = product;

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const isOutOfStock = stock && stock.toString().toLowerCase() === 'agotado';

  const basePrice = parseInt(precio?.toString().replace(/\D/g, '') || 0, 10);
  const mayoreo12 = parseInt(product['precio de 12-24 unidades']?.toString().replace(/\D/g, ''), 10);
  const mayoreo25 = parseInt(product['precio de 25-50 unidades']?.toString().replace(/\D/g, ''), 10);
  const mayoreo51 = parseInt(product['precio de 51-100 unidades']?.toString().replace(/\D/g, ''), 10);
  const mayoreo100 = parseInt(product['precio sobre 100 unidades']?.toString().replace(/\D/g, ''), 10);
  
  const prices = [basePrice, mayoreo12, mayoreo25, mayoreo51, mayoreo100].filter(p => !isNaN(p) && p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : basePrice;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : basePrice;
  
  const hasWholesale = minPrice < maxPrice;

  const formatPrice = (p) => {
    if (!p) return '';
    const num = parseInt(p.toString().replace(/\D/g, ''), 10);
    return isNaN(num) ? p : `$${num.toLocaleString('es-CL')}`;
  };

  const imagesToRender = imagenes && imagenes.length > 0 ? imagenes : [imagen_url];
  const hasMultipleImages = imagesToRender.length > 1;

  useEffect(() => {
    let interval;
    if (hasMultipleImages) {
      interval = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % imagesToRender.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [hasMultipleImages, imagesToRender.length]);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % imagesToRender.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + imagesToRender.length) % imagesToRender.length);
  };

  return (
    <div 
      onClick={() => onClick(product)}
      className="group relative bg-white rounded-[24px] shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full transform hover:-translate-y-1 border border-slate-100"
    >
      {/* Badges */}
      {etiqueta && (
        <div className={`absolute top-4 left-4 z-10 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-full text-white shadow-sm ${
          etiqueta.toLowerCase() === 'nuevo' ? 'bg-[#20bd5a]' : 'bg-primary text-white'
        }`}>
          {etiqueta}
        </div>
      )}
      
      {isOutOfStock && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-full bg-slate-800 text-white shadow-sm">
          Agotado
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50/50 flex items-center justify-center p-6">
        {hasMultipleImages && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-3 z-20 bg-white/80 backdrop-blur-md text-slate-800 p-2 rounded-full opacity-0 group-hover:opacity-100 hover-spring hover:bg-white hover:scale-110 shadow-sm"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-3 z-20 bg-white/80 backdrop-blur-md text-slate-800 p-2 rounded-full opacity-0 group-hover:opacity-100 hover-spring hover:bg-white hover:scale-110 shadow-sm"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
            <div className="absolute bottom-4 flex gap-1.5 z-20">
              {imagesToRender.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full transition-fluid duration-300 ${idx === currentImgIndex ? 'bg-primary w-4' : 'bg-slate-300'}`}
                />
              ))}
            </div>
          </>
        )}
        <img 
          key={currentImgIndex}
          src={imagesToRender[currentImgIndex]} 
          alt={nombre} 
          className={`object-contain max-h-full transition-transform duration-700 hover-spring animate-fade-in group-hover:scale-110 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2">{nombre}</h3>
        <p className="text-sm text-slate-500 mb-4 flex-grow line-clamp-2">{descripcion_corta}</p>
        
        <div className="flex items-center gap-2 mt-auto">
          {hasWholesale ? (
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-primary font-bold">Por mayor desde</span>
              <div className="flex items-end gap-1.5">
                <span className="text-xl font-bold text-slate-800">{formatPrice(minPrice)}</span>
              </div>
            </div>
          ) : (
            <span className="text-xl font-bold text-slate-800">{formatPrice(basePrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
