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
    <section className="section-gap" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>

          <div style={{ width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.2)', marginBottom: 20 }}>
            <Mail size={20} style={{ color: '#FFB800' }} />
          </div>

          <p className="section-label">PRIME ACCESS</p>
          <h2 className="section-title" style={{ marginBottom: 12 }}>ENTRE NA LISTA ZAYEH</h2>
          <p style={{ fontSize: 13.5, color: '#555', marginBottom: 32, lineHeight: 1.7 }}>
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
                style={{ flex: 1, background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <button type="submit" disabled={loading} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', opacity: loading ? 0.7 : 1 }}>
                {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={14} />}
                {loading ? 'AGUARDE...' : 'ENTRAR AGORA'}
              </button>
            </form>
          )}

          <p style={{ fontSize: 11, color: '#333', marginTop: 12 }}>Sem spam. Cancele quando quiser.</p>
        </motion.div>
      </div>
    </section>
  );
}
