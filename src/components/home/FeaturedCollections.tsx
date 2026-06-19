import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const collections = [
  {
    slug: 'copa-2026',
    label: 'COPA 2026',
    tag: 'NOVO',
    desc: 'Coleção exclusiva\nCopa do Mundo',
    accent: '#FFB800',
    gradient: 'linear-gradient(160deg, #1a1000 0%, #3a2400 60%, #1a1000 100%)',
    shape: (
      <svg viewBox="0 0 120 120" width="88" height="88" fill="none">
        <circle cx="60" cy="60" r="48" stroke="#FFB800" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.3" />
        <circle cx="60" cy="60" r="28" stroke="#FFB800" strokeWidth="2" opacity="0.4" />
        {/* soccer ball pentagons */}
        <circle cx="60" cy="60" r="10" fill="#FFB800" opacity="0.7" />
        <circle cx="60" cy="32" r="5" fill="#FFB800" opacity="0.35" />
        <circle cx="84" cy="46" r="5" fill="#FFB800" opacity="0.35" />
        <circle cx="75" cy="76" r="5" fill="#FFB800" opacity="0.35" />
        <circle cx="45" cy="76" r="5" fill="#FFB800" opacity="0.35" />
        <circle cx="36" cy="46" r="5" fill="#FFB800" opacity="0.35" />
      </svg>
    ),
  },
  {
    slug: 'masculino',
    label: 'MASCULINO',
    tag: '',
    desc: 'Camisas do Brasil\ne modelos plus size',
    accent: '#818CF8',
    gradient: 'linear-gradient(160deg, #070715 0%, #0f0f2e 60%, #070715 100%)',
    shape: (
      <svg viewBox="0 0 120 120" width="88" height="88" fill="none">
        {/* t-shirt silhouette */}
        <path d="M40 35 L20 50 L30 60 L38 54 L38 90 L82 90 L82 54 L90 60 L100 50 L80 35 L72 42 Q60 28 48 42 Z" stroke="#818CF8" strokeWidth="1.8" fill="#818CF8" fillOpacity="0.08" opacity="0.6" />
        <path d="M40 35 L20 50 L30 60 L38 54 L38 90 L82 90 L82 54 L90 60 L100 50 L80 35 L72 42 Q60 28 48 42 Z" stroke="#818CF8" strokeWidth="1.5" fill="none" opacity="0.4" />
      </svg>
    ),
  },
  {
    slug: 'feminino',
    label: 'FEMININO',
    tag: '',
    desc: 'Camisa retrô feminina\nem destaque',
    accent: '#FF2DA0',
    gradient: 'linear-gradient(160deg, #1a0010 0%, #350025 60%, #1a0010 100%)',
    shape: (
      <svg viewBox="0 0 120 120" width="88" height="88" fill="none">
        {/* abstract flower / feminine shape */}
        <ellipse cx="60" cy="60" rx="18" ry="30" fill="#FF2DA0" fillOpacity="0.1" stroke="#FF2DA0" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="60" cy="60" rx="18" ry="30" fill="none" stroke="#FF2DA0" strokeWidth="1.5" opacity="0.3" transform="rotate(60 60 60)" />
        <ellipse cx="60" cy="60" rx="18" ry="30" fill="none" stroke="#FF2DA0" strokeWidth="1.5" opacity="0.3" transform="rotate(120 60 60)" />
        <circle cx="60" cy="60" r="10" fill="#FF2DA0" fillOpacity="0.2" stroke="#FF2DA0" strokeWidth="1.5" opacity="0.6" />
        <circle cx="60" cy="60" r="3" fill="#FF2DA0" opacity="0.9" />
      </svg>
    ),
  },
  {
    slug: 'infantil',
    label: 'INFANTIL',
    tag: '',
    desc: 'Conjuntos para\n3 a 14 anos',
    accent: '#22C55E',
    gradient: 'linear-gradient(160deg, #001408 0%, #002510 60%, #001408 100%)',
    shape: (
      <svg viewBox="0 0 120 120" width="88" height="88" fill="none">
        <circle cx="60" cy="38" r="10" stroke="#22C55E" strokeWidth="1.8" fill="#22C55E" fillOpacity="0.08" />
        <path d="M42 52 Q60 44 78 52 L72 94 H48 Z" stroke="#22C55E" strokeWidth="1.8" fill="#22C55E" fillOpacity="0.06" opacity="0.7" />
        <path d="M60 48 L60 94" stroke="#22C55E" strokeWidth="1.2" opacity="0.35" />
        <path d="M48 66 H72" stroke="#22C55E" strokeWidth="1.2" opacity="0.35" />
      </svg>
    ),
  },
  {
    slug: 'perfumaria',
    label: 'PERFUMARIA',
    tag: 'ESSÊNCIA',
    desc: 'Fragrâncias intensas\npara marcar presença',
    accent: '#38BDF8',
    gradient: 'linear-gradient(160deg, #03131a 0%, #082b38 60%, #03131a 100%)',
    shape: (
      <svg viewBox="0 0 120 120" width="88" height="88" fill="none">
        <rect x="38" y="38" width="44" height="48" rx="8" stroke="#38BDF8" strokeWidth="1.8" fill="#38BDF8" fillOpacity="0.07" />
        <rect x="48" y="28" width="24" height="10" rx="3" stroke="#38BDF8" strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M60 20 C48 30, 46 44, 60 50 C74 44, 72 30, 60 20Z" fill="#38BDF8" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1.4" opacity="0.55" />
        <circle cx="60" cy="62" r="9" stroke="#38BDF8" strokeWidth="1.4" opacity="0.45" />
      </svg>
    ),
  },
];

