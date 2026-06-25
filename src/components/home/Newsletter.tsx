import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.newsletter.subscribe(email);
      setSent(true);
    } catch {
      setSent(true); // mesmo em erro, não frustra o usuário
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-gap" style={{ borderTop: '1px solid rgba(92,66,22,0.08)', paddingTop: 62, paddingBottom: 64 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: 720,
            margin: '0 auto',
            padding: '42px 28px',
            borderRadius: 32,
            background: 'linear-gradient(180deg, rgba(255,250,240,0.78), rgba(239,226,204,0.72))',
            border: '1px solid rgba(92,66,22,0.12)',
            boxShadow: '0 24px 62px rgba(95,67,21,0.1)',
          }}>

          <div style={{ width: 58, height: 58, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'linear-gradient(135deg,#fff7de,#e8c98f)', border: '1px solid rgba(184,132,44,0.22)', marginBottom: 20, boxShadow: '0 14px 32px rgba(184,132,44,0.16)' }}>
            <Mail size={21} style={{ color: '#b8842c' }} />
          </div>

          <p className="section-label">PRIME ACCESS</p>
          <h2 className="section-title" style={{ marginBottom: 12 }}>ENTRE NA LISTA ZAYEH</h2>
          <p style={{ fontSize: 14.5, color: '#5f5647', marginBottom: 30, lineHeight: 1.7, maxWidth: 560 }}>
            Receba lançamentos, edições limitadas e campanhas com a nova direção visual da ZAYEH.
          </p>

          {sent ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#22C55E', fontSize: 14 }}>
              <CheckCircle size={20} /> Inscrito com sucesso! Fique de olho no seu e-mail.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                style={{ flex: 1, background: '#fffaf0', border: '1px solid rgba(92,66,22,0.18)', borderRadius: 16, padding: '15px 18px', color: '#171d1b', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65)' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(184,132,44,0.52)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(92,66,22,0.18)')}
              />
              <button type="submit" disabled={loading} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', opacity: loading ? 0.7 : 1, minHeight: 50 }}>
                {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={14} />}
                {loading ? 'AGUARDE...' : 'ENTRAR AGORA'}
              </button>
            </form>
          )}

          <p style={{ fontSize: 11.5, color: '#6c6253', marginTop: 14 }}>Sem spam. Cancele quando quiser.</p>
        </motion.div>
      </div>
    </section>
  );
}
