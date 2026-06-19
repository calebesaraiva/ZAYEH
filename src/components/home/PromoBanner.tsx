import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section style={{ padding: '0 0 32px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            position: 'relative', overflow: 'hidden', borderRadius: 16,
            padding: 'clamp(24px, 5vw, 56px)',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20,
            background: 'linear-gradient(135deg, #1a1000 0%, #2a1800 40%, #0b0b0b 100%)',
            border: '1px solid rgba(255,184,0,0.2)',
          }}>

          {/* Field lines */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none' }}>
            <svg width="100%" height="100%" viewBox="0 0 900 300" preserveAspectRatio="xMidYMid slice">
              <rect x="20" y="20" width="860" height="260" fill="none" stroke="#FFB800" strokeWidth="2" />
              <line x1="450" y1="20" x2="450" y2="280" stroke="#FFB800" strokeWidth="1.5" />
              <circle cx="450" cy="150" r="70" fill="none" stroke="#FFB800" strokeWidth="1.5" />
            </svg>
          </div>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', opacity: 0.12, background: 'radial-gradient(ellipse at right, #FFB800 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span className="badge badge-gold" style={{ display: 'inline-block', marginBottom: 16 }}>COPA DO MUNDO 2026</span>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: 1.15, marginBottom: 10 }}>
              ATÉ 20% OFF NA<br />LINHA COPA 2026
            </h2>
            <p style={{ fontSize: 13, color: '#666' }}>
              Use o cupom <strong style={{ color: '#fff', fontWeight: 700 }}>COPA2026</strong> no checkout
            </p>
          </div>

          <Link to="/categoria/copa-2026" className="btn-primary no-underline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
            APROVEITAR <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