export default function FeaturedCollections() {
  return (
    <section className="section-gap">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div className="section-header">
          <div>
            <p className="section-label">EXPLORE</p>
            <h2 className="section-title">COLEÇÕES</h2>
          </div>
          <Link to="/categoria/todos" className="no-underline" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#555' }}>
            VER TUDO <ArrowRight size={14} />
          </Link>
        </div>

        <div className="collections-grid">
          {collections.map((col, i) => (
            <motion.div
              key={col.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.09 }}>
              <Link
                to={`/categoria/${col.slug}`}
                className="no-underline"
                style={{ display: 'block', borderRadius: 14, overflow: 'hidden', background: col.gradient, border: `1px solid ${col.accent}18`, position: 'relative', minHeight: 280, textDecoration: 'none', transition: 'transform 0.25s, box-shadow 0.25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px ${col.accent}22`; (e.currentTarget as HTMLElement).style.borderColor = `${col.accent}44`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = `${col.accent}18`; }}>

                {/* Glow orb */}
                <div style={{ position: 'absolute', top: -30, right: -30, width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle, ${col.accent}20 0%, transparent 70%)`, pointerEvents: 'none' }} />

                {/* Content */}
                <div style={{ padding: '32px 24px 24px', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', zIndex: 1 }}>
                  {/* Shape */}
                  <div style={{ marginBottom: 24, opacity: 0.85 }}>
                    {col.shape}
                  </div>

                  {/* Badge */}
                  {col.tag && (
                    <span style={{ display: 'inline-block', fontSize: 9, fontWeight: 900, letterSpacing: '0.18em', padding: '3px 10px', borderRadius: 99, background: `${col.accent}22`, color: col.accent, border: `1px solid ${col.accent}40`, marginBottom: 10, width: 'fit-content' }}>
                      {col.tag}
                    </span>
                  )}

                  <h3 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 18, color: '#fff', letterSpacing: '0.1em', marginBottom: 8, lineHeight: 1.2 }}>
                    {col.label}
                  </h3>
                  <p style={{ fontSize: 12, color: '#555', lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: 'auto' }}>
                    {col.desc}
                  </p>

                  {/* CTA bottom */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 28, paddingTop: 16, borderTop: `1px solid ${col.accent}18`, color: col.accent, fontSize: 11, fontWeight: 800, letterSpacing: '0.12em' }}>
                    VER COLEÇÃO <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
