import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Tag, X, Check, Percent, DollarSign, Zap, BarChart2, RefreshCw, Loader2 } from 'lucide-react';
import { useDashboardCoupons } from '../../lib/useApi';
import { api } from '../../lib/api';
import type { ApiCoupon } from '../../lib/api';
import { useStore } from '../../store/useStore';

const card: React.CSSProperties = {
  background: '#111117',
  borderRadius: 18,
  border: '1px solid rgba(255,255,255,0.06)',
};

const inp: React.CSSProperties = {
  width: '100%', background: '#0d0d0d',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
  padding: '10px 13px', color: '#fff', fontSize: 13,
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};
const lbl: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 700, color: '#999',
  letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6,
};

interface CouponForm {
  code: string; type: 'percent' | 'fixed' | 'frete'; value: number;
  minOrder: number; maxUses: number; expiresAt: string; active: boolean; freeShipping: boolean;
}

const emptyForm: CouponForm = {
  code: '', type: 'percent', value: 10, minOrder: 0, maxUses: 100, expiresAt: '', active: true, freeShipping: false,
};

function fmtExpiry(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR');
}

function toInputDate(iso?: string | null) {
  if (!iso) return '';
  return iso.split('T')[0];
}

export default function Coupons() {
  const { showToast } = useStore();
  const { data: couponsRaw, loading, refetch } = useDashboardCoupons();
  const coupons = couponsRaw ?? [];

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CouponForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (c: ApiCoupon) => {
    setForm({
      code: c.code,
      type: c.type as 'percent' | 'fixed' | 'frete',
      value: c.value,
      minOrder: c.minOrder,
      maxUses: c.maxUses ?? 100,
      expiresAt: toInputDate(c.expiresAt),
      active: c.active,
      freeShipping: c.freeShipping,
    });
    setEditingId(c.id);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const save = async () => {
    if (!form.code.trim()) return;
    setSaving(true);
    try {
      const payload = {
        code: form.code.toUpperCase(),
        type: form.type,
        value: form.type === 'frete' ? 0 : form.value,
        minOrder: form.minOrder,
        maxUses: form.maxUses,
        active: form.active,
        freeShipping: form.freeShipping || form.type === 'frete',
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
      };
      if (editingId) {
        await api.dashboard.updateCoupon(editingId, payload);
      } else {
        await api.dashboard.createCoupon(payload);
      }
      await refetch();
      closeForm();
      showToast(editingId ? 'Cupom atualizado!' : 'Cupom criado!');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Erro ao salvar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Excluir este cupom?')) return;
    setDeletingId(id);
    try {
      await api.dashboard.deleteCoupon(id);
      await refetch();
      showToast('Cupom excluído.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Erro ao excluir', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const toggle = async (c: ApiCoupon) => {
    try {
      await api.dashboard.updateCoupon(c.id, { active: !c.active });
      await refetch();
    } catch { /* silent */ }
  };

  const setF = <K extends keyof CouponForm>(k: K, v: CouponForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const totalUses = coupons.reduce((s, c) => s + c.uses, 0);
  const activeCount = coupons.filter((c) => c.active).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 5 }}>Dashboard</p>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 3 }}>Cupons</h1>
          <p style={{ fontSize: 13, color: '#999' }}>{coupons.length} cupons cadastrados</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={refetch} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#ccc', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          <button onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 12, background: 'linear-gradient(135deg,#d8a84a,#b8842c)', color: '#fff', fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.04em', boxShadow: '0 6px 20px rgba(216,168,74,0.3)' }}>
            <Plus size={15} /> NOVO CUPOM
          </button>
        </div>
      </div>

      <div className="dash-stats-3" style={{ gap: 12 }}>
        {[
          { label: 'Total de Cupons', value: coupons.length, color: '#d8a84a', icon: Tag },
          { label: 'Ativos', value: activeCount, color: '#22C55E', icon: Zap },
          { label: 'Total de Usos', value: totalUses, color: '#b8842c', icon: BarChart2 },
        ].map(({ label, value, color, icon: Icon }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} style={{ ...card, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
            <div style={{ width: 38, height: 38, borderRadius: 11, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon size={17} style={{ color }} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 11, color: '#999', fontWeight: 600, letterSpacing: '0.04em' }}>{label}</div>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: 'center', color: '#666', fontSize: 13 }}>Carregando cupons...</div>
      ) : coupons.length === 0 ? (
        <div style={{ ...card, padding: 60, textAlign: 'center' }}>
          <Tag size={32} style={{ color: '#222', margin: '0 auto 12px' }} />
          <p style={{ color: '#666', fontSize: 13 }}>Nenhum cupom cadastrado</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {coupons.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} style={{ ...card, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16, opacity: c.active ? 1 : 0.5, position: 'relative', overflow: 'hidden', transition: 'opacity 0.3s' }}>
              {c.active && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'linear-gradient(180deg,#d8a84a,#b8842c)', borderRadius: '18px 0 0 18px' }} />}

              <div style={{ width: 46, height: 46, borderRadius: 13, background: c.active ? 'rgba(184,132,44,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${c.active ? 'rgba(184,132,44,0.15)' : 'rgba(255,255,255,0.04)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Tag size={18} style={{ color: c.active ? '#b8842c' : '#333' }} />
              </div>

              <div style={{ flex: '0 0 170px' }}>
                <p style={{ fontWeight: 900, fontSize: 16, color: '#fff', fontFamily: 'monospace', letterSpacing: '0.06em', marginBottom: 3 }}>{c.code}</p>
                <p style={{ fontSize: 12, color: '#999' }}>
                  {c.type === 'percent' ? `${c.value}% de desconto` : c.type === 'frete' ? 'Frete gratis' : `R$ ${c.value.toFixed(2).replace('.', ',')} off`}
                </p>
                {c.freeShipping && c.type !== 'frete' && (
                  <p style={{ fontSize: 10, color: '#22C55E', fontWeight: 700, marginTop: 4 }}>Tambem libera frete gratis</p>
                )}
              </div>

              <div style={{ flex: 1, display: 'flex', gap: 28 }}>
                <div>
                  <p style={{ fontSize: 9, color: '#666', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>Pedido mín.</p>
                  <p style={{ fontSize: 13, color: '#ccc', fontWeight: 700 }}>{c.minOrder > 0 ? `R$ ${c.minOrder.toFixed(2).replace('.', ',')}` : '—'}</p>
                </div>
                <div>
                  <p style={{ fontSize: 9, color: '#666', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>Usos</p>
                  <p style={{ fontSize: 13, color: '#ccc', fontWeight: 700 }}>{c.uses} / {c.maxUses ?? '∞'}</p>
                </div>
                <div>
                  <p style={{ fontSize: 9, color: '#666', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>Validade</p>
                  <p style={{ fontSize: 13, color: '#ccc', fontWeight: 700 }}>{fmtExpiry(c.expiresAt)}</p>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {c.maxUses && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 9, color: '#666', fontWeight: 700 }}>USO</span>
                        <span style={{ fontSize: 9, color: '#555', fontWeight: 700 }}>{Math.round((c.uses / c.maxUses) * 100)}%</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#d8a84a,#b8842c)', width: `${Math.min(100, (c.uses / c.maxUses) * 100)}%`, transition: 'width 0.5s' }} />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => toggle(c)} style={{ padding: '5px 13px', borderRadius: 20, fontSize: 9, fontWeight: 900, border: 'none', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.08em', transition: 'all 0.2s', background: c.active ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', color: c.active ? '#22C55E' : '#444' }}>
                  {c.active ? 'ATIVO' : 'PAUSADO'}
                </button>
                <button onClick={() => openEdit(c)} style={{ width: 34, height: 34, borderRadius: 9, border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#999', transition: 'all 0.2s' }}>
                  <Edit2 size={13} />
                </button>
                <button onClick={() => remove(c.id)} disabled={deletingId === c.id} style={{ width: 34, height: 34, borderRadius: 9, border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#999', transition: 'all 0.2s', opacity: deletingId === c.id ? 0.5 : 1 }}>
                  {deletingId === c.id ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={13} />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeForm} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} style={{ background: '#111117', borderRadius: 22, border: '1px solid rgba(255,255,255,0.09)', padding: 32, width: '100%', maxWidth: 520 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 3 }}>{editingId ? 'Editar Cupom' : 'Novo Cupom'}</h3>
                  <p style={{ fontSize: 12, color: '#999' }}>Preencha os dados do cupom</p>
                </div>
                <button onClick={closeForm} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.09)', background: 'transparent', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={15} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={lbl}>Código do cupom</label>
                  <input style={inp} value={form.code} onChange={(e) => setF('code', e.target.value.toUpperCase())} placeholder="EX: NATAL20" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={lbl}>Tipo de desconto</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {(['percent', 'fixed', 'frete'] as const).map((t) => (
                        <button key={t} onClick={() => setF('type', t)} style={{ flex: 1, padding: '9px', borderRadius: 9, border: `1px solid ${form.type === t ? '#d8a84a' : 'rgba(255,255,255,0.08)'}`, background: form.type === t ? 'rgba(216,168,74,0.1)' : 'transparent', color: form.type === t ? '#d8a84a' : '#555', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'all 0.2s' }}>
                          {t === 'percent' ? <><Percent size={12} /> %</> : t === 'fixed' ? <><DollarSign size={12} /> R$</> : <><Zap size={12} /> Frete</>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={lbl}>{form.type === 'percent' ? 'Desconto (%)' : form.type === 'fixed' ? 'Desconto (R$)' : 'Valor do desconto'}</label>
                    <input type="number" style={inp} value={form.type === 'frete' ? 0 : form.value} onChange={(e) => setF('value', Number(e.target.value))} min={0} max={form.type === 'percent' ? 100 : undefined} disabled={form.type === 'frete'} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={lbl}>Pedido mínimo (R$)</label>
                    <input type="number" style={inp} value={form.minOrder} onChange={(e) => setF('minOrder', Number(e.target.value))} min={0} />
                  </div>
                  <div>
                    <label style={lbl}>Limite de usos</label>
                    <input type="number" style={inp} value={form.maxUses} onChange={(e) => setF('maxUses', Number(e.target.value))} min={1} />
                  </div>
                </div>

                <div>
                  <label style={lbl}>Data de validade</label>
                  <input type="date" style={{ ...inp, colorScheme: 'dark' }} value={form.expiresAt} onChange={(e) => setF('expiresAt', e.target.value)} />
                </div>

                <div style={{ padding: '14px 16px', borderRadius: 10, background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div>
                      <p style={{ fontWeight: 700, color: '#ccc', fontSize: 13 }}>Liberar frete gratis</p>
                      <p style={{ fontSize: 11, color: '#777', marginTop: 2 }}>Quando ativo, o cupom tambem concede frete gratis na entrega.</p>
                    </div>
                    <button onClick={() => setF('freeShipping', !form.freeShipping)} disabled={form.type === 'frete'} style={{ width: 46, height: 26, borderRadius: 99, border: 'none', cursor: form.type === 'frete' ? 'default' : 'pointer', padding: 3, flexShrink: 0, background: form.freeShipping || form.type === 'frete' ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'rgba(255,255,255,0.08)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: form.freeShipping || form.type === 'frete' ? 'flex-end' : 'flex-start', opacity: form.type === 'frete' ? 0.8 : 1 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'all 0.2s' }} />
                    </button>
                  </div>
                  {form.type === 'frete' && (
                    <p style={{ fontSize: 11, color: '#22C55E', marginTop: 10, fontWeight: 700 }}>Cupom de frete ja libera entrega gratis automaticamente.</p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button onClick={closeForm} style={{ flex: 1, padding: '13px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#666', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Cancelar
                  </button>
                  <button onClick={save} disabled={saving} style={{ flex: 2, padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#d8a84a,#b8842c)', color: '#fff', fontWeight: 900, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, letterSpacing: '0.04em', boxShadow: '0 4px 16px rgba(216,168,74,0.3)', opacity: saving ? 0.7 : 1 }}>
                    {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={15} />}
                    {saving ? 'SALVANDO...' : 'SALVAR CUPOM'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
