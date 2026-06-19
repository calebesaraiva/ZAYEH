import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Star, Check, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Product } from '../../store/useStore';
import { useStorePricingSettings } from '../../lib/storePricing';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [added, setAdded] = useState(false);
  const settings = useStorePricingSettings();

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const isPerfumaria = product.categorySlug === 'perfumaria';
  const requiresColor = !isPerfumaria && product.colors.length > 0;

  const handleAdd = () => {
    if (!selectedSize || (requiresColor && !selectedColor)) return;
    addToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 40 }}
          className="glass-dark rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image section */}
            <div className="relative">
              <div className="aspect-[3/4] md:h-full relative overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    src={product.images[currentImage] || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Image nav */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage((p) => (p - 1 + product.images.length) % product.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 glass w-9 h-9 rounded-full flex items-center justify-center"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setCurrentImage((p) => (p + 1) % product.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 glass w-9 h-9 rounded-full flex items-center justify-center"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {product.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImage(i)}
                          className={`h-1.5 rounded-full transition-all ${i === currentImage ? 'w-6 gradient-bg' : 'w-1.5 bg-white/30'}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">NOVO</span>}
                  {product.discount && <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">-{product.discount}%</span>}
                </div>
              </div>
            </div>

            {/* Content section */}
            <div className="p-6 md:p-8 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">{product.category}</span>
                  <h2 className="font-display text-2xl font-bold text-white mt-1">{product.name}</h2>
                </div>
                <button onClick={onClose} className="glass p-2 rounded-full text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={14} className={s <= Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} />
                  ))}
                </div>
                <span className="text-sm text-gray-400">{product.rating} ({product.reviews} avaliações)</span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3 mb-5">
                <span className="text-3xl font-bold text-white">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-500 line-through text-lg">
                    R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
                {product.discount && (
                  <span className="text-green-400 text-sm font-medium">
                    Economize R$ {(product.originalPrice! - product.price).toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>

              <p className="text-gray-400 text-sm mb-5 leading-relaxed">{product.description}</p>

              {requiresColor && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Cor</span>
                    {selectedColor && <span className="text-xs text-purple-400">{selectedColor}</span>}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                          selectedColor === color.name
                            ? 'border-purple-500 text-purple-300'
                            : 'border-gray-700 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        <div
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ background: color.hex }}
                        />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">{isPerfumaria ? 'Volume' : 'Tamanho'}</span>
                  {!isPerfumaria && <button className="text-xs text-purple-400 underline">Guia de tamanhos</button>}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-10 rounded-lg border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'gradient-bg border-transparent text-white'
                          : 'border-gray-700 text-gray-400 hover:border-purple-500 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAdd}
                  disabled={!selectedSize || (requiresColor && !selectedColor)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold transition-all ${
                    added
                      ? 'bg-green-500 text-white'
                      : !selectedSize || (requiresColor && !selectedColor)
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {added ? (
                    <><Check size={18} /> Adicionado ao Carrinho!</>
                  ) : (
                    <><ShoppingBag size={18} /> Adicionar ao Carrinho</>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-full border transition-all ${
                    isWishlisted
                      ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                      : 'border-gray-700 text-gray-400 hover:border-pink-500'
                  }`}
                >
                  <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
                </motion.button>
              </div>

              {!selectedSize || (requiresColor && !selectedColor) ? (
                <p className="text-xs text-amber-400 mb-4 text-center">
                  {requiresColor
                    ? (!selectedColor && !selectedSize ? 'Selecione cor e tamanho' : !selectedColor ? 'Selecione uma cor' : 'Selecione um tamanho')
                    : 'Selecione um volume'}
                </p>
              ) : null}

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-3 mt-auto">
                {[
                  { icon: Truck, text: `Frete grátis acima de R$ ${settings.freeShipThreshold.toFixed(2).replace('.', ',')}` },
                  { icon: Shield, text: 'Compra 100% Segura' },
                  { icon: RotateCcw, text: 'Troca em até 7 dias' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex flex-col items-center gap-1.5 glass p-3 rounded-xl">
                    <Icon size={16} className="text-purple-400" />
                    <span className="text-xs text-gray-400 text-center leading-tight">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
