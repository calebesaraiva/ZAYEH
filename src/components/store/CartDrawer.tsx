import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Truck } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface Props { open: boolean; onClose: () => void; }

export default function CartDrawer({ open, onClose }: Props) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useStore();
  const total = cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const count = cart.reduce((acc, i) => acc + i.quantity, 0);
  const freeShippingThreshold = 599.99;
  const freeShipping = total >= freeShippingThreshold;
  const progress = Math.min((total / freeShippingThreshold) * 100, 100);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 z-40" onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm glass-dark z-50 flex flex-col"
            style={{ borderLeft: '1px solid rgba(249,115,22,0.1)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={19} className="text-orange-400" />
                <h2 className="font-bold text-lg">Sacola ({count})</h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={21} />
              </button>
            </div>

            {/* Shipping progress */}
            {!freeShipping ? (
              <div className="px-6 py-3 border-b border-white/[0.04]">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Truck size={11} className="text-orange-400" />
                    Faltam <span className="text-orange-400 font-semibold mx-0.5">R$ {(freeShippingThreshold - total).toFixed(2).replace('.', ',')}</span> p/ frete grátis
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                    className="h-full rounded-full gradient-bg"
                  />
                </div>
              </div>
            ) : (
              <div className="px-6 py-3 border-b border-green-500/10" style={{ background: 'rgba(22,163,74,0.06)' }}>
                <p className="text-xs text-green-400 font-semibold flex items-center gap-1.5">
                  <Truck size={12} /> 🎉 Frete grátis garantido!
                </p>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-600">
                  <ShoppingBag size={44} className="mb-4 opacity-20" />
                  <p className="font-medium">Sua sacola está vazia</p>
                  <button onClick={onClose} className="mt-3 text-orange-400 text-sm underline">Continuar comprando</button>
                </div>
              ) : (
                cart.map(item => (
                  <motion.div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }}
                    className="glass rounded-2xl p-3 flex gap-3"
                    style={{ border: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <img src={item.product.image} alt={item.product.name} className="w-18 h-22 w-[72px] h-[88px] object-cover rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold line-clamp-1 mb-1">{item.product.name}</h4>
                      <div className="flex gap-1.5 mb-1.5">
                        <span className="text-[11px] text-gray-500 bg-white/5 px-2 py-0.5 rounded">{item.size}</span>
                        {item.color && <span className="text-[11px] text-gray-500 bg-white/5 px-2 py-0.5 rounded truncate max-w-[80px]">{item.color}</span>}
                      </div>
                      <span className="text-sm font-bold gradient-text">R$ {item.product.price.toFixed(2).replace('.', ',')}</span>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 glass rounded-full px-1 py-0.5">
                          <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                            <Minus size={11} />
                          </button>
                          <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                            <Plus size={11} />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                          className="text-gray-700 hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-white/[0.06] space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input placeholder="Cupom de desconto" className="input-field pl-8 py-2 text-sm" />
                  </div>
                  <button className="glass px-4 py-2 rounded-xl text-sm font-semibold text-orange-400 hover:text-white transition-colors">
                    Aplicar
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span><span>R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Frete</span>
                    <span className={freeShipping ? 'text-green-400 font-medium' : ''}>
                      {freeShipping ? 'Grátis 🎉' : 'Calc. no checkout'}
                    </span>
                  </div>
                  <div className="flex justify-between font-black text-lg pt-2 border-t border-white/[0.06]">
                    <span>Total</span>
                    <span className="gradient-text">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base font-bold">
                  Finalizar Compra <ArrowRight size={17} />
                </motion.button>

                <button onClick={clearCart} className="w-full text-xs text-gray-700 hover:text-red-400 transition-colors">
                  Limpar sacola
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
