import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { TrendingUp, ShoppingBag, Users, CreditCard, RefreshCw } from 'lucide-react';
import { useDashboardFinance } from '../../lib/useApi';

type Period = 'mensal' | 'trimestral' | 'anual';

const fmtCompact = (value: number) =>
  value >= 1000
    ? `R$ ${(value / 1000).toFixed(1)}k`
    : `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const fmtCurrency = (value: number) =>
  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const methodLabel: Record<string, string> = {
  cartao: 'Cartão',
  credito: 'Cartão',
  'cartão': 'Cartão',
  pix: 'PIX',
  debito: 'Débito',
  'débito': 'Débito',
  boleto: 'Boleto',
};

interface ChartTipPayload {
  color: string;
  name: string;
  value: number | string;
}

interface ChartTipProps {
  active?: boolean;
  payload?: ChartTipPayload[];
  label?: string;
}

const ChartTip = ({ active, payload, label }: ChartTipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px', minWidth: 160 }}>
      <p style={{ fontSize: 11, color: '#555', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: entry.color, fontWeight: 600 }}>{entry.name}</span>
          <span style={{ fontSize: 12, color: '#fff', fontWeight: 800 }}>
            {entry.name === 'Pedidos' ? entry.value : fmtCurrency(Number(entry.value))}
          </span>
        </div>
      ))}
    </div>
  );
};

const card: React.CSSProperties = {
  background: '#111117',
  borderRadius: 18,
  border: '1px solid rgba(255,255,255,0.06)',
  padding: '22px 24px',
  position: 'relative',
  overflow: 'hidden',
};

export default function Finance() {
  const [period, setPeriod] = useState<Period>('mensal');
  const { data, loading, refetch } = useDashboardFinance(period);

  const rows = data?.chartData ?? [];
  const paymentMethods = data?.paymentMethods ?? [];
  const totals = data?.totals ?? { receita: 0, pedidos: 0, ticketMedio: 0, clientes: 0 };

  const kpis = [
    { label: 'Receita Real', value: fmtCompact(totals.receita), icon: TrendingUp, color: '#22C55E', accent: 'rgba(34,197,94,0.1)' },
    { label: 'Pedidos', value: String(totals.pedidos), icon: ShoppingBag, color: '#a855f7', accent: 'rgba(168,85,247,0.1)' },
    { label: 'Clientes Ativos', value: String(totals.clientes), icon: Users, color: '#FF2DA0', accent: 'rgba(255,45,160,0.1)' },
    { label: 'Ticket Médio', value: fmtCompact(totals.ticketMedio), icon: CreditCard, color: '#f59e0b', accent: 'rgba(245,158,11,0.1)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 5 }}>Dashboard</p>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 3 }}>Financeiro</h1>
          <p style={{ fontSize: 13, color: '#999' }}>Somente métricas reais de pedidos e faturamento</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={refetch} style={{ width: 40, height: 40, borderRadius: 11, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          <div style={{ display: 'flex', gap: 4, background: '#0d0d0d', borderRadius: 10, padding: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
            {(['mensal', 'trimestral', 'anual'] as Period[]).map((item) => (
              <button
                key={item}
                onClick={() => setPeriod(item)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  transition: 'all 0.2s',
                  background: period === item ? 'linear-gradient(135deg,#a855f7,#FF2DA0)' : 'transparent',
                  color: period === item ? '#fff' : '#444',
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-stats-grid" style={{ gap: 14 }}>
        {kpis.map(({ label, value, icon: Icon, color, accent }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            style={card}
          >
            <div style={{ position: 'absolute', top: -24, right: -24, width: 80, height: 80, borderRadius: '50%', background: `${color}20`, filter: 'blur(24px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
            <div style={{ width: 38, height: 38, borderRadius: 11, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon size={17} style={{ color }} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: loading ? '#333' : '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>
              {loading ? '...' : value}
            </div>
            <div style={{ fontSize: 11, color: '#999', fontWeight: 500 }}>{label}</div>
          </motion.div>
        ))}
      </div>

      <div className="dash-two-col" style={{ gap: 16 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} style={card}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 3 }}>Faturamento por período</h3>
            <p style={{ fontSize: 11, color: '#999' }}>Receita real baseada em pedidos não cancelados</p>
          </div>
          {loading ? (
            <div style={{ height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 13 }}>Carregando dados...</div>
          ) : rows.length === 0 ? (
            <div style={{ height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 13 }}>Sem vendas no período</div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={rows} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: '#444', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#444', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} width={32} />
                <Tooltip content={<ChartTip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="receita" fill="#a855f7" radius={[5, 5, 0, 0]} name="Receita" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }} style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 3 }}>Métodos de pagamento</h3>
          <p style={{ fontSize: 11, color: '#999', marginBottom: 24 }}>Distribuição real dos pedidos no período</p>
          {loading ? (
            <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 13 }}>Carregando...</div>
          ) : paymentMethods.length === 0 ? (
            <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 13 }}>Sem pagamentos no período</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {paymentMethods.map((method, index) => (
                <motion.div key={`${method.method}-${index}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.07 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: method.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: '#ccc', fontWeight: 600, textTransform: 'capitalize' }}>
                        {methodLabel[method.method.toLowerCase()] ?? method.method}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 12, color: '#999' }}>{fmtCurrency(method.total)}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: method.color, minWidth: 32, textAlign: 'right' }}>{method.pct}%</span>
                    </div>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 99, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${method.pct}%` }}
                      transition={{ delay: 0.55 + index * 0.07, duration: 0.7, ease: 'easeOut' }}
                      style={{ height: '100%', borderRadius: 99, background: method.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }} style={card}>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 3 }}>Evolução de pedidos</h3>
          <p style={{ fontSize: 11, color: '#999' }}>Quantidade real de pedidos por período</p>
        </div>
        {loading ? (
          <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 13 }}>Carregando...</div>
        ) : rows.length === 0 ? (
          <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 13 }}>Sem pedidos no período</div>
        ) : (
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={rows} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gPedidos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: '#444', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#444', fontSize: 11 }} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
              <Tooltip content={<ChartTip />} />
              <Area
                type="monotone"
                dataKey="pedidos"
                stroke="#22C55E"
                strokeWidth={2.5}
                fill="url(#gPedidos)"
                name="Pedidos"
                dot={{ r: 4, fill: '#22C55E', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#22C55E', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  );
}
