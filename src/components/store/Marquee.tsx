import { motion } from 'framer-motion';
import { Trophy, Truck, Shield, RotateCcw, Star, Zap, Globe } from 'lucide-react';
import { useStorePricingSettings } from '../../lib/storePricing';

export default function Marquee() {
  const settings = useStorePricingSettings();
  const items = [
    { icon: Trophy, text: '⚽ Coleção Copa do Mundo 2026' },
    { icon: Truck, text: `Frete grátis acima de R$ ${settings.freeShipThreshold.toFixed(2).replace('.', ',')}` },
    { icon: Shield, text: 'Compra 100% Segura' },
    { icon: Globe, text: '🏆 Edição Limitada Disponível' },
    { icon: RotateCcw, text: 'Troca fácil em até 7 dias' },
    { icon: Star, text: '4.9 Estrelas • Mais de 2.400 clientes' },
    { icon: Zap, text: `PIX com ${settings.pixDiscount}% OFF` },
  ];
  const doubled = [...items, ...items, ...items];

  return (
    <div
      className="overflow-hidden py-3.5"
      style={{
        background: 'linear-gradient(90deg, rgba(249,115,22,0.06), rgba(236,72,153,0.06), rgba(249,115,22,0.06))',
        borderTop: '1px solid rgba(249,115,22,0.15)',
        borderBottom: '1px solid rgba(249,115,22,0.15)',
      }}
    >
      <motion.div
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="flex gap-10 whitespace-nowrap"
        style={{ width: 'max-content' }}
      >
        {doubled.map(({ icon: Icon, text }, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
            <Icon size={13} className="text-orange-400 flex-shrink-0" />
            <span>{text}</span>
            <span className="text-orange-600 ml-6">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
