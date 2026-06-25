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
            background: 'linear-gradient(135deg, #fff8e8 0%, #e8c98f 52%, #f8edd6 100%)',
            border: '1px solid rgba(143, 103, 34, 0.22)',
            boxShadow: '0 24px 60px rgba(95, 67, 21, 0.16)',
          }}>

          {/* Field lines */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none' }}>
            <svg width="100%" height="100%" viewBox="0 0 900 300" preserveAspectRatio="xMidYMid slice">
              <rect x="20" y="20" width="860" height="260" fill="none" stroke="#7a5419" strokeWidth="2" />
              <line x1="450" y1="20" x2="450" y2="280" stroke="#7a5419" strokeWidth="1.5" />
              <circle cx="450" cy="150" r="70" fill="none" stroke="#7a5419" strokeWidth="1.5" />
            </svg>
          </div>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '56%', opacity: 0.36, background: 'radial-gradient(ellipse at right, #fff7df 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 38, top: 32, width: 130, height: 130, borderRadius: '50%', border: '1px solid rgba(122,84,25,0.12)', background: 'rgba(255,255,255,0.16)' }} />
          <div style={{ position: 'absolute', right: 96, bottom: -26, width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(122,84,25,0.1)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span className="badge badge-gold" style={{ display: 'inline-block', marginBottom: 16 }}>ZAYEH SELECT</span>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, color: '#16201d', fontSize: 'clamp(1.65rem, 3.2vw, 2.8rem)', lineHeight: 1.08, marginBottom: 12, textShadow: '0 1px 0 rgba(255,255,255,0.32)' }}>
              EDIÇÃO CURADA COM<br />ATÉ 20% OFF
            </h2>
            <p style={{ fontSize: 14, color: '#5f5647', fontWeight: 500 }}>
              Use o cupom <strong style={{ color: '#171d1b', fontWeight: 900 }}>ZAYEH10</strong> no checkout e finalize com visual de coleção.
            </p>
          </div>

          <Link to="/categoria/copa-2026" className="btn-primary no-underline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1, background: '#17201d', color: '#fff8e8', boxShadow: '0 18px 34px rgba(23,32,29,0.18)' }}>
            VER EDIÇÃO <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
