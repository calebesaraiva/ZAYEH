import { useState } from 'react';
import { Heart, Star, Eye, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '../../data/products';
import { useStore } from '../../store/useStore';
import QuickViewModal from './QuickViewModal';
import { getProductPricing, useStorePricingSettings } from '../../lib/storePricing';

interface Props { product: Product; }

export default function ProductCard({ product }: Props) {
  const { toggleWishlist, wishlist } = useStore();
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const isWished = wishlist.includes(product.id);
  const stars = Math.round(product.rating);
  const isPerfumaria = product.categorySlug === 'perfumaria';
  const settings = useStorePricingSettings();
  const pricing = getProductPricing(product, settings);

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          cursor: 'pointer',
          borderRadius: 22,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #fffaf0 0%, #f0e1c4 100%)',
          border: '1px solid rgba(92, 66, 22, 0.14)',
          transition: 'box-shadow 0.25s, transform 0.25s, border-color 0.25s',
          transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
          boxShadow: hovered ? '0 24px 58px rgba(95, 67, 21, 0.18)' : '0 14px 34px rgba(95, 67, 21, 0.08)',
        }}
        onClick={openModal}>

        {/* Image */}
        <div style={{
          position: 'relative',
          aspectRatio: '3/4',
          overflow: 'hidden',
          background: isPerfumaria
            ? 'radial-gradient(circle at 50% 18%, rgba(232, 196, 121, 0.42), transparent 42%), linear-gradient(180deg, #fff6e4 0%, #ead8b5 100%)'
            : 'linear-gradient(180deg, #f5ead6 0%, #e9d8b9 100%)',
          borderBottom: '1px solid rgba(92, 66, 22, 0.1)',
        }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: isPerfumaria ? 'contain' : 'cover',
              background: 'transparent',
              padding: isPerfumaria ? 18 : 0,
              transition: 'transform 0.5s',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              filter: isPerfumaria ? 'drop-shadow(0 18px 22px rgba(69, 49, 18, 0.22))' : 'none',
            }}
          />

          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(91,65,22,0.14))', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }} />

          {/* Badges */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {product.discount && (
              <span style={{ background: '#b8862f', color: '#17120a', fontSize: 9.5, fontWeight: 900, padding: '4px 10px', borderRadius: 99, letterSpacing: '0.06em', boxShadow: '0 8px 20px rgba(184,134,47,0.24)' }}>
                {product.discount}% OFF
              </span>
            )}
            {product.isNew && !product.discount && (
              <span style={{ background: '#18332d', color: '#f5e4b3', fontSize: 9.5, fontWeight: 900, padding: '4px 10px', borderRadius: 99, letterSpacing: '0.06em' }}>
                NOVO
              </span>
            )}
          </div>

          {/* Wishlist btn */}
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
            style={{
              position: 'absolute', top: 10, right: 10,
              width: 34, height: 34, borderRadius: '50%',
              background: isWished ? 'rgba(216,168,74,0.28)' : 'rgba(255,250,240,0.84)',
              border: `1px solid ${isWished ? 'rgba(184,132,44,0.48)' : 'rgba(92,66,22,0.16)'}`,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 10px 22px rgba(68, 49, 18, 0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
            <Heart size={14} fill={isWished ? '#b8842c' : 'none'} color={isWished ? '#b8842c' : '#1b211f'} />
          </motion.button>

          {/* Hover CTA */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <div style={{ background: 'rgba(24, 30, 27, 0.92)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.12)', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Eye size={15} style={{ color: '#f0cf82' }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: '#fff8e8', letterSpacing: '0.1em' }}>VER RÁPIDO</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '16px 16px 18px' }}>
          <p style={{ fontSize: 10, color: '#a0772c', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 800 }}>
            {product.category}
          </p>
          <h3 style={{ fontSize: 14.5, fontWeight: 900, color: '#171d1b', lineHeight: 1.28, marginBottom: 9, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.name}
          </h3>

          {/* Stars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={10} fill={s <= stars ? '#c49438' : 'none'} color={s <= stars ? '#c49438' : '#d8cab3'} />
            ))}
            <span style={{ fontSize: 10.5, color: '#7d705e', marginLeft: 2 }}>({product.reviews})</span>
          </div>

          {/* Price block */}
          <div>
            {product.originalPrice && (
              <p style={{ fontSize: 11, color: '#9d907c', textDecoration: 'line-through', marginBottom: 1 }}>
                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
              </p>
            )}
            <p style={{ fontSize: 18, fontWeight: 900, color: '#171d1b', lineHeight: 1.2, marginBottom: 3 }}>
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>
            <p style={{ fontSize: 11, color: '#22C55E', fontWeight: 600 }}>
              R$ {pricing.pixPrice.toFixed(2).replace('.', ',')} <span style={{ color: '#7d705e', fontWeight: 500 }}>no PIX</span>
            </p>
            <p style={{ fontSize: 10.5, color: '#7d705e', marginTop: 2 }}>
              {pricing.installmentCount}x R$ {pricing.installmentValue.toFixed(2).replace('.', ',')}
            </p>
          </div>

          {/* Cashback */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 11, padding: '7px 9px', borderRadius: 10, background: 'rgba(196,148,56,0.12)', border: '1px solid rgba(196,148,56,0.2)' }}>
            <Coins size={10} style={{ color: '#a87724', flexShrink: 0 }} />
            <span style={{ fontSize: 10.5, color: '#8a641e', fontWeight: 800 }}>
              5% cashback · R$ {(product.price * 0.05).toFixed(2).replace('.', ',')}
            </span>
          </div>

          {/* Colors */}
          {!isPerfumaria && product.colors.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
              {product.colors.slice(0, 5).map(c => (
                <div key={c.name} title={c.name}
                  style={{ width: 14, height: 14, borderRadius: '50%', background: c.hex, border: '1.5px solid rgba(92,66,22,0.16)', flexShrink: 0 }}
                />
              ))}
              {product.colors.length > 5 && (
                <span style={{ fontSize: 10, color: '#7d705e' }}>+{product.colors.length - 5}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <QuickViewModal product={product} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
