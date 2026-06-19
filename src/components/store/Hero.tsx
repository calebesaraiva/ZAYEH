import { motion } from 'framer-motion';
import { ArrowRight, Star, Trophy, Zap, Globe } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        {/* Dark green field base */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 50%, #0a1a0a 0%, #050505 70%)' }} />

        {/* Gradient orbs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #f97316, #ec4899, transparent)' }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-60 -left-60 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #16a34a, #15803d, transparent)' }}
        />

        {/* Field grid */}
        <div className="field-lines" />

        {/* Field center circle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.03] pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-white/[0.03] pointer-events-none" />
      </div>

      {/* Floating balls */}
      <motion.div
        animate={{ y: [0, -25, 0], rotate: [0, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-32 right-[15%] text-5xl opacity-20 pointer-events-none select-none"
      >⚽</motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -360] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-40 left-[10%] text-3xl opacity-10 pointer-events-none select-none"
      >⚽</motion.div>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute top-1/2 left-[5%] text-xl opacity-10 pointer-events-none select-none"
      >🏆</motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16 grid lg:grid-cols-2 gap-12 items-center">

        {/* Left */}
        <div>
          {/* Copa badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-yellow-500/30"
            style={{ background: 'rgba(251,191,36,0.08)' }}
          >
            <Trophy size={14} className="text-yellow-400" />
            <span className="text-sm text-yellow-300 font-semibold tracking-wide">⚽ Coleção Copa do Mundo 2026</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="font-display text-5xl sm:text-6xl lg:text-[72px] font-black leading-[1.05] mb-6 tracking-tight"
          >
            Vista a sua
            <span className="gradient-text block">paixão pelo</span>
            <span className="flex items-center gap-3">
              jogo.
              <span className="text-4xl">⚽</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed"
          >
            Moda feminina exclusiva inspirada na grandiosidade da Copa do Mundo.
            Elegância, atitude e o espírito campeão em cada peça.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <button className="btn-primary text-base flex items-center gap-2">
              Ver Coleção Copa <ArrowRight size={18} />
            </button>
            <button className="flex items-center gap-2 px-7 py-4 rounded-full border border-white/10 text-gray-300 font-semibold hover:border-orange-500/40 hover:text-white transition-all">
              <Globe size={16} /> Explorar Tudo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="flex gap-8"
          >
            {[
              { value: '2.4K+', label: 'Clientes', icon: '👑' },
              { value: '200+', label: 'Peças Exclusivas', icon: '✨' },
              { value: '4.9★', label: 'Avaliação', icon: '⚽' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black gradient-text">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                  <span>{s.icon}</span>{s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Image showcase */}
        <div className="relative hidden lg:flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', damping: 18 }}
            className="relative"
          >
            {/* Rotating ring */}
            <motion.div
              animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-5 rounded-3xl border border-dashed"
              style={{ borderColor: 'rgba(249,115,22,0.25)' }}
            />
            <motion.div
              animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-10 rounded-3xl border border-dashed"
              style={{ borderColor: 'rgba(251,191,36,0.1)' }}
            />

            {/* Main image */}
            <div className="w-80 h-[500px] rounded-3xl overflow-hidden neon-glow" style={{ border: '2px solid rgba(249,115,22,0.3)' }}>
              <img
                src="https://images.unsplash.com/photo-1529635767500-4f64c3a8a0dc?w=700&q=80"
                alt="SUH Concept"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" style={{ borderRadius: '1.5rem' }} />
            </div>
          </motion.div>

          {/* Floating card — Trophy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}
            className="absolute -left-16 top-1/4 glass px-4 py-3 rounded-2xl animate-float"
            style={{ border: '1px solid rgba(251,191,36,0.2)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.15)' }}>
                <Trophy size={16} className="text-yellow-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Coleção</div>
                <div className="text-sm font-bold gold-text">Copa 2026</div>
              </div>
            </div>
          </motion.div>

          {/* Floating card — Rating */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }}
            className="absolute -right-14 bottom-1/3 glass px-4 py-3 rounded-2xl animate-float2"
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.15)' }}>
                <Star size={15} className="text-orange-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Avaliação</div>
                <div className="text-sm font-bold gradient-text">4.9 / 5.0</div>
              </div>
            </div>
          </motion.div>

          {/* Floating card — Exclusivo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
            className="absolute -right-10 top-8 glass px-3 py-2 rounded-2xl"
            style={{ border: '1px solid rgba(22,163,74,0.2)' }}
          >
            <div className="flex items-center gap-1.5 text-xs">
              <Zap size={13} className="text-green-400" />
              <span className="text-green-300 font-semibold">Lançamento Exclusivo</span>
            </div>
          </motion.div>

          {/* Side image */}
          <motion.div
            initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
            className="absolute -left-10 bottom-8 w-28 h-36 rounded-2xl overflow-hidden"
            style={{ border: '2px solid rgba(249,115,22,0.2)' }}
          >
            <img src="https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300&q=80" alt="Look" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
      >
        <span className="text-xs">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-orange-500 to-transparent" />
      </motion.div>
    </section>
  );
}
