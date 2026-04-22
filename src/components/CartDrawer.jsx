import React from 'react';
import { X, Trash2, MessageCircle, ShoppingCart } from 'lucide-react';
import { useProducts } from '../data/ProductsContext';

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart } = useProducts();

  if (!isCartOpen) return null;

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const priceStr = item.precio_oferta && item.precio_oferta.trim() !== '' ? item.precio_oferta : item.precio;
      if (!priceStr) return total;
      const price = parseInt(priceStr.toString().replace(/\D/g, ''), 10);
      return total + (isNaN(price) ? 0 : price * item.quantity);
    }, 0);
  };

  const total = calculateTotal();

  const handleWhatsAppOrder = () => {
    let message = "¡Hola! Quiero realizar el siguiente pedido:\n";
    
    cart.forEach(item => {
      const customText = item.customization ? `Personalizado: ${item.customization}` : 'Estándar';
      message += `- ${item.nombre} x${item.quantity} (${customText})\n`;
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
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Tu Carrito</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} />
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
            cart.map((item, idx) => (
              <div key={`${item.id}-${item.customization}-${idx}`} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 p-2">
                  <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-contain" />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 mb-1">{item.nombre}</h4>
                  
                  {item.customization && (
                    <span className="text-xs text-turquesa font-medium mb-2">
                      Pers: {item.customization}
                    </span>
                  )}
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center bg-slate-100 rounded-lg">
                      <button 
                        onClick={() => updateQuantity(item.id, item.customization, -1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded-l-lg transition-colors"
                      >-</button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.customization, 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded-r-lg transition-colors"
                      >+</button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id, item.customization)}
                      className="text-red-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
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
