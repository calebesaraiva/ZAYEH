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
    <section className="benefits-luxe" style={{
      background: 'linear-gradient(90deg, #0d2f2b 0%, #123f39 48%, #d6b46a 100%)',
      borderTop: '1px solid rgba(214,180,106,0.26)',
      borderBottom: '1px solid rgba(12,46,42,0.18)',
      boxShadow: '0 18px 42px rgba(12,46,42,0.13)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div className="benefits-grid">
          {items.map(({ icon: Icon, label, sub }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 0' }}>
              <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(255,253,247,0.12)', border: '1px solid rgba(255,248,232,0.28)', flexShrink: 0, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}>
                <Icon size={17} style={{ color: '#f2cf82' }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 900, color: '#fffdf7', lineHeight: 1.3 }}>{label}</p>
                <p style={{ fontSize: 11, color: '#d8cdb8', marginTop: 1, fontWeight: 500 }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
