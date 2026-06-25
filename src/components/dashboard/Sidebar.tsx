import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Users, Package, BarChart3,
  Settings, Tag, ChevronLeft, Store, CreditCard, Megaphone
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const nav = [
  { id: 'overview',   label: 'Visão Geral',   icon: LayoutDashboard, section: '' },
  { id: 'orders',     label: 'Pedidos',        icon: ShoppingBag,     section: '' },
  { id: 'products',   label: 'Produtos',       icon: Package,         section: '' },
  { id: 'customers',  label: 'Clientes (CRM)', icon: Users,           section: '' },
  { id: 'finance',    label: 'Financeiro',     icon: BarChart3,       section: '' },
  { id: 'payments',   label: 'Pagamentos',     icon: CreditCard,      section: 'Financeiro' },
  { id: 'marketing',  label: 'Marketing',      icon: Megaphone,       section: 'Marketing' },
  { id: 'coupons',    label: 'Cupons',         icon: Tag,             section: 'Marketing' },
  { id: 'settings',   label: 'Configurações',  icon: Settings,        section: 'Loja' },
];

const groups = [
  { label: '', ids: ['overview', 'orders', 'products', 'customers'] },
  { label: 'Financeiro', ids: ['finance', 'payments'] },
  { label: 'Marketing',  ids: ['marketing', 'coupons'] },
  { label: 'Loja',       ids: ['settings'] },
];

interface Props { collapsed: boolean; onToggle: () => void; }

export default function Sidebar({ collapsed, onToggle }: Props) {
  const navigate = useNavigate();
  const { dashboardSection, setDashboardSection, setCurrentView } = useStore();

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 232 }}
      transition={{ duration: 0.28, ease: 'easeInOut' }}
      style={{
        height: '100vh',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#0a0a0d',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
      }}>

      {/* ── Logo ── */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', minHeight: 68, flexShrink: 0, overflow: 'hidden' }}>
        {collapsed ? (
          <div style={{ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#b8842c,#f0cf82)', color: '#111', fontSize: 11, fontWeight: 900, letterSpacing: '0.2em' }}>ZY</div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <div style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#b8842c,#f0cf82)', color: '#111', fontSize: 12, fontWeight: 900, letterSpacing: '0.2em' }}>ZY</div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ color: '#f5e7c3', fontSize: 18, fontWeight: 900, letterSpacing: '0.18em' }}>ZAYEH</span>
              <span style={{ color: '#8f7a4b', fontSize: 8, letterSpacing: '0.22em', marginTop: 4 }}>DASHBOARD</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {groups.map(({ label, ids }) => (
          <div key={ids[0]} style={{ marginBottom: 4 }}>
            {/* Group label */}
            {label && !collapsed && (
              <p style={{ fontSize: 9.5, fontWeight: 700, color: '#666', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '10px 8px 4px' }}>{label}</p>
            )}
            {!collapsed && label && (
              <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', marginBottom: 4 }} />
            )}

            {ids.map(id => {
              const item = nav.find(n => n.id === id)!;
              const Icon = item.icon;
              const isActive = dashboardSection === id;
              return (
                <motion.div key={id}
                  whileHover={{ x: collapsed ? 0 : 3 }}
                  onClick={() => setDashboardSection(id)}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: collapsed ? '10px' : '10px 12px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    marginBottom: 2,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    background: isActive ? 'rgba(216,168,74,0.1)' : 'transparent',
                    borderLeft: `3px solid ${isActive ? '#d8a84a' : 'transparent'}`,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                  <Icon size={17} style={{ color: isActive ? '#d8a84a' : '#444', flexShrink: 0, transition: 'color 0.15s' }} />
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? '#fff' : '#555', whiteSpace: 'nowrap', transition: 'color 0.15s' }}>
                      {item.label}
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <motion.div
          whileHover={{ x: collapsed ? 0 : 3 }}
          onClick={() => { setCurrentView('store'); navigate('/'); }}
          title={collapsed ? 'Ver Loja' : undefined}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '10px' : '10px 12px', borderRadius: 10, cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start', marginBottom: 4 }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <Store size={17} style={{ color: '#999', flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: 13, fontWeight: 500, color: '#555' }}>Ver Loja</span>}
        </motion.div>

        <button onClick={onToggle}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', color: '#666', transition: 'all 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#888'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = '#333'; }}>
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.28 }}>
            <ChevronLeft size={15} />
          </motion.div>
        </button>

        {!collapsed && (
          <p style={{ fontSize: 9, color: '#444', textAlign: 'center', marginTop: 12, letterSpacing: '0.03em', lineHeight: 1.5 }}>
            Desenvolvido por<br /><span style={{ color: '#d8a84a', fontWeight: 700 }}>NEXUS TECNOLOGIA LTDA</span>
          </p>
        )}
      </div>
    </motion.aside>
  );
}
