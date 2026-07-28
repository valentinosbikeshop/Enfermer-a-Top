import React from 'react';
import { X, Trash2, MessageCircle, ShoppingCart } from 'lucide-react';
import { useProducts, getUnitPriceForQuantity } from '../data/ProductsContext';

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart } = useProducts();

  if (!isCartOpen) return null;

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = getUnitPriceForQuantity(item, item.quantity);
      return total + (price * item.quantity);
    }, 0);
  };

  const total = calculateTotal();

  const handleWhatsAppOrder = () => {
    let message = "¡Hola! Quiero realizar el siguiente pedido:\n";
    
    cart.forEach(item => {
      const customText = item.customization ? `Personalizado: ${item.customization}` : 'Estándar';
      const unitPrice = getUnitPriceForQuantity(item, item.quantity);
      message += `- ${item.nombre} x${item.quantity} (${customText}) [$${unitPrice.toLocaleString('es-CL')} c/u]\n`;
    });
    
    message += `Total: $${total.toLocaleString('es-CL')}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/56996793455?text=${encodedMessage}`, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-[rgba(0,0,0,0.08)_0px_4px_24px] z-50 flex flex-col transform transition-fluid duration-500">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md">
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Tu Carrito</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors hover:scale-105 active:scale-95"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
              <ShoppingCart size={48} className="opacity-20" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            cart.map((item, idx) => {
              const unitPrice = getUnitPriceForQuantity(item, item.quantity);
              const itemTotal = unitPrice * item.quantity;
              
              return (
                <div key={`${item._uid}-${item.customization}-${idx}`} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden flex-shrink-0 p-2 relative">
                    <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm line-clamp-2 mb-1">{item.nombre}</h4>
                      {item.customization && (
                        <span className="inline-block px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider rounded-md mb-2">
                          Pers: {item.customization}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-end justify-between mt-2">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800">${itemTotal.toLocaleString('es-CL')}</span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-slate-400 font-medium">${unitPrice.toLocaleString('es-CL')} c/u</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-lg overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item._uid, item.customization, -1)}
                            className="px-2.5 py-1 text-slate-500 hover:bg-slate-200 transition-colors font-medium"
                          >-</button>
                          <span className="w-6 text-center text-xs font-bold text-slate-700">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._uid, item.customization, 1)}
                            className="px-2.5 py-1 text-slate-500 hover:bg-slate-200 transition-colors font-medium"
                          >+</button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item._uid, item.customization)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-white">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-slate-800">${total.toLocaleString('es-CL')}</span>
            </div>
            
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-500/20 mb-3"
            >
              <MessageCircle size={20} />
              Pedir por WhatsApp
            </button>
            
            <button 
              onClick={clearCart}
              className="w-full py-3 text-slate-500 hover:text-slate-700 font-medium transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default CartDrawer;
