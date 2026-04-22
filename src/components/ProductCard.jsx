import React from 'react';

const ProductCard = ({ product, onClick }) => {
  const { 
    nombre, 
    descripcion_corta, 
    precio, 
    precio_oferta, 
    imagen_url, 
    etiqueta,
    stock 
  } = product;

  const hasOffer = precio_oferta && precio_oferta.trim() !== '' && precio_oferta !== precio;
  const isOutOfStock = stock && stock.toString().toLowerCase() === 'agotado';

  const formatPrice = (p) => {
    if (!p) return '';
    const num = parseInt(p.toString().replace(/\D/g, ''), 10);
    return isNaN(num) ? p : `$${num.toLocaleString('es-CL')}`;
  };

  return (
    <div 
      onClick={() => onClick(product)}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Badges */}
      {etiqueta && (
        <div className={`absolute top-4 left-4 z-10 px-3 py-1 text-xs font-bold rounded-full text-white ${
          etiqueta.toLowerCase() === 'nuevo' ? 'bg-green-500' : 'bg-rosa text-slate-800'
        }`}>
          {etiqueta}
        </div>
      )}
      
      {isOutOfStock && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1 text-xs font-bold rounded-full bg-red-500 text-white">
          Agotado
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 flex items-center justify-center p-4">
        <img 
          src={imagen_url} 
          alt={nombre} 
          className={`object-contain max-h-full transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2">{nombre}</h3>
        <p className="text-sm text-slate-500 mb-4 flex-grow line-clamp-2">{descripcion_corta}</p>
        
        <div className="flex items-center gap-2 mt-auto">
          {hasOffer ? (
            <>
              <span className="text-xl font-bold text-turquesa">{formatPrice(precio_oferta)}</span>
              <span className="text-sm text-slate-400 line-through">{formatPrice(precio)}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-slate-800">{formatPrice(precio)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
