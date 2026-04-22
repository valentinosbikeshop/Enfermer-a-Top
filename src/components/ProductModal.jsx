import React, { useState, useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useProducts } from '../data/ProductsContext';

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useProducts();
  const [isCustomized, setIsCustomized] = useState(false);
  const [customText, setCustomText] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Reset state when product changes
  useEffect(() => {
    setIsCustomized(false);
    setCustomText('');
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const isPersonalizable = product.es_personalizable && product.es_personalizable.toLowerCase() === 'sí';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Image */}
          <div className="md:w-1/2 bg-slate-50 p-8 flex items-center justify-center relative">
             {product.etiqueta && (
              <div className="absolute top-6 left-6 px-4 py-1 text-sm font-bold rounded-full bg-rosa text-slate-800">
                {product.etiqueta}
              </div>
            )}
            <img 
              src={product.imagen_url} 
              alt={product.nombre}
              className={`max-w-full max-h-[400px] object-contain drop-shadow-lg ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
            />
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-8 md:p-10 flex flex-col">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{product.nombre}</h2>
            
            <div className="flex items-end gap-3 mb-6">
              {hasOffer ? (
                <>
                  <span className="text-3xl font-bold text-turquesa">{formatPrice(product.precio_oferta)}</span>
                  <span className="text-lg text-slate-400 line-through pb-1">{formatPrice(product.precio)}</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-slate-800">{formatPrice(product.precio)}</span>
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
                      checked={!isCustomized}
                      onChange={() => setIsCustomized(false)}
                      className="text-turquesa focus:ring-turquesa"
                    />
                    <span className="text-slate-700">Estándar</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="customization" 
                      checked={isCustomized}
                      onChange={() => setIsCustomized(true)}
                      className="text-turquesa focus:ring-turquesa"
                    />
                    <span className="text-slate-700">Personalizado</span>
                  </label>
                </div>
                
                {isCustomized && (
                  <div className="animate-fade-in">
                    <input 
                      type="text" 
                      placeholder="Ingresa nombre o detalle clínico..." 
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-turquesa focus:border-transparent transition-all"
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
                disabled={isOutOfStock || (isCustomized && !customText.trim())}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full font-bold transition-all shadow-md ${
                  isOutOfStock 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-turquesa text-white hover:bg-turquesa/90 hover:shadow-lg transform hover:-translate-y-1'
                }`}
              >
                <ShoppingBag size={20} />
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
