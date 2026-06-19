import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const slides = [
  {
    id: 1,
    badge: 'COPA DO MUNDO 2026',
    title: 'VISTA A\nSUA PAIXÃO',
    subtitle: 'Coleção oficial Copa 2026 — Estilo que representa. Atitude que vence.',
    cta: 'VER COLEÇÃO',
    ctaLink: '/categoria/copa-2026',
    bg: 'linear-gradient(135deg, #0b0b0b 0%, #1a0b00 50%, #0b0b0b 100%)',
    accent: '#FFB800',
    fieldLines: true,
  },
  {
    id: 2,
    badge: 'NOVA COLEÇÃO',
    title: 'MASCULINO\nSUH CONCEPT',
    subtitle: 'Vista-se bem e notarão quem você é.',
    cta: 'EXPLORAR',
    ctaLink: '/categoria/masculino',
    bg: 'linear-gradient(135deg, #0b0b0b 0%, #1a0040 50%, #0b0b0b 100%)',
    accent: '#a855f7',
    fieldLines: false,
  },
  {
    id: 3,
    badge: 'OUTLET',
    title: 'ATÉ 40%\nDE DESCONTO',
    subtitle: 'Aproveite os melhores preços em peças selecionadas.',
    cta: 'VER OUTLET',
    ctaLink: '/categoria/outlet',
    bg: 'linear-gradient(135deg, #0b0b0b 0%, #200040 50%, #0b0b0b 100%)',
    accent: '#FF2DA0',
    fieldLines: false,
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setCurrent(c => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const go = (idx: number) => {
    setDir(idx > current ? 1 : -1);
    setCurrent(idx);
  };
  const prev = () => { setDir(-1); setCurrent(c => (c - 1 + slides.length) % slides.length); };
  const next = () => { setDir(1); setCurrent(c => (c + 1) % slides.length); };

  const slide = slides[current];

  return (
    <section className="hero-section relative w-full overflow-hidden" style={{ height: 'clamp(420px, 75vh, 720px)' }}>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={slide.id}
          custom={dir}
          variants={{
            enter: (d: number) => ({ x: d * 60, opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (d: number) => ({ x: d * -60, opacity: 0 }),
          }}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-start"
          style={{ background: slide.bg }}>

          {/* Field line pattern for Copa */}
          {slide.fieldLines && (
            <div className="absolute inset-0 opacity-[0.04]">
              <svg width="100%" height="100%" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
                <rect x="50" y="50" width="1100" height="600" fill="none" stroke="#FFB800" strokeWidth="3" />
                <line x1="600" y1="50" x2="600" y2="650" stroke="#FFB800" strokeWidth="2" />
                <circle cx="600" cy="350" r="120" fill="none" stroke="#FFB800" strokeWidth="2" />
                <rect x="50" y="200" width="160" height="300" fill="none" stroke="#FFB800" strokeWidth="2" />
                <rect x="990" y="200" width="160" height="300" fill="none" stroke="#FFB800" strokeWidth="2" />
              </svg>
            </div>
          )}

          {/* Gradient overlay desktop */}
          <div className="absolute inset-0 hdr-desktop-only" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.15) 100%)' }} />
          {/* Gradient overlay mobile — full cover for legibility */}
          <div className="absolute inset-0 hdr-mobile-only" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.92) 100%)' }} />

          {/* Content */}
          <div className="hero-content-wrap" style={{ position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', width: '100%', padding: '0 20px', paddingLeft: 'clamp(20px, 5vw, 80px)', paddingRight: 'clamp(20px, 5vw, 88px)' }}>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="hero-copy"
              style={{ maxWidth: 'min(560px, calc(100% - 28px))' }}>

              <span className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.2em] mb-4 px-3 py-1.5 rounded-full"
                style={{ background: `${slide.accent}22`, color: slide.accent, border: `1px solid ${slide.accent}40` }}>
                {slide.badge}
              </span>

              <h1 className="hero-title font-cinzel font-black mb-4 text-white whitespace-pre-line"
                style={{ fontSize: 'clamp(2rem, 6.4vw, 6rem)', lineHeight: 0.98, textShadow: '0 2px 40px rgba(0,0,0,0.8)' }}>
                {slide.title}
              </h1>

              <p className="hero-subtitle" style={{ color: '#aaa', marginBottom: 24, maxWidth: 400, lineHeight: 1.6, fontSize: 'clamp(0.8rem, 1.5vw, 1rem)' }}>
                {slide.subtitle}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <Link to={slide.ctaLink} className="btn-primary no-underline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {slide.cta} <ChevronRight size={16} />
                </Link>
                <Link to="/sobre" className="btn-outline no-underline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  SOBRE NÓS
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Accent gradient orb */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-15 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${slide.accent} 0%, transparent 70%)` }} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button onClick={prev} className="hero-nav-arrow hero-nav-prev absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full text-white/70 hover:text-white transition-all"
        style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
        <ChevronLeft size={18} />
      </button>
      <button onClick={next} className="hero-nav-arrow hero-nav-next absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full text-white/70 hover:text-white transition-all"
        style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              background: i === current ? slide.accent : 'rgba(255,255,255,0.3)',
            }} />
        ))}
      </div>
    </section>
  );
}
