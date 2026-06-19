import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Zap } from 'lucide-react';

export default function FeaturedBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid md:grid-cols-3 gap-4">

        {/* Main — Copa banner */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="md:col-span-2 relative overflow-hidden rounded-3xl cursor-pointer"
          style={{ minHeight: 300 }}
        >
          <img
            src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=900&q=80"
            alt="Copa 2026"
            className="w-full h-full object-cover absolute inset-0"
          />
          {/* Dark green overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, rgba(0,0,0,0.88) 50%, rgba(22,163,74,0.25) 100%)' }} />

          {/* Field lines */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          <div className="relative z-10 p-8 h-full flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-gold flex items-center gap-1.5">
                <Trophy size={11} /> Edição Especial
              </span>
              <span className="text-2xl">⚽</span>
            </div>
            <h3 className="font-display text-3xl md:text-4xl font-black mb-2 leading-tight">
              Coleção <span className="gold-text">Copa 2026</span>
            </h3>
            <p className="text-gray-300 mb-5 text-sm max-w-sm">
              Peças exclusivas que celebram a grandiosidade do futebol. Vista seu estilo campeão.
            </p>
            <button className="btn-gold flex items-center gap-2 w-fit text-sm py-3 px-6 font-bold">
              <Trophy size={15} /> Ver Coleção Exclusiva
            </button>
          </div>
        </motion.div>

        {/* Side banners */}
        <div className="flex flex-col gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl cursor-pointer flex-1"
            style={{ minHeight: 140 }}
          >
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&q=80"
              alt="Sale"
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/20" />
            <div className="relative z-10 p-5 flex flex-col justify-end h-full">
              <span className="badge badge-danger mb-2 w-fit">Até 40% OFF</span>
              <h4 className="font-black text-lg gradient-text">Sale Especial</h4>
              <p className="text-xs text-gray-400">Peças selecionadas por tempo limitado</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl cursor-pointer flex-1"
            style={{
              minHeight: 140,
              background: 'linear-gradient(135deg, #0a1a10, #0f2a1a)',
              border: '1px solid rgba(22,163,74,0.2)',
            }}
          >
            <div className="absolute inset-0 opacity-30"
              style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(22,163,74,0.4), transparent)' }}
            />
            <div className="relative z-10 p-5 h-full flex flex-col justify-between">
              <div className="flex items-center gap-2 text-xs text-green-400">
                <Zap size={12} />
                <span className="font-semibold">Oferta Relâmpago ⚡</span>
              </div>
              <div>
                <h4 className="font-black text-xl mb-1">Frete Grátis</h4>
                <p className="text-xs text-gray-400">Hoje em pedidos acima de R$199</p>
              </div>
              <button className="text-xs text-green-400 font-semibold flex items-center gap-1">
                Aproveitar <ArrowRight size={12} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
