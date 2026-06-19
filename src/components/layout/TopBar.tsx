import { Truck, CreditCard, Tag, RefreshCw } from 'lucide-react';
import { useStorePricingSettings } from '../../lib/storePricing';

/* On mobile, auto-scroll marquee through all 4 items */
export default function TopBar() {
  const settings = useStorePricingSettings();
  const items = [
    { icon: Truck, text: `Frete grátis acima de R$ ${settings.freeShipThreshold.toFixed(2).replace('.', ',')}`, highlight: `R$ ${settings.freeShipThreshold.toFixed(2).replace('.', ',')}` },
    { icon: CreditCard, text: `Parcele em até ${settings.maxInstallments}x`, highlight: `${settings.maxInstallments}x` },
    { icon: Tag, text: `${settings.pixDiscount}% OFF no PIX`, highlight: `${settings.pixDiscount}% OFF` },
    { icon: RefreshCw, text: 'Troca fácil em até 7 dias', highlight: '7 dias' },
  ];

  return (
    <div style={{
      background: 'linear-gradient(90deg, #0a0a0a 0%, #0f0f0f 50%, #0a0a0a 100%)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      overflow: 'hidden',
    }}>
      <div style={{ height: 2, background: 'linear-gradient(90deg, #a855f7 0%, #FF2DA0 40%, #FFB800 75%, #22C55E 100%)' }} />

      {/* Desktop: all items in a row */}
      <div className="hdr-desktop-only" style={{ alignItems: 'center', justifyContent: 'center', gap: 0, padding: '0 24px', height: 36 }}>
        {items.map(({ icon: Icon, text, highlight }, i) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0 18px', position: 'relative' }}>
            {i > 0 && <span style={{ position: 'absolute', left: 0, top: '20%', height: '60%', width: 1, background: 'rgba(255,255,255,0.06)' }} />}
            <Icon size={11} style={{ color: '#a855f7', flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>
              {text.split(highlight)[0]}
              <strong style={{ color: '#ddd', fontWeight: 700 }}>{highlight}</strong>
              {text.split(highlight)[1]}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile: compact premium strip */}
      <div className="hdr-mobile-only topbar-mobile">
        {[items[0], items[2]].map(({ icon: Icon, text, highlight }) => (
          <div key={text} className="topbar-mobile-item">
            <Icon size={10} style={{ color: '#a855f7', flexShrink: 0 }} />
            <span>
              {text.split(highlight)[0]}
              <strong>{highlight}</strong>
              {text.split(highlight)[1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
