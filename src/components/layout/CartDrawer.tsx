import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, Truck, Lock, Zap, ArrowRight, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { getProductPricing, useStorePricingSettings } from '../../lib/storePricing';

const CASHBACK_RATE = 0.05; // 5%

interface Props { open: boolean; onClose: () => void; }

export default function CartDrawer({ open, onClose }: Props) {
  const { cart, removeFromCart, updateQuantity } = useStore();
  const settings = useStorePricingSettings();
  const subtotal  = cart.reduce((a, i) => a + i.product.price    * i.quantity, 0);
  const pixTotal  = cart.reduce((a, i) => a + getProductPricing(i.product, settings).pixPrice * i.quantity, 0);
  const count     = cart.reduce((a, i) => a + i.quantity, 0);
  const freeShip  = subtotal >= settings.freeShipThreshold;
  const progress  = Math.min((subtotal / settings.freeShipThreshold) * 100, 100);
  const pixSaving = subtotal - pixTotal;
  const cashback  = subtotal * CASHBACK_RATE;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(4px)', zIndex: 50 }}
          />

          {/* Drawer */}
          <motion.div
            className="cart-drawer"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 51,
              width: '100%', maxWidth: 440,
              background: 'linear-gradient(180deg, #fffdf7 0%, #eef3ea 100%)',
              borderLeft: '1px solid rgba(12,46,42,0.16)',
              display: 'flex', flexDirection: 'column',
              boxShadow: '-24px 0 80px rgba(12,46,42,0.24)',
            }}>

            {/* ── Header ── */}
            <div style={{ padding: '20px 22px', borderBottom: '1px solid rgba(12,46,42,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fffdf7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(214,180,106,0.16)', border: '1px solid rgba(214,180,106,0.34)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingBag size={17} style={{ color: '#9b6d22' }} />
                </div>
                <div>
                  <h2 style={{ fontWeight: 900, fontSize: 15, color: '#0b2f2b', lineHeight: 1 }}>Minha Sacola</h2>
                  <p style={{ fontSize: 11, color: '#596760', marginTop: 2 }}>{count} {count === 1 ? 'item' : 'itens'}</p>
                </div>
              </div>
              <button onClick={onClose}
                style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(12,46,42,0.12)', background: 'rgba(255,255,255,0.64)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#596760' }}>
                <X size={16} />
              </button>
            </div>

            {/* ── Shipping progress ── */}
            <div style={{ padding: '12px 22px', background: freeShip ? 'rgba(15,159,95,0.08)' : 'rgba(255,253,247,0.72)', borderBottom: '1px solid rgba(12,46,42,0.1)' }}>
              {freeShip ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Truck size={14} style={{ color: '#0f9f5f' }} />
                  <p style={{ fontSize: 12.5, fontWeight: 800, color: '#0e5a51' }}>Frete grátis garantido! 🎉</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Truck size={13} style={{ color: '#0e5a51' }} />
                    <p style={{ fontSize: 12, color: '#596760' }}>
                      Faltam <strong style={{ color: '#0b2f2b' }}>R$ {(settings.freeShipThreshold - subtotal).toFixed(2).replace('.', ',')}</strong> para frete grátis
                    </p>
                  </div>
                  <div style={{ height: 4, borderRadius: 99, background: 'rgba(12,46,42,0.12)', overflow: 'hidden' }}>
                    <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
                      style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #d8a84a, #b8842c)' }} />
                  </div>
                </>
              )}
            </div>

            {/* ── Items ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cart.length === 0 ? (
                /* Empty state */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: 0 }}>
                  <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <ShoppingBag size={36} style={{ color: 'rgba(255,255,255,0.1)' }} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Sacola vazia</h3>
                  <p style={{ fontSize: 13, color: '#444', lineHeight: 1.6, marginBottom: 28, maxWidth: 240 }}>
                    Explore nossas coleções e adicione os produtos que você curtir.
                  </p>
                  <button onClick={onClose}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                    EXPLORAR COLEÇÕES <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <motion.div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    style={{ display: 'flex', gap: 14, padding: '14px', borderRadius: 14, background: '#fffdf7', border: '1px solid rgba(12,46,42,0.14)', boxShadow: '0 16px 34px rgba(12,46,42,0.08)' }}>

                    {/* Image */}
                    <div style={{ width: 80, height: 96, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(160deg,#f8f1df,#dce7df)', border: '1px solid rgba(12,46,42,0.1)' }}>
                      <img src={item.product.image} alt={item.product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 900, color: '#0b2f2b', lineHeight: 1.3, marginBottom: 7, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {item.product.name}
                        </p>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                          {item.color && (
                            <span style={{ fontSize: 10.5, color: '#0e5a51', background: 'rgba(14,90,81,0.08)', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(14,90,81,0.14)' }}>
                              {item.color}
                            </span>
                          )}
                          <span style={{ fontSize: 10.5, color: '#0e5a51', background: 'rgba(14,90,81,0.08)', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(14,90,81,0.14)' }}>
                            {item.size}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Qty */}
                        <div style={{ display: 'flex', alignItems: 'center', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(12,46,42,0.14)' }}>
                          <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                            style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(12,46,42,0.05)', border: 'none', cursor: 'pointer', color: '#596760' }}>
                            <Minus size={11} />
                          </button>
                          <span style={{ width: 32, textAlign: 'center', fontSize: 13, fontWeight: 900, color: '#0b2f2b' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                            style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(12,46,42,0.05)', border: 'none', cursor: 'pointer', color: '#596760' }}>
                            <Plus size={11} />
                          </button>
                        </div>

                        {/* Price + remove */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: 15, fontWeight: 900, color: '#0e5a51' }}>
                              R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                            </p>
                            {item.quantity > 1 && (
                              <p style={{ fontSize: 10.5, color: '#87918a' }}>
                                R$ {item.product.price.toFixed(2).replace('.', ',')} / un
                              </p>
                            )}
                          </div>
                          <button onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                            style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid rgba(12,46,42,0.12)', background: 'rgba(255,255,255,0.54)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#87918a', transition: 'all 0.2s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(182,95,42,0.4)'; (e.currentTarget as HTMLElement).style.color = '#b65f2a'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(12,46,42,0.12)'; (e.currentTarget as HTMLElement).style.color = '#87918a'; }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* ── Footer / Summary ── */}
            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(12,46,42,0.12)', background: 'rgba(255,253,247,0.86)', padding: '18px 22px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Coupon */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Tag size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#87918a', pointerEvents: 'none' }} />
                    <input
                      placeholder="Cupom de desconto"
                      style={{ width: '100%', background: '#fffdf7', border: '1px solid rgba(12,46,42,0.16)', borderRadius: 10, padding: '10px 12px 10px 34px', color: '#0b2f2b', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(14,90,81,0.42)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(12,46,42,0.16)')}
                    />
                  </div>
                  <button style={{ padding: '0 16px', borderRadius: 10, border: '1px solid rgba(12,46,42,0.16)', background: '#fffdf7', color: '#0e5a51', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14,90,81,0.34)'; (e.currentTarget as HTMLElement).style.color = '#0b2f2b'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(12,46,42,0.16)'; (e.currentTarget as HTMLElement).style.color = '#0e5a51'; }}>
                    APLICAR
                  </button>
                </div>

                {/* Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 16px', borderRadius: 14, background: '#fffdf7', border: '1px solid rgba(12,46,42,0.14)', boxShadow: '0 14px 30px rgba(12,46,42,0.07)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#596760' }}>
                    <span>Subtotal ({count} {count === 1 ? 'item' : 'itens'})</span>
                    <span style={{ color: '#0b2f2b' }}>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {pixSaving > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#0f9f5f' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Zap size={11} /> Desconto PIX ({settings.pixDiscount}%)
                      </span>
                      <span>– R$ {pixSaving.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  {/* Cashback */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#9b6d22' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Coins size={11} /> Cashback (5%)
                    </span>
                    <span>+ R$ {cashback.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#596760' }}>
                    <span>Frete</span>
                    <span style={{ color: freeShip ? '#0f9f5f' : '#596760', fontWeight: freeShip ? 800 : 500 }}>
                      {freeShip ? 'Grátis 🎉' : 'Calcular no checkout'}
                    </span>
                  </div>
                  <div style={{ height: 1, background: 'rgba(12,46,42,0.1)', margin: '2px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 900, fontSize: 14, color: '#0b2f2b' }}>Total</span>
                    <span style={{ fontWeight: 900, fontSize: 18, color: '#0e5a51' }}>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                    <span style={{ color: '#596760' }}>
                      ou <strong style={{ color: '#0f9f5f' }}>R$ {pixTotal.toFixed(2).replace('.', ',')}</strong> no PIX
                    </span>
                    <span style={{ background: 'rgba(15,159,95,0.1)', color: '#0f9f5f', padding: '1px 7px', borderRadius: 99, fontSize: 10, fontWeight: 900, border: '1px solid rgba(15,159,95,0.2)' }}>
                      {settings.pixDiscount}% OFF
                    </span>
                  </div>
                </div>

                {/* Cashback banner */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 12, background: 'rgba(214,180,106,0.12)', border: '1px solid rgba(214,180,106,0.32)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(214,180,106,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Coins size={16} style={{ color: '#9b6d22' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 12.5, fontWeight: 900, color: '#0b2f2b', lineHeight: 1.2 }}>
                      Você vai ganhar R$ {cashback.toFixed(2).replace('.', ',')} de cashback!
                    </p>
                    <p style={{ fontSize: 11, color: '#596760', marginTop: 2 }}>
                      5% do valor volta como saldo ZAYEH
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <Link to="/checkout" onClick={onClose}
                  className="no-underline"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '15px', borderRadius: 12, background: 'linear-gradient(135deg, #0d2f2b, #123f39)', color: '#fffdf7', fontWeight: 900, fontSize: 14, letterSpacing: '0.06em', transition: 'opacity 0.2s', boxShadow: '0 16px 30px rgba(12,46,42,0.18)' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                  <Lock size={15} /> FINALIZAR COMPRA
                </Link>

                <button onClick={onClose}
                  style={{ background: 'none', border: 'none', color: '#596760', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#0b2f2b')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#596760')}>
                  Continuar comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
