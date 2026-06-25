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
    <section style={{
      background: 'linear-gradient(90deg, #efe3cf 0%, #fff8e8 50%, #e8d2ab 100%)',
      borderTop: '1px solid rgba(92,66,22,0.12)',
      borderBottom: '1px solid rgba(92,66,22,0.12)',
      boxShadow: '0 18px 42px rgba(95,67,21,0.08)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div className="benefits-grid">
          {items.map(({ icon: Icon, label, sub }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 0' }}>
              <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'linear-gradient(135deg,#fff7df,#e3b54c)', border: '1px solid rgba(184,132,44,0.22)', flexShrink: 0, boxShadow: '0 12px 24px rgba(184,132,44,0.14)' }}>
                <Icon size={17} style={{ color: '#b8842c' }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 900, color: '#171d1b', lineHeight: 1.3 }}>{label}</p>
                <p style={{ fontSize: 11, color: '#6f6658', marginTop: 1, fontWeight: 500 }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
