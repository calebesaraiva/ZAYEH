import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section style={{ padding: '8px 0 38px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            position: 'relative', overflow: 'hidden', borderRadius: 16,
            padding: 'clamp(24px, 5vw, 56px)',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20,
            background: 'linear-gradient(135deg, #0d2f2b 0%, #123f39 46%, #d6b46a 100%)',
            border: '1px solid rgba(214, 180, 106, 0.28)',
            boxShadow: '0 24px 60px rgba(12, 46, 42, 0.22)',
          }}>

          {/* Field lines */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.16, pointerEvents: 'none' }}>
            <svg width="100%" height="100%" viewBox="0 0 900 300" preserveAspectRatio="xMidYMid slice">
              <rect x="20" y="20" width="860" height="260" fill="none" stroke="#fff8e8" strokeWidth="2" />
              <line x1="450" y1="20" x2="450" y2="280" stroke="#fff8e8" strokeWidth="1.5" />
              <circle cx="450" cy="150" r="70" fill="none" stroke="#fff8e8" strokeWidth="1.5" />
            </svg>
          </div>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '56%', opacity: 0.24, background: 'radial-gradient(ellipse at right, #fff7df 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 38, top: 32, width: 130, height: 130, borderRadius: '50%', border: '1px solid rgba(122,84,25,0.12)', background: 'rgba(255,255,255,0.16)' }} />
          <div style={{ position: 'absolute', right: 96, bottom: -26, width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(122,84,25,0.1)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span className="badge badge-gold" style={{ display: 'inline-block', marginBottom: 16 }}>ZAYEH SELECT</span>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, color: '#fffdf7', fontSize: 'clamp(1.65rem, 3.2vw, 2.8rem)', lineHeight: 1.08, marginBottom: 12, textShadow: '0 14px 42px rgba(0,0,0,0.22)' }}>
              EDIÇÃO CURADA COM<br />ATÉ 20% OFF
            </h2>
            <p style={{ fontSize: 14, color: '#d8cdb8', fontWeight: 500 }}>
              Use o cupom <strong style={{ color: '#f2cf82', fontWeight: 900 }}>ZAYEH10</strong> no checkout e finalize com visual de coleção.
            </p>
          </div>

          <Link to="/categoria/copa-2026" className="btn-primary promo-invert no-underline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1, background: '#fffdf7', color: '#0d2f2b', boxShadow: '0 18px 34px rgba(0,0,0,0.18)' }}>
            VER EDIÇÃO <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
