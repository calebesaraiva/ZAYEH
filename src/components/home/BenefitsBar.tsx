import { Truck, CreditCard, Banknote, RefreshCw, ShieldCheck } from 'lucide-react';
import { useStorePricingSettings } from '../../lib/storePricing';

export default function BenefitsBar() {
  const settings = useStorePricingSettings();
  const items = [
    { icon: Truck, label: 'Frete Grátis', sub: `Acima de R$ ${settings.freeShipThreshold.toFixed(2).replace('.', ',')}` },
    { icon: CreditCard, label: `Parcele em até ${settings.maxInstallments}x`, sub: 'No cartão' },
    { icon: Banknote, label: `PIX ${settings.pixDiscount}% OFF`, sub: 'Desconto à vista' },
    { icon: RefreshCw, label: 'Troca Fácil', sub: 'Em até 7 dias' },
    { icon: ShieldCheck, label: 'Compra Segura', sub: 'Site certificado' },
  ];

  return (
    <section style={{ background: '#111', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div className="benefits-grid">
          {items.map(({ icon: Icon, label, sub }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 0' }}>
              <div style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(255,184,0,0.1)', flexShrink: 0 }}>
                <Icon size={17} style={{ color: '#FFB800' }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{label}</p>
                <p style={{ fontSize: 11, color: '#555', marginTop: 1 }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
