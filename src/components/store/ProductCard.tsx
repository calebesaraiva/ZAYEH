import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye, Zap } from 'lucide-react';
import type { Product } from '../../store/useStore';
import { useStore } from '../../store/useStore';

interface Props { product: Product; onClick: (p: Product) => void; }

export default function ProductCard({ product, onClick }: Props) {
  const { cart, wishlist, addToCart, toggleWishlist } = useStore();
  const [hovered, setHovered] = useState(false);
  const [addedEffect, setAddedEffect] = useState(false);
  const isWishlisted = wishlist.includes(product.id);
  const inCart = cart.some(i => i.product.id === product.id);
  const isPerfumaria = product.categorySlug === 'perfumaria';

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0]?.name ?? '');
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(product)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.image} alt={product.name}
          className="w-full h-full transition-transform duration-700"
          style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)', objectFit: isPerfumaria ? 'contain' : 'cover', padding: isPerfumaria ? 10 : 0, background: isPerfumaria ? 'radial-gradient(circle at top, rgba(216,168,74,0.14), transparent 58%), #111' : 'transparent' }}
        />

        {/* Overlay */}
        <div className="overlay">
          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={e => { e.stopPropagation(); onClick(product); }}
              className="flex items-center gap-2 glass px-5 py-2.5 rounded-full text-white text-sm font-semibold"
            >
              <Eye size={14} /> Ver Detalhes
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                addedEffect ? 'bg-green-500 text-white' : 'btn-primary'
              }`}
            >
              {addedEffect ? <><Zap size={14} /> Adicionado!</> : <><ShoppingBag size={14} /> Adicionar</>}
            </motion.button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew      && <span className="bg-orange-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">NOVO</span>}
          {product.isBestSeller && <span className="bg-yellow-500 text-black text-[11px] font-bold px-2.5 py-1 rounded-full">🔥 TOP</span>}
          {product.discount   && <span className="bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">-{product.discount}%</span>}
        </div>

        {/* Wishlist */}
        <motion.button
          whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
          onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-3 right-3 w-8 h-8 glass rounded-full flex items-center justify-center"
        >
          <Heart size={15} className={isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-gray-400'} />
        </motion.button>

        {inCart && (
          <div className="absolute bottom-3 right-3 w-6 h-6 gradient-bg rounded-full flex items-center justify-center">
            <ShoppingBag size={11} className="text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-1 mb-1.5">
          <Star size={11} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-500">{product.rating} ({product.reviews})</span>
        </div>
        <h3 className="text-sm font-semibold text-gray-100 mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-black text-white">R$ {product.price.toFixed(2).replace('.', ',')}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-600 line-through ml-1.5">
                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
          {!isPerfumaria && product.colors.length > 0 && (
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map((color) => (
                <div key={color.name} className="w-3 h-3 rounded-full border border-white/20" style={{ background: color.hex }} />
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-1 mt-2 flex-wrap">
          {product.sizes.slice(0, 4).map(size => (
            <span key={size} className="text-[11px] text-gray-600 border border-gray-800 rounded px-1.5 py-0.5">{size}</span>
          ))}
          {product.sizes.length > 4 && <span className="text-[11px] text-orange-400">+{product.sizes.length - 4}</span>}
        </div>
      </div>
    </motion.div>
  );
}
