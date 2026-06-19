import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Crown, UserCheck, Mail, Phone, MapPin, TrendingUp, RefreshCw, X, Users } from 'lucide-react';
import { useDashboardCustomers } from '../../lib/useApi';
import type { ApiCustomer } from '../../lib/api';

const statusConfig: Record<string, { label: string; color: string }> = {
  vip:    { label: 'VIP',     color: '#FFB800' },
  ativo:  { label: 'Ativo',   color: '#22c55e' },
  inativo:{ label: 'Inativo', color: '#ef4444' },
};

const card: React.CSSProperties = {
  background: '#111117',
  borderRadius: 18,
  border: '1px solid rgba(255,255,255,0.06)',
};

export default function Customers() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('todos');
  const [selected, setSelected] = useState<ApiCustomer | null>(null);

  const { data: customersRaw, loading, refetch } = useDashboardCustomers(search || undefined);
  const customers = customersRaw ?? [];

  const filtered = filter === 'todos' ? customers : customers.filter(c => c.status === filter);
  const vipCount    = customers.filter(c => c.status === 'vip').length;
  const activeCount = customers.filter(c => c.status === 'ativo').length;
  const avgSpend    = customers.length ? customers.reduce((a, c) => a + c.totalSpent, 0) / customers.length : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 5 }}>Dashboard</p>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 3 }}>Clientes</h1>
          <p style={{ fontSize: 13, color: '#999' }}>{customers.length} clientes cadastrados</p>
        </div>
        <button onClick={refetch} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#ccc', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Atualizar
        </button>
      </div>

      {/* KPI cards */}
      <div className="dash-stats-4" style={{ gap: 12 }}>
        {[
          { label: 'Total',        value: customers.length, color: '#a855f7', icon: Users      },
          { label: 'VIP',          value: vipCount,         color: '#FFB800', icon: Crown      },
          { label: 'Ativos',       value: activeCount,      color: '#22c55e', icon: UserCheck  },
          { label: 'Ticket Médio', value: `R$ ${avgSpend.toFixed(0)}`, color: '#FF2DA0', icon: TrendingUp },
        ].map(({ label, value, color, icon: Icon }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ ...card, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={17} style={{ color }} />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 11, color: '#999', fontWeight: 600, letterSpacing: '0.04em' }}>{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou e-mail..."
            style={{ width: '100%', background: '#111117', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 14px 12px 40px', color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => (e.target.style.borderColor = 'rgba(168,85,247,0.35)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['todos', 'vip', 'ativo', 'inativo'].map(s => {
            const active = filter === s;
            const col = s === 'todos' ? '#a855f7' : (statusConfig[s]?.color ?? '#a855f7');
            return (
              <button key={s} onClick={() => setFilter(s)}
                style={{ padding: '8px 16px', borderRadius: 20, border: `1px solid ${active ? col : 'rgba(255,255,255,0.07)'}`, background: active ? `${col}18` : 'transparent', color: active ? col : '#555', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                {s === 'todos' ? 'Todos' : statusConfig[s]?.label ?? s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ ...card, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#666', fontSize: 13 }}>Carregando clientes...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <Users size={32} style={{ color: '#222', margin: '0 auto 12px' }} />
            <p style={{ color: '#666', fontSize: 13 }}>Nenhum cliente encontrado</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Cliente', 'Contato', 'Cidade', 'Pedidos', 'Total Gasto', 'Status', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '14px 18px', fontSize: 10, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const s = statusConfig[c.status] ?? statusConfig['ativo'];
                  return (
                    <motion.tr key={c.id}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      onClick={() => setSelected(c)}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                          {c.avatar
                            ? <img src={c.avatar} alt={c.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.07)', flexShrink: 0 }} />
                            : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(168,85,247,0.2),rgba(255,45,160,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14, fontWeight: 900, color: '#a855f7' }}>{c.name[0]}</div>
                          }
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: '#ccc', marginBottom: 2 }}>{c.name}</p>
                            <p style={{ fontSize: 11, color: '#666' }}>{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        {c.phone && <p style={{ fontSize: 12, color: '#999', display: 'flex', alignItems: 'center', gap: 5 }}><Phone size={10} style={{ color: '#666' }} />{c.phone}</p>}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        {c.city && <p style={{ fontSize: 12, color: '#999', display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={10} style={{ color: '#666' }} />{c.city}</p>}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 14, color: '#ccc', fontWeight: 800 }}>{c.totalOrders}</td>
                      <td style={{ padding: '14px 18px', fontSize: 14, fontWeight: 900, color: '#fff' }}>R$ {c.totalSpent.toFixed(2).replace('.', ',')}</td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontSize: 9, fontWeight: 900, color: s.color, background: `${s.color}15`, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.08em' }}>{s.label.toUpperCase()}</span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <button style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                          onClick={e => { e.stopPropagation(); window.open(`mailto:${c.email}`); }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#a855f7'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,85,247,0.3)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#444'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                          <Mail size={13} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#111117', borderRadius: 22, border: '1px solid rgba(255,255,255,0.08)', padding: 28, maxWidth: 420, width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  {selected.avatar
                    ? <img src={selected.avatar} alt={selected.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)', flexShrink: 0 }} />
                    : <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(168,85,247,0.2),rgba(255,45,160,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20, fontWeight: 900, color: '#a855f7' }}>{selected.name[0]}</div>
                  }
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 900, color: '#fff', marginBottom: 6 }}>{selected.name}</h3>
                    <span style={{ fontSize: 9, fontWeight: 900, color: (statusConfig[selected.status] ?? statusConfig['ativo']).color, background: `${(statusConfig[selected.status] ?? statusConfig['ativo']).color}15`, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.08em' }}>
                      {(statusConfig[selected.status] ?? statusConfig['ativo']).label.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              </div>

              {[
                { icon: Mail,  label: 'E-mail',   value: selected.email },
                { icon: Phone, label: 'Telefone', value: selected.phone ?? '—' },
                { icon: MapPin,label: 'Cidade',   value: selected.city ?? '—' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} style={{ color: '#999' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: 13, color: '#ccc' }}>{value}</p>
                  </div>
                </div>
              ))}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '20px 0' }}>
                <div style={{ background: '#0d0d0d', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(168,85,247,0.1)' }}>
                  <p style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Total Gasto</p>
                  <p style={{ fontSize: 22, fontWeight: 900, color: '#a855f7' }}>R$ {selected.totalSpent.toFixed(2).replace('.', ',')}</p>
                </div>
                <div style={{ background: '#0d0d0d', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Pedidos</p>
                  <p style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{selected.totalOrders}</p>
                </div>
              </div>

              <button onClick={() => setSelected(null)}
                style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: '#555', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
